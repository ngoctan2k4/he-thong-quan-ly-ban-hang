import {
  ArrowRightOutlined,
  CheckCircleFilled,
  CreditCardOutlined,
  DeleteOutlined,
  FilterOutlined,
  FireFilled,
  LeftOutlined,
  MinusOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  StarFilled,
  SyncOutlined,
  ThunderboltOutlined,
  TruckOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {
  App,
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Descriptions,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Progress,
  Radio,
  Rate,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusTag } from '../../components/common/StatusTag';
import { useCommerce, type CartLine } from '../../features/commerce/CommerceContext';
import { formatCurrency, formatDate, getUnitPrice } from '../../features/commerce/pricing';
import type { CatalogProduct } from '../../mocks/commerce';
import { categories, partnerBrands } from '../../mocks/commerce';

const { Title, Text, Paragraph } = Typography;

// ── Artwork Visual Container ──────────────────────────────────────────────────
function ProductArtwork({ product, large = false }: { product: CatalogProduct; large?: boolean }) {
  return (
    <div
      className={`product-artwork${large ? ' product-artwork--large' : ''}`}
      style={{
        '--product-color': product.color,
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 14,
        overflow: 'hidden',
      } as React.CSSProperties}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: large ? '85%' : '80%',
          height: large ? '85%' : '80%',
          objectFit: 'contain',
          transition: 'transform 0.3s ease',
        }}
        className="product-card-img"
      />
      <div className="product-artwork__label">{product.brand}</div>
    </div>
  );
}

// ── Price Component with Discount % ──────────────────────────────────────────
function ProductPrice({ product, quantity = 1 }: { product: CatalogProduct; quantity?: number }) {
  const { activeCustomer } = useCommerce();
  const price = getUnitPrice(product, quantity, activeCustomer.type);
  const oldPrice = product.oldPrice ?? (activeCustomer.type === 'WHOLESALE' ? product.retailPrice : undefined);
  const discountPercent = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <Space size={8} align="baseline" wrap>
      <Text className="product-price" style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 18 }}>
        {formatCurrency(price)}
      </Text>
      {oldPrice && oldPrice > price ? (
        <Text delete type="secondary" className="product-price-old" style={{ fontSize: 13 }}>
          {formatCurrency(oldPrice)}
        </Text>
      ) : null}
      {discountPercent > 0 && (
        <Tag color="error" style={{ borderRadius: 6, fontWeight: 700, fontSize: 11, padding: '0 4px', margin: 0 }}>
          -{discountPercent}%
        </Tag>
      )}
    </Space>
  );
}

// ── Product Card Component with Rich Badges ──────────────────────────────────
function ProductCard({ product }: { product: CatalogProduct }) {
  const { message } = App.useApp();
  const { addToCart, activeCustomer } = useCommerce();
  const outOfStock = product.availableStock <= 0;

  const add = () => {
    const quantity = activeCustomer.type === 'WHOLESALE' ? product.moq ?? 1 : 1;
    const result = addToCart(product, quantity);
    if (result.ok) message.success(`Đã thêm ${quantity} ${product.unit.toLowerCase()} vào giỏ hàng`);
    else message.warning(result.message);
  };

  const discountPercent = product.oldPrice && product.oldPrice > product.retailPrice
    ? Math.round(((product.oldPrice - product.retailPrice) / product.oldPrice) * 100)
    : 0;

  return (
    <Card
      className="product-card"
      styles={{ body: { padding: 16 } }}
      style={{
        '--product-color': product.color,
        borderRadius: 16,
        border: '1.5px solid #e2e8f0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      } as React.CSSProperties}
    >
      {/* Top Floating Badges */}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {discountPercent > 0 && (
          <span style={{ background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 20 }}>
            🔥 GIẢM {discountPercent}%
          </span>
        )}
        {product.tags?.[0] && (
          <span style={{ background: 'rgba(10, 36, 99, 0.85)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6, backdropFilter: 'blur(4px)' }}>
            {product.tags[0]}
          </span>
        )}
      </div>

      <Link to={`/products/${product.id}`} style={{ display: 'block', marginBottom: 12 }}>
        <ProductArtwork product={product} />
      </Link>

      <Flex vertical gap={6} className="product-card__body" style={{ flex: 1 }}>
        <Flex justify="space-between" align="center">
          <Tag bordered={false} color="blue" style={{ borderRadius: 6, fontWeight: 600, fontSize: 11 }}>
            {product.category}
          </Tag>
          <Text type={outOfStock ? 'danger' : 'secondary'} style={{ fontSize: 11.5 }}>
            {outOfStock ? '🚫 Hết hàng' : `✅ Còn ${product.availableStock}`}
          </Text>
        </Flex>

        <Link to={`/products/${product.id}`}>
          <Title level={5} ellipsis={{ rows: 2 }} className="product-card__name" style={{ margin: '4px 0', fontSize: 14, minHeight: 40, lineHeight: 1.4 }}>
            {product.name}
          </Title>
        </Link>

        {/* Rating & Sold count */}
        <Flex align="center" gap={6} style={{ fontSize: 12, color: '#64748b' }}>
          <Space size={2}>
            <StarFilled style={{ color: '#f59e0b', fontSize: 12 }} />
            <strong style={{ color: '#0f172a' }}>{product.rating ?? 4.9}</strong>
          </Space>
          <span>({product.reviewCount ?? 45})</span>
          <span>·</span>
          <span>Đã bán {product.soldCount ?? 30}</span>
        </Flex>

        <ProductPrice product={product} quantity={activeCustomer.type === 'WHOLESALE' ? product.moq : 1} />

        {activeCustomer.type === 'WHOLESALE' ? (
          <Text type="secondary" className="product-card__moq" style={{ fontSize: 12 }}>
            Đơn sỉ tối thiểu: {product.moq} {product.unit.toLowerCase()}
          </Text>
        ) : null}

        <div style={{ marginTop: 'auto', paddingTop: 8 }}>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            disabled={outOfStock}
            onClick={add}
            block
            style={{
              background: outOfStock ? undefined : 'var(--accent)',
              borderColor: outOfStock ? undefined : 'var(--accent)',
              borderRadius: 10,
              fontWeight: 700,
              height: 38,
            }}
          >
            {outOfStock ? 'Tạm hết hàng' : 'Thêm vào giỏ'}
          </Button>
        </div>
      </Flex>
    </Card>
  );
}

// ── AutoPlay Hero Slider ──────────────────────────────────────────────────────
function AutoPlayHeroSlider() {
  const { activeCustomer } = useCommerce();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      tabTitle: 'Tổng Kho B2B',
      tabDesc: 'Giá sỉ tận gốc',
      badge: 'Đại lý uỷ quyền chính thức tại Việt Nam',
      badgeIcon: <CheckCircleFilled style={{ fontSize: 13, color: '#FF6B2B' }} />,
      badgeBg: 'rgba(255,107,43,0.18)',
      badgeBorder: 'rgba(255,107,43,0.45)',
      badgeColor: '#ffb08a',
      titlePrimary: 'Tổng kho điện tử,',
      titleHighlight: 'giá sỉ tận gốc.',
      highlightColor: '#FF6B2B',
      desc: 'Chuyên phân phối thiết bị công nghệ & điện máy chính hãng. Chiết khấu lên đến 30% cho khách hàng đại lý và dự án doanh nghiệp.',
      ctaText: 'Khám phá ngay',
      ctaLink: '/products',
      ctaBg: 'var(--accent)',
      secondaryText: activeCustomer.type === 'WHOLESALE' ? 'Thông tin công nợ' : 'Chính sách mua sỉ',
      secondaryLink: '/account',
      background: 'linear-gradient(135deg, #020e26 0%, #0A2463 35%, #123592 75%, #0f172a 100%)',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=700&q=85',
      imageAlt: 'Tổng kho B2B TechHub',
    },
    {
      tabTitle: 'iPhone 16 Pro Max',
      tabDesc: 'Titan Sa Mạc',
      badge: 'Siêu phẩm công nghệ 2026',
      badgeIcon: <CheckCircleFilled style={{ fontSize: 13, color: '#10b981' }} />,
      badgeBg: 'rgba(255,255,255,0.12)',
      badgeBorder: 'rgba(255,255,255,0.3)',
      badgeColor: '#ffffff',
      titlePrimary: 'iPhone 16 Pro Max',
      titleHighlight: 'Titan Sa Mạc.',
      highlightColor: '#d4af37',
      desc: 'Thiết kế bằng titan siêu bền nhẹ với viền mỏng nhất từ trước đến nay. Trang bị chip Apple A18 Pro mạnh mẽ và nút Camera Control tiện lợi.',
      ctaText: 'Săn Deal Ngay',
      ctaLink: '/products/1',
      ctaBg: '#d4af37',
      ctaColor: '#000',
      background: 'linear-gradient(135deg, #090a0f 0%, #17151a 50%, #2b2318 100%)',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=85',
      imageAlt: 'iPhone 16 Pro Max Titan',
    },
    {
      tabTitle: 'Galaxy S24 Ultra',
      tabDesc: 'Kỷ nguyên AI mới',
      badge: 'Kỷ nguyên Galaxy AI',
      badgeIcon: <CheckCircleFilled style={{ fontSize: 13, color: '#60a5fa' }} />,
      badgeBg: 'rgba(59,130,246,0.22)',
      badgeBorder: 'rgba(59,130,246,0.55)',
      badgeColor: '#93c5fd',
      titlePrimary: 'Galaxy S24 Ultra',
      titleHighlight: 'Quyền năng đỉnh cao.',
      highlightColor: '#60a5fa',
      desc: 'Trợ lý AI dịch trực tiếp, khoanh tròn để tìm kiếm thông minh, khung Titanium siêu bền và camera 200MP Zoom đêm siêu nét.',
      ctaText: 'Khám phá ngay',
      ctaLink: '/products/2',
      ctaBg: '#3b82f6',
      background: 'linear-gradient(135deg, #071329 0%, #0d2757 50%, #1e3a8a 100%)',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=85',
      imageAlt: 'Galaxy S24 Ultra',
    },
    {
      tabTitle: 'Laptop & Gaming',
      tabDesc: 'Giảm sốc tới 25%',
      badge: 'Hiệu năng đồ hoạ & Gaming đỉnh cao',
      badgeIcon: <ThunderboltOutlined style={{ fontSize: 13, color: '#c084fc' }} />,
      badgeBg: 'rgba(192,132,252,0.22)',
      badgeBorder: 'rgba(192,132,252,0.5)',
      badgeColor: '#e9d5ff',
      titlePrimary: 'Siêu Hội Laptop,',
      titleHighlight: 'Đồ Hoạ & Doanh Nhân.',
      highlightColor: '#c084fc',
      desc: 'MacBook Pro M3 Max & Asus ROG Strix. Sức mạnh đồ họa đỉnh chóp cho lập trình viên, designer và game thủ. Tặng kèm Balo & Chuột VIP.',
      ctaText: 'Xem danh mục Laptop',
      ctaLink: '/products?category=Laptop',
      ctaBg: '#a855f7',
      background: 'linear-gradient(135deg, #180926 0%, #2c0b47 50%, #4c1d95 100%)',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=85',
      imageAlt: 'MacBook Pro & Laptop Gaming',
    },
    {
      tabTitle: 'Smart Home Gia Dụng',
      tabDesc: 'Ưu đãi trọn gói',
      badge: 'Giải pháp nhà thông minh 4.0',
      badgeIcon: <CheckCircleFilled style={{ fontSize: 13, color: '#34d399' }} />,
      badgeBg: 'rgba(52,211,153,0.22)',
      badgeBorder: 'rgba(52,211,153,0.5)',
      badgeColor: '#a7f3d0',
      titlePrimary: 'Gia Dụng & Smart Living,',
      titleHighlight: 'tiện nghi chuẩn sống.',
      highlightColor: '#34d399',
      desc: 'Robot hút bụi tự giặt giẻ Dreame, Nồi chiên không dầu Philips, Tivi 4K OLED. Ưu đãi chiết khấu sỉ theo gói dự án và chung cư.',
      ctaText: 'Mua thiết bị gia dụng',
      ctaLink: '/products?category=Gia%20d%E1%BB%A5ng%20nh%E1%BB%8F',
      ctaBg: '#059669',
      background: 'linear-gradient(135deg, #03231e 0%, #064e3b 50%, #065f46 100%)',
      image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=700&q=85',
      imageAlt: 'Gia dụng thông minh Dreame',
    },
  ];

  // Auto-play timer every 2.5 seconds (auto-advancing)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [activeSlide, slides.length]);

  const prevSlide = () => setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);

  const cur = slides[activeSlide];

  return (
    <div className="hero-slider-wrapper">
      {/* Tab Navigation */}
      <div className="hero-tabs-bar">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`hero-tab-item ${activeSlide === i ? 'active' : ''}`}
            onClick={() => setActiveSlide(i)}
          >
            <div className="hero-tab-title">{s.tabTitle}</div>
            <div className="hero-tab-desc">{s.tabDesc}</div>
            {activeSlide === i && (
              <div key={`prog-${activeSlide}`} className="hero-tab-progress-line" />
            )}
          </div>
        ))}
      </div>

      {/* Slide Display Frame */}
      <div className="hero-banner-frame">
        <div className="hero-nav-arrow hero-nav-prev" onClick={prevSlide} title="Slide trước">
          <LeftOutlined />
        </div>
        <div className="hero-nav-arrow hero-nav-next" onClick={nextSlide} title="Slide tiếp theo">
          <RightOutlined />
        </div>

        <section
          key={activeSlide}
          className="store-hero hero-slide-content-anim"
          style={{
            margin: 0,
            borderRadius: 0,
            background: cur.background,
            minHeight: 440,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Row gutter={[40, 40]} align="middle" style={{ width: '100%', margin: 0 }}>
            <Col xs={24} lg={13} style={{ paddingLeft: 0, paddingRight: 0 }}>
              <div
                className="store-hero__tag"
                style={{
                  background: cur.badgeBg,
                  border: `1px solid ${cur.badgeBorder}`,
                  color: cur.badgeColor,
                }}
              >
                {cur.badgeIcon}
                <span style={{ color: cur.badgeColor, fontWeight: 700 }}>{cur.badge}</span>
              </div>
              <h1
                style={{
                  color: '#ffffff',
                  fontSize: 'clamp(30px, 3.8vw, 50px)',
                  fontWeight: 900,
                  lineHeight: 1.15,
                  margin: '0 0 16px',
                  letterSpacing: '-1px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                {cur.titlePrimary}<br /><span style={{ color: cur.highlightColor }}>{cur.titleHighlight}</span>
              </h1>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 15.5,
                  lineHeight: 1.65,
                  maxWidth: 560,
                  marginBottom: 28,
                  fontWeight: 400,
                }}
              >
                {cur.desc}
              </p>
              <Space size={14} wrap>
                <Link to={cur.ctaLink}>
                  <Button
                    type="primary"
                    size="large"
                    className="store-hero__cta-primary"
                    style={{ background: cur.ctaBg, borderColor: cur.ctaBg, color: cur.ctaColor ?? '#fff' }}
                  >
                    {cur.ctaText} <ArrowRightOutlined />
                  </Button>
                </Link>
                {cur.secondaryText && cur.secondaryLink && (
                  <Link to={cur.secondaryLink}>
                    <Button size="large" className="store-hero__cta-secondary">
                      {cur.secondaryText}
                    </Button>
                  </Link>
                )}
              </Space>
              <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginTop: 36 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ffffff', fontSize: 13.5, fontWeight: 600 }}>
                  <TruckOutlined style={{ color: '#FF6B2B', fontSize: 16 }} /> Giao nhanh 2h
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ffffff', fontSize: 13.5, fontWeight: 600 }}>
                  <SafetyCertificateOutlined style={{ color: '#FF6B2B', fontSize: 16 }} /> Hàng chính hãng 100%
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ffffff', fontSize: 13.5, fontWeight: 600 }}>
                  <CreditCardOutlined style={{ color: '#FF6B2B', fontSize: 16 }} /> Hỗ trợ công nợ & Trả góp 0%
                </div>
              </div>
            </Col>
            <Col xs={24} lg={11} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    borderRadius: 20,
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    padding: 8,
                  }}
                >
                  <img
                    src={cur.image}
                    alt={cur.imageAlt}
                    style={{
                      maxHeight: 280,
                      width: '100%',
                      maxWidth: 380,
                      objectFit: 'cover',
                      borderRadius: 14,
                      display: 'block',
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </section>
      </div>
    </div>
  );
}

// ── Flash Sale Section Component ──────────────────────────────────────────────
function FlashSaleSection() {
  const { products } = useCommerce();
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleItems = products.filter((p) => p.isFlashSale).slice(0, 4);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 40%, #c2410c 100%)',
        borderRadius: 24,
        padding: '28px 24px',
        color: '#ffffff',
        boxShadow: '0 15px 40px rgba(185, 28, 28, 0.25)',
      }}
    >
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center', fontSize: 26 }}>
            <FireFilled style={{ color: '#fbbf24' }} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase' }}>
              ⚡ FLASH SALE GIỜ VÀNG
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Giá sốc giảm sâu - Số lượng có hạn</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>KẾT THÚC TRONG:</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { val: String(timeLeft.hours).padStart(2, '0'), label: 'GIỜ' },
              { val: String(timeLeft.minutes).padStart(2, '0'), label: 'PHÚT' },
              { val: String(timeLeft.seconds).padStart(2, '0'), label: 'GIÂY' },
            ].map((item, idx) => (
              <div key={idx} style={{ background: '#18181b', color: '#fbbf24', padding: '6px 10px', borderRadius: 8, textAlign: 'center', minWidth: 44, fontWeight: 900, fontSize: 18, border: '1px solid rgba(255,255,255,0.2)' }}>
                {item.val}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Flash Sale Cards */}
      <Row gutter={[16, 16]}>
        {flashSaleItems.map((product) => {
          const percent = product.oldPrice ? Math.round(((product.oldPrice - product.retailPrice) / product.oldPrice) * 100) : 15;
          const soldPercentage = Math.min(95, Math.round((product.soldCount / (product.soldCount + product.availableStock)) * 100));

          return (
            <Col xs={24} sm={12} lg={6} key={product.id}>
              <Card
                style={{ borderRadius: 16, overflow: 'hidden', border: 'none', height: '100%' }}
                styles={{ body: { padding: 14 } }}
              >
                <Link to={`/products/${product.id}`} style={{ position: 'relative', display: 'block' }}>
                  <div style={{ height: 160, background: '#f8fafc', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <img src={product.image} alt={product.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                  </div>
                  <Tag color="error" style={{ position: 'absolute', top: 8, right: 8, fontWeight: 800, borderRadius: 12, padding: '2px 8px' }}>
                    -{percent}%
                  </Tag>
                </Link>

                <Link to={`/products/${product.id}`}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 6 }}>
                    {product.name}
                  </div>
                </Link>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                  <span style={{ color: '#dc2626', fontWeight: 900, fontSize: 17 }}>
                    {formatCurrency(product.retailPrice)}
                  </span>
                  {product.oldPrice && (
                    <span style={{ color: '#94a3b8', textDecoration: 'line-through', fontSize: 12 }}>
                      {formatCurrency(product.oldPrice)}
                    </span>
                  )}
                </div>

                {/* Sold Progress */}
                <div style={{ background: '#fef2f2', borderRadius: 20, padding: '4px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #fee2e2' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626' }}>
                    🔥 ĐÃ BÁN {product.soldCount}
                  </span>
                  <Progress percent={soldPercentage} size="small" showInfo={false} strokeColor="#dc2626" style={{ width: 60, margin: 0 }} />
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

// ── Lifestyle & Category Tabs ─────────────────────────────────────────────────
function CategoryLifestyleTabs() {
  const { products } = useCommerce();
  const [activeTab, setActiveTab] = useState('bestseller');

  const filteredProducts = useMemo(() => {
    switch (activeTab) {
      case 'bestseller':
        return [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 8);
      case 'new':
        return [...products].slice(0, 8);
      case 'livingroom':
        return products.filter((p) => p.category === 'Tivi' || p.category === 'Âm thanh').slice(0, 8);
      case 'kitchen':
        return products.filter((p) => p.category === 'Gia dụng lớn' || p.category === 'Gia dụng nhỏ').slice(0, 8);
      case 'workspace':
        return products.filter((p) => p.category === 'Laptop' || p.category === 'Điện thoại').slice(0, 8);
      default:
        return products.slice(0, 8);
    }
  }, [activeTab, products]);

  const tabs = [
    { key: 'bestseller', label: '🌟 Bán chạy nhất' },
    { key: 'new', label: '✨ Hàng mới về 2026' },
    { key: 'livingroom', label: '🛋️ Phòng khách sang trọng' },
    { key: 'kitchen', label: '🍳 Gian bếp tiện nghi' },
    { key: 'workspace', label: '💻 Góc làm việc & Gaming' },
  ];

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <Text type="secondary" style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--accent)' }}>
            LỰA CHỌN THEO NHU CẦU
          </Text>
          <Title level={2} style={{ margin: '4px 0 0', color: 'var(--primary)', fontWeight: 900 }}>
            Khám phá danh mục nổi bật
          </Title>
        </div>
        <Link to="/products" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 14 }}>
          Xem tất cả sản phẩm <ArrowRightOutlined />
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 16, scrollbarWidth: 'none' }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '10px 20px',
              borderRadius: 30,
              border: activeTab === t.key ? '2px solid var(--primary)' : '1px solid #e2e8f0',
              background: activeTab === t.key ? 'var(--primary)' : '#ffffff',
              color: activeTab === t.key ? '#ffffff' : '#334155',
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: activeTab === t.key ? '0 4px 14px rgba(10, 36, 99, 0.2)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Row gutter={[20, 20]}>
        {filteredProducts.map((product) => (
          <Col xs={24} sm={12} lg={6} key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </section>
  );
}

// ── Partner Brands Showcase ───────────────────────────────────────────────────
function PartnerBrandsSection() {
  return (
    <div style={{ background: '#ffffff', borderRadius: 24, padding: '32px 24px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(10, 36, 99, 0.04)' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Text type="secondary" style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--accent)' }}>
          ĐỐI TÁC CHIẾN LƯỢC
        </Text>
        <Title level={3} style={{ margin: '4px 0 0', color: 'var(--primary)', fontWeight: 900 }}>
          Thương hiệu hàng đầu uỷ quyền phân phối
        </Title>
      </div>

      <Row gutter={[16, 16]}>
        {partnerBrands.map((brand, idx) => (
          <Col xs={12} sm={6} md={3} key={idx}>
            <Link to={`/products?q=${encodeURIComponent(brand.name)}`}>
              <div
                style={{
                  border: '1.5px solid #f1f5f9',
                  borderRadius: 16,
                  padding: '20px 12px',
                  textAlign: 'center',
                  background: '#f8fafc',
                  transition: 'all 0.2s ease',
                  height: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(10, 36, 99, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#f1f5f9';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  style={{ height: 36, maxWidth: 90, objectFit: 'contain', marginBottom: 8 }}
                />
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{brand.desc}</div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}

// ── Homepage Root ─────────────────────────────────────────────────────────────
export function CustomerHomePage() {
  return (
    <Space direction="vertical" size={48} style={{ width: '100%' }}>
      {/* 1. Hero AutoPlay Slider */}
      <AutoPlayHeroSlider />

      {/* 2. Flash Sale Block */}
      <FlashSaleSection />

      {/* 3. Categorized / Lifestyle Tabs */}
      <CategoryLifestyleTabs />

      {/* 4. Partner Brands Marquee */}
      <PartnerBrandsSection />

      {/* 5. Trust & Benefit Cards */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Text type="secondary" style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--accent)' }}>
            CAM KẾT DỊCH VỤ
          </Text>
          <Title level={2} style={{ margin: '4px 0 0', color: 'var(--primary)', fontWeight: 900 }}>
            Lợi thế cạnh tranh vượt trội tại TechHub
          </Title>
        </div>
        <Row gutter={[20, 20]}>
          {[
            { icon: <ShopOutlined style={{ fontSize: 28, color: '#0A2463' }} />, title: '100% Chính Hãng VAT/CO-CQ', desc: 'Hàng hoá nhập khẩu chính ngạch, xuất đầy đủ hoá đơn điện tử VAT và chứng từ chất lượng cho doanh nghiệp.' },
            { icon: <TruckOutlined style={{ fontSize: 28, color: '#FF6B2B' }} />, title: 'Giao Hoả Tốc 2 Giờ', desc: 'Mạng lưới kho bãi thông minh tại HN, TP.HCM và Đà Nẵng, cam kết giao hàng trong 2-4 tiếng tận nơi.' },
            { icon: <SyncOutlined style={{ fontSize: 28, color: '#16a34a' }} />, title: '1 Đổi 1 Trong 30 Ngày', desc: 'Đổi mới nguyên seal ngay lập tức nếu sản phẩm gặp lỗi phần cứng do nhà sản xuất trong 30 ngày đầu.' },
            { icon: <CreditCardOutlined style={{ fontSize: 28, color: '#8b5cf6' }} />, title: 'Trả Góp 0% & Công Nợ Sỉ', desc: 'Thủ tục xét duyệt online 5 phút qua CCCD. Cấp hạn mức công nợ linh hoạt cho đại lý bán lẻ.' },
          ].map((b, idx) => (
            <Col xs={24} sm={12} lg={6} key={idx}>
              <Card style={{ borderRadius: 18, border: '1.5px solid #e2e8f0', height: '100%' }} styles={{ body: { padding: 22 } }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: '#f1f5f9', display: 'grid', placeItems: 'center', marginBottom: 16 }}>
                  {b.icon}
                </div>
                <Title level={5} style={{ margin: '0 0 8px', fontWeight: 800, color: 'var(--primary)' }}>
                  {b.title}
                </Title>
                <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.6 }}>
                  {b.desc}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </Space>
  );
}

// ── Product Listing Page with Advanced Sidebar Filters ────────────────────────
export function ProductsPage() {
  const { products } = useCommerce();
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get('q') ?? '';
  const selectedCategory = searchParams.get('category') ?? 'Tất cả';
  const sort = searchParams.get('sort') ?? 'featured';

  // Advanced Filters State
  const [priceRange, setPriceRange] = useState<string>('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);

  const allBrands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))), [products]);
  const allFeatures = ['Inverter', 'AI', '4K', '120Hz', 'Titanium', 'Chống ồn'];

  const filtered = useMemo(() => {
    const normalized = keyword.trim().toLocaleLowerCase('vi');

    return products
      .filter((p) => {
        // Category match
        if (selectedCategory !== 'Tất cả' && p.category !== selectedCategory) return false;

        // Keyword match
        if (normalized && !`${p.name} ${p.sku} ${p.brand} ${p.description}`.toLocaleLowerCase('vi').includes(normalized)) {
          return false;
        }

        // Price range filter
        if (priceRange === 'under-10m' && p.retailPrice >= 10000000) return false;
        if (priceRange === '10m-20m' && (p.retailPrice < 10000000 || p.retailPrice > 20000000)) return false;
        if (priceRange === '20m-35m' && (p.retailPrice < 20000000 || p.retailPrice > 35000000)) return false;
        if (priceRange === 'above-35m' && p.retailPrice <= 35000000) return false;

        // Brand match
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand ?? '')) return false;

        // Feature match
        if (
          selectedFeatures.length > 0 &&
          !selectedFeatures.some((f) => p.name.includes(f) || p.features?.some((feat) => feat.includes(f)))
        ) {
          return false;
        }

        // In-stock
        if (onlyInStock && p.availableStock <= 0) return false;

        // Rating
        if (minRating > 0 && (p.rating ?? 5) < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (sort === 'price-asc') return a.retailPrice - b.retailPrice;
        if (sort === 'price-desc') return b.retailPrice - a.retailPrice;
        if (sort === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
        if (sort === 'bestseller') return b.soldCount - a.soldCount;
        return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      });
  }, [keyword, selectedCategory, priceRange, selectedBrands, selectedFeatures, onlyInStock, minRating, sort, products]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'Tất cả' || value === 'featured') next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  const resetAllFilters = () => {
    setPriceRange('all');
    setSelectedBrands([]);
    setSelectedFeatures([]);
    setOnlyInStock(false);
    setMinRating(0);
    updateParam('category', 'Tất cả');
    updateParam('q', '');
  };

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Breadcrumb
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          { title: 'Sản phẩm' },
          ...(selectedCategory !== 'Tất cả' ? [{ title: selectedCategory }] : []),
        ]}
      />

      <PageHeader
        title="Danh mục sản phẩm & Thiết bị"
        description={`Tìm thấy ${filtered.length} sản phẩm chính hãng đáp ứng tiêu chí`}
      />

      <Row gutter={[24, 24]}>
        {/* Left Sidebar Filter */}
        <Col xs={24} lg={6}>
          <Card
            style={{ borderRadius: 18, border: '1.5px solid #e2e8f0', position: 'sticky', top: 90 }}
            styles={{ body: { padding: 20 } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <Space>
                <FilterOutlined style={{ color: 'var(--primary)', fontSize: 16 }} />
                <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary)' }}>BỘ LỌC TÌM KIẾM</span>
              </Space>
              <Button type="link" onClick={resetAllFilters} style={{ padding: 0, fontSize: 12, color: 'var(--accent)' }}>
                Xóa bộ lọc
              </Button>
            </div>

            <Collapse
              defaultActiveKey={['category', 'price', 'brands', 'features']}
              ghost
              items={[
                {
                  key: 'category',
                  label: <strong style={{ color: '#0f172a' }}>Danh mục sản phẩm</strong>,
                  children: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {categories.map((c) => (
                        <div
                          key={c}
                          onClick={() => updateParam('category', c)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: selectedCategory === c ? 700 : 500,
                            color: selectedCategory === c ? 'var(--primary)' : '#475569',
                            background: selectedCategory === c ? '#f1f5f9' : 'transparent',
                          }}
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  key: 'price',
                  label: <strong style={{ color: '#0f172a' }}>Mức giá</strong>,
                  children: (
                    <Radio.Group value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                      <Space direction="vertical" size={6}>
                        <Radio value="all">Tất cả mức giá</Radio>
                        <Radio value="under-10m">Dưới 10 triệu</Radio>
                        <Radio value="10m-20m">Từ 10 - 20 triệu</Radio>
                        <Radio value="20m-35m">Từ 20 - 35 triệu</Radio>
                        <Radio value="above-35m">Trên 35 triệu (Cao cấp)</Radio>
                      </Space>
                    </Radio.Group>
                  ),
                },
                {
                  key: 'brands',
                  label: <strong style={{ color: '#0f172a' }}>Thương hiệu</strong>,
                  children: (
                    <Checkbox.Group
                      value={selectedBrands}
                      onChange={(vals) => setSelectedBrands(vals as string[])}
                      style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
                    >
                      {allBrands.map((b) => (
                        <Checkbox key={b} value={b}>{b}</Checkbox>
                      ))}
                    </Checkbox.Group>
                  ),
                },
                {
                  key: 'features',
                  label: <strong style={{ color: '#0f172a' }}>Tính năng & Công nghệ</strong>,
                  children: (
                    <Checkbox.Group
                      value={selectedFeatures}
                      onChange={(vals) => setSelectedFeatures(vals as string[])}
                      style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
                    >
                      {allFeatures.map((f) => (
                        <Checkbox key={f} value={f}>{f}</Checkbox>
                      ))}
                    </Checkbox.Group>
                  ),
                },
              ]}
            />

            <Divider style={{ margin: '14px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Checkbox checked={onlyInStock} onChange={(e) => setOnlyInStock(e.target.checked)}>
                Chỉ hiện sản phẩm còn hàng
              </Checkbox>
              <div style={{ fontSize: 13, color: '#475569' }}>
                Đánh giá:
                <Radio.Group
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  style={{ display: 'block', marginTop: 6 }}
                >
                  <Space direction="vertical" size={4}>
                    <Radio value={0}>Tất cả sao</Radio>
                    <Radio value={4.5}>4.5★ trở lên</Radio>
                    <Radio value={4.8}>4.8★ trở lên</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Product Grid */}
        <Col xs={24} lg={18}>
          {/* Toolbar */}
          <Card style={{ borderRadius: 16, border: '1.5px solid #e2e8f0', marginBottom: 20 }} styles={{ body: { padding: '12px 18px' } }}>
            <Flex justify="space-between" align="center" wrap gap={12}>
              <div style={{ fontSize: 14, color: '#475569' }}>
                Hiển thị <strong>{filtered.length}</strong> sản phẩm
              </div>
              <Space>
                <span style={{ fontSize: 13, color: '#64748b' }}>Sắp xếp theo:</span>
                <Select
                  value={sort}
                  onChange={(value) => updateParam('sort', value)}
                  style={{ width: 190 }}
                  options={[
                    { value: 'featured', label: '🔥 Nổi bật nhất' },
                    { value: 'bestseller', label: '⭐ Bán chạy nhất' },
                    { value: 'price-asc', label: '💵 Giá thấp đến cao' },
                    { value: 'price-desc', label: '💎 Giá cao đến thấp' },
                    { value: 'rating', label: '🌟 Đánh giá cao nhất' },
                  ]}
                />
              </Space>
            </Flex>
          </Card>

          {/* Product Cards Grid */}
          {filtered.length > 0 ? (
            <Row gutter={[18, 18]}>
              {filtered.map((product) => (
                <Col xs={24} sm={12} xl={8} key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          ) : (
            <Card style={{ borderRadius: 18, textAlign: 'center', padding: '48px 0' }}>
              <Empty
                description="Không tìm thấy sản phẩm nào phù hợp với bộ lọc đã chọn"
              >
                <Button type="primary" onClick={resetAllFilters} style={{ background: 'var(--accent)' }}>
                  Xoá tất cả bộ lọc
                </Button>
              </Empty>
            </Card>
          )}
        </Col>
      </Row>
    </Space>
  );
}

// ── Product Detail Page Component ─────────────────────────────────────────────
export function ProductDetailPage() {
  const { id } = useParams();
  const { products, activeCustomer, addToCart } = useCommerce();
  const { message } = App.useApp();
  const product = products.find((item) => item.id === Number(id));

  const [quantity, setQuantity] = useState(activeCustomer.type === 'WHOLESALE' ? product?.moq ?? 1 : 1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  if (!product) return <Empty description="Không tìm thấy sản phẩm" />;

  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const unitPrice = getUnitPrice(product, quantity, activeCustomer.type);
  const invalidMoq = activeCustomer.type === 'WHOLESALE' && quantity < (product.moq ?? 1);

  const add = (isBuyNow = false) => {
    if (invalidMoq) return message.warning(`Đơn sỉ tối thiểu ${product.moq} ${product.unit.toLowerCase()}.`);
    const result = addToCart(product, quantity);
    if (result.ok) {
      message.success(`Đã thêm ${quantity} ${product.unit.toLowerCase()} vào giỏ hàng`);
      if (isBuyNow) window.location.href = '/cart';
    } else {
      message.warning(result.message);
    }
  };

  const discountPercent = product.oldPrice ? Math.round(((product.oldPrice - product.retailPrice) / product.oldPrice) * 100) : 0;

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Breadcrumb
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          { title: <Link to="/products">Sản phẩm</Link> },
          { title: <Link to={`/products?category=${encodeURIComponent(product.category ?? '')}`}>{product.category}</Link> },
          { title: product.name },
        ]}
      />

      {/* Main Detail Card */}
      <Card style={{ borderRadius: 24, border: '1.5px solid #e2e8f0', boxShadow: '0 10px 30px rgba(10, 36, 99, 0.05)' }} styles={{ body: { padding: 32 } }}>
        <Row gutter={[48, 36]}>
          {/* Left Column: Interactive Image Gallery & Video */}
          <Col xs={24} lg={11}>
            <div style={{ position: 'sticky', top: 90 }}>
              {/* Main Preview Image */}
              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: 20,
                  border: '1px solid #e2e8f0',
                  padding: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 380,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={gallery[activeImageIndex]}
                  alt={product.name}
                  style={{ maxHeight: 320, maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.3s' }}
                />
                {discountPercent > 0 && (
                  <Tag color="error" style={{ position: 'absolute', top: 16, right: 16, fontSize: 13, fontWeight: 800, padding: '4px 10px', borderRadius: 20 }}>
                    🔥 TIẾT KIỆM {discountPercent}%
                  </Tag>
                )}
              </div>

              {/* Thumbnails list + Video Button */}
              <div style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                {gallery.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 12,
                      border: activeImageIndex === idx ? '2px solid var(--accent)' : '1.5px solid #e2e8f0',
                      background: '#ffffff',
                      padding: 4,
                      cursor: 'pointer',
                      display: 'grid',
                      placeItems: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}

                {/* Video Unbox Button */}
                <Button
                  icon={<VideoCameraOutlined style={{ color: '#dc2626' }} />}
                  onClick={() => setIsVideoModalOpen(true)}
                  style={{ height: 72, borderRadius: 12, fontWeight: 700, borderColor: '#e2e8f0' }}
                >
                  Video mở hộp & Review
                </Button>
              </div>
            </div>
          </Col>

          {/* Right Column: Buying Info & CTAs */}
          <Col xs={24} lg={13}>
            <Space direction="vertical" size={18} style={{ width: '100%' }}>
              <Space size={8}>
                <Tag color="blue" style={{ borderRadius: 6, fontWeight: 700 }}>{product.category}</Tag>
                <Tag color="gold" style={{ borderRadius: 6, fontWeight: 700 }}>HÀNG CHÍNH HÃNG</Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>Mã SKU: <strong>{product.sku}</strong></Text>
              </Space>

              <Title level={2} style={{ margin: 0, fontWeight: 900, color: 'var(--primary)', lineHeight: 1.25 }}>
                {product.name}
              </Title>

              {/* Ratings & Sold */}
              <Flex align="center" gap={12} style={{ fontSize: 13.5 }}>
                <Space size={4}>
                  <Rate disabled defaultValue={Math.floor(product.rating ?? 5)} style={{ fontSize: 14, color: '#f59e0b' }} />
                  <strong>{product.rating ?? 4.9}</strong>
                </Space>
                <span>·</span>
                <span style={{ color: '#64748b' }}><strong>{product.reviewCount ?? 88}</strong> đánh giá</span>
                <span>·</span>
                <span style={{ color: '#64748b' }}>Đã bán <strong>{product.soldCount ?? 45}</strong> sản phẩm</span>
              </Flex>

              {/* Price Block */}
              <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 900, fontSize: 32 }}>
                    {formatCurrency(unitPrice)}
                  </span>
                  {product.oldPrice && (
                    <span style={{ color: '#94a3b8', textDecoration: 'line-through', fontSize: 16 }}>
                      {formatCurrency(product.oldPrice)}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <Tag color="error" style={{ borderRadius: 6, fontWeight: 800 }}>
                      Tiết kiệm {formatCurrency(product.oldPrice! - unitPrice)}
                    </Tag>
                  )}
                </div>
                <div style={{ fontSize: 12.5, color: '#16a34a', fontWeight: 600, marginTop: 4 }}>
                  ✓ Đã bao gồm thuế VAT & Miễn phí vận chuyển toàn quốc
                </div>
              </div>

              {/* Wholesale Alert if B2B */}
              {activeCustomer.type === 'WHOLESALE' && (
                <Alert
                  type="info"
                  showIcon
                  message={`Chiết khấu sỉ đại lý · Đơn tối thiểu ${product.moq} ${product.unit.toLowerCase()}`}
                  description={(product.priceTiers ?? [])
                    .map((tier) => `Từ ${tier.minQuantity}${tier.maxQuantity ? `–${tier.maxQuantity}` : '+'}: ${formatCurrency(tier.unitPrice)}`)
                    .join('  ·  ')}
                />
              )}

              {/* Key Features bullet points */}
              {product.features && (
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#334155', marginBottom: 8, textTransform: 'uppercase' }}>
                    Đặc điểm nổi bật:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {product.features.map((feat, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569' }}>
                        <CheckCircleFilled style={{ color: '#16a34a', fontSize: 14 }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Big CTA Buttons */}
              <div style={{ paddingTop: 8 }}>
                <Flex align="center" gap={16} style={{ marginBottom: 16 }}>
                  <span style={{ fontWeight: 700, color: '#334155' }}>Số lượng mua:</span>
                  <Space.Compact>
                    <Button icon={<MinusOutlined />} onClick={() => setQuantity((q) => Math.max(1, q - 1))} />
                    <InputNumber
                      min={1}
                      max={product.availableStock}
                      value={quantity}
                      onChange={(v) => setQuantity(v ?? 1)}
                      controls={false}
                      style={{ width: 60, textAlign: 'center' }}
                    />
                    <Button icon={<PlusOutlined />} onClick={() => setQuantity((q) => q + 1)} />
                  </Space.Compact>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    ({product.availableStock > 0 ? `Còn ${product.availableStock} sản phẩm trong kho` : 'Tạm hết hàng'})
                  </span>
                </Flex>

                <Row gutter={[12, 12]}>
                  <Col xs={24} sm={12}>
                    <Button
                      type="primary"
                      size="large"
                      block
                      disabled={product.availableStock === 0 || invalidMoq}
                      onClick={() => add(true)}
                      style={{
                        background: '#dc2626',
                        borderColor: '#dc2626',
                        height: 52,
                        borderRadius: 14,
                        fontWeight: 900,
                        fontSize: 16,
                        boxShadow: '0 8px 24px rgba(220, 38, 38, 0.35)',
                      }}
                    >
                      MUA NGAY · GIAO 2 GIỜ
                    </Button>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Button
                      type="default"
                      size="large"
                      block
                      icon={<ShoppingCartOutlined style={{ fontSize: 18, color: 'var(--accent)' }} />}
                      disabled={product.availableStock === 0 || invalidMoq}
                      onClick={() => add(false)}
                      style={{
                        height: 52,
                        borderRadius: 14,
                        fontWeight: 800,
                        fontSize: 15,
                        borderColor: 'var(--accent)',
                        color: 'var(--accent)',
                      }}
                    >
                      THÊM VÀO GIỎ HÀNG
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* Policy & Trust Banner Box */}
              <div style={{ background: '#f8fafc', borderRadius: 16, padding: 18, border: '1px solid #e2e8f0', marginTop: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 12 }}>
                  CHÍNH SÁCH BẢO HÀNH & HẬU MÃI VIP TECHHUB
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, fontSize: 13, color: '#334155' }}>
                  <div>🛡️ <strong>Bảo hành {product.warrantyMonths ?? 24} tháng</strong> chính hãng</div>
                  <div>🔄 <strong>1 đổi 1 trong 30 ngày</strong> nếu lỗi NSX</div>
                  <div>🚚 <strong>Miễn phí giao hàng</strong> & Lắp đặt tại nhà</div>
                  <div>💳 <strong>Trả góp 0%</strong> duyệt nhanh qua CCCD</div>
                </div>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Specifications & Technical Details */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card
            title={<Title level={4} style={{ margin: 0, color: 'var(--primary)' }}>📖 Mô tả & Đánh giá chi tiết</Title>}
            style={{ borderRadius: 20, border: '1.5px solid #e2e8f0' }}
          >
            <Paragraph style={{ fontSize: 15, lineHeight: 1.8, color: '#334155' }}>
              {product.description}
            </Paragraph>
            <Paragraph style={{ fontSize: 15, lineHeight: 1.8, color: '#334155' }}>
              Sản phẩm được phân phối chính ngạch bởi <strong>TechHub Việt Nam</strong>, cam kết 100% nguyên seal mới, đầy đủ phụ kiện và phiếu bảo hành chính thức. Khách hàng doanh nghiệp hoặc đại lý có thể yêu cầu xuất hoá đơn VAT ngay khi thanh toán.
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={<Title level={4} style={{ margin: 0, color: 'var(--primary)' }}>⚙️ Thông số kỹ thuật</Title>}
            style={{ borderRadius: 20, border: '1.5px solid #e2e8f0' }}
          >
            {product.specs && product.specs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 8px',
                      background: i % 2 === 0 ? '#f8fafc' : '#ffffff',
                      borderRadius: 6,
                      fontSize: 13.5,
                    }}
                  >
                    <span style={{ color: '#64748b', fontWeight: 600 }}>{spec.label}:</span>
                    <strong style={{ color: '#0f172a', textAlign: 'right', maxWidth: '60%' }}>{spec.value}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <Descriptions
                column={1}
                size="middle"
                bordered
                items={[
                  { key: 'brand', label: 'Thương hiệu', children: product.brand },
                  { key: 'category', label: 'Danh mục', children: product.category },
                  { key: 'unit', label: 'Đơn vị tính', children: product.unit },
                  { key: 'warranty', label: 'Bảo hành', children: `${product.warrantyMonths ?? 24} tháng` },
                ]}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Reviews & Community Q&A */}
      <Card
        title={<Title level={4} style={{ margin: 0, color: 'var(--primary)' }}>⭐ Đánh giá & Bình luận khách hàng ({product.reviewCount ?? 88})</Title>}
        style={{ borderRadius: 20, border: '1.5px solid #e2e8f0' }}
      >
        <Row gutter={[32, 24]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center', background: '#f8fafc', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 44, fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>
                {product.rating ?? 4.9}
              </div>
              <Rate disabled defaultValue={Math.floor(product.rating ?? 5)} style={{ color: '#f59e0b', margin: '8px 0' }} />
              <div style={{ color: '#64748b', fontSize: 13 }}>Dựa trên {product.reviewCount ?? 88} đánh giá xác thực</div>
            </div>
          </Col>

          <Col xs={24} md={16}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(product.reviews ?? [
                { id: 1, userName: 'Nguyễn Tuấn Anh', rating: 5, date: '24/09/2026', comment: 'Sản phẩm giao cực kỳ nhanh, đóng gói cẩn thận 2 lớp. Sử dụng rất mượt mà và hài lòng!', verified: true },
                { id: 2, userName: 'Phạm Minh Đức', rating: 5, date: '20/09/2026', comment: 'Hàng chính hãng chuẩn 100%, quét mã QR bảo hành điện tử thành công.', verified: true },
              ]).map((rev) => (
                <div key={rev.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size={8}>
                      <Avatar icon={<UserOutlined />} style={{ background: 'var(--primary)' }} />
                      <strong style={{ color: '#0f172a' }}>{rev.userName}</strong>
                      {rev.verified && (
                        <Tag color="success" style={{ borderRadius: 10, fontSize: 10 }}>✓ Đã mua hàng tại TechHub</Tag>
                      )}
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>{rev.date}</Text>
                  </div>
                  <div style={{ margin: '6px 0 4px' }}>
                    <Rate disabled defaultValue={rev.rating} style={{ fontSize: 12, color: '#f59e0b' }} />
                  </div>
                  <p style={{ margin: 0, color: '#475569', fontSize: 13.5 }}>{rev.comment}</p>
                </div>
              ))}

              {/* Form gửi câu hỏi */}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Hỏi đáp với kỹ thuật viên TechHub:</div>
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    placeholder="Viết câu hỏi của bạn về sản phẩm này..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                  <Button
                    type="primary"
                    style={{ background: 'var(--accent)' }}
                    onClick={() => {
                      if (!newQuestion.trim()) return;
                      message.success('Câu hỏi của bạn đã được gửi tới chuyên viên kỹ thuật!');
                      setNewQuestion('');
                    }}
                  >
                    Gửi câu hỏi
                  </Button>
                </Space.Compact>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Video Modal */}
      <Modal
        open={isVideoModalOpen}
        onCancel={() => setIsVideoModalOpen(false)}
        footer={null}
        width={720}
        title="🎬 Video mở hộp & Trải nghiệm thực tế"
        centered
      >
        <div style={{ background: '#000', borderRadius: 14, overflow: 'hidden', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff' }}>
          <PlayCircleOutlined style={{ fontSize: 64, color: 'var(--accent)', cursor: 'pointer' }} />
          <div style={{ marginTop: 16, fontSize: 16, fontWeight: 700 }}>{product.name} - Review & Hướng dẫn sử dụng</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>Bản quyền thuộc kênh TechHub Official Channel</div>
        </div>
      </Modal>
    </Space>
  );
}

// ── Cart Line Item ────────────────────────────────────────────────────────────
function CartLineView({ line }: { line: CartLine }) {
  const { activeCustomer, updateCartQuantity, removeFromCart } = useCommerce();
  const price = getUnitPrice(line.product, line.quantity, activeCustomer.type);
  return (
    <List.Item
      actions={[
        <Button key="remove" type="text" danger icon={<DeleteOutlined />} onClick={() => removeFromCart(line.product.id)}>
          Xóa
        </Button>,
      ]}
    >
      <List.Item.Meta
        avatar={
          <img
            src={line.product.image}
            alt={line.product.name}
            style={{ width: 56, height: 56, objectFit: 'contain', background: '#f8fafc', borderRadius: 8, padding: 4 }}
          />
        }
        title={<Link to={`/products/${line.product.id}`}>{line.product.name}</Link>}
        description={
          <Space direction="vertical" size={2}>
            <Text type="secondary">
              {line.product.sku} · {formatCurrency(price)}/{line.product.unit.toLowerCase()}
            </Text>
            {activeCustomer.type === 'WHOLESALE' && line.quantity < (line.product.moq ?? 1) ? (
              <Text type="danger">MOQ tối thiểu: {line.product.moq}</Text>
            ) : null}
          </Space>
        }
      />
      <Flex vertical align="end" gap={8} className="cart-line-price">
        <Text strong style={{ color: 'var(--accent)', fontSize: 16 }}>{formatCurrency(price * line.quantity)}</Text>
        <Space.Compact>
          <Button icon={<MinusOutlined />} onClick={() => updateCartQuantity(line.product.id, line.quantity - 1)} />
          <InputNumber
            controls={false}
            min={1}
            max={line.product.availableStock}
            value={line.quantity}
            onChange={(value) => updateCartQuantity(line.product.id, value ?? 1)}
            style={{ width: 50, textAlign: 'center' }}
          />
          <Button icon={<PlusOutlined />} onClick={() => updateCartQuantity(line.product.id, line.quantity + 1)} />
        </Space.Compact>
      </Flex>
    </List.Item>
  );
}

// ── Cart Page ─────────────────────────────────────────────────────────────────
export function CartPage() {
  const { cart, cartTotal, activeCustomer } = useCommerce();
  const hasInvalidMoq =
    activeCustomer.type === 'WHOLESALE' && cart.some((line) => line.quantity < (line.product.moq ?? 1));

  if (!cart.length)
    return (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Giỏ hàng của bạn đang trống">
        <Link to="/products">
          <Button type="primary" style={{ background: 'var(--accent)' }}>Tiếp tục mua sắm</Button>
        </Link>
      </Empty>
    );

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <PageHeader
        title="Giỏ hàng mua sắm"
        description={`${cart.length} mặt hàng · Giá tính theo cấp bậc tài khoản ${activeCustomer.type}`}
      />
      <Row gutter={[24, 24]} align="top">
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 18 }}>
            <List dataSource={cart} renderItem={(line) => <CartLineView line={line} />} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="order-summary" title="Tóm tắt đơn hàng" style={{ borderRadius: 18 }}>
            <Flex justify="space-between">
              <Text>Tạm tính ({cart.length} món)</Text>
              <Text strong>{formatCurrency(cartTotal)}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Phí vận chuyển</Text>
              <Text type="success" strong>Miễn phí giao hoả tốc</Text>
            </Flex>
            <Divider style={{ margin: '14px 0' }} />
            <Flex justify="space-between" align="center">
              <Title level={4} style={{ margin: 0 }}>Tổng thanh toán</Title>
              <Title level={3} style={{ color: 'var(--accent)', margin: 0 }}>{formatCurrency(cartTotal)}</Title>
            </Flex>
            {hasInvalidMoq ? (
              <Alert type="warning" showIcon message="Một số mặt hàng chưa đạt MOQ sỉ" style={{ margin: '14px 0' }} />
            ) : null}
            <Link to="/checkout">
              <Button
                type="primary"
                size="large"
                block
                disabled={hasInvalidMoq}
                style={{ background: 'var(--accent)', borderColor: 'var(--accent)', height: 48, borderRadius: 12, fontWeight: 800, marginTop: 18 }}
              >
                Tiến hành đặt hàng
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

// ── Checkout Page ─────────────────────────────────────────────────────────────
export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, activeCustomer, createOrder } = useCommerce();
  const { message } = App.useApp();
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK' | 'CREDIT'>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!cart.length) {
    return (
      <Empty description="Không có sản phẩm để thanh toán">
        <Link to="/products"><Button type="primary">Xem sản phẩm</Button></Link>
      </Empty>
    );
  }

  const onFinish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const order = createOrder({
        channel: 'WEBSITE',
        customer: activeCustomer,
        lines: cart,
        paymentMethod,
      });
      setIsSubmitting(false);
      message.success(`Đặt hàng thành công! Mã đơn: ${order.code}`);
      navigate(`/orders`);
    }, 800);
  };

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <PageHeader title="Xác nhận & Thanh toán đơn hàng" description="Điền thông tin nhận hàng và phương thức thanh toán" />
      <Form layout="vertical" onFinish={onFinish} initialValues={{ fullName: activeCustomer.fullName, phone: activeCustomer.phone }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={15}>
            <Card title="Thông tin giao hàng" style={{ borderRadius: 18, marginBottom: 20 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="fullName" label="Họ tên người nhận" rules={[{ required: true }]}>
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="phone" label="Số điện thoại nhận hàng" rules={[{ required: true }]}>
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="address" label="Địa chỉ cụ thể (Số nhà, Tên đường)" rules={[{ required: true }]}>
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="city" label="Tỉnh / Thành phố" rules={[{ required: true }]} initialValue="Hà Nội">
                    <Select size="large" options={[{ value: 'Hà Nội', label: 'Hà Nội' }, { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' }, { value: 'Đà Nẵng', label: 'Đà Nẵng' }]} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="district" label="Quận / Huyện" rules={[{ required: true }]} initialValue="Đống Đa">
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="ward" label="Phường / Xã" rules={[{ required: true }]} initialValue="Thái Hà">
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="note" label="Ghi chú giao hàng">
                    <Input.TextArea rows={2} placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..." />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Phương thức thanh toán" style={{ borderRadius: 18 }}>
              <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                  <Radio value="COD" style={{ padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: 12, width: '100%' }}>
                    💵 <strong>Thanh toán tiền mặt khi nhận hàng (COD)</strong>
                  </Radio>
                  <Radio value="BANK" style={{ padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: 12, width: '100%' }}>
                    🏦 <strong>Chuyển khoản ngân hàng 24/7 (Quét mã VietQR)</strong>
                  </Radio>
                  {activeCustomer.type === 'WHOLESALE' && (
                    <Radio value="CREDIT" style={{ padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: 12, width: '100%' }}>
                      👑 <strong>Thanh toán bằng hạn mức công nợ đại lý</strong>
                    </Radio>
                  )}
                </Space>
              </Radio.Group>
            </Card>
          </Col>

          <Col xs={24} lg={9}>
            <Card title="Đơn hàng của bạn" style={{ borderRadius: 18 }}>
              <List
                dataSource={cart}
                renderItem={(line) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Text style={{ fontSize: 13 }}>{line.product.name}</Text>}
                      description={`Số lượng: ${line.quantity} ${line.product.unit.toLowerCase()}`}
                    />
                    <Text strong>{formatCurrency(getUnitPrice(line.product, line.quantity, activeCustomer.type) * line.quantity)}</Text>
                  </List.Item>
                )}
              />
              <Divider />
              <Flex justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Tạm tính:</Text>
                <Text strong>{formatCurrency(cartTotal)}</Text>
              </Flex>
              <Flex justify="space-between" style={{ marginBottom: 16 }}>
                <Text>Vận chuyển:</Text>
                <Text type="success" strong>Miễn phí</Text>
              </Flex>
              <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>Tổng cộng:</Title>
                <Title level={3} style={{ color: 'var(--accent)', margin: 0 }}>{formatCurrency(cartTotal)}</Title>
              </Flex>
              <Button type="primary" htmlType="submit" size="large" block loading={isSubmitting} style={{ background: 'var(--accent)', height: 50, borderRadius: 12, fontWeight: 800 }}>
                XÁC NHẬN ĐẶT HÀNG
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </Space>
  );
}

// ── Orders History Page ───────────────────────────────────────────────────────
export function OrdersPage() {
  const { orders } = useCommerce();
  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <PageHeader title="Lịch sử đơn hàng" description="Theo dõi tình trạng xử lý và hành trình giao hàng" />
      <Card style={{ borderRadius: 18 }}>
        <List
          dataSource={orders}
          renderItem={(order) => (
            <List.Item key={order.id} style={{ padding: '18px 0' }}>
              <List.Item.Meta
                title={
                  <Space>
                    <Link to={`/orders/${order.id}`}>
                      <strong style={{ color: 'var(--primary)', fontSize: 16 }}>{order.code}</strong>
                    </Link>
                    <StatusTag status={order.status} />
                  </Space>
                }
                description={
                  <Space direction="vertical" size={2} style={{ marginTop: 4 }}>
                    <Text type="secondary">Ngày đặt: {formatDate(order.createdAt)}</Text>
                    <Text type="secondary">{order.items.map((it) => `${it.productName} (x${it.quantity})`).join(', ')}</Text>
                  </Space>
                }
              />
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 17 }}>
                  {formatCurrency(order.totalAmount)}
                </div>
                <Tag color="blue" style={{ marginTop: 4 }}>Kênh Website</Tag>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
}

// ── Order Detail Page ─────────────────────────────────────────────────────────
export function OrderDetailPage() {
  const { id } = useParams();
  const { orders } = useCommerce();
  const order = orders.find((o) => o.id === Number(id) || o.code === id);

  if (!order) return <Empty description="Không tìm thấy thông tin đơn hàng" />;

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Breadcrumb
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          { title: <Link to="/orders">Đơn hàng</Link> },
          { title: order.code },
        ]}
      />
      <PageHeader
        title={`Chi tiết đơn hàng ${order.code}`}
        description={`Đặt ngày ${formatDate(order.createdAt)} · Kênh ${order.channel}`}
      />
      <Card style={{ borderRadius: 18 }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Flex justify="space-between" align="center">
            <span style={{ fontSize: 16, fontWeight: 700 }}>Trạng thái đơn hàng:</span>
            <StatusTag status={order.status} />
          </Flex>
          <Divider style={{ margin: '12px 0' }} />
          <List
            dataSource={order.items}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.productName}
                  description={`Số lượng: ${item.quantity} x ${formatCurrency(item.unitPrice)}`}
                />
                <Text strong style={{ color: 'var(--accent)', fontSize: 16 }}>{formatCurrency(item.subtotal)}</Text>
              </List.Item>
            )}
          />
          <Divider style={{ margin: '12px 0' }} />
          <Flex justify="space-between" align="center">
            <Title level={4} style={{ margin: 0 }}>Tổng giá trị đơn hàng:</Title>
            <Title level={3} style={{ color: 'var(--accent)', margin: 0 }}>{formatCurrency(order.totalAmount)}</Title>
          </Flex>
        </Space>
      </Card>
    </Space>
  );
}

// ── Customer Account Page ─────────────────────────────────────────────────────
export function AccountPage() {
  const { activeCustomer } = useCommerce();
  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <PageHeader title="Thông tin tài khoản" description="Quản lý hồ sơ và chính sách thành viên" />
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="Hồ sơ khách hàng" style={{ borderRadius: 18 }}>
            <Descriptions column={1} bordered size="middle">
              <Descriptions.Item label="Họ và tên">{activeCustomer.fullName}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{activeCustomer.phone || 'Chưa cập nhật'}</Descriptions.Item>
              <Descriptions.Item label="Email">{activeCustomer.email}</Descriptions.Item>
              <Descriptions.Item label="Cấp bậc thành viên">
                <Tag color={activeCustomer.type === 'WHOLESALE' ? 'gold' : 'blue'}>
                  {activeCustomer.type === 'WHOLESALE' ? '👑 ĐẠI LÝ BÁN BUÔN' : 'KHÁCH HÀNG THÀNH VIÊN'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        {activeCustomer.type === 'WHOLESALE' && (
          <Col xs={24} md={12}>
            <Card title="Hạn mức tín dụng & Công nợ" style={{ borderRadius: 18, background: 'linear-gradient(135deg, #0A2463 0%, #1e3a8a 100%)', color: '#fff' }}>
              <div style={{ color: '#fff' }}>
                <div style={{ opacity: 0.8, fontSize: 13 }}>Tổng hạn mức cấp:</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#fbbf24', margin: '4px 0 16px' }}>
                  {formatCurrency(activeCustomer.creditLimit ?? 200000000)}
                </div>
                <div style={{ opacity: 0.8, fontSize: 13 }}>Đã sử dụng: {formatCurrency(activeCustomer.creditUsed ?? 45000000)}</div>
                <Progress percent={Math.round(((activeCustomer.creditUsed ?? 45000000) / (activeCustomer.creditLimit ?? 200000000)) * 100)} strokeColor="#fbbf24" style={{ marginTop: 8 }} />
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </Space>
  );
}
