import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Drawer, Empty, Flex, Form, InputNumber, Modal, Popconfirm, Select, Space, Spin, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useEffect, useState } from 'react';
import type { AdminProductRecord, ProductConversionView, ProductReferences } from '../adminProducts.model';
import type { ProductConversionFormValues } from '../products.repository';
import { ProductStatusTag } from './ProductStatusTag';

const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

interface ProductDetailDrawerProps {
  open: boolean;
  product?: AdminProductRecord;
  references: ProductReferences;
  conversions: ProductConversionView[];
  conversionsLoading?: boolean;
  conversionSaving?: boolean;
  conversionDeleting?: boolean;
  onClose: () => void;
  onEdit: (product: AdminProductRecord) => void;
  onSaveConversion: (values: ProductConversionFormValues, conversionId?: number) => Promise<boolean>;
  onDeleteConversion: (id: number) => Promise<boolean>;
}

export function ProductDetailDrawer({ open, product, references, conversions, conversionsLoading = false, conversionSaving = false, conversionDeleting = false, onClose, onEdit, onSaveConversion, onDeleteConversion }: ProductDetailDrawerProps) {
  const [conversionOpen, setConversionOpen] = useState(false);
  const [editingConversion, setEditingConversion] = useState<ProductConversionView>();
  const [form] = Form.useForm<ProductConversionFormValues>();
  useEffect(() => {
    if (!conversionOpen) return;
    form.setFieldsValue(editingConversion ? { unitId: editingConversion.unitId, factor: editingConversion.factor } : { unitId: undefined, factor: 1 });
  }, [conversionOpen, editingConversion, form]);
  const closeConversion = () => { setConversionOpen(false); setEditingConversion(undefined); form.resetFields(); };
  const submitConversion = async () => {
    const values = await form.validateFields();
    if (await onSaveConversion(values, editingConversion?.id)) closeConversion();
  };
  const usedUnitIds = new Set(conversions.map((item) => item.unitId));
  const conversionColumns: TableProps<ProductConversionView>['columns'] = [
    { title: 'Đơn vị quy đổi', dataIndex: 'unitName' },
    { title: 'Hệ số', dataIndex: 'factor', width: 110, align: 'right', render: (value: number) => <span className="admin-products__number">{value}</span> },
    { title: 'Ý nghĩa', width: 250, render: (_, record) => `1 ${record.unitName} = ${record.factor} ${product?.baseUnitName ?? ''}` },
    { title: 'Thao tác', width: 120, render: (_, record) => <Space size={2}><Button type="text" size="small" icon={<EditOutlined />} aria-label={`Sửa quy đổi ${record.unitName}`} onClick={() => { setEditingConversion(record); setConversionOpen(true); }} /><Popconfirm title="Xóa quy đổi này?" description="Thao tác sẽ loại bỏ đơn vị quy đổi khỏi sản phẩm." okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true, loading: conversionDeleting }} onConfirm={() => onDeleteConversion(record.id)}><Button type="text" danger size="small" icon={<DeleteOutlined />} aria-label={`Xóa quy đổi ${record.unitName}`} /></Popconfirm></Space> },
  ];
  return <>
    <Drawer open={open} width="min(760px, 100%)" title="Chi tiết sản phẩm" destroyOnHidden onClose={onClose} extra={product ? <Button icon={<EditOutlined />} onClick={() => onEdit(product)}>Chỉnh sửa</Button> : null}>
      {product ? <Flex vertical gap={4}>
        <Typography.Title level={4} style={{ margin: 0 }}>{product.name}</Typography.Title>
        <Space wrap><Typography.Text type="secondary">{product.code} · {product.sku}</Typography.Text><ProductStatusTag status={product.status} />{product.isActive ? <Tag color="success">Đã kích hoạt</Tag> : <Tag>Đã tắt</Tag>}</Space>
        <Divider orientation="left">Thông tin chung</Divider>
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }} items={[
          { key: 'code', label: 'Mã hàng', children: product.code }, { key: 'sku', label: 'SKU', children: product.sku },
          { key: 'barcode', label: 'Barcode', children: product.barcode ?? '—' }, { key: 'name', label: 'Tên', children: product.name },
          { key: 'category', label: 'Nhóm hàng', children: product.categoryName }, { key: 'brand', label: 'Thương hiệu', children: product.brand ?? '—' },
          { key: 'status', label: 'Trạng thái', children: <ProductStatusTag status={product.status} /> },
        ]} />
        <Divider orientation="left">Giá bán</Divider>
        <Descriptions bordered size="small" column={{ xs: 1, sm: 3 }} items={[
          { key: 'retail', label: 'Giá bán lẻ', children: currencyFormatter.format(product.retailPrice) },
          { key: 'wholesale', label: 'Giá bán sỉ', children: currencyFormatter.format(product.wholesalePrice) },
          { key: 'moq', label: 'MOQ', children: product.moq },
        ]} />
        <Divider orientation="left">Đơn vị & quy đổi</Divider>
        <Flex justify="space-between" align="center" gap={12} wrap><Typography.Text>Đơn vị cơ sở: <strong>{product.baseUnitName}</strong></Typography.Text><Button type="primary" ghost size="small" icon={<PlusOutlined />} onClick={() => { setEditingConversion(undefined); setConversionOpen(true); }}>Thêm quy đổi</Button></Flex>
        {conversionsLoading ? <Flex justify="center" style={{ padding: 24 }}><Spin /></Flex> : <Table rowKey="id" size="small" columns={conversionColumns} dataSource={conversions} pagination={false} scroll={{ x: 620 }} locale={{ emptyText: <Empty description="Chưa có đơn vị quy đổi" /> }} />}
        <Divider orientation="left">Thiết lập tồn kho</Divider>
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }} items={[
          { key: 'min', label: 'Tồn tối thiểu', children: product.minStock }, { key: 'max', label: 'Tồn tối đa', children: product.maxStock ?? 'Không giới hạn' },
          { key: 'safety', label: 'Tồn an toàn', children: product.safetyStock }, { key: 'reorder', label: 'Điểm đặt hàng lại', children: product.reorderPoint },
        ]} />
      </Flex> : null}
    </Drawer>
    <Modal open={conversionOpen} title={editingConversion ? 'Sửa hệ số quy đổi' : 'Thêm đơn vị quy đổi'} okText="Lưu" cancelText="Hủy" confirmLoading={conversionSaving} onOk={() => void submitConversion()} onCancel={closeConversion} destroyOnHidden>
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item name="unitId" label="Đơn vị quy đổi" rules={[{ required: true, message: 'Chọn đơn vị quy đổi.' }]}><Select showSearch optionFilterProp="label" disabled={Boolean(editingConversion)} options={references.units.filter((item) => item.value !== product?.baseUnitId && (editingConversion ? editingConversion.unitId === item.value : !item.disabled && !usedUnitIds.has(item.value)))} /></Form.Item>
        <Form.Item name="factor" label={`Hệ số so với ${product?.baseUnitName ?? 'đơn vị cơ sở'}`} rules={[{ required: true, message: 'Nhập hệ số.' }, { type: 'number', min: Number.MIN_VALUE, message: 'Hệ số phải lớn hơn 0.' }]}><InputNumber min={0.000001} style={{ width: '100%' }} addonBefore="1 đơn vị =" addonAfter={product?.baseUnitName} /></Form.Item>
      </Form>
    </Modal>
  </>;
}
