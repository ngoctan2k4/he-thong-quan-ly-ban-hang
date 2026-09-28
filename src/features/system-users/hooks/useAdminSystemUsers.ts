import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockSystemUserRepository } from '../../../mocks/adminSystemUsers';
import type { AdminUserFilters, UserFormValues } from '../systemUsers.model';

const repository = mockSystemUserRepository;
const systemUsersQueryKey = ['admin-system-users'] as const;

export function useAdminSystemUsers(filters: AdminUserFilters, page: number, pageSize: number, selectedUserId?: number) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: systemUsersQueryKey });
  const listQuery = useQuery({
    queryKey: [...systemUsersQueryKey, 'list', filters, page, pageSize],
    queryFn: () => repository.list(filters, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const detailQuery = useQuery({
    queryKey: [...systemUsersQueryKey, 'detail', selectedUserId],
    queryFn: () => repository.getById(selectedUserId as number),
    enabled: selectedUserId !== undefined,
  });
  const referencesQuery = useQuery({
    queryKey: [...systemUsersQueryKey, 'references'],
    queryFn: () => repository.listReferences(),
  });
  const createMutation = useMutation({ mutationFn: (values: UserFormValues) => repository.create(values), onSuccess: invalidate });
  const updateMutation = useMutation({ mutationFn: ({ id, values }: { id: number; values: UserFormValues }) => repository.update(id, values), onSuccess: invalidate });
  const statusMutation = useMutation({ mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => repository.updateStatus(id, isActive), onSuccess: invalidate });
  return {
    listQuery,
    detailQuery,
    referencesQuery,
    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    updateUserStatus: statusMutation.mutateAsync,
    isSavingUser: createMutation.isPending || updateMutation.isPending,
    isUpdatingStatus: statusMutation.isPending,
  };
}
