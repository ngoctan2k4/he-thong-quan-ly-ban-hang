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
