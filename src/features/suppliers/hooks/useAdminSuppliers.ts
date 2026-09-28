import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockSupplierRepository } from '../../../mocks/adminSuppliers';
import type {
  AdminSupplierFilters,
  SupplierFormValues,
  SupplierProductFormValues,
} from '../suppliers.model';

const supplierRepository = mockSupplierRepository;
const adminSuppliersQueryKey = ['admin-suppliers'] as const;

interface UseAdminSuppliersParams {
  filters: AdminSupplierFilters;
  page: number;
  pageSize: number;
  selectedSupplierId?: number;
}

export function useAdminSuppliers({
  filters,
  page,
  pageSize,
  selectedSupplierId,
}: UseAdminSuppliersParams) {
  const queryClient = useQueryClient();
  const listQuery = useQuery({
    queryKey: [...adminSuppliersQueryKey, 'list', filters, page, pageSize],
    queryFn: () => supplierRepository.list(filters, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const detailQuery = useQuery({
    queryKey: [...adminSuppliersQueryKey, 'detail', selectedSupplierId],
    queryFn: () => supplierRepository.getById(selectedSupplierId as number),
    enabled: selectedSupplierId !== undefined,
  });
  const productReferencesQuery = useQuery({
    queryKey: [...adminSuppliersQueryKey, 'product-references'],
    queryFn: () => supplierRepository.listProductReferences(),
  });

  const invalidateSuppliers = () => queryClient.invalidateQueries({ queryKey: adminSuppliersQueryKey });
  const createMutation = useMutation({
    mutationFn: (values: SupplierFormValues) => supplierRepository.create(values),
    onSuccess: invalidateSuppliers,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: SupplierFormValues }) =>
      supplierRepository.update(id, values),
    onSuccess: invalidateSuppliers,
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      supplierRepository.updateStatus(id, isActive),
    onSuccess: invalidateSuppliers,
  });
  const linkProductMutation = useMutation({
    mutationFn: ({ supplierId, values }: { supplierId: number; values: SupplierProductFormValues }) =>
      supplierRepository.linkProduct(supplierId, values),
    onSuccess: invalidateSuppliers,
  });
  const updateProductMutation = useMutation({
    mutationFn: ({
      supplierId,
      relationId,
      values,
    }: {
      supplierId: number;
      relationId: number;
      values: SupplierProductFormValues;
    }) => supplierRepository.updateProductLink(supplierId, relationId, values),
    onSuccess: invalidateSuppliers,
  });
  const unlinkProductMutation = useMutation({
    mutationFn: ({ supplierId, relationId }: { supplierId: number; relationId: number }) =>
      supplierRepository.unlinkProduct(supplierId, relationId),
    onSuccess: invalidateSuppliers,
  });

  return {
    listQuery,
    detailQuery,
    productReferencesQuery,
    createSupplier: createMutation.mutateAsync,
    updateSupplier: updateMutation.mutateAsync,
    updateSupplierStatus: statusMutation.mutateAsync,
    linkProduct: linkProductMutation.mutateAsync,
    updateProductLink: updateProductMutation.mutateAsync,
    unlinkProduct: unlinkProductMutation.mutateAsync,
    isSavingSupplier: createMutation.isPending || updateMutation.isPending,
    isUpdatingStatus: statusMutation.isPending,
    isSavingProductLink: linkProductMutation.isPending || updateProductMutation.isPending,
    isRemovingProductLink: unlinkProductMutation.isPending,
  };
}
