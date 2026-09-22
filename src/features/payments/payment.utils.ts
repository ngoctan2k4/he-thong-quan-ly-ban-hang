import dayjs from 'dayjs';
import type {
  DebtOrder,
  DebtStatus,
  DebtTotals,
  OrderDebtSummary,
  PartnerDebtSummary,
  PaymentDataset,
  PaymentMethod,
  PaymentSchedule,
  PaymentScheduleStatus,
} from './payments.model';

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: 'Tiền mặt',
  BANK_TRANSFER: 'Chuyển khoản',
  CARD: 'Thẻ',
  OTHER: 'Khác',
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value?: string): string {
  return value ? dayjs(value).format('DD/MM/YYYY') : '—';
}

export function getRemainingAmount(schedule: PaymentSchedule): number {
  return Math.max(0, schedule.amount - schedule.paidAmount);
}

export function getScheduleStatus(
  schedule: PaymentSchedule,
  referenceDate = dayjs(),
): PaymentScheduleStatus {
  const remaining = getRemainingAmount(schedule);

  if (remaining <= 0) {
    return 'PAID';
  }

  const dueDate = dayjs(schedule.dueDate).startOf('day');
  const today = referenceDate.startOf('day');

  if (dueDate.isBefore(today)) {
    return 'OVERDUE';
  }

  if (dueDate.isSame(today)) {
    return 'DUE';
  }

  if (schedule.paidAmount > 0) {
    return 'PARTIAL';
  }

  return 'UPCOMING';
}

function getDebtStatus(
  remainingAmount: number,
  paidAmount: number,
  overdueAmount: number,
): DebtStatus {
  if (remainingAmount <= 0) {
    return 'PAID';
  }

  if (overdueAmount > 0) {
    return 'OVERDUE';
  }

  if (paidAmount > 0) {
    return 'PARTIAL';
  }

  return 'UPCOMING';
}

export function buildOrderDebtSummary(
  order: DebtOrder,
  schedules: PaymentSchedule[],
): OrderDebtSummary {
  const orderSchedules = schedules.filter((schedule) => schedule.orderId === order.id);
  const paidAmount = orderSchedules.reduce((sum, schedule) => sum + schedule.paidAmount, 0);
  const remainingAmount = orderSchedules.reduce(
    (sum, schedule) => sum + getRemainingAmount(schedule),
    0,
  );
  const overdueAmount = orderSchedules.reduce(
    (sum, schedule) =>
      sum + (getScheduleStatus(schedule) === 'OVERDUE' ? getRemainingAmount(schedule) : 0),
    0,
  );
  const openDueDates = orderSchedules
    .filter((schedule) => getRemainingAmount(schedule) > 0)
    .map((schedule) => schedule.dueDate)
    .sort();

  return {
    ...order,
    paidAmount,
    remainingAmount,
    overdueAmount,
    notDueAmount: Math.max(0, remainingAmount - overdueAmount),
    nearestDueDate: openDueDates[0],
    status: getDebtStatus(remainingAmount, paidAmount, overdueAmount),
  };
}

export function buildPartnerDebtSummaries(dataset: PaymentDataset): PartnerDebtSummary[] {
  const orderSummaries = dataset.orders.map((order) =>
    buildOrderDebtSummary(order, dataset.schedules),
  );

  return dataset.partners.map((partner) => {
    const partnerOrders = orderSummaries.filter((order) => order.partnerId === partner.id);
    const totalAmount = partnerOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const paidAmount = partnerOrders.reduce((sum, order) => sum + order.paidAmount, 0);
    const remainingAmount = partnerOrders.reduce(
      (sum, order) => sum + order.remainingAmount,
      0,
    );
    const overdueAmount = partnerOrders.reduce((sum, order) => sum + order.overdueAmount, 0);
    const openDueDates = partnerOrders
      .filter((order) => order.remainingAmount > 0 && order.nearestDueDate)
      .map((order) => order.nearestDueDate as string)
      .sort();

    return {
      ...partner,
      totalAmount,
      paidAmount,
      remainingAmount,
      overdueAmount,
      notDueAmount: Math.max(0, remainingAmount - overdueAmount),
      openOrderCount: partnerOrders.filter((order) => order.remainingAmount > 0).length,
      nearestDueDate: openDueDates[0],
      status: getDebtStatus(remainingAmount, paidAmount, overdueAmount),
    };
  });
}

export function buildDebtTotals(summaries: PartnerDebtSummary[]): DebtTotals {
  return summaries.reduce<DebtTotals>(
    (totals, summary) => ({
      totalAmount: totals.totalAmount + summary.totalAmount,
      paidAmount: totals.paidAmount + summary.paidAmount,
      remainingAmount: totals.remainingAmount + summary.remainingAmount,
      overdueAmount: totals.overdueAmount + summary.overdueAmount,
    }),
    { totalAmount: 0, paidAmount: 0, remainingAmount: 0, overdueAmount: 0 },
  );
}
