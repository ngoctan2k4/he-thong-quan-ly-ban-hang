import {
  Button,
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Typography,
} from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useMemo } from 'react';
import type {
  PaymentReferenceData,
  PaymentSide,
  RecordPaymentInput,
} from '../payments.model';
import {
  formatCurrency,
  formatDate,
  getRemainingAmount,
  paymentMethodLabels,
} from '../payment.utils';

interface PaymentFormFields extends Omit<RecordPaymentInput, 'paidDate'> {
  paidDate: Dayjs;
}

interface PaymentFormDrawerProps {
  open: boolean;
  side: PaymentSide;
  data?: PaymentReferenceData;
  loading?: boolean;
  initialPartnerId?: string;
  initialOrderId?: string;
  initialScheduleId?: string;
  onClose: () => void;
  onSubmit: (values: RecordPaymentInput) => Promise<void>;
}

export function PaymentFormDrawer({
  open,
  side,
  data,
  loading,
  initialPartnerId,
  initialOrderId,
  initialScheduleId,
  onClose,
  onSubmit,
}: PaymentFormDrawerProps) {
  const [form] = Form.useForm<PaymentFormFields>();
  const partnerId = Form.useWatch('partnerId', form);
  const orderId = Form.useWatch('orderId', form);
  const scheduleId = Form.useWatch('scheduleId', form);

  useEffect(() => {
    if (!open) {
      return;
    }
    form.resetFields();
    form.setFieldsValue({
      partnerId: initialPartnerId,
      orderId: initialOrderId,
      scheduleId: initialScheduleId,
      paidDate: dayjs(),
      method: 'BANK_TRANSFER',
    });
  }, [form, initialOrderId, initialPartnerId, initialScheduleId, open]);

  const openOrderIds = useMemo(() => {
    const remainingByOrder = new Map<string, number>();
    data?.schedules.forEach((schedule) => {
      remainingByOrder.set(
        schedule.orderId,
        (remainingByOrder.get(schedule.orderId) ?? 0) + getRemainingAmount(schedule),
      );
    });
    return new Set(
      [...remainingByOrder.entries()]
        .filter(([, remaining]) => remaining > 0)
        .map(([id]) => id),
    );
  }, [data?.schedules]);

  const availableOrders = (data?.orders ?? []).filter(
    (order) => order.partnerId === partnerId && openOrderIds.has(order.id),
  );
  const availableSchedules = (data?.schedules ?? []).filter(
    (schedule) => schedule.orderId === orderId && getRemainingAmount(schedule) > 0,
  );
  const selectedSchedule = data?.schedules.find((schedule) => schedule.id === scheduleId);
  const remainingAmount = selectedSchedule ? getRemainingAmount(selectedSchedule) : 0;
  const partnerLabel = side === 'CUSTOMER' ? 'Khách hàng' : 'Nhà cung cấp';
  const orderLabel = side === 'CUSTOMER' ? 'Đơn bán' : 'Đơn mua';
  const title = side === 'CUSTOMER' ? 'Ghi nhận thanh toán' : 'Thanh toán nhà cung cấp';

  const handleFinish = async (values: PaymentFormFields) => {
    await onSubmit({
      ...values,
      paidDate: values.paidDate.format('YYYY-MM-DD'),
    });
    form.resetFields();
  };

  return (
    <Drawer
      open={open}
      title={title}
      width={720}
      onClose={onClose}
      destroyOnHidden
      footer={
        <Space className="payment-drawer__footer">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" htmlType="submit" form="payment-record-form" loading={loading}>
            Lưu thanh toán
          </Button>
        </Space>
      }
    >
      <Typography.Paragraph type="secondary" className="payment-drawer__intro">
        Chọn đúng đơn hàng và đợt thanh toán. Số tiền được ghi nhận sẽ cập nhật công nợ mock ngay sau khi lưu.
      </Typography.Paragraph>

      <Form
        id="payment-record-form"
        form={form}
        layout="vertical"
        onFinish={(values) => void handleFinish(values)}
      >
        <Form.Item
          name="partnerId"
          label={partnerLabel}
          rules={[{ required: true, message: `Vui lòng chọn ${partnerLabel.toLocaleLowerCase('vi-VN')}.` }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            placeholder={`Chọn ${partnerLabel.toLocaleLowerCase('vi-VN')}`}
            options={(data?.partners ?? []).map((partner) => ({
              value: partner.id,
              label: `${partner.code} · ${partner.name}`,
            }))}
            onChange={() => form.setFieldsValue({ orderId: undefined, scheduleId: undefined, amount: undefined })}
          />
        </Form.Item>

        <div className="payment-form__grid">
          <Form.Item
            name="orderId"
            label={orderLabel}
            rules={[{ required: true, message: `Vui lòng chọn ${orderLabel.toLocaleLowerCase('vi-VN')}.` }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder={`Chọn ${orderLabel.toLocaleLowerCase('vi-VN')}`}
              disabled={!partnerId}
              options={availableOrders.map((order) => ({
                value: order.id,
                label: `${order.code} · ${formatCurrency(order.totalAmount)}`,
              }))}
              onChange={() => form.setFieldsValue({ scheduleId: undefined, amount: undefined })}
            />
          </Form.Item>

          <Form.Item
            name="scheduleId"
            label="Đợt thanh toán"
            rules={[{ required: true, message: 'Vui lòng chọn đợt thanh toán.' }]}
          >
            <Select
              placeholder="Chọn đợt"
              disabled={!orderId}
              options={availableSchedules.map((schedule) => ({
                value: schedule.id,
                label: `Đợt ${schedule.installmentNo} · còn ${formatCurrency(getRemainingAmount(schedule))}`,
              }))}
              onChange={() => form.setFieldValue('amount', undefined)}
            />
          </Form.Item>
        </div>

        {selectedSchedule ? (
          <Descriptions size="small" column={{ xs: 2, sm: 4 }} className="payment-form__schedule-summary">
            <Descriptions.Item label="Phải trả">{formatCurrency(selectedSchedule.amount)}</Descriptions.Item>
            <Descriptions.Item label="Đã thanh toán">{formatCurrency(selectedSchedule.paidAmount)}</Descriptions.Item>
            <Descriptions.Item label="Còn lại">{formatCurrency(remainingAmount)}</Descriptions.Item>
            <Descriptions.Item label="Hạn thanh toán">{formatDate(selectedSchedule.dueDate)}</Descriptions.Item>
          </Descriptions>
        ) : null}

        <div className="payment-form__grid">
          <Form.Item
            name="amount"
            label="Số tiền thanh toán"
            rules={[
              { required: true, message: 'Vui lòng nhập số tiền thanh toán.' },
              {
                validator: (_, value?: number) => {
                  if (value === undefined || value <= 0) {
                    return Promise.reject(new Error('Số tiền phải lớn hơn 0.'));
                  }
                  if (selectedSchedule && value > remainingAmount) {
                    return Promise.reject(
                      new Error(`Không được vượt quá ${formatCurrency(remainingAmount)}.`),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber<number>
              min={1}
              max={remainingAmount || undefined}
              precision={0}
              controls={false}
              addonAfter="₫"
              placeholder="0"
              style={{ width: '100%' }}
              formatter={(value) => value ? new Intl.NumberFormat('vi-VN').format(Number(value)) : ''}
              parser={(value) => Number(value?.replace(/\D/g, '') ?? 0)}
            />
          </Form.Item>

          <Form.Item
            name="paidDate"
            label="Ngày thanh toán"
            rules={[{ required: true, message: 'Vui lòng chọn ngày thanh toán.' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="method"
            label="Phương thức"
            rules={[{ required: true, message: 'Vui lòng chọn phương thức.' }]}
          >
            <Select
              options={Object.entries(paymentMethodLabels).map(([value, label]) => ({ value, label }))}
            />
          </Form.Item>

          <Form.Item name="referenceCode" label="Mã tham chiếu">
            <Input placeholder="Ví dụ: FT260920001" maxLength={40} />
          </Form.Item>
        </div>

        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={3} maxLength={300} showCount placeholder="Thông tin đối soát hoặc ghi chú nội bộ" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
