import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createMockAdminMaterial,
  isMockAdminMaterialCodeTaken,
  listMockAdminMaterials,
  updateMockAdminMaterial,
} from '../../../mocks/adminMaterials';
import type { AdminMaterialFilters, MaterialFormValues } from '../materials.model';

const adminMaterialsQueryKey = ['admin-materials-mock'] as const;

interface UseAdminMaterialsMockParams {
  filters: AdminMaterialFilters;
  page: number;
  pageSize: number;
}

export function useAdminMaterialsMock({ filters, page, pageSize }: UseAdminMaterialsMockParams) {
  const queryClient = useQueryClient();
  const listQuery = useQuery({
    queryKey: [...adminMaterialsQueryKey, filters, page, pageSize],
    queryFn: () => listMockAdminMaterials(filters, page, pageSize),
    placeholderData: keepPreviousData,
  });

  const invalidateList = () => queryClient.invalidateQueries({ queryKey: adminMaterialsQueryKey });

  const createMutation = useMutation({
    mutationFn: (values: MaterialFormValues) => createMockAdminMaterial(values),
    onSuccess: invalidateList,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: MaterialFormValues }) =>
      updateMockAdminMaterial(id, values),
    onSuccess: invalidateList,
  });

  return {
    listQuery,
    createMaterial: createMutation.mutateAsync,
    updateMaterial: updateMutation.mutateAsync,
    checkCodeTaken: isMockAdminMaterialCodeTaken,
    isSavingMaterial: createMutation.isPending || updateMutation.isPending,
  };
}
