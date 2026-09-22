import {
  BarcodeOutlined,
  CheckCircleFilled,
  CreditCardOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
  PrinterOutlined,
  ScanOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  App,
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Radio,
  Result,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  type InputRef,
} from 'antd';
import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusTag } from '../../components/common/StatusTag';
import { useCommerce, type CartLine } from '../../features/commerce/CommerceContext';
import { formatCurrency, formatDate, getUnitPrice } from '../../features/commerce/pricing';
import type { CatalogProduct } from '../../mocks/commerce';

const { Text, Title } = Typography;

export function PosLoginPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const login = () => {
    setLoading(true);
    window.setTimeout(() => {
      sessionStorage.setItem('posStaff', JSON.stringify({ name: 'Lê Hoàng Nam', shift: 'Ca sáng', register: 'Q01' }));
      message.success('Đăng nhập ca bán hàng thành công');
      navigate('/pos/sale');
    }, 350);
  };
  return (
    <div className="pos-shell pos-login-page">
      <Card className="pos-login-card">
        <div className="pos-login-logo"><ShopOutlined /></div>
        <Title level={2}>Đăng nhập POS</Title>
        <Text type="secondary">Quầy Q01 · Chi nhánh Nguyễn Huệ</Text>
        <Form layout="vertical" onFinish={login} initialValues={{ code: 'NV001', password: '123456' }} style={{ marginTop: 28 }}>
          <Form.Item name="code" label="Mã nhân viên" rules={[{ required: true }]}><Input size="large" prefix={<UserOutlined />} /></Form.Item>
          <Form.Item name="password" label="Mật khẩu / PIN" rules={[{ required: true }]}><Input.Password size="large" /></Form.Item>
          <Button htmlType="submit" type="primary" size="large" block loading={loading}>Bắt đầu ca bán hàng</Button>
        </Form>
        <Alert type="info" showIcon message="Tài khoản trình diễn: NV001 / 123456" style={{ marginTop: 20 }} />
        <Link to="/" className="pos-back-link">← Quay lại website khách hàng</Link>
      </Card>
    </div>
  );
}

export function PosOverviewPage() {
  const { orders } = useCommerce();
  const posOrders = orders.filter((order) => order.channel === 'POS');
  const todayRevenue = posOrders.filter((order) => order.status === 'COMPLETED').reduce((sum, order) => sum + order.totalAmount, 0);
  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <PageHeader title="Tổng quan ca bán hàng" description="Quầy Q01 · Ca sáng · Nhân viên Lê Hoàng Nam" extra={<Link to="/pos/sale"><Button type="primary" size="large" icon={<ShoppingCartOutlined />}>Tạo đơn mới</Button></Link>} />
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="Doanh thu ca" value={todayRevenue} formatter={(value) => formatCurrency(Number(value))} prefix={<DollarOutlined />} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="Đơn hoàn tất" value={posOrders.filter((order) => order.status === 'COMPLETED').length} prefix={<CheckCircleFilled />} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="Giá trị trung bình" value={posOrders.length ? todayRevenue / posOrders.length : 0} formatter={(value) => formatCurrency(Number(value))} prefix={<CreditCardOutlined />} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card><Statistic title="Quầy hiện tại" value="Q01" prefix={<ShopOutlined />} /></Card></Col>
      </Row>
      <Card title="Giao dịch gần đây">
        <Table rowKey="id" pagination={false} dataSource={posOrders.slice(0, 8)} columns={[
          { title: 'Mã phiếu', dataIndex: 'code', render: (value, row) => <Link to={`/pos/receipts/${row.id}`}>{value}</Link> },
          { title: 'Thời gian', dataIndex: 'createdAt', responsive: ['md'], render: formatDate },
          { title: 'Trạng thái', dataIndex: 'status', render: (value) => <StatusTag status={value} /> },
          { title: 'Tổng tiền', dataIndex: 'totalAmount', align: 'right', render: formatCurrency },
        ]} />
      </Card>
    </Space>
  );
}

function PosProductButton({ product, onAdd }: { product: CatalogProduct; onAdd: () => void }) {
  return (
    <button className="pos-product" type="button" onClick={onAdd} disabled={product.availableStock <= 0}>
      <span className="pos-product__icon" style={{ background: product.color }}>{product.icon}</span>
      <span className="pos-product__name">{product.name}</span>
      <strong>{formatCurrency(product.retailPrice)}</strong>
      <small>{product.availableStock > 0 ? `Tồn ${product.availableStock}` : 'Hết hàng'}</small>
    </button>
  );
}

export function PosSalePage() {
  const { products, customers, createOrder } = useCommerce();
  const { message, modal } = App.useApp();
  const navigate = useNavigate();
  const barcodeRef = useRef<InputRef>(null);
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customerId, setCustomerId] = useState(4);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [tendered, setTendered] = useState<number>(0);
  const customer = customers.find((item) => item.id === customerId) ?? customers[3];

  const visibleProducts = useMemo(() => {
    const key = query.trim().toLocaleLowerCase('vi');
    if (!key) return products.slice(0, 8);
    return products.filter((product) => `${product.name} ${product.sku} ${product.barcode}`.toLocaleLowerCase('vi').includes(key)).slice(0, 12);
  }, [products, query]);

  const addProduct = (product: CatalogProduct) => {
    if (product.availableStock <= 0) return message.warning('Sản phẩm đã hết hàng');
    setCart((lines) => {
      const existing = lines.find((line) => line.product.id === product.id);
      if (existing && existing.quantity >= product.availableStock) { message.warning(`Tồn khả dụng chỉ còn ${product.availableStock}`); return lines; }
      return existing ? lines.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...lines, { product, quantity: 1 }];
    });
    setQuery('');
    window.setTimeout(() => barcodeRef.current?.focus(), 0);
  };

  const scan = (value: string) => {
    const exact = products.find((product) => product.barcode === value.trim() || product.sku.toLocaleLowerCase() === value.trim().toLocaleLowerCase());
    if (exact) addProduct(exact);
    else if (value.trim()) message.warning('Không tìm thấy barcode/SKU này');
  };

  const updateQuantity = (productId: number, quantity: number) => setCart((lines) => lines.map((line) => line.product.id === productId ? { ...line, quantity: Math.max(1, Math.min(quantity, line.product.availableStock)) } : line));
  const remove = (productId: number) => setCart((lines) => lines.filter((line) => line.product.id !== productId));
  const total = cart.reduce((sum, line) => sum + getUnitPrice(line.product, line.quantity, customer.type) * line.quantity, 0);
  const invalidMoq = customer.type === 'WHOLESALE' && cart.some((line) => line.quantity < (line.product.moq ?? 1));

  const chooseCustomer = (id: number) => {
    if (cart.length) modal.confirm({ title: 'Đổi khách hàng?', content: 'Giá bán sẽ được tính lại theo loại khách hàng được chọn.', onOk: () => setCustomerId(id) });
    else setCustomerId(id);
  };

  const checkout = () => {
    if (!cart.length) return;
    const order = createOrder({ channel: 'POS', customer, lines: cart, paymentMethod });
    setPaymentOpen(false);
    setCart([]);
    navigate(`/pos/receipts/${order.id}?new=1`);
  };

  return (
    <div className="pos-sale-grid">
      <section className="pos-catalog-pane">
        <Flex justify="space-between" align="center" gap={16} wrap>
          <div><Title level={3} style={{ margin: 0 }}>Bán hàng tại quầy</Title><Text type="secondary">Quét barcode hoặc chọn nhanh sản phẩm</Text></div>
          <Tag color="green">Inventory Core đang kết nối</Tag>
        </Flex>
        <Input.Search ref={barcodeRef} autoFocus size="large" value={query} onChange={(event) => setQuery(event.target.value)} onSearch={scan} prefix={<BarcodeOutlined />} placeholder="Quét barcode, nhập SKU hoặc tên sản phẩm..." enterButton={<ScanOutlined />} className="pos-barcode-input" />
        <div className="pos-product-grid">{visibleProducts.map((product) => <PosProductButton key={product.id} product={product} onAdd={() => addProduct(product)} />)}</div>
        {!visibleProducts.length ? <Empty description="Không tìm thấy sản phẩm" /> : null}
      </section>

      <aside className="pos-cart-pane">
        <Flex justify="space-between" align="center"><Title level={4}><ShoppingCartOutlined /> Đơn hiện tại</Title><Tag>{cart.reduce((sum, line) => sum + line.quantity, 0)} sản phẩm</Tag></Flex>
        <Select value={customerId} onChange={chooseCustomer} showSearch optionFilterProp="label" prefix={<TeamOutlined />} options={customers.map((item) => ({ value: item.id, label: `${item.fullName} · ${item.type}` }))} style={{ width: '100%' }} />
        {customer.type === 'WHOLESALE' ? <Alert type="info" showIcon message="Đang áp dụng giá sỉ và MOQ" /> : null}
        <div className="pos-cart-lines">
          {cart.length ? cart.map((line) => {
            const price = getUnitPrice(line.product, line.quantity, customer.type);
            return <div className="pos-cart-line" key={line.product.id}>
              <Flex justify="space-between" gap={8}><Text strong>{line.product.name}</Text><Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => remove(line.product.id)} /></Flex>
              <Flex justify="space-between" align="center"><Space.Compact size="small"><Button icon={<MinusOutlined />} onClick={() => updateQuantity(line.product.id, line.quantity - 1)} /><InputNumber controls={false} value={line.quantity} onChange={(value) => updateQuantity(line.product.id, value ?? 1)} /><Button icon={<PlusOutlined />} onClick={() => updateQuantity(line.product.id, line.quantity + 1)} /></Space.Compact><Text strong>{formatCurrency(price * line.quantity)}</Text></Flex>
              <Text type="secondary" className="pos-unit-price">{formatCurrency(price)}/{line.product.unit.toLowerCase()} · tồn {line.product.availableStock}</Text>
              {customer.type === 'WHOLESALE' && line.quantity < (line.product.moq ?? 1) ? <Text type="danger">MOQ {line.product.moq} {line.product.unit.toLowerCase()}</Text> : null}
            </div>;
          }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Quét sản phẩm để bắt đầu" />}
        </div>
        <div className="pos-cart-footer">
          <Flex justify="space-between"><Text>Tạm tính</Text><Text>{formatCurrency(total)}</Text></Flex>
          <Flex justify="space-between"><Text>Chiết khấu</Text><Text>0 ₫</Text></Flex>
          <Divider />
          <Flex justify="space-between" align="center"><Title level={4}>Tổng cộng</Title><Title level={2}>{formatCurrency(total)}</Title></Flex>
          <Flex gap={8}><Button icon={<EditOutlined />} disabled={!cart.length} onClick={() => message.info('Điều chỉnh giá cần quyền Quản lý ca')}>Điều chỉnh</Button><Button type="primary" size="large" block disabled={!cart.length || invalidMoq} onClick={() => { setTendered(total); setPaymentOpen(true); }}>Thanh toán</Button></Flex>
        </div>
      </aside>

      <Modal rootClassName="pos-payment-modal" title="Thanh toán đơn hàng" open={paymentOpen} onCancel={() => setPaymentOpen(false)} okText="Hoàn tất thanh toán" cancelText="Quay lại" onOk={checkout} okButtonProps={{ disabled: paymentMethod === 'cash' && tendered < total }}>
        <div className="payment-total"><Text type="secondary">Khách cần trả</Text><Title level={1}>{formatCurrency(total)}</Title></div>
        <Radio.Group value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="pos-payment-methods"><Radio.Button value="cash">Tiền mặt</Radio.Button><Radio.Button value="card">Thẻ</Radio.Button><Radio.Button value="transfer">Chuyển khoản</Radio.Button></Radio.Group>
        {paymentMethod === 'cash' ? <Space direction="vertical" style={{ width: '100%', marginTop: 20 }}><Text>Khách đưa</Text><InputNumber size="large" min={0} value={tendered} onChange={(value) => setTendered(value ?? 0)} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} style={{ width: '100%' }} /><Flex justify="space-between"><Text>Tiền thừa</Text><Text strong type="success">{formatCurrency(Math.max(0, tendered - total))}</Text></Flex></Space> : <Alert type="info" showIcon message={paymentMethod === 'card' ? 'Sẵn sàng nhận thanh toán qua máy POS' : 'Quét mã QR tại quầy để chuyển khoản'} style={{ marginTop: 20 }} />}
      </Modal>
    </div>
  );
}

export function PosReceiptPage() {
  const { id } = useParams();
  const { orders, customers, cancelOrder } = useCommerce();
  const navigate = useNavigate();
  const { modal, message } = App.useApp();
  const order = orders.find((item) => item.id === Number(id));
  if (!order) return <Result status="404" title="Không tìm thấy phiếu bán" extra={<Link to="/pos"><Button>Về tổng quan</Button></Link>} />;
  const customer = customers.find((item) => item.id === order.customerId);
  const cancel = () => modal.confirm({ title: 'Yêu cầu quyền quản lý', content: <Input.Password placeholder="Nhập PIN quản lý để hủy phiếu" />, okText: 'Xác nhận hủy', okButtonProps: { danger: true }, onOk: () => { cancelOrder(order.id); message.success('Đã hủy phiếu bán'); } });

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <div className="no-print"><PageHeader title="Phiếu bán hàng" description="Giao dịch đã được ghi nhận trong Order Core" extra={<Space><Button danger onClick={cancel} disabled={order.status === 'CANCELLED'}>Hủy phiếu</Button><Button icon={<PrinterOutlined />} onClick={() => window.print()}>In phiếu</Button><Button type="primary" onClick={() => navigate('/pos/sale')}>Đơn mới</Button></Space>} /></div>
      <Card className="receipt-card">
        <div className="receipt-head"><div className="receipt-logo"><ShopOutlined /></div><Title level={3}>SALESHUB MART</Title><Text>25 Nguyễn Huệ, TP. Hồ Chí Minh</Text><Text>Hotline: 1900 6868</Text></div>
        <Divider dashed />
        <Flex justify="space-between"><Text>Mã phiếu</Text><Text strong>{order.code}</Text></Flex>
        <Flex justify="space-between"><Text>Thời gian</Text><Text>{formatDate(order.createdAt)}</Text></Flex>
        <Flex justify="space-between"><Text>Thu ngân</Text><Text>Lê Hoàng Nam</Text></Flex>
        <Flex justify="space-between"><Text>Khách hàng</Text><Text>{customer?.fullName ?? 'Khách lẻ'}</Text></Flex>
        <Divider dashed />
        <List dataSource={order.items} renderItem={(item) => <List.Item><div style={{ width: '100%' }}><Text strong>{item.productName}</Text><Flex justify="space-between"><Text type="secondary">{item.quantity} × {formatCurrency(item.unitPrice)}</Text><Text>{formatCurrency(item.subtotal)}</Text></Flex></div></List.Item>} />
        <Divider dashed />
        <Flex justify="space-between"><Title level={4}>TỔNG CỘNG</Title><Title level={3}>{formatCurrency(order.totalAmount)}</Title></Flex>
        <Flex justify="space-between"><Text>Thanh toán</Text><Text>Tiền mặt / Thẻ</Text></Flex>
        <Divider dashed />
        <div className="receipt-thanks"><CheckCircleFilled /><Text strong>Cảm ơn quý khách!</Text><Text type="secondary">Hẹn gặp lại tại SalesHub Mart</Text><div className="receipt-barcode">||||| || ||||| | |||| |||||</div></div>
      </Card>
    </Space>
  );
}

