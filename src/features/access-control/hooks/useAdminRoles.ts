import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockRoleRepository } from '../../../mocks/adminRoles';
import type { RoleFormValues } from '../accessControl.model';

const rolesQueryKey = ['admin-access-control'] as const;

export function useAdminRoles(keyword: string, page: number, pageSize: number, selectedRoleId?: number) {
  const queryClient = useQueryClient();
  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: rolesQueryKey }),
      queryClient.invalidateQueries({ queryKey: ['admin-system-users'] }),
    ]);
  };

  const listQuery = useQuery({
    queryKey: [...rolesQueryKey, 'roles', keyword, page, pageSize],
    queryFn: () => mockRoleRepository.listRoles(keyword, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const detailQuery = useQuery({
    queryKey: [...rolesQueryKey, 'role', selectedRoleId],
    queryFn: () => mockRoleRepository.getRoleById(selectedRoleId as number),
    enabled: selectedRoleId !== undefined,
  });
  const permissionsQuery = useQuery({
    queryKey: [...rolesQueryKey, 'permissions'],
    queryFn: () => mockRoleRepository.listPermissions(),
  });
  const createMutation = useMutation({
    mutationFn: (values: RoleFormValues) => mockRoleRepository.createRole(values),
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: RoleFormValues }) => mockRoleRepository.updateRole(id, values),
    onSuccess: invalidate,
  });

  return {
    listQuery,
    detailQuery,
    permissionsQuery,
    createRole: createMutation.mutateAsync,
    updateRole: updateMutation.mutateAsync,
    isSavingRole: createMutation.isPending || updateMutation.isPending,
  };
}
