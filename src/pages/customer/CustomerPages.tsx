import {
  ArrowRightOutlined,
  BankOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CreditCardOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  MinusOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import {
  App,
  Alert,
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  List,
  Progress,
  Radio,
  Row,
  Segmented,
  Select,
  Space,
  Steps,
  Tag,
  Typography,
} from 'antd';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusTag } from '../../components/common/StatusTag';
import { useCommerce, type CartLine } from '../../features/commerce/CommerceContext';
import { formatCurrency, formatDate, getUnitPrice } from '../../features/commerce/pricing';
import type { CatalogProduct } from '../../mocks/commerce';
import { categories } from '../../mocks/commerce';

const { Title, Text, Paragraph } = Typography;

function ProductArtwork({ product, large = false }: { product: CatalogProduct; large?: boolean }) {
  return (
    <div className={`product-artwork${large ? ' product-artwork--large' : ''}`} style={{ '--product-color': product.color } as React.CSSProperties}>
      <span>{product.icon}</span>
      <div className="product-artwork__label">{product.brand}</div>
    </div>
  );
}

function ProductPrice({ product, quantity = 1 }: { product: CatalogProduct; quantity?: number }) {
  const { activeCustomer } = useCommerce();
  const price = getUnitPrice(product, quantity, activeCustomer.type);
  return (
    <Space size={8} align="baseline" wrap>
      <Text className="product-price">{formatCurrency(price)}</Text>
      {activeCustomer.type === 'WHOLESALE' && price < product.retailPrice ? <Text delete type="secondary">{formatCurrency(product.retailPrice)}</Text> : null}
      <Text type="secondary">/{product.unit.toLowerCase()}</Text>
    </Space>
  );
}

function ProductCard({ product }: { product: CatalogProduct }) {
  const { message } = App.useApp();
  const { addToCart, activeCustomer } = useCommerce();
  const outOfStock = product.availableStock <= 0;

  const add = () => {
    const quantity = activeCustomer.type === 'WHOLESALE' ? product.moq ?? 1 : 1;
    const result = addToCart(product, quantity);
    if (result.ok) message.success(`Đã thêm ${quantity} ${product.unit.toLowerCase()} vào giỏ`);
    else message.warning(result.message);
  };

  return (
    <Card className="product-card" styles={{ body: { padding: 18 } }}>
      <Link to={`/products/${product.id}`}><ProductArtwork product={product} /></Link>
      <Flex vertical gap={8} className="product-card__body">
        <Flex justify="space-between" align="center">
          <Tag bordered={false}>{product.category}</Tag>
          <Text type={outOfStock ? 'danger' : 'secondary'}>{outOfStock ? 'Hết hàng' : `Còn ${product.availableStock}`}</Text>
        </Flex>
        <Link to={`/products/${product.id}`}><Title level={5} ellipsis={{ rows: 2 }} className="product-card__name">{product.name}</Title></Link>
        <ProductPrice product={product} quantity={activeCustomer.type === 'WHOLESALE' ? product.moq : 1} />
        {activeCustomer.type === 'WHOLESALE' ? <Text type="secondary" className="product-card__moq">MOQ: {product.moq} {product.unit.toLowerCase()}</Text> : null}
        <Button type="primary" icon={<ShoppingCartOutlined />} disabled={outOfStock} onClick={add} block>Thêm vào giỏ</Button>
      </Flex>
    </Card>
  );
}

export function CustomerHomePage() {
  const { products, activeCustomer } = useCommerce();
  const featured = products.filter((product) => product.featured);

  return (
    <Space direction="vertical" size={40} style={{ width: '100%' }}>
      <section className="store-hero">
        <Row gutter={[40, 40]} align="middle">
          <Col xs={24} lg={13}>
            <Tag color="blue" bordered={false}>MUA SẮM ĐA KÊNH · GIAO NHANH</Tag>
            <Title className="store-hero__title">Mọi thứ bạn cần, <span>giá tốt mỗi ngày.</span></Title>
            <Paragraph className="store-hero__copy">Mua lẻ thuận tiện, đặt sỉ minh bạch. Tồn kho được kiểm tra theo thời gian thực trước khi xác nhận đơn.</Paragraph>
            <Space size={12} wrap>
              <Link to="/products"><Button type="primary" size="large">Mua sắm ngay <ArrowRightOutlined /></Button></Link>
              <Link to="/account"><Button size="large">{activeCustomer.type === 'WHOLESALE' ? 'Xem hạn mức công nợ' : 'Khám phá giá sỉ'}</Button></Link>
            </Space>
            <Flex gap={28} wrap className="hero-trust">
              <Space><TruckOutlined /><Text>Giao nhanh 2 giờ</Text></Space>
              <Space><SafetyCertificateOutlined /><Text>Hàng chính hãng</Text></Space>
              <Space><CreditCardOutlined /><Text>Thanh toán linh hoạt</Text></Space>
            </Flex>
          </Col>
          <Col xs={24} lg={11}>
            <div className="hero-collage">
              {featured.slice(0, 3).map((product, index) => (
                <div className={`hero-product hero-product--${index + 1}`} key={product.id} style={{ '--product-color': product.color } as React.CSSProperties}>
                  <span>{product.icon}</span><strong>{product.brand}</strong>
                </div>
              ))}
              <div className="hero-offer"><strong>-15%</strong><span>đơn đầu tiên</span></div>
            </div>
          </Col>
        </Row>
      </section>

      <section>
        <Flex justify="space-between" align="end" gap={16} wrap className="section-heading">
          <div><Text type="secondary">GỢI Ý HÔM NAY</Text><Title level={2}>Sản phẩm nổi bật</Title></div>
          <Link to="/products">Xem tất cả <ArrowRightOutlined /></Link>
        </Flex>
        <Row gutter={[20, 20]}>{featured.map((product) => <Col xs={24} sm={12} lg={6} key={product.id}><ProductCard product={product} /></Col>)}</Row>
      </section>

      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}><Card className="benefit-card"><Space align="start"><div className="benefit-icon"><ShopOutlined /></div><div><Title level={5}>Mua lẻ và mua sỉ</Title><Text type="secondary">Tự động áp dụng đúng bảng giá theo tài khoản.</Text></div></Space></Card></Col>
        <Col xs={24} md={8}><Card className="benefit-card"><Space align="start"><div className="benefit-icon"><TruckOutlined /></div><div><Title level={5}>Tồn kho minh bạch</Title><Text type="secondary">Kiểm tra số lượng khả dụng trước khi đặt hàng.</Text></div></Space></Card></Col>
        <Col xs={24} md={8}><Card className="benefit-card"><Space align="start"><div className="benefit-icon"><SafetyCertificateOutlined /></div><div><Title level={5}>Theo dõi đơn dễ dàng</Title><Text type="secondary">Cập nhật trạng thái đơn từ xác nhận đến giao hàng.</Text></div></Space></Card></Col>
      </Row>
    </Space>
  );
}

export function ProductsPage() {
  const { products } = useCommerce();
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? 'Tất cả';
  const sort = searchParams.get('sort') ?? 'featured';

  const filtered = useMemo(() => {
    const normalized = keyword.trim().toLocaleLowerCase('vi');
    const result = products.filter((product) => (category === 'Tất cả' || product.category === category)
      && (!normalized || `${product.name} ${product.sku} ${product.brand}`.toLocaleLowerCase('vi').includes(normalized)));
    return [...result].sort((a, b) => sort === 'price-asc' ? a.retailPrice - b.retailPrice : sort === 'price-desc' ? b.retailPrice - a.retailPrice : Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [category, keyword, products, sort]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'Tất cả' || value === 'featured') next.delete(key); else next.set(key, value);
    setSearchParams(next);
  };

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Breadcrumb items={[{ title: <Link to="/">Trang chủ</Link> }, { title: 'Sản phẩm' }]} />
      <PageHeader title="Danh sách sản phẩm" description={`${filtered.length} sản phẩm đang phù hợp với lựa chọn của bạn`} />
      <Card className="catalog-toolbar">
        <Flex gap={16} align="center" justify="space-between" wrap>
          <Input.Search value={keyword} onChange={(event) => updateParam('q', event.target.value)} allowClear placeholder="Tìm tên, SKU hoặc thương hiệu" className="catalog-search" />
          <Select value={sort} onChange={(value) => updateParam('sort', value)} style={{ width: 180 }} options={[{ value: 'featured', label: 'Nổi bật' }, { value: 'price-asc', label: 'Giá thấp đến cao' }, { value: 'price-desc', label: 'Giá cao đến thấp' }]} />
        </Flex>
        <Segmented block options={categories} value={category} onChange={(value) => updateParam('category', String(value))} className="category-tabs" />
      </Card>
      {filtered.length ? <Row gutter={[20, 20]}>{filtered.map((product) => <Col xs={24} sm={12} lg={8} xl={6} key={product.id}><ProductCard product={product} /></Col>)}</Row> : <Empty description="Không tìm thấy sản phẩm phù hợp" />}
    </Space>
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const { products, activeCustomer, addToCart } = useCommerce();
  const { message } = App.useApp();
  const product = products.find((item) => item.id === Number(id));
  const [quantity, setQuantity] = useState(activeCustomer.type === 'WHOLESALE' ? product?.moq ?? 1 : 1);

  if (!product) return <Empty description="Không tìm thấy sản phẩm" />;
  const unitPrice = getUnitPrice(product, quantity, activeCustomer.type);
  const invalidMoq = activeCustomer.type === 'WHOLESALE' && quantity < (product.moq ?? 1);
  const add = () => {
    if (invalidMoq) return message.warning(`Đơn sỉ tối thiểu ${product.moq} ${product.unit.toLowerCase()}.`);
    const result = addToCart(product, quantity);
    if (result.ok) message.success('Đã thêm sản phẩm vào giỏ hàng'); else message.warning(result.message);
  };

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Breadcrumb items={[{ title: <Link to="/">Trang chủ</Link> }, { title: <Link to="/products">Sản phẩm</Link> }, { title: product.name }]} />
      <Card className="product-detail-card">
        <Row gutter={[48, 32]}>
          <Col xs={24} md={11}><ProductArtwork product={product} large /></Col>
          <Col xs={24} md={13}>
            <Space direction="vertical" size={18} style={{ width: '100%' }}>
              <Space><Tag color="blue">{product.category}</Tag><Text type="secondary">SKU: {product.sku}</Text></Space>
              <Title level={1} className="product-detail-title">{product.name}</Title>
              <ProductPrice product={product} quantity={quantity} />
              <Paragraph type="secondary" style={{ fontSize: 16 }}>{product.description}</Paragraph>
              <Descriptions column={1} size="small" items={[{ key: 'brand', label: 'Thương hiệu', children: product.brand }, { key: 'unit', label: 'Đơn vị', children: product.unit }, { key: 'stock', label: 'Tồn khả dụng', children: `${product.availableStock} ${product.unit.toLowerCase()}` }, { key: 'barcode', label: 'Barcode', children: product.barcode }]} />
              {activeCustomer.type === 'WHOLESALE' ? (
                <Alert type="info" showIcon message={`Giá sỉ · MOQ ${product.moq} ${product.unit.toLowerCase()}`} description={(product.priceTiers ?? []).map((tier) => `Từ ${tier.minQuantity}${tier.maxQuantity ? `–${tier.maxQuantity}` : '+'}: ${formatCurrency(tier.unitPrice)}`).join('  ·  ')} />
              ) : null}
              <Flex align="center" gap={12} wrap>
                <InputNumber min={1} max={product.availableStock} value={quantity} onChange={(value) => setQuantity(value ?? 1)} addonBefore="Số lượng" size="large" />
                <Button type="primary" size="large" icon={<ShoppingCartOutlined />} disabled={product.availableStock === 0 || invalidMoq} onClick={add}>Thêm vào giỏ · {formatCurrency(unitPrice * quantity)}</Button>
              </Flex>
              {invalidMoq ? <Text type="danger">Số lượng chưa đạt MOQ dành cho khách sỉ.</Text> : null}
            </Space>
          </Col>
        </Row>
      </Card>
    </Space>
  );
}

function CartLineView({ line }: { line: CartLine }) {
  const { activeCustomer, updateCartQuantity, removeFromCart } = useCommerce();
  const price = getUnitPrice(line.product, line.quantity, activeCustomer.type);
  return (
    <List.Item actions={[<Button key="remove" type="text" danger icon={<DeleteOutlined />} onClick={() => removeFromCart(line.product.id)}>Xóa</Button>]}>
      <List.Item.Meta avatar={<div className="cart-thumb" style={{ background: line.product.color }}>{line.product.icon}</div>} title={<Link to={`/products/${line.product.id}`}>{line.product.name}</Link>} description={<Space direction="vertical" size={2}><Text type="secondary">{line.product.sku} · {formatCurrency(price)}/{line.product.unit.toLowerCase()}</Text>{activeCustomer.type === 'WHOLESALE' && line.quantity < (line.product.moq ?? 1) ? <Text type="danger">MOQ: {line.product.moq}</Text> : null}</Space>} />
      <Flex vertical align="end" gap={8} className="cart-line-price">
        <Text strong>{formatCurrency(price * line.quantity)}</Text>
        <Space.Compact><Button icon={<MinusOutlined />} onClick={() => updateCartQuantity(line.product.id, line.quantity - 1)} /><InputNumber controls={false} min={1} max={line.product.availableStock} value={line.quantity} onChange={(value) => updateCartQuantity(line.product.id, value ?? 1)} /><Button icon={<PlusOutlined />} onClick={() => updateCartQuantity(line.product.id, line.quantity + 1)} /></Space.Compact>
      </Flex>
    </List.Item>
  );
}

export function CartPage() {
  const { cart, cartTotal, activeCustomer } = useCommerce();
  const hasInvalidMoq = activeCustomer.type === 'WHOLESALE' && cart.some((line) => line.quantity < (line.product.moq ?? 1));
  if (!cart.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Giỏ hàng của bạn đang trống"><Link to="/products"><Button type="primary">Tiếp tục mua sắm</Button></Link></Empty>;

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <PageHeader title="Giỏ hàng" description={`${cart.length} mặt hàng · giá được tính theo loại tài khoản hiện tại`} />
      <Row gutter={[24, 24]} align="top">
        <Col xs={24} lg={16}><Card><List dataSource={cart} renderItem={(line) => <CartLineView line={line} />} /></Card></Col>
        <Col xs={24} lg={8}>
          <Card className="order-summary" title="Tóm tắt đơn hàng">
            <Flex justify="space-between"><Text>Tạm tính</Text><Text>{formatCurrency(cartTotal)}</Text></Flex>
            <Flex justify="space-between"><Text>Phí giao hàng</Text><Text type="success">Miễn phí</Text></Flex>
            <Divider />
            <Flex justify="space-between" align="center"><Title level={4}>Tổng cộng</Title><Title level={3}>{formatCurrency(cartTotal)}</Title></Flex>
            {hasInvalidMoq ? <Alert type="warning" showIcon message="Một số mặt hàng chưa đạt MOQ" style={{ marginBottom: 16 }} /> : null}
            <Link to="/checkout"><Button type="primary" size="large" block disabled={hasInvalidMoq}>Tiến hành thanh toán</Button></Link>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

export function CheckoutPage() {
  const { cart, cartTotal, activeCustomer, createOrder, clearCart } = useCommerce();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  if (!cart.length) return <Empty description="Không có sản phẩm để thanh toán"><Link to="/products"><Button type="primary">Chọn sản phẩm</Button></Link></Empty>;

  const submit = () => {
    const order = createOrder({ channel: activeCustomer.type === 'WHOLESALE' ? 'WHOLESALE' : 'WEBSITE', customer: activeCustomer, lines: cart });
    clearCart();
    message.success(order.status === 'DRAFT' ? 'Đơn đã được gửi và đang chờ duyệt' : 'Đặt hàng thành công');
    navigate(`/orders/${order.id}?new=1`);
  };

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <PageHeader title="Thanh toán" description="Kiểm tra thông tin trước khi xác nhận đơn hàng" />
      <Row gutter={[24, 24]} align="top">
        <Col xs={24} lg={15}>
          <Form form={form} layout="vertical" onFinish={submit} initialValues={{ fullName: activeCustomer.fullName, phone: activeCustomer.phone, address: '25 Nguyễn Huệ, Phường Sài Gòn, TP. Hồ Chí Minh', payment: activeCustomer.type === 'WHOLESALE' ? 'credit' : 'cod' }}>
            <Card title={<Space><EnvironmentOutlined />Thông tin giao hàng</Space>}>
              <Row gutter={16}><Col xs={24} sm={12}><Form.Item name="fullName" label="Người nhận" rules={[{ required: true, message: 'Nhập người nhận' }]}><Input /></Form.Item></Col><Col xs={24} sm={12}><Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập số điện thoại' }]}><Input /></Form.Item></Col></Row>
              <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Nhập địa chỉ giao hàng' }]}><Input.TextArea rows={3} /></Form.Item>
              <Form.Item name="note" label="Ghi chú"><Input placeholder="Ví dụ: giao giờ hành chính" /></Form.Item>
            </Card>
            <Card title={<Space><CreditCardOutlined />Phương thức thanh toán</Space>} style={{ marginTop: 20 }}>
              <Form.Item name="payment"><Radio.Group className="payment-options"><Radio value="cod">Thanh toán khi nhận hàng</Radio><Radio value="bank">Chuyển khoản ngân hàng</Radio>{activeCustomer.type === 'WHOLESALE' ? <Radio value="credit">Ghi nhận công nợ</Radio> : null}</Radio.Group></Form.Item>
              {activeCustomer.type === 'WHOLESALE' ? <Alert type="info" showIcon message={`Hạn mức còn lại: ${formatCurrency((activeCustomer.creditLimit ?? 0) - (activeCustomer.creditUsed ?? 0))}`} description="Đơn vượt hạn mức hoặc từ 20 triệu đồng sẽ chuyển sang trạng thái chờ phê duyệt." /> : null}
            </Card>
          </Form>
        </Col>
        <Col xs={24} lg={9}>
          <Card className="order-summary" title="Đơn hàng của bạn">
            <List size="small" dataSource={cart} renderItem={(line) => <List.Item extra={<Text strong>{formatCurrency(getUnitPrice(line.product, line.quantity, activeCustomer.type) * line.quantity)}</Text>}><List.Item.Meta title={`${line.product.name} × ${line.quantity}`} /></List.Item>} />
            <Divider />
            <Flex justify="space-between"><Title level={4}>Tổng thanh toán</Title><Title level={3}>{formatCurrency(cartTotal)}</Title></Flex>
            <Button type="primary" size="large" block onClick={() => form.submit()}>Xác nhận đặt hàng</Button>
            <Text type="secondary" className="checkout-policy"><SafetyCertificateOutlined /> Tồn kho và điều kiện bán sẽ được kiểm tra trước khi đơn được xác nhận.</Text>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

export function OrdersPage() {
  const { orders, activeCustomer } = useCommerce();
  const customerOrders = orders.filter((order) => order.customerId === activeCustomer.id);
  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <PageHeader title="Đơn hàng của tôi" description="Theo dõi và xem lại các đơn đã đặt" />
      <Card>
        <List dataSource={customerOrders} locale={{ emptyText: 'Chưa có đơn hàng' }} renderItem={(order) => (
          <List.Item actions={[<Link key="detail" to={`/orders/${order.id}`}><Button>Xem chi tiết</Button></Link>]}>
            <List.Item.Meta avatar={<div className="order-icon"><ShopOutlined /></div>} title={<Space wrap><Text strong>{order.code}</Text><StatusTag status={order.status} /></Space>} description={`${formatDate(order.createdAt)} · ${order.items.length} mặt hàng · ${order.channel}`} />
            <Text strong className="order-list-total">{formatCurrency(order.totalAmount)}</Text>
          </List.Item>
        )} />
      </Card>
    </Space>
  );
}

const statusStep: Record<string, number> = { DRAFT: 0, CONFIRMED: 1, PROCESSING: 2, SHIPPING: 3, COMPLETED: 4 };

export function OrderDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { orders, cancelOrder } = useCommerce();
  const { modal, message } = App.useApp();
  const order = orders.find((item) => item.id === Number(id));
  if (!order) return <Empty description="Không tìm thấy đơn hàng" />;
  const canCancel = ['DRAFT', 'CONFIRMED'].includes(order.status);
  const confirmCancel = () => modal.confirm({ title: 'Hủy đơn hàng?', content: 'Thao tác này không thể hoàn tác.', okText: 'Hủy đơn', okButtonProps: { danger: true }, cancelText: 'Quay lại', onOk: () => { cancelOrder(order.id); message.success('Đã hủy đơn hàng'); } });

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      {searchParams.get('new') ? <Alert type="success" showIcon icon={<CheckCircleFilled />} message={order.status === 'DRAFT' ? 'Đơn hàng đã được gửi để phê duyệt' : 'Đặt hàng thành công'} description={`Mã đơn của bạn là ${order.code}.`} /> : null}
      <PageHeader title={`Đơn hàng ${order.code}`} description={formatDate(order.createdAt)} extra={<Space><StatusTag status={order.status} />{canCancel ? <Button danger onClick={confirmCancel}>Hủy đơn</Button> : null}</Space>} />
      {!['CANCELLED', 'REJECTED'].includes(order.status) ? <Card><Steps current={statusStep[order.status] ?? 0} responsive={false} items={[{ title: 'Đã đặt' }, { title: 'Xác nhận' }, { title: 'Xử lý' }, { title: 'Đang giao' }, { title: 'Hoàn thành' }]} /></Card> : <Alert type="error" showIcon message={order.status === 'CANCELLED' ? 'Đơn hàng đã hủy' : 'Đơn hàng bị từ chối'} />}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}><Card title="Sản phẩm"><List dataSource={order.items} renderItem={(item) => <List.Item extra={<Text strong>{formatCurrency(item.subtotal)}</Text>}><List.Item.Meta title={item.productName} description={`${item.quantity} × ${formatCurrency(item.unitPrice)}`} /></List.Item>} /></Card></Col>
        <Col xs={24} lg={8}>
          <Card title="Thông tin đơn">
            <Descriptions column={1} items={[{ key: 'channel', label: 'Kênh', children: order.channel }, { key: 'payment', label: 'Thanh toán', children: order.channel === 'WHOLESALE' ? 'Công nợ/Chuyển khoản' : 'Thanh toán khi nhận' }, { key: 'address', label: 'Giao đến', children: '25 Nguyễn Huệ, Phường Sài Gòn, TP. Hồ Chí Minh' }]} />
            <Divider />
            <Flex justify="space-between"><Title level={4}>Tổng cộng</Title><Title level={3}>{formatCurrency(order.totalAmount)}</Title></Flex>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

export function AccountPage() {
  const { activeCustomer, customers, setActiveCustomer } = useCommerce();
  const remainingCredit = (activeCustomer.creditLimit ?? 0) - (activeCustomer.creditUsed ?? 0);
  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <PageHeader title="Tài khoản khách hàng" description="Thông tin hồ sơ, loại khách hàng và quyền lợi mua hàng" />
      <Alert type="info" showIcon message="Chế độ trình diễn" description="Chọn hồ sơ bên dưới để kiểm tra giao diện khách lẻ, VIP hoặc khách sỉ." />
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card title="Thông tin hồ sơ">
            <Form layout="vertical">
              <Form.Item label="Hồ sơ đang sử dụng"><Select value={activeCustomer.id} onChange={(id) => setActiveCustomer(customers.find((customer) => customer.id === id) ?? activeCustomer)} options={customers.filter((customer) => customer.id !== 4).map((customer) => ({ value: customer.id, label: `${customer.fullName} · ${customer.type}` }))} /></Form.Item>
              <Row gutter={16}><Col xs={24} sm={12}><Form.Item label="Họ tên / Doanh nghiệp"><Input value={activeCustomer.fullName} readOnly /></Form.Item></Col><Col xs={24} sm={12}><Form.Item label="Loại khách hàng"><Input value={activeCustomer.type} readOnly /></Form.Item></Col></Row>
              <Row gutter={16}><Col xs={24} sm={12}><Form.Item label="Email"><Input value={activeCustomer.email} readOnly /></Form.Item></Col><Col xs={24} sm={12}><Form.Item label="Điện thoại"><Input value={activeCustomer.phone} readOnly /></Form.Item></Col></Row>
              {activeCustomer.type === 'WHOLESALE' ? <Row gutter={16}><Col xs={24} sm={12}><Form.Item label="Mã số thuế"><Input value={activeCustomer.taxCode} readOnly /></Form.Item></Col><Col xs={24} sm={12}><Form.Item label="Công ty"><Input value={activeCustomer.companyName} readOnly /></Form.Item></Col></Row> : null}
              <Button type="primary">Cập nhật thông tin</Button>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={9}>
          {activeCustomer.type === 'WHOLESALE' ? <Card className="credit-card-panel" title={<Space><BankOutlined />Hạn mức công nợ</Space>}><Title level={2}>{formatCurrency(remainingCredit)}</Title><Text type="secondary">Khả dụng trên tổng hạn mức {formatCurrency(activeCustomer.creditLimit ?? 0)}</Text><Progress percent={Math.round(((activeCustomer.creditUsed ?? 0) / (activeCustomer.creditLimit ?? 1)) * 100)} showInfo={false} /><Flex justify="space-between"><Text>Đã sử dụng</Text><Text strong>{formatCurrency(activeCustomer.creditUsed ?? 0)}</Text></Flex><Divider /><Text type="secondary"><ClockCircleOutlined /> Công nợ được kiểm tra khi xác nhận từng đơn sỉ.</Text></Card> : <Card><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Tài khoản mua lẻ"><Paragraph type="secondary">Đăng ký hồ sơ doanh nghiệp để nhận giá sỉ, MOQ và hạn mức công nợ.</Paragraph><Button>Đăng ký mua sỉ</Button></Empty></Card>}
        </Col>
      </Row>
    </Space>
  );
}


