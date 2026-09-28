import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Descriptions,
  Drawer,
  Empty,
  Flex,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Skeleton,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import type { TableColumnsType } from 'antd';
import { useState } from 'react';
import { ErrorState } from '../../../components/common/ErrorState';
import type {
  AdminSupplierDetail,
  ProductReference,
  SupplierProductFormValues,
  SupplierProductView,
} from '../suppliers.model';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

interface SupplierDetailDrawerProps {
  open: boolean;
  supplier?: AdminSupplierDetail;
  productReferences: ProductReference[];
  loading?: boolean;
  error?: Error | null;
  productSaving?: boolean;
  productRemoving?: boolean;
  onClose: () => void;
  onRetry: () => void;
  onEdit: (supplier: AdminSupplierDetail) => void;
  onSaveProductLink: (values: SupplierProductFormValues, relationId?: number) => Promise<boolean>;
  onUnlinkProduct: (relationId: number) => Promise<boolean>;
}

export function SupplierDetailDrawer({
  open,
  supplier,
  productReferences,
  loading = false,
  error,
  productSaving = false,
  productRemoving = false,
  onClose,
  onRetry,
  onEdit,
  onSaveProductLink,
  onUnlinkProduct,
}: SupplierDetailDrawerProps) {
  const [productForm] = Form.useForm<SupplierProductFormValues>();
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SupplierProductView>();

  const openProductModal = (product?: SupplierProductView) => {
    setEditingProduct(product);
    productForm.setFieldsValue(product ? {
      productId: product.productId,
      lastPurchasePrice: product.lastPurchasePrice,
      leadTimeDays: product.leadTimeDays,
    } : { lastPurchasePrice: 0, leadTimeDays: supplier?.avgLeadTimeDays ?? 0 });
    setProductModalOpen(true);
  };

  const closeProductModal = () => {
    setProductModalOpen(false);
    setEditingProduct(undefined);
    productForm.resetFields();
  };

  const submitProductLink = async () => {
    try {
      const values = await productForm.validateFields();
      const saved = await onSaveProductLink(values, editingProduct?.id);
      if (saved) {
        closeProductModal();
      }
    } catch (error) {
      if (!(typeof error === 'object' && error && 'errorFields' in error)) {
        throw error;
      }
    }
  };

  const productColumns: TableColumnsType<SupplierProductView> = [
    { title: 'Mã sản phẩm', dataIndex: 'productCode', width: 140 },
    { title: 'Tên sản phẩm', dataIndex: 'productName', width: 260, ellipsis: true },
    {
      title: 'Giá nhập gần nhất',
      dataIndex: 'lastPurchasePrice',
      align: 'right',
      width: 175,
      render: (value: number) => currencyFormatter.format(value),
    },
    {
      title: 'Lead time riêng',
      dataIndex: 'leadTimeDays',
      align: 'right',
      width: 145,
      render: (value: number) => `${value} ngày`,
    },
    {
      title: 'NCC mặc định',
      dataIndex: 'isDefaultSupplier',
      width: 140,
      render: (value: boolean) => value ? <Tag color="blue">Mặc định</Tag> : <Tag>Không</Tag>,
    },
    {
      title: 'Thao tác',
      width: 145,
      fixed: 'right',
      render: (_, product) => (
        <Space size={4}>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openProductModal(product)}>Sửa</Button>
          <Popconfirm
            title="Bỏ liên kết sản phẩm?"
            description="Sản phẩm vẫn được giữ nguyên trong danh mục sản phẩm."
            okText="Bỏ liên kết"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: productRemoving }}
            onConfirm={() => void onUnlinkProduct(product.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>Bỏ</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const generalTab = supplier ? (
    <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
      <Descriptions.Item label="Mã NCC">{supplier.code}</Descriptions.Item>
      <Descriptions.Item label="Tên NCC">{supplier.name}</Descriptions.Item>
      <Descriptions.Item label="Mã số thuế">{supplier.taxCode ?? '—'}</Descriptions.Item>
      <Descriptions.Item label="Điện thoại">{supplier.phone ?? '—'}</Descriptions.Item>
      <Descriptions.Item label="Email">{supplier.email ?? '—'}</Descriptions.Item>
      <Descriptions.Item label="Địa chỉ">{supplier.address ?? '—'}</Descriptions.Item>
      <Descriptions.Item label="Lead time trung bình">{supplier.avgLeadTimeDays} ngày</Descriptions.Item>
      <Descriptions.Item label="Lead time tối đa">{supplier.maxLeadTimeDays} ngày</Descriptions.Item>
      <Descriptions.Item label="Trạng thái">
        <Tag color={supplier.isActive ? 'success' : 'default'}>
          {supplier.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Ngày tạo">{dateTimeFormatter.format(new Date(supplier.createdAt))}</Descriptions.Item>
    </Descriptions>
  ) : null;

  const productsTab = supplier ? (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center" gap={12} wrap>
        <Typography.Text type="secondary">{supplier.products.length} sản phẩm đang liên kết</Typography.Text>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          disabled={supplier.products.length >= productReferences.length}
          onClick={() => openProductModal()}
        >
          Thêm sản phẩm
        </Button>
      </Flex>
      <Table<SupplierProductView>
        className="admin-suppliers__products-table"
        rowKey="id"
        size="small"
        tableLayout="fixed"
        columns={productColumns}
        dataSource={supplier.products}
        pagination={false}
        scroll={{ x: 1000 }}
        locale={{
          emptyText: (
            <Flex vertical align="center" gap={12} className="admin-suppliers__products-empty">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Nhà cung cấp chưa có sản phẩm liên kết." />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openProductModal()}>
                Thêm sản phẩm đầu tiên
              </Button>
            </Flex>
          ),
        }}
      />
    </Flex>
  ) : null;

  const linkedProductIds = new Set(supplier?.products.map((item) => item.productId) ?? []);

  return (
    <>
      <Drawer
        open={open}
        width="min(980px, 100%)"
        title="Chi tiết nhà cung cấp"
        destroyOnHidden
        onClose={onClose}
        extra={supplier ? <Button icon={<EditOutlined />} onClick={() => onEdit(supplier)}>Chỉnh sửa</Button> : null}
      >
        {loading ? <Skeleton active paragraph={{ rows: 10 }} /> : null}
        {!loading && error ? <ErrorState message={error.message} onRetry={onRetry} /> : null}
        {!loading && !error && supplier ? (
          <Tabs
            defaultActiveKey="general"
            items={[
              { key: 'general', label: 'Thông tin chung', children: generalTab },
              { key: 'products', label: 'Sản phẩm cung cấp', children: productsTab },
            ]}
          />
        ) : null}
      </Drawer>

      <Modal
        open={productModalOpen}
        title={editingProduct ? 'Chỉnh sửa sản phẩm cung cấp' : 'Thêm sản phẩm cung cấp'}
        okText={editingProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
        cancelText="Hủy"
        confirmLoading={productSaving}
        destroyOnHidden
        onOk={() => void submitProductLink()}
        onCancel={closeProductModal}
      >
        <Form<SupplierProductFormValues>
          form={productForm}
          layout="vertical"
          validateTrigger="onBlur"
          initialValues={{ lastPurchasePrice: 0, leadTimeDays: 0 }}
        >
          <Form.Item name="productId" label="Sản phẩm" rules={[{ required: true, message: 'Chọn sản phẩm cần liên kết.' }]}>
            <Select
              showSearch
              optionFilterProp="label"
              disabled={Boolean(editingProduct)}
              placeholder="Tìm mã hoặc tên sản phẩm"
              options={productReferences.map((product) => ({
                value: product.id,
                label: `${product.code} · ${product.name}`,
                disabled: !editingProduct && linkedProductIds.has(product.id),
              }))}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="lastPurchasePrice"
                label="Giá nhập gần nhất (VND)"
                rules={[
                  { required: true, message: 'Nhập giá nhập tham khảo.' },
                  { type: 'number', min: 0, message: 'Giá nhập phải lớn hơn hoặc bằng 0.' },
                ]}
              >
                <InputNumber min={0} step={1000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="leadTimeDays"
                label="Lead time riêng (ngày)"
                rules={[
                  { required: true, message: 'Nhập lead time riêng.' },
                  { type: 'number', min: 0, message: 'Lead time phải lớn hơn hoặc bằng 0.' },
                ]}
              >
                <InputNumber min={0} precision={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
