export type OrderStatus =
  | 'DRAFT'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export type OrderChannel = 'WEBSITE' | 'POS' | 'WHOLESALE';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  code: string;
  customerId?: number;
  channel: OrderChannel;
  status: OrderStatus;
  createdAt: string;
  totalAmount: number;
  items: OrderItem[];
}

// V4 sales contracts used by the Admin sales module. The legacy Order shape
// above remains unchanged because it is consumed by the Customer Website and POS.
export type SalesOrderStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export type OrderPaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'FAILED' | 'REFUNDED';
export type OrderPaymentMethod = 'CASH' | 'CARD' | 'TRANSFER' | 'COD' | 'CREDIT';
export type PaymentTransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type DeliveryStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'RETURNED' | 'FAILED';

export interface SalesOrder {
  id: number;
  code: string;
  channel: OrderChannel;
  customerId: number | null;
  branchId: number;
  warehouseId: number;
  status: SalesOrderStatus;
  orderDate: string;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  paymentStatus: OrderPaymentStatus;
  paymentMethod: OrderPaymentMethod;
  requiresApproval: boolean;
  approvedBy: number | null;
  approvedAt: string | null;
  cancelReason: string | null;
  note: string | null;
  version: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrderItem {
  id: number;
  orderId: number;
  productId: number;
  unitId: number;
  quantity: number;
  conversionFactor: number;
  baseQuantity: number;
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;
  issuedQuantity: number;
  note: string | null;
}

export interface SalesOrderPayment {
  id: number;
  orderId: number;
  method: OrderPaymentMethod;
  amount: number;
  status: PaymentTransactionStatus;
  referenceNo: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface SalesOrderDelivery {
  id: number;
  orderId: number;
  receiverName: string;
  phone: string;
  addressLine: string;
  ward: string;
  district: string;
  province: string;
  carrier: string | null;
  trackingNo: string | null;
  status: DeliveryStatus;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
}
