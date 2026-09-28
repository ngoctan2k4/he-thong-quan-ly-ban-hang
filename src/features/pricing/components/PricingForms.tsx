import { Button, DatePicker, Drawer, Flex, Form, Input, InputNumber, Modal, Row, Col, Select, Space } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect } from 'react';
import type { PriceList } from '../../../types/catalog';
import type { PriceListFormValues, PriceTierFormValues, PriceTierView, PricingProductOption } from '../pricing.model';
import { priceListCustomerTypeLabels } from '../pricing.model';

interface PriceListEditorValues extends Omit<PriceListFormValues, 'validFrom' | 'validTo'> {
  validFrom: Dayjs;
  validTo?: Dayjs;
}

export function PriceListFormDrawer({ open, priceList, loading = false, onClose, onSubmit }: {
  open: boolean;
  priceList?: PriceList;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: PriceListFormValues) => void;
}) {
  const [form] = Form.useForm<PriceListEditorValues>();
  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(priceList ? {
      code: priceList.code,
      name: priceList.name,
      customerType: priceList.customerType,
      validFrom: dayjs(priceList.validFrom),
      validTo: priceList.validTo ? dayjs(priceList.validTo) : undefined,
      isActive: priceList.isActive,
    } : {
      code: '',
      name: '',
      customerType: 'RETAIL',
      validFrom: dayjs(),
      validTo: undefined,
      isActive: true,
    });
  }, [form, open, priceList]);
  const close = () => { form.resetFields(); onClose(); };
  return <Drawer
    open={open}
    width="min(660px, 100%)"
    title={priceList ? 'Chỉnh sửa bảng giá' : 'Thêm bảng giá'}
    destroyOnHidden
    onClose={close}
    footer={<Flex justify="flex-end"><Space><Button disabled={loading} onClick={close}>Hủy</Button><Button type="primary" htmlType="submit" form="price-list-form" loading={loading}>{priceList ? 'Lưu thay đổi' : 'Thêm bảng giá'}</Button></Space></Flex>}
  >
    <Form<PriceListEditorValues> id="price-list-form" form={form} layout="vertical" requiredMark validateTrigger="onBlur" onFinish={(values) => onSubmit({
      ...values,
      code: values.code.trim(),
      name: values.name.trim(),
      validFrom: values.validFrom.format('YYYY-MM-DD'),
      validTo: values.validTo?.format('YYYY-MM-DD'),
    })}>
      <Row gutter={16}>
        <Col xs={24} sm={10}><Form.Item name="code" label="Mã bảng giá" rules={[{ required: true, whitespace: true, message: 'Nhập mã bảng giá.' }, { pattern: /^[A-Za-z0-9_-]+$/, transform: (value: string) => value.trim(), message: 'Mã chỉ gồm chữ, số, gạch ngang hoặc gạch dưới.' }]}><Input maxLength={40} /></Form.Item></Col>
        <Col xs={24} sm={14}><Form.Item name="name" label="Tên bảng giá" rules={[{ required: true, whitespace: true, message: 'Nhập tên bảng giá.' }]}><Input maxLength={160} /></Form.Item></Col>
      </Row>
      <Form.Item name="customerType" label="Loại khách hàng" rules={[{ required: true, message: 'Chọn loại khách hàng.' }]}><Select options={Object.entries(priceListCustomerTypeLabels).map(([value, label]) => ({ value, label }))} /></Form.Item>
      <Row gutter={16}>
        <Col xs={24} sm={12}><Form.Item name="validFrom" label="Hiệu lực từ" rules={[{ required: true, message: 'Chọn ngày bắt đầu.' }]}><DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} /></Form.Item></Col>
        <Col xs={24} sm={12}><Form.Item name="validTo" label="Hiệu lực đến" dependencies={['validFrom']} rules={[({ getFieldValue }) => ({ validator: (_, value?: Dayjs) => !value || !getFieldValue('validFrom') || !value.isBefore(getFieldValue('validFrom'), 'day') ? Promise.resolve() : Promise.reject(new Error('Ngày kết thúc phải từ ngày bắt đầu trở đi.')) })]}><DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Không giới hạn" /></Form.Item></Col>
      </Row>
      <Form.Item name="isActive" label="Kích hoạt bảng giá" rules={[{ required: true, message: 'Chọn trạng thái.' }]}><Select options={[{ value: true, label: 'Kích hoạt' }, { value: false, label: 'Tắt' }]} /></Form.Item>
    </Form>
  </Drawer>;
}

export function PriceTierFormModal({ open, tier, products, loading = false, onClose, onSubmit }: {
  open: boolean;
  tier?: PriceTierView;
  products: PricingProductOption[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: PriceTierFormValues) => void;
}) {
  const [form] = Form.useForm<PriceTierFormValues>();
  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(tier ? {
      productId: tier.productId,
      minQty: tier.minQty,
      maxQty: tier.maxQty,
      unitPrice: tier.unitPrice,
    } : { productId: undefined, minQty: 1, maxQty: undefined, unitPrice: 0 });
  }, [form, open, tier]);
  const close = () => { form.resetFields(); onClose(); };
  return <Modal open={open} title={tier ? 'Sửa mức giá' : 'Thêm mức giá'} okText="Lưu" cancelText="Hủy" confirmLoading={loading} onCancel={close} onOk={() => void form.validateFields().then((values) => onSubmit({ ...values, maxQty: values.maxQty ?? undefined }))} destroyOnHidden>
    <Form<PriceTierFormValues> form={form} layout="vertical" preserve={false}>
      <Form.Item name="productId" label="Sản phẩm" rules={[{ required: true, message: 'Chọn sản phẩm.' }]}><Select showSearch optionFilterProp="label" options={products} placeholder="Mã sản phẩm - Tên sản phẩm" /></Form.Item>
      <Row gutter={16}>
        <Col xs={24} sm={12}><Form.Item name="minQty" label="Từ số lượng" rules={[{ required: true, message: 'Nhập số lượng tối thiểu.' }, { type: 'number', min: 1, message: 'Số lượng tối thiểu phải lớn hơn 0.' }]}><InputNumber min={1} precision={0} style={{ width: '100%' }} /></Form.Item></Col>
        <Col xs={24} sm={12}><Form.Item name="maxQty" label="Đến số lượng" dependencies={['minQty']} rules={[({ getFieldValue }) => ({ validator: (_, value?: number) => value === undefined || value === null || value >= Number(getFieldValue('minQty') ?? 1) ? Promise.resolve() : Promise.reject(new Error('Số lượng tối đa phải lớn hơn hoặc bằng số lượng tối thiểu.')) })]}><InputNumber min={1} precision={0} style={{ width: '100%' }} placeholder="Không giới hạn" /></Form.Item></Col>
      </Row>
      <Form.Item name="unitPrice" label="Đơn giá" rules={[{ required: true, message: 'Nhập đơn giá.' }, { type: 'number', min: 0, message: 'Đơn giá không được âm.' }]}><InputNumber min={0} precision={0} step={1000} addonAfter="₫" style={{ width: '100%' }} /></Form.Item>
    </Form>
  </Modal>;
}
