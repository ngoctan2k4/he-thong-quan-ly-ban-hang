import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pricingApiRepository } from '../pricing.api-repository';
import type { PriceListFilters, PriceListFormValues, PriceTierFormValues } from '../pricing.model';

const pricingQueryKey = ['admin-pricing-v1'] as const;

export function useAdminPricing(
  filters: PriceListFilters,
  page: number,
  pageSize: number,
  selectedPriceListId?: number,
) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: pricingQueryKey });
  const listQuery = useQuery({
    queryKey: [...pricingQueryKey, 'list', filters, page, pageSize],
    queryFn: () => pricingApiRepository.listPriceLists(filters, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const detailQuery = useQuery({
    queryKey: [...pricingQueryKey, 'detail', selectedPriceListId],
    queryFn: () => pricingApiRepository.getPriceList(selectedPriceListId as number),
    enabled: selectedPriceListId !== undefined,
  });
  const productsQuery = useQuery({
    queryKey: [...pricingQueryKey, 'products'],
    queryFn: () => pricingApiRepository.listProductOptions(),
  });
  const createPriceListMutation = useMutation({
    mutationFn: (values: PriceListFormValues) => pricingApiRepository.createPriceList(values),
    onSuccess: invalidate,
  });
  const updatePriceListMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: PriceListFormValues }) => pricingApiRepository.updatePriceList(id, values),
    onSuccess: invalidate,
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => pricingApiRepository.updatePriceListStatus(id, isActive),
    onSuccess: invalidate,
  });
  const createTierMutation = useMutation({
    mutationFn: ({ priceListId, values }: { priceListId: number; values: PriceTierFormValues }) => pricingApiRepository.createTier(priceListId, values),
    onSuccess: invalidate,
  });
  const updateTierMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: PriceTierFormValues }) => pricingApiRepository.updateTier(id, values),
    onSuccess: invalidate,
  });
  const deleteTierMutation = useMutation({
    mutationFn: (id: number) => pricingApiRepository.deleteTier(id),
    onSuccess: invalidate,
  });

  return {
    listQuery,
    detailQuery,
    productsQuery,
    createPriceList: createPriceListMutation.mutateAsync,
    updatePriceList: updatePriceListMutation.mutateAsync,
    updatePriceListStatus: statusMutation.mutateAsync,
    createTier: createTierMutation.mutateAsync,
    updateTier: updateTierMutation.mutateAsync,
    deleteTier: deleteTierMutation.mutateAsync,
    isSavingPriceList: createPriceListMutation.isPending || updatePriceListMutation.isPending,
    isUpdatingStatus: statusMutation.isPending,
    isSavingTier: createTierMutation.isPending || updateTierMutation.isPending,
    isDeletingTier: deleteTierMutation.isPending,
  };
}
