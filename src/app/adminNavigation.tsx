/* Hallmark · navigation: hierarchical side-rail · tone: utilitarian enterprise
 * pre-emit critique: P5 H5 E5 S5 R5 V4
 */
import {
  AppstoreOutlined,
  AuditOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  RobotOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

export type AdminRouteScreen =
  | 'dashboard'
  | 'products'
  | 'materials'
  | 'material-create'
  | 'material-groups'
  | 'units'
  | 'unit-conversions'
  | 'sales-payments'
  | 'sales-receivables'
  | 'supplier-payables'
  | 'supplier-payments'
  | 'placeholder';

interface AdminNavigationBase {
  key: string;
  label: string;
  icon?: ReactNode;
}

export interface AdminNavigationRoute extends AdminNavigationBase {
  path: string;
  screen: AdminRouteScreen;
  hiddenInMenu?: boolean;
  parentKey?: string;
  children?: never;
}

export interface AdminNavigationGroup extends AdminNavigationBase {
  children: AdminNavigationNode[];
  path?: never;
  screen?: never;
}

export type AdminNavigationNode = AdminNavigationRoute | AdminNavigationGroup;

export interface AdminRouteDefinition {
  key: string;
  path: string;
  title: string;
  screen: AdminRouteScreen;
  hiddenInMenu?: boolean;
  parentKey?: string;
}

export interface AdminNavigationState {
  selectedKeys: string[];
  openKeys: string[];
  breadcrumbs: Array<{ key: string; label: string }>;
}

export interface AdminModuleDefinition {
  key: string;
  label: string;
  icon?: ReactNode;
  path?: string;
}

const route = (
  path: string,
  label: string,
  screen: AdminRouteScreen = 'placeholder',
  icon?: ReactNode,
  options?: Pick<AdminNavigationRoute, 'hiddenInMenu' | 'parentKey'>,
): AdminNavigationRoute => ({
  key: path,
  path,
  label,
  screen,
  icon,
  ...options,
});

const group = (
  key: string,
  label: string,
  children: AdminNavigationNode[],
  icon?: ReactNode,
): AdminNavigationGroup => ({
  key,
  label,
  children,
  icon,
});

export const adminNavigation: AdminNavigationNode[] = [
  route('/admin/dashboard', 'Dashboard', 'dashboard', <BarChartOutlined />),
  group(
    'admin.catalog',
    'Danh mục',
    [
      group('admin.catalog.materials', 'Vật tư hàng hóa', [
        route('/admin/materials', 'Vật tư hàng hóa', 'materials'),
        route('/admin/materials/new', 'Mới', 'material-create', undefined, {
          hiddenInMenu: true,
          parentKey: '/admin/materials',
        }),
        route('/admin/material-groups', 'Nhóm vật tư hàng hóa', 'material-groups'),
        route('/admin/units', 'Đơn vị tính', 'units'),
        route('/admin/unit-conversions', 'Quy đổi đơn vị', 'unit-conversions'),
      ]),
      group('admin.catalog.products', 'Sản phẩm', [
        route('/admin/products', 'Danh sách sản phẩm', 'products'),
        route('/admin/categories', 'Danh mục sản phẩm'),
      ]),
      group('admin.catalog.partners', 'Đối tác', [
        route('/admin/customers', 'Khách hàng'),
        route('/admin/suppliers', 'Nhà cung cấp'),
      ]),
      group('admin.catalog.warehouses', 'Hệ thống kho', [
        route('/admin/branches', 'Chi nhánh'),
        route('/admin/warehouses', 'Kho'),
      ]),
    ],
    <AppstoreOutlined />,
  ),
  group(
    'admin.sales',
    'Bán hàng',
    [
      group('admin.sales.orders', 'Đơn bán', [
        route('/admin/sales/orders', 'Đơn đặt hàng'),
        route('/admin/sales/retail-orders', 'Đơn đặt hàng lẻ'),
        route('/admin/sales/website', 'Đơn Website'),
        route('/admin/sales/pos', 'Đơn POS'),
        route('/admin/sales/wholesale', 'Đơn Wholesale'),
      ]),
      group('admin.sales.stock', 'Xuất hàng', [
        route('/admin/sales/stock-issues', 'Phiếu xuất kho'),
        route('/admin/sales/stock-history', 'Lịch sử xuất hàng'),
      ]),
      group('admin.sales.payments', 'Thanh toán', [
        route('/admin/sales/payments', 'Giao dịch thanh toán', 'sales-payments'),
        route('/admin/sales/receivables', 'Công nợ khách hàng', 'sales-receivables'),
      ]),
      group('admin.sales.returns', 'Trả hàng', [
        route('/admin/sales/returns', 'Danh sách trả hàng'),
        route('/admin/sales/returns/new', 'Tạo phiếu trả hàng'),
      ]),
      group('admin.sales.reports', 'Báo cáo', [
        route(
          '/admin/sales/reports/revenue-volume',
          'Báo cáo doanh số sản lượng',
        ),
      ]),
    ],
    <ShoppingCartOutlined />,
  ),
  group(
    'admin.purchase',
    'Mua hàng',
    [
      route('/admin/purchase/orders', 'Đơn mua hàng'),
      route('/admin/purchase/retail-orders', 'Đơn mua hàng lẻ'),
      route('/admin/purchase/orders/new', 'Tạo đơn mua hàng', 'placeholder', undefined, {
        hiddenInMenu: true,
        parentKey: '/admin/purchase/orders',
      }),
      group('admin.purchase.receipts', 'Nhận hàng', [
        route('/admin/purchase/goods-receipts', 'Phiếu nhập kho'),
        route('/admin/purchase/receipts', 'Theo dõi nhận hàng'),
      ]),
      group('admin.purchase.payables', 'Công nợ nhà cung cấp', [
        route('/admin/purchase/payables', 'Danh sách công nợ', 'supplier-payables'),
        route('/admin/purchase/payments', 'Lịch sử thanh toán', 'supplier-payments'),
      ]),
      group('admin.purchase.reports', 'Báo cáo', [
        route('/admin/purchase/reports/payables-summary', 'Tổng công nợ phải trả'),
        route('/admin/purchase/reports/payables-detail', 'Chi tiết công nợ'),
      ]),
    ],
    <ShoppingOutlined />,
  ),
  group(
    'admin.inventory',
    'Kho',
    [
      group('admin.inventory.stock', 'Tồn kho', [
        route('/admin/inventory', 'Tổng quan tồn kho'),
        route('/admin/inventory/products', 'Tồn theo sản phẩm'),
        route('/admin/inventory/warehouses', 'Tồn theo kho'),
        route('/admin/inventory/branches', 'Tồn theo chi nhánh'),
      ]),
      group('admin.inventory.transactions', 'Giao dịch kho', [
        route('/admin/inventory/transactions', 'Lịch sử biến động'),
        route('/admin/inventory/inbound', 'Nhập kho'),
        route('/admin/inventory/outbound', 'Xuất kho'),
        route('/admin/inventory/adjustments', 'Điều chỉnh tồn'),
      ]),
      group('admin.inventory.transfers', 'Chuyển kho', [
        route('/admin/inventory/transfers', 'Danh sách phiếu chuyển'),
        route('/admin/inventory/transfers/new', 'Tạo phiếu chuyển'),
      ]),
      group('admin.inventory.stocktakes', 'Kiểm kê', [
        route('/admin/inventory/stocktakes', 'Danh sách kiểm kê'),
        route('/admin/inventory/stocktakes/new', 'Tạo đợt kiểm kê'),
      ]),
      group('admin.inventory.write-offs', 'Xuất hủy / Xuất khác', [
        route('/admin/inventory/write-offs', 'Danh sách phiếu'),
        route('/admin/inventory/write-offs/new', 'Tạo phiếu'),
      ]),
      group('admin.inventory.alerts', 'Cảnh báo tồn kho', [
        route('/admin/inventory/low-stock', 'Sắp hết hàng'),
        route('/admin/inventory/out-of-stock', 'Hết hàng'),
        route('/admin/inventory/anomalies', 'Bất thường tồn kho'),
      ]),
    ],
    <DatabaseOutlined />,
  ),
  group(
    'admin.ai',
    'AI Agent',
    [
      route('/admin/ai/chat', 'Hỏi đáp / Phân tích'),
      group('admin.ai.proposals', 'Đề xuất AI', [
        route('/admin/ai/proposals', 'Tất cả đề xuất'),
        route('/admin/ai/purchase-suggestions', 'Đề xuất nhập hàng'),
        route('/admin/ai/transfer-suggestions', 'Đề xuất chuyển kho'),
        route('/admin/ai/inventory-analysis', 'Phân tích tồn kho'),
      ]),
      route('/admin/ai/history', 'Lịch sử AI'),
    ],
    <RobotOutlined />,
  ),
  group(
    'admin.approvals',
    'Phê duyệt',
    [
      route('/admin/approvals', 'Chờ phê duyệt'),
      group('admin.approvals.types', 'Theo loại nghiệp vụ', [
        route('/admin/approvals/wholesale', 'Đơn Wholesale'),
        route('/admin/approvals/purchase', 'Đơn mua giá trị lớn'),
        route('/admin/approvals/inventory', 'Điều chỉnh tồn'),
        route('/admin/approvals/write-offs', 'Xuất hủy'),
        route('/admin/approvals/ai', 'Đề xuất AI'),
      ]),
      route('/admin/approvals/history', 'Lịch sử phê duyệt'),
    ],
    <AuditOutlined />,
  ),
  group(
    'admin.system',
    'Quản trị hệ thống',
    [
      group('admin.system.users', 'Người dùng', [
        route('/admin/users', 'Danh sách người dùng'),
        route('/admin/users/status', 'Trạng thái tài khoản'),
      ]),
      group('admin.system.permissions', 'Vai trò & Phân quyền', [
        route('/admin/roles', 'Vai trò'),
        route('/admin/permissions', 'Phân quyền'),
      ]),
      group('admin.system.logs', 'Nhật ký hệ thống', [
        route('/admin/audit-logs', 'Audit Log'),
        route('/admin/activity-logs', 'Nhật ký hoạt động người dùng'),
      ]),
    ],
    <SettingOutlined />,
  ),
];

function isAdminRoute(node: AdminNavigationNode): node is AdminNavigationRoute {
  return typeof node.path === 'string';
}

function collectAdminRoutes(nodes: AdminNavigationNode[]): AdminRouteDefinition[] {
  return nodes.flatMap((node) => {
    if (isAdminRoute(node)) {
      return [
        {
          key: node.key,
          path: node.path,
          title: node.label,
          screen: node.screen,
          hiddenInMenu: node.hiddenInMenu,
          parentKey: node.parentKey,
        },
      ];
    }

    return collectAdminRoutes(node.children);
  });
}

export const adminRoutes = collectAdminRoutes(adminNavigation);

const adminRouteByKey = new Map(adminRoutes.map((item) => [item.key, item]));

export function getAdminRouteByKey(key: string): AdminRouteDefinition | undefined {
  return adminRouteByKey.get(key);
}

function normalizePath(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, '');
  return normalized.length > 0 ? normalized : '/';
}

function findNavigationTrail(
  nodes: AdminNavigationNode[],
  pathname: string,
): AdminNavigationNode[] | undefined {
  for (const node of nodes) {
    if (isAdminRoute(node) && normalizePath(node.path) === pathname) {
      return [node];
    }

    if (!isAdminRoute(node)) {
      const childTrail = findNavigationTrail(node.children, pathname);
      if (childTrail) {
        return [node, ...childTrail];
      }
    }
  }

  return undefined;
}

function findNavigationTrailByKey(
  nodes: AdminNavigationNode[],
  key: string,
): AdminNavigationNode[] | undefined {
  for (const node of nodes) {
    if (node.key === key) {
      return [node];
    }

    if (!isAdminRoute(node)) {
      const childTrail = findNavigationTrailByKey(node.children, key);
      if (childTrail) {
        return [node, ...childTrail];
      }
    }
  }

  return undefined;
}

export function getAdminNavigationState(pathname: string): AdminNavigationState {
  const directTrail = findNavigationTrail(adminNavigation, normalizePath(pathname)) ?? [];
  const directSelectedNode = directTrail.at(-1);
  const parentTrail =
    directSelectedNode && isAdminRoute(directSelectedNode) && directSelectedNode.parentKey
      ? findNavigationTrailByKey(adminNavigation, directSelectedNode.parentKey)
      : undefined;
  const trail = parentTrail && directSelectedNode ? [...parentTrail, directSelectedNode] : directTrail;
  const selectedNode = trail.at(-1);
  const breadcrumbTrail =
    directSelectedNode && isAdminRoute(directSelectedNode) && directSelectedNode.hiddenInMenu
      ? directTrail.slice(-2)
      : trail;
  const selectedKey =
    selectedNode && isAdminRoute(selectedNode)
      ? selectedNode.parentKey ?? selectedNode.key
      : undefined;

  return {
    selectedKeys: selectedKey ? [selectedKey] : [],
    openKeys: trail.slice(0, -1).filter((node) => !isAdminRoute(node)).map((node) => node.key),
    breadcrumbs: breadcrumbTrail
      .map((node) => ({ key: node.key, label: node.label }))
      .filter((item, index, items) => index === 0 || item.label !== items[index - 1].label),
  };
}

const menuLabelStyle: CSSProperties = {
  display: 'block',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

function renderMenuLabel(label: string) {
  return (
    <span title={label} style={menuLabelStyle}>
      {label}
    </span>
  );
}

type AdminMenuItem = NonNullable<MenuProps['items']>[number];

function toMenuItem(node: AdminNavigationNode): AdminMenuItem {
  if (isAdminRoute(node)) {
    return {
      key: node.key,
      icon: node.icon,
      label: renderMenuLabel(node.label),
      title: node.label,
    };
  }

  return {
    key: node.key,
    icon: node.icon,
    label: renderMenuLabel(node.label),
    children: node.children
      .filter((child) => !isAdminRoute(child) || !child.hiddenInMenu)
      .map(toMenuItem),
  };
}

export const adminModules: AdminModuleDefinition[] = adminNavigation.map((node) => ({
  key: node.key,
  label: node.label,
  icon: node.icon,
  path: isAdminRoute(node) ? node.path : undefined,
}));

export function getAdminModuleMenuItems(moduleKey: string): MenuProps['items'] {
  const module = adminNavigation.find((node) => node.key === moduleKey);

  if (!module) {
    return [];
  }

  if (isAdminRoute(module)) {
    return [toMenuItem(module)];
  }

  return module.children
    .filter((node) => !isAdminRoute(node) || !node.hiddenInMenu)
    .map(toMenuItem);
}

export const adminMenuItems: MenuProps['items'] = adminNavigation
  .filter((node) => !isAdminRoute(node) || !node.hiddenInMenu)
  .map(toMenuItem);
