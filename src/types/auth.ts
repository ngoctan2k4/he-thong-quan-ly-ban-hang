export interface Role {
  id: number;
  code: string;
  name: string;
  description?: string;
}

export type PermissionModule =
  | 'CATALOG'
  | 'SALES'
  | 'PURCHASING'
  | 'INVENTORY'
  | 'REPORT'
  | 'AI'
  | 'ADMIN';

export type PermissionCode =
  | 'product:read'
  | 'product:write'
  | 'order:read'
  | 'order:create'
  | 'order:approve'
  | 'po:read'
  | 'po:create'
  | 'po:approve'
  | 'inventory:read'
  | 'inventory:receive'
  | 'inventory:issue'
  | 'inventory:transfer'
  | 'inventory:stocktake'
  | 'inventory:adjust'
  | 'inventory:writeoff'
  | 'report:read'
  | 'ai:chat'
  | 'ai:approve'
  | 'audit:read'
  | 'user:manage';

export interface Permission {
  id: number;
  code: PermissionCode;
  name: string;
  module: PermissionModule;
}

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  roles: Role[];
  permissions: PermissionCode[];
}
