import { Card, Layout } from 'antd';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <Layout className="auth-shell">
      <Card className="auth-card">
        <Outlet />
      </Card>
    </Layout>
  );
}
