import { Layout, Menu, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

export function PosLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Layout className="app-shell">
      <Header className="pos-header">
        <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>POS</Typography.Title>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={[
            { key: '/pos', label: 'Tổng quan' },
            { key: '/pos/sale', label: 'Bán hàng tại quầy' },
          ]}
        />
      </Header>
      <Content className="page-content">
        <div className="layout-container"><Outlet /></div>
      </Content>
    </Layout>
  );
}
