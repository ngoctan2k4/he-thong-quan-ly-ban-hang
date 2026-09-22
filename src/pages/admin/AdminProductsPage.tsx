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
import { mockProductCategories } from '../../mocks/adminProducts';
import type { ProductStatus } from '../../types/product';

interface PendingStatusChange {
  product: AdminProductRecord;
  status: Exclude<ProductStatus, 'OUT_OF_STOCK'>;
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
    createProduct,
    updateProduct,
    updateStatus,
    isSavingProduct,
    isUpdatingStatus,
  } = useAdminProductsMock({ filters, page, pageSize });

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
      } else {
        await createProduct(values);
        setPage(1);
      }
      setFormOpen(false);
      setSelectedProduct(undefined);
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể lưu sản phẩm. Vui lòng thử lại.');
    }
  };

  const performStatusChange = async (change: PendingStatusChange) => {
    try {
      await updateStatus({ id: change.product.id, status: change.status });
      setPendingStatusChange(undefined);
    } catch (error) {
      void message.error(
        error instanceof Error ? error.message : 'Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại.',
      );
    }
  };

  const handleStatusChangeRequest = (
    product: AdminProductRecord,
    status: Exclude<ProductStatus, 'OUT_OF_STOCK'>,
  ) => {
    const change = { product, status };
    if (status === 'INACTIVE') {
      setPendingStatusChange(change);
      return;
    }
    void performStatusChange(change);
  };

  const listResult = listQuery.data;
  const products = listResult?.content ?? [];
  const total = listResult?.totalElements ?? 0;

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
            categories={mockProductCategories}
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
            onRequestStatusChange={handleStatusChangeRequest}
          />
        ) : null}
      </AdminListPage>

      <ProductDetailDrawer
        open={detailOpen}
        product={selectedProduct}
        onClose={() => setDetailOpen(false)}
        onEdit={openEditDrawer}
      />

      <ProductFormDrawer
        open={formOpen}
        mode={formMode}
        product={selectedProduct}
        categories={mockProductCategories}
        loading={isSavingProduct}
        onClose={() => {
          setFormOpen(false);
          setSelectedProduct(undefined);
        }}
        onSubmit={handleSaveProduct}
      />

      <ConfirmModal
        open={Boolean(pendingStatusChange)}
        title="Ngừng bán sản phẩm?"
        content={
          pendingStatusChange
            ? `“${pendingStatusChange.product.name}” sẽ không còn ở trạng thái đang bán trên màn hình quản trị.`
            : ''
        }
        confirmText="Ngừng bán"
        danger
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
