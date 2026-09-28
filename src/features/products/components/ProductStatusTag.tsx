import { CheckCircleOutlined, EyeInvisibleOutlined, StopOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import type { ReactNode } from 'react';
import type { AdminProductStatus } from '../adminProducts.model';

const productStatusConfig: Record<
  AdminProductStatus,
  { color: string; icon: ReactNode; label: string }
> = {
  ACTIVE: { color: 'green', icon: <CheckCircleOutlined />, label: 'Đang kinh doanh' },
  DISCONTINUED: { color: 'default', icon: <StopOutlined />, label: 'Ngừng kinh doanh' },
  HIDDEN: { color: 'orange', icon: <EyeInvisibleOutlined />, label: 'Đang ẩn' },
};

interface ProductStatusTagProps {
  status: AdminProductStatus;
}

export function ProductStatusTag({ status }: ProductStatusTagProps) {
  const config = productStatusConfig[status];
  return (
    <Tag color={config.color} icon={config.icon}>
      {config.label}
    </Tag>
  );
}
