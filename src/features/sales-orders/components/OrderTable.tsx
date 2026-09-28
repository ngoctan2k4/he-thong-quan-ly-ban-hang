import { EyeOutlined } from '@ant-design/icons';
import { Button, Flex, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { EmptyState } from '../../../components/common/EmptyState';
import type { SalesOrderRecord } from '../salesOrders.model';
import {
  channelColors,
  channelLabels,
  formatDateTime,
  formatVnd,
  orderPaymentStatusColors,
  orderPaymentStatusLabels,
  orderStatusColors,
  orderStatusLabels,
} from '../salesOrders.utils';

interface OrderTableProps {
  orders: SalesOrderRecord[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  onView: (order: SalesOrderRecord) => void;
}

export function OrderTable({
  orders,
  loading = false,
  page,
  pageSize,
  total,
  onPaginationChange,
  onView,
}: OrderTableProps) {
  const columns: TableProps<SalesOrderRecord>['columns'] = [
    {
      title: 'Mã đơn',
      dataIndex: 'code',
      width: 176,
      render: (code: string, order) => (
        <Button type="link" className="sales-orders__code" onClick={() => onView(order)}>
          {code}
        </Button>
      ),
    },
    {
      title: 'Kênh',
      dataIndex: 'channel',
      width: 112,
      render: (channel: SalesOrderRecord['channel']) => (
        <Tag color={channelColors[channel]}>{channelLabels[channel]}</Tag>
      ),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      width: 210,
      render: (customerName: string) => (
        <Typography.Text strong={customerName !== 'Khách lẻ'}>{customerName}</Typography.Text>
      ),
    },
    { title: 'Chi nhánh', dataIndex: 'branchName', width: 190, responsive: ['lg'] },
    { title: 'Kho', dataIndex: 'warehouseName', width: 190, responsive: ['lg'] },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      width: 146,
      render: (value: string) => formatDateTime(value),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      align: 'right',
      width: 150,
      render: (value: number) => (
        <Typography.Text strong className="sales-orders__number">
          {formatVnd(value)}
        </Typography.Text>
      ),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      width: 172,
      render: (status: SalesOrderRecord['paymentStatus']) => (
        <Tag color={orderPaymentStatusColors[status]}>{orderPaymentStatusLabels[status]}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 154,
      render: (status: SalesOrderRecord['status']) => (
        <Tag color={orderStatusColors[status]}>{orderStatusLabels[status]}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 104,
      render: (_, order) => (
        <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView(order)}>
          Xem
        </Button>
      ),
    },
  ];

  return (
    <Table<SalesOrderRecord>
      className="sales-orders__table"
      rowKey="id"
      size="middle"
      columns={columns}
      dataSource={orders}
      loading={loading}
      tableLayout="fixed"
      scroll={{ x: 1480 }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: (count) => `${count} đơn hàng`,
        onChange: onPaginationChange,
      }}
      locale={{
        emptyText: (
          <Flex vertical align="center" className="sales-orders__empty">
            <EmptyState description="Chưa có đơn hàng phù hợp với bộ lọc hiện tại." />
          </Flex>
        ),
      }}
    />
  );
}
