/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { catalogProducts, customerProfiles, seedOrders, type CatalogProduct } from '../../mocks/commerce';
import type { Customer } from '../../types/customer';
import type { Order, OrderChannel } from '../../types/order';
import { getUnitPrice } from './pricing';

export interface CartLine {
  product: CatalogProduct;
  quantity: number;
}

interface CreateOrderInput {
  channel: OrderChannel;
  customer: Customer;
  lines: CartLine[];
  paymentMethod?: string;
}

interface CommerceContextValue {
  products: CatalogProduct[];
  customers: Customer[];
  activeCustomer: Customer;
  setActiveCustomer: (customer: Customer) => void;
  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: CatalogProduct, quantity?: number) => { ok: boolean; message?: string };
  updateCartQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (input: CreateOrderInput) => Order;
  cancelOrder: (id: number) => void;
}

const CommerceContext = createContext<CommerceContextValue | null>(null);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [activeCustomer, setActiveCustomer] = useState(customerProfiles[0]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>(seedOrders);

  const addToCart = (product: CatalogProduct, quantity = 1) => {
    if (product.status !== 'ACTIVE' || product.availableStock <= 0) return { ok: false, message: 'Sản phẩm đang hết hàng.' };
    const current = cart.find((line) => line.product.id === product.id)?.quantity ?? 0;
    if (current + quantity > product.availableStock) return { ok: false, message: `Chỉ còn ${product.availableStock} ${product.unit} trong kho.` };
    setCart((lines) => {
      const found = lines.find((line) => line.product.id === product.id);
      if (!found) return [...lines, { product, quantity }];
      return lines.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + quantity } : line);
    });
    return { ok: true };
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    setCart((lines) => lines.map((line) => line.product.id === productId
      ? { ...line, quantity: Math.min(Math.max(1, quantity), line.product.availableStock) }
      : line));
  };

  const removeFromCart = (productId: number) => setCart((lines) => lines.filter((line) => line.product.id !== productId));
  const clearCart = () => setCart([]);

  const createOrder = ({ channel, customer, lines }: CreateOrderInput) => {
    const now = new Date();
    const items = lines.map((line, index) => {
      const unitPrice = getUnitPrice(line.product, line.quantity, customer.type);
      return { id: Date.now() + index, productId: line.product.id, productName: line.product.name, quantity: line.quantity, unitPrice, subtotal: unitPrice * line.quantity };
    });
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    const overCredit = customer.type === 'WHOLESALE' && totalAmount + (customer.creditUsed ?? 0) > (customer.creditLimit ?? 0);
    const needsApproval = customer.type === 'WHOLESALE' && (overCredit || totalAmount >= 20_000_000);
    const id = Math.max(1000, ...orders.map((order) => order.id)) + 1;
    const order: Order = {
      id,
      code: `${channel === 'POS' ? 'POS' : customer.type === 'WHOLESALE' ? 'WHO' : 'WEB'}-${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(id).slice(-3)}`,
      customerId: customer.id,
      channel,
      status: needsApproval ? 'DRAFT' : channel === 'POS' ? 'COMPLETED' : 'CONFIRMED',
      createdAt: now.toISOString(),
      totalAmount,
      items,
    };
    setOrders((current) => [order, ...current]);
    return order;
  };

  const cancelOrder = (id: number) => setOrders((current) => current.map((order) => order.id === id ? { ...order, status: 'CANCELLED' } : order));

  const cartTotal = cart.reduce((sum, line) => sum + getUnitPrice(line.product, line.quantity, activeCustomer.type) * line.quantity, 0);
  const value = {
    products: catalogProducts,
    customers: customerProfiles,
    activeCustomer,
    setActiveCustomer,
    cart,
    cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
    cartTotal,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    orders,
    createOrder,
    cancelOrder,
  };

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) throw new Error('useCommerce must be used inside CommerceProvider');
  return context;
}


