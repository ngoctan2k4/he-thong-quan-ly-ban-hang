import { Button, Descriptions, Drawer, Empty, Flex, Skeleton, Table, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import type {
  OrderDebtSummary,
  PartnerDebtDetail,
  PaymentSchedule,
  PaymentSide,
} from '../payments.model';
import {
  formatCurrency,
  formatDate,
  getRemainingAmount,
  getScheduleStatus,
} from '../payment.utils';
import { PaymentStatusTag } from './PaymentStatusTag';

interface DebtDetailDrawerProps {
  open: boolean;
  side: PaymentSide;
  detail?: PartnerDebtDetail;
  loading?: boolean;
  onClose: () => void;
  onPay: (partnerId: string, orderId?: string, scheduleId?: string) => void;
}

export function DebtDetailDrawer({
  open,
  side,
  detail,
  loading,
  onClose,
  onPay,
}: DebtDetailDrawerProps) {
  const isCustomer = side === 'CUSTOMER';
  const scheduleColumns: TableColumnsType<PaymentSchedule> = [
    {
      title: 'Đợt',
      dataIndex: 'installmentNo',
      width: 72,
      render: (value: number) => `Đợt ${value}`,
    },
    {
      title: 'Phải trả',
      dataIndex: 'amount',
      align: 'right',
      width: 140,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Đã trả',
      dataIndex: 'paidAmount',
      align: 'right',
      width: 140,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Còn lại',
      align: 'right',
      width: 140,
      render: (_, schedule) => formatCurrency(getRemainingAmount(schedule)),
    },
    {
      title: 'Hạn thanh toán',
      dataIndex: 'dueDate',
      width: 130,
      render: formatDate,
    },
    {
      title: 'Ngày thanh toán gần nhất',
      width: 172,
      render: (_, schedule) => {
        const latest = detail?.transactions
          .filter((transaction) => transaction.scheduleId === schedule.id && transaction.status === 'SUCCESS')
          .map((transaction) => transaction.paidDate)
          .sort()
          .at(-1);
        return formatDate(latest);
      },
    },
    {
      title: 'Trạng thái',
      width: 170,
      render: (_, schedule) => <PaymentStatusTag status={getScheduleStatus(schedule)} />,
    },
    {
      title: '',
      width: 98,
      render: (_, schedule) =>
        getRemainingAmount(schedule) > 0 && detail ? (
          <Button
            type="link"
            size="small"
            onClick={() => onPay(detail.summary.id, schedule.orderId, schedule.id)}
          >
            Thanh toán
          </Button>
        ) : null,
    },
  ];

  const orderColumns: TableColumnsType<OrderDebtSummary> = [
    { title: isCustomer ? 'Mã đơn' : 'Mã đơn mua', dataIndex: 'code', width: 116 },
    { title: isCustomer ? 'Ngày đơn' : 'Ngày mua', dataIndex: 'orderDate', width: 118, render: formatDate },
    { title: 'Tổng tiền', dataIndex: 'totalAmount', align: 'right', width: 145, render: formatCurrency },
    { title: 'Đã thanh toán', dataIndex: 'paidAmount', align: 'right', width: 145, render: formatCurrency },
    { title: 'Còn lại', dataIndex: 'remainingAmount', align: 'right', width: 145, render: formatCurrency },
    { title: 'Hạn gần nhất', dataIndex: 'nearestDueDate', width: 126, render: formatDate },
    { title: 'Trạng thái', dataIndex: 'status', width: 174, render: (status) => <PaymentStatusTag status={status} /> },
  ];

  return (
    <Drawer
      open={open}
      title={isCustomer ? 'Chi tiết công nợ khách hàng' : 'Chi tiết công nợ nhà cung cấp'}
      width={1080}
      onClose={onClose}
      destroyOnHidden
      extra={
        detail && detail.summary.remainingAmount > 0 ? (
          <Button type="primary" onClick={() => onPay(detail.summary.id)}>
            {isCustomer ? 'Ghi nhận thanh toán' : 'Thanh toán NCC'}
          </Button>
        ) : null
      }
    >
      {loading ? <Skeleton active paragraph={{ rows: 10 }} /> : null}
      {!loading && !detail ? <Empty description="Không có dữ liệu công nợ" /> : null}
      {!loading && detail ? (
        <Flex vertical gap={20}>
          <section>
            <Typography.Title level={5} className="payment-detail__section-title">
              {isCustomer ? 'Thông tin khách hàng' : 'Thông tin nhà cung cấp'}
            </Typography.Title>
            <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label={isCustomer ? 'Mã khách hàng' : 'Mã NCC'}>
                {detail.summary.code}
              </Descriptions.Item>
              <Descriptions.Item label={isCustomer ? 'Khách hàng' : 'Nhà cung cấp'}>
                {detail.summary.name}
              </Descriptions.Item>
            </Descriptions>
          </section>

          <section>
            <Typography.Title level={5} className="payment-detail__section-title">
              Tổng hợp
            </Typography.Title>
            <Descriptions bordered size="small" column={{ xs: 2, sm: 3 }}>
              <Descriptions.Item label={isCustomer ? 'Tổng phải thu' : 'Tổng phải trả'}>
                {formatCurrency(detail.summary.totalAmount)}
              </Descriptions.Item>
              <Descriptions.Item label={isCustomer ? 'Đã thu' : 'Đã trả'}>
                {formatCurrency(detail.summary.paidAmount)}
              </Descriptions.Item>
              <Descriptions.Item label="Còn nợ">
                <Typography.Text strong>{formatCurrency(detail.summary.remainingAmount)}</Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="Quá hạn">
                <Typography.Text type={detail.summary.overdueAmount > 0 ? 'danger' : undefined}>
                  {formatCurrency(detail.summary.overdueAmount)}
                </Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="Chưa đến hạn">
                {formatCurrency(detail.summary.notDueAmount)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <PaymentStatusTag status={detail.summary.status} />
              </Descriptions.Item>
            </Descriptions>
          </section>

          <section>
            <Typography.Title level={5} className="payment-detail__section-title">
              {isCustomer ? 'Danh sách đơn còn nợ' : 'Danh sách đơn mua'}
            </Typography.Title>
            <Table<OrderDebtSummary>
              className="payments-data-table"
              rowKey="id"
              size="small"
              tableLayout="fixed"
              columns={orderColumns}
              dataSource={detail.orders}
              pagination={false}
              scroll={{ x: 1040 }}
              expandable={{
                rowExpandable: (order) => detail.schedules.some((schedule) => schedule.orderId === order.id),
                expandedRowRender: (order) => (
                  <div className="payment-detail__schedule-table">
                    <Typography.Text strong>Lịch thanh toán</Typography.Text>
                    <Table<PaymentSchedule>
                      className="payments-data-table"
                      rowKey="id"
                      size="small"
                      tableLayout="fixed"
                      columns={scheduleColumns}
                      dataSource={detail.schedules.filter((schedule) => schedule.orderId === order.id)}
                      pagination={false}
                      scroll={{ x: 1160 }}
                    />
                  </div>
                ),
              }}
            />
          </section>
        </Flex>
      ) : null}
    </Drawer>
  );
}
