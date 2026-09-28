import { Layout, Row, Col, Typography, Space, Button } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { CheckCircleFilled, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export function AuthLayout() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Link to="/" style={{ position: 'absolute', top: 24, right: 32, zIndex: 10 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
          Quay lại trang chủ
        </Button>
      </Link>
      <Row style={{ minHeight: '100vh' }}>
        <Col xs={0} md={11} lg={13} style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'rgba(59,130,246,0.2)', borderRadius: '50%', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, background: 'rgba(16,185,129,0.2)', borderRadius: '50%', filter: 'blur(60px)' }} />

          <Space direction="vertical" size={24} style={{ position: 'relative', zIndex: 1, maxWidth: 500 }}>
            <Link to="/" style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', color: '#fff' }}>TechHub</Link>
            <Title level={1} style={{ color: '#fff', margin: 0, fontSize: 44, lineHeight: 1.15 }}>
              Nền tảng quản lý<br />bán lẻ toàn diện
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, lineHeight: 1.6, margin: 0 }}>
              Quản lý bán hàng đa kênh, tối ưu kho bãi, và tự động hoá quy trình kinh doanh của bạn trên một hệ thống duy nhất.
            </Paragraph>
            <Space direction="vertical" size={18} style={{ marginTop: 24 }}>
              {[
                'Quản lý kho bãi và công nợ đối tác',
                'Tích hợp đa kênh bán hàng online & offline',
                'Hệ thống POS bán hàng trực tiếp tại quầy',
                'Báo cáo doanh thu & lợi nhuận thời gian thực'
              ].map((item, i) => (
                <Space key={i} align="center">
                  <CheckCircleFilled style={{ color: '#10b981', fontSize: 20 }} />
                  <span style={{ fontSize: 16, color: '#f8fafc', fontWeight: 500 }}>{item}</span>
                </Space>
              ))}
            </Space>
          </Space>
        </Col>

        <Col xs={24} md={13} lg={11} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 24px' }}>
          <div style={{ width: '100%', maxWidth: 440 }}>
            <Outlet />
          </div>
        </Col>
      </Row>
    </Layout>
  );
}
