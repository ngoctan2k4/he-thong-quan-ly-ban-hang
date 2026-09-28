import { DeleteOutlined, PlusOutlined, WarningOutlined } from '@ant-design/icons';
import {
  Alert,
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
  Typography,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';
import type {
  GoodsReceiptFormValues,
  PurchaseOrderDetail,
  PurchaseReferenceData,
} from '../purchasing.model';
import { discrepancyConfig, formatQuantity, formatVnd, remainingQuantity } from '../purchasing.utils';

interface GoodsReceiptFormFields {
  purchaseOrderId?: number;
  supplierId?: number;
  warehouseId?: number;
  receivedDate: Dayjs;
  note?: string;
  items: Array<{
    purchaseOrderItemId?: number;
    productId?: number;
    unitId?: number;
    receivedQty?: number;
    conversionFactor?: number;
    damagedQty?: number;
    unitCost?: number;
    discrepancyType?: GoodsReceiptFormValues['items'][number]['discrepancyType'];
    note?: string;
  }>;
}

interface GoodsReceiptFormProps {
  references: PurchaseReferenceData;
  initialPurchaseOrderId?: number;
  submitting?: boolean;
  onSubmit: (values: GoodsReceiptFormValues) => void;
  onCancel: () => void;
}

function emptyReceiptItem() {
  return {
    receivedQty: 1,
    conversionFactor: 1,
    damagedQty: 0,
    unitCost: 0,
    discrepancyType: 'NONE' as const,
  };
}

export function GoodsReceiptForm({
  references,
  initialPurchaseOrderId,
  submitting = false,
  onSubmit,
  onCancel,
}: GoodsReceiptFormProps) {
  const [form] = Form.useForm<GoodsReceiptFormFields>();
  const purchaseOrderId = Form.useWatch('purchaseOrderId', form);
  const watchedItems = Form.useWatch('items', form) ?? [];
  const linkedOrder = references.receivablePurchaseOrders.find(
    (order) => order.id === purchaseOrderId,
  );

  const applyPurchaseOrder = useCallback((order?: PurchaseOrderDetail) => {
    if (!order) {
      form.setFieldsValue({
        purchaseOrderId: undefined,
        supplierId: undefined,
        warehouseId: undefined,
        items: [emptyReceiptItem()],
      });
      return;
    }
    form.setFieldsValue({
      purchaseOrderId: order.id,
      supplierId: order.supplierId,
      warehouseId: order.warehouseId,
      items: order.items
        .filter((item) => remainingQuantity(item.baseOrderedQty, item.receivedQty) > 0)
        .map((item) => ({
          purchaseOrderItemId: item.id,
          productId: item.productId,
          unitId: item.unitId,
          receivedQty: 0,
          conversionFactor: item.conversionFactor,
          damagedQty: 0,
          unitCost: item.unitPrice,
          discrepancyType: 'NONE',
        })),
    });
  }, [form]);

  useEffect(() => {
    form.setFieldsValue({
      receivedDate: dayjs(),
      items: [emptyReceiptItem()],
    });
    if (initialPurchaseOrderId) {
      applyPurchaseOrder(
        references.receivablePurchaseOrders.find((order) => order.id === initialPurchaseOrderId),
      );
    }
  }, [applyPurchaseOrder, form, initialPurchaseOrderId, references.receivablePurchaseOrders]);

  const damagedTotal = watchedItems.reduce((sum, item) => sum + (item?.damagedQty ?? 0), 0);
  const totalAmount = watchedItems.reduce(
    (sum, item) => sum + (item?.receivedQty ?? 0) * (item?.unitCost ?? 0),
    0,
  );

  const submitValues = (values: GoodsReceiptFormFields) => {
    onSubmit({
      purchaseOrderId: values.purchaseOrderId,
      supplierId: values.supplierId as number,
      warehouseId: values.warehouseId as number,
      receivedDate: values.receivedDate.startOf('day').format(),
      note: values.note,
      items: values.items.map((item) => ({
        purchaseOrderItemId: item.purchaseOrderItemId,
        productId: item.productId as number,
        unitId: item.unitId as number,
        receivedQty: item.receivedQty as number,
        conversionFactor: item.conversionFactor as number,
        damagedQty: item.damagedQty ?? 0,
        unitCost: item.unitCost as number,
        discrepancyType: item.discrepancyType ?? 'NONE',
        note: item.note,
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
      <Card size="small" title="Thông tin phiếu nhận">
        <Row gutter={[16, 0]}>
          <Col xs={24} lg={8}>
            <Form.Item name="purchaseOrderId" label="PO liên quan">
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="Để trống nếu nhập hàng không có PO"
                options={references.receivablePurchaseOrders.map((order) => ({
                  value: order.id,
                  label: `${order.code} · ${order.supplierName}`,
                }))}
                onChange={(value) => applyPurchaseOrder(
                  references.receivablePurchaseOrders.find((order) => order.id === value),
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="supplierId"
              label="Nhà cung cấp"
              rules={[{ required: true, message: 'Chọn nhà cung cấp.' }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                disabled={Boolean(linkedOrder)}
                placeholder="Chọn nhà cung cấp"
                options={references.suppliers}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="warehouseId"
              label="Kho nhận"
              rules={[{ required: true, message: 'Chọn kho nhận.' }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                disabled={Boolean(linkedOrder)}
                placeholder="Chọn kho nhận"
                options={references.warehouses}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Form.Item
              name="receivedDate"
              label="Ngày nhận"
              rules={[{ required: true, message: 'Chọn ngày nhận.' }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="note" label="Ghi chú">
              <Input.TextArea rows={2} maxLength={500} showCount placeholder="Ghi chú cho phiếu nhận" />
            </Form.Item>
          </Col>
        </Row>
        <Alert
          showIcon
          type={linkedOrder ? 'info' : 'warning'}
          message={linkedOrder ? 'Nhận hàng theo PO' : 'Nhập hàng không có PO'}
          description={linkedOrder
            ? 'Nhà cung cấp, kho và các dòng hàng được lấy từ PO. Hãy nhập số lượng thực nhận.'
            : 'Bạn cần chọn nhà cung cấp, kho và tự thêm sản phẩm cho phiếu nhận.'}
        />
      </Card>

      {damagedTotal > 0 ? (
        <Alert
          showIcon
          icon={<WarningOutlined />}
          type="warning"
          message={`Đang ghi nhận ${formatQuantity(damagedTotal)} sản phẩm hỏng`}
          description="Dòng có số lượng hỏng sẽ được đánh dấu và loại chênh lệch tự chuyển thành Hư hỏng."
        />
      ) : null}

      <Card
        size="small"
        title="Chi tiết hàng nhận"
        extra={<Typography.Text strong>Tổng giá trị: {formatVnd(totalAmount)}</Typography.Text>}
      >
        <Form.List
          name="items"
          rules={[
            {
              validator: async (_, items) => {
                if (!items?.length) throw new Error('Phiếu nhận phải có ít nhất một sản phẩm.');
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <Flex vertical gap={12}>
              {fields.map((field, index) => {
                const item = watchedItems[field.name] ?? {};
                const product = references.products.find((record) => record.id === item.productId);
                const orderItem = linkedOrder?.items.find(
                  (record) => record.id === item.purchaseOrderItemId,
                );
                const baseReceivedQty = (item.receivedQty ?? 0) * (item.conversionFactor ?? 0);
                const damaged = (item.damagedQty ?? 0) > 0;
                return (
                  <div
                    className={`purchasing-form__item${damaged ? ' purchasing-form__item--damaged' : ''}`}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, 'purchaseOrderItemId']}
                      hidden
                    >
                      <Input />
                    </Form.Item>
                    <div className="purchasing-form__item-number">{index + 1}</div>
                    {orderItem ? (
                      <Flex gap={16} wrap className="purchasing-form__order-context">
                        <Typography.Text>Đặt: <strong>{formatQuantity(orderItem.orderedQty)}</strong> {orderItem.unitName}</Typography.Text>
                        <Typography.Text>Đã nhận: <strong>{formatQuantity(orderItem.receivedQty)}</strong> cơ sở</Typography.Text>
                        <Typography.Text>Còn phải nhận: <strong>{formatQuantity(remainingQuantity(orderItem.baseOrderedQty, orderItem.receivedQty))}</strong> cơ sở</Typography.Text>
                      </Flex>
                    ) : null}
                    <Row gutter={[12, 0]} align="top">
                      <Col xs={24} lg={7}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'productId']}
                          label="Sản phẩm"
                          rules={[
                            { required: true, message: 'Chọn sản phẩm.' },
                            {
                              validator: async (_, value) => {
                                const duplicates = (form.getFieldValue('items') ?? [])
                                  .filter((record: GoodsReceiptFormFields['items'][number]) => (
                                    record.productId === value
                                  )).length;
                                if (!linkedOrder && value && duplicates > 1) {
                                  throw new Error('Sản phẩm đã có trong phiếu.');
                                }
                              },
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            optionFilterProp="label"
                            disabled={Boolean(linkedOrder)}
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
                              form.setFieldValue(['items', field.name, 'unitCost'], nextProduct?.suggestedUnitCost ?? 0);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} lg={3}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'unitId']}
                          label="Đơn vị"
                          rules={[{ required: true, message: 'Chọn đơn vị.' }]}
                        >
                          <Select
                            disabled={Boolean(linkedOrder) || !product}
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
                          name={[field.name, 'receivedQty']}
                          label="Số lượng nhận"
                          rules={[{ required: true, message: 'Nhập SL nhận.' }]}
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
                      <Col xs={12} sm={6} lg={3}>
                        <Form.Item label="SL cơ sở">
                          <InputNumber disabled value={baseReceivedQty} precision={2} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col xs={12} sm={6} lg={3}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'damagedQty']}
                          label="Số lượng hỏng"
                          dependencies={[[field.name, 'receivedQty']]}
                          rules={[
                            ({ getFieldValue }) => ({
                              validator(_, value: number | undefined) {
                                const received = getFieldValue(['items', field.name, 'receivedQty']) ?? 0;
                                if ((value ?? 0) <= received) return Promise.resolve();
                                return Promise.reject(new Error('SL hỏng không vượt SL nhận.'));
                              },
                            }),
                          ]}
                        >
                          <InputNumber
                            min={0}
                            precision={2}
                            style={{ width: '100%' }}
                            onChange={(value) => {
                              const currentType = form.getFieldValue(['items', field.name, 'discrepancyType']);
                              if ((value ?? 0) > 0) {
                                form.setFieldValue(['items', field.name, 'discrepancyType'], 'DAMAGED');
                              } else if (currentType === 'DAMAGED') {
                                form.setFieldValue(['items', field.name, 'discrepancyType'], 'NONE');
                              }
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={12} sm={8} lg={4}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'unitCost']}
                          label="Đơn giá / giá vốn"
                          rules={[{ required: true, message: 'Nhập đơn giá.' }]}
                        >
                          <InputNumber min={0} precision={0} addonAfter="₫" style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col xs={12} sm={8} lg={4}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'discrepancyType']}
                          label="Loại chênh lệch"
                          rules={[{ required: true, message: 'Chọn loại chênh lệch.' }]}
                        >
                          <Select
                            options={Object.entries(discrepancyConfig).map(([value, config]) => ({
                              value,
                              label: config.label,
                            }))}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={20} sm={16} lg={7}>
                        <Form.Item {...field} name={[field.name, 'note']} label="Ghi chú">
                          <Input maxLength={250} placeholder="Ghi chú dòng hàng" />
                        </Form.Item>
                      </Col>
                      <Col xs={4} sm={8} lg={1}>
                        <Form.Item label=" ">
                          <Button
                            danger
                            type="text"
                            aria-label={`Xóa dòng nhận hàng ${index + 1}`}
                            icon={<DeleteOutlined />}
                            disabled={Boolean(linkedOrder) || fields.length === 1}
                            onClick={() => remove(field.name)}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                );
              })}
              <Form.ErrorList errors={errors} />
              {!linkedOrder ? (
                <Button type="dashed" icon={<PlusOutlined />} onClick={() => add(emptyReceiptItem())}>
                  Thêm sản phẩm
                </Button>
              ) : null}
            </Flex>
          )}
        </Form.List>
      </Card>

      <Divider className="purchasing-form__divider" />
      <Flex justify="space-between" align="center" gap={12} wrap className="purchasing-form__actions">
        <Typography.Text type="secondary">
          Phiếu được lưu ở trạng thái Nháp. Backend/V6 xử lý tăng tồn sau khi xác nhận.
        </Typography.Text>
        <Flex gap={8}>
          <Button disabled={submitting} onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={submitting}>Tạo phiếu nhận</Button>
        </Flex>
      </Flex>
    </Form>
  );
}
