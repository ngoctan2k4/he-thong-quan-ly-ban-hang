import {
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PauseCircleOutlined,
  PictureOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Flex, Space, Table, Typography } from 'antd';
import type { MenuProps, TableProps } from 'antd';
import { EmptyState } from '../../../components/common/EmptyState';
import type { ProductStatus } from '../../../types/product';
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
  onRequestStatusChange: (
    product: AdminProductRecord,
    status: Exclude<ProductStatus, 'OUT_OF_STOCK'>,
  ) => void;
}

export function ProductTable({
  products,
  loading = false,
  page,
  pageSize,
  total,
  onPaginationChange,
  onCreate,
  onView,
  onEdit,
  onRequestStatusChange,
}: ProductTableProps) {
  const getStatusItems = (product: AdminProductRecord): MenuProps['items'] => {
    const targetStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const activatingWithoutStock = targetStatus === 'ACTIVE' && product.availableStock === 0;

    return [
      {
        key: targetStatus,
        icon: targetStatus === 'ACTIVE' ? <PlayCircleOutlined /> : <PauseCircleOutlined />,
        label: activatingWithoutStock ? 'Cập nhật tồn kho để kích hoạt' : targetStatus === 'ACTIVE' ? 'Kích hoạt' : 'Ngừng bán',
        danger: targetStatus === 'INACTIVE',
        disabled: activatingWithoutStock,
      },
    ];
  };

  const columns: TableProps<AdminProductRecord>['columns'] = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      width: 84,
      responsive: ['md'],
      render: (imageUrl: string | undefined, product) => (
        <Avatar
          shape="square"
          size={48}
          src={imageUrl}
          icon={<PictureOutlined />}
          alt={`Ảnh ${product.name}`}
        />
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 132,
      render: (sku: string) => <Typography.Text className="admin-products__sku">{sku}</Typography.Text>,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: 280,
      render: (name: string, product) => (
        <Flex vertical gap={2} className="admin-products__product-copy">
          <Typography.Text strong className="admin-products__product-name">
            {name}
          </Typography.Text>
          <Typography.Text type="secondary">
            {[product.brand, product.unit].filter(Boolean).join(' · ')}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      width: 150,
      responsive: ['lg'],
    },
    {
      title: 'Giá bán',
      dataIndex: 'retailPrice',
      align: 'right',
      width: 150,
      render: (price: number) => (
        <Typography.Text strong className="admin-products__number">
          {currencyFormatter.format(price)}
        </Typography.Text>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'availableStock',
      align: 'right',
      width: 126,
      render: (stock: number) => (
        <Flex vertical align="flex-end" gap={2}>
          <Typography.Text strong className="admin-products__number">
            {stock}
          </Typography.Text>
          <Typography.Text type={stock === 0 ? 'danger' : 'secondary'}>
            {stock === 0 ? 'Hết hàng' : 'Còn hàng'}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      render: (status: ProductStatus) => <ProductStatusTag status={status} />,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 188,
      render: (_, product) => (
        <Space size={2} className="admin-products__row-actions">
          <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView(product)}>
            Xem
          </Button>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(product)}>
            Sửa
          </Button>
          <Dropdown
            trigger={['click']}
            menu={{
              items: getStatusItems(product),
              onClick: ({ key }) =>
                onRequestStatusChange(
                  product,
                  key as Exclude<ProductStatus, 'OUT_OF_STOCK'>,
                ),
            }}
          >
            <Button type="text" size="small" icon={<MoreOutlined />} aria-label={`Thao tác khác cho ${product.name}`} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <Table<AdminProductRecord>
      className="admin-products__table"
      rowKey="id"
      size="middle"
      columns={columns}
      dataSource={products}
      loading={loading}
      tableLayout="fixed"
      scroll={{ x: 1160 }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: (count) => `${count} sản phẩm`,
        onChange: onPaginationChange,
      }}
      locale={{
        emptyText: (
          <Flex vertical align="center" gap={12} className="admin-products__empty">
            <EmptyState description="Chưa có sản phẩm phù hợp với bộ lọc hiện tại." />
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
              Thêm sản phẩm
            </Button>
          </Flex>
        ),
      }}
    />
  );
}
