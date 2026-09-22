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
import { CustomerHomePage } from '../pages/customer/CustomerHomePage';
import { CustomerPlaceholderPage } from '../pages/customer/CustomerPlaceholderPage';
import { PosPlaceholderPage } from '../pages/pos/PosPlaceholderPage';
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
        <Route path="products" element={<CustomerPlaceholderPage title="Danh sách sản phẩm" description="7.1 Website khách hàng" />} />
        <Route path="products/:id" element={<CustomerPlaceholderPage title="Chi tiết sản phẩm" description="7.1 Website khách hàng" />} />
        <Route path="cart" element={<CustomerPlaceholderPage title="Giỏ hàng" description="7.1 Website khách hàng" />} />
        <Route path="checkout" element={<CustomerPlaceholderPage title="Checkout" description="7.1 Website khách hàng" />} />
        <Route path="orders" element={<CustomerPlaceholderPage title="Lịch sử đơn hàng" description="7.1 Website khách hàng" />} />
        <Route path="orders/:id" element={<CustomerPlaceholderPage title="Chi tiết đơn hàng" description="7.1 Website khách hàng" />} />
        <Route path="account" element={<CustomerPlaceholderPage title="Tài khoản khách hàng" description="7.1 Website khách hàng" />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<AuthPlaceholderPage mode="login" />} />
        <Route path="register" element={<AuthPlaceholderPage mode="register" />} />
      </Route>

      <Route path="pos" element={<PosLayout />}>
        <Route index element={<PosPlaceholderPage title="POS Overview" />} />
        <Route path="sale" element={<PosPlaceholderPage title="Bán hàng tại quầy" />} />
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
