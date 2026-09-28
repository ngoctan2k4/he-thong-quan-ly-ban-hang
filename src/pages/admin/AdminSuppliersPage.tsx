import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Flex, Skeleton, Spin, Typography } from 'antd';
import { useCallback, useState } from 'react';
import { AdminListPage } from '../../components/admin/AdminListPage';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { ErrorState } from '../../components/common/ErrorState';
import '../../features/suppliers/suppliers.css';
import { SupplierDetailDrawer } from '../../features/suppliers/components/SupplierDetailDrawer';
import { SupplierFilters } from '../../features/suppliers/components/SupplierFilters';
import { SupplierFormDrawer } from '../../features/suppliers/components/SupplierFormDrawer';
import { SupplierTable } from '../../features/suppliers/components/SupplierTable';
import { useAdminSuppliers } from '../../features/suppliers/hooks/useAdminSuppliers';
import type {
  AdminSupplierFilters,
  SupplierFormMode,
  SupplierFormValues,
  SupplierProductFormValues,
} from '../../features/suppliers/suppliers.model';
import { initialAdminSupplierFilters } from '../../features/suppliers/suppliers.model';
import type { Supplier } from '../../types/supplier';

interface PendingStatusChange {
  supplier: Supplier;
  isActive: boolean;
}

export function AdminSuppliersPage() {
  const { message } = App.useApp();
  const [filters, setFilters] = useState<AdminSupplierFilters>(initialAdminSupplierFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number>();
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<SupplierFormMode>('create');
  const [pendingStatusChange, setPendingStatusChange] = useState<PendingStatusChange>();

  const {
    listQuery,
    detailQuery,
    productReferencesQuery,
    createSupplier,
    updateSupplier,
    updateSupplierStatus,
    linkProduct,
    updateProductLink,
    unlinkProduct,
    isSavingSupplier,
    isUpdatingStatus,
    isSavingProductLink,
    isRemovingProductLink,
  } = useAdminSuppliers({ filters, page, pageSize, selectedSupplierId });

  const handleFilterChange = useCallback((nextFilters: AdminSupplierFilters) => {
    setFilters(nextFilters);
    setPage(1);
  }, []);

  const openCreateDrawer = () => {
    setSelectedSupplier(undefined);
    setFormMode('create');
    setFormOpen(true);
  };

  const openDetailDrawer = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSelectedSupplierId(supplier.id);
    setDetailOpen(true);
  };

  const openEditDrawer = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSelectedSupplierId(supplier.id);
    setDetailOpen(false);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleSaveSupplier = async (values: SupplierFormValues) => {
    try {
      if (formMode === 'edit' && selectedSupplier) {
        await updateSupplier({ id: selectedSupplier.id, values });
        void message.success('Đã cập nhật nhà cung cấp.');
      } else {
        await createSupplier(values);
        setPage(1);
        void message.success('Đã thêm nhà cung cấp.');
      }
      setFormOpen(false);
      setSelectedSupplier(undefined);
      setSelectedSupplierId(undefined);
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể lưu nhà cung cấp. Vui lòng thử lại.');
    }
  };

  const performStatusChange = async (change: PendingStatusChange) => {
    try {
      await updateSupplierStatus({ id: change.supplier.id, isActive: change.isActive });
      void message.success(change.isActive ? 'Đã kích hoạt nhà cung cấp.' : 'Đã ngừng hoạt động nhà cung cấp.');
      setPendingStatusChange(undefined);
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái nhà cung cấp.');
    }
  };

  const handleSaveProductLink = async (values: SupplierProductFormValues, relationId?: number) => {
    if (selectedSupplierId === undefined) {
      return false;
    }
    try {
      if (relationId === undefined) {
        await linkProduct({ supplierId: selectedSupplierId, values });
        void message.success('Đã thêm sản phẩm vào nhà cung cấp.');
      } else {
        await updateProductLink({ supplierId: selectedSupplierId, relationId, values });
        void message.success('Đã cập nhật thông tin cung cấp sản phẩm.');
      }
      return true;
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể lưu liên kết sản phẩm.');
      return false;
    }
  };

  const handleUnlinkProduct = async (relationId: number) => {
    if (selectedSupplierId === undefined) {
      return false;
    }
    try {
      await unlinkProduct({ supplierId: selectedSupplierId, relationId });
      void message.success('Đã bỏ liên kết sản phẩm.');
      return true;
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể bỏ liên kết sản phẩm.');
      return false;
    }
  };

  const listResult = listQuery.data;
  const suppliers = listResult?.content ?? [];
  const total = listResult?.totalElements ?? 0;

  return (
    <div className="admin-suppliers-page">
      <AdminListPage
        title="Nhà cung cấp"
        description="Quản lý hồ sơ, thời gian giao hàng và danh mục sản phẩm của nhà cung cấp."
        primaryAction={<Button type="primary" icon={<PlusOutlined />} onClick={openCreateDrawer}>Thêm nhà cung cấp</Button>}
        toolbar={
          <SupplierFilters
            filters={filters}
            loading={listQuery.isFetching}
            onChange={handleFilterChange}
            onReset={() => {
              setFilters(initialAdminSupplierFilters);
              setPage(1);
            }}
          />
        }
        summary={
          <Flex justify="space-between" align="center" gap={12} wrap className="admin-suppliers__summary">
            <Typography.Text strong>{total} nhà cung cấp</Typography.Text>
            {listQuery.isFetching && !listQuery.isLoading ? (
              <Flex align="center" gap={8} aria-live="polite">
                <Spin size="small" />
                <Typography.Text type="secondary">Đang cập nhật dữ liệu</Typography.Text>
              </Flex>
            ) : null}
          </Flex>
        }
      >
        {listQuery.isLoading ? <div className="admin-entity__loading"><Skeleton active paragraph={{ rows: 8 }} /></div> : null}
        {listQuery.isError ? (
          <ErrorState message="Không thể tải danh sách nhà cung cấp mock." onRetry={() => void listQuery.refetch()} />
        ) : null}
        {!listQuery.isLoading && !listQuery.isError ? (
          <SupplierTable
            suppliers={suppliers}
            loading={listQuery.isFetching}
            page={page}
            pageSize={pageSize}
            total={total}
            onPaginationChange={(nextPage, nextPageSize) => {
              setPage(nextPageSize !== pageSize ? 1 : nextPage);
              setPageSize(nextPageSize);
            }}
            onCreate={openCreateDrawer}
            onView={openDetailDrawer}
            onEdit={openEditDrawer}
            onRequestStatusChange={(supplier, isActive) => setPendingStatusChange({ supplier, isActive })}
          />
        ) : null}
      </AdminListPage>

      <SupplierDetailDrawer
        open={detailOpen}
        supplier={detailQuery.data}
        productReferences={productReferencesQuery.data ?? []}
        loading={detailQuery.isLoading}
        error={detailQuery.error}
        productSaving={isSavingProductLink}
        productRemoving={isRemovingProductLink}
        onClose={() => {
          setDetailOpen(false);
          setSelectedSupplierId(undefined);
        }}
        onRetry={() => void detailQuery.refetch()}
        onEdit={openEditDrawer}
        onSaveProductLink={handleSaveProductLink}
        onUnlinkProduct={handleUnlinkProduct}
      />

      <SupplierFormDrawer
        open={formOpen}
        mode={formMode}
        supplier={selectedSupplier}
        loading={isSavingSupplier}
        onClose={() => {
          setFormOpen(false);
          setSelectedSupplier(undefined);
          setSelectedSupplierId(undefined);
        }}
        onSubmit={(values) => void handleSaveSupplier(values)}
      />

      <ConfirmModal
        open={Boolean(pendingStatusChange)}
        title={pendingStatusChange?.isActive ? 'Kích hoạt nhà cung cấp?' : 'Ngừng hoạt động nhà cung cấp?'}
        content={pendingStatusChange
          ? `Xác nhận ${pendingStatusChange.isActive ? 'kích hoạt' : 'ngừng hoạt động'} “${pendingStatusChange.supplier.name}”.`
          : ''}
        confirmText={pendingStatusChange?.isActive ? 'Kích hoạt' : 'Ngừng hoạt động'}
        danger={!pendingStatusChange?.isActive}
        loading={isUpdatingStatus}
        onConfirm={() => {
          if (pendingStatusChange) {
            void performStatusChange(pendingStatusChange);
          }
        }}
        onCancel={() => setPendingStatusChange(undefined)}
      />
    </div>
  );
}
