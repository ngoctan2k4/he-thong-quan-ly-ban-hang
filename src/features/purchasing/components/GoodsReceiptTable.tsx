import { CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Flex, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import { EmptyState } from '../../../components/common/EmptyState';
import type { GoodsReceiptRecord } from '../purchasing.model';
import { formatDate, formatDateTime, formatVnd } from '../purchasing.utils';
import { GoodsReceiptStatusTag } from './PurchaseTags';

interface GoodsReceiptTableProps {
  receipts: GoodsReceiptRecord[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  onView: (receipt: GoodsReceiptRecord) => void;
  onCancel: (receipt: GoodsReceiptRecord) => void;
}

export function GoodsReceiptTable({
  receipts,
  loading = false,
  page,
  pageSize,
  total,
  onPaginationChange,
  onView,
  onCancel,
}: GoodsReceiptTableProps) {
  const columns: TableProps<GoodsReceiptRecord>['columns'] = [
    {
      title: 'Mã phiếu nhận',
      dataIndex: 'code',
      width: 154,
      render: (value: string, receipt) => (
        <Button type="link" className="purchasing__code" onClick={() => onView(receipt)}>
          {value}
        </Button>
      ),
    },
    {
      title: 'PO liên quan',
      dataIndex: 'purchaseOrderCode',
      width: 142,
      render: (value: string | null) => value
        ? <Typography.Text>{value}</Typography.Text>
        : <Typography.Text type="secondary">Không có PO</Typography.Text>,
    },
    { title: 'Nhà cung cấp', dataIndex: 'supplierName', width: 220, ellipsis: true },
    { title: 'Kho nhận', dataIndex: 'warehouseName', width: 180, ellipsis: true },
    { title: 'Ngày nhận', dataIndex: 'receivedDate', width: 112, render: formatDate },
    {
      title: 'Tổng giá trị',
      dataIndex: 'totalAmount',
      width: 146,
      align: 'right',
      render: (value: number) => <Typography.Text strong>{formatVnd(value)}</Typography.Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 132,
      render: (value: GoodsReceiptRecord['status']) => <GoodsReceiptStatusTag status={value} />,
    },
    {
      title: 'Người xác nhận',
      dataIndex: 'confirmerName',
      width: 150,
      render: (value: string | null) => value ?? '—',
    },
    {
      title: 'Thời gian xác nhận',
      dataIndex: 'confirmedAt',
      width: 164,
      render: formatDateTime,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 132,
      render: (_, receipt) => (
        <Flex gap={4} className="purchasing__row-actions">
          <Button size="small" icon={<EyeOutlined />} onClick={() => onView(receipt)}>
            Xem
          </Button>
          {receipt.status === 'DRAFT' ? (
            <Button
              size="small"
              danger
              aria-label={`Hủy ${receipt.code}`}
              icon={<CloseCircleOutlined />}
              onClick={() => onCancel(receipt)}
            />
          ) : null}
        </Flex>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      className="purchasing__table"
      columns={columns}
      dataSource={receipts}
      loading={loading}
      size="middle"
      scroll={{ x: 1530 }}
      locale={{
        emptyText: (
          <div className="purchasing__empty">
            <EmptyState description="Không có phiếu nhận phù hợp với bộ lọc." />
          </div>
        ),
      }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50],
        showTotal: (count) => `${count} phiếu nhận`,
        onChange: onPaginationChange,
      }}
    />
  );
}
