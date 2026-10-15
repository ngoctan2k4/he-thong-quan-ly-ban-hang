/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V4 */
import { EditOutlined, EyeOutlined, MoreOutlined, PauseCircleOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Flex, Grid, Space, Table, Tag, Typography } from 'antd';
import type { MenuProps, TableProps } from 'antd';
import { EmptyState } from '../../../components/common/EmptyState';
import type { AdminProductRecord } from '../adminProducts.model';
import { ProductStatusTag } from './ProductStatusTag';

const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

interface ProductIndexTableProps {
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

export function ProductIndexTable({ products, loading = false, page, pageSize, total, onPaginationChange, onCreate, onView, onEdit, onRequestActiveChange }: ProductIndexTableProps) {
  const screens = Grid.useBreakpoint();
  const mobile = !screens.md;
  const actions = (product: AdminProductRecord): NonNullable<MenuProps['items']> => [
    { key: 'view', icon: <EyeOutlined />, label: 'Xem hồ sơ', onClick: () => onView(product) },
    { key: 'edit', icon: <EditOutlined />, label: 'Chỉnh sửa', onClick: () => onEdit(product) },
    { type: 'divider' },
    { key: 'active', danger: product.isActive, icon: product.isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />, label: product.isActive ? 'Tắt sản phẩm' : 'Kích hoạt', onClick: () => onRequestActiveChange(product) },
  ];
  const columns: TableProps<AdminProductRecord>['columns'] = [
    {
      title: 'Sản phẩm', key: 'product', width: mobile ? 210 : 250,
      render: (_, product) => <Flex vertical gap={3} className="admin-products__product-copy"><Flex align="center" gap={8} wrap={!mobile}><Typography.Text strong className="admin-products__product-name">{product.name}</Typography.Text>{mobile ? <ProductStatusTag status={product.status} /> : null}</Flex><Typography.Text type="secondary" className="admin-products__sku">{product.code} · {product.sku}{product.barcode ? ` · ${product.barcode}` : ''}</Typography.Text></Flex>,
    },
    { title: 'Phân loại', key: 'classification', width: 140, responsive: ['md'], render: (_, product) => <Flex vertical gap={2}><Typography.Text>{product.categoryName}</Typography.Text><Typography.Text type="secondary">{product.brand ?? 'Chưa có thương hiệu'}</Typography.Text></Flex> },
    { title: 'Giá bán', key: 'pricing', width: 130, align: 'right', responsive: ['md'], render: (_, product) => <Flex vertical gap={2} align="flex-end"><Typography.Text strong className="admin-products__number">{currencyFormatter.format(product.retailPrice)}</Typography.Text><Typography.Text type="secondary" className="admin-products__number">Sỉ {currencyFormatter.format(product.wholesalePrice)}</Typography.Text></Flex> },
    { title: 'Chính sách', key: 'policy', width: 115, responsive: ['lg'], render: (_, product) => <Flex vertical gap={2}><Typography.Text>MOQ <strong>{product.moq}</strong> {product.baseUnitName}</Typography.Text><Typography.Text type="secondary">Đặt lại {product.reorderPoint}</Typography.Text></Flex> },
    { title: 'Trạng thái', key: 'status', width: 115, responsive: ['md'], render: (_, product) => <Flex vertical align="flex-start" gap={4}><ProductStatusTag status={product.status} />{!product.isActive ? <Tag>Đã tắt</Tag> : null}</Flex> },
    {
      title: '', key: 'actions', width: mobile ? 44 : 140,
      render: (_, product) => mobile ? <Dropdown menu={{ items: actions(product) }} trigger={['click']}><Button type="text" icon={<MoreOutlined />} aria-label={`Thao tác với ${product.name}`} /></Dropdown> : <Space size={2} className="admin-products__row-actions"><Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView(product)}>Xem</Button><Dropdown menu={{ items: actions(product).slice(1) }} trigger={['click']}><Button type="text" size="small" icon={<MoreOutlined />} aria-label={`Thêm thao tác với ${product.name}`} /></Dropdown></Space>,
    },
  ];
  return <Table<AdminProductRecord> className="admin-products__table" rowKey="id" tableLayout="fixed" columns={columns} dataSource={products} loading={loading} pagination={{ current: page, pageSize, total, showSizeChanger: !mobile, pageSizeOptions: ['10', '20', '50'], showTotal: mobile ? undefined : (count) => `${count} sản phẩm`, onChange: onPaginationChange }} locale={{ emptyText: <Flex vertical align="center" gap={12} className="admin-products__empty"><EmptyState description="Chưa có sản phẩm. Tạo sản phẩm đầu tiên sau khi đã có nhóm hàng và đơn vị tính." /><Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>Thêm sản phẩm</Button></Flex> }} />;
}
