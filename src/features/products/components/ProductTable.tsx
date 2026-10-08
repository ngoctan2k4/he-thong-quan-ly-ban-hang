import { EditOutlined, EyeOutlined, PauseCircleOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { EmptyState } from '../../../components/common/EmptyState';
import type { AdminProductRecord } from '../adminProducts.model';
import { ProductStatusTag } from './ProductStatusTag';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

interface ProductTableProps {
  products: AdminProductRecord[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  onCreate: () => void;
  onView: (product: AdminProductRecord) => void;
  onEdit: (product: AdminProductRecord) => void;
  onRequestActiveChange: (product: AdminProductRecord) => void;
}

export function ProductTable({ products, loading = false, page, pageSize, total, onPaginationChange, onCreate, onView, onEdit, onRequestActiveChange }: ProductTableProps) {
  const columns: TableProps<AdminProductRecord>['columns'] = [
    { title: 'Mã hàng', dataIndex: 'code', width: 120, render: (value: string) => <Typography.Text className="admin-products__sku">{value}</Typography.Text> },
    { title: 'SKU', dataIndex: 'sku', width: 145, render: (value: string) => <Typography.Text className="admin-products__sku">{value}</Typography.Text> },
    { title: 'Tên sản phẩm', dataIndex: 'name', width: 270, render: (value: string) => <Typography.Text strong>{value}</Typography.Text> },
    { title: 'Nhóm hàng', dataIndex: 'categoryName', width: 165 },
    { title: 'Thương hiệu', dataIndex: 'brand', width: 150, render: (value?: string) => value ?? '—' },
    { title: 'Đơn vị cơ sở', dataIndex: 'baseUnitName', width: 135 },
    { title: 'Giá bán lẻ', dataIndex: 'retailPrice', align: 'right', width: 145, render: (value: number) => <span className="admin-products__number">{currencyFormatter.format(value)}</span> },
    { title: 'Giá bán sỉ', dataIndex: 'wholesalePrice', align: 'right', width: 145, render: (value: number) => <span className="admin-products__number">{currencyFormatter.format(value)}</span> },
    { title: 'Trạng thái', dataIndex: 'status', width: 180, render: (_, record) => <Flex vertical align="flex-start" gap={4}><ProductStatusTag status={record.status} />{!record.isActive ? <Tag>Đã tắt</Tag> : null}</Flex> },
    { title: 'Thao tác', key: 'actions', width: 245, render: (_, product) => <Space size={2} className="admin-products__row-actions"><Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView(product)}>Xem</Button><Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(product)}>Sửa</Button><Button type="text" size="small" danger={product.isActive} icon={product.isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />} onClick={() => onRequestActiveChange(product)}>{product.isActive ? 'Tắt' : 'Bật'}</Button></Space> },
  ];
  return <Table<AdminProductRecord>
    className="admin-products__table"
    rowKey="id"
    tableLayout="fixed"
    columns={columns}
    dataSource={products}
    loading={loading}
    scroll={{ x: 1740 }}
    pagination={{ current: page, pageSize, total, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'], showTotal: (count) => `${count} sản phẩm`, onChange: onPaginationChange }}
    locale={{ emptyText: <Flex vertical align="center" gap={12} className="admin-products__empty"><EmptyState description="Chưa có sản phẩm phù hợp với bộ lọc hiện tại." /><Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>Thêm sản phẩm</Button></Flex> }}
  />;
}
