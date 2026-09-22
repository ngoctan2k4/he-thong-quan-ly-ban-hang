import { Card, Skeleton } from 'antd';

interface LoadingStateProps {
  rows?: number;
}

export function LoadingState({ rows = 4 }: LoadingStateProps) {
  return (
    <Card>
      <Skeleton active paragraph={{ rows }} />
    </Card>
  );
}
