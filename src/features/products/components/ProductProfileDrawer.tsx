/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V4 */
import { DeleteOutlined, EditOutlined, PlusOutlined, SafetyCertificateOutlined, ShopOutlined, SwapOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Descriptions, Divider, Drawer, Empty, Flex, Form, InputNumber, Modal, Popconfirm, Select, Space, Spin, Table, Tabs, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useEffect, useState } from 'react';
import type { AdminProductRecord, ProductConversionView, ProductReferences, ProductSupplierFormValues, ProductSupplierView, SupplierReferenceOption } from '../adminProducts.model';
import type { ProductConversionFormValues } from '../products.repository';
import { ProductStatusTag } from './ProductStatusTag';

const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

interface ProductProfileDrawerProps {
  open: boolean;
  product?: AdminProductRecord;
  references: ProductReferences;
  conversions: ProductConversionView[];
  suppliers: ProductSupplierView[];
  supplierReferences: SupplierReferenceOption[];
  conversionsLoading?: boolean;
  suppliersLoading?: boolean;
  conversionSaving?: boolean;
  conversionDeleting?: boolean;
  supplierSaving?: boolean;
  supplierDeleting?: boolean;
  onClose: () => void;
  onEdit: (product: AdminProductRecord) => void;
  onSaveConversion: (values: ProductConversionFormValues, conversionId?: number) => Promise<boolean>;
  onDeleteConversion: (id: number) => Promise<boolean>;
  onSaveSupplier: (values: ProductSupplierFormValues, relationId?: number) => Promise<boolean>;
  onDeleteSupplier: (relationId: number) => Promise<boolean>;
  onOpenSuppliers: () => void;
}

export function ProductProfileDrawer({ open, product, references, conversions, suppliers, supplierReferences, conversionsLoading = false, suppliersLoading = false, conversionSaving = false, conversionDeleting = false, supplierSaving = false, supplierDeleting = false, onClose, onEdit, onSaveConversion, onDeleteConversion, onSaveSupplier, onDeleteSupplier, onOpenSuppliers }: ProductProfileDrawerProps) {
  const [conversionOpen, setConversionOpen] = useState(false);
  const [editingConversion, setEditingConversion] = useState<ProductConversionView>();
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<ProductSupplierView>();
  const [conversionForm] = Form.useForm<ProductConversionFormValues>();
  const [supplierForm] = Form.useForm<ProductSupplierFormValues>();

  useEffect(() => {
    if (!conversionOpen) return;
    conversionForm.setFieldsValue(editingConversion ? { unitId: editingConversion.unitId, factor: editingConversion.factor } : { unitId: undefined, factor: 1 });
  }, [conversionForm, conversionOpen, editingConversion]);
  useEffect(() => {
    if (!supplierOpen) return;
    supplierForm.setFieldsValue(editingSupplier ? { supplierId: editingSupplier.supplierId, lastPurchasePrice: editingSupplier.lastPurchasePrice, leadTimeDays: editingSupplier.leadTimeDays, isDefaultSupplier: editingSupplier.isDefaultSupplier } : { supplierId: undefined, lastPurchasePrice: 0, leadTimeDays: 0, isDefaultSupplier: suppliers.length === 0 });
  }, [editingSupplier, supplierForm, supplierOpen, suppliers.length]);

  const closeConversion = () => { setConversionOpen(false); setEditingConversion(undefined); conversionForm.resetFields(); };
  const closeSupplier = () => { setSupplierOpen(false); setEditingSupplier(undefined); supplierForm.resetFields(); };
  const submitConversion = async () => { const values = await conversionForm.validateFields(); if (await onSaveConversion(values, editingConversion?.id)) closeConversion(); };
  const submitSupplier = async () => { const values = await supplierForm.validateFields(); if (await onSaveSupplier(values, editingSupplier?.id)) closeSupplier(); };
  const usedUnitIds = new Set(conversions.map((item) => item.unitId));
  const usedSupplierIds = new Set(suppliers.map((item) => item.supplierId));
  const defaultSupplier = suppliers.find((item) => item.isDefaultSupplier);

  const conversionColumns: TableProps<ProductConversionView>['columns'] = [
    { title: 'Đơn vị quy đổi', dataIndex: 'unitName' },
    { title: 'Hệ số', dataIndex: 'factor', width: 110, align: 'right', render: (value: number) => <span className="admin-products__number">{value}</span> },
    { title: 'Quy đổi về đơn vị cơ sở', width: 270, render: (_, record) => `1 ${record.unitName} = ${record.factor} ${product?.baseUnitName ?? ''}` },
    { title: '', width: 96, render: (_, record) => <Space size={0}><Button type="text" size="small" icon={<EditOutlined />} aria-label={`Sửa quy đổi ${record.unitName}`} onClick={() => { setEditingConversion(record); setConversionOpen(true); }} /><Popconfirm title="Xóa quy đổi này?" description="Đơn vị quy đổi sẽ được loại khỏi sản phẩm." okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true, loading: conversionDeleting }} onConfirm={() => onDeleteConversion(record.id)}><Button type="text" danger size="small" icon={<DeleteOutlined />} aria-label={`Xóa quy đổi ${record.unitName}`} /></Popconfirm></Space> },
  ];
  const supplierColumns: TableProps<ProductSupplierView>['columns'] = [
    { title: 'Nhà cung cấp', width: 260, render: (_, record) => <Flex vertical gap={2}><Flex align="center" gap={8}><Typography.Text strong>{record.supplierName}</Typography.Text>{record.isDefaultSupplier ? <Tag color="blue">Mặc định</Tag> : null}</Flex><Typography.Text type="secondary">{record.supplierCode}{!record.supplierIsActive ? ' · Đã tắt' : ''}</Typography.Text></Flex> },
    { title: 'Giá nhập gần nhất', dataIndex: 'lastPurchasePrice', width: 180, align: 'right', render: (value: number) => <Typography.Text className="admin-products__number" strong>{currencyFormatter.format(value)}</Typography.Text> },
    { title: 'Lead time', dataIndex: 'leadTimeDays', width: 120, align: 'right', render: (value: number) => `${value} ngày` },
    { title: '', width: 96, render: (_, record) => <Space size={0}><Button type="text" size="small" icon={<EditOutlined />} aria-label={`Sửa thông tin ${record.supplierName}`} onClick={() => { setEditingSupplier(record); setSupplierOpen(true); }} /><Popconfirm title="Bỏ nhà cung cấp khỏi sản phẩm?" description={record.isDefaultSupplier ? 'NCC mặc định sẽ được bỏ. Bạn có thể chọn NCC khác sau đó.' : 'Thông tin mua hàng của NCC này sẽ bị loại khỏi sản phẩm.'} okText="Bỏ liên kết" cancelText="Hủy" okButtonProps={{ danger: true, loading: supplierDeleting }} onConfirm={() => onDeleteSupplier(record.id)}><Button type="text" danger size="small" icon={<DeleteOutlined />} aria-label={`Bỏ nhà cung cấp ${record.supplierName}`} /></Popconfirm></Space> },
  ];

  const overview = product ? <Flex vertical gap={20}>
    <section className="admin-products__detail-section"><Typography.Title level={5}>Thông tin nhận diện</Typography.Title><Descriptions bordered size="small" column={{ xs: 1, sm: 2 }} items={[
      { key: 'code', label: 'Mã hàng', children: product.code }, { key: 'sku', label: 'SKU', children: product.sku }, { key: 'barcode', label: 'Barcode', children: product.barcode ?? '—' }, { key: 'category', label: 'Nhóm hàng', children: product.categoryName }, { key: 'brand', label: 'Thương hiệu', children: product.brand ?? '—' }, { key: 'unit', label: 'Đơn vị cơ sở', children: product.baseUnitName },
    ]} /></section>
    <section className="admin-products__detail-section"><Typography.Title level={5}>Chính sách bán và tồn kho</Typography.Title><Descriptions bordered size="small" column={{ xs: 1, sm: 2 }} items={[
      { key: 'retail', label: 'Giá bán lẻ', children: currencyFormatter.format(product.retailPrice) }, { key: 'wholesale', label: 'Giá bán sỉ', children: currencyFormatter.format(product.wholesalePrice) }, { key: 'moq', label: 'MOQ', children: `${product.moq} ${product.baseUnitName}` }, { key: 'min', label: 'Tồn tối thiểu', children: product.minStock }, { key: 'max', label: 'Tồn tối đa', children: product.maxStock ?? 'Không giới hạn' }, { key: 'safety', label: 'Tồn an toàn', children: product.safetyStock }, { key: 'reorder', label: 'Điểm đặt hàng lại', children: product.reorderPoint },
    ]} /></section>
  </Flex> : null;

  const units = <Flex vertical gap={16}><Flex justify="space-between" align="center" gap={12} wrap><div><Typography.Text type="secondary">Đơn vị cơ sở</Typography.Text><Typography.Title level={5} style={{ margin: 0 }}>{product?.baseUnitName ?? '—'}</Typography.Title></div><Button type="primary" ghost icon={<PlusOutlined />} onClick={() => { setEditingConversion(undefined); setConversionOpen(true); }}>Thêm quy đổi</Button></Flex>{conversionsLoading ? <Flex justify="center" className="admin-products__drawer-loading"><Spin /></Flex> : <Table rowKey="id" size="small" columns={conversionColumns} dataSource={conversions} pagination={false} scroll={{ x: 680 }} locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có đơn vị quy đổi" /> }} />}</Flex>;

  const purchasing = <Flex vertical gap={16}><div className="admin-products__purchase-summary"><div><Typography.Text type="secondary">Nhà cung cấp mặc định</Typography.Text><Typography.Title level={5}>{defaultSupplier?.supplierName ?? 'Chưa thiết lập'}</Typography.Title><Typography.Text type="secondary">{defaultSupplier ? `${currencyFormatter.format(defaultSupplier.lastPurchasePrice)} · ${defaultSupplier.leadTimeDays} ngày` : 'Chọn một NCC để đơn mua hàng có dữ liệu gợi ý.'}</Typography.Text></div><Button type="primary" icon={<PlusOutlined />} disabled={supplierReferences.length === 0 || suppliers.length >= supplierReferences.length} onClick={() => { setEditingSupplier(undefined); setSupplierOpen(true); }}>Thêm nhà cung cấp</Button></div>{supplierReferences.length === 0 ? <Alert showIcon type="info" message="Chưa có nhà cung cấp trong danh mục" description="Tạo nhà cung cấp trước, sau đó quay lại để khai báo giá nhập và lead time cho sản phẩm." action={<Button size="small" onClick={onOpenSuppliers}>Tạo nhà cung cấp</Button>} /> : null}{!suppliersLoading && suppliers.length > 0 && !defaultSupplier ? <Alert showIcon type="warning" message="Chưa có nhà cung cấp mặc định" description="Chỉnh sửa một nhà cung cấp bên dưới và đánh dấu làm mặc định." /> : null}{suppliersLoading ? <Flex justify="center" className="admin-products__drawer-loading"><Spin /></Flex> : <Table rowKey="id" size="small" columns={supplierColumns} dataSource={suppliers} pagination={false} scroll={{ x: 720 }} locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa khai báo thông tin mua hàng">{supplierReferences.length > 0 ? <Button type="primary" icon={<PlusOutlined />} onClick={() => setSupplierOpen(true)}>Thêm nhà cung cấp đầu tiên</Button> : null}</Empty> }} />}</Flex>;

  return <><Drawer open={open} width="min(900px, 100%)" title="Hồ sơ sản phẩm" destroyOnHidden onClose={onClose} extra={product ? <Button icon={<EditOutlined />} onClick={() => onEdit(product)}>Chỉnh sửa</Button> : null}>{product ? <Flex vertical gap={20}><header className="admin-products__profile-head"><div className="admin-products__profile-copy"><Typography.Title level={3}>{product.name}</Typography.Title><Space wrap><Typography.Text code>{product.code}</Typography.Text><Typography.Text type="secondary">SKU {product.sku}</Typography.Text><ProductStatusTag status={product.status} />{product.isActive ? <Tag color="success">Đang dùng</Tag> : <Tag>Đã tắt</Tag>}</Space></div><div className="admin-products__profile-metrics"><div><span>Giá lẻ</span><strong>{currencyFormatter.format(product.retailPrice)}</strong></div><div><span>MOQ</span><strong>{product.moq} {product.baseUnitName}</strong></div><div><span>Đặt hàng lại</span><strong>{product.reorderPoint}</strong></div></div></header><Tabs className="admin-products__detail-tabs" items={[{ key: 'overview', label: <span><SafetyCertificateOutlined /> Tổng quan</span>, children: overview }, { key: 'units', label: <span><SwapOutlined /> Đơn vị ({conversions.length})</span>, children: units }, { key: 'purchasing', label: <span><ShopOutlined /> Mua hàng ({suppliers.length})</span>, children: purchasing }]} /></Flex> : null}</Drawer>
    <Modal open={conversionOpen} title={editingConversion ? 'Sửa hệ số quy đổi' : 'Thêm đơn vị quy đổi'} okText="Lưu quy đổi" cancelText="Hủy" confirmLoading={conversionSaving} onOk={() => void submitConversion()} onCancel={closeConversion} destroyOnHidden><Form form={conversionForm} layout="vertical" preserve={false} validateTrigger="onBlur"><Form.Item name="unitId" label="Đơn vị quy đổi" rules={[{ required: true, message: 'Chọn đơn vị quy đổi.' }]}><Select showSearch optionFilterProp="label" disabled={Boolean(editingConversion)} options={references.units.filter((item) => item.value !== product?.baseUnitId && (editingConversion ? editingConversion.unitId === item.value : !item.disabled && !usedUnitIds.has(item.value)))} /></Form.Item><Form.Item name="factor" label={`Hệ số so với ${product?.baseUnitName ?? 'đơn vị cơ sở'}`} rules={[{ required: true, message: 'Nhập hệ số.' }, { type: 'number', min: Number.MIN_VALUE, message: 'Hệ số phải lớn hơn 0.' }]}><InputNumber min={0.000001} style={{ width: '100%' }} addonBefore="1 đơn vị =" addonAfter={product?.baseUnitName} /></Form.Item></Form></Modal>
    <Modal open={supplierOpen} title={editingSupplier ? 'Cập nhật thông tin mua hàng' : 'Thêm nhà cung cấp'} okText={editingSupplier ? 'Lưu thay đổi' : 'Thêm nhà cung cấp'} cancelText="Hủy" confirmLoading={supplierSaving} onOk={() => void submitSupplier()} onCancel={closeSupplier} destroyOnHidden><Form form={supplierForm} layout="vertical" preserve={false} validateTrigger="onBlur"><Form.Item name="supplierId" label="Nhà cung cấp" rules={[{ required: true, message: 'Chọn nhà cung cấp.' }]}><Select showSearch optionFilterProp="label" disabled={Boolean(editingSupplier)} placeholder="Tìm theo mã hoặc tên" options={supplierReferences.filter((item) => editingSupplier ? item.value === editingSupplier.supplierId : !usedSupplierIds.has(item.value))} /></Form.Item><Flex gap={16} wrap><Form.Item name="lastPurchasePrice" label="Giá nhập gần nhất" rules={[{ required: true, message: 'Nhập giá nhập.' }, { type: 'number', min: 0, message: 'Giá nhập không được âm.' }]} style={{ flex: '1 1 220px' }}><InputNumber min={0} step={1000} addonAfter="₫" style={{ width: '100%' }} /></Form.Item><Form.Item name="leadTimeDays" label="Lead time" rules={[{ required: true, message: 'Nhập lead time.' }, { type: 'number', min: 0, message: 'Lead time không được âm.' }]} style={{ flex: '1 1 180px' }}><InputNumber min={0} precision={0} addonAfter="ngày" style={{ width: '100%' }} /></Form.Item></Flex><Divider /><Form.Item name="isDefaultSupplier" valuePropName="checked"><Checkbox>Đặt làm nhà cung cấp mặc định của sản phẩm</Checkbox></Form.Item></Form></Modal>
  </>;
}
