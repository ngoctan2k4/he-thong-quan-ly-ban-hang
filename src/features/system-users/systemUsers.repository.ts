import type {
  AdminUserDetail,
  AdminUserFilters,
  AdminUserListResult,
  AdminUserRecord,
  UserFormValues,
  UserReferences,
} from './systemUsers.model';

export interface SystemUserRepository {
  list(filters: AdminUserFilters, page: number, pageSize: number): Promise<AdminUserListResult>;
  getById(id: number): Promise<AdminUserDetail>;
  create(values: UserFormValues): Promise<AdminUserRecord>;
  update(id: number, values: UserFormValues): Promise<AdminUserRecord>;
  updateStatus(id: number, isActive: boolean): Promise<AdminUserRecord>;
  listReferences(): Promise<UserReferences>;
}
