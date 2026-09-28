import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockAdminProductsRepository } from '../../../mocks/adminProducts';
import type {
  AdminProductFilters,
  AdminProductStatus,
  ProductFormValues,
} from '../adminProducts.model';
import type { ProductConversionFormValues } from '../products.repository';

const repository = mockAdminProductsRepository;
const adminProductsQueryKey = ['admin-products-v1'] as const;

interface UseAdminProductsMockParams {
  filters: AdminProductFilters;
  page: number;
  pageSize: number;
  selectedProductId?: number;
}

export function useAdminProductsMock({ filters, page, pageSize, selectedProductId }: UseAdminProductsMockParams) {
  const queryClient = useQueryClient();
  const listQuery = useQuery({
    queryKey: [...adminProductsQueryKey, 'list', filters, page, pageSize],
    queryFn: () => repository.list(filters, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const referencesQuery = useQuery({
    queryKey: [...adminProductsQueryKey, 'references'],
    queryFn: () => repository.listReferences(),
  });
  const conversionsQuery = useQuery({
    queryKey: [...adminProductsQueryKey, 'conversions', selectedProductId],
    queryFn: () => repository.listConversions(selectedProductId as number),
    enabled: selectedProductId !== undefined,
  });

  const invalidateProducts = () => queryClient.invalidateQueries({ queryKey: adminProductsQueryKey });
  const createMutation = useMutation({ mutationFn: (values: ProductFormValues) => repository.create(values), onSuccess: invalidateProducts });
  const updateMutation = useMutation({ mutationFn: ({ id, values }: { id: number; values: ProductFormValues }) => repository.update(id, values), onSuccess: invalidateProducts });
  const activeMutation = useMutation({ mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => repository.updateActive(id, isActive), onSuccess: invalidateProducts });
  const statusMutation = useMutation({ mutationFn: ({ id, status }: { id: number; status: AdminProductStatus }) => repository.updateStatus(id, status), onSuccess: invalidateProducts });
  const createConversionMutation = useMutation({ mutationFn: ({ productId, values }: { productId: number; values: ProductConversionFormValues }) => repository.createConversion(productId, values), onSuccess: invalidateProducts });
  const updateConversionMutation = useMutation({ mutationFn: ({ id, factor }: { id: number; factor: number }) => repository.updateConversion(id, factor), onSuccess: invalidateProducts });
  const deleteConversionMutation = useMutation({ mutationFn: (id: number) => repository.deleteConversion(id), onSuccess: invalidateProducts });

  return {
    listQuery,
    referencesQuery,
    conversionsQuery,
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    updateActive: activeMutation.mutateAsync,
    updateStatus: statusMutation.mutateAsync,
    createConversion: createConversionMutation.mutateAsync,
    updateConversion: updateConversionMutation.mutateAsync,
    deleteConversion: deleteConversionMutation.mutateAsync,
    isSavingProduct: createMutation.isPending || updateMutation.isPending,
    isUpdatingStatus: activeMutation.isPending || statusMutation.isPending,
    isSavingConversion: createConversionMutation.isPending || updateConversionMutation.isPending,
    isDeletingConversion: deleteConversionMutation.isPending,
  };
}
