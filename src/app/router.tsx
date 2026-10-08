import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { PosLayout } from '../layouts/PosLayout';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminCustomersPage } from '../pages/admin/AdminCustomersPage';
import { AdminCatalogMasterPage } from '../pages/admin/AdminCatalogMasterPage';
import {
  AdminBranchesPage,
  AdminCategoriesPage,
  AdminUnitsPage,
  AdminWarehousesPage,
} from '../pages/admin/AdminCatalogV1Pages';
import { AdminMaterialCreatePage } from '../pages/admin/AdminMaterialCreatePage';
import { AdminMaterialsPage } from '../pages/admin/AdminMaterialsPage';
import { AdminPlaceholderPage } from '../pages/admin/AdminPlaceholderPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminPriceListsPage } from '../pages/admin/AdminPriceListsPage';
import { AdminSystemUsersPage } from '../pages/admin/AdminSystemUsersPage';
import { AdminRolesPage } from '../pages/admin/AdminRolesPage';
import { AdminPurchaseOrderFormPage } from '../pages/admin/AdminPurchaseOrderFormPage';
import { AdminPurchaseOrdersPage } from '../pages/admin/AdminPurchaseOrdersPage';
import { AdminGoodsReceiptFormPage } from '../pages/admin/AdminGoodsReceiptFormPage';
import { AdminGoodsReceiptsPage } from '../pages/admin/AdminGoodsReceiptsPage';
import { AdminSalesOrdersPage } from '../pages/admin/AdminSalesOrdersPage';
import { AdminSalesPaymentsPage } from '../pages/admin/AdminSalesPaymentsPage';
import { AdminSalesReceivablesPage } from '../pages/admin/AdminSalesReceivablesPage';
import { AdminSupplierPayablesPage } from '../pages/admin/AdminSupplierPayablesPage';
import { AdminSupplierPaymentsPage } from '../pages/admin/AdminSupplierPaymentsPage';
import { AdminSuppliersPage } from '../pages/admin/AdminSuppliersPage';
import { AdminInventoryOperationsPage } from '../pages/admin/AdminInventoryOperationsPage';
import { AdminAiOperationsPage } from '../pages/admin/AdminAiOperationsPage';
import { AdminApprovalsPage, type ApprovalTypeFilter } from '../pages/admin/AdminApprovalsPage';
import { AdminAuditLogPage } from '../pages/admin/AdminAuditLogPage';
import { AdminAccountingPage } from '../pages/admin/AdminAccountingPage';
import type { AccountingVariant } from '../mocks/adminAccounting';
import {
  AccountPage,
  CartPage,
  CheckoutPage,
  CustomerHomePage,
  OrderDetailPage,
  OrdersPage,
  ProductDetailPage,
  ProductsPage,
} from '../pages/customer/CustomerPages';
import { PosLoginPage, PosOverviewPage, PosReceiptPage, PosSalePage } from '../pages/pos/PosPages';
import { AuthLayout } from '../layouts/AuthLayout';
import { AuthPlaceholderPage } from '../pages/auth/AuthPlaceholderPage';
import { adminRoutes } from './adminNavigation';

function getAdminRouteElement(route: (typeof adminRoutes)[number]) {
  if (route.screen === 'dashboard') {
    return <AdminDashboardPage />;
  }

  if (route.screen === 'products') {
    return <AdminProductsPage />;
  }

  if (route.screen === 'price-lists') {
    return <AdminPriceListsPage />;
  }

  if (route.screen === 'system-users') {
    return <AdminSystemUsersPage />;
  }

  if (route.screen === 'system-roles') {
    return <AdminRolesPage />;
  }

  if (route.screen === 'product-categories') {
    return <AdminCategoriesPage />;
  }

  if (route.screen === 'customers') {
    return <AdminCustomersPage />;
  }

  if (route.screen === 'suppliers') {
    return <AdminSuppliersPage />;
  }

  if (route.screen === 'materials') {
    return <AdminMaterialsPage />;
  }

  if (route.screen === 'material-create') {
    return <AdminMaterialCreatePage />;
  }

  if (route.screen === 'material-groups') {
    return <AdminCatalogMasterPage variant="material-groups" />;
  }

  if (route.screen === 'units') {
    return <AdminUnitsPage />;
  }

  if (route.screen === 'unit-conversions') {
    return <AdminCatalogMasterPage variant="unit-conversions" />;
  }

  if (route.screen === 'branches') {
    return <AdminBranchesPage />;
  }

  if (route.screen === 'warehouses') {
    return <AdminWarehousesPage />;
  }

  if (route.screen === 'sales-orders') {
    const retailOnly = route.path.endsWith('/retail-orders');
    const channel = route.path.endsWith('/website')
      ? 'WEBSITE'
      : route.path.endsWith('/pos')
        ? 'POS'
        : route.path.endsWith('/wholesale')
          ? 'WHOLESALE'
          : undefined;
    return <AdminSalesOrdersPage channel={channel} retailOnly={retailOnly} />;
  }

  if (route.screen === 'sales-payments') {
    return <AdminSalesPaymentsPage />;
  }

  if (route.screen === 'sales-receivables') {
    return <AdminSalesReceivablesPage />;
  }

  if (route.screen === 'supplier-payables') {
    return <AdminSupplierPayablesPage />;
  }

  if (route.screen === 'supplier-payments') {
    return <AdminSupplierPaymentsPage />;
  }

  if (route.screen === 'purchase-orders') {
    return <AdminPurchaseOrdersPage retailOnly={route.path.endsWith('/retail-orders')} />;
  }

  if (route.screen === 'purchase-order-form') {
    return <AdminPurchaseOrderFormPage retailOnly={route.path.includes('/retail-orders/')} />;
  }

  if (route.screen === 'goods-receipts') {
    return <AdminGoodsReceiptsPage />;
  }

  if (route.screen === 'goods-receipt-form') {
    return <AdminGoodsReceiptFormPage />;
  }

  if (route.screen === 'inventory-operations') {
    const variant = route.path === '/admin/locations'
      ? 'locations'
      : route.path.endsWith('/stock-issues')
        ? 'stock-issues'
        : route.path.endsWith('/balance')
          ? 'balance'
          : route.path.endsWith('/movements')
            ? 'movements'
            : route.path.endsWith('/transfers')
              ? 'transfers'
              : route.path.endsWith('/stocktakes')
                ? 'stocktakes'
                : 'write-offs';
    return <AdminInventoryOperationsPage variant={variant} />;
  }

  if (route.screen === 'ai-operations') {
    const variant = route.path.endsWith('/chat')
      ? 'chat'
      : route.path.endsWith('/inventory-signals')
        ? 'signals'
        : route.path.endsWith('/proposals')
          ? 'proposals'
          : 'tool-history';
    return <AdminAiOperationsPage variant={variant} />;
  }

  if (route.screen === 'approvals') {
    const typeBySuffix: Record<string, ApprovalTypeFilter> = {
      wholesale: 'WHOLESALE',
      purchase: 'PURCHASE',
      inventory: 'INVENTORY',
      'write-offs': 'WRITE_OFF',
      ai: 'AI',
    };
    return <AdminApprovalsPage type={typeBySuffix[route.path.split('/').at(-1) ?? ''] ?? 'ALL'} />;
  }

  if (route.screen === 'audit-logs') {
    return <AdminAuditLogPage activityOnly={route.path.endsWith('/activity-logs')} />;
  }

  if (route.screen === 'accounting') {
    const variantByPath: Record<string, AccountingVariant> = {
      '/admin/accounting/purchase/goods-vouchers': 'purchase-goods',
      '/admin/accounting/purchase/service-vouchers': 'purchase-services',
      '/admin/accounting/purchase/returns': 'purchase-returns',
      '/admin/accounting/sales/vouchers': 'sales-vouchers',
      '/admin/accounting/sales/invoices': 'sales-invoices',
      '/admin/accounting/sales/ecommerce-vouchers': 'ecommerce-vouchers',
    };
    return <AdminAccountingPage variant={variantByPath[route.path]} />;
  }

  return <AdminPlaceholderPage title={route.title} />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route index element={<CustomerHomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="account" element={<AccountPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<AuthPlaceholderPage mode="login" />} />
        <Route path="register" element={<AuthPlaceholderPage mode="register" />} />
      </Route>

      <Route path="pos/login" element={<PosLoginPage />} />
      <Route path="pos" element={<PosLayout />}>
        <Route index element={<PosOverviewPage />} />
        <Route path="sale" element={<PosSalePage />} />
        <Route path="receipts/:id" element={<PosReceiptPage />} />
      </Route>

      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        {adminRoutes.map((route) => (
          <Route
            key={route.key}
            path={route.path.replace('/admin/', '')}
            element={getAdminRouteElement(route)}
          />
        ))}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
