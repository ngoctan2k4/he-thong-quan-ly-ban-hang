import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockCatalogRepository } from '../../../mocks/adminCatalogV1';
import type {
  BranchFilters,
  BranchFormValues,
  CategoryFilters,
  CategoryFormValues,
  UnitFilters,
  UnitFormValues,
  WarehouseFilters,
  WarehouseFormValues,
} from '../catalog.model';

const repository = mockCatalogRepository;
export const adminCatalogQueryKey = ['admin-catalog-v1'] as const;

export function useCatalogReferences() {
  return useQuery({
    queryKey: [...adminCatalogQueryKey, 'references'],
    queryFn: () => repository.listReferences(),
  });
}

export function useAdminCategories(filters: CategoryFilters, page: number, pageSize: number) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: adminCatalogQueryKey });
  const listQuery = useQuery({
    queryKey: [...adminCatalogQueryKey, 'categories', filters, page, pageSize],
    queryFn: () => repository.listCategories(filters, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const referencesQuery = useCatalogReferences();
  const createMutation = useMutation({ mutationFn: (values: CategoryFormValues) => repository.createCategory(values), onSuccess: invalidate });
  const updateMutation = useMutation({ mutationFn: ({ id, values }: { id: number; values: CategoryFormValues }) => repository.updateCategory(id, values), onSuccess: invalidate });
  const statusMutation = useMutation({ mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => repository.updateCategoryStatus(id, isActive), onSuccess: invalidate });
  return {
    listQuery,
    referencesQuery,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    updateCategoryStatus: statusMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isUpdatingStatus: statusMutation.isPending,
  };
}

export function useAdminUnits(filters: UnitFilters, page: number, pageSize: number) {
  const queryClient = useQueryClient();
  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: adminCatalogQueryKey }),
      queryClient.invalidateQueries({ queryKey: ['admin-products-v1'] }),
    ]);
  };
  const listQuery = useQuery({
    queryKey: [...adminCatalogQueryKey, 'units', filters, page, pageSize],
    queryFn: () => repository.listUnits(filters, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const createMutation = useMutation({ mutationFn: (values: UnitFormValues) => repository.createUnit(values), onSuccess: invalidate });
  const updateMutation = useMutation({ mutationFn: ({ id, values }: { id: number; values: UnitFormValues }) => repository.updateUnit(id, values), onSuccess: invalidate });
  const statusMutation = useMutation({ mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => repository.updateUnitStatus(id, isActive), onSuccess: invalidate });
  return {
    listQuery,
    createUnit: createMutation.mutateAsync,
    updateUnit: updateMutation.mutateAsync,
    updateUnitStatus: statusMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isUpdatingStatus: statusMutation.isPending,
  };
}

export function useAdminBranches(
  filters: BranchFilters,
  page: number,
  pageSize: number,
  selectedId?: number,
) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: adminCatalogQueryKey });
  const listQuery = useQuery({
    queryKey: [...adminCatalogQueryKey, 'branches', filters, page, pageSize],
    queryFn: () => repository.listBranches(filters, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const detailQuery = useQuery({
    queryKey: [...adminCatalogQueryKey, 'branch-detail', selectedId],
    queryFn: () => repository.getBranch(selectedId as number),
    enabled: selectedId !== undefined,
  });
  const createMutation = useMutation({ mutationFn: (values: BranchFormValues) => repository.createBranch(values), onSuccess: invalidate });
  const updateMutation = useMutation({ mutationFn: ({ id, values }: { id: number; values: BranchFormValues }) => repository.updateBranch(id, values), onSuccess: invalidate });
  const statusMutation = useMutation({ mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => repository.updateBranchStatus(id, isActive), onSuccess: invalidate });
  return {
    listQuery,
    detailQuery,
    createBranch: createMutation.mutateAsync,
    updateBranch: updateMutation.mutateAsync,
    updateBranchStatus: statusMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isUpdatingStatus: statusMutation.isPending,
  };
}

export function useAdminWarehouses(filters: WarehouseFilters, page: number, pageSize: number) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: adminCatalogQueryKey });
  const listQuery = useQuery({
    queryKey: [...adminCatalogQueryKey, 'warehouses', filters, page, pageSize],
    queryFn: () => repository.listWarehouses(filters, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const referencesQuery = useCatalogReferences();
  const createMutation = useMutation({ mutationFn: (values: WarehouseFormValues) => repository.createWarehouse(values), onSuccess: invalidate });
  const updateMutation = useMutation({ mutationFn: ({ id, values }: { id: number; values: WarehouseFormValues }) => repository.updateWarehouse(id, values), onSuccess: invalidate });
  const statusMutation = useMutation({ mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => repository.updateWarehouseStatus(id, isActive), onSuccess: invalidate });
  return {
    listQuery,
    referencesQuery,
    createWarehouse: createMutation.mutateAsync,
    updateWarehouse: updateMutation.mutateAsync,
    updateWarehouseStatus: statusMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isUpdatingStatus: statusMutation.isPending,
  };
}
