import { EyeOutlined } from '@ant-design/icons';
import { Button, Flex, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { EmptyState } from '../../../components/common/EmptyState';
import type { SalesPaymentRecord } from '../salesOrders.model';
import {
  formatDateTime,
  formatVnd,
  paymentMethodLabels,
  paymentTransactionStatusColors,
  paymentTransactionStatusLabels,
} from '../salesOrders.utils';

interface SalesPaymentTableProps {
  payments: SalesPaymentRecord[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  onView: (payment: SalesPaymentRecord) => void;
}

export function SalesPaymentTable({
  payments,
  loading = false,
  page,
  pageSize,
  total,
  onPaginationChange,
  onView,
}: SalesPaymentTableProps) {
  const columns: TableProps<SalesPaymentRecord>['columns'] = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderCode',
      width: 184,
      render: (code: string, payment) => (
        <Button type="link" className="sales-orders__code" onClick={() => onView(payment)}>
          {code}
        </Button>
      ),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      width: 220,
      render: (name: string) => <Typography.Text strong={name !== 'Khách lẻ'}>{name}</Typography.Text>,
    },
    {
      title: 'Phương thức',
      dataIndex: 'method',
      width: 154,
      render: (method: SalesPaymentRecord['method']) => paymentMethodLabels[method],
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      align: 'right',
      width: 160,
      render: (amount: number) => (
        <Typography.Text strong className="sales-orders__number">
          {formatVnd(amount)}
        </Typography.Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 138,
      render: (status: SalesPaymentRecord['status']) => (
        <Tag color={paymentTransactionStatusColors[status]}>
          {paymentTransactionStatusLabels[status]}
        </Tag>
      ),
    },
    {
      title: 'Mã tham chiếu',
      dataIndex: 'referenceNo',
      width: 190,
      render: (value: string | null) => value ?? '—',
    },
    {
      title: 'Thời gian thanh toán',
      dataIndex: 'paidAt',
      width: 178,
      render: formatDateTime,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 104,
      render: (_, payment) => (
        <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView(payment)}>
          Xem
        </Button>
      ),
    },
  ];

  return (
    <Table<SalesPaymentRecord>
      className="sales-orders__table"
      rowKey="id"
      size="middle"
      columns={columns}
      dataSource={payments}
      loading={loading}
      tableLayout="fixed"
      scroll={{ x: 1328 }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: (count) => `${count} giao dịch`,
        onChange: onPaginationChange,
      }}
      locale={{
        emptyText: (
          <Flex vertical align="center" className="sales-orders__empty">
            <EmptyState description="Chưa có giao dịch phù hợp với bộ lọc hiện tại." />
          </Flex>
        ),
      }}
    />
  );
}
