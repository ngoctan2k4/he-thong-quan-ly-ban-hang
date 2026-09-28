import type { Role } from '../../types/auth';
import type { Branch, Warehouse } from '../../types/catalog';
import type { SystemUser, SystemUserDetail } from '../../types/user';

export type UserStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';
export type UserFormMode = 'create' | 'edit';

export interface AdminUserFilters {
  keyword: string;
  branchId?: number;
  roleId?: number;
  status: UserStatusFilter;
}

export interface AdminUserRecord extends SystemUser {
  branchName?: string;
  roles: Role[];
}

export interface AdminUserListResult {
  content: AdminUserRecord[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface UserReferences {
  roles: Role[];
  branches: Branch[];
  warehouses: Warehouse[];
}

export interface UserFormValues {
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  branchId?: number;
  isActive: boolean;
  roleIds: number[];
  branchIds: number[];
  warehouseIds: number[];
}

export type AdminUserDetail = SystemUserDetail;

export const initialAdminUserFilters: AdminUserFilters = {
  keyword: '',
  branchId: undefined,
  roleId: undefined,
  status: 'ALL',
};
