import type { Permission, PermissionModule, Role } from '../../types/auth';

export type RoleFormMode = 'create' | 'edit';

export interface AdminRoleRecord extends Role {
  permissions: Permission[];
  permissionCount: number;
}

export interface AdminRoleListResult {
  content: AdminRoleRecord[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface RoleFormValues {
  code: string;
  name: string;
  description?: string;
  permissionIds: number[];
}

export interface PermissionModuleGroup {
  module: PermissionModule;
  label: string;
  permissions: Permission[];
}

const permissionModuleLabels: Record<PermissionModule, string> = {
  CATALOG: 'Danh mục',
  SALES: 'Bán hàng',
  PURCHASING: 'Mua hàng',
  INVENTORY: 'Kho',
  REPORT: 'Báo cáo',
  AI: 'AI Agent',
  ADMIN: 'Hệ thống',
};

const permissionModuleOrder: PermissionModule[] = [
  'CATALOG',
  'SALES',
  'PURCHASING',
  'INVENTORY',
  'REPORT',
  'AI',
  'ADMIN',
];

export function groupPermissionsByModule(permissions: Permission[]): PermissionModuleGroup[] {
  return permissionModuleOrder.map((module) => ({
    module,
    label: permissionModuleLabels[module],
    permissions: permissions.filter((permission) => permission.module === module),
  })).filter((group) => group.permissions.length > 0);
}
