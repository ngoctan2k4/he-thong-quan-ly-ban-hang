import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { mockSalesOrderRepository } from '../../../mocks/adminSalesOrders';
import type { SalesOrderFilters, SalesPaymentFilters } from '../salesOrders.model';

const salesOrderRepository = mockSalesOrderRepository;
const salesOrdersQueryKey = ['admin-sales-orders'] as const;

interface UseAdminSalesOrdersParams {
  filters: SalesOrderFilters;
  page: number;
  pageSize: number;
  selectedOrderId?: number;
}

export function useAdminSalesOrders({
  filters,
  page,
  pageSize,
  selectedOrderId,
}: UseAdminSalesOrdersParams) {
  const listQuery = useQuery({
    queryKey: [...salesOrdersQueryKey, 'list', filters, page, pageSize],
    queryFn: () => salesOrderRepository.listOrders(filters, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const detailQuery = useQuery({
    queryKey: [...salesOrdersQueryKey, 'detail', selectedOrderId],
    queryFn: () => salesOrderRepository.getOrderById(selectedOrderId as number),
    enabled: selectedOrderId !== undefined,
  });
  const referenceQuery = useQuery({
    queryKey: [...salesOrdersQueryKey, 'references'],
    queryFn: () => salesOrderRepository.getReferenceData(),
  });

  return { listQuery, detailQuery, referenceQuery };
}

interface UseAdminSalesPaymentsParams {
  filters: SalesPaymentFilters;
  page: number;
  pageSize: number;
  selectedPaymentId?: number;
}

export function useAdminSalesPayments({
  filters,
  page,
  pageSize,
  selectedPaymentId,
}: UseAdminSalesPaymentsParams) {
  const listQuery = useQuery({
    queryKey: [...salesOrdersQueryKey, 'payments', filters, page, pageSize],
    queryFn: () => salesOrderRepository.listPayments(filters, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const detailQuery = useQuery({
    queryKey: [...salesOrdersQueryKey, 'payment-detail', selectedPaymentId],
    queryFn: () => salesOrderRepository.getPaymentById(selectedPaymentId as number),
    enabled: selectedPaymentId !== undefined,
  });

  return { listQuery, detailQuery };
}
