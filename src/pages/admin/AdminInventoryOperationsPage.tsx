/* Hallmark · macrostructure: Operations ledger · tone: utilitarian · anchor hue: cobalt
 * pre-emit critique: P5 H4 E4 S5 R5 V4
 */
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  App,
  Button,
  Col,
  Descriptions,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
  Progress,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { TableProps } from 'antd';
import { useMemo, useState } from 'react';
import { AdminListPage } from '../../components/admin/AdminListPage';
import {
  stockBalances,
  stockIssues as initialStockIssues,
  stockMovements,
  stocktakes as initialStocktakes,
  stockTransfers as initialStockTransfers,
  warehouseLocations as initialLocations,
  writeOffs as initialWriteOffs,
  type OperationStatus,
  type StockBalanceRow,
  type StockIssueRow,
  type StockMovementRow,
  type StocktakeRow,
  type StockTransferRow,
  type WarehouseLocationRow,
  type WriteOffRow,
} from '../../mocks/adminOperations';
import './adminOperations.css';

export type InventoryPageVariant =
  | 'locations'
  | 'stock-issues'
  | 'balance'
  | 'movements'
  | 'transfers'
  | 'stocktakes'
  | 'write-offs';

interface AdminInventoryOperationsPageProps {
  variant: InventoryPageVariant;
}

type InventoryRow = WarehouseLocationRow | StockIssueRow | StockBalanceRow | StockMovementRow | StockTransferRow | StocktakeRow | WriteOffRow;

const warehouses = ['Kho trung tâm HCM', 'Kho hàng sỉ HCM', 'Kho trung tâm Hà Nội', 'Kho Đà Nẵng'];
const statusLabels: Record<OperationStatus, string> = {
  DRAFT: 'Nháp',
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  COMPLETED: 'Hoàn tất',
  REJECTED: 'Từ chối',
};
const statusColors: Record<OperationStatus, string> = {
  DRAFT: 'default',
  PENDING: 'gold',
  APPROVED: 'blue',
  COMPLETED: 'green',
  REJECTED: 'red',
};

function OperationStatusTag({ value }: { value: OperationStatus }) {
  return <Tag color={statusColors[value]}>{statusLabels[value]}</Tag>;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

const pageCopy: Record<InventoryPageVariant, { title: string; description: string; createLabel?: string }> = {
  locations: { title: 'Vị trí kho', description: 'Quản lý khu vực, kệ và sức chứa trong từng kho.', createLabel: 'Thêm vị trí' },
  'stock-issues': { title: 'Phiếu xuất kho', description: 'Theo dõi việc giữ hàng và xuất hàng theo đơn bán.', createLabel: 'Tạo phiếu xuất' },
  balance: { title: 'Tồn kho', description: 'Xem tồn thực tế, số lượng giữ chỗ và khả dụng theo kho.' },
  movements: { title: 'Biến động tồn', description: 'Sổ giao dịch nhập, xuất, chuyển, kiểm kê và xuất hủy.' },
  transfers: { title: 'Chuyển kho', description: 'Điều chuyển hàng giữa các kho với quy trình phê duyệt.', createLabel: 'Tạo phiếu chuyển' },
  stocktakes: { title: 'Kiểm kê', description: 'Lập lịch, ghi nhận và xử lý chênh lệch kiểm kê.', createLabel: 'Tạo đợt kiểm kê' },
  'write-offs': { title: 'Xuất hủy', description: 'Quản lý đề nghị loại bỏ hàng hư hỏng hoặc hết hạn.', createLabel: 'Tạo phiếu xuất hủy' },
};

function includesKeyword(row: InventoryRow, keyword: string) {
  return !keyword || Object.values(row).some((value) => String(value).toLocaleLowerCase('vi').includes(keyword));
}

export function AdminInventoryOperationsPage({ variant }: AdminInventoryOperationsPageProps) {
  const { message } = App.useApp();
  const [keyword, setKeyword] = useState('');
  const [warehouse, setWarehouse] = useState<string>();
  const [selected, setSelected] = useState<InventoryRow>();
  const [formOpen, setFormOpen] = useState(false);
  const [form] = Form.useForm();
  const [locations, setLocations] = useState(initialLocations);
  const [issues, setIssues] = useState(initialStockIssues);
  const [transfers, setTransfers] = useState(initialStockTransfers);
  const [counts, setCounts] = useState(initialStocktakes);
  const [writeOffRows, setWriteOffRows] = useState(initialWriteOffs);
  const copy = pageCopy[variant];

  const data = useMemo<InventoryRow[]>(() => {
    if (variant === 'locations') return locations;
    if (variant === 'stock-issues') return issues;
    if (variant === 'balance') return stockBalances;
    if (variant === 'movements') return stockMovements;
    if (variant === 'transfers') return transfers;
    if (variant === 'stocktakes') return counts;
    return writeOffRows;
  }, [counts, issues, locations, transfers, variant, writeOffRows]);

  const filtered = useMemo(() => {
    const normalized = keyword.trim().toLocaleLowerCase('vi');
    return data.filter((row) => {
      const rowWarehouse = 'warehouse' in row
        ? row.warehouse
        : 'fromWarehouse' in row
          ? `${row.fromWarehouse} ${row.toWarehouse}`
          : '';
      return includesKeyword(row, normalized) && (!warehouse || rowWarehouse.includes(warehouse));
    });
  }, [data, keyword, warehouse]);

  const commonAction = {
    title: 'Thao tác',
    key: 'actions',
    width: 100,
    fixed: 'right' as const,
    render: (_: unknown, row: InventoryRow) => <Button type="link" onClick={() => setSelected(row)}>Xem</Button>,
  };

  const columns = useMemo<TableProps<InventoryRow>['columns']>(() => {
    if (variant === 'locations') return [
      { title: 'Mã vị trí', dataIndex: 'code', width: 150 },
      { title: 'Tên vị trí', dataIndex: 'name', width: 180 },
      { title: 'Kho', dataIndex: 'warehouse', width: 240 },
      { title: 'Khu', dataIndex: 'zone', width: 90 },
      { title: 'Mức sử dụng', width: 240, render: (_, row) => { const item = row as WarehouseLocationRow; const percent = Math.round(item.occupied / item.capacity * 100); return <Progress percent={percent} size="small" status={percent >= 90 ? 'exception' : 'normal'} />; } },
      { title: 'Trạng thái', dataIndex: 'status', width: 130, render: (value: WarehouseLocationRow['status']) => <Tag color={value === 'ACTIVE' ? 'green' : 'default'}>{value === 'ACTIVE' ? 'Hoạt động' : 'Ngừng dùng'}</Tag> },
      commonAction,
    ];
    if (variant === 'stock-issues') return [
      { title: 'Mã phiếu', dataIndex: 'code', width: 170 },
      { title: 'Đơn bán', dataIndex: 'orderCode', width: 150 },
      { title: 'Kho xuất', dataIndex: 'warehouse', width: 240 },
      { title: 'Số mặt hàng', dataIndex: 'itemCount', width: 130, align: 'right' },
      { title: 'Tổng SL', dataIndex: 'quantity', width: 110, align: 'right' },
      { title: 'Trạng thái', dataIndex: 'status', width: 140, render: (value: OperationStatus) => <OperationStatusTag value={value} /> },
      { title: 'Ngày tạo', dataIndex: 'createdAt', width: 170, render: formatDateTime },
      commonAction,
    ];
    if (variant === 'balance') return [
      { title: 'SKU', dataIndex: 'sku', width: 150 },
      { title: 'Sản phẩm', dataIndex: 'product', width: 300 },
      { title: 'Kho', dataIndex: 'warehouse', width: 240 },
      { title: 'Thực tế', dataIndex: 'onHand', width: 100, align: 'right' },
      { title: 'Giữ chỗ', dataIndex: 'reserved', width: 100, align: 'right' },
      { title: 'Khả dụng', dataIndex: 'available', width: 110, align: 'right', render: (value: number, row) => { const item = row as StockBalanceRow; return <Typography.Text type={value <= item.reorderPoint ? 'danger' : undefined} strong>{value}</Typography.Text>; } },
      { title: 'Điểm đặt lại', dataIndex: 'reorderPoint', width: 130, align: 'right' },
      { title: 'Cập nhật', dataIndex: 'updatedAt', width: 170, render: formatDateTime },
      commonAction,
    ];
    if (variant === 'movements') return [
      { title: 'Thời gian', dataIndex: 'occurredAt', width: 170, render: formatDateTime },
      { title: 'Chứng từ', dataIndex: 'reference', width: 170 },
      { title: 'Loại', dataIndex: 'type', width: 150, render: (value: StockMovementRow['type']) => <Tag>{value.replaceAll('_', ' ')}</Tag> },
      { title: 'SKU / Sản phẩm', width: 310, render: (_, row) => { const item = row as StockMovementRow; return <Flex vertical><Typography.Text strong>{item.sku}</Typography.Text><Typography.Text type="secondary">{item.product}</Typography.Text></Flex>; } },
      { title: 'Kho', dataIndex: 'warehouse', width: 220 },
      { title: 'Thay đổi', dataIndex: 'quantity', width: 110, align: 'right', render: (value: number) => <Typography.Text type={value < 0 ? 'danger' : 'success'} strong>{value > 0 ? `+${value}` : value}</Typography.Text> },
      { title: 'Tồn sau', dataIndex: 'balanceAfter', width: 100, align: 'right' },
      { title: 'Người thực hiện', dataIndex: 'actor', width: 180 },
      commonAction,
    ];
    if (variant === 'transfers') return [
      { title: 'Mã phiếu', dataIndex: 'code', width: 170 },
      { title: 'Kho đi', dataIndex: 'fromWarehouse', width: 230 },
      { title: 'Kho đến', dataIndex: 'toWarehouse', width: 230 },
      { title: 'Mặt hàng', dataIndex: 'itemCount', width: 100, align: 'right' },
      { title: 'Tổng SL', dataIndex: 'quantity', width: 100, align: 'right' },
      { title: 'Trạng thái', dataIndex: 'status', width: 140, render: (value: OperationStatus) => <OperationStatusTag value={value} /> },
      { title: 'Ngày đề nghị', dataIndex: 'requestedAt', width: 170, render: formatDateTime },
      commonAction,
    ];
    if (variant === 'stocktakes') return [
      { title: 'Mã đợt', dataIndex: 'code', width: 170 },
      { title: 'Kho', dataIndex: 'warehouse', width: 240 },
      { title: 'Phạm vi', dataIndex: 'scope', width: 180 },
      { title: 'Đã đếm', dataIndex: 'countedItems', width: 110, align: 'right' },
      { title: 'Có lệch', dataIndex: 'differenceItems', width: 110, align: 'right', render: (value: number) => <Typography.Text type={value ? 'danger' : undefined}>{value}</Typography.Text> },
      { title: 'Trạng thái', dataIndex: 'status', width: 140, render: (value: OperationStatus) => <OperationStatusTag value={value} /> },
      { title: 'Lịch kiểm kê', dataIndex: 'scheduledAt', width: 170, render: formatDateTime },
      commonAction,
    ];
    return [
      { title: 'Mã phiếu', dataIndex: 'code', width: 170 },
      { title: 'Kho', dataIndex: 'warehouse', width: 230 },
      { title: 'Lý do', dataIndex: 'reason', width: 280 },
      { title: 'Mặt hàng', dataIndex: 'itemCount', width: 100, align: 'right' },
      { title: 'Tổng SL', dataIndex: 'quantity', width: 100, align: 'right' },
      { title: 'Trạng thái', dataIndex: 'status', width: 140, render: (value: OperationStatus) => <OperationStatusTag value={value} /> },
      { title: 'Ngày đề nghị', dataIndex: 'requestedAt', width: 170, render: formatDateTime },
      commonAction,
    ];
  }, [variant]);

  const handleCreate = async () => {
    const values = await form.validateFields();
    const now = new Date().toISOString();
    if (variant === 'locations') {
      setLocations((current) => [{ id: Date.now(), code: values.code, name: values.name, warehouse: values.warehouse, zone: values.zone, capacity: values.capacity, occupied: 0, status: 'ACTIVE' }, ...current]);
    } else if (variant === 'stock-issues') {
      setIssues((current) => [{ id: Date.now(), code: `PXK-${Date.now().toString().slice(-6)}`, orderCode: values.reference, warehouse: values.warehouse, itemCount: values.itemCount, quantity: values.quantity, status: 'DRAFT', createdAt: now }, ...current]);
    } else if (variant === 'transfers') {
      setTransfers((current) => [{ id: Date.now(), code: `CK-${Date.now().toString().slice(-6)}`, fromWarehouse: values.fromWarehouse, toWarehouse: values.toWarehouse, itemCount: values.itemCount, quantity: values.quantity, status: 'DRAFT', requestedAt: now }, ...current]);
    } else if (variant === 'stocktakes') {
      setCounts((current) => [{ id: Date.now(), code: `KK-${Date.now().toString().slice(-6)}`, warehouse: values.warehouse, scope: values.scope, countedItems: 0, differenceItems: 0, status: 'DRAFT', scheduledAt: values.scheduledAt }, ...current]);
    } else if (variant === 'write-offs') {
      setWriteOffRows((current) => [{ id: Date.now(), code: `XH-${Date.now().toString().slice(-6)}`, warehouse: values.warehouse, reason: values.reason, itemCount: values.itemCount, quantity: values.quantity, status: 'DRAFT', requestedAt: now }, ...current]);
    }
    setFormOpen(false);
    form.resetFields();
    void message.success('Đã tạo bản ghi nháp.');
  };

  return (
    <div className="admin-operations-page">
      <AdminListPage
        title={copy.title}
        description={copy.description}
        primaryAction={copy.createLabel ? <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormOpen(true)}>{copy.createLabel}</Button> : undefined}
        toolbar={(
          <Row gutter={[12, 12]}>
            <Col xs={24} md={12} xl={8}><Input allowClear prefix={<SearchOutlined />} value={keyword} placeholder="Tìm mã, sản phẩm hoặc chứng từ" onChange={(event) => setKeyword(event.target.value)} /></Col>
            <Col xs={24} sm={12} md={8} xl={5}><Select allowClear value={warehouse} placeholder="Tất cả kho" options={warehouses.map((item) => ({ value: item, label: item }))} onChange={setWarehouse} /></Col>
            <Col><Button onClick={() => { setKeyword(''); setWarehouse(undefined); }}>Đặt lại</Button></Col>
          </Row>
        )}
        summary={<Typography.Text strong>{filtered.length} bản ghi</Typography.Text>}
      >
        <Table<InventoryRow> rowKey="id" dataSource={filtered} columns={columns} scroll={{ x: 1100 }} pagination={{ pageSize: 10, showSizeChanger: true }} />
      </AdminListPage>

      <Drawer open={Boolean(selected)} width="min(620px, 100%)" title="Chi tiết nghiệp vụ" onClose={() => setSelected(undefined)}>
        {selected ? <Descriptions bordered column={1} size="small" items={Object.entries(selected).filter(([key]) => key !== 'id').map(([key, value]) => ({ key, label: key, children: typeof value === 'string' && value.includes('T') ? formatDateTime(value) : String(value) }))} /> : null}
      </Drawer>

      <Drawer open={formOpen} width="min(620px, 100%)" title={copy.createLabel} destroyOnHidden onClose={() => setFormOpen(false)} footer={<Flex justify="flex-end"><Space><Button onClick={() => setFormOpen(false)}>Hủy</Button><Button type="primary" onClick={() => void handleCreate()}>Lưu nháp</Button></Space></Flex>}>
        <Form form={form} layout="vertical">
          {variant === 'locations' ? <><Row gutter={12}><Col span={10}><Form.Item name="code" label="Mã vị trí" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={14}><Form.Item name="name" label="Tên vị trí" rules={[{ required: true }]}><Input /></Form.Item></Col></Row><Form.Item name="warehouse" label="Kho" rules={[{ required: true }]}><Select options={warehouses.map((item) => ({ value: item, label: item }))} /></Form.Item><Row gutter={12}><Col span={12}><Form.Item name="zone" label="Khu" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={12}><Form.Item name="capacity" label="Sức chứa" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item></Col></Row></> : null}
          {variant === 'stock-issues' ? <><Form.Item name="reference" label="Đơn bán" rules={[{ required: true }]}><Input placeholder="SO-..." /></Form.Item><Form.Item name="warehouse" label="Kho xuất" rules={[{ required: true }]}><Select options={warehouses.map((item) => ({ value: item, label: item }))} /></Form.Item></> : null}
          {variant === 'transfers' ? <><Form.Item name="fromWarehouse" label="Kho đi" rules={[{ required: true }]}><Select options={warehouses.map((item) => ({ value: item, label: item }))} /></Form.Item><Form.Item name="toWarehouse" label="Kho đến" dependencies={['fromWarehouse']} rules={[{ required: true }, ({ getFieldValue }) => ({ validator: (_, value) => value && value === getFieldValue('fromWarehouse') ? Promise.reject(new Error('Kho đến phải khác kho đi.')) : Promise.resolve() })]}><Select options={warehouses.map((item) => ({ value: item, label: item }))} /></Form.Item></> : null}
          {variant === 'stocktakes' ? <><Form.Item name="warehouse" label="Kho" rules={[{ required: true }]}><Select options={warehouses.map((item) => ({ value: item, label: item }))} /></Form.Item><Form.Item name="scope" label="Phạm vi" rules={[{ required: true }]}><Input placeholder="Toàn kho hoặc khu vực" /></Form.Item><Form.Item name="scheduledAt" label="Thời gian dự kiến" rules={[{ required: true }]}><Input type="datetime-local" /></Form.Item></> : null}
          {variant === 'write-offs' ? <><Form.Item name="warehouse" label="Kho" rules={[{ required: true }]}><Select options={warehouses.map((item) => ({ value: item, label: item }))} /></Form.Item><Form.Item name="reason" label="Lý do" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item></> : null}
          {['stock-issues', 'transfers', 'write-offs'].includes(variant) ? <Row gutter={12}><Col span={12}><Form.Item name="itemCount" label="Số mặt hàng" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item></Col><Col span={12}><Form.Item name="quantity" label="Tổng số lượng" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item></Col></Row> : null}
        </Form>
      </Drawer>
    </div>
  );
}
