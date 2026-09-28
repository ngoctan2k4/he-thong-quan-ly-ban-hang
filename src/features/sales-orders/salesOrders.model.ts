import type {
  OrderChannel,
  OrderPaymentMethod,
  OrderPaymentStatus,
  PaymentTransactionStatus,
  SalesOrder,
  SalesOrderDelivery,
  SalesOrderItem,
  SalesOrderPayment,
  SalesOrderStatus,
} from '../../types/order';

export type SalesOrderStatusFilter = 'ALL' | SalesOrderStatus;
export type SalesOrderPaymentStatusFilter = 'ALL' | OrderPaymentStatus;
export type SalesOrderChannelFilter = 'ALL' | OrderChannel;
export type SalesPaymentMethodFilter = 'ALL' | OrderPaymentMethod;
export type SalesPaymentStatusFilter = 'ALL' | PaymentTransactionStatus;

export interface SalesOrderFilters {
  keyword: string;
  channel: SalesOrderChannelFilter;
  status: SalesOrderStatusFilter;
  paymentStatus: SalesOrderPaymentStatusFilter;
  branchId?: number;
  warehouseId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface SalesPaymentFilters {
  orderCode: string;
  method: SalesPaymentMethodFilter;
  status: SalesPaymentStatusFilter;
  dateFrom?: string;
  dateTo?: string;
}

export interface SalesOrderRecord extends SalesOrder {
  customerName: string;
  branchName: string;
  warehouseName: string;
}

export interface SalesOrderItemRecord extends SalesOrderItem {
  productCode: string;
  productName: string;
  unitName: string;
}

export interface SalesOrderDetail extends SalesOrderRecord {
  approverName: string | null;
  items: SalesOrderItemRecord[];
  payments: SalesOrderPayment[];
  deliveries: SalesOrderDelivery[];
}

export interface SalesPaymentRecord extends SalesOrderPayment {
  orderCode: string;
  customerName: string;
}

export interface SalesOrderListResult {
  content: SalesOrderRecord[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface SalesPaymentListResult {
  content: SalesPaymentRecord[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface SalesReferenceOption {
  value: number;
  label: string;
}

export interface SalesOrderReferenceData {
  branches: SalesReferenceOption[];
  warehouses: SalesReferenceOption[];
}

export const initialSalesOrderFilters: SalesOrderFilters = {
  keyword: '',
  channel: 'ALL',
  status: 'ALL',
  paymentStatus: 'ALL',
};

export const initialSalesPaymentFilters: SalesPaymentFilters = {
  orderCode: '',
  method: 'ALL',
  status: 'ALL',
};
