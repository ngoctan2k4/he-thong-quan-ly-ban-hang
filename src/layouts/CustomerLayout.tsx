import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Badge, Button, Flex, Input, Layout, Space, Typography } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

export function CustomerLayout() {
  return (
    <Layout className="app-shell">
      <Header className="customer-header">
        <Flex align="center" justify="space-between" gap={24} className="layout-container">
          <Space size="large">
            <Link to="/" className="brand-link">SalesHub</Link>
            <Link to="/">Trang chủ</Link>
            <Link to="/products">Sản phẩm</Link>
          </Space>
          <Input.Search placeholder="Tìm kiếm sản phẩm..." className="customer-search" />
          <Space>
            <Button type="text" icon={<UserOutlined />}>Tài khoản</Button>
            <Badge count={0} showZero>
              <Button type="text" icon={<ShoppingCartOutlined />} />
            </Badge>
          </Space>
        </Flex>
      </Header>
      <Content className="page-content">
        <div className="layout-container"><Outlet /></div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        <Typography.Text type="secondary">© 2026 Sales Management System</Typography.Text>
      </Footer>
    </Layout>
  );
}
