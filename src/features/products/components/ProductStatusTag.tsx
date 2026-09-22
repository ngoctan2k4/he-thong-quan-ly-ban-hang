import { CheckCircleOutlined, PauseCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import type { ReactNode } from 'react';
import type { ProductStatus } from '../../../types/product';

const productStatusConfig: Record<
  ProductStatus,
  { color: string; icon: ReactNode; label: string }
> = {
  ACTIVE: { color: 'green', icon: <CheckCircleOutlined />, label: 'Đang bán' },
  INACTIVE: { color: 'default', icon: <PauseCircleOutlined />, label: 'Ngừng bán' },
  OUT_OF_STOCK: { color: 'red', icon: <StopOutlined />, label: 'Hết hàng' },
};

interface ProductStatusTagProps {
  status: ProductStatus;
}

export function ProductStatusTag({ status }: ProductStatusTagProps) {
  const config = productStatusConfig[status];
  return (
    <Tag color={config.color} icon={config.icon}>
      {config.label}
    </Tag>
  );
}
