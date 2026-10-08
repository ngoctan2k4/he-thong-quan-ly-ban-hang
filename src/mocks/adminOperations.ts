export type OperationStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';

export interface WarehouseLocationRow {
  id: number;
  code: string;
  name: string;
  warehouse: string;
  zone: string;
  capacity: number;
  occupied: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface StockIssueRow {
  id: number;
  code: string;
  orderCode: string;
  warehouse: string;
  itemCount: number;
  quantity: number;
  status: OperationStatus;
  createdAt: string;
}

export interface StockBalanceRow {
  id: number;
  sku: string;
  product: string;
  warehouse: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  updatedAt: string;
}

export interface StockMovementRow {
  id: number;
  occurredAt: string;
  reference: string;
  type: 'RECEIPT' | 'ISSUE' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'STOCKTAKE' | 'WRITE_OFF';
  sku: string;
  product: string;
  warehouse: string;
  quantity: number;
  balanceAfter: number;
  actor: string;
}

export interface StockTransferRow {
  id: number;
  code: string;
  fromWarehouse: string;
  toWarehouse: string;
  itemCount: number;
  quantity: number;
  status: OperationStatus;
  requestedAt: string;
}

export interface StocktakeRow {
  id: number;
  code: string;
  warehouse: string;
  scope: string;
  countedItems: number;
  differenceItems: number;
  status: OperationStatus;
  scheduledAt: string;
}

export interface WriteOffRow {
  id: number;
  code: string;
  warehouse: string;
  reason: string;
  itemCount: number;
  quantity: number;
  status: OperationStatus;
  requestedAt: string;
}

export interface InventorySignalRow {
  id: number;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  type: 'LOW_STOCK' | 'OVERSTOCK' | 'NO_MOVEMENT' | 'DEMAND_SPIKE';
  sku: string;
  product: string;
  warehouse: string;
  summary: string;
  detectedAt: string;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
}

export interface AiProposalRow {
  id: number;
  code: string;
  type: 'PURCHASE_ORDER' | 'STOCK_TRANSFER' | 'CREDIT_APPROVAL';
  title: string;
  rationale: string;
  impact: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface ToolCallRow {
  id: number;
  tool: string;
  requestId: string;
  purpose: string;
  durationMs: number;
  status: 'SUCCESS' | 'FAILED';
  calledAt: string;
}

export interface ApprovalRow {
  id: number;
  code: string;
  type: 'WHOLESALE' | 'PURCHASE' | 'INVENTORY' | 'WRITE_OFF' | 'AI';
  title: string;
  requester: string;
  branch: string;
  amount?: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
}

export interface AuditLogRow {
  id: number;
  occurredAt: string;
  actor: string;
  action: string;
  module: 'CATALOG' | 'SALES' | 'PURCHASING' | 'INVENTORY' | 'AI' | 'ADMIN';
  object: string;
  ipAddress: string;
  result: 'SUCCESS' | 'FAILED';
  detail: string;
}

export const warehouseLocations: WarehouseLocationRow[] = [
  { id: 1, code: 'HCM-A-01', name: 'Kệ A01', warehouse: 'Kho trung tâm HCM', zone: 'A', capacity: 500, occupied: 382, status: 'ACTIVE' },
  { id: 2, code: 'HCM-A-02', name: 'Kệ A02', warehouse: 'Kho trung tâm HCM', zone: 'A', capacity: 420, occupied: 410, status: 'ACTIVE' },
  { id: 3, code: 'HCM-QC-01', name: 'Khu cách ly', warehouse: 'Kho trung tâm HCM', zone: 'QC', capacity: 120, occupied: 24, status: 'ACTIVE' },
  { id: 4, code: 'HN-B-01', name: 'Kệ B01', warehouse: 'Kho trung tâm Hà Nội', zone: 'B', capacity: 360, occupied: 168, status: 'ACTIVE' },
  { id: 5, code: 'DN-OLD-01', name: 'Kệ cũ', warehouse: 'Kho Đà Nẵng', zone: 'OLD', capacity: 80, occupied: 0, status: 'INACTIVE' },
];

export const stockIssues: StockIssueRow[] = [
  { id: 1, code: 'PXK-260928-004', orderCode: 'SO-01004', warehouse: 'Kho trung tâm HCM', itemCount: 3, quantity: 18, status: 'PENDING', createdAt: '2026-09-28T08:40:00+07:00' },
  { id: 2, code: 'PXK-260927-011', orderCode: 'SO-00987', warehouse: 'Kho trung tâm Hà Nội', itemCount: 2, quantity: 7, status: 'APPROVED', createdAt: '2026-09-27T15:05:00+07:00' },
  { id: 3, code: 'PXK-260926-008', orderCode: 'SO-00965', warehouse: 'Kho hàng sỉ HCM', itemCount: 5, quantity: 64, status: 'COMPLETED', createdAt: '2026-09-26T10:20:00+07:00' },
];

export const stockBalances: StockBalanceRow[] = [
  { id: 1, sku: 'IP16PM-256', product: 'iPhone 16 Pro Max 256GB', warehouse: 'Kho trung tâm HCM', onHand: 24, reserved: 9, available: 15, reorderPoint: 10, updatedAt: '2026-09-28T09:12:00+07:00' },
  { id: 2, sku: 'IP16PM-256', product: 'iPhone 16 Pro Max 256GB', warehouse: 'Kho trung tâm Hà Nội', onHand: 8, reserved: 6, available: 2, reorderPoint: 10, updatedAt: '2026-09-28T09:12:00+07:00' },
  { id: 3, sku: 'S24U-512', product: 'Samsung Galaxy S24 Ultra 512GB', warehouse: 'Kho trung tâm HCM', onHand: 18, reserved: 4, available: 14, reorderPoint: 8, updatedAt: '2026-09-28T08:55:00+07:00' },
  { id: 4, sku: 'TV-LG-55C4', product: 'LG OLED evo C4 55 inch', warehouse: 'Kho trung tâm Hà Nội', onHand: 3, reserved: 1, available: 2, reorderPoint: 4, updatedAt: '2026-09-28T08:28:00+07:00' },
  { id: 5, sku: 'AIR-M2-256', product: 'MacBook Air M2 256GB', warehouse: 'Kho Đà Nẵng', onHand: 11, reserved: 2, available: 9, reorderPoint: 5, updatedAt: '2026-09-27T17:40:00+07:00' },
];

export const stockMovements: StockMovementRow[] = [
  { id: 1, occurredAt: '2026-09-28T09:12:00+07:00', reference: 'PXK-260928-004', type: 'ISSUE', sku: 'IP16PM-256', product: 'iPhone 16 Pro Max 256GB', warehouse: 'Kho trung tâm HCM', quantity: -3, balanceAfter: 24, actor: 'Trần Quốc Bảo' },
  { id: 2, occurredAt: '2026-09-28T08:35:00+07:00', reference: 'PNK-260928-002', type: 'RECEIPT', sku: 'S24U-512', product: 'Samsung Galaxy S24 Ultra 512GB', warehouse: 'Kho trung tâm HCM', quantity: 10, balanceAfter: 18, actor: 'Vũ Hoàng Nam' },
  { id: 3, occurredAt: '2026-09-27T16:10:00+07:00', reference: 'CK-260927-003', type: 'TRANSFER_IN', sku: 'AIR-M2-256', product: 'MacBook Air M2 256GB', warehouse: 'Kho Đà Nẵng', quantity: 4, balanceAfter: 11, actor: 'Hoàng Thanh Tùng' },
  { id: 4, occurredAt: '2026-09-27T16:09:00+07:00', reference: 'CK-260927-003', type: 'TRANSFER_OUT', sku: 'AIR-M2-256', product: 'MacBook Air M2 256GB', warehouse: 'Kho trung tâm HCM', quantity: -4, balanceAfter: 16, actor: 'Trần Quốc Bảo' },
  { id: 5, occurredAt: '2026-09-27T11:30:00+07:00', reference: 'KK-260927-001', type: 'STOCKTAKE', sku: 'TV-LG-55C4', product: 'LG OLED evo C4 55 inch', warehouse: 'Kho trung tâm Hà Nội', quantity: -1, balanceAfter: 3, actor: 'Lê Thu Hà' },
];

export const stockTransfers: StockTransferRow[] = [
  { id: 1, code: 'CK-260928-001', fromWarehouse: 'Kho trung tâm HCM', toWarehouse: 'Kho trung tâm Hà Nội', itemCount: 2, quantity: 14, status: 'PENDING', requestedAt: '2026-09-28T08:10:00+07:00' },
  { id: 2, code: 'CK-260927-003', fromWarehouse: 'Kho trung tâm HCM', toWarehouse: 'Kho Đà Nẵng', itemCount: 1, quantity: 4, status: 'COMPLETED', requestedAt: '2026-09-27T13:25:00+07:00' },
];

export const stocktakes: StocktakeRow[] = [
  { id: 1, code: 'KK-260929-001', warehouse: 'Kho trung tâm HCM', scope: 'Toàn kho', countedItems: 0, differenceItems: 0, status: 'DRAFT', scheduledAt: '2026-09-29T08:00:00+07:00' },
  { id: 2, code: 'KK-260927-001', warehouse: 'Kho trung tâm Hà Nội', scope: 'Khu điện tử', countedItems: 86, differenceItems: 3, status: 'COMPLETED', scheduledAt: '2026-09-27T08:00:00+07:00' },
];

export const writeOffs: WriteOffRow[] = [
  { id: 1, code: 'XH-260928-001', warehouse: 'Kho trung tâm HCM', reason: 'Hư hỏng không thể bán', itemCount: 2, quantity: 3, status: 'PENDING', requestedAt: '2026-09-28T07:45:00+07:00' },
  { id: 2, code: 'XH-260925-002', warehouse: 'Kho trung tâm Hà Nội', reason: 'Hết hạn lưu kho', itemCount: 1, quantity: 8, status: 'APPROVED', requestedAt: '2026-09-25T14:20:00+07:00' },
];

export const inventorySignals: InventorySignalRow[] = [
  { id: 1, severity: 'CRITICAL', type: 'LOW_STOCK', sku: 'IP16PM-256', product: 'iPhone 16 Pro Max 256GB', warehouse: 'Kho trung tâm Hà Nội', summary: 'Khả dụng 2, thấp hơn điểm đặt hàng lại 10.', detectedAt: '2026-09-28T09:15:00+07:00', status: 'OPEN' },
  { id: 2, severity: 'WARNING', type: 'LOW_STOCK', sku: 'TV-LG-55C4', product: 'LG OLED evo C4 55 inch', warehouse: 'Kho trung tâm Hà Nội', summary: 'Khả dụng 2, thấp hơn điểm đặt hàng lại 4.', detectedAt: '2026-09-28T08:30:00+07:00', status: 'ACKNOWLEDGED' },
  { id: 3, severity: 'INFO', type: 'NO_MOVEMENT', sku: 'CAM-IMOU-A1', product: 'Camera IMOU A1', warehouse: 'Kho Đà Nẵng', summary: 'Không phát sinh giao dịch trong 45 ngày.', detectedAt: '2026-09-27T06:00:00+07:00', status: 'OPEN' },
];

export const aiProposals: AiProposalRow[] = [
  { id: 1, code: 'AI-PO-260928-01', type: 'PURCHASE_ORDER', title: 'Bổ sung iPhone 16 Pro Max cho Hà Nội', rationale: 'Tồn khả dụng thấp hơn điểm đặt hàng lại và nhu cầu 7 ngày gần nhất tăng.', impact: 'Đề xuất mua 20 chiếc từ nhà cung cấp ưu tiên.', status: 'PENDING_APPROVAL', createdAt: '2026-09-28T09:16:00+07:00' },
  { id: 2, code: 'AI-TR-260928-02', type: 'STOCK_TRANSFER', title: 'Điều chuyển tồn HCM → Hà Nội', rationale: 'HCM còn tồn an toàn trong khi Hà Nội có nguy cơ hết hàng.', impact: 'Điều chuyển 10 chiếc, không làm HCM xuống dưới safety stock.', status: 'DRAFT', createdAt: '2026-09-28T09:18:00+07:00' },
  { id: 3, code: 'AI-CR-260927-04', type: 'CREDIT_APPROVAL', title: 'Rà soát hạn mức đơn Wholesale SO-01012', rationale: 'Giá trị đơn vượt hạn mức công nợ hiện tại của khách hàng.', impact: 'Yêu cầu quản lý kinh doanh phê duyệt trước khi giữ hàng.', status: 'APPROVED', createdAt: '2026-09-27T14:32:00+07:00' },
];

export const toolCalls: ToolCallRow[] = [
  { id: 1, tool: 'get_inventory_signals', requestId: 'req_8af21', purpose: 'Phân tích mặt hàng sắp hết', durationMs: 84, status: 'SUCCESS', calledAt: '2026-09-28T09:15:00+07:00' },
  { id: 2, tool: 'propose_stock_transfer', requestId: 'req_8af22', purpose: 'Tạo đề xuất điều chuyển', durationMs: 126, status: 'SUCCESS', calledAt: '2026-09-28T09:18:00+07:00' },
  { id: 3, tool: 'get_sales_velocity', requestId: 'req_8ae91', purpose: 'Tính tốc độ bán 7 ngày', durationMs: 210, status: 'SUCCESS', calledAt: '2026-09-28T08:44:00+07:00' },
  { id: 4, tool: 'get_supplier_quote', requestId: 'req_8ad02', purpose: 'Đọc báo giá nhà cung cấp', durationMs: 1200, status: 'FAILED', calledAt: '2026-09-27T16:10:00+07:00' },
];

export const approvals: ApprovalRow[] = [
  { id: 1, code: 'SO-01012', type: 'WHOLESALE', title: 'Đơn Wholesale vượt hạn mức', requester: 'Nguyễn Minh Anh', branch: 'TP.HCM', amount: 86_500_000, risk: 'HIGH', status: 'PENDING', requestedAt: '2026-09-28T08:52:00+07:00' },
  { id: 2, code: 'PO-00046', type: 'PURCHASE', title: 'Đơn mua giá trị lớn', requester: 'Lê Thu Hà', branch: 'Hà Nội', amount: 145_000_000, risk: 'MEDIUM', status: 'PENDING', requestedAt: '2026-09-28T08:20:00+07:00' },
  { id: 3, code: 'CK-260928-001', type: 'INVENTORY', title: 'Điều chuyển hàng giữa chi nhánh', requester: 'Vũ Hoàng Nam', branch: 'TP.HCM', risk: 'LOW', status: 'PENDING', requestedAt: '2026-09-28T08:10:00+07:00' },
  { id: 4, code: 'XH-260928-001', type: 'WRITE_OFF', title: 'Xuất hủy hàng hư hỏng', requester: 'Trần Quốc Bảo', branch: 'TP.HCM', amount: 12_800_000, risk: 'HIGH', status: 'PENDING', requestedAt: '2026-09-28T07:45:00+07:00' },
  { id: 5, code: 'AI-PO-260928-01', type: 'AI', title: 'Đề xuất nhập hàng từ AI', requester: 'AI Agent', branch: 'Hà Nội', amount: 560_000_000, risk: 'MEDIUM', status: 'PENDING', requestedAt: '2026-09-28T09:16:00+07:00' },
];

export const auditLogs: AuditLogRow[] = [
  { id: 1, occurredAt: '2026-09-28T09:20:10+07:00', actor: 'admin@saleshub.vn', action: 'APPROVE', module: 'AI', object: 'AI-CR-260927-04', ipAddress: '10.10.1.12', result: 'SUCCESS', detail: 'Phê duyệt đề xuất rà soát hạn mức công nợ.' },
  { id: 2, occurredAt: '2026-09-28T09:12:04+07:00', actor: 'warehouse.hcm@saleshub.vn', action: 'CREATE', module: 'INVENTORY', object: 'PXK-260928-004', ipAddress: '10.10.2.21', result: 'SUCCESS', detail: 'Tạo phiếu xuất kho cho đơn SO-01004.' },
  { id: 3, occurredAt: '2026-09-28T08:55:42+07:00', actor: 'sales.hcm@saleshub.vn', action: 'UPDATE', module: 'SALES', object: 'SO-01012', ipAddress: '10.10.3.17', result: 'SUCCESS', detail: 'Gửi đơn Wholesale vào hàng đợi phê duyệt.' },
  { id: 4, occurredAt: '2026-09-28T08:33:19+07:00', actor: 'purchase.hn@saleshub.vn', action: 'CREATE', module: 'PURCHASING', object: 'PNK-260928-002', ipAddress: '10.20.1.44', result: 'SUCCESS', detail: 'Tạo phiếu nhận hàng theo PO-00042.' },
  { id: 5, occurredAt: '2026-09-27T16:11:08+07:00', actor: 'ai-agent@saleshub.vn', action: 'TOOL_CALL', module: 'AI', object: 'req_8ad02', ipAddress: 'service', result: 'FAILED', detail: 'Không đọc được báo giá nhà cung cấp trong thời gian cho phép.' },
];
