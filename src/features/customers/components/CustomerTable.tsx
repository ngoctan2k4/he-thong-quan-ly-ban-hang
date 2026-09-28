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
import type { CustomerType } from '../../../types/customer';
import type { AdminCustomerRecord } from '../customers.model';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const customerTypeMeta: Record<CustomerType, { color: string; label: string }> = {
  RETAIL: { color: 'blue', label: 'Bán lẻ' },
  WHOLESALE: { color: 'gold', label: 'Bán sỉ' },
  VIP: { color: 'purple', label: 'VIP' },
};

interface CustomerTableProps {
  customers: AdminCustomerRecord[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  onCreate: () => void;
  onView: (customer: AdminCustomerRecord) => void;
  onEdit: (customer: AdminCustomerRecord) => void;
  onRequestStatusChange: (customer: AdminCustomerRecord, isActive: boolean) => void;
}

export function CustomerTable({
  customers,
  loading = false,
  page,
  pageSize,
  total,
  onPaginationChange,
  onCreate,
  onView,
  onEdit,
  onRequestStatusChange,
}: CustomerTableProps) {
  const columns: TableProps<AdminCustomerRecord>['columns'] = [
    {
      title: 'Mã khách hàng',
      dataIndex: 'code',
      width: 132,
      render: (code: string) => <Typography.Text className="admin-customers__code">{code}</Typography.Text>,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'name',
      width: 230,
      ellipsis: { showTitle: false },
      render: (name: string) => <Typography.Text strong title={name}>{name}</Typography.Text>,
    },
    {
      title: 'Loại khách hàng',
      dataIndex: 'customerType',
      width: 145,
      responsive: ['md'],
      render: (type: CustomerType) => <Tag color={customerTypeMeta[type].color}>{customerTypeMeta[type].label}</Tag>,
    },
    {
      title: 'Đối tượng',
      dataIndex: 'isCompany',
      width: 130,
      responsive: ['lg'],
      render: (isCompany: boolean) => isCompany ? 'Doanh nghiệp' : 'Cá nhân',
    },
    { title: 'Điện thoại', dataIndex: 'phone', width: 142, responsive: ['sm'], render: (value?: string) => value ?? '—' },
    { title: 'Email', dataIndex: 'email', width: 220, responsive: ['xl'], ellipsis: true, render: (value?: string) => value ?? '—' },
    {
      title: 'Công nợ hiện tại',
      dataIndex: 'currentBalance',
      align: 'right',
      width: 168,
      responsive: ['lg'],
      render: (value?: number) => value === undefined ? '—' : currencyFormatter.format(value),
    },
    {
      title: 'Hạn mức công nợ',
      dataIndex: 'creditLimit',
      align: 'right',
      width: 168,
      responsive: ['xl'],
      render: (value?: number) => value === undefined ? '—' : currencyFormatter.format(value),
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
      render: (_, customer) => {
        const items: MenuProps['items'] = [
          {
            key: 'status',
            icon: customer.isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />,
            label: customer.isActive ? 'Ngừng hoạt động' : 'Kích hoạt',
            danger: customer.isActive,
          },
        ];
        return (
          <Space size={4} className="admin-customers__row-actions">
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => onView(customer)}>Xem</Button>
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEdit(customer)}>Sửa</Button>
            <Dropdown
              trigger={['click']}
              menu={{ items, onClick: () => onRequestStatusChange(customer, !customer.isActive) }}
            >
              <Button type="text" size="small" icon={<MoreOutlined />} aria-label={`Thao tác khác cho ${customer.name}`} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <Table<AdminCustomerRecord>
      className="admin-customers__table"
      rowKey="id"
      size="small"
      tableLayout="fixed"
      columns={columns}
      dataSource={customers}
      loading={loading}
      scroll={{ x: 1540 }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50],
        showTotal: (count) => `${count} khách hàng`,
        onChange: onPaginationChange,
      }}
      locale={{
        emptyText: (
          <Flex vertical align="center" gap={12} className="admin-customers__empty">
            <EmptyState description="Không có khách hàng phù hợp với bộ lọc hiện tại." />
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>Thêm khách hàng</Button>
          </Flex>
        ),
      }}
    />
  );
}
