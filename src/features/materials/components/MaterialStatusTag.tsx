import { CheckCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import type { MaterialStatus } from '../materials.model';

interface MaterialStatusTagProps {
  status: MaterialStatus;
}

export function MaterialStatusTag({ status }: MaterialStatusTagProps) {
  if (status === 'ACTIVE') {
    return (
      <Tag color="green" icon={<CheckCircleOutlined />}>
        Đang sử dụng
      </Tag>
    );
  }

  return (
    <Tag icon={<PauseCircleOutlined />}>
      Ngừng sử dụng
    </Tag>
  );
}
