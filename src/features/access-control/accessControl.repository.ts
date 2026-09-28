import type { Permission } from '../../types/auth';
import type { AdminRoleListResult, AdminRoleRecord, RoleFormValues } from './accessControl.model';

export interface AccessControlRepository {
  listRoles(keyword: string, page: number, pageSize: number): Promise<AdminRoleListResult>;
  getRoleById(id: number): Promise<AdminRoleRecord>;
  createRole(values: RoleFormValues): Promise<AdminRoleRecord>;
  updateRole(id: number, values: RoleFormValues): Promise<AdminRoleRecord>;
  listPermissions(): Promise<Permission[]>;
}
