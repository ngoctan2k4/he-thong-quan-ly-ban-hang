import type {
  GoodsReceiptDiscrepancyType,
  GoodsReceiptStatus,
  PurchaseOrderStatus,
  PurchaseSourceType,
} from '../../types/purchase';

export const purchaseOrderStatusConfig: Record<
  PurchaseOrderStatus,
  { color: string; label: string }
> = {
  DRAFT: { color: 'default', label: 'Nháp' },
  PENDING_APPROVAL: { color: 'gold', label: 'Chờ duyệt' },
  CONFIRMED: { color: 'blue', label: 'Đã xác nhận' },
  PARTIALLY_RECEIVED: { color: 'cyan', label: 'Đã nhận một phần' },
  RECEIVED_FULL: { color: 'green', label: 'Đã nhận đủ' },
  RECEIVED_PARTIAL: { color: 'orange', label: 'Nhận thiếu' },
  RECEIVED_WITH_DISCREPANCY: { color: 'volcano', label: 'Có chênh lệch' },
  CANCELLED: { color: 'red', label: 'Đã hủy' },
  REJECTED: { color: 'magenta', label: 'Từ chối' },
};

export const goodsReceiptStatusConfig: Record<
  GoodsReceiptStatus,
  { color: string; label: string }
> = {
  DRAFT: { color: 'default', label: 'Nháp' },
  PENDING_APPROVAL: { color: 'gold', label: 'Chờ duyệt' },
  CONFIRMED: { color: 'green', label: 'Đã xác nhận' },
  CANCELLED: { color: 'red', label: 'Đã hủy' },
};

export const purchaseSourceConfig: Record<
  PurchaseSourceType,
  { color: string; label: string }
> = {
  MANUAL: { color: 'default', label: 'Thủ công' },
  AI_PROPOSAL: { color: 'purple', label: 'Đề xuất AI' },
  RULE_ENGINE: { color: 'geekblue', label: 'Luật tự động' },
};

export const discrepancyConfig: Record<
  GoodsReceiptDiscrepancyType,
  { color: string; label: string }
> = {
  NONE: { color: 'default', label: 'Không chênh lệch' },
  SHORTAGE: { color: 'orange', label: 'Thiếu' },
  OVERAGE: { color: 'blue', label: 'Thừa' },
  DAMAGED: { color: 'red', label: 'Hư hỏng' },
  WRONG_ITEM: { color: 'magenta', label: 'Sai hàng' },
};

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const quantityFormatter = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 2,
});

export function formatVnd(value: number): string {
  return vndFormatter.format(value);
}

export function formatQuantity(value: number): string {
  return quantityFormatter.format(value);
}

export function formatDate(value?: string | null): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('vi-VN').format(new Date(value));
}

export function formatDateTime(value?: string | null): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function remainingQuantity(baseOrderedQty: number, receivedQty: number): number {
  return Math.max(baseOrderedQty - receivedQty, 0);
}
