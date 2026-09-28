import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';
import { Checkbox, Flex, Tag, Typography } from 'antd';
import type { Permission } from '../../../types/auth';
import { groupPermissionsByModule } from '../accessControl.model';

interface PermissionGroupsProps {
  permissions: Permission[];
  selectedPermissionIds?: readonly number[];
  selectable?: boolean;
}

export function PermissionGroups({ permissions, selectedPermissionIds = [], selectable = false }: PermissionGroupsProps) {
  const selectedIds = new Set(selectedPermissionIds);
  return (
    <div className="admin-access-control__permission-grid">
      {groupPermissionsByModule(permissions).map((group) => (
        <section className="admin-access-control__permission-module" key={group.module}>
          <Flex align="center" justify="space-between" gap={8} className="admin-access-control__permission-heading">
            <Typography.Text strong>{group.label}</Typography.Text>
            <Tag bordered={false}>{group.module}</Tag>
          </Flex>
          <Flex vertical gap={10}>
            {group.permissions.map((permission) => {
              const selected = selectedIds.has(permission.id);
              return selectable ? (
                <Checkbox key={permission.id} value={permission.id}>
                  <span>{permission.name}</span>
                  <Typography.Text type="secondary" className="admin-access-control__permission-code">{permission.code}</Typography.Text>
                </Checkbox>
              ) : (
                <Flex key={permission.id} align="center" gap={8} className={selected ? undefined : 'admin-access-control__permission-disabled'}>
                  {selected ? <CheckCircleFilled className="admin-access-control__granted" /> : <CloseCircleOutlined />}
                  <span>{permission.name}</span>
                </Flex>
              );
            })}
          </Flex>
        </section>
      ))}
    </div>
  );
}
