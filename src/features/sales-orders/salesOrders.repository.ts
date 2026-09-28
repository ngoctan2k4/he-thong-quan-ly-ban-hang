import type {
  SalesOrderDetail,
  SalesOrderFilters,
  SalesOrderListResult,
  SalesOrderReferenceData,
  SalesPaymentFilters,
  SalesPaymentListResult,
  SalesPaymentRecord,
} from './salesOrders.model';

export interface SalesOrderRepository {
  listOrders(
    filters: SalesOrderFilters,
    page: number,
    pageSize: number,
  ): Promise<SalesOrderListResult>;
  getOrderById(id: number): Promise<SalesOrderDetail>;
  listPayments(
    filters: SalesPaymentFilters,
    page: number,
    pageSize: number,
  ): Promise<SalesPaymentListResult>;
  getPaymentById(id: number): Promise<SalesPaymentRecord>;
  getReferenceData(): Promise<SalesOrderReferenceData>;
}
