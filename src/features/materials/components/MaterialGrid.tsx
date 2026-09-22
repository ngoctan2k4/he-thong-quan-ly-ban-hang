import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Skeleton, Space, Typography } from 'antd';
import type { AdminMaterialRecord } from '../materials.model';
import { MaterialStatusTag } from './MaterialStatusTag';

interface MaterialGridProps {
  materials: AdminMaterialRecord[];
  loading?: boolean;
  onView: (material: AdminMaterialRecord) => void;
  onEdit: (material: AdminMaterialRecord) => void;
}

export function MaterialGrid({ materials, loading = false, onView, onEdit }: MaterialGridProps) {
  if (loading && materials.length === 0) {
    return (
      <div className="admin-materials__grid">
        {Array.from({ length: 8 }, (_, index) => (
          <Card key={index} size="small">
            <Skeleton active paragraph={{ rows: 3 }} title={{ width: '60%' }} />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="admin-materials__grid">
      {materials.map((material) => (
        <Card key={material.id} size="small" className="admin-materials__grid-card">
          <Flex vertical gap={12}>
            <Flex justify="space-between" align="flex-start" gap={12}>
              <div className="admin-materials__grid-copy">
                <Typography.Text type="secondary" className="admin-materials__code">
                  {material.code}
                </Typography.Text>
                <Typography.Title level={5} ellipsis={{ rows: 2 }}>
                  {material.name}
                </Typography.Title>
              </div>
              <MaterialStatusTag status={material.status} />
            </Flex>

            <dl className="admin-materials__grid-meta">
              <div>
                <dt>Nhóm</dt>
                <dd>{material.group}</dd>
              </div>
              <div>
                <dt>Đơn vị</dt>
                <dd>{material.unit}</dd>
              </div>
              <div>
                <dt>Loại</dt>
                <dd>{material.type}</dd>
              </div>
            </dl>

            <Space size={4} className="admin-materials__grid-actions">
              <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView(material)}>
                Xem
              </Button>
              <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(material)}>
                Sửa
              </Button>
            </Space>
          </Flex>
        </Card>
      ))}
    </div>
  );
}
