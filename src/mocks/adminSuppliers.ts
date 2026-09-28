import type { SupplierRepository } from '../features/suppliers/suppliers.repository';
import type {
  AdminSupplierDetail,
  AdminSupplierFilters,
  AdminSupplierListResult,
  ProductReference,
  SupplierFormValues,
  SupplierProductFormValues,
  SupplierProductView,
} from '../features/suppliers/suppliers.model';
import type { Supplier, SupplierProduct } from '../types/supplier';

const productReferences: ProductReference[] = [
  { id: 1, code: 'TSH-BLK-M', name: 'Áo thun cotton cổ tròn', defaultSupplierId: 1 },
  { id: 2, code: 'SHO-RUN-42', name: 'Giày chạy bộ đế nhẹ', defaultSupplierId: 1 },
  { id: 3, code: 'EAR-BT-PRO', name: 'Tai nghe Bluetooth Pro', defaultSupplierId: 2 },
  { id: 4, code: 'KET-GLS-18', name: 'Ấm đun thủy tinh 1,8 lít', defaultSupplierId: 3 },
  { id: 5, code: 'SER-VIT-C30', name: 'Tinh chất Vitamin C 30 ml', defaultSupplierId: 4 },
  { id: 6, code: 'COF-ARA-500', name: 'Cà phê Arabica rang vừa 500 g', defaultSupplierId: 5 },
  { id: 7, code: 'PAN-NST-24', name: 'Chảo chống dính 24 cm', defaultSupplierId: 3 },
  { id: 8, code: 'PWR-20K-BLK', name: 'Pin sạc dự phòng 20.000 mAh', defaultSupplierId: 2 },
];

const seedSuppliers: Supplier[] = [
  { id: 1, code: 'NCC0001', name: 'Công ty Dệt may Đông Á', taxCode: '0311122233', phone: '02838112233', email: 'sales@dongatex.vn', address: '168 Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh', avgLeadTimeDays: 4, maxLeadTimeDays: 7, isActive: true, createdAt: '2025-08-12T02:15:00.000Z', updatedAt: '2026-09-20T07:30:00.000Z' },
  { id: 2, code: 'NCC0002', name: 'Công ty Thiết bị Nexa', taxCode: '0102233445', phone: '02437778899', email: 'b2b@nexa.example', address: '22 Duy Tân, Quận Cầu Giấy, Hà Nội', avgLeadTimeDays: 6, maxLeadTimeDays: 10, isActive: true, createdAt: '2025-09-05T03:20:00.000Z', updatedAt: '2026-09-18T09:10:00.000Z' },
  { id: 3, code: 'NCC0003', name: 'Gia dụng Bếp Việt', taxCode: '3703344556', phone: '02743881234', email: 'donhang@bepviet.vn', address: 'KCN Sóng Thần, Dĩ An, Bình Dương', avgLeadTimeDays: 3, maxLeadTimeDays: 5, isActive: true, createdAt: '2025-10-18T06:45:00.000Z', updatedAt: '2026-09-17T04:25:00.000Z' },
  { id: 4, code: 'NCC0004', name: 'Lá Lab Cosmetics', taxCode: '0314455667', phone: '02839001122', email: 'wholesale@lalab.vn', address: '58 Nguyễn Văn Trỗi, Quận Phú Nhuận, TP. Hồ Chí Minh', avgLeadTimeDays: 5, maxLeadTimeDays: 8, isActive: true, createdAt: '2026-01-11T01:30:00.000Z', updatedAt: '2026-09-15T08:35:00.000Z' },
  { id: 5, code: 'NCC0005', name: 'Nông sản Đồi Gió', taxCode: '5805566778', phone: '02633887766', email: 'hello@doigio.vn', address: '12 Trần Hưng Đạo, Đà Lạt, Lâm Đồng', avgLeadTimeDays: 2, maxLeadTimeDays: 4, isActive: true, createdAt: '2026-02-14T05:10:00.000Z', updatedAt: '2026-09-12T02:55:00.000Z' },
  { id: 6, code: 'NCC0006', name: 'Bao bì Thành Công', taxCode: '0316677889', phone: '0908111222', email: 'kinhdoanh@thanhcong.example', address: 'Lô C5, KCN Tân Bình, TP. Hồ Chí Minh', avgLeadTimeDays: 7, maxLeadTimeDays: 12, isActive: false, createdAt: '2025-07-22T04:00:00.000Z', updatedAt: '2026-08-28T07:40:00.000Z' },
  { id: 7, code: 'NCC0007', name: 'Công ty Logistics Miền Trung', taxCode: '0407788990', phone: '02363889900', email: 'cs@mtlogistics.example', address: '90 Nguyễn Tri Phương, Đà Nẵng', avgLeadTimeDays: 1, maxLeadTimeDays: 3, isActive: true, createdAt: '2026-03-19T08:20:00.000Z', updatedAt: '2026-09-08T03:15:00.000Z' },
  { id: 8, code: 'NCC0008', name: 'Nhà cung cấp thử nghiệm', phone: '0912000111', avgLeadTimeDays: 0, maxLeadTimeDays: 0, isActive: false, createdAt: '2026-07-06T09:00:00.000Z', updatedAt: '2026-09-01T02:10:00.000Z' },
];

const seedRelations: SupplierProduct[] = [
  { id: 1, supplierId: 1, productId: 1, lastPurchasePrice: 142000, leadTimeDays: 3 },
  { id: 2, supplierId: 1, productId: 2, lastPurchasePrice: 820000, leadTimeDays: 6 },
  { id: 3, supplierId: 2, productId: 3, lastPurchasePrice: 545000, leadTimeDays: 7 },
  { id: 4, supplierId: 2, productId: 8, lastPurchasePrice: 482000, leadTimeDays: 5 },
  { id: 5, supplierId: 3, productId: 4, lastPurchasePrice: 295000, leadTimeDays: 3 },
  { id: 6, supplierId: 3, productId: 7, lastPurchasePrice: 218000, leadTimeDays: 4 },
  { id: 7, supplierId: 4, productId: 5, lastPurchasePrice: 221000, leadTimeDays: 6 },
  { id: 8, supplierId: 5, productId: 6, lastPurchasePrice: 175000, leadTimeDays: 2 },
];

let suppliers = seedSuppliers.map((supplier) => ({ ...supplier }));
let relations = seedRelations.map((relation) => ({ ...relation }));

function wait(duration = 280): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function normalize(value?: string): string {
  return value?.trim().toLocaleLowerCase('vi-VN') ?? '';
}

function trimOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function cleanValues(values: SupplierFormValues): SupplierFormValues {
  return {
    ...values,
    code: values.code.trim().toLocaleUpperCase('vi-VN'),
    name: values.name.trim(),
    taxCode: trimOptional(values.taxCode),
    phone: trimOptional(values.phone),
    email: trimOptional(values.email),
    address: trimOptional(values.address),
  };
}

function ensureCodeAvailable(code: string, currentId?: number): void {
  if (suppliers.some((item) => item.id !== currentId && normalize(item.code) === normalize(code))) {
    throw new Error('Mã nhà cung cấp đã tồn tại. Hãy dùng mã khác.');
  }
}

function toProductView(relation: SupplierProduct): SupplierProductView {
  const product = productReferences.find((item) => item.id === relation.productId);
  if (!product) {
    throw new Error('Không tìm thấy sản phẩm liên kết.');
  }
  return {
    ...relation,
    productCode: product.code,
    productName: product.name,
    isDefaultSupplier: product.defaultSupplierId === relation.supplierId,
  };
}

async function list(
  filters: AdminSupplierFilters,
  page: number,
  pageSize: number,
): Promise<AdminSupplierListResult> {
  await wait();
  const keyword = normalize(filters.keyword);
  const filtered = suppliers.filter((supplier) => {
    const matchesKeyword = !keyword || [supplier.code, supplier.name, supplier.taxCode, supplier.phone]
      .some((value) => normalize(value).includes(keyword));
    const matchesStatus = filters.status === 'ALL'
      || (filters.status === 'ACTIVE' ? supplier.isActive : !supplier.isActive);
    return matchesKeyword && matchesStatus;
  });
  const start = (page - 1) * pageSize;
  return {
    content: filtered.slice(start, start + pageSize).map((item) => ({ ...item })),
    totalElements: filtered.length,
    page,
    size: pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}

async function getById(id: number): Promise<AdminSupplierDetail> {
  await wait(180);
  const supplier = suppliers.find((item) => item.id === id);
  if (!supplier) {
    throw new Error('Không tìm thấy nhà cung cấp.');
  }
  return {
    ...supplier,
    products: relations.filter((item) => item.supplierId === id).map(toProductView),
  };
}

async function create(values: SupplierFormValues): Promise<Supplier> {
  await wait(360);
  const clean = cleanValues(values);
  ensureCodeAvailable(clean.code);
  const now = new Date().toISOString();
  const supplier: Supplier = {
    ...clean,
    id: Math.max(...suppliers.map((item) => item.id), 0) + 1,
    createdAt: now,
    updatedAt: now,
  };
  suppliers = [supplier, ...suppliers];
  return { ...supplier };
}

async function update(id: number, values: SupplierFormValues): Promise<Supplier> {
  await wait(360);
  const current = suppliers.find((item) => item.id === id);
  if (!current) {
    throw new Error('Không tìm thấy nhà cung cấp cần cập nhật.');
  }
  const clean = cleanValues(values);
  ensureCodeAvailable(clean.code, id);
  const updated = { ...current, ...clean, updatedAt: new Date().toISOString() };
  suppliers = suppliers.map((item) => item.id === id ? updated : item);
  return { ...updated };
}

async function updateStatus(id: number, isActive: boolean): Promise<Supplier> {
  await wait(260);
  const current = suppliers.find((item) => item.id === id);
  if (!current) {
    throw new Error('Không tìm thấy nhà cung cấp cần cập nhật trạng thái.');
  }
  const updated = { ...current, isActive, updatedAt: new Date().toISOString() };
  suppliers = suppliers.map((item) => item.id === id ? updated : item);
  return { ...updated };
}

async function listProductReferences(): Promise<ProductReference[]> {
  await wait(140);
  return productReferences.map((item) => ({ ...item }));
}

async function linkProduct(
  supplierId: number,
  values: SupplierProductFormValues,
): Promise<SupplierProductView> {
  await wait(280);
  if (!suppliers.some((item) => item.id === supplierId)) {
    throw new Error('Không tìm thấy nhà cung cấp.');
  }
  if (relations.some((item) => item.supplierId === supplierId && item.productId === values.productId)) {
    throw new Error('Sản phẩm đã được liên kết với nhà cung cấp này.');
  }
  const relation: SupplierProduct = {
    ...values,
    id: Math.max(...relations.map((item) => item.id), 0) + 1,
    supplierId,
  };
  relations = [...relations, relation];
  return toProductView(relation);
}

async function updateProductLink(
  supplierId: number,
  relationId: number,
  values: SupplierProductFormValues,
): Promise<SupplierProductView> {
  await wait(280);
  const current = relations.find((item) => item.id === relationId && item.supplierId === supplierId);
  if (!current) {
    throw new Error('Không tìm thấy liên kết sản phẩm cần cập nhật.');
  }
  const updated = { ...current, ...values, supplierId, id: relationId };
  relations = relations.map((item) => item.id === relationId ? updated : item);
  return toProductView(updated);
}

async function unlinkProduct(supplierId: number, relationId: number): Promise<void> {
  await wait(240);
  const current = relations.find((item) => item.id === relationId && item.supplierId === supplierId);
  if (!current) {
    throw new Error('Không tìm thấy liên kết sản phẩm cần bỏ.');
  }
  relations = relations.filter((item) => item.id !== relationId);
}

export const mockSupplierRepository: SupplierRepository = {
  list,
  getById,
  create,
  update,
  updateStatus,
  listProductReferences,
  linkProduct,
  updateProductLink,
  unlinkProduct,
};
