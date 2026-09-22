import { FileTextOutlined, ShoppingCartOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import { Badge, Button, Flex, Input, Layout, Space, Tag, Typography } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useCommerce } from '../features/commerce/CommerceContext';
import '../styles/customer.css';

const { Header, Content, Footer } = Layout;

export function CustomerLayout() {
  const navigate = useNavigate();
  const { cartCount, activeCustomer } = useCommerce();

  return (
    <Layout className="app-shell customer-shell">
      <Header className="customer-header">
        <Flex align="center" justify="space-between" gap={24} className="layout-container">
          <Space size="large">
            <Link to="/" className="brand-link"><ShopOutlined /> SalesHub</Link>
            <Link to="/">Trang chủ</Link>
            <Link to="/products">Sản phẩm</Link>
          </Space>
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            className="customer-search"
            onSearch={(value) => navigate(`/products?q=${encodeURIComponent(value)}`)}
          />
          <Space className="customer-actions">
            <Tag color={activeCustomer.type === 'WHOLESALE' ? 'gold' : 'blue'}>{activeCustomer.type}</Tag>
            <Link to="/orders"><Button type="text" icon={<FileTextOutlined />}>Đơn hàng</Button></Link>
            <Link to="/account"><Button type="text" icon={<UserOutlined />}>Tài khoản</Button></Link>
            <Badge count={cartCount} showZero>
              <Link to="/cart"><Button type="text" icon={<ShoppingCartOutlined />} /></Link>
            </Badge>
          </Space>
        </Flex>
      </Header>
      <Content className="page-content">
        <div className="layout-container"><Outlet /></div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        <Space split="·" wrap>
          <Typography.Text strong>SalesHub</Typography.Text>
          <Typography.Text type="secondary">Mua lẻ · Mua sỉ</Typography.Text>
          <Link to="/admin/dashboard">Quản trị</Link>
        </Space>
      </Footer>
    </Layout>
  );
}
