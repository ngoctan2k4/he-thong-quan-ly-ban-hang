import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Flex, Skeleton, Spin, Typography } from 'antd';
import { useCallback, useState } from 'react';
import { AdminListPage } from '../../components/admin/AdminListPage';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { ErrorState } from '../../components/common/ErrorState';
import type {
  AdminProductFilters,
  AdminProductRecord,
  ProductFormMode,
  ProductFormValues,
} from '../../features/products/adminProducts.model';
import { initialAdminProductFilters } from '../../features/products/adminProducts.model';
import '../../features/products/adminProducts.css';
import { ProductDetailDrawer } from '../../features/products/components/ProductDetailDrawer';
import { ProductFilters } from '../../features/products/components/ProductFilters';
import { ProductFormDrawer } from '../../features/products/components/ProductFormDrawer';
import { ProductTable } from '../../features/products/components/ProductTable';
import { useAdminProductsMock } from '../../features/products/hooks/useAdminProductsMock';
import type { ProductConversionFormValues } from '../../features/products/products.repository';

interface PendingStatusChange {
  product: AdminProductRecord;
}

export function AdminProductsPage() {
  const { message } = App.useApp();
  const [filters, setFilters] = useState<AdminProductFilters>(initialAdminProductFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState<AdminProductRecord>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<ProductFormMode>('create');
  const [pendingStatusChange, setPendingStatusChange] = useState<PendingStatusChange>();

  const {
    listQuery,
    referencesQuery,
    conversionsQuery,
    createProduct,
    updateProduct,
    updateActive,
    createConversion,
    updateConversion,
    deleteConversion,
    isSavingProduct,
    isUpdatingStatus,
    isSavingConversion,
    isDeletingConversion,
  } = useAdminProductsMock({ filters, page, pageSize, selectedProductId: selectedProduct?.id });

  const handleFilterChange = useCallback((nextFilters: AdminProductFilters) => {
    setFilters(nextFilters);
    setPage(1);
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters(initialAdminProductFilters);
    setPage(1);
  }, []);

  const openCreateDrawer = () => {
    setSelectedProduct(undefined);
    setFormMode('create');
    setFormOpen(true);
  };

  const openDetailDrawer = (product: AdminProductRecord) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  const openEditDrawer = (product: AdminProductRecord) => {
    setSelectedProduct(product);
    setDetailOpen(false);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleSaveProduct = async (values: ProductFormValues) => {
    try {
      if (formMode === 'edit' && selectedProduct) {
        await updateProduct({ id: selectedProduct.id, values });
        void message.success('Đã cập nhật sản phẩm.');
      } else {
        await createProduct(values);
        setPage(1);
        void message.success('Đã thêm sản phẩm.');
      }
      setFormOpen(false);
      setSelectedProduct(undefined);
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể lưu sản phẩm. Vui lòng thử lại.');
    }
  };

  const performStatusChange = async (change: PendingStatusChange) => {
    try {
      await updateActive({ id: change.product.id, isActive: !change.product.isActive });
      void message.success(change.product.isActive ? 'Đã tắt sản phẩm.' : 'Đã kích hoạt sản phẩm.');
      setPendingStatusChange(undefined);
    } catch (error) {
      void message.error(
        error instanceof Error ? error.message : 'Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại.',
      );
    }
  };

  const handleStatusChangeRequest = (product: AdminProductRecord) => {
    setPendingStatusChange({ product });
  };

  const handleSaveConversion = async (values: ProductConversionFormValues, conversionId?: number) => {
    if (!selectedProduct) return false;
    try {
      if (conversionId === undefined) await createConversion({ productId: selectedProduct.id, values });
      else await updateConversion({ id: conversionId, factor: values.factor });
      void message.success(conversionId === undefined ? 'Đã thêm quy đổi.' : 'Đã cập nhật quy đổi.');
      return true;
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể lưu quy đổi.');
      return false;
    }
  };

  const handleDeleteConversion = async (id: number) => {
    try {
      await deleteConversion(id);
      void message.success('Đã xóa quy đổi.');
      return true;
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể xóa quy đổi.');
      return false;
    }
  };

  const listResult = listQuery.data;
  const products = listResult?.content ?? [];
  const total = listResult?.totalElements ?? 0;
  const references = referencesQuery.data ?? { categories: [], units: [], brands: [] };

  return (
    <div className="admin-products-page">
      <AdminListPage
        title="Quản lý sản phẩm"
        description="Theo dõi thông tin bán hàng, tồn kho và trạng thái sản phẩm trên các kênh."
        primaryAction={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateDrawer}>
            Thêm sản phẩm
          </Button>
        }
        toolbar={
          <ProductFilters
            filters={filters}
            categories={references.categories}
            brands={references.brands}
            loading={listQuery.isFetching}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
          />
        }
        summary={
          <Flex justify="space-between" align="center" gap={12} wrap className="admin-products__summary">
            <Typography.Text strong>{total} sản phẩm</Typography.Text>
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
          <div style={{ padding: 24 }}>
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        ) : null}

        {listQuery.isError ? (
          <ErrorState
            message="Không thể tải danh sách sản phẩm mock. Hãy thử tải lại dữ liệu."
            onRetry={() => void listQuery.refetch()}
          />
        ) : null}

        {!listQuery.isLoading && !listQuery.isError ? (
          <ProductTable
            products={products}
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
            onRequestActiveChange={handleStatusChangeRequest}
          />
        ) : null}
      </AdminListPage>

      <ProductDetailDrawer
        open={detailOpen}
        product={selectedProduct}
        references={references}
        conversions={conversionsQuery.data ?? []}
        conversionsLoading={conversionsQuery.isLoading}
        conversionSaving={isSavingConversion}
        conversionDeleting={isDeletingConversion}
        onClose={() => setDetailOpen(false)}
        onEdit={openEditDrawer}
        onSaveConversion={handleSaveConversion}
        onDeleteConversion={handleDeleteConversion}
      />

      <ProductFormDrawer
        open={formOpen}
        mode={formMode}
        product={selectedProduct}
        references={references}
        hasConversions={Boolean(selectedProduct && (conversionsQuery.isLoading || conversionsQuery.data?.length))}
        loading={isSavingProduct}
        onClose={() => {
          setFormOpen(false);
          setSelectedProduct(undefined);
        }}
        onSubmit={handleSaveProduct}
      />

      <ConfirmModal
        open={Boolean(pendingStatusChange)}
        title={pendingStatusChange?.product.isActive ? 'Tắt sản phẩm?' : 'Kích hoạt sản phẩm?'}
        content={
          pendingStatusChange
            ? `Xác nhận ${pendingStatusChange.product.isActive ? 'tắt' : 'kích hoạt'} “${pendingStatusChange.product.name}”.`
            : ''
        }
        confirmText={pendingStatusChange?.product.isActive ? 'Tắt sản phẩm' : 'Kích hoạt'}
        danger={pendingStatusChange?.product.isActive}
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
