import type { PermissionCode } from '../../types/auth';

export function hasPermission(
  grantedPermissions: readonly string[],
  requiredPermission: PermissionCode,
): boolean {
  return grantedPermissions.includes(requiredPermission);
}

export function hasAnyPermission(
  grantedPermissions: readonly string[],
  requiredPermissions: readonly PermissionCode[],
): boolean {
  return requiredPermissions.some((permission) => hasPermission(grantedPermissions, permission));
}
