import {
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Flex, Space, Table, Tag, Typography } from 'antd';
import type { MenuProps, TableProps } from 'antd';
import { EmptyState } from '../../../components/common/EmptyState';
import type { Supplier } from '../../../types/supplier';

interface SupplierTableProps {
  suppliers: Supplier[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  onCreate: () => void;
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onRequestStatusChange: (supplier: Supplier, isActive: boolean) => void;
}

export function SupplierTable({
  suppliers,
  loading = false,
  page,
  pageSize,
  total,
  onPaginationChange,
  onCreate,
  onView,
  onEdit,
  onRequestStatusChange,
}: SupplierTableProps) {
  const columns: TableProps<Supplier>['columns'] = [
    {
      title: 'Mã NCC',
      dataIndex: 'code',
      width: 125,
      render: (code: string) => <Typography.Text className="admin-suppliers__code">{code}</Typography.Text>,
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      width: 260,
      ellipsis: { showTitle: false },
      render: (name: string) => <Typography.Text strong title={name}>{name}</Typography.Text>,
    },
    { title: 'Mã số thuế', dataIndex: 'taxCode', width: 145, responsive: ['md'], render: (value?: string) => value ?? '—' },
    { title: 'Điện thoại', dataIndex: 'phone', width: 140, responsive: ['sm'], render: (value?: string) => value ?? '—' },
    { title: 'Email', dataIndex: 'email', width: 220, responsive: ['xl'], ellipsis: true, render: (value?: string) => value ?? '—' },
    {
      title: 'Lead time TB',
      dataIndex: 'avgLeadTimeDays',
      align: 'right',
      width: 135,
      responsive: ['lg'],
      render: (value: number) => `${value} ngày`,
    },
    {
      title: 'Lead time tối đa',
      dataIndex: 'maxLeadTimeDays',
      align: 'right',
      width: 155,
      responsive: ['lg'],
      render: (value: number) => `${value} ngày`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      width: 150,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'} icon={isActive ? <CheckCircleOutlined /> : <PauseCircleOutlined />}>
          {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 170,
      fixed: 'right',
      render: (_, supplier) => {
        const items: MenuProps['items'] = [{
          key: 'status',
          icon: supplier.isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />,
          label: supplier.isActive ? 'Ngừng hoạt động' : 'Kích hoạt',
          danger: supplier.isActive,
        }];
        return (
          <Space size={4} className="admin-suppliers__row-actions">
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => onView(supplier)}>Xem</Button>
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEdit(supplier)}>Sửa</Button>
            <Dropdown trigger={['click']} menu={{ items, onClick: () => onRequestStatusChange(supplier, !supplier.isActive) }}>
              <Button type="text" size="small" icon={<MoreOutlined />} aria-label={`Thao tác khác cho ${supplier.name}`} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <Table<Supplier>
      className="admin-suppliers__table"
      rowKey="id"
      size="small"
      tableLayout="fixed"
      columns={columns}
      dataSource={suppliers}
      loading={loading}
      scroll={{ x: 1370 }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50],
        showTotal: (count) => `${count} nhà cung cấp`,
        onChange: onPaginationChange,
      }}
      locale={{
        emptyText: (
          <Flex vertical align="center" gap={12} className="admin-suppliers__empty">
            <EmptyState description="Không có nhà cung cấp phù hợp với bộ lọc hiện tại." />
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>Thêm nhà cung cấp</Button>
          </Flex>
        ),
      }}
    />
  );
}
