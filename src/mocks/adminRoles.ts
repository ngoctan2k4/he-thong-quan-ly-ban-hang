import type { AdminRoleRecord, RoleFormValues } from '../features/access-control/accessControl.model';
import type { AccessControlRepository } from '../features/access-control/accessControl.repository';
import type { Permission, PermissionCode, PermissionModule, Role } from '../types/auth';

const wait = (delay = 140) => new Promise((resolve) => window.setTimeout(resolve, delay));

const permissionSeeds: Array<[PermissionCode, string, PermissionModule]> = [
  ['product:read', 'Xem sản phẩm', 'CATALOG'],
  ['product:write', 'Sửa sản phẩm', 'CATALOG'],
  ['order:read', 'Xem đơn bán', 'SALES'],
  ['order:create', 'Tạo đơn bán', 'SALES'],
  ['order:approve', 'Duyệt đơn bán', 'SALES'],
  ['po:read', 'Xem đơn mua', 'PURCHASING'],
  ['po:create', 'Tạo đơn mua', 'PURCHASING'],
  ['po:approve', 'Duyệt đơn mua', 'PURCHASING'],
  ['inventory:read', 'Xem tồn kho', 'INVENTORY'],
  ['inventory:receive', 'Nhập kho', 'INVENTORY'],
  ['inventory:issue', 'Xuất kho', 'INVENTORY'],
  ['inventory:transfer', 'Chuyển kho', 'INVENTORY'],
  ['inventory:stocktake', 'Kiểm kê', 'INVENTORY'],
  ['inventory:adjust', 'Điều chỉnh tồn', 'INVENTORY'],
  ['inventory:writeoff', 'Xuất hủy', 'INVENTORY'],
  ['report:read', 'Xem báo cáo', 'REPORT'],
  ['ai:chat', 'Chat với AI', 'AI'],
  ['ai:approve', 'Duyệt đề xuất AI', 'AI'],
  ['audit:read', 'Xem nhật ký hệ thống', 'ADMIN'],
  ['user:manage', 'Quản lý người dùng và vai trò', 'ADMIN'],
];

const permissions: Permission[] = permissionSeeds.map(([code, name, module], index) => ({
  id: index + 1,
  code,
  name,
  module,
}));

const permissionIdByCode = new Map(permissions.map((permission) => [permission.code, permission.id]));
const ids = (...codes: PermissionCode[]) => codes.map((code) => permissionIdByCode.get(code) as number);

let roles: Role[] = [
  { id: 1, code: 'ADMIN', name: 'Quản trị hệ thống', description: 'Toàn quyền quản trị cấu hình và vận hành hệ thống.' },
  { id: 2, code: 'SALES_STAFF', name: 'Nhân viên bán hàng', description: 'Tác nghiệp bán hàng và theo dõi tồn khả dụng.' },
  { id: 3, code: 'WAREHOUSE_STAFF', name: 'Nhân viên kho', description: 'Thực hiện nghiệp vụ nhập, xuất, chuyển và kiểm kê kho.' },
  { id: 4, code: 'PURCHASING_STAFF', name: 'Nhân viên mua hàng', description: 'Lập đơn mua và theo dõi hoạt động nhập hàng.' },
  { id: 5, code: 'BRANCH_MANAGER', name: 'Quản lý chi nhánh', description: 'Quản lý bán hàng, mua hàng và tồn kho trong phạm vi chi nhánh.' },
  { id: 6, code: 'INVENTORY_MANAGER', name: 'Quản lý tồn kho', description: 'Quản lý toàn bộ nghiệp vụ và điều chỉnh tồn kho.' },
  { id: 7, code: 'CUSTOMER', name: 'Khách hàng', description: 'Quyền truy cập cơ bản dành cho tài khoản khách hàng.' },
];

const rolePermissionIds = new Map<number, number[]>([
  [1, permissions.map((permission) => permission.id)],
  [2, ids('product:read', 'order:read', 'order:create', 'inventory:read', 'report:read', 'ai:chat')],
  [3, ids('product:read', 'inventory:read', 'inventory:receive', 'inventory:issue', 'inventory:transfer', 'inventory:stocktake')],
  [4, ids('product:read', 'po:read', 'po:create', 'inventory:read', 'inventory:receive', 'report:read')],
  [5, ids('product:read', 'product:write', 'order:read', 'order:create', 'order:approve', 'po:read', 'po:create', 'po:approve', 'inventory:read', 'inventory:receive', 'inventory:issue', 'inventory:transfer', 'inventory:stocktake', 'inventory:adjust', 'inventory:writeoff', 'report:read', 'ai:chat', 'ai:approve')],
  [6, ids('product:read', 'inventory:read', 'inventory:receive', 'inventory:issue', 'inventory:transfer', 'inventory:stocktake', 'inventory:adjust', 'inventory:writeoff', 'report:read')],
  [7, ids('product:read', 'order:read', 'order:create')],
]);

function clonePermission(permission: Permission): Permission {
  return { ...permission };
}

function toAdminRole(role: Role): AdminRoleRecord {
  const assignedIds = new Set(rolePermissionIds.get(role.id) ?? []);
  const assignedPermissions = permissions
    .filter((permission) => assignedIds.has(permission.id))
    .map(clonePermission);
  return { ...role, permissions: assignedPermissions, permissionCount: assignedPermissions.length };
}

export function getMockRolesSnapshot(): Role[] {
  return roles.map((role) => ({ ...role }));
}

export function getMockPermissionsSnapshot(): Permission[] {
  return permissions.map(clonePermission);
}

function validateRole(values: RoleFormValues, editingId?: number) {
  const normalizedCode = values.code.trim().toUpperCase();
  if (roles.some((role) => role.id !== editingId && role.code.toUpperCase() === normalizedCode)) {
    throw new Error('Mã vai trò đã tồn tại.');
  }
  const validPermissionIds = new Set(permissions.map((permission) => permission.id));
  if (values.permissionIds.some((permissionId) => !validPermissionIds.has(permissionId))) {
    throw new Error('Danh sách quyền có dữ liệu không hợp lệ.');
  }
}

export const mockRoleRepository: AccessControlRepository = {
  async listRoles(keyword, page, pageSize) {
    await wait();
    const normalizedKeyword = keyword.trim().toLocaleLowerCase('vi');
    const filtered = normalizedKeyword
      ? roles.filter((role) => `${role.code} ${role.name}`.toLocaleLowerCase('vi').includes(normalizedKeyword))
      : roles;
    const start = (page - 1) * pageSize;
    return {
      content: filtered.slice(start, start + pageSize).map(toAdminRole),
      totalElements: filtered.length,
      page,
      size: pageSize,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    };
  },

  async getRoleById(id) {
    await wait(90);
    const role = roles.find((item) => item.id === id);
    if (!role) throw new Error('Không tìm thấy vai trò.');
    return toAdminRole(role);
  },

  async createRole(values) {
    await wait(180);
    validateRole(values);
    const role: Role = {
      id: roles.reduce((maximum, item) => Math.max(maximum, item.id), 0) + 1,
      code: values.code.trim().toUpperCase(),
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
    };
    roles = [role, ...roles];
    rolePermissionIds.set(role.id, [...new Set(values.permissionIds)]);
    return toAdminRole(role);
  },

  async updateRole(id, values) {
    await wait(180);
    validateRole(values, id);
    const currentRole = roles.find((role) => role.id === id);
    if (!currentRole) throw new Error('Không tìm thấy vai trò.');
    const updatedRole: Role = {
      ...currentRole,
      code: values.code.trim().toUpperCase(),
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
    };
    roles = roles.map((role) => role.id === id ? updatedRole : role);
    rolePermissionIds.set(id, [...new Set(values.permissionIds)]);
    return toAdminRole(updatedRole);
  },

  async listPermissions() {
    await wait(90);
    return getMockPermissionsSnapshot();
  },
};
