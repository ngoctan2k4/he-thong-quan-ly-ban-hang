import type {
  GoodsReceiptDetail,
  GoodsReceiptFilters,
  GoodsReceiptFormValues,
  GoodsReceiptItemRecord,
  GoodsReceiptListResult,
  GoodsReceiptRecord,
  PurchaseOrderDetail,
  PurchaseOrderFilters,
  PurchaseOrderFormValues,
  PurchaseOrderItemRecord,
  PurchaseOrderListResult,
  PurchaseOrderRecord,
  PurchaseProductReference,
  PurchaseReferenceData,
} from '../features/purchasing/purchasing.model';
import type { PurchasingRepository } from '../features/purchasing/purchasing.repository';
import type {
  GoodsReceipt,
  GoodsReceiptItem,
  PurchaseOrder,
  PurchaseOrderItem,
} from '../types/purchase';

interface NamedReference {
  id: number;
  code: string;
  name: string;
}

const suppliers: NamedReference[] = [
  { id: 1, code: 'NCC0001', name: 'Công ty TNHH Thương mại An Khang' },
  { id: 2, code: 'NCC0002', name: 'Công ty CP Phân phối Minh Phát' },
  { id: 3, code: 'NCC0003', name: 'Hộ kinh doanh Bếp Việt' },
  { id: 4, code: 'NCC0004', name: 'Công ty TNHH Mỹ phẩm Lá' },
  { id: 5, code: 'NCC0005', name: 'Công ty TNHH Nông sản Đồi Gió' },
];

const warehouses: NamedReference[] = [
  { id: 1, code: 'KHO-HCM', name: 'Kho trung tâm HCM' },
  { id: 2, code: 'KHO-HN', name: 'Kho trung tâm Hà Nội' },
  { id: 3, code: 'KHO-Q1', name: 'Kho bán lẻ Quận 1' },
];

const users: NamedReference[] = [
  { id: 11, code: 'USR-11', name: 'Lê Thu Trang' },
  { id: 12, code: 'USR-12', name: 'Phạm Quốc Bảo' },
  { id: 21, code: 'USR-21', name: 'Nguyễn Mai Linh' },
  { id: 22, code: 'USR-22', name: 'Trần Đức Minh' },
];

const products: PurchaseProductReference[] = [
  {
    id: 1,
    code: 'TSH-BLK-M',
    name: 'Áo thun cotton cổ tròn',
    defaultUnitId: 1,
    suggestedUnitCost: 142_000,
    units: [
      { id: 1, name: 'Cái', conversionFactor: 1 },
      { id: 3, name: 'Thùng (10 cái)', conversionFactor: 10 },
    ],
  },
  {
    id: 2,
    code: 'SHO-RUN-42',
    name: 'Giày chạy bộ đế nhẹ',
    defaultUnitId: 2,
    suggestedUnitCost: 820_000,
    units: [
      { id: 2, name: 'Đôi', conversionFactor: 1 },
      { id: 9, name: 'Thùng (6 đôi)', conversionFactor: 6 },
    ],
  },
  {
    id: 3,
    code: 'EAR-BT-PRO',
    name: 'Tai nghe Bluetooth Pro',
    defaultUnitId: 6,
    suggestedUnitCost: 545_000,
    units: [{ id: 6, name: 'Bộ', conversionFactor: 1 }],
  },
  {
    id: 4,
    code: 'KET-GLS-18',
    name: 'Ấm đun thủy tinh 1,8 lít',
    defaultUnitId: 1,
    suggestedUnitCost: 295_000,
    units: [
      { id: 1, name: 'Cái', conversionFactor: 1 },
      { id: 3, name: 'Thùng (10 cái)', conversionFactor: 10 },
    ],
  },
  {
    id: 5,
    code: 'SER-VIT-C30',
    name: 'Tinh chất Vitamin C 30 ml',
    defaultUnitId: 8,
    suggestedUnitCost: 221_000,
    units: [
      { id: 8, name: 'Chai', conversionFactor: 1 },
      { id: 10, name: 'Hộp (12 chai)', conversionFactor: 12 },
    ],
  },
  {
    id: 6,
    code: 'COF-ARA-500',
    name: 'Cà phê Arabica rang vừa 500 g',
    defaultUnitId: 4,
    suggestedUnitCost: 175_000,
    units: [
      { id: 4, name: 'Gói', conversionFactor: 1 },
      { id: 5, name: 'Thùng (12 gói)', conversionFactor: 12 },
    ],
  },
  {
    id: 7,
    code: 'PAN-NST-24',
    name: 'Chảo chống dính 24 cm',
    defaultUnitId: 1,
    suggestedUnitCost: 218_000,
    units: [{ id: 1, name: 'Cái', conversionFactor: 1 }],
  },
  {
    id: 8,
    code: 'PWR-20K-BLK',
    name: 'Pin sạc dự phòng 20.000 mAh',
    defaultUnitId: 1,
    suggestedUnitCost: 482_000,
    units: [{ id: 1, name: 'Cái', conversionFactor: 1 }],
  },
];

const seedPurchaseOrders: PurchaseOrder[] = [
  {
    id: 1001,
    code: 'PO-260928-001',
    supplierId: 1,
    warehouseId: 1,
    status: 'DRAFT',
    orderDate: '2026-09-28T08:15:00+07:00',
    expectedDate: '2026-10-02T00:00:00+07:00',
    totalAmount: 10_160_000,
    requiresApproval: false,
    approvedBy: null,
    approvedAt: null,
    sourceType: 'MANUAL',
    orderKind: 'RETAIL',
    note: 'Giao trong giờ hành chính.',
    version: 1,
    createdBy: 21,
    createdAt: '2026-09-28T08:15:00+07:00',
    updatedAt: '2026-09-28T08:15:00+07:00',
  },
  {
    id: 1002,
    code: 'PO-260927-002',
    supplierId: 2,
    warehouseId: 2,
    status: 'PENDING_APPROVAL',
    orderDate: '2026-09-27T10:20:00+07:00',
    expectedDate: '2026-10-05T00:00:00+07:00',
    totalAmount: 20_825_000,
    requiresApproval: true,
    approvedBy: null,
    approvedAt: null,
    sourceType: 'AI_PROPOSAL',
    orderKind: 'STANDARD',
    note: 'Đề xuất theo tốc độ bán 30 ngày.',
    version: 2,
    createdBy: 22,
    createdAt: '2026-09-27T10:20:00+07:00',
    updatedAt: '2026-09-27T11:05:00+07:00',
  },
  {
    id: 1003,
    code: 'PO-260926-003',
    supplierId: 3,
    warehouseId: 1,
    status: 'CONFIRMED',
    orderDate: '2026-09-26T09:00:00+07:00',
    expectedDate: '2026-09-30T00:00:00+07:00',
    totalAmount: 5_900_000,
    requiresApproval: true,
    approvedBy: 11,
    approvedAt: '2026-09-26T10:30:00+07:00',
    sourceType: 'MANUAL',
    orderKind: 'RETAIL',
    note: null,
    version: 3,
    createdBy: 21,
    createdAt: '2026-09-26T09:00:00+07:00',
    updatedAt: '2026-09-26T10:30:00+07:00',
  },
  {
    id: 1004,
    code: 'PO-260924-004',
    supplierId: 5,
    warehouseId: 1,
    status: 'PARTIALLY_RECEIVED',
    orderDate: '2026-09-24T14:10:00+07:00',
    expectedDate: '2026-09-28T00:00:00+07:00',
    totalAmount: 7_350_000,
    requiresApproval: false,
    approvedBy: null,
    approvedAt: null,
    sourceType: 'RULE_ENGINE',
    orderKind: 'STANDARD',
    note: 'Bổ sung tồn tối thiểu cho kho HCM.',
    version: 4,
    createdBy: 22,
    createdAt: '2026-09-24T14:10:00+07:00',
    updatedAt: '2026-09-27T15:30:00+07:00',
  },
  {
    id: 1005,
    code: 'PO-260920-005',
    supplierId: 1,
    warehouseId: 3,
    status: 'RECEIVED_FULL',
    orderDate: '2026-09-20T08:30:00+07:00',
    expectedDate: '2026-09-23T00:00:00+07:00',
    totalAmount: 5_680_000,
    requiresApproval: false,
    approvedBy: null,
    approvedAt: null,
    sourceType: 'MANUAL',
    orderKind: 'RETAIL',
    note: null,
    version: 5,
    createdBy: 21,
    createdAt: '2026-09-20T08:30:00+07:00',
    updatedAt: '2026-09-23T16:20:00+07:00',
  },
  {
    id: 1006,
    code: 'PO-260918-006',
    supplierId: 4,
    warehouseId: 2,
    status: 'RECEIVED_WITH_DISCREPANCY',
    orderDate: '2026-09-18T09:45:00+07:00',
    expectedDate: '2026-09-24T00:00:00+07:00',
    totalAmount: 4_620_000,
    requiresApproval: true,
    approvedBy: 12,
    approvedAt: '2026-09-18T11:00:00+07:00',
    sourceType: 'AI_PROPOSAL',
    orderKind: 'STANDARD',
    note: 'Kiểm tra kỹ tem niêm phong khi nhận.',
    version: 6,
    createdBy: 22,
    createdAt: '2026-09-18T09:45:00+07:00',
    updatedAt: '2026-09-24T17:00:00+07:00',
  },
  {
    id: 1007,
    code: 'PO-260915-007',
    supplierId: 2,
    warehouseId: 2,
    status: 'RECEIVED_PARTIAL',
    orderDate: '2026-09-15T13:30:00+07:00',
    expectedDate: '2026-09-21T00:00:00+07:00',
    totalAmount: 10_900_000,
    requiresApproval: false,
    approvedBy: null,
    approvedAt: null,
    sourceType: 'MANUAL',
    orderKind: 'STANDARD',
    note: 'Nhà cung cấp xác nhận thiếu 8 bộ.',
    version: 4,
    createdBy: 21,
    createdAt: '2026-09-15T13:30:00+07:00',
    updatedAt: '2026-09-21T16:40:00+07:00',
  },
  {
    id: 1008,
    code: 'PO-260912-008',
    supplierId: 3,
    warehouseId: 1,
    status: 'CANCELLED',
    orderDate: '2026-09-12T08:00:00+07:00',
    expectedDate: '2026-09-16T00:00:00+07:00',
    totalAmount: 4_360_000,
    requiresApproval: false,
    approvedBy: null,
    approvedAt: null,
    sourceType: 'MANUAL',
    orderKind: 'RETAIL',
    note: 'Hủy do thay đổi kế hoạch nhập hàng.',
    version: 2,
    createdBy: 21,
    createdAt: '2026-09-12T08:00:00+07:00',
    updatedAt: '2026-09-12T15:10:00+07:00',
  },
  {
    id: 1009,
    code: 'PO-260910-009',
    supplierId: 4,
    warehouseId: 1,
    status: 'REJECTED',
    orderDate: '2026-09-10T09:10:00+07:00',
    expectedDate: '2026-09-18T00:00:00+07:00',
    totalAmount: 13_260_000,
    requiresApproval: true,
    approvedBy: 12,
    approvedAt: '2026-09-10T10:05:00+07:00',
    sourceType: 'RULE_ENGINE',
    orderKind: 'STANDARD',
    note: 'Từ chối do vượt hạn mức ngân sách.',
    version: 2,
    createdBy: 22,
    createdAt: '2026-09-10T09:10:00+07:00',
    updatedAt: '2026-09-10T10:05:00+07:00',
  },
];

const seedPurchaseOrderItems: PurchaseOrderItem[] = [
  { id: 10011, purchaseOrderId: 1001, productId: 1, unitId: 3, conversionFactor: 10, orderedQty: 4, baseOrderedQty: 40, receivedQty: 0, unitPrice: 1_420_000, lineTotal: 5_680_000 },
  { id: 10012, purchaseOrderId: 1001, productId: 2, unitId: 2, conversionFactor: 1, orderedQty: 6, baseOrderedQty: 6, receivedQty: 0, unitPrice: 746_666.67, lineTotal: 4_480_000 },
  { id: 10021, purchaseOrderId: 1002, productId: 3, unitId: 6, conversionFactor: 1, orderedQty: 25, baseOrderedQty: 25, receivedQty: 0, unitPrice: 545_000, lineTotal: 13_625_000 },
  { id: 10022, purchaseOrderId: 1002, productId: 8, unitId: 1, conversionFactor: 1, orderedQty: 15, baseOrderedQty: 15, receivedQty: 0, unitPrice: 480_000, lineTotal: 7_200_000 },
  { id: 10031, purchaseOrderId: 1003, productId: 4, unitId: 1, conversionFactor: 1, orderedQty: 20, baseOrderedQty: 20, receivedQty: 0, unitPrice: 295_000, lineTotal: 5_900_000 },
  { id: 10041, purchaseOrderId: 1004, productId: 6, unitId: 4, conversionFactor: 1, orderedQty: 30, baseOrderedQty: 30, receivedQty: 20, unitPrice: 175_000, lineTotal: 5_250_000 },
  { id: 10042, purchaseOrderId: 1004, productId: 7, unitId: 1, conversionFactor: 1, orderedQty: 10, baseOrderedQty: 10, receivedQty: 10, unitPrice: 210_000, lineTotal: 2_100_000 },
  { id: 10051, purchaseOrderId: 1005, productId: 1, unitId: 3, conversionFactor: 10, orderedQty: 4, baseOrderedQty: 40, receivedQty: 40, unitPrice: 1_420_000, lineTotal: 5_680_000 },
  { id: 10061, purchaseOrderId: 1006, productId: 5, unitId: 8, conversionFactor: 1, orderedQty: 10, baseOrderedQty: 10, receivedQty: 10, unitPrice: 221_000, lineTotal: 2_210_000 },
  { id: 10062, purchaseOrderId: 1006, productId: 8, unitId: 1, conversionFactor: 1, orderedQty: 5, baseOrderedQty: 5, receivedQty: 5, unitPrice: 482_000, lineTotal: 2_410_000 },
  { id: 10071, purchaseOrderId: 1007, productId: 3, unitId: 6, conversionFactor: 1, orderedQty: 20, baseOrderedQty: 20, receivedQty: 12, unitPrice: 545_000, lineTotal: 10_900_000 },
  { id: 10081, purchaseOrderId: 1008, productId: 7, unitId: 1, conversionFactor: 1, orderedQty: 20, baseOrderedQty: 20, receivedQty: 0, unitPrice: 218_000, lineTotal: 4_360_000 },
  { id: 10091, purchaseOrderId: 1009, productId: 5, unitId: 10, conversionFactor: 12, orderedQty: 5, baseOrderedQty: 60, receivedQty: 0, unitPrice: 2_652_000, lineTotal: 13_260_000 },
];

const seedGoodsReceipts: GoodsReceipt[] = [
  { id: 2001, code: 'GR-260927-001', purchaseOrderId: 1004, supplierId: 5, warehouseId: 1, status: 'CONFIRMED', receivedDate: '2026-09-27T15:00:00+07:00', totalAmount: 5_600_000, note: 'Nhận đợt 1.', createdBy: 21, confirmedBy: 11, confirmedAt: '2026-09-27T15:30:00+07:00', createdAt: '2026-09-27T14:50:00+07:00', updatedAt: '2026-09-27T15:30:00+07:00' },
  { id: 2002, code: 'GR-260923-002', purchaseOrderId: 1005, supplierId: 1, warehouseId: 3, status: 'CONFIRMED', receivedDate: '2026-09-23T16:00:00+07:00', totalAmount: 5_680_000, note: 'Nhận đủ theo PO.', createdBy: 21, confirmedBy: 11, confirmedAt: '2026-09-23T16:20:00+07:00', createdAt: '2026-09-23T15:50:00+07:00', updatedAt: '2026-09-23T16:20:00+07:00' },
  { id: 2003, code: 'GR-260924-003', purchaseOrderId: 1006, supplierId: 4, warehouseId: 2, status: 'CONFIRMED', receivedDate: '2026-09-24T16:15:00+07:00', totalAmount: 4_620_000, note: 'Có hàng hỏng và sai mã hàng.', createdBy: 22, confirmedBy: 12, confirmedAt: '2026-09-24T17:00:00+07:00', createdAt: '2026-09-24T16:10:00+07:00', updatedAt: '2026-09-24T17:00:00+07:00' },
  { id: 2004, code: 'GR-260921-004', purchaseOrderId: 1007, supplierId: 2, warehouseId: 2, status: 'CONFIRMED', receivedDate: '2026-09-21T16:00:00+07:00', totalAmount: 6_540_000, note: 'Thiếu 8 bộ so với PO.', createdBy: 21, confirmedBy: 12, confirmedAt: '2026-09-21T16:40:00+07:00', createdAt: '2026-09-21T15:55:00+07:00', updatedAt: '2026-09-21T16:40:00+07:00' },
  { id: 2005, code: 'GR-260919-005', purchaseOrderId: null, supplierId: 3, warehouseId: 1, status: 'CONFIRMED', receivedDate: '2026-09-19T09:20:00+07:00', totalAmount: 2_398_000, note: 'Nhập bổ sung không có PO; giao thừa 1 cái.', createdBy: 22, confirmedBy: 11, confirmedAt: '2026-09-19T09:45:00+07:00', createdAt: '2026-09-19T09:10:00+07:00', updatedAt: '2026-09-19T09:45:00+07:00' },
  { id: 2006, code: 'GR-260928-006', purchaseOrderId: null, supplierId: 1, warehouseId: 3, status: 'DRAFT', receivedDate: '2026-09-28T09:30:00+07:00', totalAmount: 1_420_000, note: 'Phiếu nháp nhập hàng trực tiếp.', createdBy: 21, confirmedBy: null, confirmedAt: null, createdAt: '2026-09-28T09:30:00+07:00', updatedAt: '2026-09-28T09:30:00+07:00' },
];

const seedGoodsReceiptItems: GoodsReceiptItem[] = [
  { id: 20011, goodsReceiptId: 2001, purchaseOrderItemId: 10041, productId: 6, unitId: 4, conversionFactor: 1, receivedQty: 20, baseReceivedQty: 20, damagedQty: 0, unitCost: 175_000, discrepancyType: 'SHORTAGE', note: 'Còn thiếu 10 gói.' },
  { id: 20012, goodsReceiptId: 2001, purchaseOrderItemId: 10042, productId: 7, unitId: 1, conversionFactor: 1, receivedQty: 10, baseReceivedQty: 10, damagedQty: 0, unitCost: 210_000, discrepancyType: 'NONE', note: null },
  { id: 20021, goodsReceiptId: 2002, purchaseOrderItemId: 10051, productId: 1, unitId: 3, conversionFactor: 10, receivedQty: 4, baseReceivedQty: 40, damagedQty: 0, unitCost: 1_420_000, discrepancyType: 'NONE', note: null },
  { id: 20031, goodsReceiptId: 2003, purchaseOrderItemId: 10061, productId: 5, unitId: 8, conversionFactor: 1, receivedQty: 10, baseReceivedQty: 10, damagedQty: 2, unitCost: 221_000, discrepancyType: 'DAMAGED', note: 'Hai chai vỡ nắp.' },
  { id: 20032, goodsReceiptId: 2003, purchaseOrderItemId: 10062, productId: 8, unitId: 1, conversionFactor: 1, receivedQty: 5, baseReceivedQty: 5, damagedQty: 0, unitCost: 482_000, discrepancyType: 'WRONG_ITEM', note: 'Sai màu so với mã đặt.' },
  { id: 20041, goodsReceiptId: 2004, purchaseOrderItemId: 10071, productId: 3, unitId: 6, conversionFactor: 1, receivedQty: 12, baseReceivedQty: 12, damagedQty: 0, unitCost: 545_000, discrepancyType: 'SHORTAGE', note: 'Nhà cung cấp giao thiếu 8 bộ.' },
  { id: 20051, goodsReceiptId: 2005, purchaseOrderItemId: null, productId: 7, unitId: 1, conversionFactor: 1, receivedQty: 11, baseReceivedQty: 11, damagedQty: 0, unitCost: 218_000, discrepancyType: 'OVERAGE', note: 'Thực nhận 11, chứng từ giao 10.' },
  { id: 20061, goodsReceiptId: 2006, purchaseOrderItemId: null, productId: 1, unitId: 3, conversionFactor: 10, receivedQty: 1, baseReceivedQty: 10, damagedQty: 0, unitCost: 1_420_000, discrepancyType: 'NONE', note: null },
];

let purchaseOrders = seedPurchaseOrders.map((item) => ({ ...item }));
let purchaseOrderItems = seedPurchaseOrderItems.map((item) => ({ ...item }));
let goodsReceipts = seedGoodsReceipts.map((item) => ({ ...item }));
let goodsReceiptItems = seedGoodsReceiptItems.map((item) => ({ ...item }));

function wait(duration = 260): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function normalize(value?: string | null): string {
  return value?.trim().toLocaleLowerCase('vi-VN') ?? '';
}

function findName(records: NamedReference[], id: number): string {
  return records.find((item) => item.id === id)?.name ?? `#${id}`;
}

function findProduct(productId: number): PurchaseProductReference {
  const product = products.find((item) => item.id === productId);
  if (!product) throw new Error('Không tìm thấy sản phẩm tham chiếu.');
  return product;
}

function findUnitName(productId: number, unitId: number): string {
  return findProduct(productId).units.find((item) => item.id === unitId)?.name ?? `#${unitId}`;
}

function toPurchaseOrderRecord(order: PurchaseOrder): PurchaseOrderRecord {
  return {
    ...order,
    supplierName: findName(suppliers, order.supplierId),
    warehouseName: findName(warehouses, order.warehouseId),
    approverName: order.approvedBy ? findName(users, order.approvedBy) : null,
    creatorName: findName(users, order.createdBy),
  };
}

function toPurchaseOrderItemRecord(item: PurchaseOrderItem): PurchaseOrderItemRecord {
  const product = findProduct(item.productId);
  return {
    ...item,
    productCode: product.code,
    productName: product.name,
    unitName: findUnitName(item.productId, item.unitId),
  };
}

function toGoodsReceiptRecord(receipt: GoodsReceipt): GoodsReceiptRecord {
  const order = receipt.purchaseOrderId
    ? purchaseOrders.find((item) => item.id === receipt.purchaseOrderId)
    : undefined;
  return {
    ...receipt,
    purchaseOrderCode: order?.code ?? null,
    supplierName: findName(suppliers, receipt.supplierId),
    warehouseName: findName(warehouses, receipt.warehouseId),
    creatorName: findName(users, receipt.createdBy),
    confirmerName: receipt.confirmedBy ? findName(users, receipt.confirmedBy) : null,
  };
}

function toGoodsReceiptItemRecord(item: GoodsReceiptItem): GoodsReceiptItemRecord {
  const product = findProduct(item.productId);
  return {
    ...item,
    productCode: product.code,
    productName: product.name,
    unitName: findUnitName(item.productId, item.unitId),
  };
}

function buildPurchaseOrderDetail(id: number): PurchaseOrderDetail {
  const order = purchaseOrders.find((item) => item.id === id);
  if (!order) throw new Error('Không tìm thấy đơn mua.');
  return {
    ...toPurchaseOrderRecord(order),
    items: purchaseOrderItems
      .filter((item) => item.purchaseOrderId === id)
      .map(toPurchaseOrderItemRecord),
    receipts: goodsReceipts
      .filter((item) => item.purchaseOrderId === id)
      .map(toGoodsReceiptRecord),
  };
}

function buildGoodsReceiptDetail(id: number): GoodsReceiptDetail {
  const receipt = goodsReceipts.find((item) => item.id === id);
  if (!receipt) throw new Error('Không tìm thấy phiếu nhận hàng.');
  return {
    ...toGoodsReceiptRecord(receipt),
    items: goodsReceiptItems
      .filter((item) => item.goodsReceiptId === id)
      .map(toGoodsReceiptItemRecord),
  };
}

function isDateInRange(value: string, from?: string, to?: string): boolean {
  const date = value.slice(0, 10);
  return (!from || date >= from) && (!to || date <= to);
}

async function listPurchaseOrders(
  filters: PurchaseOrderFilters,
  page: number,
  pageSize: number,
): Promise<PurchaseOrderListResult> {
  await wait();
  const keyword = normalize(filters.keyword);
  const filtered = purchaseOrders
    .filter((order) => {
      const matchesKeyword = !keyword || normalize(order.code).includes(keyword);
      const matchesExpectedDate = !filters.expectedDate
        || order.expectedDate.slice(0, 10) === filters.expectedDate;
      return matchesKeyword
        && (!filters.retailOnly || order.orderKind === 'RETAIL')
        && (!filters.supplierId || order.supplierId === filters.supplierId)
        && (!filters.warehouseId || order.warehouseId === filters.warehouseId)
        && (filters.status === 'ALL' || order.status === filters.status)
        && (filters.sourceType === 'ALL' || order.sourceType === filters.sourceType)
        && isDateInRange(order.orderDate, filters.orderDateFrom, filters.orderDateTo)
        && matchesExpectedDate;
    })
    .sort((a, b) => b.orderDate.localeCompare(a.orderDate));
  const start = (page - 1) * pageSize;
  return {
    content: filtered.slice(start, start + pageSize).map(toPurchaseOrderRecord),
    totalElements: filtered.length,
    page,
    size: pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}

async function getPurchaseOrderById(id: number): Promise<PurchaseOrderDetail> {
  await wait(180);
  return buildPurchaseOrderDetail(id);
}

function mapPurchaseOrderItems(
  orderId: number,
  values: PurchaseOrderFormValues,
  existingItems: PurchaseOrderItem[] = [],
): PurchaseOrderItem[] {
  let nextItemId = Math.max(...purchaseOrderItems.map((item) => item.id), 0) + 1;
  return values.items.map((item) => ({
    id: item.id ?? existingItems.find((record) => record.productId === item.productId)?.id ?? nextItemId++,
    purchaseOrderId: orderId,
    productId: item.productId,
    unitId: item.unitId,
    conversionFactor: item.conversionFactor,
    orderedQty: item.orderedQty,
    baseOrderedQty: item.orderedQty * item.conversionFactor,
    receivedQty: existingItems.find((record) => record.id === item.id)?.receivedQty ?? 0,
    unitPrice: item.unitPrice,
    lineTotal: item.orderedQty * item.unitPrice,
  }));
}

async function createPurchaseOrder(values: PurchaseOrderFormValues): Promise<PurchaseOrderDetail> {
  await wait(360);
  const now = new Date().toISOString();
  const id = Math.max(...purchaseOrders.map((item) => item.id), 0) + 1;
  const newItems = mapPurchaseOrderItems(id, values);
  const order: PurchaseOrder = {
    id,
    code: `PO-${now.slice(2, 10).replaceAll('-', '')}-${String(id).slice(-3)}`,
    supplierId: values.supplierId,
    warehouseId: values.warehouseId,
    status: 'DRAFT',
    orderDate: values.orderDate,
    expectedDate: values.expectedDate,
    totalAmount: newItems.reduce((sum, item) => sum + item.lineTotal, 0),
    requiresApproval: values.requiresApproval,
    approvedBy: null,
    approvedAt: null,
    sourceType: 'MANUAL',
    orderKind: values.orderKind,
    note: values.note?.trim() || null,
    version: 1,
    createdBy: 21,
    createdAt: now,
    updatedAt: now,
  };
  purchaseOrders = [order, ...purchaseOrders];
  purchaseOrderItems = [...newItems, ...purchaseOrderItems];
  return buildPurchaseOrderDetail(id);
}

async function updatePurchaseOrder(
  id: number,
  values: PurchaseOrderFormValues,
): Promise<PurchaseOrderDetail> {
  await wait(360);
  const current = purchaseOrders.find((item) => item.id === id);
  if (!current) throw new Error('Không tìm thấy đơn mua cần cập nhật.');
  if (current.status !== 'DRAFT') throw new Error('Chỉ đơn mua nháp mới được chỉnh sửa.');
  const existingItems = purchaseOrderItems.filter((item) => item.purchaseOrderId === id);
  const nextItems = mapPurchaseOrderItems(id, values, existingItems);
  const updated: PurchaseOrder = {
    ...current,
    supplierId: values.supplierId,
    warehouseId: values.warehouseId,
    orderDate: values.orderDate,
    expectedDate: values.expectedDate,
    totalAmount: nextItems.reduce((sum, item) => sum + item.lineTotal, 0),
    requiresApproval: values.requiresApproval,
    orderKind: values.orderKind,
    note: values.note?.trim() || null,
    version: current.version + 1,
    updatedAt: new Date().toISOString(),
  };
  purchaseOrders = purchaseOrders.map((item) => item.id === id ? updated : item);
  purchaseOrderItems = [
    ...nextItems,
    ...purchaseOrderItems.filter((item) => item.purchaseOrderId !== id),
  ];
  return buildPurchaseOrderDetail(id);
}

async function cancelPurchaseOrder(id: number): Promise<PurchaseOrderDetail> {
  await wait(260);
  const current = purchaseOrders.find((item) => item.id === id);
  if (!current) throw new Error('Không tìm thấy đơn mua cần hủy.');
  if (!['DRAFT', 'PENDING_APPROVAL'].includes(current.status)) {
    throw new Error('Chỉ có thể hủy đơn nháp hoặc đơn đang chờ duyệt.');
  }
  const updated: PurchaseOrder = {
    ...current,
    status: 'CANCELLED',
    version: current.version + 1,
    updatedAt: new Date().toISOString(),
  };
  purchaseOrders = purchaseOrders.map((item) => item.id === id ? updated : item);
  return buildPurchaseOrderDetail(id);
}

async function listGoodsReceipts(
  filters: GoodsReceiptFilters,
  page: number,
  pageSize: number,
): Promise<GoodsReceiptListResult> {
  await wait();
  const keyword = normalize(filters.keyword);
  const purchaseOrderCode = normalize(filters.purchaseOrderCode);
  const filtered = goodsReceipts
    .filter((receipt) => {
      const linkedOrder = receipt.purchaseOrderId
        ? purchaseOrders.find((item) => item.id === receipt.purchaseOrderId)
        : undefined;
      return (!keyword || normalize(receipt.code).includes(keyword))
        && (!purchaseOrderCode || normalize(linkedOrder?.code).includes(purchaseOrderCode))
        && (!filters.supplierId || receipt.supplierId === filters.supplierId)
        && (!filters.warehouseId || receipt.warehouseId === filters.warehouseId)
        && (filters.status === 'ALL' || receipt.status === filters.status)
        && isDateInRange(
          receipt.receivedDate,
          filters.receivedDateFrom,
          filters.receivedDateTo,
        );
    })
    .sort((a, b) => b.receivedDate.localeCompare(a.receivedDate));
  const start = (page - 1) * pageSize;
  return {
    content: filtered.slice(start, start + pageSize).map(toGoodsReceiptRecord),
    totalElements: filtered.length,
    page,
    size: pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}

async function getGoodsReceiptById(id: number): Promise<GoodsReceiptDetail> {
  await wait(180);
  return buildGoodsReceiptDetail(id);
}

async function createGoodsReceipt(values: GoodsReceiptFormValues): Promise<GoodsReceiptDetail> {
  await wait(360);
  const linkedOrder = values.purchaseOrderId
    ? purchaseOrders.find((item) => item.id === values.purchaseOrderId)
    : undefined;
  if (values.purchaseOrderId && !linkedOrder) throw new Error('Không tìm thấy PO liên quan.');
  const now = new Date().toISOString();
  const id = Math.max(...goodsReceipts.map((item) => item.id), 0) + 1;
  let nextItemId = Math.max(...goodsReceiptItems.map((item) => item.id), 0) + 1;
  const newItems: GoodsReceiptItem[] = values.items.map((item) => ({
    id: nextItemId++,
    goodsReceiptId: id,
    purchaseOrderItemId: item.purchaseOrderItemId ?? null,
    productId: item.productId,
    unitId: item.unitId,
    conversionFactor: item.conversionFactor,
    receivedQty: item.receivedQty,
    baseReceivedQty: item.receivedQty * item.conversionFactor,
    damagedQty: item.damagedQty,
    unitCost: item.unitCost,
    discrepancyType: item.damagedQty > 0 ? 'DAMAGED' : item.discrepancyType,
    note: item.note?.trim() || null,
  }));
  const receipt: GoodsReceipt = {
    id,
    code: `GR-${now.slice(2, 10).replaceAll('-', '')}-${String(id).slice(-3)}`,
    purchaseOrderId: linkedOrder?.id ?? null,
    supplierId: linkedOrder?.supplierId ?? values.supplierId,
    warehouseId: linkedOrder?.warehouseId ?? values.warehouseId,
    status: 'DRAFT',
    receivedDate: values.receivedDate,
    totalAmount: newItems.reduce(
      (sum, item) => sum + item.receivedQty * item.unitCost,
      0,
    ),
    note: values.note?.trim() || null,
    createdBy: 21,
    confirmedBy: null,
    confirmedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  goodsReceipts = [receipt, ...goodsReceipts];
  goodsReceiptItems = [...newItems, ...goodsReceiptItems];
  // V5 only persists the receiving document. Inventory is intentionally untouched;
  // the backend/V6 flow owns on-hand updates after confirmation.
  return buildGoodsReceiptDetail(id);
}

async function cancelGoodsReceipt(id: number): Promise<GoodsReceiptDetail> {
  await wait(260);
  const current = goodsReceipts.find((item) => item.id === id);
  if (!current) throw new Error('Không tìm thấy phiếu nhận cần hủy.');
  if (current.status !== 'DRAFT') throw new Error('Chỉ phiếu nháp mới được hủy.');
  const updated: GoodsReceipt = {
    ...current,
    status: 'CANCELLED',
    updatedAt: new Date().toISOString(),
  };
  goodsReceipts = goodsReceipts.map((item) => item.id === id ? updated : item);
  return buildGoodsReceiptDetail(id);
}

async function getReferenceData(): Promise<PurchaseReferenceData> {
  await wait(140);
  const receivableStatuses = new Set([
    'CONFIRMED',
    'PARTIALLY_RECEIVED',
    'RECEIVED_PARTIAL',
    'RECEIVED_WITH_DISCREPANCY',
  ]);
  return {
    suppliers: suppliers.map((item) => ({ value: item.id, label: item.name, code: item.code })),
    warehouses: warehouses.map((item) => ({ value: item.id, label: item.name, code: item.code })),
    products: products.map((product) => ({
      ...product,
      units: product.units.map((unit) => ({ ...unit })),
    })),
    receivablePurchaseOrders: purchaseOrders
      .filter((order) => receivableStatuses.has(order.status))
      .map((order) => buildPurchaseOrderDetail(order.id)),
  };
}

export const mockPurchasingRepository: PurchasingRepository = {
  listPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  cancelPurchaseOrder,
  listGoodsReceipts,
  getGoodsReceiptById,
  createGoodsReceipt,
  cancelGoodsReceipt,
  getReferenceData,
};
