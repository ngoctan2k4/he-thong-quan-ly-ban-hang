import { CheckCircleOutlined, EditOutlined, EyeOutlined, MoreOutlined, PauseCircleOutlined, PlayCircleOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Flex, Space, Table, Tag, Tooltip, Typography } from 'antd';
import type { MenuProps, TableProps } from 'antd';
import { EmptyState } from '../../../components/common/EmptyState';
import type { AdminUserRecord } from '../systemUsers.model';

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' });

interface UserTableProps {
  users: AdminUserRecord[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  onCreate: () => void;
  onView: (user: AdminUserRecord) => void;
  onEdit: (user: AdminUserRecord) => void;
  onRequestStatusChange: (user: AdminUserRecord, isActive: boolean) => void;
}

export function UserTable({ users, loading = false, page, pageSize, total, onPaginationChange, onCreate, onView, onEdit, onRequestStatusChange }: UserTableProps) {
  const columns: TableProps<AdminUserRecord>['columns'] = [
    { title: 'Tài khoản', dataIndex: 'username', width: 190, render: (username: string) => <Space><Avatar size="small" icon={<UserOutlined />} /><Typography.Text strong className="admin-system-users__username">{username}</Typography.Text></Space> },
    { title: 'Họ và tên', dataIndex: 'fullName', width: 220, ellipsis: true },
    { title: 'Email / SĐT', key: 'contact', width: 245, responsive: ['md'], render: (_, user) => <Flex vertical gap={2} className="admin-system-users__contact"><Typography.Text ellipsis={{ tooltip: user.email }}>{user.email ?? '—'}</Typography.Text><Typography.Text type="secondary">{user.phone ?? '—'}</Typography.Text></Flex> },
    { title: 'Chi nhánh chính', dataIndex: 'branchName', width: 220, responsive: ['lg'], render: (value?: string) => value ?? '—' },
    { title: 'Vai trò', dataIndex: 'roles', width: 270, responsive: ['md'], render: (_, user) => <Flex gap={4} wrap className="admin-system-users__roles">{user.roles.length ? user.roles.map((role) => <Tag key={role.id} color="blue">{role.name}</Tag>) : '—'}</Flex> },
    { title: 'Trạng thái', dataIndex: 'isActive', width: 160, render: (active: boolean) => <Tag color={active ? 'success' : 'default'} icon={active ? <CheckCircleOutlined /> : <PauseCircleOutlined />}>{active ? 'Hoạt động' : 'Ngừng hoạt động'}</Tag> },
    { title: 'Lần đăng nhập cuối', dataIndex: 'lastLoginAt', width: 180, responsive: ['xl'], render: (value?: string) => <span className="admin-system-users__date">{value ? dateTimeFormatter.format(new Date(value)) : 'Chưa đăng nhập'}</span> },
    { title: 'Thao tác', key: 'actions', width: 180, render: (_, user) => {
      const items: MenuProps['items'] = [{ key: 'status', danger: user.isActive, icon: user.isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />, label: user.isActive ? 'Ngừng hoạt động' : 'Kích hoạt' }];
      return <Space size={2} className="admin-system-users__row-actions"><Tooltip title="Xem chi tiết"><Button type="link" size="small" icon={<EyeOutlined />} aria-label={`Xem ${user.username}`} onClick={() => onView(user)}><span className="admin-system-users__action-label">Xem</span></Button></Tooltip><Tooltip title="Chỉnh sửa"><Button type="link" size="small" icon={<EditOutlined />} aria-label={`Sửa ${user.username}`} onClick={() => onEdit(user)}><span className="admin-system-users__action-label">Sửa</span></Button></Tooltip><Dropdown trigger={['click']} menu={{ items, onClick: () => onRequestStatusChange(user, !user.isActive) }}><Button type="text" size="small" icon={<MoreOutlined />} aria-label={`Thao tác khác cho ${user.username}`} /></Dropdown></Space>;
    } },
  ];
  return <Table className="admin-system-users__table" rowKey="id" size="small" tableLayout="fixed" columns={columns} dataSource={users} loading={loading} scroll={{ x: 1665 }} pagination={{ current: page, pageSize, total, showSizeChanger: true, pageSizeOptions: [10, 20, 50], showTotal: (count) => `${count} người dùng`, onChange: onPaginationChange }} locale={{ emptyText: <Flex vertical align="center" gap={12} className="admin-system-users__empty"><EmptyState description="Không có người dùng phù hợp với bộ lọc hiện tại." /><Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>Thêm người dùng</Button></Flex> }} />;
}
