import { EyeOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  App,
  Button,
  DatePicker,
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
import { useState } from 'react';
import { ErrorState } from '../../../components/common/ErrorState';
import { PageHeader } from '../../../components/common/PageHeader';
import {
  usePartnerDebtDetailMock,
  usePartnerDebtsMock,
  usePaymentActions,
  usePaymentReferenceData,
} from '../hooks/useAdminPaymentsMock';
import type {
  DebtFilters,
  PartnerDebtSummary,
  PaymentSide,
  RecordPaymentInput,
} from '../payments.model';
import { initialDebtFilters } from '../payments.model';
import { formatCurrency, formatDate } from '../payment.utils';
import '../payments.css';
import { DebtDetailDrawer } from './DebtDetailDrawer';
import { DebtSummary } from './DebtSummary';
import { PaymentFormDrawer } from './PaymentFormDrawer';
import { PaymentStatusTag } from './PaymentStatusTag';

interface PartnerDebtsPageProps {
  side: PaymentSide;
}

interface PaymentPreset {
  partnerId?: string;
  orderId?: string;
  scheduleId?: string;
}

export function PartnerDebtsPage({ side }: PartnerDebtsPageProps) {
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const [filters, setFilters] = useState<DebtFilters>(initialDebtFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>();
  const [paymentPreset, setPaymentPreset] = useState<PaymentPreset>();
  const isCustomer = side === 'CUSTOMER';
  const listQuery = usePartnerDebtsMock(side, filters, page, pageSize);
  const referenceQuery = usePaymentReferenceData(side);
  const detailQuery = usePartnerDebtDetailMock(side, selectedPartnerId);
  const { recordPayment, isRecording } = usePaymentActions(side);
  const total = listQuery.data?.totalElements ?? 0;
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  const updateFilters = (patch: Partial<DebtFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };

  const openPayment = (partnerId?: string, orderId?: string, scheduleId?: string) => {
    setPaymentPreset({ partnerId, orderId, scheduleId });
  };

  const handleRecordPayment = async (values: RecordPaymentInput) => {
    try {
      await recordPayment(values);
      setPaymentPreset(undefined);
      void message.success(
        isCustomer ? 'Đã ghi nhận thanh toán của khách hàng.' : 'Đã thanh toán cho nhà cung cấp.',
      );
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể ghi nhận thanh toán.');
    }
  };

  const handleRefresh = () => {
    setFilters(initialDebtFilters);
    setPage(1);
    void listQuery.refetch();
  };

  const columns: TableColumnsType<PartnerDebtSummary> = [
    {
      title: isCustomer ? 'Khách hàng' : 'Nhà cung cấp',
      dataIndex: 'name',
      width: 250,
      ellipsis: { showTitle: false },
      render: (value: string, record) => (
        <button className="payments-table__entity" type="button" onClick={() => setSelectedPartnerId(record.id)}>
          <Tooltip title={value}>{value}</Tooltip>
          <Typography.Text type="secondary">{record.code}</Typography.Text>
        </button>
      ),
    },
    { title: isCustomer ? 'Tổng phải thu' : 'Tổng phải trả', dataIndex: 'totalAmount', align: 'right', width: 150, render: formatCurrency },
    { title: isCustomer ? 'Đã thu' : 'Đã thanh toán', dataIndex: 'paidAmount', align: 'right', width: 150, render: formatCurrency },
    { title: 'Còn nợ', dataIndex: 'remainingAmount', align: 'right', width: 150, render: (value: number) => <Typography.Text strong>{formatCurrency(value)}</Typography.Text> },
    { title: 'Quá hạn', dataIndex: 'overdueAmount', align: 'right', width: 144, render: (value: number) => <Typography.Text type={value > 0 ? 'danger' : undefined}>{formatCurrency(value)}</Typography.Text> },
    { title: 'Chưa đến hạn', dataIndex: 'notDueAmount', align: 'right', width: 150, render: formatCurrency },
    { title: isCustomer ? 'Số đơn còn nợ' : 'Số đơn mua còn nợ', dataIndex: 'openOrderCount', align: 'center', width: 142 },
    { title: 'Hạn gần nhất', dataIndex: 'nearestDueDate', width: 128, render: formatDate },
    { title: 'Trạng thái', dataIndex: 'status', width: 176, render: (status) => <PaymentStatusTag status={status} /> },
    {
      title: 'Thao tác',
      width: 92,
      render: (_, record) => (
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setSelectedPartnerId(record.id)}>
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
          title={isCustomer ? 'Công nợ khách hàng' : 'Công nợ nhà cung cấp'}
          description={isCustomer
            ? 'Tổng hợp phải thu theo khách hàng, đơn bán và từng hạn thanh toán.'
            : 'Tổng hợp phải trả theo nhà cung cấp, đơn mua và từng hạn thanh toán.'}
        />

        <DebtSummary
          side={side}
          totals={listQuery.data?.totals ?? { totalAmount: 0, paidAmount: 0, remainingAmount: 0, overdueAmount: 0 }}
          loading={listQuery.isLoading}
        />

        <section className="payments-workspace">
          <div className="payments-toolbar">
            <div className="payments-toolbar__filters">
              <Input
                allowClear
                prefix={<SearchOutlined />}
                value={filters.keyword}
                placeholder={isCustomer ? 'Tìm mã hoặc tên khách hàng...' : 'Tìm mã hoặc tên nhà cung cấp...'}
                onChange={(event) => updateFilters({ keyword: event.target.value })}
                className="payments-toolbar__search"
              />
              <Select
                allowClear
                value={filters.status}
                placeholder="Trạng thái"
                options={[
                  { value: 'PAID', label: 'Đã thanh toán' },
                  { value: 'PARTIAL', label: 'Thanh toán một phần' },
                  { value: 'OVERDUE', label: 'Quá hạn' },
                  { value: 'UPCOMING', label: 'Chưa đến hạn' },
                ]}
                onChange={(status) => updateFilters({ status })}
                className="payments-toolbar__filter"
              />
              <Select
                value={filters.overdueOnly ? 'overdue' : undefined}
                allowClear
                placeholder="Có quá hạn"
                options={[{ value: 'overdue', label: 'Chỉ có quá hạn' }]}
                onChange={(value) => updateFilters({ overdueOnly: value === 'overdue' })}
                className="payments-toolbar__filter"
              />
              <DatePicker.RangePicker
                value={filters.dueFrom && filters.dueTo ? [dayjs(filters.dueFrom), dayjs(filters.dueTo)] : null}
                format="DD/MM/YYYY"
                placeholder={['Hạn từ ngày', 'Đến ngày']}
                onChange={(dates) => updateFilters({
                  dueFrom: dates?.[0]?.format('YYYY-MM-DD'),
                  dueTo: dates?.[1]?.format('YYYY-MM-DD'),
                })}
                className="payments-toolbar__range"
              />
            </div>
            <div className="payments-toolbar__actions">
              <Typography.Text type="secondary" className="payments-toolbar__count">
                {total === 0 ? '0 đối tác' : `${rangeStart}-${rangeEnd} / ${total}`}
              </Typography.Text>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openPayment()}>
                {isCustomer ? 'Ghi nhận thanh toán' : 'Thanh toán NCC'}
              </Button>
              <Button icon={<ReloadOutlined />} loading={listQuery.isFetching} onClick={handleRefresh}>
                Làm mới
              </Button>
            </div>
          </div>

          {listQuery.isLoading ? <div className="payments-state"><Skeleton active paragraph={{ rows: 8 }} /></div> : null}
          {listQuery.isError ? (
            <ErrorState message="Không thể tải dữ liệu công nợ mock." onRetry={() => void listQuery.refetch()} />
          ) : null}
          {!listQuery.isLoading && !listQuery.isError ? (
            <Table<PartnerDebtSummary>
              className="payments-data-table"
              rowKey="id"
              size="small"
              tableLayout="fixed"
              columns={columns}
              dataSource={listQuery.data?.content ?? []}
              loading={listQuery.isFetching}
              pagination={false}
              scroll={{ x: 1540 }}
              rowClassName="payments-table__clickable-row"
              onRow={(record) => ({ onClick: () => setSelectedPartnerId(record.id) })}
              locale={{ emptyText: <Empty description="Không có công nợ phù hợp" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
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

      <DebtDetailDrawer
        open={Boolean(selectedPartnerId)}
        side={side}
        detail={detailQuery.data}
        loading={detailQuery.isLoading}
        onClose={() => setSelectedPartnerId(undefined)}
        onPay={openPayment}
      />

      <PaymentFormDrawer
        open={Boolean(paymentPreset)}
        side={side}
        data={referenceQuery.data}
        loading={isRecording}
        initialPartnerId={paymentPreset?.partnerId}
        initialOrderId={paymentPreset?.orderId}
        initialScheduleId={paymentPreset?.scheduleId}
        onClose={() => setPaymentPreset(undefined)}
        onSubmit={handleRecordPayment}
      />
    </div>
  );
}
