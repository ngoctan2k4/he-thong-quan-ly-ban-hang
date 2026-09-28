import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { App, Button, Flex, Input, Skeleton, Spin, Typography } from 'antd';
import { useState } from 'react';
import { AdminListPage } from '../../components/admin/AdminListPage';
import { ErrorState } from '../../components/common/ErrorState';
import { RoleDetailDrawer } from '../../features/access-control/components/RoleDetailDrawer';
import { RoleFormDrawer } from '../../features/access-control/components/RoleFormDrawer';
import { RoleTable } from '../../features/access-control/components/RoleTable';
import { useAdminRoles } from '../../features/access-control/hooks/useAdminRoles';
import type { AdminRoleRecord, RoleFormMode, RoleFormValues } from '../../features/access-control/accessControl.model';
import '../../features/access-control/accessControl.css';

export function AdminRolesPage() {
  const { message } = App.useApp();
  const [keyword, setKeyword] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRoleId, setSelectedRoleId] = useState<number>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<RoleFormMode>('create');
  const { listQuery, detailQuery, permissionsQuery, createRole, updateRole, isSavingRole } = useAdminRoles(keyword, page, pageSize, selectedRoleId);
  const roles = listQuery.data?.content ?? [];
  const permissions = permissionsQuery.data ?? [];
  const total = listQuery.data?.totalElements ?? 0;

  const runSearch = (value: string) => {
    setKeyword(value.trim());
    setPage(1);
  };
  const openCreate = () => {
    setSelectedRoleId(undefined);
    setFormMode('create');
    setFormOpen(true);
  };
  const openDetail = (role: AdminRoleRecord) => {
    setSelectedRoleId(role.id);
    setDetailOpen(true);
  };
  const openEdit = (role: AdminRoleRecord) => {
    setSelectedRoleId(role.id);
    setDetailOpen(false);
    setFormMode('edit');
    setFormOpen(true);
  };
  const saveRole = async (values: RoleFormValues) => {
    try {
      if (formMode === 'edit' && selectedRoleId !== undefined) {
        await updateRole({ id: selectedRoleId, values });
        void message.success('Đã cập nhật vai trò và quyền hạn.');
      } else {
        await createRole(values);
        setPage(1);
        void message.success('Đã thêm vai trò.');
      }
      setFormOpen(false);
      setSelectedRoleId(undefined);
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể lưu vai trò.');
    }
  };

  return <div className="admin-access-control-page">
    <AdminListPage
      title="Vai trò & Phân quyền"
      description="Quản lý vai trò và quyền truy cập hệ thống"
      primaryAction={<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm vai trò</Button>}
      toolbar={<Input.Search
        className="admin-access-control__search"
        allowClear
        value={searchDraft}
        prefix={<SearchOutlined />}
        placeholder="Tìm theo mã hoặc tên vai trò"
        enterButton="Tìm kiếm"
        loading={listQuery.isFetching}
        onChange={(event) => {
          setSearchDraft(event.target.value);
          if (!event.target.value) runSearch('');
        }}
        onSearch={runSearch}
      />}
      summary={<Flex justify="space-between" align="center" gap={12} wrap>
        <Typography.Text strong>{total} vai trò</Typography.Text>
        {listQuery.isFetching && !listQuery.isLoading ? <Flex align="center" gap={8}><Spin size="small" /><Typography.Text type="secondary">Đang cập nhật dữ liệu</Typography.Text></Flex> : null}
      </Flex>}
    >
      {listQuery.isLoading ? <div className="admin-access-control__loading"><Skeleton active paragraph={{ rows: 7 }} /></div> : null}
      {listQuery.isError ? <ErrorState message="Không thể tải danh sách vai trò mock." onRetry={() => void listQuery.refetch()} /> : null}
      {!listQuery.isLoading && !listQuery.isError ? <RoleTable
        roles={roles}
        loading={listQuery.isFetching}
        page={page}
        pageSize={pageSize}
        total={total}
        onPaginationChange={(nextPage, nextSize) => {
          setPage(nextSize !== pageSize ? 1 : nextPage);
          setPageSize(nextSize);
        }}
        onCreate={openCreate}
        onView={openDetail}
        onEdit={openEdit}
      /> : null}
    </AdminListPage>

    <RoleDetailDrawer
      open={detailOpen}
      role={detailQuery.data}
      permissions={permissions}
      loading={detailQuery.isLoading || permissionsQuery.isLoading}
      error={detailQuery.error ?? permissionsQuery.error}
      onClose={() => { setDetailOpen(false); setSelectedRoleId(undefined); }}
      onRetry={() => { void detailQuery.refetch(); void permissionsQuery.refetch(); }}
      onEdit={openEdit}
    />
    <RoleFormDrawer
      open={formOpen}
      mode={formMode}
      role={formMode === 'edit' ? detailQuery.data : undefined}
      permissions={permissions}
      loading={isSavingRole || permissionsQuery.isLoading || (formMode === 'edit' && detailQuery.isLoading)}
      onClose={() => { setFormOpen(false); setSelectedRoleId(undefined); }}
      onSubmit={(values) => void saveRole(values)}
    />
  </div>;
}
