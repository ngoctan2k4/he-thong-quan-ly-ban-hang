import { CheckCircleOutlined, ClockCircleOutlined, WarningOutlined } from '@ant-design/icons';
import {
  Alert,
  Card,
  Descriptions,
  Drawer,
  Flex,
  Skeleton,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import type { TableProps } from 'antd';
import { EmptyState } from '../../../components/common/EmptyState';
import { ErrorState } from '../../../components/common/ErrorState';
import type { SalesOrderPayment } from '../../../types/order';
import type { SalesOrderDetail, SalesOrderItemRecord } from '../salesOrders.model';
import {
  channelColors,
  channelLabels,
  deliveryStatusColors,
  deliveryStatusLabels,
  formatDateTime,
  formatQuantity,
  formatVnd,
  getDeliveryAddress,
  orderPaymentStatusColors,
  orderPaymentStatusLabels,
  orderStatusColors,
  orderStatusLabels,
  paymentMethodLabels,
  paymentTransactionStatusColors,
  paymentTransactionStatusLabels,
} from '../salesOrders.utils';

interface OrderDetailDrawerProps {
  open: boolean;
  order?: SalesOrderDetail;
  loading?: boolean;
  error?: boolean;
  onRetry: () => void;
  onClose: () => void;
}

const itemColumns: TableProps<SalesOrderItemRecord>['columns'] = [
  {
    title: 'Sản phẩm',
    key: 'product',
    width: 240,
    fixed: 'left',
    render: (_, item) => (
      <Flex vertical gap={2} className="sales-order-detail__product">
        <Typography.Text strong>{item.productName}</Typography.Text>
        <Typography.Text type="secondary">{item.productCode}</Typography.Text>
      </Flex>
    ),
  },
  { title: 'Đơn vị', dataIndex: 'unitName', width: 112 },
  { title: 'Số lượng', dataIndex: 'quantity', align: 'right', width: 110, render: formatQuantity },
  { title: 'Hệ số quy đổi', dataIndex: 'conversionFactor', align: 'right', width: 126, render: formatQuantity },
  { title: 'SL cơ sở', dataIndex: 'baseQuantity', align: 'right', width: 112, render: formatQuantity },
  { title: 'Đơn giá', dataIndex: 'unitPrice', align: 'right', width: 150, render: formatVnd },
  { title: 'Giảm giá', dataIndex: 'discountAmount', align: 'right', width: 140, render: formatVnd },
  { title: 'Thành tiền', dataIndex: 'lineTotal', align: 'right', width: 150, render: (value: number) => <Typography.Text strong>{formatVnd(value)}</Typography.Text> },
  { title: 'Đã xuất', dataIndex: 'issuedQuantity', align: 'right', width: 108, render: formatQuantity },
  {
    title: 'Còn phải xuất',
    key: 'remainingQuantity',
    align: 'right',
    width: 128,
    render: (_, item) => formatQuantity(item.baseQuantity - item.issuedQuantity),
  },
];

const paymentColumns: TableProps<SalesOrderPayment>['columns'] = [
  {
    title: 'Phương thức',
    dataIndex: 'method',
    width: 150,
    render: (method: SalesOrderPayment['method']) => paymentMethodLabels[method],
  },
  {
    title: 'Số tiền',
    dataIndex: 'amount',
    align: 'right',
    width: 160,
    render: (amount: number) => <Typography.Text strong>{formatVnd(amount)}</Typography.Text>,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    width: 132,
    render: (status: SalesOrderPayment['status']) => (
      <Tag color={paymentTransactionStatusColors[status]}>
        {paymentTransactionStatusLabels[status]}
      </Tag>
    ),
  },
  { title: 'Mã tham chiếu', dataIndex: 'referenceNo', width: 180, render: (value: string | null) => value ?? '—' },
  { title: 'Thời gian thanh toán', dataIndex: 'paidAt', width: 170, render: formatDateTime },
  { title: 'Thời gian tạo', dataIndex: 'createdAt', width: 170, render: formatDateTime },
];

function GeneralTab({ order }: { order: SalesOrderDetail }) {
  return (
    <Flex vertical gap={16}>
      {order.requiresApproval ? (
        <Alert
          type={order.approvedAt ? 'success' : 'warning'}
          showIcon
          icon={order.approvedAt ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          message={order.approvedAt ? 'Đơn hàng có yêu cầu phê duyệt' : 'Đơn hàng đang cần phê duyệt'}
          description={
            order.approvedAt
              ? `Người xử lý: ${order.approverName ?? 'Không xác định'} · ${formatDateTime(order.approvedAt)}`
              : 'Chưa có người duyệt hoặc thời gian duyệt trong dữ liệu V4.'
          }
        />
      ) : null}

      {order.status === 'CANCELLED' ? (
        <Alert
          type="error"
          showIcon
          icon={<WarningOutlined />}
          message="Đơn hàng đã bị hủy"
          description={order.cancelReason ?? 'Không có lý do hủy.'}
        />
      ) : null}

      <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label="Mã đơn">{order.code}</Descriptions.Item>
        <Descriptions.Item label="Kênh bán">
          <Tag color={channelColors[order.channel]}>{channelLabels[order.channel]}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Khách hàng">{order.customerName}</Descriptions.Item>
        <Descriptions.Item label="Ngày đặt">{formatDateTime(order.orderDate)}</Descriptions.Item>
        <Descriptions.Item label="Chi nhánh">{order.branchName}</Descriptions.Item>
        <Descriptions.Item label="Kho">{order.warehouseName}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái đơn">
          <Tag color={orderStatusColors[order.status]}>{orderStatusLabels[order.status]}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái thanh toán">
          <Tag color={orderPaymentStatusColors[order.paymentStatus]}>
            {orderPaymentStatusLabels[order.paymentStatus]}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán">
          {paymentMethodLabels[order.paymentMethod]}
        </Descriptions.Item>
        <Descriptions.Item label="Cập nhật lần cuối">{formatDateTime(order.updatedAt)}</Descriptions.Item>
        <Descriptions.Item label="Ghi chú" span={2}>
          {order.note ?? '—'}
        </Descriptions.Item>
      </Descriptions>
    </Flex>
  );
}

function ItemsTab({ order }: { order: SalesOrderDetail }) {
  return (
    <Flex vertical gap={16}>
      <Table<SalesOrderItemRecord>
        className="sales-order-detail__items-table"
        rowKey="id"
        size="small"
        columns={itemColumns}
        dataSource={order.items}
        tableLayout="fixed"
        scroll={{ x: 1336 }}
        pagination={false}
        locale={{ emptyText: <EmptyState description="Đơn hàng chưa có sản phẩm." /> }}
      />

      <div className="sales-order-detail__totals">
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="Tạm tính">{formatVnd(order.subtotal)}</Descriptions.Item>
          <Descriptions.Item label="Giảm giá">− {formatVnd(order.discountAmount)}</Descriptions.Item>
          <Descriptions.Item label="Phí vận chuyển">{formatVnd(order.shippingFee)}</Descriptions.Item>
          <Descriptions.Item label={<Typography.Text strong>Tổng thanh toán</Typography.Text>}>
            <Typography.Text strong>{formatVnd(order.totalAmount)}</Typography.Text>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Flex>
  );
}

function PaymentsTab({ order }: { order: SalesOrderDetail }) {
  return (
    <Table<SalesOrderPayment>
      className="sales-order-detail__payments-table"
      rowKey="id"
      size="small"
      columns={paymentColumns}
      dataSource={order.payments}
      tableLayout="fixed"
      scroll={{ x: 940 }}
      pagination={false}
      locale={{
        emptyText: <EmptyState description="Đơn hàng chưa có giao dịch thanh toán." />,
      }}
    />
  );
}

function DeliveriesTab({ order }: { order: SalesOrderDetail }) {
  if (order.deliveries.length === 0) {
    return <EmptyState description="Đơn hàng chưa có thông tin giao hàng." />;
  }

  return (
    <Flex vertical gap={12}>
      {order.deliveries.map((delivery) => (
        <Card
          key={delivery.id}
          size="small"
          title={`${delivery.receiverName} · ${delivery.phone}`}
          extra={
            <Tag color={deliveryStatusColors[delivery.status]}>
              {deliveryStatusLabels[delivery.status]}
            </Tag>
          }
        >
          <Descriptions size="small" column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Địa chỉ" span={2}>
              {getDeliveryAddress(delivery)}
            </Descriptions.Item>
            <Descriptions.Item label="Đơn vị vận chuyển">
              {delivery.carrier ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Mã vận đơn">
              {delivery.trackingNo ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian gửi">
              {formatDateTime(delivery.shippedAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian giao">
              {formatDateTime(delivery.deliveredAt)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ))}
    </Flex>
  );
}

export function OrderDetailDrawer({
  open,
  order,
  loading = false,
  error = false,
  onRetry,
  onClose,
}: OrderDetailDrawerProps) {
  return (
    <Drawer
      open={open}
      width="min(1180px, 100%)"
      title={order ? `Chi tiết đơn hàng ${order.code}` : 'Chi tiết đơn hàng'}
      destroyOnHidden
      onClose={onClose}
    >
      {loading ? <Skeleton active paragraph={{ rows: 10 }} /> : null}
      {error ? (
        <ErrorState message="Không thể tải chi tiết đơn hàng." onRetry={onRetry} />
      ) : null}
      {!loading && !error && order ? (
        <Tabs
          className="sales-order-detail__tabs"
          items={[
            { key: 'general', label: 'Thông tin chung', children: <GeneralTab order={order} /> },
            { key: 'items', label: `Sản phẩm (${order.items.length})`, children: <ItemsTab order={order} /> },
            { key: 'payments', label: `Thanh toán (${order.payments.length})`, children: <PaymentsTab order={order} /> },
            { key: 'deliveries', label: `Giao hàng (${order.deliveries.length})`, children: <DeliveriesTab order={order} /> },
          ]}
        />
      ) : null}
    </Drawer>
  );
}
