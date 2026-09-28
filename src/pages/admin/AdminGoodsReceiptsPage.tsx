import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Flex, Skeleton, Spin, Typography } from 'antd';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminListPage } from '../../components/admin/AdminListPage';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { ErrorState } from '../../components/common/ErrorState';
import { GoodsReceiptDetailDrawer } from '../../features/purchasing/components/GoodsReceiptDetailDrawer';
import { GoodsReceiptFiltersPanel } from '../../features/purchasing/components/GoodsReceiptFilters';
import { GoodsReceiptTable } from '../../features/purchasing/components/GoodsReceiptTable';
import { useGoodsReceiptList } from '../../features/purchasing/hooks/useAdminPurchasing';
import {
  initialGoodsReceiptFilters,
  type GoodsReceiptFilters,
  type GoodsReceiptRecord,
} from '../../features/purchasing/purchasing.model';
import '../../features/purchasing/purchasing.css';

export function AdminGoodsReceiptsPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [filters, setFilters] = useState<GoodsReceiptFilters>(initialGoodsReceiptFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedReceiptId, setSelectedReceiptId] = useState<number>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [pendingCancel, setPendingCancel] = useState<GoodsReceiptRecord>();
  const {
    listQuery,
    detailQuery,
    referencesQuery,
    cancelGoodsReceipt,
    isCancelling,
  } = useGoodsReceiptList({ filters, page, pageSize, selectedReceiptId });

  const handleFilterChange = useCallback((nextFilters: GoodsReceiptFilters) => {
    setFilters(nextFilters);
    setPage(1);
  }, []);

  const handleCancelReceipt = async () => {
    if (!pendingCancel) return;
    try {
      await cancelGoodsReceipt(pendingCancel.id);
      void message.success(`Đã hủy ${pendingCancel.code}.`);
      setPendingCancel(undefined);
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể hủy phiếu nhận.');
    }
  };

  const receipts = listQuery.data?.content ?? [];
  const total = listQuery.data?.totalElements ?? 0;

  return (
    <div className="purchasing-page">
      <AdminListPage
        title="Nhận hàng"
        description="Theo dõi phiếu nhận theo PO và nhập hàng trực tiếp không có PO."
        primaryAction={(
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/purchase/goods-receipts/new')}
          >
            Tạo phiếu nhận
          </Button>
        )}
        toolbar={(
          <GoodsReceiptFiltersPanel
            filters={filters}
            references={referencesQuery.data}
            loading={listQuery.isFetching}
            onChange={handleFilterChange}
            onReset={() => {
              setFilters(initialGoodsReceiptFilters);
              setPage(1);
            }}
          />
        )}
        summary={(
          <Flex justify="space-between" align="center" gap={12} wrap className="purchasing__summary">
            <Typography.Text strong>{total} phiếu nhận</Typography.Text>
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
            message="Không thể tải danh sách phiếu nhận. Hãy thử tải lại dữ liệu."
            onRetry={() => void listQuery.refetch()}
          />
        ) : null}
        {!listQuery.isLoading && !listQuery.isError ? (
          <GoodsReceiptTable
            receipts={receipts}
            loading={listQuery.isFetching}
            page={page}
            pageSize={pageSize}
            total={total}
            onPaginationChange={(nextPage, nextPageSize) => {
              setPage(nextPageSize !== pageSize ? 1 : nextPage);
              setPageSize(nextPageSize);
            }}
            onView={(receipt) => {
              setSelectedReceiptId(receipt.id);
              setDetailOpen(true);
            }}
            onCancel={setPendingCancel}
          />
        ) : null}
      </AdminListPage>

      <GoodsReceiptDetailDrawer
        open={detailOpen}
        receipt={detailQuery.data}
        loading={detailQuery.isLoading}
        error={detailQuery.isError}
        onRetry={() => void detailQuery.refetch()}
        onClose={() => {
          setDetailOpen(false);
          setSelectedReceiptId(undefined);
        }}
      />

      <ConfirmModal
        open={Boolean(pendingCancel)}
        title="Hủy phiếu nhận?"
        content={pendingCancel
          ? `Xác nhận hủy “${pendingCancel.code}”. Phiếu nháp chưa làm thay đổi tồn kho.`
          : ''}
        confirmText="Hủy phiếu"
        danger
        loading={isCancelling}
        onConfirm={() => void handleCancelReceipt()}
        onCancel={() => setPendingCancel(undefined)}
      />
    </div>
  );
}
