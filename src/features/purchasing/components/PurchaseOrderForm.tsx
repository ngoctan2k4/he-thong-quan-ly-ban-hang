import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  Typography,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import type {
  PurchaseOrderDetail,
  PurchaseOrderFormValues,
  PurchaseReferenceData,
} from '../purchasing.model';
import { formatVnd } from '../purchasing.utils';
import { PurchaseSourceTag } from './PurchaseTags';

interface PurchaseOrderFormFields {
  supplierId: number;
  warehouseId: number;
  orderDate: Dayjs;
  expectedDate: Dayjs;
  requiresApproval: boolean;
  note?: string;
  items: Array<{
    id?: number;
    productId?: number;
    unitId?: number;
    orderedQty?: number;
    conversionFactor?: number;
    unitPrice?: number;
  }>;
}

interface PurchaseOrderFormProps {
  order?: PurchaseOrderDetail;
  references: PurchaseReferenceData;
  submitting?: boolean;
  onSubmit: (values: PurchaseOrderFormValues) => void;
  onCancel: () => void;
}

function emptyItem() {
  return {
    orderedQty: 1,
    conversionFactor: 1,
    unitPrice: 0,
  };
}

export function PurchaseOrderForm({
  order,
  references,
  submitting = false,
  onSubmit,
  onCancel,
}: PurchaseOrderFormProps) {
  const [form] = Form.useForm<PurchaseOrderFormFields>();
  const watchedItems = Form.useWatch('items', form) ?? [];

  useEffect(() => {
    form.setFieldsValue({
      supplierId: order?.supplierId,
      warehouseId: order?.warehouseId,
      orderDate: order ? dayjs(order.orderDate) : dayjs(),
      expectedDate: order ? dayjs(order.expectedDate) : dayjs().add(7, 'day'),
      requiresApproval: order?.requiresApproval ?? false,
      note: order?.note ?? undefined,
      items: order?.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        unitId: item.unitId,
        orderedQty: item.orderedQty,
        conversionFactor: item.conversionFactor,
        unitPrice: item.unitPrice,
      })) ?? [emptyItem()],
    });
  }, [form, order]);

  const totalAmount = watchedItems.reduce(
    (sum, item) => sum + (item?.orderedQty ?? 0) * (item?.unitPrice ?? 0),
    0,
  );

  const submitValues = (values: PurchaseOrderFormFields) => {
    onSubmit({
      supplierId: values.supplierId,
      warehouseId: values.warehouseId,
      orderDate: values.orderDate.startOf('day').format(),
      expectedDate: values.expectedDate.startOf('day').format(),
      requiresApproval: values.requiresApproval,
      note: values.note,
      items: values.items.map((item) => ({
        id: item.id,
        productId: item.productId as number,
        unitId: item.unitId as number,
        orderedQty: item.orderedQty as number,
        conversionFactor: item.conversionFactor as number,
        unitPrice: item.unitPrice as number,
      })),
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className="purchasing-form"
      onFinish={submitValues}
    >
      <Card
        size="small"
        title="Thông tin chung"
        extra={(
          <Flex align="center" gap={8}>
            <Typography.Text type="secondary">Nguồn tạo</Typography.Text>
            <PurchaseSourceTag source={order?.sourceType ?? 'MANUAL'} />
          </Flex>
        )}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12} xl={6}>
            <Form.Item
              name="supplierId"
              label="Nhà cung cấp"
              rules={[{ required: true, message: 'Chọn nhà cung cấp.' }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Chọn nhà cung cấp"
                options={references.suppliers}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={6}>
            <Form.Item
              name="warehouseId"
              label="Kho nhận"
              rules={[{ required: true, message: 'Chọn kho nhận.' }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Chọn kho nhận"
                options={references.warehouses}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} xl={4}>
            <Form.Item
              name="orderDate"
              label="Ngày đặt"
              rules={[{ required: true, message: 'Chọn ngày đặt.' }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} xl={4}>
            <Form.Item
              name="expectedDate"
              label="Ngày dự kiến nhận"
              dependencies={['orderDate']}
              rules={[
                { required: true, message: 'Chọn ngày dự kiến nhận.' },
                ({ getFieldValue }) => ({
                  validator(_, value: Dayjs | undefined) {
                    const orderDate = getFieldValue('orderDate') as Dayjs | undefined;
                    if (!value || !orderDate || !value.isBefore(orderDate, 'day')) return Promise.resolve();
                    return Promise.reject(new Error('Ngày dự kiến không được trước ngày đặt.'));
                  },
                }),
              ]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} xl={4}>
            <Form.Item name="requiresApproval" label="Yêu cầu phê duyệt" valuePropName="checked">
              <Switch checkedChildren="Có" unCheckedChildren="Không" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="note" label="Ghi chú">
              <Input.TextArea rows={2} maxLength={500} showCount placeholder="Ghi chú cho đơn mua" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card
        size="small"
        title="Danh sách sản phẩm"
        extra={<Typography.Text strong>Tổng tiền: {formatVnd(totalAmount)}</Typography.Text>}
      >
        <Form.List
          name="items"
          rules={[
            {
              validator: async (_, items) => {
                if (!items?.length) throw new Error('Đơn mua phải có ít nhất một sản phẩm.');
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <Flex vertical gap={12}>
              {fields.map((field, index) => {
                const item = watchedItems[field.name] ?? {};
                const product = references.products.find((record) => record.id === item.productId);
                const baseOrderedQty = (item.orderedQty ?? 0) * (item.conversionFactor ?? 0);
                const lineTotal = (item.orderedQty ?? 0) * (item.unitPrice ?? 0);
                return (
                  <div className="purchasing-form__item" key={field.key}>
                    <Form.Item {...field} name={[field.name, 'id']} hidden><Input /></Form.Item>
                    <div className="purchasing-form__item-number">{index + 1}</div>
                    <Row gutter={[12, 0]} align="top">
                      <Col xs={24} lg={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'productId']}
                          label="Sản phẩm"
                          rules={[
                            { required: true, message: 'Chọn sản phẩm.' },
                            {
                              validator: async (_, value) => {
                                const duplicates = (form.getFieldValue('items') ?? [])
                                  .filter((record: PurchaseOrderFormFields['items'][number]) => (
                                    record.productId === value
                                  )).length;
                                if (value && duplicates > 1) throw new Error('Sản phẩm đã có trong đơn.');
                              },
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            optionFilterProp="label"
                            placeholder="Chọn sản phẩm"
                            options={references.products.map((record) => ({
                              value: record.id,
                              label: `${record.code} · ${record.name}`,
                            }))}
                            onChange={(productId) => {
                              const nextProduct = references.products.find((record) => record.id === productId);
                              const defaultUnit = nextProduct?.units.find((unit) => unit.id === nextProduct.defaultUnitId);
                              form.setFieldValue(['items', field.name, 'unitId'], defaultUnit?.id);
                              form.setFieldValue(['items', field.name, 'conversionFactor'], defaultUnit?.conversionFactor ?? 1);
                              form.setFieldValue(['items', field.name, 'unitPrice'], nextProduct?.suggestedUnitCost ?? 0);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} lg={4}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'unitId']}
                          label="Đơn vị tính"
                          rules={[{ required: true, message: 'Chọn đơn vị.' }]}
                        >
                          <Select
                            placeholder="Đơn vị"
                            disabled={!product}
                            options={product?.units.map((unit) => ({ value: unit.id, label: unit.name }))}
                            onChange={(unitId) => {
                              const unit = product?.units.find((record) => record.id === unitId);
                              form.setFieldValue(['items', field.name, 'conversionFactor'], unit?.conversionFactor ?? 1);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={12} sm={6} lg={3}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'orderedQty']}
                          label="Số lượng đặt"
                          rules={[{ required: true, message: 'Nhập số lượng.' }]}
                        >
                          <InputNumber min={0.01} precision={2} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col xs={12} sm={6} lg={3}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'conversionFactor']}
                          label="Hệ số quy đổi"
                        >
                          <InputNumber disabled min={0.01} precision={2} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col xs={12} sm={8} lg={3}>
                        <Form.Item label="SL cơ sở">
                          <InputNumber disabled value={baseOrderedQty} precision={2} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col xs={12} sm={8} lg={4}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'unitPrice']}
                          label="Đơn giá"
                          rules={[{ required: true, message: 'Nhập đơn giá.' }]}
                        >
                          <InputNumber min={0} precision={0} addonAfter="₫" style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col xs={20} sm={8} lg={4}>
                        <Form.Item label="Thành tiền">
                          <Input value={formatVnd(lineTotal)} disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={4} lg={1}>
                        <Form.Item label=" ">
                          <Button
                            danger
                            type="text"
                            aria-label={`Xóa dòng sản phẩm ${index + 1}`}
                            icon={<DeleteOutlined />}
                            disabled={fields.length === 1}
                            onClick={() => remove(field.name)}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                );
              })}
              <Form.ErrorList errors={errors} />
              <Button type="dashed" icon={<PlusOutlined />} onClick={() => add(emptyItem())}>
                Thêm dòng sản phẩm
              </Button>
            </Flex>
          )}
        </Form.List>
      </Card>

      <Divider className="purchasing-form__divider" />
      <Flex justify="space-between" align="center" gap={12} wrap className="purchasing-form__actions">
        <Typography.Text type="secondary">
          Đơn do Admin tạo luôn có nguồn “Thủ công”. Hệ thống không cập nhật tồn kho từ PO.
        </Typography.Text>
        <Flex gap={8}>
          <Button disabled={submitting} onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {order ? 'Lưu thay đổi' : 'Tạo đơn mua'}
          </Button>
        </Flex>
      </Flex>
    </Form>
  );
}
