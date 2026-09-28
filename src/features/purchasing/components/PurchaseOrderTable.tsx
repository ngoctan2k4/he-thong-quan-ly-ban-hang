import { CloseCircleOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Flex, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { EmptyState } from '../../../components/common/EmptyState';
import type { PurchaseOrderRecord } from '../purchasing.model';
import { formatDate, formatVnd } from '../purchasing.utils';
import { PurchaseOrderStatusTag, PurchaseSourceTag } from './PurchaseTags';

interface PurchaseOrderTableProps {
  orders: PurchaseOrderRecord[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  onView: (order: PurchaseOrderRecord) => void;
  onEdit: (order: PurchaseOrderRecord) => void;
  onCancel: (order: PurchaseOrderRecord) => void;
}

export function PurchaseOrderTable({
  orders,
  loading = false,
  page,
  pageSize,
  total,
  onPaginationChange,
  onView,
  onEdit,
  onCancel,
}: PurchaseOrderTableProps) {
  const columns: TableProps<PurchaseOrderRecord>['columns'] = [
    {
      title: 'Mã PO',
      dataIndex: 'code',
      width: 142,
      render: (value: string, order) => (
        <Button type="link" className="purchasing__code" onClick={() => onView(order)}>
          {value}
        </Button>
      ),
    },
    { title: 'Nhà cung cấp', dataIndex: 'supplierName', width: 220, ellipsis: true },
    { title: 'Kho nhận', dataIndex: 'warehouseName', width: 180, ellipsis: true },
    { title: 'Ngày đặt', dataIndex: 'orderDate', width: 112, render: formatDate },
    { title: 'Ngày dự kiến', dataIndex: 'expectedDate', width: 122, render: formatDate },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      width: 146,
      align: 'right',
      render: (value: number) => <Typography.Text strong>{formatVnd(value)}</Typography.Text>,
    },
    {
      title: 'Nguồn tạo',
      dataIndex: 'sourceType',
      width: 126,
      render: (value: PurchaseOrderRecord['sourceType']) => <PurchaseSourceTag source={value} />,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 158,
      render: (value: PurchaseOrderRecord['status']) => <PurchaseOrderStatusTag status={value} />,
    },
    {
      title: 'Yêu cầu duyệt',
      dataIndex: 'requiresApproval',
      width: 126,
      align: 'center',
      render: (value: boolean) => value
        ? <Tag color="gold">Có</Tag>
        : <Typography.Text type="secondary">Không</Typography.Text>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 176,
      render: (_, order) => {
        const canEdit = order.status === 'DRAFT';
        const canCancel = ['DRAFT', 'PENDING_APPROVAL'].includes(order.status);
        return (
          <Flex gap={4} className="purchasing__row-actions">
            <Button size="small" icon={<EyeOutlined />} onClick={() => onView(order)}>
              Xem
            </Button>
            {canEdit ? (
              <Button
                size="small"
                aria-label={`Sửa ${order.code}`}
                icon={<EditOutlined />}
                onClick={() => onEdit(order)}
              />
            ) : null}
            {canCancel ? (
              <Button
                size="small"
                danger
                aria-label={`Hủy ${order.code}`}
                icon={<CloseCircleOutlined />}
                onClick={() => onCancel(order)}
              />
            ) : null}
          </Flex>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      className="purchasing__table"
      columns={columns}
      dataSource={orders}
      loading={loading}
      size="middle"
      scroll={{ x: 1570 }}
      locale={{
        emptyText: (
          <div className="purchasing__empty">
            <EmptyState description="Không có đơn mua phù hợp với bộ lọc." />
          </div>
        ),
      }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50],
        showTotal: (count) => `${count} đơn mua`,
        onChange: onPaginationChange,
      }}
    />
  );
}
