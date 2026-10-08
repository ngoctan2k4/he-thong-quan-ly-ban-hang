import type {
  SalesOrderDetail,
  SalesOrderFilters,
  SalesOrderListResult,
  SalesOrderRecord,
  SalesOrderReferenceData,
  SalesPaymentFilters,
  SalesPaymentListResult,
  SalesPaymentRecord,
} from '../features/sales-orders/salesOrders.model';
import type { SalesOrderRepository } from '../features/sales-orders/salesOrders.repository';
import type {
  SalesOrder,
  SalesOrderDelivery,
  SalesOrderItem,
  SalesOrderPayment,
} from '../types/order';

interface NamedReference {
  id: number;
  name: string;
}

interface ProductReference extends NamedReference {
  code: string;
}

const customers: NamedReference[] = [
  { id: 1, name: 'Nguyễn Minh Anh' },
  { id: 2, name: 'Công ty TNHH An Phát' },
  { id: 3, name: 'Lê Hoàng Nam' },
  { id: 4, name: 'Công ty CP Minh Long' },
  { id: 5, name: 'Trần Thanh Hà' },
];

const branches: NamedReference[] = [
  { id: 1, name: 'Chi nhánh Hồ Chí Minh' },
  { id: 2, name: 'Chi nhánh Hà Nội' },
];

const warehouses: NamedReference[] = [
  { id: 1, name: 'Kho trung tâm HCM' },
  { id: 2, name: 'Kho trung tâm Hà Nội' },
  { id: 3, name: 'Kho bán lẻ Quận 1' },
];

const products: ProductReference[] = [
  { id: 1, code: 'SP-TSHIRT-01', name: 'Áo thun cotton cơ bản' },
  { id: 2, code: 'SP-JEAN-02', name: 'Quần jean slim fit' },
  { id: 3, code: 'SP-SHOE-03', name: 'Giày thể thao Urban' },
  { id: 4, code: 'SP-BAG-04', name: 'Túi đeo chéo Canvas' },
  { id: 5, code: 'SP-CAP-05', name: 'Mũ lưỡi trai Classic' },
  { id: 6, code: 'SP-JACKET-06', name: 'Áo khoác gió Active' },
];

const units: NamedReference[] = [
  { id: 1, name: 'Cái' },
  { id: 2, name: 'Đôi' },
  { id: 3, name: 'Thùng (10 cái)' },
];

const users: NamedReference[] = [
  { id: 11, name: 'Lê Thu Trang' },
  { id: 12, name: 'Phạm Quốc Bảo' },
];

const orders: SalesOrder[] = [
  {
    id: 1001,
    code: 'SO-WEB-260925-01',
    channel: 'WEBSITE',
    customerId: 1,
    branchId: 1,
    warehouseId: 1,
    status: 'SHIPPING',
    orderDate: '2026-09-25T09:15:00+07:00',
    subtotal: 3_650_000,
    discountAmount: 260_000,
    shippingFee: 35_000,
    totalAmount: 3_425_000,
    paymentStatus: 'PAID',
    paymentMethod: 'TRANSFER',
    requiresApproval: false,
    approvedBy: null,
    approvedAt: null,
    cancelReason: null,
    note: 'Giao giờ hành chính.',
    version: 3,
    createdBy: 21,
    createdAt: '2026-09-25T09:15:00+07:00',
    updatedAt: '2026-09-25T15:40:00+07:00',
  },
  {
    id: 1002,
    code: 'SO-POS-260925-02',
    channel: 'POS',
    customerId: null,
    branchId: 1,
    warehouseId: 3,
    status: 'COMPLETED',
    orderDate: '2026-09-25T10:32:00+07:00',
    subtotal: 790_000,
    discountAmount: 0,
    shippingFee: 0,
    totalAmount: 790_000,
    paymentStatus: 'PAID',
    paymentMethod: 'CASH',
    requiresApproval: false,
    approvedBy: null,
    approvedAt: null,
    cancelReason: null,
    note: null,
    version: 1,
    createdBy: 22,
    createdAt: '2026-09-25T10:32:00+07:00',
    updatedAt: '2026-09-25T10:35:00+07:00',
  },
  {
    id: 1003,
    code: 'SO-WS-260924-03',
    channel: 'WHOLESALE',
    customerId: 2,
    branchId: 1,
    warehouseId: 1,
    status: 'PENDING_APPROVAL',
    orderDate: '2026-09-24T14:20:00+07:00',
    subtotal: 28_500_000,
    discountAmount: 1_500_000,
    shippingFee: 0,
    totalAmount: 27_000_000,
    paymentStatus: 'UNPAID',
    paymentMethod: 'CREDIT',
    requiresApproval: true,
    approvedBy: null,
    approvedAt: null,
    cancelReason: null,
    note: 'Đơn bán sỉ cần duyệt giá.',
    version: 2,
    createdBy: 23,
    createdAt: '2026-09-24T14:20:00+07:00',
    updatedAt: '2026-09-24T15:10:00+07:00',
  },
  {
    id: 1004,
    code: 'SO-WS-260923-04',
    channel: 'WHOLESALE',
    customerId: 4,
    branchId: 2,
    warehouseId: 2,
    status: 'CONFIRMED',
    orderDate: '2026-09-23T08:45:00+07:00',
    subtotal: 19_800_000,
    discountAmount: 800_000,
    shippingFee: 0,
    totalAmount: 19_000_000,
    paymentStatus: 'PARTIAL',
    paymentMethod: 'TRANSFER',
    requiresApproval: true,
    approvedBy: 11,
    approvedAt: '2026-09-23T09:30:00+07:00',
    cancelReason: null,
    note: 'Xuất hàng theo lịch đã thống nhất.',
    version: 4,
    createdBy: 23,
    createdAt: '2026-09-23T08:45:00+07:00',
    updatedAt: '2026-09-23T11:00:00+07:00',
  },
  {
    id: 1005,
    code: 'SO-WEB-260922-05',
    channel: 'WEBSITE',
    customerId: 3,
    branchId: 2,
    warehouseId: 2,
    status: 'PROCESSING',
    orderDate: '2026-09-22T16:05:00+07:00',
    subtotal: 2_580_000,
    discountAmount: 180_000,
    shippingFee: 30_000,
    totalAmount: 2_430_000,
    paymentStatus: 'PARTIAL',
    paymentMethod: 'COD',
    requiresApproval: false,
    approvedBy: null,
    approvedAt: null,
    cancelReason: null,
    note: null,
    version: 2,
    createdBy: 21,
    createdAt: '2026-09-22T16:05:00+07:00',
    updatedAt: '2026-09-23T08:10:00+07:00',
  },
  {
    id: 1006,
    code: 'SO-WEB-260921-06',
    channel: 'WEBSITE',
    customerId: 5,
    branchId: 1,
    warehouseId: 1,
    status: 'CANCELLED',
    orderDate: '2026-09-21T11:25:00+07:00',
    subtotal: 1_390_000,
    discountAmount: 0,
    shippingFee: 30_000,
    totalAmount: 1_420_000,
    paymentStatus: 'FAILED',
    paymentMethod: 'CARD',
    requiresApproval: false,
    approvedBy: null,
    approvedAt: null,
    cancelReason: 'Thanh toán thẻ không thành công và khách không tiếp tục đơn.',
    note: null,
    version: 2,
    createdBy: 21,
    createdAt: '2026-09-21T11:25:00+07:00',
    updatedAt: '2026-09-21T11:48:00+07:00',
  },
  {
    id: 1007,
    code: 'SO-POS-260920-07',
    channel: 'POS',
    customerId: 5,
    branchId: 2,
    warehouseId: 2,
    status: 'COMPLETED',
    orderDate: '2026-09-20T19:10:00+07:00',
    subtotal: 1_850_000,
    discountAmount: 100_000,
    shippingFee: 0,
    totalAmount: 1_750_000,
    paymentStatus: 'PAID',
    paymentMethod: 'CARD',
    requiresApproval: false,
    approvedBy: null,
    approvedAt: null,
    cancelReason: null,
    note: null,
    version: 1,
    createdBy: 22,
    createdAt: '2026-09-20T19:10:00+07:00',
    updatedAt: '2026-09-20T19:13:00+07:00',
  },
  {
    id: 1008,
    code: 'SO-WS-260919-08',
    channel: 'WHOLESALE',
    customerId: 2,
    branchId: 1,
    warehouseId: 1,
    status: 'REJECTED',
    orderDate: '2026-09-19T13:30:00+07:00',
    subtotal: 35_000_000,
    discountAmount: 4_500_000,
    shippingFee: 0,
    totalAmount: 30_500_000,
    paymentStatus: 'UNPAID',
    paymentMethod: 'CREDIT',
    requiresApproval: true,
    approvedBy: 12,
    approvedAt: '2026-09-19T14:05:00+07:00',
    cancelReason: null,
    note: 'Từ chối do mức chiết khấu vượt chính sách hiện tại.',
    version: 3,
    createdBy: 23,
    createdAt: '2026-09-19T13:30:00+07:00',
    updatedAt: '2026-09-19T14:05:00+07:00',
  },
  {
    id: 1009,
    code: 'SO-WEB-260918-09',
    channel: 'WEBSITE',
    customerId: 1,
    branchId: 1,
    warehouseId: 1,
    status: 'CONFIRMED',
    orderDate: '2026-09-18T09:40:00+07:00',
    subtotal: 980_000,
    discountAmount: 80_000,
    shippingFee: 25_000,
    totalAmount: 925_000,
    paymentStatus: 'UNPAID',
    paymentMethod: 'COD',
    requiresApproval: false,
    approvedBy: null,
    approvedAt: null,
    cancelReason: null,
    note: null,
    version: 1,
    createdBy: 21,
    createdAt: '2026-09-18T09:40:00+07:00',
    updatedAt: '2026-09-18T10:00:00+07:00',
  },
  {
    id: 1010,
    code: 'SO-POS-260917-10',
    channel: 'POS',
    customerId: null,
    branchId: 1,
    warehouseId: 3,
    status: 'COMPLETED',
    orderDate: '2026-09-17T15:18:00+07:00',
    subtotal: 620_000,
    discountAmount: 0,
    shippingFee: 0,
    totalAmount: 620_000,
    paymentStatus: 'REFUNDED',
    paymentMethod: 'CASH',
    requiresApproval: false,
    approvedBy: null,
    approvedAt: null,
    cancelReason: null,
    note: 'Khoản thanh toán đã được hoàn; nghiệp vụ trả hàng chờ schema riêng.',
    version: 2,
    createdBy: 22,
    createdAt: '2026-09-17T15:18:00+07:00',
    updatedAt: '2026-09-17T16:02:00+07:00',
  },
  {
    id: 1011,
    code: 'SO-WS-260916-11',
    channel: 'WHOLESALE',
    customerId: 4,
    branchId: 2,
    warehouseId: 2,
    status: 'DRAFT',
    orderDate: '2026-09-16T10:50:00+07:00',
    subtotal: 12_000_000,
    discountAmount: 0,
    shippingFee: 0,
    totalAmount: 12_000_000,
    paymentStatus: 'UNPAID',
    paymentMethod: 'CREDIT',
    requiresApproval: true,
    approvedBy: null,
    approvedAt: null,
    cancelReason: null,
    note: 'Đang hoàn thiện thông tin đơn.',
    version: 1,
    createdBy: 23,
    createdAt: '2026-09-16T10:50:00+07:00',
    updatedAt: '2026-09-16T10:50:00+07:00',
  },
  {
    id: 1012,
    code: 'SO-WEB-260915-12',
    channel: 'WEBSITE',
    customerId: 3,
    branchId: 2,
    warehouseId: 2,
    status: 'COMPLETED',
    orderDate: '2026-09-15T08:12:00+07:00',
    subtotal: 4_400_000,
    discountAmount: 400_000,
    shippingFee: 0,
    totalAmount: 4_000_000,
    paymentStatus: 'PAID',
    paymentMethod: 'TRANSFER',
    requiresApproval: false,
    approvedBy: null,
    approvedAt: null,
    cancelReason: null,
    note: null,
    version: 4,
    createdBy: 21,
    createdAt: '2026-09-15T08:12:00+07:00',
    updatedAt: '2026-09-17T17:00:00+07:00',
  },
];

const orderItems: SalesOrderItem[] = [
  { id: 1, orderId: 1001, productId: 3, unitId: 2, quantity: 2, conversionFactor: 1, baseQuantity: 2, unitPrice: 1_250_000, discountAmount: 150_000, lineTotal: 2_350_000, issuedQuantity: 2, note: null },
  { id: 2, orderId: 1001, productId: 4, unitId: 1, quantity: 1, conversionFactor: 1, baseQuantity: 1, unitPrice: 1_150_000, discountAmount: 110_000, lineTotal: 1_040_000, issuedQuantity: 1, note: null },
  { id: 3, orderId: 1002, productId: 1, unitId: 1, quantity: 2, conversionFactor: 1, baseQuantity: 2, unitPrice: 395_000, discountAmount: 0, lineTotal: 790_000, issuedQuantity: 2, note: null },
  { id: 4, orderId: 1003, productId: 1, unitId: 3, quantity: 4, conversionFactor: 10, baseQuantity: 40, unitPrice: 4_200_000, discountAmount: 800_000, lineTotal: 16_000_000, issuedQuantity: 0, note: 'Màu đen và trắng.' },
  { id: 5, orderId: 1003, productId: 5, unitId: 3, quantity: 3, conversionFactor: 10, baseQuantity: 30, unitPrice: 3_900_000, discountAmount: 700_000, lineTotal: 11_000_000, issuedQuantity: 0, note: null },
  { id: 6, orderId: 1004, productId: 6, unitId: 1, quantity: 12, conversionFactor: 1, baseQuantity: 12, unitPrice: 1_250_000, discountAmount: 600_000, lineTotal: 14_400_000, issuedQuantity: 0, note: null },
  { id: 7, orderId: 1004, productId: 4, unitId: 1, quantity: 4, conversionFactor: 1, baseQuantity: 4, unitPrice: 1_200_000, discountAmount: 200_000, lineTotal: 4_600_000, issuedQuantity: 0, note: null },
  { id: 8, orderId: 1005, productId: 2, unitId: 1, quantity: 2, conversionFactor: 1, baseQuantity: 2, unitPrice: 890_000, discountAmount: 100_000, lineTotal: 1_680_000, issuedQuantity: 1, note: null },
  { id: 9, orderId: 1005, productId: 1, unitId: 1, quantity: 2, conversionFactor: 1, baseQuantity: 2, unitPrice: 400_000, discountAmount: 80_000, lineTotal: 720_000, issuedQuantity: 0, note: null },
  { id: 10, orderId: 1006, productId: 6, unitId: 1, quantity: 1, conversionFactor: 1, baseQuantity: 1, unitPrice: 1_390_000, discountAmount: 0, lineTotal: 1_390_000, issuedQuantity: 0, note: null },
  { id: 11, orderId: 1007, productId: 3, unitId: 2, quantity: 1, conversionFactor: 1, baseQuantity: 1, unitPrice: 1_250_000, discountAmount: 50_000, lineTotal: 1_200_000, issuedQuantity: 1, note: null },
  { id: 12, orderId: 1007, productId: 5, unitId: 1, quantity: 2, conversionFactor: 1, baseQuantity: 2, unitPrice: 300_000, discountAmount: 50_000, lineTotal: 550_000, issuedQuantity: 2, note: null },
  { id: 13, orderId: 1008, productId: 2, unitId: 3, quantity: 5, conversionFactor: 10, baseQuantity: 50, unitPrice: 7_000_000, discountAmount: 4_500_000, lineTotal: 30_500_000, issuedQuantity: 0, note: null },
  { id: 14, orderId: 1009, productId: 4, unitId: 1, quantity: 1, conversionFactor: 1, baseQuantity: 1, unitPrice: 980_000, discountAmount: 80_000, lineTotal: 900_000, issuedQuantity: 0, note: null },
  { id: 15, orderId: 1010, productId: 5, unitId: 1, quantity: 2, conversionFactor: 1, baseQuantity: 2, unitPrice: 310_000, discountAmount: 0, lineTotal: 620_000, issuedQuantity: 2, note: null },
  { id: 16, orderId: 1011, productId: 1, unitId: 3, quantity: 3, conversionFactor: 10, baseQuantity: 30, unitPrice: 4_000_000, discountAmount: 0, lineTotal: 12_000_000, issuedQuantity: 0, note: null },
  { id: 17, orderId: 1012, productId: 6, unitId: 1, quantity: 2, conversionFactor: 1, baseQuantity: 2, unitPrice: 1_400_000, discountAmount: 200_000, lineTotal: 2_600_000, issuedQuantity: 2, note: null },
  { id: 18, orderId: 1012, productId: 4, unitId: 1, quantity: 2, conversionFactor: 1, baseQuantity: 2, unitPrice: 800_000, discountAmount: 200_000, lineTotal: 1_400_000, issuedQuantity: 2, note: null },
];

const payments: SalesOrderPayment[] = [
  { id: 501, orderId: 1001, method: 'TRANSFER', amount: 2_000_000, status: 'SUCCESS', referenceNo: 'VCB260925001', paidAt: '2026-09-25T09:20:00+07:00', createdAt: '2026-09-25T09:18:00+07:00' },
  { id: 502, orderId: 1001, method: 'TRANSFER', amount: 1_425_000, status: 'SUCCESS', referenceNo: 'VCB260925024', paidAt: '2026-09-25T09:26:00+07:00', createdAt: '2026-09-25T09:25:00+07:00' },
  { id: 503, orderId: 1002, method: 'CASH', amount: 790_000, status: 'SUCCESS', referenceNo: 'POS-Q1-10432', paidAt: '2026-09-25T10:33:00+07:00', createdAt: '2026-09-25T10:32:00+07:00' },
  { id: 504, orderId: 1004, method: 'TRANSFER', amount: 8_000_000, status: 'SUCCESS', referenceNo: 'MB260923481', paidAt: '2026-09-23T10:10:00+07:00', createdAt: '2026-09-23T10:05:00+07:00' },
  { id: 505, orderId: 1004, method: 'TRANSFER', amount: 11_000_000, status: 'PENDING', referenceNo: 'MB260923592', paidAt: null, createdAt: '2026-09-23T11:00:00+07:00' },
  { id: 506, orderId: 1005, method: 'COD', amount: 500_000, status: 'SUCCESS', referenceNo: 'COD-DEPOSIT-05', paidAt: '2026-09-22T16:10:00+07:00', createdAt: '2026-09-22T16:09:00+07:00' },
  { id: 507, orderId: 1006, method: 'CARD', amount: 1_420_000, status: 'FAILED', referenceNo: 'CARD-FAIL-260921', paidAt: null, createdAt: '2026-09-21T11:26:00+07:00' },
  { id: 508, orderId: 1007, method: 'CARD', amount: 1_750_000, status: 'SUCCESS', referenceNo: 'POS-HN-22019', paidAt: '2026-09-20T19:11:00+07:00', createdAt: '2026-09-20T19:10:00+07:00' },
  { id: 509, orderId: 1010, method: 'CASH', amount: 620_000, status: 'SUCCESS', referenceNo: 'POS-Q1-09881', paidAt: '2026-09-17T15:19:00+07:00', createdAt: '2026-09-17T15:18:00+07:00' },
  { id: 510, orderId: 1010, method: 'CASH', amount: 620_000, status: 'REFUNDED', referenceNo: 'RF-POS-Q1-09881', paidAt: '2026-09-17T16:02:00+07:00', createdAt: '2026-09-17T16:02:00+07:00' },
  { id: 511, orderId: 1012, method: 'TRANSFER', amount: 4_000_000, status: 'SUCCESS', referenceNo: 'TCB260915771', paidAt: '2026-09-15T08:20:00+07:00', createdAt: '2026-09-15T08:18:00+07:00' },
];

const deliveries: SalesOrderDelivery[] = [
  { id: 701, orderId: 1001, receiverName: 'Nguyễn Minh Anh', phone: '0901234567', addressLine: '125 Nguyễn Trãi', ward: 'Phường Bến Thành', district: 'Quận 1', province: 'TP. Hồ Chí Minh', carrier: 'Giao Hàng Nhanh', trackingNo: 'GHN260925001', status: 'SHIPPED', shippedAt: '2026-09-25T15:40:00+07:00', deliveredAt: null, createdAt: '2026-09-25T10:00:00+07:00' },
  { id: 702, orderId: 1004, receiverName: 'Nguyễn Văn Thành', phone: '0912345678', addressLine: '68 Trần Duy Hưng', ward: 'Phường Yên Hòa', district: 'Quận Cầu Giấy', province: 'Hà Nội', carrier: 'Viettel Post', trackingNo: null, status: 'PENDING', shippedAt: null, deliveredAt: null, createdAt: '2026-09-23T11:00:00+07:00' },
  { id: 703, orderId: 1005, receiverName: 'Lê Hoàng Nam', phone: '0934567890', addressLine: '21 Láng Hạ', ward: 'Phường Thành Công', district: 'Quận Ba Đình', province: 'Hà Nội', carrier: 'J&T Express', trackingNo: null, status: 'PENDING', shippedAt: null, deliveredAt: null, createdAt: '2026-09-22T16:15:00+07:00' },
  { id: 704, orderId: 1006, receiverName: 'Trần Thanh Hà', phone: '0987654321', addressLine: '84 Võ Văn Tần', ward: 'Phường Võ Thị Sáu', district: 'Quận 3', province: 'TP. Hồ Chí Minh', carrier: null, trackingNo: null, status: 'FAILED', shippedAt: null, deliveredAt: null, createdAt: '2026-09-21T11:30:00+07:00' },
  { id: 705, orderId: 1009, receiverName: 'Nguyễn Minh Anh', phone: '0901234567', addressLine: '125 Nguyễn Trãi', ward: 'Phường Bến Thành', district: 'Quận 1', province: 'TP. Hồ Chí Minh', carrier: 'Giao Hàng Nhanh', trackingNo: null, status: 'PENDING', shippedAt: null, deliveredAt: null, createdAt: '2026-09-18T09:45:00+07:00' },
  { id: 706, orderId: 1012, receiverName: 'Lê Hoàng Nam', phone: '0934567890', addressLine: '21 Láng Hạ', ward: 'Phường Thành Công', district: 'Quận Ba Đình', province: 'Hà Nội', carrier: 'Giao Hàng Tiết Kiệm', trackingNo: 'GHTK260915882', status: 'DELIVERED', shippedAt: '2026-09-16T08:00:00+07:00', deliveredAt: '2026-09-17T16:45:00+07:00', createdAt: '2026-09-15T09:00:00+07:00' },
];

const wait = <T>(value: T) => new Promise<T>((resolve) => window.setTimeout(() => resolve(value), 180));
const normalize = (value: string) => value.trim().toLocaleLowerCase('vi-VN');
const findName = (records: NamedReference[], id: number) =>
  records.find((record) => record.id === id)?.name ?? 'Không xác định';

function enrichOrder(order: SalesOrder): SalesOrderRecord {
  return {
    ...order,
    customerName: order.customerId === null ? 'Khách lẻ' : findName(customers, order.customerId),
    branchName: findName(branches, order.branchId),
    warehouseName: findName(warehouses, order.warehouseId),
  };
}

function inDateRange(value: string, dateFrom?: string, dateTo?: string) {
  const date = value.slice(0, 10);
  return (!dateFrom || date >= dateFrom) && (!dateTo || date <= dateTo);
}

function paginate<T>(records: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return records.slice(start, start + pageSize);
}

const repository: SalesOrderRepository = {
  async listOrders(filters: SalesOrderFilters, page: number, pageSize: number): Promise<SalesOrderListResult> {
    const keyword = normalize(filters.keyword);
    const filtered = orders
      .filter((order) => {
        const record = enrichOrder(order);
        const matchesKeyword =
          !keyword ||
          normalize(record.code).includes(keyword) ||
          normalize(record.customerName).includes(keyword);
        return (
          matchesKeyword &&
          (!filters.retailOnly || order.channel !== 'WHOLESALE') &&
          (filters.channel === 'ALL' || order.channel === filters.channel) &&
          (filters.status === 'ALL' || order.status === filters.status) &&
          (filters.paymentStatus === 'ALL' || order.paymentStatus === filters.paymentStatus) &&
          (!filters.branchId || order.branchId === filters.branchId) &&
          (!filters.warehouseId || order.warehouseId === filters.warehouseId) &&
          inDateRange(order.orderDate, filters.dateFrom, filters.dateTo)
        );
      })
      .sort((left, right) => right.orderDate.localeCompare(left.orderDate))
      .map(enrichOrder);

    return wait({
      content: paginate(filtered, page, pageSize),
      totalElements: filtered.length,
      page,
      size: pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    });
  },

  async getOrderById(id: number): Promise<SalesOrderDetail> {
    const order = orders.find((item) => item.id === id);
    if (!order) throw new Error('Không tìm thấy đơn hàng.');

    return wait({
      ...enrichOrder(order),
      approverName: order.approvedBy ? findName(users, order.approvedBy) : null,
      items: orderItems
        .filter((item) => item.orderId === id)
        .map((item) => {
          const product = products.find((record) => record.id === item.productId);
          return {
            ...item,
            productCode: product?.code ?? '—',
            productName: product?.name ?? 'Không xác định',
            unitName: findName(units, item.unitId),
          };
        }),
      payments: payments.filter((payment) => payment.orderId === id),
      deliveries: deliveries.filter((delivery) => delivery.orderId === id),
    });
  },

  async listPayments(filters: SalesPaymentFilters, page: number, pageSize: number): Promise<SalesPaymentListResult> {
    const orderCode = normalize(filters.orderCode);
    const filtered = payments
      .map((payment): SalesPaymentRecord => {
        const order = orders.find((item) => item.id === payment.orderId);
        return {
          ...payment,
          orderCode: order?.code ?? 'Không xác định',
          customerName:
            order?.customerId === null
              ? 'Khách lẻ'
              : order?.customerId
                ? findName(customers, order.customerId)
                : 'Không xác định',
        };
      })
      .filter((payment) => {
        const paymentDate = payment.paidAt ?? payment.createdAt;
        return (
          (!orderCode || normalize(payment.orderCode).includes(orderCode)) &&
          (filters.method === 'ALL' || payment.method === filters.method) &&
          (filters.status === 'ALL' || payment.status === filters.status) &&
          inDateRange(paymentDate, filters.dateFrom, filters.dateTo)
        );
      })
      .sort((left, right) => (right.paidAt ?? right.createdAt).localeCompare(left.paidAt ?? left.createdAt));

    return wait({
      content: paginate(filtered, page, pageSize),
      totalElements: filtered.length,
      page,
      size: pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    });
  },

  async getPaymentById(id: number): Promise<SalesPaymentRecord> {
    const payment = payments.find((item) => item.id === id);
    if (!payment) throw new Error('Không tìm thấy giao dịch thanh toán.');
    const order = orders.find((item) => item.id === payment.orderId);
    return wait({
      ...payment,
      orderCode: order?.code ?? 'Không xác định',
      customerName:
        order?.customerId === null
          ? 'Khách lẻ'
          : order?.customerId
            ? findName(customers, order.customerId)
            : 'Không xác định',
    });
  },

  async getReferenceData(): Promise<SalesOrderReferenceData> {
    return wait({
      branches: branches.map(({ id, name }) => ({ value: id, label: name })),
      warehouses: warehouses.map(({ id, name }) => ({ value: id, label: name })),
    });
  },
};

export const mockSalesOrderRepository = repository;
