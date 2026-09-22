import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Table, Tooltip, Typography } from 'antd';
import type { TableProps } from 'antd';
import type { Key } from 'react';
import { EmptyState } from '../../../components/common/EmptyState';
import type { AdminMaterialRecord } from '../materials.model';

interface MaterialTableProps {
  materials: AdminMaterialRecord[];
  selectedRowKeys: Key[];
  loading?: boolean;
  onSelectionChange: (keys: Key[]) => void;
  onCreate: () => void;
  onView: (material: AdminMaterialRecord) => void;
}

export function MaterialTable({
  materials,
  selectedRowKeys,
  loading = false,
  onSelectionChange,
  onCreate,
  onView,
}: MaterialTableProps) {
  const columns: TableProps<AdminMaterialRecord>['columns'] = [
    {
      title: 'Mã',
      dataIndex: 'code',
      width: 168,
      sorter: (a, b) => a.code.localeCompare(b.code, 'vi'),
      render: (code: string) => (
        <Typography.Text strong className="admin-materials__code">
          {code}
        </Typography.Text>
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name, 'vi'),
      render: (name: string, material) => (
        <Tooltip title={name} placement="topLeft" mouseEnterDelay={0.8}>
          <Typography.Link
            className="admin-materials__name"
            onClick={(event) => {
              event.stopPropagation();
              onView(material);
            }}
          >
            {name}
          </Typography.Link>
        </Tooltip>
      ),
    },
    {
      title: 'Nhóm vật tư hàng hóa',
      dataIndex: 'group',
      width: 240,
      ellipsis: true,
    },
  ];

  return (
    <Table<AdminMaterialRecord>
      rowKey="id"
      size="small"
      columns={columns}
      dataSource={materials}
      loading={loading}
      scroll={{ x: 760 }}
      tableLayout="fixed"
      pagination={false}
      onRow={(material) => ({
        className: 'admin-materials__clickable-row',
        tabIndex: 0,
        title: 'Xem chi tiết vật tư hàng hóa',
        onClick: (event) => {
          const target = event.target as HTMLElement;
          if (target.closest('input, button, a, .ant-checkbox-wrapper')) {
            return;
          }
          onView(material);
        },
        onKeyDown: (event) => {
          if (event.key === 'Enter' && event.target === event.currentTarget) {
            onView(material);
          }
        },
      })}
      rowSelection={{
        columnWidth: 44,
        selectedRowKeys,
        preserveSelectedRowKeys: true,
        onChange: (keys) => onSelectionChange(keys),
      }}
      locale={{
        emptyText: (
          <Flex vertical align="center" gap={12} className="admin-materials__empty">
            <EmptyState description="Không có vật tư phù hợp với điều kiện tìm kiếm." />
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
              Tạo vật tư đầu tiên
            </Button>
          </Flex>
        ),
      }}
    />
  );
}
