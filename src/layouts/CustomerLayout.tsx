import {
  AppstoreOutlined,
  CreditCardOutlined,
  DownOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  FireOutlined,
  LogoutOutlined,
  PhoneOutlined,
  SafetyCertificateFilled,
  SearchOutlined,
  ShoppingCartOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  TruckOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Col,
  Divider,
  Dropdown,
  Flex,
  Input,
  Layout,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useCommerce } from '../features/commerce/CommerceContext';
import { formatCurrency } from '../features/commerce/pricing';
import { megaMenuData } from '../mocks/commerce';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

// ── Smart Search Component with Instant Autocomplete ─────────────────────────
function SmartSearchBar() {
  const navigate = useNavigate();
  const { products } = useCommerce();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const hotKeywords = ['iPhone 16 Pro Max', 'Tủ lạnh Inverter', 'Tivi LG OLED', 'MacBook M3', 'Robot Dreame', 'Máy giặt AI'];

  const matchedProducts = query.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            (p.brand && p.brand.toLowerCase().includes(query.toLowerCase())) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 4)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (value: string) => {
    setIsOpen(false);
    navigate(`/products?q=${encodeURIComponent(value)}`);
  };

  return (
    <div ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: 520, margin: '0 16px' }}>
      <Input
        size="large"
        prefix={<SearchOutlined style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }} />}
        placeholder="Tìm máy giặt, Tivi OLED, iPhone 16 Pro..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onPressEnter={(e) => handleSearchSubmit((e.target as HTMLInputElement).value)}
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          borderRadius: 12,
          color: '#ffffff',
          padding: '8px 16px',
        }}
      />

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            borderRadius: 16,
            boxShadow: '0 15px 45px rgba(10, 36, 99, 0.2)',
            border: '1px solid #e2e8f0',
            padding: 16,
            zIndex: 1000,
            color: '#0f172a',
          }}
        >
          {/* Hot trending keywords */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FireOutlined style={{ color: '#FF6B2B' }} /> Từ khóa tìm kiếm phổ biến
            </div>
            <Flex wrap gap={6}>
              {hotKeywords.map((kw) => (
                <Tag
                  key={kw}
                  onClick={() => {
                    setQuery(kw);
                    handleSearchSubmit(kw);
                  }}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 20,
                    padding: '4px 12px',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    fontWeight: 500,
                  }}
                >
                  {kw}
                </Tag>
              ))}
            </Flex>
          </div>

          {/* Instant Product Results */}
          {matchedProducts.length > 0 && (
            <div>
              <Divider style={{ margin: '10px 0' }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
                Gợi ý sản phẩm ({matchedProducts.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {matchedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setIsOpen(false);
                      navigate(`/products/${p.id}`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '8px 10px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 8, background: '#f8fafc', padding: 2 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
                        <span style={{ color: '#FF6B2B', fontWeight: 800, fontSize: 13 }}>
                          {formatCurrency(p.retailPrice)}
                        </span>
                        {p.oldPrice && (
                          <span style={{ color: '#94a3b8', textDecoration: 'line-through', fontSize: 11 }}>
                            {formatCurrency(p.oldPrice)}
                          </span>
                        )}
                        <Tag color="blue" style={{ fontSize: 10, lineHeight: '16px', padding: '0 4px', margin: 0 }}>
                          {p.category}
                        </Tag>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query.trim() && matchedProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '12px 0', color: '#64748b', fontSize: 13 }}>
              Nhấn <strong>Enter</strong> để tìm kiếm tất cả kết quả cho "<em>{query}</em>"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Mega Menu Component ───────────────────────────────────────────────────────
function MegaMenuDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const curGroup = megaMenuData[activeCategoryIndex];

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <Button
        type="text"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: isOpen ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
          borderColor: 'rgba(255,255,255,0.3)',
          color: '#ffffff',
          fontWeight: 700,
          borderRadius: 10,
          height: 42,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <AppstoreOutlined style={{ fontSize: 16 }} />
        <span>Danh mục sản phẩm</span>
        <DownOutlined style={{ fontSize: 11, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </Button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            left: 0,
            width: 880,
            background: '#ffffff',
            borderRadius: 18,
            boxShadow: '0 20px 60px rgba(10, 36, 99, 0.22)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            overflow: 'hidden',
            zIndex: 1000,
          }}
        >
          {/* Left Sidebar Categories */}
          <div style={{ width: 260, background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '12px 8px' }}>
            {megaMenuData.map((item, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveCategoryIndex(idx)}
                onClick={() => {
                  setIsOpen(false);
                  navigate(item.link);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontWeight: activeCategoryIndex === idx ? 700 : 500,
                  color: activeCategoryIndex === idx ? 'var(--primary)' : '#334155',
                  background: activeCategoryIndex === idx ? '#ffffff' : 'transparent',
                  boxShadow: activeCategoryIndex === idx ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.15s ease',
                  marginBottom: 4,
                }}
              >
                <Space size={10}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: 13.5 }}>{item.category}</span>
                </Space>
                <span style={{ color: activeCategoryIndex === idx ? 'var(--accent)' : '#94a3b8', fontSize: 12 }}>›</span>
              </div>
            ))}
          </div>

          {/* Right Sub-group details */}
          <div style={{ flex: 1, padding: 24, background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <Title level={4} style={{ margin: 0, color: 'var(--primary)', fontWeight: 800 }}>
                {curGroup.icon} {curGroup.category}
              </Title>
              <Link
                to={curGroup.link}
                onClick={() => setIsOpen(false)}
                style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 13 }}
              >
                Xem tất cả {curGroup.category} →
              </Link>
            </div>

            <Row gutter={[24, 24]}>
              {curGroup.subGroups.map((sub, sIdx) => (
                <Col span={8} key={sIdx}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.3 }}>
                    {sub.title}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {sub.items.map((it, itIdx) => (
                      <Link
                        key={itIdx}
                        to={`${curGroup.link}&sub=${encodeURIComponent(it)}`}
                        onClick={() => setIsOpen(false)}
                        style={{
                          fontSize: 13,
                          color: '#475569',
                          transition: 'color 0.2s',
                          display: 'block',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                      >
                        {it}
                      </Link>
                    ))}
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Customer Layout ──────────────────────────────────────────────────────
export function CustomerLayout() {
  const navigate = useNavigate();
  const { cartCount, activeCustomer } = useCommerce();

  const userMenu = {
    items: [
      { key: 'account', icon: <UserOutlined />, label: 'Tài khoản của tôi', onClick: () => navigate('/account') },
      { key: 'orders', icon: <FileTextOutlined />, label: 'Đơn hàng của tôi', onClick: () => navigate('/orders') },
      { type: 'divider' as const },
      { key: 'logout', icon: <LogoutOutlined />, danger: true, label: 'Đăng xuất', onClick: () => navigate('/login') },
    ],
  };

  return (
    <Layout className="app-shell">
      {/* Top Banner Bar */}
      <div style={{ background: '#07183e', color: 'rgba(255,255,255,0.85)', padding: '6px 0', fontSize: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="layout-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size={18}>
            <span>⚡ <strong>Siêu hội mua sắm TechHub:</strong> Giảm đến 50% thiết bị điện máy</span>
            <span>|</span>
            <Space size={6}><TruckOutlined style={{ color: '#FF6B2B' }} /> Giao nhanh 2h toàn quốc</Space>
          </Space>
          <Space size={16}>
            <Space size={4}><PhoneOutlined style={{ color: '#FF6B2B' }} /> Hotline: <strong>1800 6750</strong> (Miễn phí)</Space>
            <span>·</span>
            <Link to="/pos/login" style={{ color: 'rgba(255,255,255,0.7)' }}>Nhân viên POS</Link>
            <span>·</span>
            <Link to="/admin/dashboard" style={{ color: 'rgba(255,255,255,0.7)' }}>Quản trị hệ thống</Link>
          </Space>
        </div>
      </div>

      {/* Main Sticky Header */}
      <Header className="customer-header" style={{ height: 'auto', padding: 0 }}>
        <Flex align="center" justify="space-between" className="layout-container" style={{ padding: '12px 0' }}>
          {/* Logo & Mega Menu */}
          <Space size={18} align="center">
            <Link to="/" className="brand-link">
              TechHub
            </Link>
            <MegaMenuDropdown />
          </Space>

          {/* Smart Autocomplete Search */}
          <SmartSearchBar />

          {/* User & Cart Actions */}
          <Space className="customer-actions" size={14} align="center">
            <Tag color={activeCustomer.type === 'WHOLESALE' ? 'gold' : 'blue'} style={{ padding: '4px 10px', borderRadius: 8, fontWeight: 700 }}>
              {activeCustomer.type === 'WHOLESALE' ? '👑 ĐẠI LÝ SỈ' : 'KHÁCH HÀNG'}
            </Tag>

            <Link to="/orders">
              <Button type="text" icon={<FileTextOutlined style={{ fontSize: 16 }} />} style={{ color: 'rgba(255,255,255,0.9)', height: 42 }}>
                Đơn hàng
              </Button>
            </Link>

            <Dropdown menu={userMenu} placement="bottomRight">
              <Button type="text" icon={<UserOutlined style={{ fontSize: 16 }} />} style={{ color: 'rgba(255,255,255,0.9)', height: 42 }}>
                {activeCustomer.fullName.split(' ').pop()}
              </Button>
            </Dropdown>

            <Badge count={cartCount} showZero offset={[-4, 4]}>
              <Link to="/cart">
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined style={{ fontSize: 18 }} />}
                  style={{
                    background: 'var(--accent)',
                    borderColor: 'var(--accent)',
                    height: 42,
                    padding: '0 18px',
                    borderRadius: 10,
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(255, 107, 43, 0.4)',
                  }}
                >
                  Giỏ hàng
                </Button>
              </Link>
            </Badge>
          </Space>
        </Flex>
      </Header>

      {/* Main Page Outlet */}
      <Content className="page-content">
        <div className="layout-container">
          <Outlet />
        </div>
      </Content>

      {/* High-End Luxury E-Commerce Footer */}
      <Footer style={{ background: '#061330', color: '#ffffff', padding: 0, marginTop: 72, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Top Trust Pillars Strip */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '28px 0' }}>
          <div className="layout-container">
            <Row gutter={[24, 20]}>
              {[
                { icon: <TruckOutlined style={{ fontSize: 28, color: '#FF6B2B' }} />, title: 'Giao Hoả Tốc 2 Giờ', desc: 'Miễn phí giao hàng toàn quốc đơn từ 500K' },
                { icon: <SafetyCertificateFilled style={{ fontSize: 28, color: '#10b981' }} />, title: 'Bảo Hành 24 Tháng', desc: '100% hàng chính hãng đầy đủ VAT/CO-CQ' },
                { icon: <SyncOutlined style={{ fontSize: 28, color: '#38bdf8' }} />, title: '1 Đổi 1 Trong 30 Ngày', desc: 'Đổi mới nguyên seal nếu lỗi từ nhà sản xuất' },
                { icon: <CreditCardOutlined style={{ fontSize: 28, color: '#a855f7' }} />, title: 'Trả Góp 0% Lãi Suất', desc: 'Thủ tục online 5 phút, duyệt qua CCCD' },
              ].map((item, i) => (
                <Col xs={24} sm={12} lg={6} key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(255,255,255,0.06)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: '#ffffff' }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{item.desc}</div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Newsletter Subscription Bar */}
        <div style={{ background: 'linear-gradient(90deg, #0A2463 0%, #173680 50%, #0A2463 100%)', padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="layout-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                🎁 ĐĂNG KÝ NHẬN BẢN TIN KHUYẾN MÃI
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
                Nhận ngay <strong>Voucher giảm 200.000đ</strong> cho đơn hàng đầu tiên và cập nhật deal hot sớm nhất
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 440 }}>
              <Input
                placeholder="Nhập địa chỉ email của bạn..."
                size="large"
                style={{ borderRadius: 10, background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.25)', color: '#ffffff' }}
              />
              <Button
                type="primary"
                size="large"
                style={{ background: 'var(--accent)', borderColor: 'var(--accent)', borderRadius: 10, fontWeight: 800, padding: '0 24px' }}
              >
                Đăng ký
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="layout-container" style={{ padding: '54px 0 32px' }}>
          <Row gutter={[40, 36]}>
            {/* Col 1: About & Hotline */}
            <Col xs={24} md={7}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <ThunderboltOutlined style={{ color: 'var(--accent)', fontSize: 26 }} />
                <span style={{ color: '#ffffff', fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>TechHub</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13.5, lineHeight: 1.7, margin: '0 0 20px' }}>
                Hệ thống phân phối điện tử, thiết bị số & gia dụng chính hãng hàng đầu Việt Nam. Đối tác chiến lược uỷ quyền của Apple, Samsung, LG, Sony, Panasonic và Philips.
              </p>
              <div style={{ background: 'linear-gradient(135deg, rgba(255,107,43,0.15) 0%, rgba(255,107,43,0.05) 100%)', border: '1px solid rgba(255,107,43,0.3)', borderRadius: 14, padding: '16px 20px' }}>
                <div style={{ fontSize: 11.5, color: '#ffb08a', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>
                  📞 Tổng đài hỗ trợ miễn cước (8:00 - 21:30)
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#FF6B2B', margin: '4px 0 2px' }}>
                  1800 6750
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                  Email: <strong>cskh@techhub.vn</strong> · Tư vấn mua hàng & Bảo hành
                </div>
              </div>
            </Col>

            {/* Col 2: Categories */}
            <Col xs={12} sm={6} md={5}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 18, position: 'relative', display: 'inline-block' }}>
                DANH MỤC SẢN PHẨM
                <div style={{ width: 28, height: 2, background: 'var(--accent)', marginTop: 6, borderRadius: 2 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Điện thoại & Tablet', link: '/products?category=Điện thoại' },
                  { label: 'Laptop & Máy tính', link: '/products?category=Laptop' },
                  { label: 'Smart Tivi 4K OLED', link: '/products?category=Tivi' },
                  { label: 'Tủ lạnh & Máy giặt', link: '/products?category=Gia dụng lớn' },
                  { label: 'Gia dụng nhà bếp', link: '/products?category=Gia dụng nhỏ' },
                  { label: 'Âm thanh & Tai nghe', link: '/products?category=Âm thanh' },
                ].map((item, idx) => (
                  <Link key={idx} to={item.link} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13.5, transition: 'all 0.2s', display: 'inline-block' }}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </Col>

            {/* Col 3: Policies */}
            <Col xs={12} sm={6} md={5}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 18, position: 'relative', display: 'inline-block' }}>
                CHÍNH SÁCH & DỊCH VỤ
                <div style={{ width: 28, height: 2, background: 'var(--accent)', marginTop: 6, borderRadius: 2 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Chính sách bảo hành 24 tháng',
                  'Chính sách đổi trả 30 ngày',
                  'Chính sách giao hàng & lắp đặt',
                  'Hướng dẫn mua hàng trả góp 0%',
                  'Chính sách đại lý & chiết khấu sỉ',
                  'Tra cứu hoá đơn điện tử VAT',
                ].map((text, idx) => (
                  <span key={idx} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13.5, cursor: 'pointer', transition: 'color 0.2s' }}>
                    {text}
                  </span>
                ))}
              </div>
            </Col>

            {/* Col 4: Showrooms & Payments */}
            <Col xs={24} md={7}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 18, position: 'relative', display: 'inline-block' }}>
                HỆ THỐNG SHOWROOM TRẢI NGHIỆM
                <div style={{ width: 28, height: 2, background: 'var(--accent)', marginTop: 6, borderRadius: 2 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <EnvironmentOutlined style={{ color: 'var(--accent)', fontSize: 15, marginTop: 3 }} />
                  <div><strong>Hà Nội:</strong> 120 Thái Hà, Q. Đống Đa · <em>(024 3822 9999)</em></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <EnvironmentOutlined style={{ color: 'var(--accent)', fontSize: 15, marginTop: 3 }} />
                  <div><strong>TP. Hồ Chí Minh:</strong> 280 Nguyễn Thị Minh Khai, P.6, Q.3 · <em>(028 3930 8888)</em></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <EnvironmentOutlined style={{ color: 'var(--accent)', fontSize: 15, marginTop: 3 }} />
                  <div><strong>Đà Nẵng:</strong> 65 Nguyễn Văn Linh, Q. Hải Châu · <em>(0236 365 7777)</em></div>
                </div>
              </div>

              <div style={{ marginTop: 22 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 10 }}>
                  Phương thức thanh toán & Trả góp đa dạng
                </div>
                <Flex gap={8} wrap>
                  {['VNPAY-QR', 'MoMo', 'Visa / Master', 'Kredivo 0%', 'Fundiin', 'ZaloPay'].map((pay, i) => (
                    <Tag
                      key={i}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.15)',
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {pay}
                    </Tag>
                  ))}
                </Flex>
              </div>
            </Col>
          </Row>

          <Divider style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '40px 0 24px' }} />

          {/* Bottom Copyright & Badges */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12.5 }}>
              © 2026 <strong>TechHub Corporation</strong>. Giấy phép ĐKKD số 0101234567 do Sở Kế Hoạch & Đầu Tư cấp. Bảo lưu mọi quyền.
            </div>
            <Space size={12} wrap>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                ✓ Đã Thông Báo Bộ Công Thương
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                🔒 Chứng Nhận SSL 256-Bit
              </span>
            </Space>
          </div>
        </div>
      </Footer>
    </Layout>
  );
}
