import { EditOutlined, InboxOutlined } from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Drawer,
  Empty,
  Flex,
  Skeleton,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import type { TableProps } from 'antd';
import { ErrorState } from '../../../components/common/ErrorState';
import type {
  GoodsReceiptRecord,
  PurchaseOrderDetail,
  PurchaseOrderItemRecord,
} from '../purchasing.model';
import {
  formatDate,
  formatDateTime,
  formatQuantity,
  formatVnd,
  remainingQuantity,
} from '../purchasing.utils';
import {
  GoodsReceiptStatusTag,
  PurchaseOrderStatusTag,
  PurchaseSourceTag,
} from './PurchaseTags';

interface PurchaseOrderDetailDrawerProps {
  open: boolean;
  order?: PurchaseOrderDetail;
  loading?: boolean;
  error?: boolean;
  onRetry: () => void;
  onClose: () => void;
  onEdit: (order: PurchaseOrderDetail) => void;
  onCreateReceipt: (order: PurchaseOrderDetail) => void;
}

export function PurchaseOrderDetailDrawer({
  open,
  order,
  loading = false,
  error = false,
  onRetry,
  onClose,
  onEdit,
  onCreateReceipt,
}: PurchaseOrderDetailDrawerProps) {
  const itemColumns: TableProps<PurchaseOrderItemRecord>['columns'] = [
    {
      title: 'Sản phẩm',
      key: 'product',
      width: 250,
      render: (_, item) => (
        <Flex vertical className="purchasing-detail__product">
          <Typography.Text strong>{item.productName}</Typography.Text>
          <Typography.Text type="secondary">{item.productCode}</Typography.Text>
        </Flex>
      ),
    },
    { title: 'Đơn vị', dataIndex: 'unitName', width: 120 },
    { title: 'SL đặt', dataIndex: 'orderedQty', width: 94, align: 'right', render: formatQuantity },
    { title: 'SL cơ sở', dataIndex: 'baseOrderedQty', width: 104, align: 'right', render: formatQuantity },
    { title: 'Đã nhận', dataIndex: 'receivedQty', width: 96, align: 'right', render: formatQuantity },
    {
      title: 'Còn phải nhận',
      key: 'remaining',
      width: 122,
      align: 'right',
      render: (_, item) => (
        <Typography.Text strong={remainingQuantity(item.baseOrderedQty, item.receivedQty) > 0}>
          {formatQuantity(remainingQuantity(item.baseOrderedQty, item.receivedQty))}
        </Typography.Text>
      ),
    },
    { title: 'Đơn giá', dataIndex: 'unitPrice', width: 132, align: 'right', render: formatVnd },
    { title: 'Thành tiền', dataIndex: 'lineTotal', width: 140, align: 'right', render: formatVnd },
  ];

  const receiptColumns: TableProps<GoodsReceiptRecord>['columns'] = [
    { title: 'Mã phiếu', dataIndex: 'code', width: 150 },
    { title: 'Ngày nhận', dataIndex: 'receivedDate', width: 118, render: formatDate },
    { title: 'Tổng giá trị', dataIndex: 'totalAmount', width: 150, align: 'right', render: formatVnd },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 132,
      render: (status: GoodsReceiptRecord['status']) => <GoodsReceiptStatusTag status={status} />,
    },
    { title: 'Người xác nhận', dataIndex: 'confirmerName', width: 150, render: (value) => value ?? '—' },
    { title: 'Xác nhận lúc', dataIndex: 'confirmedAt', width: 164, render: formatDateTime },
  ];

  const canCreateReceipt = order
    ? ['CONFIRMED', 'PARTIALLY_RECEIVED', 'RECEIVED_PARTIAL', 'RECEIVED_WITH_DISCREPANCY']
      .includes(order.status)
      && order.items.some((item) => remainingQuantity(item.baseOrderedQty, item.receivedQty) > 0)
    : false;

  return (
    <Drawer
      open={open}
      width="min(1080px, 100vw)"
      title={order ? `Chi tiết ${order.code}` : 'Chi tiết đơn mua'}
      destroyOnClose
      extra={order ? (
        <Flex gap={8}>
          {order.status === 'DRAFT' ? (
            <Button icon={<EditOutlined />} onClick={() => onEdit(order)}>Sửa</Button>
          ) : null}
          {canCreateReceipt ? (
            <Button type="primary" icon={<InboxOutlined />} onClick={() => onCreateReceipt(order)}>
              Tạo phiếu nhận
            </Button>
          ) : null}
        </Flex>
      ) : undefined}
      onClose={onClose}
    >
      {loading ? <Skeleton active paragraph={{ rows: 10 }} /> : null}
      {error ? (
        <ErrorState message="Không thể tải chi tiết đơn mua." onRetry={onRetry} />
      ) : null}
      {!loading && !error && order ? (
        <Tabs
          className="purchasing-detail__tabs"
          items={[
            {
              key: 'general',
              label: 'Thông tin chung',
              children: (
                <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 3 }}>
                  <Descriptions.Item label="Mã PO">{order.code}</Descriptions.Item>
                  <Descriptions.Item label="Nhà cung cấp">{order.supplierName}</Descriptions.Item>
                  <Descriptions.Item label="Kho nhận">{order.warehouseName}</Descriptions.Item>
                  <Descriptions.Item label="Ngày đặt">{formatDate(order.orderDate)}</Descriptions.Item>
                  <Descriptions.Item label="Ngày dự kiến">{formatDate(order.expectedDate)}</Descriptions.Item>
                  <Descriptions.Item label="Tổng tiền"><Typography.Text strong>{formatVnd(order.totalAmount)}</Typography.Text></Descriptions.Item>
                  <Descriptions.Item label="Trạng thái"><PurchaseOrderStatusTag status={order.status} /></Descriptions.Item>
                  <Descriptions.Item label="Nguồn tạo"><PurchaseSourceTag source={order.sourceType} /></Descriptions.Item>
                  <Descriptions.Item label="Yêu cầu phê duyệt">{order.requiresApproval ? <Tag color="gold">Có</Tag> : 'Không'}</Descriptions.Item>
                  <Descriptions.Item label="Người duyệt">{order.approverName ?? '—'}</Descriptions.Item>
                  <Descriptions.Item label="Thời gian duyệt">{formatDateTime(order.approvedAt)}</Descriptions.Item>
                  <Descriptions.Item label="Người tạo">{order.creatorName}</Descriptions.Item>
                  <Descriptions.Item label="Ghi chú" span={3}>{order.note ?? '—'}</Descriptions.Item>
                </Descriptions>
              ),
            },
            {
              key: 'items',
              label: `Sản phẩm (${order.items.length})`,
              children: (
                <Table
                  rowKey="id"
                  className="purchasing-detail__table"
                  columns={itemColumns}
                  dataSource={order.items}
                  size="small"
                  scroll={{ x: 1110 }}
                  pagination={false}
                />
              ),
            },
            {
              key: 'receipts',
              label: `Nhận hàng (${order.receipts.length})`,
              children: order.receipts.length ? (
                <Table
                  rowKey="id"
                  className="purchasing-detail__table"
                  columns={receiptColumns}
                  dataSource={order.receipts}
                  size="small"
                  scroll={{ x: 860 }}
                  pagination={false}
                />
              ) : (
                <Empty description="Chưa có phiếu nhận liên quan PO này." />
              ),
            },
          ]}
        />
      ) : null}
    </Drawer>
  );
}
