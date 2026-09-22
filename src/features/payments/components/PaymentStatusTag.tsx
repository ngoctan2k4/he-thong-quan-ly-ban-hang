import { Tag } from 'antd';
import type {
  DebtStatus,
  PaymentScheduleStatus,
  PaymentTransactionStatus,
} from '../payments.model';

type Status = DebtStatus | PaymentScheduleStatus | PaymentTransactionStatus;

const statusMeta: Record<Status, { color: string; label: string }> = {
  SUCCESS: { color: 'success', label: 'Thành công' },
  PENDING: { color: 'processing', label: 'Đang xử lý' },
  FAILED: { color: 'error', label: 'Thất bại' },
  PAID: { color: 'success', label: 'Đã thanh toán' },
  PARTIAL: { color: 'processing', label: 'Thanh toán một phần' },
  OVERDUE: { color: 'error', label: 'Quá hạn' },
  DUE: { color: 'warning', label: 'Đến hạn' },
  UPCOMING: { color: 'default', label: 'Chưa đến hạn' },
};

interface PaymentStatusTagProps {
  status: Status;
}

export function PaymentStatusTag({ status }: PaymentStatusTagProps) {
  const meta = statusMeta[status];
  return <Tag color={meta.color}>{meta.label}</Tag>;
}
