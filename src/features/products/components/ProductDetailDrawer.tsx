import { EditOutlined, PictureOutlined } from '@ant-design/icons';
import { Avatar, Button, Descriptions, Drawer, Flex, Space, Typography } from 'antd';
import type { AdminProductRecord } from '../adminProducts.model';
import { ProductStatusTag } from './ProductStatusTag';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

interface ProductDetailDrawerProps {
  open: boolean;
  product?: AdminProductRecord;
  onClose: () => void;
  onEdit: (product: AdminProductRecord) => void;
}

export function ProductDetailDrawer({ open, product, onClose, onEdit }: ProductDetailDrawerProps) {
  return (
    <Drawer
      open={open}
      width="min(520px, 100%)"
      title="Chi tiết sản phẩm"
      destroyOnHidden
      onClose={onClose}
      extra={
        product ? (
          <Button icon={<EditOutlined />} onClick={() => onEdit(product)}>
            Chỉnh sửa
          </Button>
        ) : null
      }
    >
      {product ? (
        <Flex vertical gap={24}>
          <Space align="start" size={16}>
            <Avatar
              shape="square"
              size={72}
              src={product.imageUrl}
              icon={<PictureOutlined />}
              alt={`Ảnh ${product.name}`}
            />
            <Flex vertical gap={6}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {product.name}
              </Typography.Title>
              <Typography.Text type="secondary" className="admin-products__sku">
                {product.sku}
              </Typography.Text>
              <ProductStatusTag status={product.status} />
            </Flex>
          </Space>

          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Danh mục">{product.categoryName}</Descriptions.Item>
            <Descriptions.Item label="Thương hiệu">{product.brand ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Đơn vị tính">{product.unit}</Descriptions.Item>
            <Descriptions.Item label="Giá bán">
              <span className="admin-products__number">{currencyFormatter.format(product.retailPrice)}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Giá bán buôn">
              <span className="admin-products__number">
                {product.wholesalePrice ? currencyFormatter.format(product.wholesalePrice) : '—'}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Tồn kho">
              <span className="admin-products__number">{product.availableStock}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">
              {dateTimeFormatter.format(new Date(product.updatedAt))}
            </Descriptions.Item>
          </Descriptions>
        </Flex>
      ) : null}
    </Drawer>
  );
}
