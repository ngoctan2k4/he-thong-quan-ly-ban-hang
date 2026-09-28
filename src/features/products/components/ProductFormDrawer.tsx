import { Alert, Button, Checkbox, Col, Divider, Drawer, Flex, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { useEffect } from 'react';
import type { AdminProductRecord, ProductFormMode, ProductFormValues, ProductReferences } from '../adminProducts.model';

interface ProductFormDrawerProps {
  open: boolean;
  mode: ProductFormMode;
  product?: AdminProductRecord;
  references: ProductReferences;
  hasConversions?: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => Promise<void>;
}

interface ProductDrawerFormValues extends ProductFormValues {
  confirmBaseUnitChange?: boolean;
}

const defaultValues: ProductFormValues = {
  code: '', sku: '', barcode: '', name: '', categoryId: 0, brand: '', baseUnitId: 0,
  retailPrice: 0, wholesalePrice: 0, moq: 1, minStock: 0, maxStock: undefined,
  safetyStock: 0, reorderPoint: 0, status: 'ACTIVE', isActive: true,
};

export function ProductFormDrawer({ open, mode, product, references, hasConversions = false, loading = false, onClose, onSubmit }: ProductFormDrawerProps) {
  const [form] = Form.useForm<ProductDrawerFormValues>();
  const selectedBaseUnitId = Form.useWatch('baseUnitId', form);
  const baseUnitChanged = mode === 'edit' && product !== undefined && selectedBaseUnitId !== undefined && selectedBaseUnitId !== product.baseUnitId;
  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(product ? {
      code: product.code, sku: product.sku, barcode: product.barcode, name: product.name,
      categoryId: product.categoryId, brand: product.brand, baseUnitId: product.baseUnitId,
      retailPrice: product.retailPrice, wholesalePrice: product.wholesalePrice, moq: product.moq,
      minStock: product.minStock, maxStock: product.maxStock, safetyStock: product.safetyStock,
      reorderPoint: product.reorderPoint, status: product.status, isActive: product.isActive,
      confirmBaseUnitChange: false,
    } : { ...defaultValues, categoryId: references.categories.find((item) => !item.disabled)?.value ?? 0, baseUnitId: references.units.find((item) => !item.disabled)?.value ?? 0, confirmBaseUnitChange: false });
  }, [form, open, product, references]);
  const close = () => { form.resetFields(); onClose(); };
  return <Drawer open={open} width="min(760px, 100%)" title={mode === 'create' ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'} destroyOnHidden onClose={close} footer={<Flex justify="flex-end"><Space><Button disabled={loading} onClick={close}>Hủy</Button><Button type="primary" htmlType="submit" form="admin-product-form" loading={loading}>{mode === 'create' ? 'Thêm sản phẩm' : 'Lưu thay đổi'}</Button></Space></Flex>}>
    <Form<ProductDrawerFormValues> id="admin-product-form" form={form} layout="vertical" requiredMark validateTrigger="onBlur" onFinish={({ confirmBaseUnitChange: _confirmation, ...values }) => onSubmit(values)}>
      <Divider orientation="left">Thông tin cơ bản</Divider>
      <Row gutter={16}>
        <Col xs={24} sm={8}><Form.Item name="code" label="Mã hàng" rules={[{ required: true, whitespace: true, message: 'Nhập mã hàng.' }, { pattern: /^[A-Za-z0-9_-]+$/, message: 'Mã hàng không hợp lệ.' }]}><Input maxLength={32} /></Form.Item></Col>
        <Col xs={24} sm={8}><Form.Item name="sku" label="SKU" rules={[{ required: true, whitespace: true, message: 'Nhập SKU.' }]}><Input maxLength={50} /></Form.Item></Col>
        <Col xs={24} sm={8}><Form.Item name="barcode" label="Barcode"><Input maxLength={64} /></Form.Item></Col>
      </Row>
      <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, whitespace: true, message: 'Nhập tên sản phẩm.' }]}><Input maxLength={200} /></Form.Item>
      <Row gutter={16}>
        <Col xs={24} sm={8}><Form.Item name="categoryId" label="Nhóm hàng" rules={[{ required: true, message: 'Chọn nhóm hàng.' }]}><Select showSearch optionFilterProp="label" options={references.categories} /></Form.Item></Col>
        <Col xs={24} sm={8}><Form.Item name="brand" label="Thương hiệu"><Input maxLength={100} /></Form.Item></Col>
        <Col xs={24} sm={8}><Form.Item name="baseUnitId" label="Đơn vị cơ sở" rules={[{ required: true, message: 'Chọn đơn vị cơ sở.' }]}><Select showSearch optionFilterProp="label" options={references.units} onChange={() => form.setFieldValue('confirmBaseUnitChange', false)} /></Form.Item></Col>
      </Row>
      {baseUnitChanged && hasConversions ? <Alert showIcon type="warning" message="Đơn vị cơ sở đang được thay đổi" description="Sản phẩm đã có quy đổi. Các hệ số hiện tại sẽ giữ nguyên nhưng có thể không còn đúng ý nghĩa; hãy xác nhận và rà soát lại toàn bộ quy đổi sau khi lưu." style={{ marginBottom: 16 }} /> : null}
      {baseUnitChanged && hasConversions ? <Form.Item name="confirmBaseUnitChange" valuePropName="checked" rules={[{ validator: (_, checked?: boolean) => checked ? Promise.resolve() : Promise.reject(new Error('Xác nhận đã hiểu và sẽ rà soát lại quy đổi.')) }]}><Checkbox>Tôi xác nhận sẽ rà soát lại các hệ số quy đổi</Checkbox></Form.Item> : null}
      <Divider orientation="left">Giá</Divider>
      <Row gutter={16}>
        <Col xs={24} sm={8}><Form.Item name="retailPrice" label="Giá bán lẻ" rules={[{ required: true, message: 'Nhập giá bán lẻ.' }, { type: 'number', min: 0, message: 'Giá bán lẻ phải lớn hơn hoặc bằng 0.' }]}><InputNumber min={0} step={1000} addonAfter="₫" style={{ width: '100%' }} /></Form.Item></Col>
        <Col xs={24} sm={8}><Form.Item name="wholesalePrice" label="Giá bán sỉ" rules={[{ required: true, message: 'Nhập giá bán sỉ.' }, { type: 'number', min: 0, message: 'Giá bán sỉ phải lớn hơn hoặc bằng 0.' }]}><InputNumber min={0} step={1000} addonAfter="₫" style={{ width: '100%' }} /></Form.Item></Col>
        <Col xs={24} sm={8}><Form.Item name="moq" label="MOQ" rules={[{ required: true, message: 'Nhập MOQ.' }, { type: 'number', min: 1, message: 'MOQ phải lớn hơn 0.' }]}><InputNumber min={1} precision={0} style={{ width: '100%' }} /></Form.Item></Col>
      </Row>
      <Divider orientation="left">Quản lý tồn</Divider>
      <Row gutter={16}>
        <Col xs={24} sm={12}><Form.Item name="minStock" label="Tồn tối thiểu" rules={[{ required: true, message: 'Nhập tồn tối thiểu.' }, { type: 'number', min: 0, message: 'Tồn tối thiểu không được âm.' }]}><InputNumber min={0} precision={0} style={{ width: '100%' }} /></Form.Item></Col>
        <Col xs={24} sm={12}><Form.Item name="maxStock" label="Tồn tối đa" dependencies={['minStock']} rules={[({ getFieldValue }) => ({ validator: (_, value?: number) => value === undefined || value === null || value >= Number(getFieldValue('minStock') ?? 0) ? Promise.resolve() : Promise.reject(new Error('Tồn tối đa phải lớn hơn hoặc bằng tồn tối thiểu.')) })]}><InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="Không giới hạn" /></Form.Item></Col>
        <Col xs={24} sm={12}><Form.Item name="safetyStock" label="Tồn an toàn" rules={[{ required: true, message: 'Nhập tồn an toàn.' }, { type: 'number', min: 0, message: 'Tồn an toàn không được âm.' }]}><InputNumber min={0} precision={0} style={{ width: '100%' }} /></Form.Item></Col>
        <Col xs={24} sm={12}><Form.Item name="reorderPoint" label="Điểm đặt hàng lại" rules={[{ required: true, message: 'Nhập điểm đặt hàng lại.' }, { type: 'number', min: 0, message: 'Điểm đặt hàng lại không được âm.' }]}><InputNumber min={0} precision={0} style={{ width: '100%' }} /></Form.Item></Col>
      </Row>
      <Divider orientation="left">Trạng thái</Divider>
      <Row gutter={16}><Col xs={24} sm={12}><Form.Item name="status" label="Trạng thái kinh doanh" rules={[{ required: true, message: 'Chọn trạng thái.' }]}><Select options={[{ value: 'ACTIVE', label: 'Đang kinh doanh' }, { value: 'DISCONTINUED', label: 'Ngừng kinh doanh' }, { value: 'HIDDEN', label: 'Đang ẩn' }]} /></Form.Item></Col><Col xs={24} sm={12}><Form.Item name="isActive" label="Kích hoạt bản ghi" rules={[{ required: true, message: 'Chọn trạng thái kích hoạt.' }]}><Select options={[{ value: true, label: 'Kích hoạt' }, { value: false, label: 'Tắt' }]} /></Form.Item></Col></Row>
    </Form>
  </Drawer>;
}
