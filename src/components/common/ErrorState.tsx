import { Button, Result } from 'antd';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Không thể tải dữ liệu',
  message = 'Đã xảy ra lỗi. Vui lòng thử lại.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Result
      status="error"
      title={title}
      subTitle={message}
      extra={onRetry ? <Button onClick={onRetry}>Thử lại</Button> : undefined}
    />
  );
}
