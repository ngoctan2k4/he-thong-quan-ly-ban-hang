import { EditOutlined, EyeOutlined, PlusOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Table, Tag, Tooltip, Typography } from 'antd';
import type { TableProps } from 'antd';
import { EmptyState } from '../../../components/common/EmptyState';
import type { AdminRoleRecord } from '../accessControl.model';

interface RoleTableProps {
  roles: AdminRoleRecord[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  onCreate: () => void;
  onView: (role: AdminRoleRecord) => void;
  onEdit: (role: AdminRoleRecord) => void;
}

export function RoleTable({ roles, loading = false, page, pageSize, total, onPaginationChange, onCreate, onView, onEdit }: RoleTableProps) {
  const columns: TableProps<AdminRoleRecord>['columns'] = [
    {
      title: 'Mã vai trò',
      dataIndex: 'code',
      width: 210,
      render: (code: string) => <Typography.Text code>{code}</Typography.Text>,
    },
    { title: 'Tên vai trò', dataIndex: 'name', width: 230, render: (name: string) => <Typography.Text strong>{name}</Typography.Text> },
    { title: 'Mô tả', dataIndex: 'description', ellipsis: true, responsive: ['md'], render: (description?: string) => description ?? '—' },
    {
      title: 'Số quyền',
      dataIndex: 'permissionCount',
      width: 130,
      align: 'center',
      render: (count: number) => <Tag color="blue" icon={<SafetyCertificateOutlined />}>{count} quyền</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 180,
      render: (_, role) => <Space size={2}>
        <Tooltip title="Xem quyền của vai trò"><Button type="link" size="small" icon={<EyeOutlined />} onClick={() => onView(role)}>Xem</Button></Tooltip>
        <Tooltip title="Chỉnh sửa vai trò"><Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEdit(role)}>Sửa</Button></Tooltip>
      </Space>,
    },
  ];

  return <Table
    className="admin-access-control__table"
    rowKey="id"
    size="small"
    tableLayout="fixed"
    columns={columns}
    dataSource={roles}
    loading={loading}
    scroll={{ x: 900 }}
    pagination={{
      current: page,
      pageSize,
      total,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50],
      showTotal: (count) => `${count} vai trò`,
      onChange: onPaginationChange,
    }}
    locale={{
      emptyText: <Flex vertical align="center" gap={12} className="admin-access-control__empty">
        <EmptyState description="Không có vai trò phù hợp với từ khóa hiện tại." />
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>Thêm vai trò</Button>
      </Flex>,
    }}
  />;
}
