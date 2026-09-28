import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons';
import { App, Button, Checkbox, Col, Divider, Form, Input, Radio, Row, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

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
    <div className="auth-form-card">
      <div className="auth-form-heading">
        <Typography.Text className="auth-form-kicker">{isLogin ? 'Chào mừng trở lại' : 'Bắt đầu với SalesHub'}</Typography.Text>
        <Typography.Title level={2}>{isLogin ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới'}</Typography.Title>
        <Typography.Paragraph type="secondary">
          {isLogin ? 'Theo dõi đơn và nhận đúng chính sách giá theo hồ sơ của bạn.' : 'Đăng ký cho cá nhân hoặc doanh nghiệp mua sỉ.'}
        </Typography.Paragraph>
      </div>
      <Form layout="vertical" size="large" requiredMark={false} onFinish={submit}>
        {!isLogin ? <Form.Item name="type" label="Loại tài khoản" initialValue="RETAIL"><Radio.Group className="auth-account-type"><Radio.Button value="RETAIL">Cá nhân</Radio.Button><Radio.Button value="WHOLESALE">Doanh nghiệp / Mua sỉ</Radio.Button></Radio.Group></Form.Item> : null}
        {!isLogin ? <Form.Item name="fullName" label="Họ tên / Doanh nghiệp" rules={[{ required: true, message: 'Vui lòng nhập họ tên hoặc doanh nghiệp' }]}><Input placeholder="Ví dụ: Nguyễn Văn A" /></Form.Item> : null}
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
          <Input placeholder="name@example.com" autoComplete="email" />
        </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6, message: 'Mật khẩu cần ít nhất 6 ký tự' }]}>
          <Input.Password placeholder="••••••••" autoComplete={isLogin ? 'current-password' : 'new-password'} />
        </Form.Item>
        {isLogin ? <Form.Item><Space className="auth-form-options"><Checkbox>Ghi nhớ tôi</Checkbox><Typography.Link>Quên mật khẩu?</Typography.Link></Space></Form.Item> : null}
        <Button className="auth-submit" type="primary" htmlType="submit" size="large" block>{isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}</Button>
      </Form>
      <Divider plain>Hoặc tiếp tục với</Divider>
      <Row gutter={12}>
        <Col span={12}><Button block size="large" icon={<GoogleOutlined />} disabled>Google</Button></Col>
        <Col span={12}><Button block size="large" icon={<FacebookOutlined />} disabled>Facebook</Button></Col>
      </Row>
      <Typography.Paragraph className="auth-oauth-note" type="secondary">Đăng nhập mạng xã hội chưa được kết nối trong bản hiện tại.</Typography.Paragraph>
      <Divider />
      <Typography.Paragraph className="auth-switch">{isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'} {' '}<Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}</Link></Typography.Paragraph>
    </div>
  );
}
