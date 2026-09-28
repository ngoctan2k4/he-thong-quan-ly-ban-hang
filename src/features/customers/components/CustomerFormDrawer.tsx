import { Button, Col, Drawer, Flex, Form, Input, Row, Select, Space } from 'antd';
import { useEffect } from 'react';
import type {
  AdminCustomerRecord,
  CustomerFormMode,
  CustomerFormValues,
  PriceListOption,
} from '../customers.model';

const defaultValues: CustomerFormValues = {
  code: '',
  name: '',
  customerType: 'RETAIL',
  isCompany: false,
  isActive: true,
};

interface CustomerFormDrawerProps {
  open: boolean;
  mode: CustomerFormMode;
  customer?: AdminCustomerRecord;
  priceLists: PriceListOption[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: CustomerFormValues) => void;
}

export function CustomerFormDrawer({
  open,
  mode,
  customer,
  priceLists,
  loading = false,
  onClose,
  onSubmit,
}: CustomerFormDrawerProps) {
  const [form] = Form.useForm<CustomerFormValues>();
  const isCompany = Form.useWatch('isCompany', form);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (mode === 'edit' && customer) {
      form.setFieldsValue({
        code: customer.code,
        name: customer.name,
        customerType: customer.customerType,
        isCompany: customer.isCompany,
        taxCode: customer.taxCode,
        phone: customer.phone,
        email: customer.email,
        priceListId: customer.priceListId,
        isActive: customer.isActive,
      });
      return;
    }
    form.setFieldsValue(defaultValues);
  }, [customer, form, mode, open]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      open={open}
      width="min(640px, 100%)"
      title={mode === 'create' ? 'Thêm khách hàng' : 'Chỉnh sửa khách hàng'}
      destroyOnHidden
      onClose={handleClose}
      footer={
        <Flex justify="flex-end">
          <Space>
            <Button disabled={loading} onClick={handleClose}>Hủy</Button>
            <Button type="primary" htmlType="submit" form="admin-customer-form" loading={loading}>
              {mode === 'create' ? 'Thêm khách hàng' : 'Lưu thay đổi'}
            </Button>
          </Space>
        </Flex>
      }
    >
      <Form<CustomerFormValues>
        id="admin-customer-form"
        form={form}
        layout="vertical"
        requiredMark
        initialValues={defaultValues}
        validateTrigger="onBlur"
        onFinish={onSubmit}
      >
        <Row gutter={16}>
          <Col xs={24} sm={10}>
            <Form.Item
              name="code"
              label="Mã khách hàng"
              rules={[
                { required: true, whitespace: true, message: 'Nhập mã khách hàng.' },
                { pattern: /^[A-Za-z0-9_-]+$/, message: 'Mã chỉ gồm chữ, số, dấu gạch ngang hoặc gạch dưới.' },
              ]}
            >
              <Input maxLength={24} placeholder="Ví dụ: KH0013" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={14}>
            <Form.Item name="name" label="Tên khách hàng" rules={[{ required: true, whitespace: true, message: 'Nhập tên khách hàng.' }]}>
              <Input maxLength={160} placeholder="Họ tên hoặc tên doanh nghiệp" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="customerType" label="Loại khách hàng" rules={[{ required: true, message: 'Chọn loại khách hàng.' }]}>
              <Select options={[
                { value: 'RETAIL', label: 'Bán lẻ' },
                { value: 'WHOLESALE', label: 'Bán sỉ' },
                { value: 'VIP', label: 'VIP' },
              ]} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="isCompany" label="Loại đối tượng" rules={[{ required: true, message: 'Chọn loại đối tượng.' }]}>
              <Select options={[
                { value: false, label: 'Cá nhân' },
                { value: true, label: 'Doanh nghiệp' },
              ]} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="taxCode"
          label={isCompany ? 'Mã số thuế doanh nghiệp' : 'Mã số thuế'}
          dependencies={['isCompany']}
          rules={[
            ({ getFieldValue }) => ({
              validator: (_, value?: string) => {
                if (getFieldValue('isCompany') && !value?.trim()) {
                  return Promise.reject(new Error('Nhập mã số thuế cho khách hàng doanh nghiệp.'));
                }
                if (value?.trim() && !/^\d{10}(?:-\d{3})?$/.test(value.trim())) {
                  return Promise.reject(new Error('Mã số thuế gồm 10 chữ số hoặc dạng 10 chữ số-3 chữ số.'));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input maxLength={14} placeholder="Ví dụ: 0312345678" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ pattern: /^(?:\+?84|0)[0-9\s.-]{8,14}$/, message: 'Nhập số điện thoại Việt Nam hợp lệ.' }]}
            >
              <Input maxLength={18} placeholder="Ví dụ: 0901234567" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Nhập đúng định dạng email.' }]}>
              <Input maxLength={160} placeholder="name@example.com" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="priceListId" label="Bảng giá áp dụng">
              <Select allowClear showSearch optionFilterProp="label" placeholder="Chọn bảng giá" options={priceLists} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="isActive" label="Trạng thái" rules={[{ required: true, message: 'Chọn trạng thái.' }]}>
              <Select options={[
                { value: true, label: 'Hoạt động' },
                { value: false, label: 'Ngừng hoạt động' },
              ]} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
}
