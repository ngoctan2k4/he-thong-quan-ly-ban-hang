import { EditOutlined, EnvironmentOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Button, Descriptions, Drawer, Empty, Flex, List, Skeleton, Space, Tabs, Tag, Typography } from 'antd';
import { ErrorState } from '../../../components/common/ErrorState';
import type { Branch, Warehouse } from '../../../types/catalog';
import type { AdminUserDetail } from '../systemUsers.model';

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });

interface UserDetailDrawerProps {
  open: boolean;
  user?: AdminUserDetail;
  branches: Branch[];
  loading?: boolean;
  error?: Error | null;
  onClose: () => void;
  onRetry: () => void;
  onEdit: (user: AdminUserDetail) => void;
}

export function UserDetailDrawer({ open, user, branches, loading = false, error, onClose, onRetry, onEdit }: UserDetailDrawerProps) {
  const warehouseLabel = (warehouse: Warehouse) => {
    const branchName = branches.find((branch) => branch.id === warehouse.branchId)?.name;
    return branchName ? `${warehouse.name} · ${branchName}` : warehouse.name;
  };
  const content = loading ? <Skeleton active paragraph={{ rows: 8 }} /> : error ? <ErrorState message="Không thể tải chi tiết người dùng." onRetry={onRetry} /> : user ? <Tabs items={[
    { key: 'info', label: 'Thông tin', children: <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }} items={[
      { key: 'username', label: 'Tên đăng nhập', children: user.username },
      { key: 'name', label: 'Họ và tên', children: user.fullName },
      { key: 'email', label: 'Email', children: user.email ?? '—' },
      { key: 'phone', label: 'Điện thoại', children: user.phone ?? '—' },
      { key: 'branch', label: 'Chi nhánh làm việc chính', children: branches.find((branch) => branch.id === user.branchId)?.name ?? '—' },
      { key: 'status', label: 'Trạng thái', children: <Tag color={user.isActive ? 'success' : 'default'}>{user.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}</Tag> },
      { key: 'login', label: 'Lần đăng nhập cuối', children: user.lastLoginAt ? dateTimeFormatter.format(new Date(user.lastLoginAt)) : 'Chưa đăng nhập' },
      { key: 'created', label: 'Ngày tạo', children: dateTimeFormatter.format(new Date(user.createdAt)) },
      { key: 'updated', label: 'Ngày cập nhật', children: dateTimeFormatter.format(new Date(user.updatedAt)) },
    ]} /> },
    { key: 'roles', label: 'Vai trò', children: user.roles.length ? <List dataSource={user.roles} renderItem={(role) => <List.Item><Space><SafetyCertificateOutlined /><Typography.Text strong>{role.name}</Typography.Text><Tag>{role.code}</Tag></Space></List.Item>} /> : <Empty description="Chưa gán vai trò" /> },
    { key: 'scope', label: 'Phạm vi dữ liệu', children: <Flex vertical gap={24}>
      <section><Typography.Title level={5}>Chi nhánh được truy cập</Typography.Title>{user.accessibleBranches.length ? <List className="admin-system-users__scope-list" dataSource={user.accessibleBranches} renderItem={(branch) => <List.Item><Space><EnvironmentOutlined /><span>{branch.name}</span></Space></List.Item>} /> : <Empty description="Chưa cấp quyền chi nhánh" />}</section>
      <section><Typography.Title level={5}>Kho được truy cập</Typography.Title>{user.accessibleWarehouses.length ? <List className="admin-system-users__scope-list" dataSource={user.accessibleWarehouses} renderItem={(warehouse) => <List.Item><Space><EnvironmentOutlined /><span>{warehouseLabel(warehouse)}</span></Space></List.Item>} /> : <Empty description="Chưa cấp quyền kho" />}</section>
    </Flex> },
  ]} /> : null;
  return <Drawer open={open} width="min(780px, 100%)" title={user ? `Người dùng · ${user.username}` : 'Chi tiết người dùng'} destroyOnHidden onClose={onClose} extra={user ? <Button icon={<EditOutlined />} onClick={() => onEdit(user)}>Chỉnh sửa</Button> : null}>{content}</Drawer>;
}
