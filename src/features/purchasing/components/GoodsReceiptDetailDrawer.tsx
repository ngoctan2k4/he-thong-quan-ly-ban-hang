import { Alert, Descriptions, Drawer, Flex, Skeleton, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import { ErrorState } from '../../../components/common/ErrorState';
import type { GoodsReceiptDetail, GoodsReceiptItemRecord } from '../purchasing.model';
import {
  formatDate,
  formatDateTime,
  formatQuantity,
  formatVnd,
} from '../purchasing.utils';
import { DiscrepancyTag, GoodsReceiptStatusTag } from './PurchaseTags';

interface GoodsReceiptDetailDrawerProps {
  open: boolean;
  receipt?: GoodsReceiptDetail;
  loading?: boolean;
  error?: boolean;
  onRetry: () => void;
  onClose: () => void;
}

export function GoodsReceiptDetailDrawer({
  open,
  receipt,
  loading = false,
  error = false,
  onRetry,
  onClose,
}: GoodsReceiptDetailDrawerProps) {
  const columns: TableProps<GoodsReceiptItemRecord>['columns'] = [
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
    { title: 'SL nhận', dataIndex: 'receivedQty', width: 94, align: 'right', render: formatQuantity },
    { title: 'SL quy đổi', dataIndex: 'baseReceivedQty', width: 104, align: 'right', render: formatQuantity },
    {
      title: 'SL hỏng',
      dataIndex: 'damagedQty',
      width: 92,
      align: 'right',
      render: (value: number) => (
        <Typography.Text type={value > 0 ? 'danger' : undefined} strong={value > 0}>
          {formatQuantity(value)}
        </Typography.Text>
      ),
    },
    { title: 'Đơn giá', dataIndex: 'unitCost', width: 132, align: 'right', render: formatVnd },
    {
      title: 'Chênh lệch',
      dataIndex: 'discrepancyType',
      width: 142,
      render: (value: GoodsReceiptItemRecord['discrepancyType']) => <DiscrepancyTag type={value} />,
    },
    { title: 'Ghi chú', dataIndex: 'note', width: 220, ellipsis: true, render: (value) => value ?? '—' },
  ];

  const damagedCount = receipt?.items.reduce((sum, item) => sum + item.damagedQty, 0) ?? 0;

  return (
    <Drawer
      open={open}
      width="min(1080px, 100vw)"
      title={receipt ? `Chi tiết ${receipt.code}` : 'Chi tiết phiếu nhận'}
      destroyOnClose
      onClose={onClose}
    >
      {loading ? <Skeleton active paragraph={{ rows: 10 }} /> : null}
      {error ? <ErrorState message="Không thể tải chi tiết phiếu nhận." onRetry={onRetry} /> : null}
      {!loading && !error && receipt ? (
        <Flex vertical gap={16}>
          {damagedCount > 0 ? (
            <Alert
              showIcon
              type="warning"
              message={`Phiếu có ${formatQuantity(damagedCount)} sản phẩm hỏng`}
              description="Các dòng hư hỏng được làm nổi bật trong bảng bên dưới."
            />
          ) : null}
          <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 3 }}>
            <Descriptions.Item label="Mã phiếu">{receipt.code}</Descriptions.Item>
            <Descriptions.Item label="PO">{receipt.purchaseOrderCode ?? 'Không có PO'}</Descriptions.Item>
            <Descriptions.Item label="Nhà cung cấp">{receipt.supplierName}</Descriptions.Item>
            <Descriptions.Item label="Kho nhận">{receipt.warehouseName}</Descriptions.Item>
            <Descriptions.Item label="Ngày nhận">{formatDate(receipt.receivedDate)}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái"><GoodsReceiptStatusTag status={receipt.status} /></Descriptions.Item>
            <Descriptions.Item label="Tổng giá trị"><Typography.Text strong>{formatVnd(receipt.totalAmount)}</Typography.Text></Descriptions.Item>
            <Descriptions.Item label="Người tạo">{receipt.creatorName}</Descriptions.Item>
            <Descriptions.Item label="Người xác nhận">{receipt.confirmerName ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Thời gian xác nhận">{formatDateTime(receipt.confirmedAt)}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú" span={3}>{receipt.note ?? '—'}</Descriptions.Item>
          </Descriptions>
          <Table
            rowKey="id"
            className="purchasing-detail__table purchasing-receipt-detail__table"
            columns={columns}
            dataSource={receipt.items}
            size="small"
            scroll={{ x: 1160 }}
            pagination={false}
            rowClassName={(item) => `purchasing-receipt-row--${item.discrepancyType.toLowerCase()}`}
          />
        </Flex>
      ) : null}
    </Drawer>
  );
}
