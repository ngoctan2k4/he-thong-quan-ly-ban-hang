import { Router } from 'express';
import { z } from 'zod';
import { asId, HttpError, normalize, ok, optionalText, pageParams, paginate } from '../http.js';
import { nextId, store } from '../store.js';

const router = Router();
const productSchema = z.object({
  code: z.string().trim().min(1, 'Mã hàng là bắt buộc.').max(32),
  sku: z.string().trim().min(1, 'SKU là bắt buộc.').max(50),
  barcode: z.string().max(64).optional(), name: z.string().trim().min(1, 'Tên sản phẩm là bắt buộc.').max(200),
  categoryId: z.number().int().positive(), brand: z.string().max(100).optional(), baseUnitId: z.number().int().positive(),
  retailPrice: z.number().nonnegative(), wholesalePrice: z.number().nonnegative(), moq: z.number().int().positive(),
  minStock: z.number().int().nonnegative(), maxStock: z.number().int().nonnegative().optional(),
  safetyStock: z.number().int().nonnegative(), reorderPoint: z.number().int().nonnegative(),
  status: z.enum(['ACTIVE', 'DISCONTINUED', 'HIDDEN']), isActive: z.boolean(),
}).refine((value) => value.maxStock === undefined || value.maxStock >= value.minStock, { message: 'Tồn tối đa không được nhỏ hơn tồn tối thiểu.' });

function productView(product: (typeof store.products)[number]) {
  return { ...product, categoryName: store.categories.find((item) => item.id === product.categoryId)?.name ?? '—', baseUnitName: store.units.find((item) => item.id === product.baseUnitId)?.name ?? '—' };
}
function validateReferences(categoryId: number, baseUnitId: number) {
  if (!store.categories.some((item) => item.id === categoryId)) throw new HttpError(400, 'Nhóm hàng không hợp lệ.');
  if (!store.units.some((item) => item.id === baseUnitId)) throw new HttpError(400, 'Đơn vị cơ sở không hợp lệ.');
}
function ensureUnique(values: z.infer<typeof productSchema>, ignoredId?: number) {
  const duplicate = store.products.find((item) => item.id !== ignoredId && (normalize(item.code) === normalize(values.code) || normalize(item.sku) === normalize(values.sku) || Boolean(values.barcode && item.barcode && normalize(item.barcode) === normalize(values.barcode))));
  if (duplicate) throw new HttpError(409, 'Mã hàng, SKU hoặc barcode đã tồn tại.');
}

router.get('/', (request, response) => {
  const { page, size } = pageParams(request); const keyword = normalize(request.query.keyword);
  const categoryId = Number(request.query.categoryId) || undefined; const brand = String(request.query.brand ?? ''); const status = String(request.query.status ?? 'ALL');
  const filtered = store.products.filter((item) => (!keyword || [item.code, item.sku, item.barcode, item.name].some((value) => normalize(value).includes(keyword))) && (!categoryId || item.categoryId === categoryId) && (!brand || item.brand === brand) && (status === 'ALL' || item.status === status));
  ok(response, paginate(filtered.map(productView), page, size));
});
router.get('/references', (_request, response) => ok(response, {
  categories: store.categories.map((item) => ({ value: item.id, label: item.name, disabled: !item.isActive })),
  units: store.units.map((item) => ({ value: item.id, label: item.name, disabled: !item.isActive })),
  brands: [...new Set(store.products.map((item) => item.brand).filter((item): item is string => Boolean(item)))].sort((a, b) => a.localeCompare(b, 'vi')),
}));
router.get('/references/suppliers', (_request, response) => ok(response, store.suppliers.map((item) => ({ value: item.id, label: `${item.code} · ${item.name}`, disabled: !item.isActive }))));
router.post('/', (request, response) => {
  const values = productSchema.parse(request.body); validateReferences(values.categoryId, values.baseUnitId); ensureUnique(values);
  const now = new Date().toISOString(); const record = { id: nextId(store.products), ...values, barcode: optionalText(values.barcode), brand: optionalText(values.brand), createdAt: now, updatedAt: now };
  store.products.unshift(record); ok(response, productView(record), 201);
});
router.put('/:id', (request, response) => {
  const id = asId(String(request.params.id)); const values = productSchema.parse(request.body); const index = store.products.findIndex((item) => item.id === id);
  if (index < 0) throw new HttpError(404, 'Không tìm thấy sản phẩm.');
  validateReferences(values.categoryId, values.baseUnitId); ensureUnique(values, id);
  const record = { ...store.products[index]!, ...values, barcode: optionalText(values.barcode), brand: optionalText(values.brand), updatedAt: new Date().toISOString() };
  store.products[index] = record; ok(response, productView(record));
});
router.patch('/:id/active', (request, response) => {
  const id = asId(String(request.params.id)); const { isActive } = z.object({ isActive: z.boolean() }).parse(request.body); const record = store.products.find((item) => item.id === id);
  if (!record) throw new HttpError(404, 'Không tìm thấy sản phẩm.'); record.isActive = isActive; record.updatedAt = new Date().toISOString(); ok(response, productView(record));
});
router.patch('/:id/status', (request, response) => {
  const id = asId(String(request.params.id)); const { status } = z.object({ status: z.enum(['ACTIVE', 'DISCONTINUED', 'HIDDEN']) }).parse(request.body); const record = store.products.find((item) => item.id === id);
  if (!record) throw new HttpError(404, 'Không tìm thấy sản phẩm.'); record.status = status; record.updatedAt = new Date().toISOString(); ok(response, productView(record));
});
router.get('/:id/quote', (request, response) => {
  const id = asId(String(request.params.id));
  const quantity = Number(request.query.quantity);
  const customerType = z.enum(['RETAIL', 'WHOLESALE', 'VIP']).parse(request.query.customerType ?? 'RETAIL');
  if (!Number.isFinite(quantity) || quantity <= 0) throw new HttpError(400, 'Số lượng phải lớn hơn 0.');
  const product = store.products.find((item) => item.id === id && item.isActive && item.status === 'ACTIVE');
  if (!product) throw new HttpError(404, 'Sản phẩm không khả dụng.');
  if (customerType === 'WHOLESALE' && quantity < product.moq) throw new HttpError(409, `Khách sỉ phải mua tối thiểu ${product.moq} sản phẩm.`);
  const today = new Date().toISOString().slice(0, 10);
  const activeLists = store.priceLists.filter((item) => item.customerType === customerType && item.isActive && item.validFrom <= today && (!item.validTo || item.validTo >= today));
  const tier = store.priceTiers
    .filter((item) => activeLists.some((list) => list.id === item.priceListId) && item.productId === id && item.minQty <= quantity && (!item.maxQty || item.maxQty >= quantity))
    .sort((a, b) => b.minQty - a.minQty)[0];
  const unitPrice = tier?.unitPrice ?? (customerType === 'RETAIL' ? product.retailPrice : product.wholesalePrice);
  ok(response, { productId: id, customerType, quantity, minimumQuantity: customerType === 'WHOLESALE' ? product.moq : 1, unitPrice, total: unitPrice * quantity, priceSource: tier ? 'PRICE_TIER' : 'PRODUCT' });
});
router.get('/:id/suppliers', (request, response) => {
  const productId = asId(String(request.params.id));
  const product = store.products.find((item) => item.id === productId);
  if (!product) throw new HttpError(404, 'Không tìm thấy sản phẩm.');
  const suppliers = store.supplierProducts.filter((item) => item.productId === productId).map((relation) => {
    const supplier = store.suppliers.find((item) => item.id === relation.supplierId);
    return {
      ...relation,
      supplierCode: supplier?.code ?? `#${relation.supplierId}`,
      supplierName: supplier?.name ?? 'Nhà cung cấp không còn tồn tại',
      supplierIsActive: supplier?.isActive ?? false,
      isDefaultSupplier: product.defaultSupplierId === relation.supplierId,
    };
  });
  ok(response, suppliers);
});
router.post('/:id/suppliers', (request, response) => {
  const productId = asId(String(request.params.id));
  const values = z.object({ supplierId: z.number().int().positive(), lastPurchasePrice: z.number().nonnegative(), leadTimeDays: z.number().int().nonnegative(), isDefaultSupplier: z.boolean() }).parse(request.body);
  const product = store.products.find((item) => item.id === productId);
  const supplier = store.suppliers.find((item) => item.id === values.supplierId);
  if (!product) throw new HttpError(404, 'Không tìm thấy sản phẩm.');
  if (!supplier) throw new HttpError(400, 'Nhà cung cấp không tồn tại.');
  if (store.supplierProducts.some((item) => item.productId === productId && item.supplierId === values.supplierId)) throw new HttpError(409, 'Nhà cung cấp đã được khai báo cho sản phẩm này.');
  const { isDefaultSupplier, ...relationValues } = values;
  const relation = { id: nextId(store.supplierProducts), productId, ...relationValues };
  store.supplierProducts.push(relation);
  if (isDefaultSupplier) product.defaultSupplierId = values.supplierId;
  ok(response, { ...relation, supplierCode: supplier.code, supplierName: supplier.name, supplierIsActive: supplier.isActive, isDefaultSupplier }, 201);
});
router.put('/:productId/suppliers/:relationId', (request, response) => {
  const productId = asId(String(request.params.productId));
  const relationId = asId(String(request.params.relationId));
  const values = z.object({ supplierId: z.number().int().positive(), lastPurchasePrice: z.number().nonnegative(), leadTimeDays: z.number().int().nonnegative(), isDefaultSupplier: z.boolean() }).parse(request.body);
  const product = store.products.find((item) => item.id === productId);
  const index = store.supplierProducts.findIndex((item) => item.id === relationId && item.productId === productId);
  if (!product || index < 0) throw new HttpError(404, 'Không tìm thấy thông tin mua hàng.');
  const current = store.supplierProducts[index]!;
  if (current.supplierId !== values.supplierId) throw new HttpError(400, 'Không thể đổi nhà cung cấp của khai báo hiện có.');
  const supplier = store.suppliers.find((item) => item.id === values.supplierId);
  if (!supplier) throw new HttpError(400, 'Nhà cung cấp không tồn tại.');
  const { isDefaultSupplier, ...relationValues } = values;
  const relation = { ...current, ...relationValues };
  store.supplierProducts[index] = relation;
  if (isDefaultSupplier) product.defaultSupplierId = values.supplierId;
  else if (product.defaultSupplierId === values.supplierId) product.defaultSupplierId = undefined;
  ok(response, { ...relation, supplierCode: supplier.code, supplierName: supplier.name, supplierIsActive: supplier.isActive, isDefaultSupplier });
});
router.delete('/:productId/suppliers/:relationId', (request, response) => {
  const productId = asId(String(request.params.productId));
  const relationId = asId(String(request.params.relationId));
  const product = store.products.find((item) => item.id === productId);
  const index = store.supplierProducts.findIndex((item) => item.id === relationId && item.productId === productId);
  if (!product || index < 0) throw new HttpError(404, 'Không tìm thấy thông tin mua hàng.');
  const relation = store.supplierProducts[index]!;
  if (product.defaultSupplierId === relation.supplierId) product.defaultSupplierId = undefined;
  store.supplierProducts.splice(index, 1);
  ok(response, null);
});
router.get('/:id/conversions', (request, response) => {
  const productId = asId(String(request.params.id)); if (!store.products.some((item) => item.id === productId)) throw new HttpError(404, 'Không tìm thấy sản phẩm.');
  ok(response, store.conversions.filter((item) => item.productId === productId).map((item) => ({ ...item, unitName: store.units.find((unit) => unit.id === item.unitId)?.name ?? `#${item.unitId}` })));
});
router.post('/:id/conversions', (request, response) => {
  const productId = asId(String(request.params.id)); const values = z.object({ unitId: z.number().int().positive(), factor: z.number().positive() }).parse(request.body);
  const product = store.products.find((item) => item.id === productId); if (!product) throw new HttpError(404, 'Không tìm thấy sản phẩm.');
  if (product.baseUnitId === values.unitId) throw new HttpError(400, 'Đơn vị quy đổi không được trùng đơn vị cơ sở.');
  if (!store.units.some((item) => item.id === values.unitId && item.isActive)) throw new HttpError(400, 'Đơn vị quy đổi không hợp lệ.');
  if (store.conversions.some((item) => item.productId === productId && item.unitId === values.unitId)) throw new HttpError(409, 'Đơn vị quy đổi đã tồn tại.');
  const record = { id: nextId(store.conversions), productId, ...values }; store.conversions.push(record);
  ok(response, { ...record, unitName: store.units.find((item) => item.id === values.unitId)!.name }, 201);
});
router.patch('/conversions/:id', (request, response) => {
  const id = asId(String(request.params.id)); const { factor } = z.object({ factor: z.number().positive() }).parse(request.body); const record = store.conversions.find((item) => item.id === id);
  if (!record) throw new HttpError(404, 'Không tìm thấy quy đổi.'); record.factor = factor; ok(response, { ...record, unitName: store.units.find((item) => item.id === record.unitId)?.name ?? `#${record.unitId}` });
});
router.delete('/conversions/:id', (request, response) => {
  const id = asId(String(request.params.id)); const index = store.conversions.findIndex((item) => item.id === id); if (index < 0) throw new HttpError(404, 'Không tìm thấy quy đổi.');
  store.conversions.splice(index, 1); ok(response, null);
});

export default router;
