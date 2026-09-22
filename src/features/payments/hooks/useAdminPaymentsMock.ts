import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMockPartnerDebtDetail,
  getMockPaymentReferenceData,
  listMockPartnerDebts,
  listMockPaymentTransactions,
  recordMockPayment,
  resetMockPayments,
} from '../../../mocks/adminPayments';
import type {
  DebtFilters,
  PaymentSide,
  RecordPaymentInput,
  TransactionFilters,
} from '../payments.model';

const paymentQueryKey = ['admin-payments-mock'] as const;

export function usePaymentReferenceData(side: PaymentSide) {
  return useQuery({
    queryKey: [...paymentQueryKey, side, 'reference'],
    queryFn: () => getMockPaymentReferenceData(side),
  });
}

export function usePaymentTransactionsMock(
  side: PaymentSide,
  filters: TransactionFilters,
  page: number,
  pageSize: number,
) {
  return useQuery({
    queryKey: [...paymentQueryKey, side, 'transactions', filters, page, pageSize],
    queryFn: () => listMockPaymentTransactions(side, filters, page, pageSize),
    placeholderData: keepPreviousData,
  });
}

export function usePartnerDebtsMock(
  side: PaymentSide,
  filters: DebtFilters,
  page: number,
  pageSize: number,
) {
  return useQuery({
    queryKey: [...paymentQueryKey, side, 'debts', filters, page, pageSize],
    queryFn: () => listMockPartnerDebts(side, filters, page, pageSize),
    placeholderData: keepPreviousData,
  });
}

export function usePartnerDebtDetailMock(side: PaymentSide, partnerId?: string) {
  return useQuery({
    queryKey: [...paymentQueryKey, side, 'debt-detail', partnerId],
    queryFn: () => getMockPartnerDebtDetail(side, partnerId as string),
    enabled: Boolean(partnerId),
  });
}

export function usePaymentActions(side: PaymentSide) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: paymentQueryKey });
  const recordMutation = useMutation({
    mutationFn: (values: RecordPaymentInput) => recordMockPayment(side, values),
    onSuccess: invalidate,
  });

  const reset = async () => {
    resetMockPayments(side);
    await invalidate();
  };

  return {
    recordPayment: recordMutation.mutateAsync,
    isRecording: recordMutation.isPending,
    reset,
  };
}
