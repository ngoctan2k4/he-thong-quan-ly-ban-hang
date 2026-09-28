import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Flex, Skeleton, Spin, Typography } from 'antd';
import { useCallback, useState } from 'react';
import { AdminListPage } from '../../components/admin/AdminListPage';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { ErrorState } from '../../components/common/ErrorState';
import { UserDetailDrawer } from '../../features/system-users/components/UserDetailDrawer';
import { UserFilters } from '../../features/system-users/components/UserFilters';
import { UserFormDrawer } from '../../features/system-users/components/UserFormDrawer';
import { UserTable } from '../../features/system-users/components/UserTable';
import { useAdminSystemUsers } from '../../features/system-users/hooks/useAdminSystemUsers';
import type { AdminUserFilters, AdminUserRecord, UserFormMode, UserFormValues } from '../../features/system-users/systemUsers.model';
import { initialAdminUserFilters } from '../../features/system-users/systemUsers.model';
import '../../features/system-users/systemUsers.css';

interface PendingStatusChange {
  user: AdminUserRecord;
  isActive: boolean;
}

export function AdminSystemUsersPage() {
  const { message } = App.useApp();
  const [filters, setFilters] = useState<AdminUserFilters>(initialAdminUserFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<UserFormMode>('create');
  const [pendingStatusChange, setPendingStatusChange] = useState<PendingStatusChange>();
  const { listQuery, detailQuery, referencesQuery, createUser, updateUser, updateUserStatus, isSavingUser, isUpdatingStatus } = useAdminSystemUsers(filters, page, pageSize, selectedUserId);

  const references = referencesQuery.data ?? { roles: [], branches: [], warehouses: [] };
  const users = listQuery.data?.content ?? [];
  const total = listQuery.data?.totalElements ?? 0;

  const handleFilterChange = useCallback((next: AdminUserFilters) => {
    setFilters(next);
    setPage(1);
  }, []);

  const openCreate = () => {
    setSelectedUserId(undefined);
    setFormMode('create');
    setFormOpen(true);
  };

  const openDetail = (user: AdminUserRecord) => {
    setSelectedUserId(user.id);
    setDetailOpen(true);
  };

  const openEdit = (user: AdminUserRecord | NonNullable<typeof detailQuery.data>) => {
    setSelectedUserId(user.id);
    setDetailOpen(false);
    setFormMode('edit');
    setFormOpen(true);
  };

  const saveUser = async (values: UserFormValues) => {
    try {
      if (formMode === 'edit' && selectedUserId !== undefined) {
        await updateUser({ id: selectedUserId, values });
        void message.success('Đã cập nhật người dùng.');
      } else {
        await createUser(values);
        setPage(1);
        void message.success('Đã thêm người dùng.');
      }
      setFormOpen(false);
      setSelectedUserId(undefined);
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể lưu người dùng.');
    }
  };

  const changeStatus = async () => {
    if (!pendingStatusChange) return;
    try {
      await updateUserStatus({ id: pendingStatusChange.user.id, isActive: pendingStatusChange.isActive });
      void message.success(pendingStatusChange.isActive ? 'Đã kích hoạt người dùng.' : 'Đã ngừng hoạt động người dùng.');
      setPendingStatusChange(undefined);
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái người dùng.');
    }
  };

  return <div className="admin-system-users-page">
    <AdminListPage
      title="Người dùng"
      description="Quản lý tài khoản, vai trò và phạm vi truy cập hệ thống"
      primaryAction={<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm người dùng</Button>}
      toolbar={<UserFilters filters={filters} roles={references.roles} branches={references.branches} loading={listQuery.isFetching} onChange={handleFilterChange} onReset={() => { setFilters(initialAdminUserFilters); setPage(1); }} />}
      summary={<Flex justify="space-between" align="center" gap={12} wrap><Typography.Text strong>{total} người dùng</Typography.Text>{listQuery.isFetching && !listQuery.isLoading ? <Flex align="center" gap={8}><Spin size="small" /><Typography.Text type="secondary">Đang cập nhật dữ liệu</Typography.Text></Flex> : null}</Flex>}
    >
      {listQuery.isLoading ? <div className="admin-system-users__loading"><Skeleton active paragraph={{ rows: 8 }} /></div> : null}
      {listQuery.isError ? <ErrorState message="Không thể tải danh sách người dùng mock." onRetry={() => void listQuery.refetch()} /> : null}
      {!listQuery.isLoading && !listQuery.isError ? <UserTable users={users} loading={listQuery.isFetching} page={page} pageSize={pageSize} total={total} onPaginationChange={(nextPage, nextSize) => { setPage(nextSize !== pageSize ? 1 : nextPage); setPageSize(nextSize); }} onCreate={openCreate} onView={openDetail} onEdit={openEdit} onRequestStatusChange={(user, isActive) => setPendingStatusChange({ user, isActive })} /> : null}
    </AdminListPage>

    <UserDetailDrawer open={detailOpen} user={detailQuery.data} branches={references.branches} loading={detailQuery.isLoading} error={detailQuery.error} onClose={() => { setDetailOpen(false); setSelectedUserId(undefined); }} onRetry={() => void detailQuery.refetch()} onEdit={openEdit} />

    <UserFormDrawer open={formOpen} mode={formMode} user={formMode === 'edit' ? detailQuery.data : undefined} references={references} loading={isSavingUser || (formMode === 'edit' && detailQuery.isLoading)} onClose={() => { setFormOpen(false); setSelectedUserId(undefined); }} onSubmit={(values) => void saveUser(values)} />

    <ConfirmModal open={Boolean(pendingStatusChange)} title={pendingStatusChange?.isActive ? 'Kích hoạt người dùng?' : 'Ngừng hoạt động người dùng?'} content={pendingStatusChange ? `Xác nhận ${pendingStatusChange.isActive ? 'kích hoạt' : 'ngừng hoạt động'} tài khoản “${pendingStatusChange.user.username}”.` : ''} confirmText={pendingStatusChange?.isActive ? 'Kích hoạt' : 'Ngừng hoạt động'} danger={!pendingStatusChange?.isActive} loading={isUpdatingStatus} onConfirm={() => void changeStatus()} onCancel={() => setPendingStatusChange(undefined)} />
  </div>;
}
