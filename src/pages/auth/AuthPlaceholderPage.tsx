import { App, Button, Checkbox, Divider, Form, Input, Radio, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/customer.css';

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
    <>
      <Link to="/" className="auth-brand">SalesHub</Link>
      <Typography.Title level={2}>{isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản'}</Typography.Title>
      <Typography.Paragraph type="secondary">
        {isLogin ? 'Đăng nhập để theo dõi đơn và nhận đúng chính sách giá.' : 'Đăng ký cho cá nhân hoặc doanh nghiệp mua sỉ.'}
      </Typography.Paragraph>
      <Form layout="vertical" onFinish={submit}>
        {!isLogin ? <Form.Item name="type" label="Loại tài khoản" initialValue="RETAIL"><Radio.Group><Radio.Button value="RETAIL">Cá nhân</Radio.Button><Radio.Button value="WHOLESALE">Doanh nghiệp / Mua sỉ</Radio.Button></Radio.Group></Form.Item> : null}
        {!isLogin ? <Form.Item name="fullName" label="Họ tên / Doanh nghiệp" rules={[{ required: true }]}><Input placeholder="Nguyễn Văn A" /></Form.Item> : null}
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="name@example.com" />
        </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6 }]}>
          <Input.Password placeholder="••••••••" />
        </Form.Item>
        {isLogin ? <Form.Item><Space style={{ width: '100%', justifyContent: 'space-between' }}><Checkbox>Ghi nhớ tôi</Checkbox><Typography.Link>Quên mật khẩu?</Typography.Link></Space></Form.Item> : null}
        <Button type="primary" htmlType="submit" size="large" block>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</Button>
      </Form>
      <Divider />
      <Typography.Paragraph style={{ textAlign: 'center' }}>{isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'} {' '}<Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}</Link></Typography.Paragraph>
    </>
  );
}
