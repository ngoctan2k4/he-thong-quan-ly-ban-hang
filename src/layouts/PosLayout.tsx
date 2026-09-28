import { LogoutOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Tag, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

export function PosLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Layout className="app-shell">
      <Header className="pos-header">
        <Space className="pos-brand"><ShopOutlined /><Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>SalesHub POS</Typography.Title></Space>
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
        <Space className="pos-user"><Tag color="green">Ca sáng</Tag><Typography.Text style={{ color: '#fff' }}><UserOutlined /> Lê Hoàng Nam</Typography.Text><Button type="text" icon={<LogoutOutlined />} style={{ color: '#fff' }} onClick={() => { sessionStorage.removeItem('posStaff'); navigate('/pos/login'); }} /></Space>
      </Header>
      <Content className={location.pathname === '/pos/sale' ? 'pos-sale-content' : 'page-content'}>
        <div className={location.pathname === '/pos/sale' ? '' : 'layout-container'}><Outlet /></div>
      </Content>
    </Layout>
  );
}
