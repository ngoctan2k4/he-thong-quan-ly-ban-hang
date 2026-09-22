import { Button, Card, Col, Row, Space } from 'antd';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';

export function CustomerHomePage() {
  return (
    <Space direction="vertical" size={32} style={{ width: '100%' }}>
      <Card className="hero-card">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={14}>
            <PageHeader
              title="Mua sắm dễ dàng – Quản lý đơn hàng thuận tiện"
              description="Khung giao diện 7.1 Website khách hàng. Phần nghiệp vụ chi tiết sẽ được phát triển trên foundation dùng chung."
            />
            <Space style={{ marginTop: 24 }}>
              <Link to="/products"><Button type="primary">Xem sản phẩm</Button></Link>
              <Button>Đăng ký tài khoản</Button>
            </Space>
          </Col>
          <Col xs={24} md={10}>
            <div className="placeholder-visual">Customer Website</div>
          </Col>
        </Row>
      </Card>
    </Space>
  );
}
