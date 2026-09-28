import type { CatalogRepository } from '../features/catalog/catalog.repository';
import type {
  BranchFilters,
  BranchFormValues,
  CatalogListResult,
  CategoryFilters,
  CategoryFormValues,
  CategoryListResult,
  CategoryView,
  UnitFilters,
  UnitFormValues,
  WarehouseFilters,
  WarehouseFormValues,
} from '../features/catalog/catalog.model';
import type {
  Branch,
  ProductCategory,
  ProductUnitConversion,
  Unit,
  Warehouse,
} from '../types/catalog';

const createdAt = '2026-01-02T03:00:00.000Z';
const updatedAt = '2026-09-20T08:00:00.000Z';

let categories: ProductCategory[] = [
  { id: 101, code: 'DO-UONG', name: 'Đồ uống', description: 'Các sản phẩm nước giải khát và đồ uống đóng gói.', isActive: true, createdAt, updatedAt },
  { id: 102, code: 'NUOC-NGOT', name: 'Nước ngọt', parentId: 101, description: 'Nước ngọt có gas và không gas.', isActive: true, createdAt, updatedAt },
  { id: 108, code: 'CO-GAS', name: 'Có gas', parentId: 102, description: 'Nước giải khát có gas.', isActive: true, createdAt, updatedAt },
  { id: 109, code: 'KHONG-GAS', name: 'Không gas', parentId: 102, description: 'Nước giải khát không gas.', isActive: false, createdAt, updatedAt },
  { id: 103, code: 'NUOC-SUOI', name: 'Nước suối', parentId: 101, description: 'Nước khoáng và nước tinh khiết.', isActive: true, createdAt, updatedAt },
  { id: 110, code: 'NUOC-TANG-LUC', name: 'Nước tăng lực', parentId: 101, description: 'Đồ uống bổ sung năng lượng.', isActive: true, createdAt, updatedAt },
  { id: 104, code: 'THUC-PHAM', name: 'Thực phẩm', description: 'Nhóm thực phẩm đóng gói.', isActive: true, createdAt, updatedAt },
  { id: 111, code: 'BANH-KEO', name: 'Bánh kẹo', parentId: 104, description: 'Bánh, kẹo và đồ ăn vặt.', isActive: true, createdAt, updatedAt },
  { id: 105, code: 'MI-AN-LIEN', name: 'Đồ ăn nhanh', parentId: 104, description: 'Mì ăn liền và thực phẩm chế biến nhanh.', isActive: true, createdAt, updatedAt },
  { id: 106, code: 'GIA-DUNG', name: 'Gia dụng', description: 'Sản phẩm phục vụ sinh hoạt gia đình.', isActive: true, createdAt, updatedAt },
  { id: 107, code: 'NGUNG-KD', name: 'Nhóm ngừng kinh doanh', description: 'Nhóm lưu trữ các mặt hàng không còn sử dụng.', isActive: false, createdAt, updatedAt },
];

let units: Unit[] = [
  { id: 1, code: 'CAN', name: 'Lon', isActive: true },
  { id: 2, code: 'CARTON', name: 'Thùng', isActive: true },
  { id: 3, code: 'BOX', name: 'Hộp', isActive: true },
  { id: 4, code: 'BOTTLE', name: 'Chai', isActive: true },
  { id: 5, code: 'PACK', name: 'Gói', isActive: true },
  { id: 6, code: 'PCS', name: 'Cái', isActive: true },
  { id: 7, code: 'KG', name: 'Kilogram', isActive: false },
];

let branches: Branch[] = [
  { id: 1, code: 'CN-HCM', name: 'Chi nhánh Hồ Chí Minh', address: '18 Nguyễn Huệ, Quận 1, TP.HCM', phone: '028 3822 8899', isActive: true, createdAt, updatedAt },
  { id: 2, code: 'CN-HN', name: 'Chi nhánh Hà Nội', address: '42 Trần Duy Hưng, Cầu Giấy, Hà Nội', phone: '024 3766 7788', isActive: true, createdAt, updatedAt },
  { id: 3, code: 'CN-DN', name: 'Chi nhánh Đà Nẵng', address: '90 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', phone: '0236 388 6688', isActive: false, createdAt, updatedAt },
];

let warehouses: Warehouse[] = [
  { id: 1, code: 'KHO-HCM-01', branchId: 1, name: 'Kho trung tâm HCM', isDefault: true, isActive: true, createdAt, updatedAt },
  { id: 2, code: 'KHO-HCM-02', branchId: 1, name: 'Kho hàng sỉ HCM', isDefault: false, isActive: true, createdAt, updatedAt },
  { id: 3, code: 'KHO-HN-01', branchId: 2, name: 'Kho trung tâm Hà Nội', isDefault: true, isActive: true, createdAt, updatedAt },
  { id: 4, code: 'KHO-DN-01', branchId: 3, name: 'Kho Đà Nẵng', isDefault: true, isActive: false, createdAt, updatedAt },
];

let conversions: ProductUnitConversion[] = [
  { id: 1, productId: 1, unitId: 2, factor: 24 },
  { id: 2, productId: 1, unitId: 3, factor: 6 },
  { id: 3, productId: 2, unitId: 2, factor: 24 },
];

function wait(duration = 260): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('vi-VN');
}

function paginate<T>(items: T[], page: number, size: number): CatalogListResult<T> {
  const start = (page - 1) * size;
  return {
    content: items.slice(start, start + size),
    totalElements: items.length,
    page,
    size,
    totalPages: Math.ceil(items.length / size),
  };
}

function assertUniqueCode<T extends { id: number; code: string }>(items: T[], code: string, ignoredId?: number) {
  if (items.some((item) => item.id !== ignoredId && normalize(item.code) === normalize(code))) {
    throw new Error(`Mã “${code}” đã tồn tại.`);
  }
}

function nextId(items: Array<{ id: number }>): number {
  return Math.max(...items.map((item) => item.id), 0) + 1;
}

export function getMockCategoriesSnapshot(): ProductCategory[] {
  return categories.map((item) => ({ ...item }));
}

function collectCategoryAncestorIds(categoryIds: Set<number>): Set<number> {
  const includedIds = new Set(categoryIds);
  for (const categoryId of categoryIds) {
    let current = categories.find((item) => item.id === categoryId);
    const visited = new Set<number>();
    while (current?.parentId !== undefined && !visited.has(current.parentId)) {
      visited.add(current.parentId);
      includedIds.add(current.parentId);
      current = categories.find((item) => item.id === current?.parentId);
    }
  }
  return includedIds;
}

function buildCategoryTree(includedIds: Set<number>): CategoryView[] {
  const views = new Map<number, CategoryView>();
  categories.filter((item) => includedIds.has(item.id)).forEach((item) => {
    views.set(item.id, {
      ...item,
      parentName: categories.find((candidate) => candidate.id === item.parentId)?.name,
      children: [],
    });
  });
  const roots: CategoryView[] = [];
  views.forEach((item) => {
    const parent = item.parentId === undefined ? undefined : views.get(item.parentId);
    if (parent) parent.children?.push(item);
    else roots.push(item);
  });
  const byName = (left: CategoryView, right: CategoryView) => left.name.localeCompare(right.name, 'vi');
  const sortTree = (nodes: CategoryView[]) => nodes.sort(byName).forEach((node) => sortTree(node.children ?? []));
  sortTree(roots);
  return roots;
}

function getCategoryDescendantIds(categoryId: number): Set<number> {
  const descendantIds = new Set<number>();
  const pending = [categoryId];
  while (pending.length) {
    const currentId = pending.shift() as number;
    categories.filter((item) => item.parentId === currentId).forEach((child) => {
      if (!descendantIds.has(child.id)) {
        descendantIds.add(child.id);
        pending.push(child.id);
      }
    });
  }
  return descendantIds;
}

export function getMockUnitsSnapshot(): Unit[] {
  return units.map((item) => ({ ...item }));
}

export function getMockBranchesSnapshot(): Branch[] {
  return branches.map((item) => ({ ...item }));
}

export function getMockWarehousesSnapshot(): Warehouse[] {
  return warehouses.map((item) => ({ ...item }));
}

export function getMockConversionsSnapshot(productId: number): ProductUnitConversion[] {
  return conversions.filter((item) => item.productId === productId).map((item) => ({ ...item }));
}

export async function createMockConversion(productId: number, unitId: number, factor: number) {
  await wait();
  if (factor <= 0) throw new Error('Hệ số quy đổi phải lớn hơn 0.');
  const unit = units.find((item) => item.id === unitId);
  if (!unit) throw new Error('Đơn vị quy đổi không tồn tại.');
  if (!unit.isActive) throw new Error('Không thể sử dụng đơn vị đã ngừng hoạt động cho quy đổi mới.');
  if (conversions.some((item) => item.productId === productId && item.unitId === unitId)) {
    throw new Error('Đơn vị quy đổi này đã tồn tại cho sản phẩm.');
  }
  const conversion = { id: nextId(conversions), productId, unitId, factor };
  conversions = [...conversions, conversion];
  return { ...conversion };
}

export async function updateMockConversion(id: number, factor: number) {
  await wait();
  if (factor <= 0) throw new Error('Hệ số quy đổi phải lớn hơn 0.');
  const current = conversions.find((item) => item.id === id);
  if (!current) throw new Error('Không tìm thấy quy đổi cần cập nhật.');
  const updated = { ...current, factor };
  conversions = conversions.map((item) => item.id === id ? updated : item);
  return { ...updated };
}

export async function deleteMockConversion(id: number) {
  await wait();
  conversions = conversions.filter((item) => item.id !== id);
}

export const mockCatalogRepository: CatalogRepository = {
  async listCategories(filters: CategoryFilters, page: number, pageSize: number) {
    await wait();
    const keyword = normalize(filters.keyword);
    const matches = categories.filter((item) => {
      const matchesKeyword = !keyword || [item.code, item.name].some((value) => normalize(value).includes(keyword));
      const matchesStatus = filters.status === 'ALL' || item.isActive === (filters.status === 'ACTIVE');
      return matchesKeyword && matchesStatus;
    });
    const includedIds = collectCategoryAncestorIds(new Set(matches.map((item) => item.id)));
    const roots = buildCategoryTree(includedIds);
    const start = (page - 1) * pageSize;
    const result: CategoryListResult = {
      content: roots.slice(start, start + pageSize),
      totalElements: roots.length,
      categoryCount: matches.length,
      page,
      size: pageSize,
      totalPages: Math.ceil(roots.length / pageSize),
    };
    return result;
  },
  async createCategory(values: CategoryFormValues) {
    await wait();
    const code = values.code.trim();
    const name = values.name.trim();
    assertUniqueCode(categories, code);
    if (values.parentId !== undefined && !categories.some((item) => item.id === values.parentId)) {
      throw new Error('Nhóm cha không tồn tại.');
    }
    const now = new Date().toISOString();
    const category = { id: nextId(categories), ...values, code, name, description: values.description?.trim() || undefined, createdAt: now, updatedAt: now };
    categories = [category, ...categories];
    return { ...category };
  },
  async updateCategory(id: number, values: CategoryFormValues) {
    await wait();
    const code = values.code.trim();
    const name = values.name.trim();
    assertUniqueCode(categories, code, id);
    if (values.parentId === id) throw new Error('Nhóm hàng không thể chọn chính nó làm nhóm cha.');
    const current = categories.find((item) => item.id === id);
    if (!current) throw new Error('Không tìm thấy nhóm hàng cần cập nhật.');
    if (values.parentId !== undefined && !categories.some((item) => item.id === values.parentId)) {
      throw new Error('Nhóm cha không tồn tại.');
    }
    if (values.parentId !== undefined && getCategoryDescendantIds(id).has(values.parentId)) {
      throw new Error('Không thể chọn nhóm con làm nhóm cha vì sẽ tạo vòng lặp phân cấp.');
    }
    const updated = { ...current, ...values, code, name, description: values.description?.trim() || undefined, updatedAt: new Date().toISOString() };
    categories = categories.map((item) => item.id === id ? updated : item);
    return { ...updated };
  },
  async updateCategoryStatus(id: number, isActive: boolean) {
    await wait();
    const current = categories.find((item) => item.id === id);
    if (!current) throw new Error('Không tìm thấy nhóm hàng.');
    const updated = { ...current, isActive, updatedAt: new Date().toISOString() };
    categories = categories.map((item) => item.id === id ? updated : item);
    return { ...updated };
  },
  async listUnits(filters: UnitFilters, page: number, pageSize: number) {
    await wait();
    const keyword = normalize(filters.keyword);
    return paginate(units.filter((item) => {
      const matchesKeyword = !keyword || [item.code, item.name].some((value) => normalize(value).includes(keyword));
      const matchesStatus = filters.status === 'ALL' || item.isActive === (filters.status === 'ACTIVE');
      return matchesKeyword && matchesStatus;
    }), page, pageSize);
  },
  async createUnit(values: UnitFormValues) {
    await wait();
    const code = values.code.trim();
    const name = values.name.trim();
    assertUniqueCode(units, code);
    const unit = { id: nextId(units), ...values, code, name };
    units = [unit, ...units];
    return { ...unit };
  },
  async updateUnit(id: number, values: UnitFormValues) {
    await wait();
    const code = values.code.trim();
    const name = values.name.trim();
    assertUniqueCode(units, code, id);
    const current = units.find((item) => item.id === id);
    if (!current) throw new Error('Không tìm thấy đơn vị tính.');
    const updated = { ...current, ...values, code, name };
    units = units.map((item) => item.id === id ? updated : item);
    return { ...updated };
  },
  async updateUnitStatus(id: number, isActive: boolean) {
    await wait();
    const current = units.find((item) => item.id === id);
    if (!current) throw new Error('Không tìm thấy đơn vị tính.');
    const updated = { ...current, isActive };
    units = units.map((item) => item.id === id ? updated : item);
    return { ...updated };
  },
  async listBranches(filters: BranchFilters, page: number, pageSize: number) {
    await wait();
    const keyword = normalize(filters.keyword);
    const visible = branches.filter((item) => {
      const matchesKeyword = !keyword || [item.code, item.name, item.address ?? '', item.phone ?? ''].some((value) => normalize(value).includes(keyword));
      const matchesStatus = filters.status === 'ALL' || item.isActive === (filters.status === 'ACTIVE');
      return matchesKeyword && matchesStatus;
    });
    return paginate(visible, page, pageSize);
  },
  async getBranch(id: number) {
    await wait();
    const branch = branches.find((item) => item.id === id);
    if (!branch) throw new Error('Không tìm thấy chi nhánh.');
    return { ...branch, warehouses: warehouses.filter((item) => item.branchId === id).map((item) => ({ ...item })) };
  },
  async createBranch(values: BranchFormValues) {
    await wait();
    assertUniqueCode(branches, values.code);
    const now = new Date().toISOString();
    const branch = { id: nextId(branches), ...values, createdAt: now, updatedAt: now };
    branches = [branch, ...branches];
    return { ...branch };
  },
  async updateBranch(id: number, values: BranchFormValues) {
    await wait();
    assertUniqueCode(branches, values.code, id);
    const current = branches.find((item) => item.id === id);
    if (!current) throw new Error('Không tìm thấy chi nhánh.');
    const updated = { ...current, ...values, updatedAt: new Date().toISOString() };
    branches = branches.map((item) => item.id === id ? updated : item);
    return { ...updated };
  },
  async updateBranchStatus(id: number, isActive: boolean) {
    await wait();
    const current = branches.find((item) => item.id === id);
    if (!current) throw new Error('Không tìm thấy chi nhánh.');
    const updated = { ...current, isActive, updatedAt: new Date().toISOString() };
    branches = branches.map((item) => item.id === id ? updated : item);
    return { ...updated };
  },
  async listWarehouses(filters: WarehouseFilters, page: number, pageSize: number) {
    await wait();
    const keyword = normalize(filters.keyword);
    const visible = warehouses.filter((item) => {
      const branchName = branches.find((branch) => branch.id === item.branchId)?.name ?? '';
      const matchesKeyword = !keyword || [item.code, item.name, branchName].some((value) => normalize(value).includes(keyword));
      const matchesBranch = filters.branchId === undefined || item.branchId === filters.branchId;
      const matchesStatus = filters.status === 'ALL' || item.isActive === (filters.status === 'ACTIVE');
      return matchesKeyword && matchesBranch && matchesStatus;
    }).map((item) => ({ ...item, branchName: branches.find((branch) => branch.id === item.branchId)?.name ?? '—' }));
    return paginate(visible, page, pageSize);
  },
  async createWarehouse(values: WarehouseFormValues) {
    await wait();
    assertUniqueCode(warehouses, values.code);
    const now = new Date().toISOString();
    const warehouse = { id: nextId(warehouses), ...values, createdAt: now, updatedAt: now };
    if (values.isDefault) {
      warehouses = warehouses.map((item) => item.branchId === values.branchId ? { ...item, isDefault: false } : item);
    }
    warehouses = [warehouse, ...warehouses];
    return { ...warehouse };
  },
  async updateWarehouse(id: number, values: WarehouseFormValues) {
    await wait();
    assertUniqueCode(warehouses, values.code, id);
    const current = warehouses.find((item) => item.id === id);
    if (!current) throw new Error('Không tìm thấy kho.');
    if (values.isDefault) {
      warehouses = warehouses.map((item) => item.id !== id && item.branchId === values.branchId ? { ...item, isDefault: false } : item);
    }
    const updated = { ...current, ...values, updatedAt: new Date().toISOString() };
    warehouses = warehouses.map((item) => item.id === id ? updated : item);
    return { ...updated };
  },
  async updateWarehouseStatus(id: number, isActive: boolean) {
    await wait();
    const current = warehouses.find((item) => item.id === id);
    if (!current) throw new Error('Không tìm thấy kho.');
    const updated = { ...current, isActive, updatedAt: new Date().toISOString() };
    warehouses = warehouses.map((item) => item.id === id ? updated : item);
    return { ...updated };
  },
  async listReferences() {
    await wait(120);
    return {
      categories: categories.map((item) => ({ ...item })),
      units: units.map((item) => ({ ...item })),
      branches: branches.map((item) => ({ ...item })),
    };
  },
};
