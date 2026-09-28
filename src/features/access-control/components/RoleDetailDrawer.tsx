import { EditOutlined } from '@ant-design/icons';
import { Button, Descriptions, Drawer, Flex, Skeleton, Tag, Typography } from 'antd';
import { ErrorState } from '../../../components/common/ErrorState';
import type { Permission } from '../../../types/auth';
import type { AdminRoleRecord } from '../accessControl.model';
import { PermissionGroups } from './PermissionGroups';

interface RoleDetailDrawerProps {
  open: boolean;
  role?: AdminRoleRecord;
  permissions: Permission[];
  loading?: boolean;
  error?: Error | null;
  onClose: () => void;
  onRetry: () => void;
  onEdit: (role: AdminRoleRecord) => void;
}

export function RoleDetailDrawer({ open, role, permissions, loading = false, error, onClose, onRetry, onEdit }: RoleDetailDrawerProps) {
  return <Drawer
    open={open}
    width="min(860px, 100%)"
    title="Chi tiết vai trò"
    destroyOnHidden
    onClose={onClose}
    extra={role ? <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(role)}>Chỉnh sửa</Button> : null}
  >
    {loading ? <Skeleton active paragraph={{ rows: 10 }} /> : null}
    {error ? <ErrorState message={error.message || 'Không thể tải chi tiết vai trò.'} onRetry={onRetry} /> : null}
    {!loading && !error && role ? <Flex vertical gap={24}>
      <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label="Mã vai trò"><Typography.Text code>{role.code}</Typography.Text></Descriptions.Item>
        <Descriptions.Item label="Tên vai trò">{role.name}</Descriptions.Item>
        <Descriptions.Item label="Mô tả" span={2}>{role.description ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Số quyền" span={2}><Tag color="blue">{role.permissionCount} quyền</Tag></Descriptions.Item>
      </Descriptions>
      <section>
        <Typography.Title level={5}>Quyền hạn theo module</Typography.Title>
        <Typography.Paragraph type="secondary">Dấu tích thể hiện quyền đang được cấp; dấu gạch thể hiện quyền chưa được cấp.</Typography.Paragraph>
        <PermissionGroups permissions={permissions} selectedPermissionIds={role.permissions.map((permission) => permission.id)} />
      </section>
    </Flex> : null}
  </Drawer>;
}
