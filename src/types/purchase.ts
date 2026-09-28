export type PurchaseOrderStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'CONFIRMED'
  | 'PARTIALLY_RECEIVED'
  | 'RECEIVED_FULL'
  | 'RECEIVED_PARTIAL'
  | 'RECEIVED_WITH_DISCREPANCY'
  | 'CANCELLED'
  | 'REJECTED';

export type PurchaseSourceType = 'MANUAL' | 'AI_PROPOSAL' | 'RULE_ENGINE';

export interface PurchaseOrder {
  id: number;
  code: string;
  supplierId: number;
  warehouseId: number;
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDate: string;
  totalAmount: number;
  requiresApproval: boolean;
  approvedBy: number | null;
  approvedAt: string | null;
  sourceType: PurchaseSourceType;
  note: string | null;
  version: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: number;
  purchaseOrderId: number;
  productId: number;
  unitId: number;
  conversionFactor: number;
  orderedQty: number;
  baseOrderedQty: number;
  receivedQty: number;
  unitPrice: number;
  lineTotal: number;
}

export type GoodsReceiptStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'CONFIRMED'
  | 'CANCELLED';

export type GoodsReceiptDiscrepancyType =
  | 'NONE'
  | 'SHORTAGE'
  | 'OVERAGE'
  | 'DAMAGED'
  | 'WRONG_ITEM';

export interface GoodsReceipt {
  id: number;
  code: string;
  purchaseOrderId: number | null;
  supplierId: number;
  warehouseId: number;
  status: GoodsReceiptStatus;
  receivedDate: string;
  totalAmount: number;
  note: string | null;
  createdBy: number;
  confirmedBy: number | null;
  confirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GoodsReceiptItem {
  id: number;
  goodsReceiptId: number;
  purchaseOrderItemId: number | null;
  productId: number;
  unitId: number;
  conversionFactor: number;
  receivedQty: number;
  baseReceivedQty: number;
  damagedQty: number;
  unitCost: number;
  discrepancyType: GoodsReceiptDiscrepancyType;
  note: string | null;
}
