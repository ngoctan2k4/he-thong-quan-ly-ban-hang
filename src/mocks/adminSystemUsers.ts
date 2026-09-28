import type { SystemUserRepository } from '../features/system-users/systemUsers.repository';
import type { UserFormValues } from '../features/system-users/systemUsers.model';
import { getMockBranchesSnapshot, getMockWarehousesSnapshot } from './adminCatalogV1';
import { getMockRolesSnapshot } from './adminRoles';

interface StoredUser {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  fullName: string;
  branchId?: number;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  roleIds: number[];
  branchIds: number[];
  warehouseIds: number[];
}

const createdAt = '2026-01-05T03:00:00.000Z';
const updatedAt = '2026-09-25T08:30:00.000Z';

let users: StoredUser[] = [
  { id: 1, username: 'admin', email: 'admin@saleshub.vn', phone: '0901000001', fullName: 'Quản trị viên hệ thống', branchId: 1, isActive: true, lastLoginAt: '2026-09-28T02:10:00.000Z', createdAt, updatedAt, roleIds: [1], branchIds: [1, 2, 3], warehouseIds: [1, 2, 3, 4] },
  { id: 2, username: 'sales.hcm', email: 'sales.hcm@saleshub.vn', phone: '0901000002', fullName: 'Nguyễn Minh Anh', branchId: 1, isActive: true, lastLoginAt: '2026-09-27T09:20:00.000Z', createdAt, updatedAt, roleIds: [2], branchIds: [1], warehouseIds: [1] },
  { id: 3, username: 'warehouse.hcm', email: 'warehouse.hcm@saleshub.vn', phone: '0901000003', fullName: 'Trần Quốc Bảo', branchId: 1, isActive: true, lastLoginAt: '2026-09-26T04:15:00.000Z', createdAt, updatedAt, roleIds: [3], branchIds: [1], warehouseIds: [1, 2] },
  { id: 4, username: 'purchase.hn', email: 'purchase.hn@saleshub.vn', phone: '0901000004', fullName: 'Lê Thu Hà', branchId: 2, isActive: true, lastLoginAt: '2026-09-25T06:45:00.000Z', createdAt, updatedAt, roleIds: [4], branchIds: [2], warehouseIds: [3] },
  { id: 5, username: 'manager.hn', email: 'manager.hn@saleshub.vn', phone: '0901000005', fullName: 'Phạm Đức Long', branchId: 2, isActive: true, lastLoginAt: '2026-09-28T01:05:00.000Z', createdAt, updatedAt, roleIds: [5, 6], branchIds: [1, 2], warehouseIds: [1, 3] },
  { id: 6, username: 'inventory.hcm', email: 'inventory.hcm@saleshub.vn', phone: '0901000006', fullName: 'Vũ Hoàng Nam', branchId: 1, isActive: true, lastLoginAt: '2026-09-24T10:00:00.000Z', createdAt, updatedAt, roleIds: [3, 6], branchIds: [1], warehouseIds: [1, 2] },
  { id: 7, username: 'sales.hn', email: 'sales.hn@saleshub.vn', phone: '0901000007', fullName: 'Đỗ Ngọc Mai', branchId: 2, isActive: true, lastLoginAt: '2026-09-23T03:40:00.000Z', createdAt, updatedAt, roleIds: [2], branchIds: [2], warehouseIds: [3] },
  { id: 8, username: 'branch.dn', email: 'branch.dn@saleshub.vn', phone: '0901000008', fullName: 'Bùi Gia Huy', branchId: 3, isActive: false, lastLoginAt: '2026-08-14T07:25:00.000Z', createdAt, updatedAt, roleIds: [5], branchIds: [3], warehouseIds: [4] },
  { id: 9, username: 'ops.multi', email: 'ops.multi@saleshub.vn', phone: '0901000009', fullName: 'Ngô Khánh Linh', branchId: 1, isActive: true, lastLoginAt: '2026-09-27T02:30:00.000Z', createdAt, updatedAt, roleIds: [2, 3, 4], branchIds: [1, 2], warehouseIds: [1, 2, 3] },
  { id: 10, username: 'warehouse.dn', email: 'warehouse.dn@saleshub.vn', phone: '0901000010', fullName: 'Hoàng Thanh Tùng', branchId: 3, isActive: false, createdAt, updatedAt, roleIds: [3], branchIds: [3], warehouseIds: [4] },
];

function wait(duration = 300): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('vi-VN');
}

function assertValidScope(values: UserFormValues) {
  const branches = getMockBranchesSnapshot();
  const warehouses = getMockWarehousesSnapshot();
  const roles = getMockRolesSnapshot();
  if (values.branchId !== undefined && !branches.some((branch) => branch.id === values.branchId)) {
    throw new Error('Chi nhánh làm việc chính không hợp lệ.');
  }
  if (values.branchIds.some((id) => !branches.some((branch) => branch.id === id))) {
    throw new Error('Phạm vi chi nhánh có dữ liệu không hợp lệ.');
  }
  if (values.roleIds.some((id) => !roles.some((role) => role.id === id))) {
    throw new Error('Danh sách vai trò có dữ liệu không hợp lệ.');
  }
  if (values.warehouseIds.some((id) => {
    const warehouse = warehouses.find((item) => item.id === id);
    return !warehouse || !values.branchIds.includes(warehouse.branchId);
  })) {
    throw new Error('Kho được truy cập phải thuộc một chi nhánh trong phạm vi dữ liệu.');
  }
}

function toRecord(user: StoredUser) {
  const branches = getMockBranchesSnapshot();
  const roles = getMockRolesSnapshot();
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    fullName: user.fullName,
    branchId: user.branchId,
    branchName: branches.find((branch) => branch.id === user.branchId)?.name,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roles: roles.filter((role) => user.roleIds.includes(role.id)),
  };
}

function toDetail(user: StoredUser) {
  const branches = getMockBranchesSnapshot();
  const warehouses = getMockWarehousesSnapshot();
  const record = toRecord(user);
  return {
    ...record,
    accessibleBranches: branches.filter((branch) => user.branchIds.includes(branch.id)),
    accessibleWarehouses: warehouses.filter((warehouse) => user.warehouseIds.includes(warehouse.id)),
  };
}

export const mockSystemUserRepository: SystemUserRepository = {
  async list(filters, page, pageSize) {
    await wait();
    const keyword = normalize(filters.keyword);
    const visible = users.filter((user) => {
      const matchesKeyword = !keyword || [user.username, user.fullName, user.email ?? '', user.phone ?? ''].some((value) => normalize(value).includes(keyword));
      const matchesBranch = filters.branchId === undefined || user.branchId === filters.branchId;
      const matchesRole = filters.roleId === undefined || user.roleIds.includes(filters.roleId);
      const matchesStatus = filters.status === 'ALL' || user.isActive === (filters.status === 'ACTIVE');
      return matchesKeyword && matchesBranch && matchesRole && matchesStatus;
    });
    const start = (page - 1) * pageSize;
    return {
      content: visible.slice(start, start + pageSize).map(toRecord),
      totalElements: visible.length,
      page,
      size: pageSize,
      totalPages: Math.ceil(visible.length / pageSize),
    };
  },
  async getById(id) {
    await wait(220);
    const user = users.find((item) => item.id === id);
    if (!user) throw new Error('Không tìm thấy người dùng.');
    return toDetail(user);
  },
  async create(values) {
    await wait(420);
    if (!values.password) throw new Error('Mật khẩu là bắt buộc khi tạo người dùng.');
    if (values.password !== values.confirmPassword) throw new Error('Xác nhận mật khẩu không khớp.');
    if (users.some((user) => normalize(user.username) === normalize(values.username))) throw new Error('Tên đăng nhập đã tồn tại.');
    assertValidScope(values);
    const now = new Date().toISOString();
    const user: StoredUser = {
      id: Math.max(...users.map((item) => item.id), 0) + 1,
      username: values.username.trim(),
      fullName: values.fullName.trim(),
      email: values.email?.trim() || undefined,
      phone: values.phone?.trim() || undefined,
      branchId: values.branchId,
      isActive: values.isActive,
      createdAt: now,
      updatedAt: now,
      roleIds: [...values.roleIds],
      branchIds: [...values.branchIds],
      warehouseIds: [...values.warehouseIds],
    };
    users = [user, ...users];
    return toRecord(user);
  },
  async update(id, values) {
    await wait(420);
    const current = users.find((item) => item.id === id);
    if (!current) throw new Error('Không tìm thấy người dùng.');
    assertValidScope(values);
    const updated: StoredUser = {
      ...current,
      fullName: values.fullName.trim(),
      email: values.email?.trim() || undefined,
      phone: values.phone?.trim() || undefined,
      branchId: values.branchId,
      isActive: values.isActive,
      roleIds: [...values.roleIds],
      branchIds: [...values.branchIds],
      warehouseIds: [...values.warehouseIds],
      updatedAt: new Date().toISOString(),
    };
    users = users.map((item) => item.id === id ? updated : item);
    return toRecord(updated);
  },
  async updateStatus(id, isActive) {
    await wait();
    const current = users.find((item) => item.id === id);
    if (!current) throw new Error('Không tìm thấy người dùng.');
    const updated = { ...current, isActive, updatedAt: new Date().toISOString() };
    users = users.map((item) => item.id === id ? updated : item);
    return toRecord(updated);
  },
  async listReferences() {
    await wait(160);
    return {
      roles: getMockRolesSnapshot(),
      branches: getMockBranchesSnapshot(),
      warehouses: getMockWarehousesSnapshot(),
    };
  },
};
