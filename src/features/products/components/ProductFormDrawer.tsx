import { Button, Col, Drawer, Flex, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { useEffect } from 'react';
import type {
  AdminProductRecord,
  ProductCategoryOption,
  ProductFormMode,
  ProductFormValues,
} from '../adminProducts.model';

interface ProductFormDrawerProps {
  open: boolean;
  mode: ProductFormMode;
  product?: AdminProductRecord;
  categories: ProductCategoryOption[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => Promise<void>;
}

const defaultValues: ProductFormValues = {
  sku: '',
  name: '',
  categoryId: 101,
  brand: '',
  unit: 'Cái',
  retailPrice: 0,
  wholesalePrice: undefined,
  availableStock: 0,
  status: 'INACTIVE',
  imageUrl: '',
};

export function ProductFormDrawer({
  open,
  mode,
  product,
  categories,
  loading = false,
  onClose,
  onSubmit,
}: ProductFormDrawerProps) {
  const [form] = Form.useForm<ProductFormValues>();

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === 'edit' && product) {
      form.setFieldsValue({
        sku: product.sku,
        name: product.name,
        categoryId: product.categoryId,
        brand: product.brand,
        unit: product.unit,
        retailPrice: product.retailPrice,
        wholesalePrice: product.wholesalePrice,
        availableStock: product.availableStock,
        status: product.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
        imageUrl: product.imageUrl,
      });
      return;
    }

    form.setFieldsValue(defaultValues);
  }, [form, mode, open, product]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      open={open}
      width="min(620px, 100%)"
      title={mode === 'create' ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'}
      destroyOnHidden
      onClose={handleClose}
      footer={
        <Flex justify="flex-end">
          <Space>
            <Button disabled={loading} onClick={handleClose}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              form="admin-product-form"
              loading={loading}
            >
              {mode === 'create' ? 'Thêm sản phẩm' : 'Lưu thay đổi'}
            </Button>
          </Space>
        </Flex>
      }
    >
      <Form<ProductFormValues>
        id="admin-product-form"
        form={form}
        layout="vertical"
        requiredMark
        onFinish={onSubmit}
      >
        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[{ required: true, whitespace: true, message: 'Nhập tên sản phẩm.' }]}
        >
          <Input placeholder="Ví dụ: Áo thun cotton cổ tròn" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="sku"
              label="SKU"
              rules={[{ required: true, whitespace: true, message: 'Nhập mã SKU.' }]}
            >
              <Input placeholder="Ví dụ: TSH-BLK-M" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="categoryId"
              label="Danh mục"
              rules={[{ required: true, message: 'Chọn danh mục sản phẩm.' }]}
            >
              <Select showSearch optionFilterProp="label" options={categories} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="brand" label="Thương hiệu">
              <Input placeholder="Tên thương hiệu" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="unit"
              label="Đơn vị tính"
              rules={[{ required: true, whitespace: true, message: 'Nhập đơn vị tính.' }]}
            >
              <Input placeholder="Cái, hộp, bộ…" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="retailPrice"
              label="Giá bán"
              rules={[{ required: true, message: 'Nhập giá bán.' }]}
            >
              <InputNumber min={0} step={1000} addonAfter="₫" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="wholesalePrice" label="Giá bán buôn">
              <InputNumber min={0} step={1000} addonAfter="₫" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="availableStock"
              label="Số lượng tồn kho"
              rules={[{ required: true, message: 'Nhập số lượng tồn kho.' }]}
            >
              <InputNumber min={0} precision={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="status"
              label="Trạng thái bán"
              rules={[{ required: true, message: 'Chọn trạng thái bán.' }]}
            >
              <Select
                options={[
                  { value: 'ACTIVE', label: 'Đang bán' },
                  { value: 'INACTIVE', label: 'Ngừng bán' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="imageUrl"
          label="Đường dẫn hình ảnh"
          rules={[{ type: 'url', warningOnly: true, message: 'Đường dẫn ảnh chưa đúng định dạng URL.' }]}
        >
          <Input placeholder="https://example.com/product.jpg" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
