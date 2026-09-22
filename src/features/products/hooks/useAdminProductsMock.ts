import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createMockAdminProduct,
  listMockAdminProducts,
  updateMockAdminProduct,
  updateMockAdminProductStatus,
} from '../../../mocks/adminProducts';
import type { ProductStatus } from '../../../types/product';
import type { AdminProductFilters, ProductFormValues } from '../adminProducts.model';

const adminProductsQueryKey = ['admin-products-mock'] as const;

interface UseAdminProductsMockParams {
  filters: AdminProductFilters;
  page: number;
  pageSize: number;
}

export function useAdminProductsMock({ filters, page, pageSize }: UseAdminProductsMockParams) {
  const queryClient = useQueryClient();
  const listQuery = useQuery({
    queryKey: [...adminProductsQueryKey, filters, page, pageSize],
    queryFn: () => listMockAdminProducts(filters, page, pageSize),
    placeholderData: keepPreviousData,
  });

  const invalidateList = () => queryClient.invalidateQueries({ queryKey: adminProductsQueryKey });

  const createMutation = useMutation({
    mutationFn: (values: ProductFormValues) => createMockAdminProduct(values),
    onSuccess: invalidateList,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: ProductFormValues }) =>
      updateMockAdminProduct(id, values),
    onSuccess: invalidateList,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: Exclude<ProductStatus, 'OUT_OF_STOCK'> }) =>
      updateMockAdminProductStatus(id, status),
    onSuccess: invalidateList,
  });

  return {
    listQuery,
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    updateStatus: statusMutation.mutateAsync,
    isSavingProduct: createMutation.isPending || updateMutation.isPending,
    isUpdatingStatus: statusMutation.isPending,
  };
}
