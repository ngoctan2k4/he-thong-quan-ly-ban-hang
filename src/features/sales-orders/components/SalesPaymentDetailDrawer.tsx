import { Descriptions, Drawer, Skeleton, Tag, Typography } from 'antd';
import { ErrorState } from '../../../components/common/ErrorState';
import type { SalesPaymentRecord } from '../salesOrders.model';
import {
  formatDateTime,
  formatVnd,
  paymentMethodLabels,
  paymentTransactionStatusColors,
  paymentTransactionStatusLabels,
} from '../salesOrders.utils';

interface SalesPaymentDetailDrawerProps {
  open: boolean;
  payment?: SalesPaymentRecord;
  loading?: boolean;
  error?: boolean;
  onRetry: () => void;
  onClose: () => void;
}

export function SalesPaymentDetailDrawer({
  open,
  payment,
  loading = false,
  error = false,
  onRetry,
  onClose,
}: SalesPaymentDetailDrawerProps) {
  return (
    <Drawer
      open={open}
      width="min(560px, 100%)"
      title="Chi tiết giao dịch thanh toán"
      destroyOnHidden
      onClose={onClose}
    >
      {loading ? <Skeleton active paragraph={{ rows: 8 }} /> : null}
      {error ? (
        <ErrorState message="Không thể tải chi tiết giao dịch." onRetry={onRetry} />
      ) : null}
      {!loading && !error && payment ? (
        <Descriptions bordered size="small" column={1}>
          <Descriptions.Item label="Mã đơn">{payment.orderCode}</Descriptions.Item>
          <Descriptions.Item label="Khách hàng">{payment.customerName}</Descriptions.Item>
          <Descriptions.Item label="Phương thức">
            {paymentMethodLabels[payment.method]}
          </Descriptions.Item>
          <Descriptions.Item label="Số tiền">
            <Typography.Text strong className="sales-orders__number">
              {formatVnd(payment.amount)}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={paymentTransactionStatusColors[payment.status]}>
              {paymentTransactionStatusLabels[payment.status]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Mã tham chiếu">
            {payment.referenceNo ?? '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian thanh toán">
            {formatDateTime(payment.paidAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian tạo">
            {formatDateTime(payment.createdAt)}
          </Descriptions.Item>
        </Descriptions>
      ) : null}
    </Drawer>
  );
}
