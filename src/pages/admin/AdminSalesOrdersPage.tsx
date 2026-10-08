import { Flex, Skeleton, Spin, Typography } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { AdminListPage } from '../../components/admin/AdminListPage';
import { ErrorState } from '../../components/common/ErrorState';
import { OrderDetailDrawer } from '../../features/sales-orders/components/OrderDetailDrawer';
import { OrderFilters } from '../../features/sales-orders/components/OrderFilters';
import { OrderTable } from '../../features/sales-orders/components/OrderTable';
import '../../features/sales-orders/salesOrders.css';
import {
  initialSalesOrderFilters,
  type SalesOrderFilters,
  type SalesOrderRecord,
} from '../../features/sales-orders/salesOrders.model';
import { useAdminSalesOrders } from '../../features/sales-orders/hooks/useAdminSalesOrders';
import type { OrderChannel } from '../../types/order';

interface AdminSalesOrdersPageProps {
  channel?: OrderChannel;
  retailOnly?: boolean;
}

const pageCopy: Record<OrderChannel | 'ALL' | 'RETAIL', { title: string; description: string }> = {
  ALL: {
    title: 'Đơn đặt hàng',
    description: 'Theo dõi tập trung đơn hàng Website, POS và Wholesale theo dữ liệu V4.',
  },
  WEBSITE: {
    title: 'Đơn Website',
    description: 'Theo dõi các đơn hàng phát sinh từ kênh Website.',
  },
  POS: {
    title: 'Đơn POS',
    description: 'Theo dõi các đơn hàng phát sinh tại điểm bán POS.',
  },
  WHOLESALE: {
    title: 'Đơn Wholesale',
    description: 'Theo dõi đơn bán sỉ và thông tin phê duyệt có trong V4.',
  },
  RETAIL: {
    title: 'Đơn đặt hàng lẻ',
    description: 'Theo dõi đơn bán lẻ phát sinh từ Website và điểm bán POS.',
  },
};

export function AdminSalesOrdersPage({ channel, retailOnly = false }: AdminSalesOrdersPageProps) {
  const defaultFilters = useMemo<SalesOrderFilters>(
    () => ({ ...initialSalesOrderFilters, channel: channel ?? 'ALL', retailOnly }),
    [channel, retailOnly],
  );
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrderRecord>();
  const [detailOpen, setDetailOpen] = useState(false);
  const { listQuery, detailQuery, referenceQuery } = useAdminSalesOrders({
    filters,
    page,
    pageSize,
    selectedOrderId: selectedOrder?.id,
  });

  const handleFilterChange = useCallback((nextFilters: SalesOrderFilters) => {
    setFilters(nextFilters);
    setPage(1);
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
  }, [defaultFilters]);

  const openDetail = (order: SalesOrderRecord) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const listResult = listQuery.data;
  const orders = listResult?.content ?? [];
  const total = listResult?.totalElements ?? 0;
  const copy = pageCopy[retailOnly ? 'RETAIL' : channel ?? 'ALL'];

  return (
    <div className="sales-orders-page">
      <AdminListPage
        title={copy.title}
        description={copy.description}
        toolbar={
          <OrderFilters
            filters={filters}
            references={referenceQuery.data}
            fixedChannel={channel}
            loading={listQuery.isFetching}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
          />
        }
        summary={
          <Flex justify="space-between" align="center" gap={12} wrap className="sales-orders__summary">
            <Typography.Text strong>{total} đơn hàng</Typography.Text>
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
            message="Không thể tải danh sách đơn hàng. Hãy thử tải lại dữ liệu."
            onRetry={() => void listQuery.refetch()}
          />
        ) : null}

        {!listQuery.isLoading && !listQuery.isError ? (
          <OrderTable
            orders={orders}
            loading={listQuery.isFetching}
            page={page}
            pageSize={pageSize}
            total={total}
            onPaginationChange={(nextPage, nextPageSize) => {
              setPage(nextPageSize !== pageSize ? 1 : nextPage);
              setPageSize(nextPageSize);
            }}
            onView={openDetail}
          />
        ) : null}
      </AdminListPage>

      <OrderDetailDrawer
        open={detailOpen}
        order={detailQuery.data}
        loading={detailQuery.isLoading}
        error={detailQuery.isError}
        onRetry={() => void detailQuery.refetch()}
        onClose={() => {
          setDetailOpen(false);
          setSelectedOrder(undefined);
        }}
      />
    </div>
  );
}
