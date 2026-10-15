import { Router } from 'express';
import { z } from 'zod';
import { asId, HttpError, normalize, ok, optionalText, pageParams, paginate } from '../http.js';
import { nextId, store } from '../store.js';

const router = Router();
const priceListSchema = z.object({
  code: z.string().trim().min(1, 'Mã bảng giá là bắt buộc.').max(32),
  name: z.string().trim().min(1, 'Tên bảng giá là bắt buộc.').max(160),
  customerType: z.enum(['RETAIL', 'WHOLESALE', 'VIP']), validFrom: z.iso.date(), validTo: z.iso.date().optional(), isActive: z.boolean(),
}).refine((value) => !value.validTo || value.validTo >= value.validFrom, { message: 'Ngày hết hiệu lực không được trước ngày bắt đầu.' });
const tierSchema = z.object({ productId: z.number().int().positive(), minQty: z.number().int().positive(), maxQty: z.number().int().positive().optional(), unitPrice: z.number().nonnegative() })
  .refine((value) => value.maxQty === undefined || value.maxQty >= value.minQty, { message: 'Số lượng đến không được nhỏ hơn số lượng từ.' });

function effectiveness(item: (typeof store.priceLists)[number]) {
  if (!item.isActive) return 'DISABLED';
  const today = new Date().toISOString().slice(0, 10);
  if (item.validFrom > today) return 'UPCOMING';
  if (item.validTo && item.validTo < today) return 'EXPIRED';
  return 'ACTIVE';
}
function tierView(item: (typeof store.priceTiers)[number]) {
  const product = store.products.find((record) => record.id === item.productId);
  return { ...item, productCode: product?.code ?? `#${item.productId}`, productName: product?.name ?? 'Sản phẩm không còn tồn tại', productIsActive: product?.isActive ?? false };
}
function validateTier(priceListId: number, values: z.infer<typeof tierSchema>, ignoredId?: number) {
  if (!store.priceLists.some((item) => item.id === priceListId)) throw new HttpError(404, 'Bảng giá không tồn tại.');
  if (!store.products.some((item) => item.id === values.productId)) throw new HttpError(400, 'Sản phẩm không tồn tại.');
  const nextMax = values.maxQty ?? Number.POSITIVE_INFINITY;
  const overlap = store.priceTiers.some((item) => item.id !== ignoredId && item.priceListId === priceListId && item.productId === values.productId && values.minQty <= (item.maxQty ?? Number.POSITIVE_INFINITY) && item.minQty <= nextMax);
  if (overlap) throw new HttpError(409, 'Khoảng số lượng bị chồng lấn với bậc giá hiện có.');
}

router.get('/', (request, response) => {
  const { page, size } = pageParams(request); const keyword = normalize(request.query.keyword); const customerType = String(request.query.customerType ?? ''); const effective = String(request.query.effectiveness ?? 'ALL');
  const filtered = store.priceLists.filter((item) => (!keyword || [item.code, item.name].some((value) => normalize(value).includes(keyword))) && (!customerType || item.customerType === customerType) && (effective === 'ALL' || effectiveness(item) === effective));
  ok(response, paginate(filtered.map((item) => ({ ...item, effectiveness: effectiveness(item), productCount: new Set(store.priceTiers.filter((tier) => tier.priceListId === item.id).map((tier) => tier.productId)).size })), page, size));
});
router.get('/products', (_request, response) => ok(response, store.products.map((item) => ({ value: item.id, label: `${item.code} - ${item.name}`, disabled: !item.isActive }))));
router.get('/:id', (request, response) => {
  const id = asId(String(request.params.id)); const item = store.priceLists.find((record) => record.id === id); if (!item) throw new HttpError(404, 'Không tìm thấy bảng giá.');
  ok(response, { ...item, tiers: store.priceTiers.filter((tier) => tier.priceListId === id).map(tierView).sort((a, b) => a.productName.localeCompare(b.productName, 'vi') || a.minQty - b.minQty) });
});
router.post('/', (request, response) => {
  const values = priceListSchema.parse(request.body); if (store.priceLists.some((item) => normalize(item.code) === normalize(values.code))) throw new HttpError(409, 'Mã bảng giá đã tồn tại.');
  const record = { id: nextId(store.priceLists), ...values, validTo: optionalText(values.validTo), createdAt: new Date().toISOString() }; store.priceLists.unshift(record); ok(response, record, 201);
});
router.put('/:id', (request, response) => {
  const id = asId(String(request.params.id)); const values = priceListSchema.parse(request.body); const index = store.priceLists.findIndex((item) => item.id === id); if (index < 0) throw new HttpError(404, 'Không tìm thấy bảng giá.');
  if (store.priceLists.some((item) => item.id !== id && normalize(item.code) === normalize(values.code))) throw new HttpError(409, 'Mã bảng giá đã tồn tại.');
  const record = { ...store.priceLists[index]!, ...values, validTo: optionalText(values.validTo) }; store.priceLists[index] = record; ok(response, record);
});
router.patch('/:id/status', (request, response) => {
  const id = asId(String(request.params.id)); const { isActive } = z.object({ isActive: z.boolean() }).parse(request.body); const record = store.priceLists.find((item) => item.id === id); if (!record) throw new HttpError(404, 'Không tìm thấy bảng giá.'); record.isActive = isActive; ok(response, record);
});
router.post('/:id/tiers', (request, response) => {
  const priceListId = asId(String(request.params.id)); const values = tierSchema.parse(request.body); validateTier(priceListId, values);
  const tier = { id: nextId(store.priceTiers), priceListId, ...values }; store.priceTiers.push(tier); ok(response, { tier }, 201);
});
router.put('/tiers/:id', (request, response) => {
  const id = asId(String(request.params.id)); const values = tierSchema.parse(request.body); const index = store.priceTiers.findIndex((item) => item.id === id); if (index < 0) throw new HttpError(404, 'Không tìm thấy bậc giá.');
  const current = store.priceTiers[index]!; validateTier(current.priceListId, values, id); const tier = { ...current, ...values }; store.priceTiers[index] = tier; ok(response, { tier });
});
router.delete('/tiers/:id', (request, response) => {
  const id = asId(String(request.params.id)); const index = store.priceTiers.findIndex((item) => item.id === id); if (index < 0) throw new HttpError(404, 'Không tìm thấy bậc giá.'); store.priceTiers.splice(index, 1); ok(response, null);
});

export default router;
