import type { AdminProductsRepository } from '../features/products/products.repository';
import type {
  AdminProductFilters,
  AdminProductListResult,
  AdminProductRecord,
  AdminProductStatus,
  ProductFormValues,
} from '../features/products/adminProducts.model';
import {
  createMockConversion,
  deleteMockConversion,
  getMockCategoriesSnapshot,
  getMockConversionsSnapshot,
  getMockUnitsSnapshot,
  updateMockConversion,
} from './adminCatalogV1';

const createdAt = '2026-01-10T03:00:00.000Z';
const updatedAt = '2026-09-22T09:30:00.000Z';

const seedProducts: AdminProductRecord[] = [
  { id: 1, code: 'SP0001', sku: 'BEV-CC-330', barcode: '8934588012228', name: 'Coca-Cola lon 330ml', categoryId: 102, categoryName: 'Nước ngọt', brand: 'Coca-Cola', baseUnitId: 1, baseUnitName: 'Lon', retailPrice: 12000, wholesalePrice: 10500, moq: 24, minStock: 48, maxStock: 500, safetyStock: 72, reorderPoint: 96, status: 'ACTIVE', isActive: true, createdAt, updatedAt },
  { id: 2, code: 'SP0002', sku: 'BEV-AQ-500', barcode: '8934588233074', name: 'Aquafina 500ml', categoryId: 103, categoryName: 'Nước suối', brand: 'Aquafina', baseUnitId: 4, baseUnitName: 'Chai', retailPrice: 7000, wholesalePrice: 5800, moq: 24, minStock: 72, maxStock: 600, safetyStock: 96, reorderPoint: 120, status: 'ACTIVE', isActive: true, createdAt, updatedAt },
  { id: 3, code: 'SP0003', sku: 'FOD-OM-75', barcode: '8934563138165', name: 'Mì Omachi sườn hầm ngũ quả', categoryId: 105, categoryName: 'Mì ăn liền', brand: 'Omachi', baseUnitId: 5, baseUnitName: 'Gói', retailPrice: 11000, wholesalePrice: 9200, moq: 30, minStock: 60, maxStock: 900, safetyStock: 90, reorderPoint: 120, status: 'ACTIVE', isActive: true, createdAt, updatedAt },
  { id: 4, code: 'SP0004', sku: 'FOD-RI-05', barcode: '8938501434012', name: 'Gạo thơm Jasmine túi 5kg', categoryId: 104, categoryName: 'Thực phẩm', brand: 'An Gia', baseUnitId: 5, baseUnitName: 'Gói', retailPrice: 128000, wholesalePrice: 116000, moq: 5, minStock: 10, maxStock: 120, safetyStock: 15, reorderPoint: 20, status: 'ACTIVE', isActive: true, createdAt, updatedAt },
  { id: 5, code: 'SP0005', sku: 'HOM-DW-750', barcode: '8934868113577', name: 'Nước rửa chén Sunlight 750g', categoryId: 106, categoryName: 'Gia dụng', brand: 'Sunlight', baseUnitId: 4, baseUnitName: 'Chai', retailPrice: 36000, wholesalePrice: 32000, moq: 12, minStock: 24, maxStock: 240, safetyStock: 36, reorderPoint: 48, status: 'ACTIVE', isActive: true, createdAt, updatedAt },
  { id: 6, code: 'SP0006', sku: 'HOM-TS-12', barcode: '8936018061028', name: 'Khăn giấy Pulppy 12 cuộn', categoryId: 106, categoryName: 'Gia dụng', brand: 'Pulppy', baseUnitId: 5, baseUnitName: 'Gói', retailPrice: 89000, wholesalePrice: 79000, moq: 6, minStock: 12, maxStock: 120, safetyStock: 18, reorderPoint: 24, status: 'HIDDEN', isActive: true, createdAt, updatedAt },
  { id: 7, code: 'SP0007', sku: 'BEV-TE-450', barcode: '8936127790055', name: 'Trà xanh Không Độ 455ml', categoryId: 101, categoryName: 'Đồ uống', brand: 'Không Độ', baseUnitId: 4, baseUnitName: 'Chai', retailPrice: 11000, wholesalePrice: 9500, moq: 24, minStock: 48, maxStock: 480, safetyStock: 72, reorderPoint: 96, status: 'ACTIVE', isActive: true, createdAt, updatedAt },
  { id: 8, code: 'SP0008', sku: 'FOD-CK-300', barcode: '8934680032056', name: 'Bánh quy bơ Cosy 300g', categoryId: 104, categoryName: 'Thực phẩm', brand: 'Cosy', baseUnitId: 3, baseUnitName: 'Hộp', retailPrice: 52000, wholesalePrice: 46000, moq: 8, minStock: 16, maxStock: 160, safetyStock: 20, reorderPoint: 32, status: 'ACTIVE', isActive: true, createdAt, updatedAt },
  { id: 9, code: 'SP0009', sku: 'HOM-DE-34', barcode: '8934868160281', name: 'Bột giặt OMO 3.4kg', categoryId: 106, categoryName: 'Gia dụng', brand: 'OMO', baseUnitId: 5, baseUnitName: 'Gói', retailPrice: 178000, wholesalePrice: 162000, moq: 4, minStock: 8, maxStock: 80, safetyStock: 12, reorderPoint: 16, status: 'DISCONTINUED', isActive: false, createdAt, updatedAt },
  { id: 10, code: 'SP0010', sku: 'FOD-MI-380', barcode: '8934673577038', name: 'Sữa đặc Ông Thọ 380g', categoryId: 104, categoryName: 'Thực phẩm', brand: 'Vinamilk', baseUnitId: 3, baseUnitName: 'Hộp', retailPrice: 27000, wholesalePrice: 23800, moq: 12, minStock: 24, maxStock: 240, safetyStock: 36, reorderPoint: 48, status: 'ACTIVE', isActive: true, createdAt, updatedAt },
  { id: 11, code: 'SP0011', sku: 'BEV-SD-320', barcode: '8935049501239', name: 'Soda chanh 320ml', categoryId: 102, categoryName: 'Nước ngọt', brand: 'Chương Dương', baseUnitId: 1, baseUnitName: 'Lon', retailPrice: 9500, wholesalePrice: 8200, moq: 24, minStock: 48, maxStock: 480, safetyStock: 72, reorderPoint: 96, status: 'HIDDEN', isActive: true, createdAt, updatedAt },
  { id: 12, code: 'SP0012', sku: 'FOD-NDL-75', barcode: '8934563000783', name: 'Mì Hảo Hảo tôm chua cay', categoryId: 105, categoryName: 'Mì ăn liền', brand: 'Acecook', baseUnitId: 5, baseUnitName: 'Gói', retailPrice: 5000, wholesalePrice: 4200, moq: 30, minStock: 90, maxStock: 1200, safetyStock: 120, reorderPoint: 180, status: 'ACTIVE', isActive: true, createdAt, updatedAt },
];

let products = seedProducts.map((item) => ({ ...item }));

function wait(duration = 320): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('vi-VN');
}

function validateProduct(values: ProductFormValues) {
  if (values.retailPrice < 0 || values.wholesalePrice < 0) throw new Error('Giá bán không được âm.');
  if (values.moq <= 0) throw new Error('MOQ phải lớn hơn 0.');
  if ([values.minStock, values.safetyStock, values.reorderPoint].some((value) => value < 0)) throw new Error('Thiết lập tồn kho không được âm.');
  if (values.maxStock != null && values.maxStock < values.minStock) throw new Error('Tồn tối đa không được nhỏ hơn tồn tối thiểu.');
}

function assertUnique(values: ProductFormValues, ignoredId?: number) {
  const duplicate = products.find((item) => item.id !== ignoredId && (
    normalize(item.code) === normalize(values.code) ||
    normalize(item.sku) === normalize(values.sku) ||
    Boolean(values.barcode && item.barcode && normalize(item.barcode) === normalize(values.barcode))
  ));
  if (duplicate) throw new Error('Mã hàng, SKU hoặc barcode đã tồn tại.');
}

function toRecord(id: number, values: ProductFormValues, previous?: AdminProductRecord): AdminProductRecord {
  const category = getMockCategoriesSnapshot().find((item) => item.id === values.categoryId);
  const unit = getMockUnitsSnapshot().find((item) => item.id === values.baseUnitId);
  if (!category || !unit) throw new Error('Nhóm hàng hoặc đơn vị cơ sở không hợp lệ.');
  if (!unit.isActive && previous?.baseUnitId !== unit.id) {
    throw new Error('Không thể chọn đơn vị đã ngừng hoạt động làm đơn vị cơ sở mới.');
  }
  const now = new Date().toISOString();
  return {
    id,
    ...values,
    maxStock: values.maxStock ?? undefined,
    barcode: values.barcode?.trim() || undefined,
    brand: values.brand?.trim() || undefined,
    categoryName: category.name,
    baseUnitName: unit.name,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };
}

async function listMockAdminProducts(filters: AdminProductFilters, page: number, size: number): Promise<AdminProductListResult> {
  await wait();
  const keyword = normalize(filters.keyword);
  const visible = products.filter((product) => {
    const matchesKeyword = !keyword || [product.code, product.sku, product.barcode ?? '', product.name].some((value) => normalize(value).includes(keyword));
    const matchesCategory = filters.categoryId === undefined || product.categoryId === filters.categoryId;
    const matchesBrand = !filters.brand || product.brand === filters.brand;
    const matchesStatus = filters.status === 'ALL' || product.status === filters.status;
    return matchesKeyword && matchesCategory && matchesBrand && matchesStatus;
  });
  const start = (page - 1) * size;
  return { content: visible.slice(start, start + size).map((item) => ({ ...item })), totalElements: visible.length, page, size, totalPages: Math.ceil(visible.length / size) };
}

export const mockAdminProductsRepository: AdminProductsRepository = {
  list: listMockAdminProducts,
  async listReferences() {
    await wait(120);
    return {
      categories: getMockCategoriesSnapshot().map((item) => ({ value: item.id, label: item.name, disabled: !item.isActive })),
      units: getMockUnitsSnapshot().map((item) => ({ value: item.id, label: item.name, disabled: !item.isActive })),
      brands: [...new Set(products.map((item) => item.brand).filter((item): item is string => Boolean(item)))].sort((a, b) => a.localeCompare(b, 'vi')),
    };
  },
  async create(values: ProductFormValues) {
    await wait(420); validateProduct(values); assertUnique(values);
    const record = toRecord(Math.max(...products.map((item) => item.id), 0) + 1, values);
    products = [record, ...products]; return { ...record };
  },
  async update(id: number, values: ProductFormValues) {
    await wait(420); validateProduct(values); assertUnique(values, id);
    const current = products.find((item) => item.id === id); if (!current) throw new Error('Không tìm thấy sản phẩm cần cập nhật.');
    const record = toRecord(id, values, current); products = products.map((item) => item.id === id ? record : item); return { ...record };
  },
  async updateActive(id: number, isActive: boolean) {
    await wait(); const current = products.find((item) => item.id === id); if (!current) throw new Error('Không tìm thấy sản phẩm.');
    const updated = { ...current, isActive, updatedAt: new Date().toISOString() }; products = products.map((item) => item.id === id ? updated : item); return { ...updated };
  },
  async updateStatus(id: number, status: AdminProductStatus) {
    await wait(); const current = products.find((item) => item.id === id); if (!current) throw new Error('Không tìm thấy sản phẩm.');
    const updated = { ...current, status, updatedAt: new Date().toISOString() }; products = products.map((item) => item.id === id ? updated : item); return { ...updated };
  },
  async listConversions(productId: number) {
    await wait(180); const availableUnits = getMockUnitsSnapshot();
    return getMockConversionsSnapshot(productId).map((item) => ({ ...item, unitName: availableUnits.find((unit) => unit.id === item.unitId)?.name ?? `#${item.unitId}` }));
  },
  async createConversion(productId, values) {
    const product = products.find((item) => item.id === productId);
    if (!product) throw new Error('Không tìm thấy sản phẩm.');
    if (values.unitId === product.baseUnitId) {
      throw new Error('Đơn vị quy đổi không được trùng với đơn vị cơ sở.');
    }
    const conversion = await createMockConversion(productId, values.unitId, values.factor);
    return { ...conversion, unitName: getMockUnitsSnapshot().find((unit) => unit.id === conversion.unitId)?.name ?? `#${conversion.unitId}` };
  },
  async updateConversion(id, factor) {
    const conversion = await updateMockConversion(id, factor);
    return { ...conversion, unitName: getMockUnitsSnapshot().find((unit) => unit.id === conversion.unitId)?.name ?? `#${conversion.unitId}` };
  },
  deleteConversion: deleteMockConversion,
};
