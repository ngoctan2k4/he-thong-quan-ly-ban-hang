import type {
  DebtFilters,
  PartnerDebtDetail,
  PartnerDebtListResult,
  PaymentDataset,
  PaymentReferenceData,
  PaymentSide,
  PaymentTransaction,
  RecordPaymentInput,
  TransactionFilters,
  TransactionListItem,
  PaginatedResult,
} from '../features/payments/payments.model';
import {
  buildDebtTotals,
  buildOrderDebtSummary,
  buildPartnerDebtSummaries,
  getRemainingAmount,
} from '../features/payments/payment.utils';

const customerSeed: PaymentDataset = {
  partners: [
    { id: 'CUS-001', code: 'KH0001', name: 'Công ty ABC Trading' },
    { id: 'CUS-002', code: 'KH0002', name: 'Công ty TNHH Minh Long' },
    { id: 'CUS-003', code: 'KH0003', name: 'Công ty Cổ phần An Phát' },
    { id: 'CUS-004', code: 'KH0004', name: 'Công ty Thương mại Đông Dương' },
    { id: 'CUS-005', code: 'KH0005', name: 'Hệ thống bán lẻ Hồng Hà' },
    { id: 'CUS-006', code: 'KH0006', name: 'Công ty TNHH Nam Việt' },
  ],
  orders: [
    { id: 'SO-051', code: 'SO00051', partnerId: 'CUS-001', orderDate: '2026-08-20', totalAmount: 100_000_000 },
    { id: 'SO-056', code: 'SO00056', partnerId: 'CUS-001', orderDate: '2026-09-12', totalAmount: 20_000_000 },
    { id: 'SO-048', code: 'SO00048', partnerId: 'CUS-002', orderDate: '2026-08-08', totalAmount: 75_000_000 },
    { id: 'SO-060', code: 'SO00060', partnerId: 'CUS-002', orderDate: '2026-09-18', totalAmount: 15_000_000 },
    { id: 'SO-045', code: 'SO00045', partnerId: 'CUS-003', orderDate: '2026-07-25', totalAmount: 45_000_000 },
    { id: 'SO-062', code: 'SO00062', partnerId: 'CUS-004', orderDate: '2026-09-10', totalAmount: 120_000_000 },
    { id: 'SO-063', code: 'SO00063', partnerId: 'CUS-005', orderDate: '2026-08-30', totalAmount: 32_000_000 },
    { id: 'SO-065', code: 'SO00065', partnerId: 'CUS-006', orderDate: '2026-09-19', totalAmount: 28_000_000 },
  ],
  schedules: [
    { id: 'CS-051-1', orderId: 'SO-051', installmentNo: 1, amount: 30_000_000, dueDate: '2026-08-30', paidAmount: 30_000_000 },
    { id: 'CS-051-2', orderId: 'SO-051', installmentNo: 2, amount: 40_000_000, dueDate: '2026-09-15', paidAmount: 15_000_000 },
    { id: 'CS-051-3', orderId: 'SO-051', installmentNo: 3, amount: 30_000_000, dueDate: '2026-10-15', paidAmount: 0 },
    { id: 'CS-056-1', orderId: 'SO-056', installmentNo: 1, amount: 20_000_000, dueDate: '2026-10-05', paidAmount: 0 },
    { id: 'CS-048-1', orderId: 'SO-048', installmentNo: 1, amount: 25_000_000, dueDate: '2026-08-20', paidAmount: 25_000_000 },
    { id: 'CS-048-2', orderId: 'SO-048', installmentNo: 2, amount: 25_000_000, dueDate: '2026-09-10', paidAmount: 5_000_000 },
    { id: 'CS-048-3', orderId: 'SO-048', installmentNo: 3, amount: 25_000_000, dueDate: '2026-10-10', paidAmount: 0 },
    { id: 'CS-060-1', orderId: 'SO-060', installmentNo: 1, amount: 15_000_000, dueDate: '2026-09-20', paidAmount: 0 },
    { id: 'CS-045-1', orderId: 'SO-045', installmentNo: 1, amount: 20_000_000, dueDate: '2026-08-05', paidAmount: 20_000_000 },
    { id: 'CS-045-2', orderId: 'SO-045', installmentNo: 2, amount: 25_000_000, dueDate: '2026-09-05', paidAmount: 25_000_000 },
    { id: 'CS-062-1', orderId: 'SO-062', installmentNo: 1, amount: 60_000_000, dueDate: '2026-10-01', paidAmount: 30_000_000 },
    { id: 'CS-062-2', orderId: 'SO-062', installmentNo: 2, amount: 60_000_000, dueDate: '2026-11-01', paidAmount: 0 },
    { id: 'CS-063-1', orderId: 'SO-063', installmentNo: 1, amount: 32_000_000, dueDate: '2026-09-01', paidAmount: 0 },
    { id: 'CS-065-1', orderId: 'SO-065', installmentNo: 1, amount: 28_000_000, dueDate: '2026-10-20', paidAmount: 0 },
  ],
  transactions: [
    { id: 'CT-001', code: 'PAY00001', partnerId: 'CUS-001', orderId: 'SO-051', scheduleId: 'CS-051-1', amount: 30_000_000, paidDate: '2026-08-29', method: 'BANK_TRANSFER', recordedBy: 'Nguyễn Văn A', referenceCode: 'FT260829001', status: 'SUCCESS' },
    { id: 'CT-002', code: 'PAY00002', partnerId: 'CUS-001', orderId: 'SO-051', scheduleId: 'CS-051-2', amount: 15_000_000, paidDate: '2026-09-14', method: 'BANK_TRANSFER', recordedBy: 'Nguyễn Văn A', referenceCode: 'FT260914002', status: 'SUCCESS' },
    { id: 'CT-003', code: 'PAY00003', partnerId: 'CUS-002', orderId: 'SO-048', scheduleId: 'CS-048-1', amount: 25_000_000, paidDate: '2026-08-18', method: 'CASH', recordedBy: 'Trần Thị B', status: 'SUCCESS' },
    { id: 'CT-004', code: 'PAY00004', partnerId: 'CUS-002', orderId: 'SO-048', scheduleId: 'CS-048-2', amount: 5_000_000, paidDate: '2026-09-08', method: 'CARD', recordedBy: 'Trần Thị B', referenceCode: 'POS-0908-18', status: 'SUCCESS' },
    { id: 'CT-005', code: 'PAY00005', partnerId: 'CUS-003', orderId: 'SO-045', scheduleId: 'CS-045-1', amount: 20_000_000, paidDate: '2026-08-04', method: 'BANK_TRANSFER', recordedBy: 'Lê Hoàng Nam', referenceCode: 'FT260804006', status: 'SUCCESS' },
    { id: 'CT-006', code: 'PAY00006', partnerId: 'CUS-003', orderId: 'SO-045', scheduleId: 'CS-045-2', amount: 25_000_000, paidDate: '2026-09-04', method: 'BANK_TRANSFER', recordedBy: 'Lê Hoàng Nam', referenceCode: 'FT260904010', status: 'SUCCESS' },
    { id: 'CT-007', code: 'PAY00007', partnerId: 'CUS-004', orderId: 'SO-062', scheduleId: 'CS-062-1', amount: 20_000_000, paidDate: '2026-09-17', method: 'BANK_TRANSFER', recordedBy: 'Phạm Thu Hà', referenceCode: 'FT260917021', status: 'SUCCESS' },
    { id: 'CT-008', code: 'PAY00008', partnerId: 'CUS-004', orderId: 'SO-062', scheduleId: 'CS-062-1', amount: 10_000_000, paidDate: '2026-09-19', method: 'CASH', recordedBy: 'Phạm Thu Hà', status: 'SUCCESS' },
  ],
};

const supplierSeed: PaymentDataset = {
  partners: [
    { id: 'SUP-001', code: 'NCC0001', name: 'Công ty Samsung Việt Nam' },
    { id: 'SUP-002', code: 'NCC0002', name: 'Công ty Công nghiệp An Phát' },
    { id: 'SUP-003', code: 'NCC0003', name: 'Công ty Bao bì Việt Tín' },
    { id: 'SUP-004', code: 'NCC0004', name: 'Công ty Gia dụng Đại Phát' },
    { id: 'SUP-005', code: 'NCC0005', name: 'Công ty Nguyên liệu Thành Công' },
  ],
  orders: [
    { id: 'PO-028', code: 'PO00028', partnerId: 'SUP-001', orderDate: '2026-07-28', totalAmount: 250_000_000 },
    { id: 'PO-035', code: 'PO00035', partnerId: 'SUP-001', orderDate: '2026-09-12', totalAmount: 40_000_000 },
    { id: 'PO-031', code: 'PO00031', partnerId: 'SUP-002', orderDate: '2026-08-18', totalAmount: 90_000_000 },
    { id: 'PO-022', code: 'PO00022', partnerId: 'SUP-003', orderDate: '2026-07-05', totalAmount: 48_000_000 },
    { id: 'PO-037', code: 'PO00037', partnerId: 'SUP-004', orderDate: '2026-09-01', totalAmount: 70_000_000 },
    { id: 'PO-039', code: 'PO00039', partnerId: 'SUP-005', orderDate: '2026-08-22', totalAmount: 65_000_000 },
  ],
  schedules: [
    { id: 'SS-028-1', orderId: 'PO-028', installmentNo: 1, amount: 100_000_000, dueDate: '2026-08-15', paidAmount: 100_000_000 },
    { id: 'SS-028-2', orderId: 'PO-028', installmentNo: 2, amount: 100_000_000, dueDate: '2026-09-12', paidAmount: 20_000_000 },
    { id: 'SS-028-3', orderId: 'PO-028', installmentNo: 3, amount: 50_000_000, dueDate: '2026-10-12', paidAmount: 0 },
    { id: 'SS-035-1', orderId: 'PO-035', installmentNo: 1, amount: 40_000_000, dueDate: '2026-10-20', paidAmount: 0 },
    { id: 'SS-031-1', orderId: 'PO-031', installmentNo: 1, amount: 30_000_000, dueDate: '2026-09-01', paidAmount: 30_000_000 },
    { id: 'SS-031-2', orderId: 'PO-031', installmentNo: 2, amount: 30_000_000, dueDate: '2026-09-15', paidAmount: 0 },
    { id: 'SS-031-3', orderId: 'PO-031', installmentNo: 3, amount: 30_000_000, dueDate: '2026-10-15', paidAmount: 0 },
    { id: 'SS-022-1', orderId: 'PO-022', installmentNo: 1, amount: 48_000_000, dueDate: '2026-08-10', paidAmount: 48_000_000 },
    { id: 'SS-037-1', orderId: 'PO-037', installmentNo: 1, amount: 35_000_000, dueDate: '2026-09-20', paidAmount: 15_000_000 },
    { id: 'SS-037-2', orderId: 'PO-037', installmentNo: 2, amount: 35_000_000, dueDate: '2026-10-20', paidAmount: 0 },
    { id: 'SS-039-1', orderId: 'PO-039', installmentNo: 1, amount: 25_000_000, dueDate: '2026-09-05', paidAmount: 0 },
    { id: 'SS-039-2', orderId: 'PO-039', installmentNo: 2, amount: 40_000_000, dueDate: '2026-10-05', paidAmount: 0 },
  ],
  transactions: [
    { id: 'ST-001', code: 'SPAY00001', partnerId: 'SUP-001', orderId: 'PO-028', scheduleId: 'SS-028-1', amount: 60_000_000, paidDate: '2026-08-10', method: 'BANK_TRANSFER', recordedBy: 'Admin', referenceCode: 'FT260810001', status: 'SUCCESS' },
    { id: 'ST-002', code: 'SPAY00002', partnerId: 'SUP-001', orderId: 'PO-028', scheduleId: 'SS-028-1', amount: 40_000_000, paidDate: '2026-08-14', method: 'BANK_TRANSFER', recordedBy: 'Admin', referenceCode: 'FT260814004', status: 'SUCCESS' },
    { id: 'ST-003', code: 'SPAY00003', partnerId: 'SUP-001', orderId: 'PO-028', scheduleId: 'SS-028-2', amount: 20_000_000, paidDate: '2026-09-10', method: 'BANK_TRANSFER', recordedBy: 'Nguyễn Văn A', referenceCode: 'FT260910009', status: 'SUCCESS' },
    { id: 'ST-004', code: 'SPAY00004', partnerId: 'SUP-002', orderId: 'PO-031', scheduleId: 'SS-031-1', amount: 30_000_000, paidDate: '2026-08-31', method: 'BANK_TRANSFER', recordedBy: 'Trần Thị B', referenceCode: 'FT260831006', status: 'SUCCESS' },
    { id: 'ST-005', code: 'SPAY00005', partnerId: 'SUP-003', orderId: 'PO-022', scheduleId: 'SS-022-1', amount: 48_000_000, paidDate: '2026-08-08', method: 'CASH', recordedBy: 'Lê Hoàng Nam', status: 'SUCCESS' },
    { id: 'ST-006', code: 'SPAY00006', partnerId: 'SUP-004', orderId: 'PO-037', scheduleId: 'SS-037-1', amount: 15_000_000, paidDate: '2026-09-18', method: 'BANK_TRANSFER', recordedBy: 'Admin', referenceCode: 'FT260918015', status: 'SUCCESS' },
  ],
};

let customerData = cloneDataset(customerSeed);
let supplierData = cloneDataset(supplierSeed);

function cloneDataset(dataset: PaymentDataset): PaymentDataset {
  return {
    partners: dataset.partners.map((item) => ({ ...item })),
    orders: dataset.orders.map((item) => ({ ...item })),
    schedules: dataset.schedules.map((item) => ({ ...item })),
    transactions: dataset.transactions.map((item) => ({ ...item })),
  };
}

function getDataset(side: PaymentSide): PaymentDataset {
  return side === 'CUSTOMER' ? customerData : supplierData;
}

function wait(duration = 240): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('vi-VN');
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  const totalElements = items.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const start = (page - 1) * pageSize;
  return { content: items.slice(start, start + pageSize), totalElements, totalPages };
}

export async function getMockPaymentReferenceData(
  side: PaymentSide,
): Promise<PaymentReferenceData> {
  await wait(100);
  const dataset = getDataset(side);
  return {
    partners: dataset.partners.map((item) => ({ ...item })),
    orders: dataset.orders.map((item) => ({ ...item })),
    schedules: dataset.schedules.map((item) => ({ ...item })),
  };
}

export async function listMockPaymentTransactions(
  side: PaymentSide,
  filters: TransactionFilters,
  page: number,
  pageSize: number,
): Promise<PaginatedResult<TransactionListItem>> {
  await wait();
  const dataset = getDataset(side);
  const keyword = normalize(filters.keyword);

  const items = dataset.transactions
    .map<TransactionListItem>((transaction) => {
      const partner = dataset.partners.find((item) => item.id === transaction.partnerId);
      const order = dataset.orders.find((item) => item.id === transaction.orderId);
      const schedule = dataset.schedules.find((item) => item.id === transaction.scheduleId);
      return {
        ...transaction,
        partnerCode: partner?.code ?? '—',
        partnerName: partner?.name ?? 'Đối tác không xác định',
        orderCode: order?.code ?? '—',
        installmentNo: schedule?.installmentNo ?? 0,
      };
    })
    .filter((item) => {
      const keywordTarget = normalize(
        `${item.code} ${item.partnerCode} ${item.partnerName} ${item.orderCode}`,
      );
      return (
        (!keyword || keywordTarget.includes(keyword)) &&
        (!filters.partnerId || item.partnerId === filters.partnerId) &&
        (!filters.orderId || item.orderId === filters.orderId) &&
        (!filters.method || item.method === filters.method) &&
        (!filters.status || item.status === filters.status) &&
        (!filters.dateFrom || item.paidDate >= filters.dateFrom) &&
        (!filters.dateTo || item.paidDate <= filters.dateTo)
      );
    })
    .sort((a, b) => b.paidDate.localeCompare(a.paidDate) || b.code.localeCompare(a.code));

  return paginate(items, page, pageSize);
}

export async function listMockPartnerDebts(
  side: PaymentSide,
  filters: DebtFilters,
  page: number,
  pageSize: number,
): Promise<PartnerDebtListResult> {
  await wait();
  const dataset = getDataset(side);
  const keyword = normalize(filters.keyword);
  const summaries = buildPartnerDebtSummaries(dataset)
    .filter((summary) => {
      const keywordTarget = normalize(`${summary.code} ${summary.name}`);
      return (
        (!keyword || keywordTarget.includes(keyword)) &&
        (!filters.status || summary.status === filters.status) &&
        (!filters.overdueOnly || summary.overdueAmount > 0) &&
        (!filters.dueFrom || (summary.nearestDueDate ?? '') >= filters.dueFrom) &&
        (!filters.dueTo || (summary.nearestDueDate ?? '9999-12-31') <= filters.dueTo)
      );
    })
    .sort((a, b) => b.remainingAmount - a.remainingAmount || a.name.localeCompare(b.name, 'vi'));
  const paginated = paginate(summaries, page, pageSize);
  return { ...paginated, totals: buildDebtTotals(summaries) };
}

export async function getMockPartnerDebtDetail(
  side: PaymentSide,
  partnerId: string,
): Promise<PartnerDebtDetail> {
  await wait(140);
  const dataset = getDataset(side);
  const summary = buildPartnerDebtSummaries(dataset).find((item) => item.id === partnerId);
  if (!summary) {
    throw new Error('Không tìm thấy đối tác trong dữ liệu công nợ.');
  }

  const orders = dataset.orders
    .filter((order) => order.partnerId === partnerId)
    .map((order) => buildOrderDebtSummary(order, dataset.schedules))
    .sort((a, b) => b.orderDate.localeCompare(a.orderDate));
  const orderIds = new Set(orders.map((order) => order.id));

  return {
    summary,
    orders,
    schedules: dataset.schedules.filter((schedule) => orderIds.has(schedule.orderId)),
    transactions: dataset.transactions.filter((transaction) => transaction.partnerId === partnerId),
  };
}

export async function recordMockPayment(
  side: PaymentSide,
  values: RecordPaymentInput,
): Promise<PaymentTransaction> {
  await wait(320);
  const dataset = getDataset(side);
  const partner = dataset.partners.find((item) => item.id === values.partnerId);
  const order = dataset.orders.find(
    (item) => item.id === values.orderId && item.partnerId === values.partnerId,
  );
  const schedule = dataset.schedules.find(
    (item) => item.id === values.scheduleId && item.orderId === values.orderId,
  );

  if (!partner || !order || !schedule) {
    throw new Error('Đối tác, đơn hàng hoặc đợt thanh toán không hợp lệ.');
  }

  const remainingAmount = getRemainingAmount(schedule);
  if (values.amount <= 0 || values.amount > remainingAmount) {
    throw new Error('Số tiền thanh toán phải lớn hơn 0 và không vượt quá số còn phải trả.');
  }

  schedule.paidAmount += values.amount;
  const prefix = side === 'CUSTOMER' ? 'PAY' : 'SPAY';
  const nextSequence = dataset.transactions.reduce((max, transaction) => {
    const sequence = Number(transaction.code.replace(/\D/g, ''));
    return Number.isFinite(sequence) ? Math.max(max, sequence) : max;
  }, 0) + 1;
  const transaction: PaymentTransaction = {
    id: `${side === 'CUSTOMER' ? 'CT' : 'ST'}-${String(nextSequence).padStart(3, '0')}`,
    code: `${prefix}${String(nextSequence).padStart(5, '0')}`,
    partnerId: values.partnerId,
    orderId: values.orderId,
    scheduleId: values.scheduleId,
    amount: values.amount,
    paidDate: values.paidDate,
    method: values.method,
    recordedBy: 'Admin',
    referenceCode: values.referenceCode?.trim() || undefined,
    note: values.note?.trim() || undefined,
    status: 'SUCCESS',
  };
  dataset.transactions.unshift(transaction);
  return { ...transaction };
}

export function resetMockPayments(side: PaymentSide): void {
  if (side === 'CUSTOMER') {
    customerData = cloneDataset(customerSeed);
    return;
  }
  supplierData = cloneDataset(supplierSeed);
}
