import {
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Descriptions,
  Drawer,
  Empty,
  Flex,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  Switch,
  Tabs,
  Tag,
  theme,
  Typography,
} from 'antd';
import { useState } from 'react';
import { ErrorState } from '../../../components/common/ErrorState';
import type { CustomerAddress } from '../../../types/customer';
import type {
  AdminCustomerDetail,
  CustomerAddressFormValues,
} from '../customers.model';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const customerTypeLabels = {
  RETAIL: 'Bán lẻ',
  WHOLESALE: 'Bán sỉ',
  VIP: 'VIP',
} as const;

interface CustomerDetailDrawerProps {
  open: boolean;
  customer?: AdminCustomerDetail;
  loading?: boolean;
  error?: Error | null;
  addressSaving?: boolean;
  addressUpdating?: boolean;
  onClose: () => void;
  onRetry: () => void;
  onEdit: (customer: AdminCustomerDetail) => void;
  onSaveAddress: (values: CustomerAddressFormValues, addressId?: number) => Promise<boolean>;
  onSetDefaultAddress: (addressId: number) => Promise<boolean>;
  onRemoveAddress: (addressId: number) => Promise<boolean>;
}

export function CustomerDetailDrawer({
  open,
  customer,
  loading = false,
  error,
  addressSaving = false,
  addressUpdating = false,
  onClose,
  onRetry,
  onEdit,
  onSaveAddress,
  onSetDefaultAddress,
  onRemoveAddress,
}: CustomerDetailDrawerProps) {
  const { token } = theme.useToken();
  const [addressForm] = Form.useForm<CustomerAddressFormValues>();
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress>();

  const openAddressModal = (address?: CustomerAddress) => {
    setEditingAddress(address);
    addressForm.setFieldsValue(address ? {
      receiverName: address.receiverName,
      phone: address.phone,
      addressLine: address.addressLine,
      ward: address.ward,
      district: address.district,
      province: address.province,
      isDefault: address.isDefault,
    } : { isDefault: (customer?.addresses.length ?? 0) === 0 });
    setAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setAddressModalOpen(false);
    setEditingAddress(undefined);
    addressForm.resetFields();
  };

  const submitAddress = async () => {
    try {
      const values = await addressForm.validateFields();
      const saved = await onSaveAddress(values, editingAddress?.id);
      if (saved) {
        closeAddressModal();
      }
    } catch (error) {
      if (!(typeof error === 'object' && error && 'errorFields' in error)) {
        throw error;
      }
    }
  };

  const generalTab = customer ? (
    <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
      <Descriptions.Item label="Mã khách hàng">{customer.code}</Descriptions.Item>
      <Descriptions.Item label="Tên khách hàng">{customer.name}</Descriptions.Item>
      <Descriptions.Item label="Loại khách hàng">
        <Tag color={customer.customerType === 'VIP' ? 'purple' : customer.customerType === 'WHOLESALE' ? 'gold' : 'blue'}>
          {customerTypeLabels[customer.customerType]}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Loại đối tượng">{customer.isCompany ? 'Doanh nghiệp' : 'Cá nhân'}</Descriptions.Item>
      <Descriptions.Item label="Mã số thuế">{customer.taxCode ?? '—'}</Descriptions.Item>
      <Descriptions.Item label="Điện thoại">{customer.phone ?? '—'}</Descriptions.Item>
      <Descriptions.Item label="Email">{customer.email ?? '—'}</Descriptions.Item>
      <Descriptions.Item label="Bảng giá áp dụng">{customer.priceListName ?? '—'}</Descriptions.Item>
      <Descriptions.Item label="Trạng thái">
        <Tag color={customer.isActive ? 'success' : 'default'}>
          {customer.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Ngày tạo">{dateTimeFormatter.format(new Date(customer.createdAt))}</Descriptions.Item>
    </Descriptions>
  ) : null;

  const addressesTab = customer ? (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center" gap={12} wrap>
        <Typography.Text type="secondary">{customer.addresses.length} địa chỉ đã lưu</Typography.Text>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openAddressModal()}>
          Thêm địa chỉ
        </Button>
      </Flex>
      <List
        dataSource={customer.addresses}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Khách hàng chưa có địa chỉ." /> }}
        renderItem={(address) => (
          <List.Item className="admin-customers__address-item">
            <Flex vertical gap={8} className="admin-customers__address-copy">
              <Flex align="center" gap={8} wrap>
                <EnvironmentOutlined />
                <Typography.Text strong>{address.receiverName}</Typography.Text>
                {address.isDefault ? <Tag color="blue">Mặc định</Tag> : null}
              </Flex>
              <Typography.Text>{address.phone}</Typography.Text>
              <Typography.Text type="secondary">
                {[address.addressLine, address.ward, address.district, address.province].filter(Boolean).join(', ')}
              </Typography.Text>
              <Space size={4} wrap className="admin-customers__address-actions">
                <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openAddressModal(address)}>Sửa</Button>
                {!address.isDefault ? (
                  <Button
                    type="link"
                    size="small"
                    loading={addressUpdating}
                    onClick={() => void onSetDefaultAddress(address.id)}
                  >
                    Đặt làm mặc định
                  </Button>
                ) : null}
                <Popconfirm
                  title="Xóa địa chỉ này?"
                  description="Địa chỉ sẽ bị gỡ khỏi hồ sơ khách hàng."
                  okText="Xóa địa chỉ"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true, loading: addressUpdating }}
                  onConfirm={() => void onRemoveAddress(address.id)}
                >
                  <Button type="link" size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
                </Popconfirm>
              </Space>
            </Flex>
          </List.Item>
        )}
      />
    </Flex>
  ) : null;

  const creditAccount = customer?.creditAccount;
  const remainingCredit = creditAccount ? creditAccount.creditLimit - creditAccount.currentBalance : 0;
  const usedPercent = creditAccount?.creditLimit
    ? Math.round((creditAccount.currentBalance / creditAccount.creditLimit) * 100)
    : 0;
  const creditTab = creditAccount ? (
    <Flex vertical gap={20}>
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={8}>
          <Statistic title="Hạn mức tín dụng" value={creditAccount.creditLimit} formatter={(value) => currencyFormatter.format(Number(value))} />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic title="Công nợ hiện tại" value={creditAccount.currentBalance} formatter={(value) => currencyFormatter.format(Number(value))} />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic
            title="Hạn mức còn lại"
            value={remainingCredit}
            valueStyle={remainingCredit < 0 ? { color: token.colorError } : undefined}
            formatter={(value) => currencyFormatter.format(Number(value))}
          />
        </Col>
      </Row>
      <section aria-label="Mức sử dụng hạn mức công nợ">
        <Flex justify="space-between" gap={12} wrap>
          <Typography.Text strong>Mức sử dụng hạn mức</Typography.Text>
          <Typography.Text type={usedPercent > 100 ? 'danger' : 'secondary'}>{usedPercent}%</Typography.Text>
        </Flex>
        <Progress
          percent={Math.min(100, Math.max(0, usedPercent))}
          status={usedPercent > 100 ? 'exception' : usedPercent >= 80 ? 'active' : 'normal'}
          showInfo={false}
        />
        <Typography.Text type="secondary">
          Cập nhật gần nhất: {dateTimeFormatter.format(new Date(creditAccount.updatedAt))}
        </Typography.Text>
      </section>
    </Flex>
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={customer?.customerType === 'RETAIL'
        ? 'Khách hàng bán lẻ chưa có tài khoản công nợ.'
        : 'Chưa thiết lập tài khoản công nợ cho khách hàng này.'}
    />
  );

  return (
    <>
      <Drawer
        open={open}
        width="min(880px, 100%)"
        title="Chi tiết khách hàng"
        destroyOnHidden
        onClose={onClose}
        extra={customer ? <Button icon={<EditOutlined />} onClick={() => onEdit(customer)}>Chỉnh sửa</Button> : null}
      >
        {loading ? <Skeleton active paragraph={{ rows: 10 }} /> : null}
        {!loading && error ? <ErrorState message={error.message} onRetry={onRetry} /> : null}
        {!loading && !error && customer ? (
          <Tabs
            defaultActiveKey="general"
            items={[
              { key: 'general', label: 'Thông tin chung', children: generalTab },
              { key: 'addresses', label: 'Địa chỉ', children: addressesTab },
              { key: 'credit', label: 'Công nợ', children: creditTab },
            ]}
          />
        ) : null}
      </Drawer>

      <Modal
        open={addressModalOpen}
        title={editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ'}
        okText={editingAddress ? 'Lưu thay đổi' : 'Thêm địa chỉ'}
        cancelText="Hủy"
        confirmLoading={addressSaving}
        destroyOnHidden
        onOk={() => void submitAddress()}
        onCancel={closeAddressModal}
      >
        <Form<CustomerAddressFormValues>
          form={addressForm}
          layout="vertical"
          validateTrigger="onBlur"
          initialValues={{ isDefault: false }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="receiverName" label="Người nhận" rules={[{ required: true, whitespace: true, message: 'Nhập tên người nhận.' }]}>
                <Input maxLength={120} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, whitespace: true, message: 'Nhập số điện thoại người nhận.' },
                  { pattern: /^(?:\+?84|0)[0-9\s.-]{8,14}$/, message: 'Nhập số điện thoại Việt Nam hợp lệ.' },
                ]}
              >
                <Input maxLength={18} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="addressLine" label="Địa chỉ" rules={[{ required: true, whitespace: true, message: 'Nhập số nhà, tên đường.' }]}>
            <Input maxLength={200} placeholder="Số nhà, tên đường" />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} sm={12}><Form.Item name="ward" label="Phường / xã"><Input maxLength={100} /></Form.Item></Col>
            <Col xs={24} sm={12}><Form.Item name="district" label="Quận / huyện"><Input maxLength={100} /></Form.Item></Col>
          </Row>
          <Form.Item name="province" label="Tỉnh / thành" rules={[{ required: true, whitespace: true, message: 'Nhập tỉnh hoặc thành phố.' }]}>
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item name="isDefault" label="Địa chỉ mặc định" valuePropName="checked">
            <Switch checkedChildren="Mặc định" unCheckedChildren="Địa chỉ phụ" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
