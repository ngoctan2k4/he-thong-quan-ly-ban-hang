import type {
  GoodsReceiptDetail,
  GoodsReceiptFilters,
  GoodsReceiptFormValues,
  GoodsReceiptListResult,
  PurchaseOrderDetail,
  PurchaseOrderFilters,
  PurchaseOrderFormValues,
  PurchaseOrderListResult,
  PurchaseReferenceData,
} from './purchasing.model';

export interface PurchasingRepository {
  listPurchaseOrders(
    filters: PurchaseOrderFilters,
    page: number,
    pageSize: number,
  ): Promise<PurchaseOrderListResult>;
  getPurchaseOrderById(id: number): Promise<PurchaseOrderDetail>;
  createPurchaseOrder(values: PurchaseOrderFormValues): Promise<PurchaseOrderDetail>;
  updatePurchaseOrder(id: number, values: PurchaseOrderFormValues): Promise<PurchaseOrderDetail>;
  cancelPurchaseOrder(id: number): Promise<PurchaseOrderDetail>;
  listGoodsReceipts(
    filters: GoodsReceiptFilters,
    page: number,
    pageSize: number,
  ): Promise<GoodsReceiptListResult>;
  getGoodsReceiptById(id: number): Promise<GoodsReceiptDetail>;
  createGoodsReceipt(values: GoodsReceiptFormValues): Promise<GoodsReceiptDetail>;
  cancelGoodsReceipt(id: number): Promise<GoodsReceiptDetail>;
  getReferenceData(): Promise<PurchaseReferenceData>;
}
