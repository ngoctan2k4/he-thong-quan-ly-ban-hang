import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { PosLayout } from '../layouts/PosLayout';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminCatalogMasterPage } from '../pages/admin/AdminCatalogMasterPage';
import { AdminMaterialCreatePage } from '../pages/admin/AdminMaterialCreatePage';
import { AdminMaterialsPage } from '../pages/admin/AdminMaterialsPage';
import { AdminPlaceholderPage } from '../pages/admin/AdminPlaceholderPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminSalesPaymentsPage } from '../pages/admin/AdminSalesPaymentsPage';
import { AdminSalesReceivablesPage } from '../pages/admin/AdminSalesReceivablesPage';
import { AdminSupplierPayablesPage } from '../pages/admin/AdminSupplierPayablesPage';
import { AdminSupplierPaymentsPage } from '../pages/admin/AdminSupplierPaymentsPage';
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
    return <AdminCatalogMasterPage variant="units" />;
  }

  if (route.screen === 'unit-conversions') {
    return <AdminCatalogMasterPage variant="unit-conversions" />;
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
