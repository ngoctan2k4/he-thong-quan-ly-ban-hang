export type PaymentSide = 'CUSTOMER' | 'SUPPLIER';

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'OTHER';

export type PaymentTransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export type PaymentScheduleStatus = 'PAID' | 'PARTIAL' | 'OVERDUE' | 'DUE' | 'UPCOMING';

export type DebtStatus = 'PAID' | 'PARTIAL' | 'OVERDUE' | 'UPCOMING';

export interface PaymentPartner {
  id: string;
  code: string;
  name: string;
}

export interface DebtOrder {
  id: string;
  code: string;
  partnerId: string;
  orderDate: string;
  totalAmount: number;
}

export interface PaymentSchedule {
  id: string;
  orderId: string;
  installmentNo: number;
  amount: number;
  dueDate: string;
  paidAmount: number;
}

export interface PaymentTransaction {
  id: string;
  code: string;
  partnerId: string;
  orderId: string;
  scheduleId: string;
  amount: number;
  paidDate: string;
  method: PaymentMethod;
  recordedBy: string;
  referenceCode?: string;
  note?: string;
  status: PaymentTransactionStatus;
}

export interface PaymentDataset {
  partners: PaymentPartner[];
  orders: DebtOrder[];
  schedules: PaymentSchedule[];
  transactions: PaymentTransaction[];
}

export interface PaymentReferenceData extends Omit<PaymentDataset, 'transactions'> {}

export interface TransactionListItem extends PaymentTransaction {
  partnerCode: string;
  partnerName: string;
  orderCode: string;
  installmentNo: number;
}

export interface OrderDebtSummary extends DebtOrder {
  paidAmount: number;
  remainingAmount: number;
  overdueAmount: number;
  notDueAmount: number;
  nearestDueDate?: string;
  status: DebtStatus;
}

export interface PartnerDebtSummary extends PaymentPartner {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  overdueAmount: number;
  notDueAmount: number;
  openOrderCount: number;
  nearestDueDate?: string;
  status: DebtStatus;
}

export interface PartnerDebtDetail {
  summary: PartnerDebtSummary;
  orders: OrderDebtSummary[];
  schedules: PaymentSchedule[];
  transactions: PaymentTransaction[];
}

export interface DebtTotals {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  overdueAmount: number;
}

export interface TransactionFilters {
  keyword: string;
  partnerId?: string;
  orderId?: string;
  method?: PaymentMethod;
  status?: PaymentTransactionStatus;
  dateFrom?: string;
  dateTo?: string;
}

export interface DebtFilters {
  keyword: string;
  status?: DebtStatus;
  overdueOnly: boolean;
  dueFrom?: string;
  dueTo?: string;
}

export interface PaginatedResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

export interface PartnerDebtListResult extends PaginatedResult<PartnerDebtSummary> {
  totals: DebtTotals;
}

export interface RecordPaymentInput {
  partnerId: string;
  orderId: string;
  scheduleId: string;
  amount: number;
  paidDate: string;
  method: PaymentMethod;
  referenceCode?: string;
  note?: string;
}

export const initialTransactionFilters: TransactionFilters = {
  keyword: '',
};

export const initialDebtFilters: DebtFilters = {
  keyword: '',
  overdueOnly: false,
};
