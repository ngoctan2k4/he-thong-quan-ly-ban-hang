import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Descriptions,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
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
  accountingEntries,
  type AccountingEntry,
  type AccountingStatus,
  type AccountingVariant,
  type PaymentStatus,
} from '../../mocks/adminAccounting';
import './adminAccounting.css';

interface AdminAccountingPageProps {
  variant: AccountingVariant;
}

interface AccountingFormValues {
  documentDate: string;
  partner: string;
  partnerTaxCode?: string;
  reference: string;
  description: string;
  subtotal: number;
  taxRate: number;
  channel?: string;
}

const pageCopy: Record<AccountingVariant, { title: string; description: string; createLabel: string; prefix: string }> = {
  'purchase-goods': { title: 'Chứng từ mua hàng hóa', description: 'Đối chiếu đơn mua, phiếu nhập, hóa đơn và công nợ nhà cung cấp.', createLabel: 'Lập chứng từ mua', prefix: 'MH' },
  'purchase-services': { title: 'Chứng từ mua dịch vụ', description: 'Ghi nhận chi phí dịch vụ theo hóa đơn và biên bản nghiệm thu.', createLabel: 'Lập chứng từ dịch vụ', prefix: 'DV' },
  'purchase-returns': { title: 'Trả lại hàng mua', description: 'Theo dõi chứng từ giảm mua và khoản nhà cung cấp cần hoàn.', createLabel: 'Lập chứng từ trả', prefix: 'TL' },
  'sales-vouchers': { title: 'Chứng từ bán hàng', description: 'Đối chiếu đơn bán, phiếu xuất, doanh thu và công nợ khách hàng.', createLabel: 'Lập chứng từ bán', prefix: 'BH' },
  'sales-invoices': { title: 'Hóa đơn', description: 'Quản lý hóa đơn bán hàng và trạng thái ghi nhận kế toán.', createLabel: 'Lập hóa đơn', prefix: 'HĐ' },
  'ecommerce-vouchers': { title: 'Chứng từ hàng hóa Ecom', description: 'Tổng hợp doanh thu, thuế và đối soát theo từng kênh bán trực tuyến.', createLabel: 'Lập chứng từ Ecom', prefix: 'EC' },
};

const statusMeta: Record<AccountingStatus, { label: string; color: string }> = {
  DRAFT: { label: 'Nháp', color: 'default' },
  PENDING: { label: 'Chờ ghi sổ', color: 'gold' },
  POSTED: { label: 'Đã ghi sổ', color: 'green' },
  CANCELLED: { label: 'Đã hủy', color: 'red' },
};

const paymentMeta: Record<PaymentStatus, { label: string; color: string }> = {
  UNPAID: { label: 'Chưa thanh toán', color: 'red' },
  PARTIAL: { label: 'Thanh toán một phần', color: 'blue' },
  PAID: { label: 'Đã thanh toán', color: 'green' },
  REFUNDED: { label: 'Đã hoàn tiền', color: 'purple' },
};

const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('vi-VN');

function formatMoney(value: number) {
  return moneyFormatter.format(value);
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

export function AdminAccountingPage({ variant }: AdminAccountingPageProps) {
  const copy = pageCopy[variant];
  const [rows, setRows] = useState(() => accountingEntries.filter((item) => item.variant === variant));
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<AccountingStatus>();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>();
  const [selected, setSelected] = useState<AccountingEntry>();
  const [formOpen, setFormOpen] = useState(false);
  const [form] = Form.useForm<AccountingFormValues>();

  const filteredRows = useMemo(() => {
    const normalized = keyword.trim().toLocaleLowerCase('vi');
    return rows.filter((row) => {
      const searchable = `${row.code} ${row.partner} ${row.reference} ${row.description} ${row.channel ?? ''}`.toLocaleLowerCase('vi');
      return (!normalized || searchable.includes(normalized))
        && (!status || row.status === status)
        && (!paymentStatus || row.paymentStatus === paymentStatus);
    });
  }, [keyword, paymentStatus, rows, status]);

  const totals = useMemo(() => filteredRows.reduce(
    (result, row) => ({
      subtotal: result.subtotal + row.subtotal,
      vatAmount: result.vatAmount + row.vatAmount,
      total: result.total + row.total,
      pending: result.pending + (row.status === 'PENDING' ? 1 : 0),
    }),
    { subtotal: 0, vatAmount: 0, total: 0, pending: 0 },
  ), [filteredRows]);

  const columns: TableProps<AccountingEntry>['columns'] = [
    {
      title: 'Số chứng từ',
      dataIndex: 'code',
      width: 160,
      fixed: 'left',
      render: (value: string) => <Typography.Text strong className="accounting-code">{value}</Typography.Text>,
    },
    { title: 'Ngày chứng từ', dataIndex: 'documentDate', width: 140, render: formatDate },
    {
      title: 'Đối tượng',
      width: 260,
      render: (_, row) => (
        <Flex vertical gap={2}>
          <Typography.Text>{row.partner}</Typography.Text>
          <Typography.Text type="secondary">MST: {row.partnerTaxCode}</Typography.Text>
        </Flex>
      ),
    },
    { title: 'Tham chiếu', dataIndex: 'reference', width: 210 },
    ...(variant === 'ecommerce-vouchers'
      ? [{ title: 'Kênh', dataIndex: 'channel' as const, width: 130, render: (value: string) => <Tag>{value}</Tag> }]
      : []),
    { title: 'Tiền hàng', dataIndex: 'subtotal', width: 160, align: 'right', className: 'accounting-money', render: formatMoney },
    { title: 'Thuế GTGT', dataIndex: 'vatAmount', width: 150, align: 'right', className: 'accounting-money', render: formatMoney },
    { title: 'Tổng cộng', dataIndex: 'total', width: 170, align: 'right', className: 'accounting-money', render: (value: number) => <Typography.Text strong>{formatMoney(value)}</Typography.Text> },
    { title: 'Thanh toán', dataIndex: 'paymentStatus', width: 190, render: (value: PaymentStatus) => <Tag color={paymentMeta[value].color}>{paymentMeta[value].label}</Tag> },
    { title: 'Trạng thái', dataIndex: 'status', width: 150, render: (value: AccountingStatus) => <Tag color={statusMeta[value].color}>{statusMeta[value].label}</Tag> },
    { title: 'Thao tác', key: 'action', width: 90, fixed: 'right', render: (_, row) => <Button type="link" onClick={() => setSelected(row)}>Xem</Button> },
  ];

  const openCreateForm = () => {
    form.setFieldsValue({
      documentDate: new Date().toISOString().slice(0, 10),
      taxRate: 10,
    });
    setFormOpen(true);
  };

  const handleCreate = async () => {
    const values = await form.validateFields();
    const vatAmount = Math.round(values.subtotal * values.taxRate / 100);
    const sequence = String(Date.now()).slice(-4);
    setRows((current) => [{
      id: Date.now(),
      variant,
      code: `${copy.prefix}-${new Date().toISOString().slice(2, 7).replace('-', '')}-${sequence}`,
      documentDate: values.documentDate,
      partner: values.partner,
      partnerTaxCode: values.partnerTaxCode?.trim() || '—',
      reference: values.reference,
      description: values.description,
      subtotal: values.subtotal,
      vatAmount,
      total: values.subtotal + vatAmount,
      paymentStatus: 'UNPAID',
      status: 'DRAFT',
      channel: values.channel,
    }, ...current]);
    form.resetFields();
    setFormOpen(false);
  };

  return (
    <div className="admin-accounting-page">
      <AdminListPage
        title={copy.title}
        description={copy.description}
        primaryAction={<Button type="primary" icon={<PlusOutlined />} onClick={openCreateForm}>{copy.createLabel}</Button>}
        toolbar={(
          <Row gutter={[12, 12]}>
            <Col xs={24} lg={10} xl={8}>
              <Input allowClear prefix={<SearchOutlined />} value={keyword} placeholder="Tìm số chứng từ, đối tượng, tham chiếu" onChange={(event) => setKeyword(event.target.value)} />
            </Col>
            <Col xs={24} sm={12} lg={5}>
              <Select allowClear value={status} placeholder="Tất cả trạng thái" options={Object.entries(statusMeta).map(([value, item]) => ({ value, label: item.label }))} onChange={setStatus} />
            </Col>
            <Col xs={24} sm={12} lg={5}>
              <Select allowClear value={paymentStatus} placeholder="Tất cả thanh toán" options={Object.entries(paymentMeta).map(([value, item]) => ({ value, label: item.label }))} onChange={setPaymentStatus} />
            </Col>
            <Col><Button onClick={() => { setKeyword(''); setStatus(undefined); setPaymentStatus(undefined); }}>Đặt lại</Button></Col>
          </Row>
        )}
        summary={(
          <div className="accounting-summary" aria-label="Tổng hợp chứng từ đang hiển thị">
            <div><span>Số chứng từ</span><strong>{filteredRows.length}</strong></div>
            <div><span>Tiền hàng</span><strong>{formatMoney(totals.subtotal)}</strong></div>
            <div><span>Thuế GTGT</span><strong>{formatMoney(totals.vatAmount)}</strong></div>
            <div><span>Tổng cộng</span><strong>{formatMoney(totals.total)}</strong></div>
            <div><span>Chờ ghi sổ</span><strong>{totals.pending}</strong></div>
          </div>
        )}
      >
        <Table<AccountingEntry>
          rowKey="id"
          dataSource={filteredRows}
          columns={columns}
          scroll={{ x: 1500 }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `${total} chứng từ` }}
          locale={{ emptyText: 'Không có chứng từ phù hợp với bộ lọc.' }}
        />
      </AdminListPage>

      <Drawer title="Chi tiết chứng từ" open={Boolean(selected)} width="min(680px, 100%)" onClose={() => setSelected(undefined)}>
        {selected ? (
          <Descriptions bordered column={1} size="small" items={[
            { key: 'code', label: 'Số chứng từ', children: selected.code },
            { key: 'date', label: 'Ngày chứng từ', children: formatDate(selected.documentDate) },
            { key: 'partner', label: 'Đối tượng', children: selected.partner },
            { key: 'taxCode', label: 'Mã số thuế', children: selected.partnerTaxCode },
            { key: 'reference', label: 'Tham chiếu', children: selected.reference },
            ...(selected.channel ? [{ key: 'channel', label: 'Kênh bán', children: selected.channel }] : []),
            { key: 'description', label: 'Diễn giải', children: selected.description },
            { key: 'subtotal', label: 'Tiền hàng', children: formatMoney(selected.subtotal) },
            { key: 'vat', label: 'Thuế GTGT', children: formatMoney(selected.vatAmount) },
            { key: 'total', label: 'Tổng cộng', children: <Typography.Text strong>{formatMoney(selected.total)}</Typography.Text> },
            { key: 'payment', label: 'Thanh toán', children: <Tag color={paymentMeta[selected.paymentStatus].color}>{paymentMeta[selected.paymentStatus].label}</Tag> },
            { key: 'status', label: 'Trạng thái', children: <Tag color={statusMeta[selected.status].color}>{statusMeta[selected.status].label}</Tag> },
          ]} />
        ) : null}
      </Drawer>

      <Drawer
        title={copy.createLabel}
        open={formOpen}
        width="min(680px, 100%)"
        destroyOnHidden
        onClose={() => { setFormOpen(false); form.resetFields(); }}
        footer={<Flex justify="flex-end"><Space><Button onClick={() => setFormOpen(false)}>Hủy</Button><Button type="primary" onClick={() => void handleCreate()}>Lưu nháp</Button></Space></Flex>}
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Row gutter={12}>
            <Col xs={24} sm={10}><Form.Item name="documentDate" label="Ngày chứng từ" rules={[{ required: true, message: 'Chọn ngày chứng từ.' }]}><Input type="date" /></Form.Item></Col>
            <Col xs={24} sm={14}><Form.Item name="reference" label="Chứng từ tham chiếu" rules={[{ required: true, message: 'Nhập đơn hàng, phiếu kho hoặc hóa đơn liên quan.' }]}><Input placeholder="PO, SO, PNK, PXK hoặc số hóa đơn" /></Form.Item></Col>
          </Row>
          <Form.Item name="partner" label="Đối tượng" rules={[{ required: true, message: 'Nhập tên khách hàng hoặc nhà cung cấp.' }]}><Input /></Form.Item>
          <Form.Item name="partnerTaxCode" label="Mã số thuế"><Input /></Form.Item>
          {variant === 'ecommerce-vouchers' ? <Form.Item name="channel" label="Kênh bán" rules={[{ required: true, message: 'Chọn kênh bán cần đối soát.' }]}><Select options={['Website', 'Shopee', 'Lazada', 'TikTok Shop'].map((value) => ({ value, label: value }))} /></Form.Item> : null}
          <Form.Item name="description" label="Diễn giải" rules={[{ required: true, message: 'Nhập nội dung nghiệp vụ của chứng từ.' }]}><Input.TextArea rows={3} /></Form.Item>
          <Row gutter={12}>
            <Col xs={24} sm={15}><Form.Item name="subtotal" label="Tiền hàng / dịch vụ" rules={[{ required: true, message: 'Nhập giá trị trước thuế.' }]}><InputNumber min={0} precision={0} suffix="₫" style={{ width: '100%' }} /></Form.Item></Col>
            <Col xs={24} sm={9}><Form.Item name="taxRate" label="Thuế suất" rules={[{ required: true, message: 'Nhập thuế suất.' }]}><InputNumber min={0} max={100} precision={0} suffix="%" style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Typography.Paragraph type="secondary">Chứng từ mới được lưu ở trạng thái Nháp và chưa tác động đến số liệu đã ghi sổ.</Typography.Paragraph>
        </Form>
      </Drawer>
    </div>
  );
}
