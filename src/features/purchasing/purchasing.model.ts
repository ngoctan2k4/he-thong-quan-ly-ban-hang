import type {
  GoodsReceipt,
  GoodsReceiptDiscrepancyType,
  GoodsReceiptItem,
  GoodsReceiptStatus,
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseOrderStatus,
  PurchaseSourceType,
} from '../../types/purchase';

export type PurchaseOrderStatusFilter = 'ALL' | PurchaseOrderStatus;
export type PurchaseSourceTypeFilter = 'ALL' | PurchaseSourceType;
export type GoodsReceiptStatusFilter = 'ALL' | GoodsReceiptStatus;

export interface PurchaseOrderFilters {
  keyword: string;
  retailOnly?: boolean;
  supplierId?: number;
  warehouseId?: number;
  status: PurchaseOrderStatusFilter;
  sourceType: PurchaseSourceTypeFilter;
  orderDateFrom?: string;
  orderDateTo?: string;
  expectedDate?: string;
}

export interface GoodsReceiptFilters {
  keyword: string;
  purchaseOrderCode: string;
  supplierId?: number;
  warehouseId?: number;
  status: GoodsReceiptStatusFilter;
  receivedDateFrom?: string;
  receivedDateTo?: string;
}

export interface PurchaseOrderRecord extends PurchaseOrder {
  supplierName: string;
  warehouseName: string;
  approverName: string | null;
  creatorName: string;
}

export interface PurchaseOrderItemRecord extends PurchaseOrderItem {
  productCode: string;
  productName: string;
  unitName: string;
}

export interface GoodsReceiptRecord extends GoodsReceipt {
  purchaseOrderCode: string | null;
  supplierName: string;
  warehouseName: string;
  creatorName: string;
  confirmerName: string | null;
}

export interface GoodsReceiptItemRecord extends GoodsReceiptItem {
  productCode: string;
  productName: string;
  unitName: string;
}

export interface PurchaseOrderDetail extends PurchaseOrderRecord {
  items: PurchaseOrderItemRecord[];
  receipts: GoodsReceiptRecord[];
}

export interface GoodsReceiptDetail extends GoodsReceiptRecord {
  items: GoodsReceiptItemRecord[];
}

export interface PurchaseOrderListResult {
  content: PurchaseOrderRecord[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface GoodsReceiptListResult {
  content: GoodsReceiptRecord[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface PurchaseReferenceOption {
  value: number;
  label: string;
  code?: string;
}

export interface PurchaseUnitReference {
  id: number;
  name: string;
  conversionFactor: number;
}

export interface PurchaseProductReference {
  id: number;
  code: string;
  name: string;
  defaultUnitId: number;
  suggestedUnitCost: number;
  units: PurchaseUnitReference[];
}

export interface PurchaseReferenceData {
  suppliers: PurchaseReferenceOption[];
  warehouses: PurchaseReferenceOption[];
  products: PurchaseProductReference[];
  receivablePurchaseOrders: PurchaseOrderDetail[];
}

export interface PurchaseOrderItemFormValues {
  id?: number;
  productId: number;
  unitId: number;
  orderedQty: number;
  conversionFactor: number;
  unitPrice: number;
}

export interface PurchaseOrderFormValues {
  supplierId: number;
  warehouseId: number;
  orderDate: string;
  expectedDate: string;
  requiresApproval: boolean;
  orderKind: PurchaseOrder['orderKind'];
  note?: string;
  items: PurchaseOrderItemFormValues[];
}

export interface GoodsReceiptItemFormValues {
  purchaseOrderItemId?: number;
  productId: number;
  unitId: number;
  receivedQty: number;
  conversionFactor: number;
  damagedQty: number;
  unitCost: number;
  discrepancyType: GoodsReceiptDiscrepancyType;
  note?: string;
}

export interface GoodsReceiptFormValues {
  purchaseOrderId?: number;
  supplierId: number;
  warehouseId: number;
  receivedDate: string;
  note?: string;
  items: GoodsReceiptItemFormValues[];
}

export const initialPurchaseOrderFilters: PurchaseOrderFilters = {
  keyword: '',
  status: 'ALL',
  sourceType: 'ALL',
};

export const initialGoodsReceiptFilters: GoodsReceiptFilters = {
  keyword: '',
  purchaseOrderCode: '',
  status: 'ALL',
};
