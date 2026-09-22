import { Empty } from 'antd';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  description?: ReactNode;
}

export function EmptyState({ description = 'Chưa có dữ liệu' }: EmptyStateProps) {
  return <Empty description={description} />;
}
