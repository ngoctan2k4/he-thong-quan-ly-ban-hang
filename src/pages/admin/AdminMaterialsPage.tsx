import { App, Flex, Pagination, Skeleton, theme, Typography } from 'antd';
import type { UploadFile } from 'antd';
import type { CSSProperties, Key } from 'react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorState } from '../../components/common/ErrorState';
import { MaterialDetailDrawer } from '../../features/materials/components/MaterialDetailDrawer';
import { MaterialFilters } from '../../features/materials/components/MaterialFilters';
import { MaterialFormDrawer } from '../../features/materials/components/MaterialFormDrawer';
import { MaterialImportModal } from '../../features/materials/components/MaterialImportModal';
import { MaterialTable } from '../../features/materials/components/MaterialTable';
import { MaterialToolbar } from '../../features/materials/components/MaterialToolbar';
import { useAdminMaterialsMock } from '../../features/materials/hooks/useAdminMaterialsMock';
import type {
  AdminMaterialFilters,
  AdminMaterialRecord,
  MaterialFormValues,
} from '../../features/materials/materials.model';
import { initialAdminMaterialFilters } from '../../features/materials/materials.model';
import '../../features/materials/materials.css';

export function AdminMaterialsPage() {
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AdminMaterialFilters>(initialAdminMaterialFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<AdminMaterialRecord>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const {
    listQuery,
    updateMaterial,
    checkCodeTaken,
    isSavingMaterial,
  } = useAdminMaterialsMock({ filters, page, pageSize });

  const handleKeywordChange = useCallback((keyword: string) => {
    setFilters((current) => ({ ...current, keyword }));
    setPage(1);
    setSelectedRowKeys([]);
  }, []);

  const handleFilterChange = useCallback((nextFilters: AdminMaterialFilters) => {
    setFilters(nextFilters);
    setPage(1);
    setSelectedRowKeys([]);
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters((current) => ({ ...initialAdminMaterialFilters, keyword: current.keyword }));
    setPage(1);
    setSelectedRowKeys([]);
  }, []);

  const handleRefresh = () => {
    setFilters(initialAdminMaterialFilters);
    setPage(1);
    setSelectedRowKeys([]);
    void listQuery.refetch();
  };

  const openCreatePage = () => navigate('/admin/materials/new');

  const openDetailDrawer = (material: AdminMaterialRecord) => {
    setSelectedMaterial(material);
    setDetailOpen(true);
  };

  const openEditDrawer = (material: AdminMaterialRecord) => {
    setSelectedMaterial(material);
    setDetailOpen(false);
    setFormOpen(true);
  };

  const handleSaveMaterial = async (values: MaterialFormValues) => {
    if (!selectedMaterial) {
      return;
    }

    try {
      await updateMaterial({ id: selectedMaterial.id, values });
      void message.success('Đã cập nhật vật tư hàng hóa.');
      setFormOpen(false);
      setSelectedMaterial(undefined);
    } catch (error) {
      void message.error(
        error instanceof Error ? error.message : 'Không thể lưu vật tư. Vui lòng thử lại.',
      );
    }
  };

  const handleImportConfirm = (file: UploadFile) => {
    void message.info(`Đã nhận tệp ${file.name}. Chức năng đọc dữ liệu sẽ kết nối backend sau.`);
  };

  const listResult = listQuery.data;
  const materials = listResult?.content ?? [];
  const total = listResult?.totalElements ?? 0;
  const totalPages = listResult?.totalPages ?? 0;
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  return (
    <div
      className="admin-materials-page"
      style={
        {
          '--materials-color-border': token.colorBorderSecondary,
          '--materials-color-fill': token.colorFillQuaternary,
          '--materials-color-text-secondary': token.colorTextSecondary,
          '--materials-color-primary': token.colorPrimary,
          '--materials-color-primary-bg': token.colorPrimaryBg,
          '--materials-color-bg-container': token.colorBgContainer,
          '--materials-border-radius': `${token.borderRadius}px`,
        } as CSSProperties
      }
    >
      <Flex vertical gap={12}>
        <header className="admin-page-heading">
          <div className="admin-page-heading__copy">
            <Typography.Title level={3}>Vật tư hàng hóa</Typography.Title>
            <Typography.Text className="admin-page-heading__description">
              Quản lý danh mục vật tư và hàng hóa sử dụng trong hệ thống.
            </Typography.Text>
          </div>
        </header>

        <section className="admin-materials__workspace">
          <div className="admin-materials__toolbar-shell">
            <MaterialToolbar
              keyword={filters.keyword}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              total={total}
              page={page}
              totalPages={totalPages}
              loading={listQuery.isFetching}
              onKeywordChange={handleKeywordChange}
              onPrevious={() => setPage((current) => Math.max(1, current - 1))}
              onNext={() => setPage((current) => Math.min(totalPages, current + 1))}
              onCreate={openCreatePage}
              onImport={() => setImportOpen(true)}
              onRefresh={handleRefresh}
            />
          </div>

          <MaterialFilters
            filters={filters}
            loading={listQuery.isFetching}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
          />

          {selectedRowKeys.length > 0 ? (
            <div className="admin-materials__summary" aria-live="polite">
              <Typography.Text type="secondary">
                Đã chọn {selectedRowKeys.length} bản ghi
              </Typography.Text>
            </div>
          ) : null}

          {listQuery.isLoading ? (
            <div className="admin-materials__loading">
              <Skeleton active paragraph={{ rows: 10 }} />
            </div>
          ) : null}

          {listQuery.isError ? (
            <ErrorState
              message="Không thể tải danh sách vật tư mock. Hãy thử tải lại dữ liệu."
              onRetry={() => void listQuery.refetch()}
            />
          ) : null}

          {!listQuery.isLoading && !listQuery.isError ? (
            <MaterialTable
              materials={materials}
              selectedRowKeys={selectedRowKeys}
              loading={listQuery.isFetching}
              onSelectionChange={setSelectedRowKeys}
              onCreate={openCreatePage}
              onView={openDetailDrawer}
            />
          ) : null}

          {!listQuery.isLoading && !listQuery.isError ? (
            <Flex justify="space-between" align="center" gap={12} wrap className="admin-materials__pagination">
              <Typography.Text type="secondary" className="admin-materials__range">
                {total === 0 ? 'Không có bản ghi' : `Đang hiển thị ${rangeStart}-${rangeEnd} trên ${total}`}
              </Typography.Text>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                showSizeChanger
                pageSizeOptions={[20, 50, 80, 100]}
                showLessItems
                onChange={(nextPage, nextPageSize) => {
                  setPage(nextPageSize !== pageSize ? 1 : nextPage);
                  setPageSize(nextPageSize);
                  setSelectedRowKeys([]);
                }}
              />
            </Flex>
          ) : null}
        </section>
      </Flex>

      <MaterialDetailDrawer
        open={detailOpen}
        material={selectedMaterial}
        onClose={() => setDetailOpen(false)}
        onEdit={openEditDrawer}
      />

      <MaterialFormDrawer
        open={formOpen}
        mode="edit"
        material={selectedMaterial}
        loading={isSavingMaterial}
        checkCodeTaken={checkCodeTaken}
        onClose={() => {
          setFormOpen(false);
          setSelectedMaterial(undefined);
        }}
        onSubmit={handleSaveMaterial}
      />

      <MaterialImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onConfirm={handleImportConfirm}
      />
    </div>
  );
}
