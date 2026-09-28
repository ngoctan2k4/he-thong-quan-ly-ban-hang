/* Hallmark · macrostructure: Split authentication · tone: calm operational confidence · anchor hue: navy */
import { ArrowLeftOutlined, CheckCircleFilled, ShopOutlined } from '@ant-design/icons';
import { Button, Col, Layout, Row, Space, Typography } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import '../styles/customer.css';

const { Title, Paragraph, Text } = Typography;

export function AuthLayout() {
  return (
    <Layout className="customer-shell auth-shell">
      <Link className="auth-back-link" to="/"><Button type="text" icon={<ArrowLeftOutlined />}>Về cửa hàng</Button></Link>
      <Row className="auth-layout-row">
        <Col xs={0} md={11} lg={13} className="auth-story-panel">
          <div className="auth-story-panel__content">
            <Link to="/" className="auth-brand"><span><ShopOutlined /></span> SalesHub</Link>
            <Text className="auth-story-panel__eyebrow">Một tài khoản, mọi kênh bán</Text>
            <Title level={1}>Mua hàng rõ giá. Theo dõi rõ trạng thái.</Title>
            <Paragraph>Đăng nhập để dùng đúng chính sách khách lẻ, VIP hoặc đối tác mua sỉ mà không thay đổi luồng mua hàng hiện tại.</Paragraph>
            <Space direction="vertical" size={16} className="auth-benefit-list">
              <span><CheckCircleFilled /> Giá và MOQ theo hồ sơ khách hàng</span>
              <span><CheckCircleFilled /> Giỏ hàng dùng chung trong phiên mua sắm</span>
              <span><CheckCircleFilled /> Theo dõi đơn từ xác nhận đến hoàn tất</span>
            </Space>
          </div>
          <div className="auth-story-panel__foot">Customer Website 7.1 · SalesHub</div>
        </Col>
        <Col xs={24} md={13} lg={11} className="auth-form-panel">
          <div className="auth-form-panel__inner"><Outlet /></div>
        </Col>
      </Row>
    </Layout>
  );
}
