import { Button, Col, Drawer, Flex, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { useEffect } from 'react';
import type { Supplier } from '../../../types/supplier';
import type { SupplierFormMode, SupplierFormValues } from '../suppliers.model';

const defaultValues: SupplierFormValues = {
  code: '',
  name: '',
  avgLeadTimeDays: 0,
  maxLeadTimeDays: 0,
  isActive: true,
};

interface SupplierFormDrawerProps {
  open: boolean;
  mode: SupplierFormMode;
  supplier?: Supplier;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: SupplierFormValues) => void;
}

export function SupplierFormDrawer({
  open,
  mode,
  supplier,
  loading = false,
  onClose,
  onSubmit,
}: SupplierFormDrawerProps) {
  const [form] = Form.useForm<SupplierFormValues>();

  useEffect(() => {
    if (!open) {
      return;
    }
    if (mode === 'edit' && supplier) {
      form.setFieldsValue({
        code: supplier.code,
        name: supplier.name,
        taxCode: supplier.taxCode,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
        avgLeadTimeDays: supplier.avgLeadTimeDays,
        maxLeadTimeDays: supplier.maxLeadTimeDays,
        isActive: supplier.isActive,
      });
      return;
    }
    form.setFieldsValue(defaultValues);
  }, [form, mode, open, supplier]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      open={open}
      width="min(660px, 100%)"
      title={mode === 'create' ? 'Thêm nhà cung cấp' : 'Chỉnh sửa nhà cung cấp'}
      destroyOnHidden
      onClose={handleClose}
      footer={
        <Flex justify="flex-end">
          <Space>
            <Button disabled={loading} onClick={handleClose}>Hủy</Button>
            <Button type="primary" htmlType="submit" form="admin-supplier-form" loading={loading}>
              {mode === 'create' ? 'Thêm nhà cung cấp' : 'Lưu thay đổi'}
            </Button>
          </Space>
        </Flex>
      }
    >
      <Form<SupplierFormValues>
        id="admin-supplier-form"
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
              label="Mã NCC"
              rules={[
                { required: true, whitespace: true, message: 'Nhập mã nhà cung cấp.' },
                { pattern: /^[A-Za-z0-9_-]+$/, message: 'Mã chỉ gồm chữ, số, dấu gạch ngang hoặc gạch dưới.' },
              ]}
            >
              <Input maxLength={24} placeholder="Ví dụ: NCC0009" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={14}>
            <Form.Item name="name" label="Tên nhà cung cấp" rules={[{ required: true, whitespace: true, message: 'Nhập tên nhà cung cấp.' }]}>
              <Input maxLength={160} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="taxCode"
              label="Mã số thuế"
              rules={[{ pattern: /^\d{10}(?:-\d{3})?$/, message: 'Mã số thuế gồm 10 chữ số hoặc dạng 10 chữ số-3 chữ số.' }]}
            >
              <Input maxLength={14} placeholder="Ví dụ: 0312345678" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="phone"
              label="Điện thoại"
              rules={[{ pattern: /^(?:\+?84|0)[0-9\s.-]{8,14}$/, message: 'Nhập số điện thoại Việt Nam hợp lệ.' }]}
            >
              <Input maxLength={18} placeholder="Ví dụ: 02838112233" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Nhập đúng định dạng email.' }]}>
          <Input maxLength={160} placeholder="sales@example.com" />
        </Form.Item>
        <Form.Item name="address" label="Địa chỉ">
          <Input.TextArea rows={3} maxLength={300} placeholder="Địa chỉ trụ sở hoặc kho giao nhận" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="avgLeadTimeDays"
              label="Lead time trung bình (ngày)"
              rules={[
                { required: true, message: 'Nhập lead time trung bình.' },
                { type: 'number', min: 0, message: 'Lead time trung bình phải lớn hơn hoặc bằng 0.' },
              ]}
            >
              <InputNumber min={0} precision={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="maxLeadTimeDays"
              label="Lead time tối đa (ngày)"
              dependencies={['avgLeadTimeDays']}
              rules={[
                { required: true, message: 'Nhập lead time tối đa.' },
                ({ getFieldValue }) => ({
                  validator: (_, value?: number) => {
                    if (value === undefined || value < 0) {
                      return Promise.reject(new Error('Lead time tối đa phải lớn hơn hoặc bằng 0.'));
                    }
                    if (value < Number(getFieldValue('avgLeadTimeDays') ?? 0)) {
                      return Promise.reject(new Error('Lead time tối đa không được nhỏ hơn lead time trung bình.'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputNumber min={0} precision={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="isActive" label="Trạng thái" rules={[{ required: true, message: 'Chọn trạng thái.' }]}>
          <Select options={[
            { value: true, label: 'Hoạt động' },
            { value: false, label: 'Ngừng hoạt động' },
          ]} />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
