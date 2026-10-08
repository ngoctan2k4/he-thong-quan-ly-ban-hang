import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Flex, Skeleton, Spin, Typography } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminListPage } from '../../components/admin/AdminListPage';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { ErrorState } from '../../components/common/ErrorState';
import { PurchaseOrderDetailDrawer } from '../../features/purchasing/components/PurchaseOrderDetailDrawer';
import { PurchaseOrderFiltersPanel } from '../../features/purchasing/components/PurchaseOrderFilters';
import { PurchaseOrderTable } from '../../features/purchasing/components/PurchaseOrderTable';
import { usePurchaseOrderList } from '../../features/purchasing/hooks/useAdminPurchasing';
import {
  initialPurchaseOrderFilters,
  type PurchaseOrderFilters,
  type PurchaseOrderRecord,
} from '../../features/purchasing/purchasing.model';
import '../../features/purchasing/purchasing.css';

interface AdminPurchaseOrdersPageProps {
  retailOnly?: boolean;
}

export function AdminPurchaseOrdersPage({ retailOnly = false }: AdminPurchaseOrdersPageProps) {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const defaultFilters = useMemo<PurchaseOrderFilters>(
    () => ({ ...initialPurchaseOrderFilters, retailOnly }),
    [retailOnly],
  );
  const [filters, setFilters] = useState<PurchaseOrderFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState<number>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [pendingCancel, setPendingCancel] = useState<PurchaseOrderRecord>();
  const {
    listQuery,
    detailQuery,
    referencesQuery,
    cancelPurchaseOrder,
    isCancelling,
  } = usePurchaseOrderList({ filters, page, pageSize, selectedOrderId });

  const handleFilterChange = useCallback((nextFilters: PurchaseOrderFilters) => {
    setFilters(nextFilters);
    setPage(1);
  }, []);

  const openDetail = (order: PurchaseOrderRecord) => {
    setSelectedOrderId(order.id);
    setDetailOpen(true);
  };

  const handleCancelOrder = async () => {
    if (!pendingCancel) return;
    try {
      await cancelPurchaseOrder(pendingCancel.id);
      void message.success(`Đã hủy ${pendingCancel.code}.`);
      setPendingCancel(undefined);
      if (selectedOrderId === pendingCancel.id) void detailQuery.refetch();
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể hủy đơn mua.');
    }
  };

  const orders = listQuery.data?.content ?? [];
  const total = listQuery.data?.totalElements ?? 0;
  const listPath = retailOnly ? '/admin/purchase/retail-orders' : '/admin/purchase/orders';
  const title = retailOnly ? 'Đơn mua hàng lẻ' : 'Đơn mua';
  const description = retailOnly
    ? 'Quản lý các đơn mua lẻ và tiến độ nhận hàng.'
    : 'Quản lý đơn mua, nguồn đề xuất và tiến độ nhận hàng theo dữ liệu V5.';

  return (
    <div className="purchasing-page">
      <AdminListPage
        title={title}
        description={description}
        primaryAction={(
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(`${listPath}/new`)}
          >
            {retailOnly ? 'Tạo đơn mua lẻ' : 'Tạo đơn mua'}
          </Button>
        )}
        toolbar={(
          <PurchaseOrderFiltersPanel
            filters={filters}
            references={referencesQuery.data}
            loading={listQuery.isFetching}
            onChange={handleFilterChange}
            onReset={() => {
              setFilters(defaultFilters);
              setPage(1);
            }}
          />
        )}
        summary={(
          <Flex justify="space-between" align="center" gap={12} wrap className="purchasing__summary">
            <Typography.Text strong>{total} đơn mua</Typography.Text>
            {listQuery.isFetching && !listQuery.isLoading ? (
              <Flex align="center" gap={8} aria-live="polite">
                <Spin size="small" />
                <Typography.Text type="secondary">Đang cập nhật dữ liệu</Typography.Text>
              </Flex>
            ) : null}
          </Flex>
        )}
      >
        {listQuery.isLoading ? (
          <div className="purchasing__loading"><Skeleton active paragraph={{ rows: 8 }} /></div>
        ) : null}
        {listQuery.isError ? (
          <ErrorState
            message="Không thể tải danh sách đơn mua. Hãy thử tải lại dữ liệu."
            onRetry={() => void listQuery.refetch()}
          />
        ) : null}
        {!listQuery.isLoading && !listQuery.isError ? (
          <PurchaseOrderTable
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
            onEdit={(order) => navigate(`${listPath}/${order.id}/edit`)}
            onCancel={setPendingCancel}
          />
        ) : null}
      </AdminListPage>

      <PurchaseOrderDetailDrawer
        open={detailOpen}
        order={detailQuery.data}
        loading={detailQuery.isLoading}
        error={detailQuery.isError}
        onRetry={() => void detailQuery.refetch()}
        onClose={() => {
          setDetailOpen(false);
          setSelectedOrderId(undefined);
        }}
        onEdit={(order) => navigate(`${listPath}/${order.id}/edit`)}
        onCreateReceipt={(order) => navigate(`/admin/purchase/goods-receipts/new?purchaseOrderId=${order.id}`)}
      />

      <ConfirmModal
        open={Boolean(pendingCancel)}
        title="Hủy đơn mua?"
        content={pendingCancel
          ? `Xác nhận hủy “${pendingCancel.code}”. Thao tác này không thay đổi tồn kho.`
          : ''}
        confirmText="Hủy đơn"
        danger
        loading={isCancelling}
        onConfirm={() => void handleCancelOrder()}
        onCancel={() => setPendingCancel(undefined)}
      />
    </div>
  );
}
