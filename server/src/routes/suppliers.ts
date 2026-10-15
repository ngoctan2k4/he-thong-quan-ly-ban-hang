import { Router } from 'express';
import { z } from 'zod';
import { asId, HttpError, normalize, ok, optionalText, pageParams, paginate } from '../http.js';
import { nextId, store } from '../store.js';

const router = Router();
const supplierSchema = z.object({
  code: z.string().trim().min(1, 'Mã nhà cung cấp là bắt buộc.').max(32), name: z.string().trim().min(1, 'Tên nhà cung cấp là bắt buộc.').max(200),
  taxCode: z.string().max(32).optional(), phone: z.string().max(32).optional(), email: z.email().optional().or(z.literal('')), address: z.string().max(500).optional(),
  avgLeadTimeDays: z.number().int().nonnegative(), maxLeadTimeDays: z.number().int().nonnegative(), isActive: z.boolean(),
}).refine((value) => value.maxLeadTimeDays >= value.avgLeadTimeDays, { message: 'Lead time tối đa không được nhỏ hơn lead time trung bình.' });
const relationSchema = z.object({ productId: z.number().int().positive(), lastPurchasePrice: z.number().nonnegative(), leadTimeDays: z.number().int().nonnegative(), isDefaultSupplier: z.boolean().default(false) });

function clean<T extends z.infer<typeof supplierSchema>>(values: T) {
  return { ...values, code: values.code.toLocaleUpperCase('vi-VN'), taxCode: optionalText(values.taxCode), phone: optionalText(values.phone), email: optionalText(values.email), address: optionalText(values.address) };
}
function relationView(relation: (typeof store.supplierProducts)[number]) {
  const product = store.products.find((item) => item.id === relation.productId); if (!product) throw new HttpError(409, 'Sản phẩm liên kết không còn tồn tại.');
  return { ...relation, productCode: product.code, productName: product.name, isDefaultSupplier: product.defaultSupplierId === relation.supplierId };
}
function ensureSupplierCode(code: string, ignoredId?: number) { if (store.suppliers.some((item) => item.id !== ignoredId && normalize(item.code) === normalize(code))) throw new HttpError(409, 'Mã nhà cung cấp đã tồn tại.'); }

router.get('/', (request, response) => {
  const { page, size } = pageParams(request); const keyword = normalize(request.query.keyword); const status = String(request.query.status ?? 'ALL');
  const filtered = store.suppliers.filter((item) => (!keyword || [item.code, item.name, item.taxCode, item.phone].some((value) => normalize(value).includes(keyword))) && (status === 'ALL' || item.isActive === (status === 'ACTIVE')));
  ok(response, paginate(filtered, page, size));
});
router.get('/products', (_request, response) => ok(response, store.products.map((item) => ({ id: item.id, code: item.code, name: item.name, defaultSupplierId: item.defaultSupplierId }))));
router.get('/:id', (request, response) => {
  const id = asId(String(request.params.id)); const supplier = store.suppliers.find((item) => item.id === id); if (!supplier) throw new HttpError(404, 'Không tìm thấy nhà cung cấp.');
  ok(response, { ...supplier, products: store.supplierProducts.filter((item) => item.supplierId === id).map(relationView) });
});
router.post('/', (request, response) => {
  const values = clean(supplierSchema.parse(request.body)); ensureSupplierCode(values.code); const now = new Date().toISOString(); const record = { id: nextId(store.suppliers), ...values, createdAt: now, updatedAt: now }; store.suppliers.unshift(record); ok(response, record, 201);
});
router.put('/:id', (request, response) => {
  const id = asId(String(request.params.id)); const values = clean(supplierSchema.parse(request.body)); const index = store.suppliers.findIndex((item) => item.id === id); if (index < 0) throw new HttpError(404, 'Không tìm thấy nhà cung cấp.'); ensureSupplierCode(values.code, id);
  const record = { ...store.suppliers[index]!, ...values, updatedAt: new Date().toISOString() }; store.suppliers[index] = record; ok(response, record);
});
router.patch('/:id/status', (request, response) => {
  const id = asId(String(request.params.id)); const { isActive } = z.object({ isActive: z.boolean() }).parse(request.body); const record = store.suppliers.find((item) => item.id === id); if (!record) throw new HttpError(404, 'Không tìm thấy nhà cung cấp.'); record.isActive = isActive; record.updatedAt = new Date().toISOString(); ok(response, record);
});
router.post('/:id/products', (request, response) => {
  const supplierId = asId(String(request.params.id)); const values = relationSchema.parse(request.body); if (!store.suppliers.some((item) => item.id === supplierId)) throw new HttpError(404, 'Không tìm thấy nhà cung cấp.');
  const product = store.products.find((item) => item.id === values.productId); if (!product) throw new HttpError(400, 'Sản phẩm không tồn tại.');
  if (store.supplierProducts.some((item) => item.supplierId === supplierId && item.productId === values.productId)) throw new HttpError(409, 'Sản phẩm đã liên kết với nhà cung cấp này.');
  const { isDefaultSupplier, ...relationValues } = values; const relation = { id: nextId(store.supplierProducts), supplierId, ...relationValues }; store.supplierProducts.push(relation); if (isDefaultSupplier) product.defaultSupplierId = supplierId; ok(response, relationView(relation), 201);
});
router.put('/:supplierId/products/:relationId', (request, response) => {
  const supplierId = asId(String(request.params.supplierId)); const relationId = asId(String(request.params.relationId)); const values = relationSchema.parse(request.body); const index = store.supplierProducts.findIndex((item) => item.id === relationId && item.supplierId === supplierId); if (index < 0) throw new HttpError(404, 'Không tìm thấy liên kết sản phẩm.');
  const current = store.supplierProducts[index]!; if (values.productId !== current.productId) throw new HttpError(400, 'Không thể đổi sản phẩm của liên kết hiện có.'); const { isDefaultSupplier, ...relationValues } = values; const relation = { ...current, ...relationValues }; store.supplierProducts[index] = relation;
  const product = store.products.find((item) => item.id === relation.productId)!; if (isDefaultSupplier) product.defaultSupplierId = supplierId; else if (product.defaultSupplierId === supplierId) product.defaultSupplierId = undefined; ok(response, relationView(relation));
});
router.delete('/:supplierId/products/:relationId', (request, response) => {
  const supplierId = asId(String(request.params.supplierId)); const relationId = asId(String(request.params.relationId)); const index = store.supplierProducts.findIndex((item) => item.id === relationId && item.supplierId === supplierId); if (index < 0) throw new HttpError(404, 'Không tìm thấy liên kết sản phẩm.');
  const relation = store.supplierProducts[index]!; const product = store.products.find((item) => item.id === relation.productId); if (product?.defaultSupplierId === supplierId) product.defaultSupplierId = undefined; store.supplierProducts.splice(index, 1); ok(response, null);
});

export default router;
