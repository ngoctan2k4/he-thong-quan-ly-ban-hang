/* Hallmark · navigation: hierarchical side-rail · tone: utilitarian enterprise
 * pre-emit critique: P5 H5 E5 S5 R5 V4
 */
import {
  AccountBookOutlined,
  AppstoreOutlined,
  AuditOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  FileExcelOutlined,
  RobotOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

export type AdminRouteScreen =
  | 'dashboard'
  | 'customers'
  | 'suppliers'
  | 'products'
  | 'product-categories'
  | 'price-lists'
  | 'materials'
  | 'material-create'
  | 'material-groups'
  | 'units'
  | 'unit-conversions'
  | 'branches'
  | 'warehouses'
  | 'sales-orders'
  | 'sales-payments'
  | 'sales-receivables'
  | 'supplier-payables'
  | 'supplier-payments'
  | 'purchase-orders'
  | 'purchase-order-form'
  | 'goods-receipts'
  | 'goods-receipt-form'
  | 'inventory-operations'
  | 'ai-operations'
  | 'approvals'
  | 'audit-logs'
  | 'accounting'
  | 'system-users'
  | 'system-roles'
  | 'placeholder';

export type AdminRouteAction = 'export-sales-report';

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
  emphasizedInMenu?: boolean;
  action?: AdminRouteAction;
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
  action?: AdminRouteAction;
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
  options?: Pick<
    AdminNavigationRoute,
    'hiddenInMenu' | 'parentKey' | 'emphasizedInMenu' | 'action'
  >,
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
        route('/admin/categories', 'Nhóm hàng', 'product-categories'),
      ]),
      route('/admin/price-lists', 'Bảng giá', 'price-lists', undefined, {
        emphasizedInMenu: true,
      }),
      route('/admin/customers', 'Khách hàng', 'customers', undefined, {
        emphasizedInMenu: true,
      }),
      route('/admin/suppliers', 'Nhà cung cấp', 'suppliers', undefined, {
        emphasizedInMenu: true,
      }),
      group('admin.catalog.warehouses', 'Hệ thống kho', [
        route('/admin/branches', 'Chi nhánh', 'branches'),
        route('/admin/warehouses', 'Kho', 'warehouses'),
        route('/admin/locations', 'Vị trí kho', 'inventory-operations'),
      ]),
    ],
    <AppstoreOutlined />,
  ),
  group(
    'admin.sales',
    'Bán hàng',
    [
      route('/admin/sales/orders', 'Đơn đặt hàng', 'sales-orders', undefined, {
        emphasizedInMenu: true,
      }),
      route('/admin/sales/retail-orders', 'Đơn đặt hàng lẻ', 'sales-orders', undefined, {
        emphasizedInMenu: true,
      }),
      route('/admin/sales/website', 'Đơn Website', 'sales-orders', undefined, {
        emphasizedInMenu: true,
      }),
      route('/admin/sales/pos', 'Đơn POS', 'sales-orders', undefined, {
        emphasizedInMenu: true,
      }),
      route('/admin/sales/wholesale', 'Đơn Wholesale', 'sales-orders', undefined, {
        emphasizedInMenu: true,
      }),
      group('admin.sales.stock', 'Xuất hàng', [
        route('/admin/sales/stock-issues', 'Phiếu xuất kho', 'inventory-operations'),
      ]),
      group('admin.sales.payments', 'Thanh toán', [
        route('/admin/sales/payments', 'Giao dịch thanh toán', 'sales-payments'),
        route('/admin/sales/receivables', 'Công nợ khách hàng', 'sales-receivables'),
      ]),
      group('admin.sales.returns', 'Trả hàng', [
        route('/admin/sales/returns', 'Danh sách trả hàng'),
        route('/admin/sales/returns/new', 'Tạo phiếu trả hàng'),
      ]),
      route(
        '/admin/sales/reports/export',
        'Xuất báo cáo Excel',
        'placeholder',
        <FileExcelOutlined />,
        {
          emphasizedInMenu: true,
          action: 'export-sales-report',
        },
      ),
    ],
    <ShoppingCartOutlined />,
  ),
  group(
    'admin.purchase',
    'Mua hàng',
    [
      route('/admin/purchase/orders', 'Đơn mua hàng', 'purchase-orders', undefined, {
        emphasizedInMenu: true,
      }),
      route(
        '/admin/purchase/retail-orders',
        'Đơn mua hàng lẻ',
        'purchase-orders',
        undefined,
        { emphasizedInMenu: true },
      ),
      route(
        '/admin/purchase/retail-orders/new',
        'Tạo đơn mua hàng lẻ',
        'purchase-order-form',
        undefined,
        {
          hiddenInMenu: true,
          parentKey: '/admin/purchase/retail-orders',
        },
      ),
      route(
        '/admin/purchase/retail-orders/:id/edit',
        'Sửa đơn mua hàng lẻ',
        'purchase-order-form',
        undefined,
        {
          hiddenInMenu: true,
          parentKey: '/admin/purchase/retail-orders',
        },
      ),
      route('/admin/purchase/orders/new', 'Tạo đơn mua hàng', 'purchase-order-form', undefined, {
        hiddenInMenu: true,
        parentKey: '/admin/purchase/orders',
      }),
      route('/admin/purchase/orders/:id/edit', 'Sửa đơn mua hàng', 'purchase-order-form', undefined, {
        hiddenInMenu: true,
        parentKey: '/admin/purchase/orders',
      }),
      route(
        '/admin/purchase/goods-receipts',
        'Phiếu nhập kho',
        'goods-receipts',
        undefined,
        { emphasizedInMenu: true },
      ),
      route(
        '/admin/purchase/goods-receipts/new',
        'Tạo phiếu nhận hàng',
        'goods-receipt-form',
        undefined,
        {
          hiddenInMenu: true,
          parentKey: '/admin/purchase/goods-receipts',
        },
      ),
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
      route(
        '/admin/inventory/balance',
        'Tồn kho',
        'inventory-operations',
        undefined,
        { emphasizedInMenu: true },
      ),
      route('/admin/inventory/movements', 'Biến động tồn', 'inventory-operations', undefined, {
        emphasizedInMenu: true,
      }),
      route('/admin/inventory/transfers', 'Chuyển kho', 'inventory-operations', undefined, {
        emphasizedInMenu: true,
      }),
      route('/admin/inventory/stocktakes', 'Kiểm kê', 'inventory-operations', undefined, {
        emphasizedInMenu: true,
      }),
      route('/admin/inventory/write-offs', 'Xuất hủy', 'inventory-operations', undefined, {
        emphasizedInMenu: true,
      }),
    ],
    <DatabaseOutlined />,
  ),
  group(
    'admin.accounting',
    'Kế toán',
    [
      group('admin.accounting.purchase', 'Mua hàng', [
        route(
          '/admin/accounting/purchase/goods-vouchers',
          'Chứng từ mua hàng hóa',
          'accounting',
        ),
        route(
          '/admin/accounting/purchase/service-vouchers',
          'Chứng từ mua dịch vụ',
          'accounting',
        ),
        route(
          '/admin/accounting/purchase/returns',
          'Trả lại hàng mua',
          'accounting',
        ),
      ]),
      group('admin.accounting.sales', 'Bán hàng', [
        route(
          '/admin/accounting/sales/vouchers',
          'Chứng từ bán hàng',
          'accounting',
        ),
        route('/admin/accounting/sales/invoices', 'Hóa đơn', 'accounting'),
        route(
          '/admin/accounting/sales/ecommerce-vouchers',
          'Chứng từ hàng hóa Ecom',
          'accounting',
        ),
      ]),
    ],
    <AccountBookOutlined />,
  ),
  group(
    'admin.ai',
    'AI Agent',
    [
      route('/admin/ai/chat', 'Chat với AI', 'ai-operations'),
      route('/admin/ai/inventory-signals', 'Inventory Signals', 'ai-operations'),
      route('/admin/ai/proposals', 'Đề xuất AI', 'ai-operations'),
      route('/admin/ai/history', 'Lịch sử tool call', 'ai-operations'),
    ],
    <RobotOutlined />,
  ),
  group(
    'admin.approvals',
    'Phê duyệt',
    [
      route('/admin/approvals', 'Hàng đợi phê duyệt', 'approvals'),
      group('admin.approvals.types', 'Theo loại nghiệp vụ', [
        route('/admin/approvals/wholesale', 'Đơn Wholesale', 'approvals'),
        route('/admin/approvals/purchase', 'Đơn mua giá trị lớn', 'approvals'),
        route('/admin/approvals/inventory', 'Điều chỉnh tồn', 'approvals'),
        route('/admin/approvals/write-offs', 'Xuất hủy', 'approvals'),
        route('/admin/approvals/ai', 'Đề xuất AI', 'approvals'),
      ]),
    ],
    <AuditOutlined />,
  ),
  group(
    'admin.system',
    'Hệ thống',
    [
      group('admin.system.users', 'Người dùng', [
        route('/admin/users', 'Danh sách người dùng', 'system-users'),
      ]),
      group('admin.system.permissions', 'Vai trò & Phân quyền', [
        route('/admin/roles', 'Vai trò', 'system-roles'),
      ]),
      group('admin.system.logs', 'Nhật ký hệ thống', [
        route('/admin/audit-logs', 'Audit Log', 'audit-logs'),
        route('/admin/activity-logs', 'Nhật ký hoạt động người dùng', 'audit-logs'),
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
          action: node.action,
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

function matchesNavigationPath(routePath: string, pathname: string): boolean {
  const routeSegments = normalizePath(routePath).split('/');
  const pathnameSegments = normalizePath(pathname).split('/');
  if (routeSegments.length !== pathnameSegments.length) return false;
  return routeSegments.every((segment, index) => (
    segment.startsWith(':') ? pathnameSegments[index].length > 0 : segment === pathnameSegments[index]
  ));
}

function findNavigationTrail(
  nodes: AdminNavigationNode[],
  pathname: string,
): AdminNavigationNode[] | undefined {
  for (const node of nodes) {
    if (isAdminRoute(node) && matchesNavigationPath(node.path, pathname)) {
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
      style: node.emphasizedInMenu ? { fontWeight: 600 } : undefined,
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
