import { Flex, Skeleton, Spin, Typography } from 'antd';
import { useCallback, useState } from 'react';
import { AdminListPage } from '../../../components/admin/AdminListPage';
import { ErrorState } from '../../../components/common/ErrorState';
import { useAdminSalesPayments } from '../hooks/useAdminSalesOrders';
import {
  initialSalesPaymentFilters,
  type SalesPaymentFilters as SalesPaymentFiltersValue,
  type SalesPaymentRecord,
} from '../salesOrders.model';
import { SalesPaymentDetailDrawer } from './SalesPaymentDetailDrawer';
import { SalesPaymentFilters } from './SalesPaymentFilters';
import { SalesPaymentTable } from './SalesPaymentTable';

export function SalesPaymentsPage() {
  const [filters, setFilters] = useState<SalesPaymentFiltersValue>(initialSalesPaymentFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState<SalesPaymentRecord>();
  const [detailOpen, setDetailOpen] = useState(false);
  const { listQuery, detailQuery } = useAdminSalesPayments({
    filters,
    page,
    pageSize,
    selectedPaymentId: selectedPayment?.id,
  });

  const handleFilterChange = useCallback((nextFilters: SalesPaymentFiltersValue) => {
    setFilters(nextFilters);
    setPage(1);
  }, []);

  const listResult = listQuery.data;
  const payments = listResult?.content ?? [];
  const total = listResult?.totalElements ?? 0;

  return (
    <div className="sales-orders-page sales-payments-page">
      <AdminListPage
        title="Thanh toán"
        description="Theo dõi từng giao dịch thanh toán của đơn hàng theo dữ liệu V4."
        toolbar={
          <SalesPaymentFilters
            filters={filters}
            loading={listQuery.isFetching}
            onChange={handleFilterChange}
            onReset={() => {
              setFilters(initialSalesPaymentFilters);
              setPage(1);
            }}
          />
        }
        summary={
          <Flex justify="space-between" align="center" gap={12} wrap className="sales-orders__summary">
            <Typography.Text strong>{total} giao dịch</Typography.Text>
            {listQuery.isFetching && !listQuery.isLoading ? (
              <Flex align="center" gap={8} aria-live="polite">
                <Spin size="small" />
                <Typography.Text type="secondary">Đang cập nhật dữ liệu</Typography.Text>
              </Flex>
            ) : null}
          </Flex>
        }
      >
        {listQuery.isLoading ? (
          <div className="sales-orders__loading">
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        ) : null}
        {listQuery.isError ? (
          <ErrorState
            message="Không thể tải danh sách giao dịch thanh toán."
            onRetry={() => void listQuery.refetch()}
          />
        ) : null}
        {!listQuery.isLoading && !listQuery.isError ? (
          <SalesPaymentTable
            payments={payments}
            loading={listQuery.isFetching}
            page={page}
            pageSize={pageSize}
            total={total}
            onPaginationChange={(nextPage, nextPageSize) => {
              setPage(nextPageSize !== pageSize ? 1 : nextPage);
              setPageSize(nextPageSize);
            }}
            onView={(payment) => {
              setSelectedPayment(payment);
              setDetailOpen(true);
            }}
          />
        ) : null}
      </AdminListPage>

      <SalesPaymentDetailDrawer
        open={detailOpen}
        payment={detailQuery.data}
        loading={detailQuery.isLoading}
        error={detailQuery.isError}
        onRetry={() => void detailQuery.refetch()}
        onClose={() => {
          setDetailOpen(false);
          setSelectedPayment(undefined);
        }}
      />
    </div>
  );
}
