import { Tag } from 'antd';
import type { OrderStatus } from '../../types/order';

const statusConfig: Record<OrderStatus, { color: string; label: string }> = {
  DRAFT: { color: 'default', label: 'Chờ xác nhận' },
  CONFIRMED: { color: 'blue', label: 'Đã xác nhận' },
  PROCESSING: { color: 'orange', label: 'Đang xử lý' },
  SHIPPING: { color: 'cyan', label: 'Đang giao' },
  COMPLETED: { color: 'green', label: 'Hoàn thành' },
  CANCELLED: { color: 'red', label: 'Đã hủy' },
  REJECTED: { color: 'volcano', label: 'Bị từ chối' },
};

interface StatusTagProps {
  status: OrderStatus;
}

export function StatusTag({ status }: StatusTagProps) {
  const config = statusConfig[status];
  return <Tag color={config.color}>{config.label}</Tag>;
}
