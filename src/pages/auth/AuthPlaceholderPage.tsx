import { App, Button, Checkbox, Divider, Form, Input, Radio, Space, Typography, Row, Col } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';

interface AuthPlaceholderPageProps {
  mode: 'login' | 'register';
}

export function AuthPlaceholderPage({ mode }: AuthPlaceholderPageProps) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const { message } = App.useApp();

  const submit = () => {
    message.success(isLogin ? 'Đăng nhập thành công' : 'Tạo tài khoản thành công');
    navigate('/account');
  };

  return (
    <div style={{ padding: '0 10px' }}>
      <Typography.Title level={2} style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>
        {isLogin ? 'Đăng nhập' : 'Tạo tài khoản mới'}
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 32 }}>
        {isLogin ? 'Nhập email và mật khẩu của bạn để truy cập hệ thống TechHub.' : 'Đăng ký ngay để bắt đầu trải nghiệm hệ sinh thái TechHub.'}
      </Typography.Paragraph>

      <Form layout="vertical" onFinish={submit} size="large" requiredMark={false}>
        {!isLogin && (
          <Form.Item name="type" label={<span style={{ fontWeight: 600 }}>Loại tài khoản</span>} initialValue="RETAIL">
            <Radio.Group style={{ width: '100%' }}>
              <Radio.Button value="RETAIL" style={{ width: '50%', textAlign: 'center' }}>Cá nhân</Radio.Button>
              <Radio.Button value="WHOLESALE" style={{ width: '50%', textAlign: 'center' }}>Doanh nghiệp / Đại lý</Radio.Button>
            </Radio.Group>
          </Form.Item>
        )}

        {!isLogin && (
          <Form.Item name="fullName" label={<span style={{ fontWeight: 600 }}>Họ tên / Tên doanh nghiệp</span>} rules={[{ required: true, message: 'Vui lòng nhập họ tên hoặc tên doanh nghiệp' }]}>
            <Input placeholder="Ví dụ: Nguyễn Văn A" />
          </Form.Item>
        )}

        <Form.Item name="email" label={<span style={{ fontWeight: 600 }}>Email</span>} rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
          <Input placeholder="name@example.com" />
        </Form.Item>

        <Form.Item name="password" label={<span style={{ fontWeight: 600 }}>Mật khẩu</span>} rules={[{ required: true, min: 6, message: 'Mật khẩu phải từ 6 ký tự' }]}>
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        {isLogin && (
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Checkbox>Ghi nhớ thiết bị</Checkbox>
              <Typography.Link style={{ fontWeight: 600 }}>Quên mật khẩu?</Typography.Link>
            </Space>
          </Form.Item>
        )}

        <Button type="primary" htmlType="submit" size="large" block style={{ height: 48, fontSize: 16, fontWeight: 700, marginTop: isLogin ? 0 : 16 }}>
          {isLogin ? 'Đăng nhập vào hệ thống' : 'Đăng ký tài khoản'}
        </Button>
      </Form>

      <Divider style={{ margin: '32px 0', color: 'var(--text-secondary)', fontSize: 14 }}>Hoặc tiếp tục với</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Button size="large" block icon={<GoogleOutlined />} style={{ fontWeight: 600 }}>Google</Button>
        </Col>
        <Col span={12}>
          <Button size="large" block icon={<FacebookOutlined style={{ color: '#1877F2' }} />} style={{ fontWeight: 600 }}>Facebook</Button>
        </Col>
      </Row>

      <div style={{ textAlign: 'center', marginTop: 32, fontSize: 15 }}>
        <span style={{ color: 'var(--text-secondary)' }}>
          {isLogin ? 'Chưa có tài khoản đối tác?' : 'Đã có tài khoản trên hệ thống?'}
        </span>
        {' '}
        <Link to={isLogin ? '/register' : '/login'} style={{ fontWeight: 700 }}>
          {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
        </Link>
      </div>
    </div>
  );
}
