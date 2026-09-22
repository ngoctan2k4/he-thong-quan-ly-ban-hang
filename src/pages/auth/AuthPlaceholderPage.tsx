import { Button, Form, Input, Typography } from 'antd';

interface AuthPlaceholderPageProps {
  mode: 'login' | 'register';
}

export function AuthPlaceholderPage({ mode }: AuthPlaceholderPageProps) {
  const isLogin = mode === 'login';
  return (
    <>
      <Typography.Title level={2}>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</Typography.Title>
      <Typography.Paragraph type="secondary">
        Placeholder xác thực dùng chung. Form nghiệp vụ chi tiết sẽ được triển khai ở 7.1.
      </Typography.Paragraph>
      <Form layout="vertical">
        <Form.Item label="Email">
          <Input placeholder="name@example.com" />
        </Form.Item>
        <Form.Item label="Mật khẩu">
          <Input.Password placeholder="••••••••" />
        </Form.Item>
        <Button type="primary" block>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</Button>
      </Form>
    </>
  );
}
