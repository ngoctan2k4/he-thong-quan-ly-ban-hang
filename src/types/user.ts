import type { Role } from './auth';
import type { Branch, Warehouse } from './catalog';

export interface SystemUser {
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
}

export interface SystemUserDetail extends SystemUser {
  roles: Role[];
  accessibleBranches: Branch[];
  accessibleWarehouses: Warehouse[];
}
