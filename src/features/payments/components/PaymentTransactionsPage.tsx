import {
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  App,
  Button,
  DatePicker,
  Descriptions,
  Drawer,
  Empty,
  Flex,
  Input,
  Pagination,
  Select,
  Skeleton,
  Table,
  theme,
  Tooltip,
  Typography,
} from 'antd';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import { ErrorState } from '../../../components/common/ErrorState';
import { PageHeader } from '../../../components/common/PageHeader';
import {
  usePaymentActions,
  usePaymentReferenceData,
  usePaymentTransactionsMock,
} from '../hooks/useAdminPaymentsMock';
import type {
  PaymentSide,
  PaymentMethod,
  RecordPaymentInput,
  TransactionFilters,
  TransactionListItem,
} from '../payments.model';
import { initialTransactionFilters } from '../payments.model';
import { formatCurrency, formatDate, paymentMethodLabels } from '../payment.utils';
import '../payments.css';
import { PaymentFormDrawer } from './PaymentFormDrawer';
import { PaymentStatusTag } from './PaymentStatusTag';

interface PaymentTransactionsPageProps {
  side: PaymentSide;
}

export function PaymentTransactionsPage({ side }: PaymentTransactionsPageProps) {
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const [filters, setFilters] = useState<TransactionFilters>(initialTransactionFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionListItem>();
  const isCustomer = side === 'CUSTOMER';
  const title = isCustomer ? 'Giao dịch thanh toán' : 'Lịch sử thanh toán nhà cung cấp';
  const listQuery = usePaymentTransactionsMock(side, filters, page, pageSize);
  const referenceQuery = usePaymentReferenceData(side);
  const { recordPayment, isRecording } = usePaymentActions(side);
  const total = listQuery.data?.totalElements ?? 0;
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  const orderOptions = useMemo(
    () => (referenceQuery.data?.orders ?? [])
      .filter((order) => !filters.partnerId || order.partnerId === filters.partnerId)
      .map((order) => ({ value: order.id, label: order.code })),
    [filters.partnerId, referenceQuery.data?.orders],
  );

  const updateFilters = (patch: Partial<TransactionFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };

  const handleRefresh = () => {
    setFilters(initialTransactionFilters);
    setPage(1);
    void listQuery.refetch();
  };

  const handleRecordPayment = async (values: RecordPaymentInput) => {
    try {
      await recordPayment(values);
      setFormOpen(false);
      void message.success(
        isCustomer ? 'Đã ghi nhận thanh toán của khách hàng.' : 'Đã ghi nhận thanh toán cho nhà cung cấp.',
      );
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể ghi nhận thanh toán.');
    }
  };

  const columns: TableColumnsType<TransactionListItem> = [
    { title: 'Mã giao dịch', dataIndex: 'code', width: 126 },
    { title: 'Ngày thanh toán', dataIndex: 'paidDate', width: 132, render: formatDate },
    {
      title: isCustomer ? 'Khách hàng' : 'Nhà cung cấp',
      dataIndex: 'partnerName',
      width: 240,
      ellipsis: { showTitle: false },
      render: (value: string) => <Tooltip title={value}>{value}</Tooltip>,
    },
    { title: isCustomer ? 'Đơn bán' : 'Đơn mua', dataIndex: 'orderCode', width: 112 },
    {
      title: 'Đợt thanh toán',
      dataIndex: 'installmentNo',
      width: 132,
      render: (value: number) => `Đợt ${value}`,
    },
    { title: 'Số tiền', dataIndex: 'amount', align: 'right', width: 154, render: formatCurrency },
    {
      title: 'Phương thức',
      dataIndex: 'method',
      width: 138,
      render: (value: PaymentMethod) => paymentMethodLabels[value],
    },
    { title: isCustomer ? 'Người ghi nhận' : 'Người thực hiện', dataIndex: 'recordedBy', width: 148 },
    { title: 'Mã tham chiếu', dataIndex: 'referenceCode', width: 146, render: (value?: string) => value ?? '—' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 126,
      render: (status) => <PaymentStatusTag status={status} />,
    },
    {
      title: 'Thao tác',
      width: 92,
      render: (_, transaction) => (
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setSelectedTransaction(transaction)}>
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div
      className="admin-payments-page"
      style={
        {
          '--payments-color-border': token.colorBorderSecondary,
          '--payments-color-fill': token.colorFillQuaternary,
          '--payments-color-bg': token.colorBgContainer,
          '--payments-color-primary': token.colorPrimary,
          '--payments-color-primary-bg': token.colorPrimaryBg,
          '--payments-color-text-secondary': token.colorTextSecondary,
          '--payments-color-error': token.colorError,
          '--payments-row-hover': token.controlItemBgHover,
          '--payments-border-radius': `${token.borderRadius}px`,
        } as CSSProperties
      }
    >
      <Flex vertical gap={12}>
        <PageHeader
          title={title}
          description={isCustomer
            ? 'Theo dõi toàn bộ khoản tiền khách hàng đã thanh toán.'
            : 'Theo dõi các khoản doanh nghiệp đã thanh toán cho nhà cung cấp.'}
        />

        <section className="payments-workspace">
          <div className="payments-toolbar">
            <div className="payments-toolbar__filters">
              <Input
                allowClear
                prefix={<SearchOutlined />}
                value={filters.keyword}
                placeholder={isCustomer
                  ? 'Tìm mã giao dịch, khách hàng, đơn bán...'
                  : 'Tìm mã giao dịch, nhà cung cấp, đơn mua...'}
                onChange={(event) => updateFilters({ keyword: event.target.value })}
                className="payments-toolbar__search"
              />
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                value={filters.partnerId}
                placeholder={isCustomer ? 'Khách hàng' : 'Nhà cung cấp'}
                options={(referenceQuery.data?.partners ?? []).map((partner) => ({
                  value: partner.id,
                  label: partner.name,
                }))}
                onChange={(partnerId) => updateFilters({ partnerId, orderId: undefined })}
                className="payments-toolbar__filter"
              />
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                value={filters.orderId}
                placeholder={isCustomer ? 'Đơn bán' : 'Đơn mua'}
                options={orderOptions}
                onChange={(orderId) => updateFilters({ orderId })}
                className="payments-toolbar__filter payments-toolbar__filter--small"
              />
              <Select
                allowClear
                value={filters.method}
                placeholder="Phương thức"
                options={Object.entries(paymentMethodLabels).map(([value, label]) => ({ value, label }))}
                onChange={(method) => updateFilters({ method })}
                className="payments-toolbar__filter"
              />
              <Select
                allowClear
                value={filters.status}
                placeholder="Trạng thái"
                options={[
                  { value: 'SUCCESS', label: 'Thành công' },
                  { value: 'PENDING', label: 'Đang xử lý' },
                  { value: 'FAILED', label: 'Thất bại' },
                ]}
                onChange={(status) => updateFilters({ status })}
                className="payments-toolbar__filter payments-toolbar__filter--small"
              />
              <DatePicker.RangePicker
                value={filters.dateFrom && filters.dateTo ? [dayjs(filters.dateFrom), dayjs(filters.dateTo)] : null}
                format="DD/MM/YYYY"
                placeholder={['Từ ngày', 'Đến ngày']}
                onChange={(dates) => updateFilters({
                  dateFrom: dates?.[0]?.format('YYYY-MM-DD'),
                  dateTo: dates?.[1]?.format('YYYY-MM-DD'),
                })}
                className="payments-toolbar__range"
              />
            </div>
            <div className="payments-toolbar__actions">
              <Typography.Text type="secondary" className="payments-toolbar__count">
                {total === 0 ? '0 bản ghi' : `${rangeStart}-${rangeEnd} / ${total}`}
              </Typography.Text>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormOpen(true)}>
                {isCustomer ? 'Ghi nhận thanh toán' : 'Thanh toán NCC'}
              </Button>
              <Button icon={<ReloadOutlined />} loading={listQuery.isFetching} onClick={handleRefresh}>
                Làm mới
              </Button>
            </div>
          </div>

          {listQuery.isLoading ? <div className="payments-state"><Skeleton active paragraph={{ rows: 10 }} /></div> : null}
          {listQuery.isError ? (
            <ErrorState message="Không thể tải lịch sử thanh toán mock." onRetry={() => void listQuery.refetch()} />
          ) : null}
          {!listQuery.isLoading && !listQuery.isError ? (
            <Table<TransactionListItem>
              className="payments-data-table"
              rowKey="id"
              size="small"
              tableLayout="fixed"
              columns={columns}
              dataSource={listQuery.data?.content ?? []}
              loading={listQuery.isFetching}
              pagination={false}
              scroll={{ x: 1580 }}
              locale={{ emptyText: <Empty description="Chưa có giao dịch phù hợp" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
            />
          ) : null}
          {!listQuery.isLoading && !listQuery.isError ? (
            <Flex justify="space-between" align="center" gap={12} wrap className="payments-pagination">
              <Typography.Text type="secondary">
                {total === 0 ? 'Không có bản ghi' : `Đang hiển thị ${rangeStart}-${rangeEnd} trên ${total}`}
              </Typography.Text>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                showSizeChanger
                pageSizeOptions={[10, 20, 50]}
                onChange={(nextPage, nextPageSize) => {
                  setPage(nextPageSize !== pageSize ? 1 : nextPage);
                  setPageSize(nextPageSize);
                }}
              />
            </Flex>
          ) : null}
        </section>
      </Flex>

      <PaymentFormDrawer
        open={formOpen}
        side={side}
        data={referenceQuery.data}
        loading={isRecording}
        onClose={() => setFormOpen(false)}
        onSubmit={handleRecordPayment}
      />

      <Drawer
        open={Boolean(selectedTransaction)}
        title="Chi tiết giao dịch"
        width={560}
        onClose={() => setSelectedTransaction(undefined)}
        destroyOnHidden
      >
        {selectedTransaction ? (
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Mã giao dịch">{selectedTransaction.code}</Descriptions.Item>
            <Descriptions.Item label="Ngày thanh toán">{formatDate(selectedTransaction.paidDate)}</Descriptions.Item>
            <Descriptions.Item label={isCustomer ? 'Khách hàng' : 'Nhà cung cấp'}>{selectedTransaction.partnerName}</Descriptions.Item>
            <Descriptions.Item label={isCustomer ? 'Đơn bán' : 'Đơn mua'}>{selectedTransaction.orderCode}</Descriptions.Item>
            <Descriptions.Item label="Đợt thanh toán">Đợt {selectedTransaction.installmentNo}</Descriptions.Item>
            <Descriptions.Item label="Số tiền">{formatCurrency(selectedTransaction.amount)}</Descriptions.Item>
            <Descriptions.Item label="Phương thức">{paymentMethodLabels[selectedTransaction.method]}</Descriptions.Item>
            <Descriptions.Item label="Mã tham chiếu">{selectedTransaction.referenceCode ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Người thực hiện">{selectedTransaction.recordedBy}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái"><PaymentStatusTag status={selectedTransaction.status} /></Descriptions.Item>
            <Descriptions.Item label="Ghi chú">{selectedTransaction.note ?? '—'}</Descriptions.Item>
          </Descriptions>
        ) : null}
      </Drawer>
    </div>
  );
}
