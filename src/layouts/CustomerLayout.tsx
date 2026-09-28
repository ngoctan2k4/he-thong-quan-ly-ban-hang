/* Hallmark · macrostructure: Catalogue storefront · tone: assured retail utility · anchor hue: navy */
import {
  AppstoreOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Badge, Button, Drawer, Flex, Input, Layout, Popover, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCommerce } from '../features/commerce/CommerceContext';
import { categories } from '../mocks/commerce';
import '../styles/customer.css';

const { Header, Content, Footer } = Layout;

export function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, activeCustomer } = useCommerce();
  const [mobileOpen, setMobileOpen] = useState(false);

  const search = (value: string) => {
    const query = value.trim();
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : '/products');
    setMobileOpen(false);
  };

  const categoryMenu = (
    <div className="customer-mega-menu" aria-label="Danh mục sản phẩm">
      <div className="customer-mega-menu__intro">
        <Typography.Text strong>Mua theo ngành hàng</Typography.Text>
        <Typography.Text type="secondary">Tìm nhanh từ danh mục đang có</Typography.Text>
      </div>
      <div className="customer-mega-menu__grid">
        {categories.filter((category) => category !== 'Tất cả').map((category) => (
          <Link
            key={category}
            to={`/products?category=${encodeURIComponent(category)}`}
            onClick={() => setMobileOpen(false)}
          >
            <span>{category.slice(0, 1)}</span>
            {category}
          </Link>
        ))}
      </div>
    </div>
  );

  const primaryLinks = (
    <>
      <Link className={location.pathname === '/' ? 'is-active' : ''} to="/" onClick={() => setMobileOpen(false)}>Trang chủ</Link>
      <Link className={location.pathname.startsWith('/products') ? 'is-active' : ''} to="/products" onClick={() => setMobileOpen(false)}>Sản phẩm</Link>
      <Link className={location.pathname.startsWith('/orders') ? 'is-active' : ''} to="/orders" onClick={() => setMobileOpen(false)}>Theo dõi đơn</Link>
    </>
  );

  return (
    <Layout className="app-shell customer-shell">
      <div className="customer-announcement">
        <div className="layout-container">
          <span>Giá lẻ và giá sỉ minh bạch trên cùng một hệ thống</span>
          <span><CustomerServiceOutlined /> Hỗ trợ đặt hàng trong giờ làm việc</span>
        </div>
      </div>
      <Header className="customer-header">
        <Flex align="center" gap={20} className="layout-container customer-header__main">
          <Button
            className="customer-mobile-menu"
            type="text"
            icon={<MenuOutlined />}
            aria-label="Mở điều hướng"
            onClick={() => setMobileOpen(true)}
          />
          <Link to="/" className="brand-link" aria-label="SalesHub - Trang chủ">
            <span className="brand-link__mark"><ShopOutlined /></span>
            <span><strong>Sales</strong>Hub<small>Mua sắm đa kênh</small></span>
          </Link>
          <Input.Search
            prefix={<SearchOutlined />}
            placeholder="Tìm tên sản phẩm, SKU hoặc thương hiệu"
            className="customer-search"
            enterButton="Tìm kiếm"
            onSearch={search}
          />
          <Space className="customer-actions" size={4}>
            <Tag className="customer-type-tag" color={activeCustomer.type === 'WHOLESALE' ? 'gold' : 'blue'}>{activeCustomer.type}</Tag>
            <Link to="/orders"><Button type="text" icon={<FileTextOutlined />}><span>Đơn hàng</span></Button></Link>
            <Link to="/account"><Button type="text" icon={<UserOutlined />}><span>Tài khoản</span></Button></Link>
            <Badge count={cartCount} showZero>
              <Link to="/cart"><Button className="customer-cart-button" type="text" icon={<ShoppingCartOutlined />} aria-label={`Giỏ hàng có ${cartCount} sản phẩm`} /></Link>
            </Badge>
          </Space>
        </Flex>
        <div className="customer-nav-row">
          <div className="layout-container">
            <Popover content={categoryMenu} overlayClassName="customer-shell customer-mega-menu-overlay" placement="bottomLeft" trigger="hover" mouseEnterDelay={0.25}>
              <Link className="customer-category-trigger" to="/products">
                <AppstoreOutlined /> Danh mục sản phẩm
              </Link>
            </Popover>
            <nav className="customer-primary-nav" aria-label="Điều hướng cửa hàng">{primaryLinks}</nav>
            <div className="customer-hot-keywords">
              <Typography.Text type="secondary">Tìm nhanh:</Typography.Text>
              {['Đồ uống', 'Thực phẩm', 'Gia dụng'].map((keyword) => (
                <Link key={keyword} to={`/products?q=${encodeURIComponent(keyword)}`}>{keyword}</Link>
              ))}
            </div>
          </div>
        </div>
      </Header>
      <Content className="page-content">
        <div className="layout-container"><Outlet /></div>
      </Content>
      <Footer className="customer-footer">
        <div className="layout-container customer-footer__grid">
          <div className="customer-footer__brand">
            <Link to="/" className="brand-link"><span className="brand-link__mark"><ShopOutlined /></span><span><strong>Sales</strong>Hub</span></Link>
            <Typography.Paragraph>Điểm mua sắm chung cho khách lẻ, khách VIP và đối tác mua sỉ với cùng một nguồn tồn kho.</Typography.Paragraph>
          </div>
          <div><Typography.Title level={5}>Mua sắm</Typography.Title><Link to="/products">Tất cả sản phẩm</Link><Link to="/cart">Giỏ hàng</Link><Link to="/orders">Đơn hàng của tôi</Link></div>
          <div><Typography.Title level={5}>Tài khoản</Typography.Title><Link to="/account">Hồ sơ khách hàng</Link><Link to="/login">Đăng nhập</Link><Link to="/register">Đăng ký mua sỉ</Link></div>
          <div><Typography.Title level={5}>Hỗ trợ</Typography.Title><Typography.Text>Hướng dẫn mua hàng</Typography.Text><Typography.Text>Chính sách đổi trả</Typography.Text><Typography.Text type="secondary">Thông tin liên hệ đang được cập nhật</Typography.Text></div>
        </div>
        <div className="layout-container customer-footer__bottom">
          <Typography.Text type="secondary">© 2026 SalesHub · Giao diện trình diễn</Typography.Text>
          <Link to="/admin/dashboard">Khu vực quản trị</Link>
        </div>
      </Footer>
      <Drawer
        className="customer-mobile-drawer customer-shell"
        title={<Link to="/" className="brand-link"><ShopOutlined /> SalesHub</Link>}
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Input.Search placeholder="Tìm sản phẩm" onSearch={search} />
        <nav className="customer-mobile-nav">{primaryLinks}{categoryMenu}</nav>
      </Drawer>
    </Layout>
  );
}
