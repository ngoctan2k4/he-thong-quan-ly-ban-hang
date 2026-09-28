import dayjs from 'dayjs';
import type {
  DeliveryStatus,
  OrderChannel,
  OrderPaymentMethod,
  OrderPaymentStatus,
  PaymentTransactionStatus,
  SalesOrderDelivery,
  SalesOrderStatus,
} from '../../types/order';

export const channelLabels: Record<OrderChannel, string> = {
  WEBSITE: 'Website',
  POS: 'POS',
  WHOLESALE: 'Wholesale',
};

export const orderStatusLabels: Record<SalesOrderStatus, string> = {
  DRAFT: 'Nháp',
  PENDING_APPROVAL: 'Chờ phê duyệt',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  REJECTED: 'Bị từ chối',
};

export const orderPaymentStatusLabels: Record<OrderPaymentStatus, string> = {
  UNPAID: 'Chưa thanh toán',
  PARTIAL: 'Thanh toán một phần',
  PAID: 'Đã thanh toán',
  FAILED: 'Thanh toán lỗi',
  REFUNDED: 'Đã hoàn tiền',
};

export const paymentMethodLabels: Record<OrderPaymentMethod, string> = {
  CASH: 'Tiền mặt',
  CARD: 'Thẻ',
  TRANSFER: 'Chuyển khoản',
  COD: 'COD',
  CREDIT: 'Công nợ',
};

export const paymentTransactionStatusLabels: Record<PaymentTransactionStatus, string> = {
  PENDING: 'Đang chờ',
  SUCCESS: 'Thành công',
  FAILED: 'Thất bại',
  REFUNDED: 'Đã hoàn tiền',
};

export const deliveryStatusLabels: Record<DeliveryStatus, string> = {
  PENDING: 'Chờ gửi',
  SHIPPED: 'Đã gửi',
  DELIVERED: 'Đã giao',
  RETURNED: 'Hoàn về',
  FAILED: 'Giao thất bại',
};

export const orderStatusColors: Record<SalesOrderStatus, string> = {
  DRAFT: 'default',
  PENDING_APPROVAL: 'gold',
  CONFIRMED: 'blue',
  PROCESSING: 'processing',
  SHIPPING: 'cyan',
  COMPLETED: 'success',
  CANCELLED: 'error',
  REJECTED: 'volcano',
};

export const orderPaymentStatusColors: Record<OrderPaymentStatus, string> = {
  UNPAID: 'default',
  PARTIAL: 'gold',
  PAID: 'success',
  FAILED: 'error',
  REFUNDED: 'purple',
};

export const paymentTransactionStatusColors: Record<PaymentTransactionStatus, string> = {
  PENDING: 'gold',
  SUCCESS: 'success',
  FAILED: 'error',
  REFUNDED: 'purple',
};

export const deliveryStatusColors: Record<DeliveryStatus, string> = {
  PENDING: 'default',
  SHIPPED: 'processing',
  DELIVERED: 'success',
  RETURNED: 'purple',
  FAILED: 'error',
};

export const channelColors: Record<OrderChannel, string> = {
  WEBSITE: 'blue',
  POS: 'cyan',
  WHOLESALE: 'purple',
};

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 });

export function formatVnd(value: number) {
  return currencyFormatter.format(value);
}

export function formatQuantity(value: number) {
  return numberFormatter.format(value);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return '—';
  const date = dayjs(value);
  return date.isValid() ? date.format('DD/MM/YYYY HH:mm') : '—';
}

export function getDeliveryAddress(delivery: SalesOrderDelivery) {
  return [delivery.addressLine, delivery.ward, delivery.district, delivery.province]
    .filter(Boolean)
    .join(', ');
}
