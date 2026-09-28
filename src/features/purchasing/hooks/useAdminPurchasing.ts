import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockPurchasingRepository } from '../../../mocks/adminPurchasing';
import type {
  GoodsReceiptFilters,
  GoodsReceiptFormValues,
  PurchaseOrderFilters,
  PurchaseOrderFormValues,
} from '../purchasing.model';

const purchasingRepository = mockPurchasingRepository;
const purchasingQueryKey = ['admin-purchasing-v5'] as const;

interface PurchaseOrderListParams {
  filters: PurchaseOrderFilters;
  page: number;
  pageSize: number;
  selectedOrderId?: number;
}

export function usePurchaseOrderList({
  filters,
  page,
  pageSize,
  selectedOrderId,
}: PurchaseOrderListParams) {
  const queryClient = useQueryClient();
  const listQuery = useQuery({
    queryKey: [...purchasingQueryKey, 'purchase-orders', filters, page, pageSize],
    queryFn: () => purchasingRepository.listPurchaseOrders(filters, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const detailQuery = useQuery({
    queryKey: [...purchasingQueryKey, 'purchase-order-detail', selectedOrderId],
    queryFn: () => purchasingRepository.getPurchaseOrderById(selectedOrderId as number),
    enabled: selectedOrderId !== undefined,
  });
  const referencesQuery = useQuery({
    queryKey: [...purchasingQueryKey, 'references'],
    queryFn: () => purchasingRepository.getReferenceData(),
  });
  const cancelMutation = useMutation({
    mutationFn: (id: number) => purchasingRepository.cancelPurchaseOrder(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: purchasingQueryKey }),
  });

  return {
    listQuery,
    detailQuery,
    referencesQuery,
    cancelPurchaseOrder: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
  };
}

export function usePurchaseOrderForm(orderId?: number) {
  const queryClient = useQueryClient();
  const detailQuery = useQuery({
    queryKey: [...purchasingQueryKey, 'purchase-order-detail', orderId],
    queryFn: () => purchasingRepository.getPurchaseOrderById(orderId as number),
    enabled: orderId !== undefined,
  });
  const referencesQuery = useQuery({
    queryKey: [...purchasingQueryKey, 'references'],
    queryFn: () => purchasingRepository.getReferenceData(),
  });
  const createMutation = useMutation({
    mutationFn: (values: PurchaseOrderFormValues) =>
      purchasingRepository.createPurchaseOrder(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: purchasingQueryKey }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: PurchaseOrderFormValues }) =>
      purchasingRepository.updatePurchaseOrder(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: purchasingQueryKey }),
  });

  return {
    detailQuery,
    referencesQuery,
    createPurchaseOrder: createMutation.mutateAsync,
    updatePurchaseOrder: updateMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}

interface GoodsReceiptListParams {
  filters: GoodsReceiptFilters;
  page: number;
  pageSize: number;
  selectedReceiptId?: number;
}

export function useGoodsReceiptList({
  filters,
  page,
  pageSize,
  selectedReceiptId,
}: GoodsReceiptListParams) {
  const queryClient = useQueryClient();
  const listQuery = useQuery({
    queryKey: [...purchasingQueryKey, 'goods-receipts', filters, page, pageSize],
    queryFn: () => purchasingRepository.listGoodsReceipts(filters, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const detailQuery = useQuery({
    queryKey: [...purchasingQueryKey, 'goods-receipt-detail', selectedReceiptId],
    queryFn: () => purchasingRepository.getGoodsReceiptById(selectedReceiptId as number),
    enabled: selectedReceiptId !== undefined,
  });
  const referencesQuery = useQuery({
    queryKey: [...purchasingQueryKey, 'references'],
    queryFn: () => purchasingRepository.getReferenceData(),
  });
  const cancelMutation = useMutation({
    mutationFn: (id: number) => purchasingRepository.cancelGoodsReceipt(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: purchasingQueryKey }),
  });

  return {
    listQuery,
    detailQuery,
    referencesQuery,
    cancelGoodsReceipt: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
  };
}

export function useGoodsReceiptForm() {
  const queryClient = useQueryClient();
  const referencesQuery = useQuery({
    queryKey: [...purchasingQueryKey, 'references'],
    queryFn: () => purchasingRepository.getReferenceData(),
  });
  const createMutation = useMutation({
    mutationFn: (values: GoodsReceiptFormValues) =>
      purchasingRepository.createGoodsReceipt(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: purchasingQueryKey }),
  });

  return {
    referencesQuery,
    createGoodsReceipt: createMutation.mutateAsync,
    isSaving: createMutation.isPending,
  };
}
