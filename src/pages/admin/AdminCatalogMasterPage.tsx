import { SearchOutlined } from '@ant-design/icons';
import { Flex, Input, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useMemo, useState } from 'react';
import { AdminListPage } from '../../components/admin/AdminListPage';

type CatalogMasterVariant = 'material-groups' | 'units' | 'unit-conversions';

interface AdminCatalogMasterPageProps {
  variant: CatalogMasterVariant;
}

interface MaterialGroupRow {
  id: string;
  code: string;
  name: string;
  description: string;
  materialCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}

interface UnitRow {
  id: string;
  code: string;
  name: string;
  symbol: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface UnitConversionRow {
  id: string;
  material: string;
  baseUnit: string;
  conversionUnit: string;
  factor: number;
}

const materialGroupRows: MaterialGroupRow[] = [
  { id: '1', code: 'NVL', name: 'Nguyên vật liệu', description: 'Vật tư đầu vào phục vụ sản xuất.', materialCount: 9, status: 'ACTIVE' },
  { id: '2', code: 'TP', name: 'Thành phẩm', description: 'Sản phẩm hoàn thiện sau sản xuất.', materialCount: 11, status: 'ACTIVE' },
  { id: '3', code: 'HH', name: 'Hàng hóa', description: 'Hàng mua vào để phân phối và bán lại.', materialCount: 11, status: 'ACTIVE' },
  { id: '4', code: 'BB', name: 'Bao bì', description: 'Vật tư đóng gói và bảo quản hàng hóa.', materialCount: 10, status: 'ACTIVE' },
  { id: '5', code: 'CCDC', name: 'Công cụ dụng cụ', description: 'Công cụ phục vụ vận hành nội bộ.', materialCount: 9, status: 'ACTIVE' },
];

const unitRows: UnitRow[] = [
  { id: '1', code: 'CAI', name: 'Cái', symbol: 'cái', status: 'ACTIVE' },
  { id: '2', code: 'KG', name: 'Kilogram', symbol: 'kg', status: 'ACTIVE' },
  { id: '3', code: 'THUNG', name: 'Thùng', symbol: 'thùng', status: 'ACTIVE' },
  { id: '4', code: 'HOP', name: 'Hộp', symbol: 'hộp', status: 'ACTIVE' },
  { id: '5', code: 'MET', name: 'Mét', symbol: 'm', status: 'ACTIVE' },
];

const conversionRows: UnitConversionRow[] = [
  { id: '1', material: 'Coca Cola 330ml', baseUnit: 'Lon', conversionUnit: 'Lốc', factor: 6 },
  { id: '2', material: 'Coca Cola 330ml', baseUnit: 'Lon', conversionUnit: 'Thùng', factor: 24 },
  { id: '3', material: 'Dây điện', baseUnit: 'Mét', conversionUnit: 'Cuộn', factor: 100 },
];

const statusColumn = {
  title: 'Trạng thái',
  dataIndex: 'status',
  width: 150,
  render: (status: 'ACTIVE' | 'INACTIVE') => (
    <Tag color={status === 'ACTIVE' ? 'success' : 'default'}>
      {status === 'ACTIVE' ? 'Đang sử dụng' : 'Ngừng sử dụng'}
    </Tag>
  ),
};

const materialGroupColumns: TableProps<MaterialGroupRow>['columns'] = [
  { title: 'Mã nhóm', dataIndex: 'code', width: 150, sorter: (a, b) => a.code.localeCompare(b.code, 'vi') },
  { title: 'Tên nhóm vật tư hàng hóa', dataIndex: 'name', width: 300, sorter: (a, b) => a.name.localeCompare(b.name, 'vi') },
  { title: 'Mô tả', dataIndex: 'description', ellipsis: true },
  { title: 'Số vật tư', dataIndex: 'materialCount', width: 120, align: 'right', sorter: (a, b) => a.materialCount - b.materialCount },
  statusColumn,
];

const unitColumns: TableProps<UnitRow>['columns'] = [
  { title: 'Mã', dataIndex: 'code', width: 150, sorter: (a, b) => a.code.localeCompare(b.code, 'vi') },
  { title: 'Tên đơn vị tính', dataIndex: 'name', width: 320, sorter: (a, b) => a.name.localeCompare(b.name, 'vi') },
  { title: 'Ký hiệu', dataIndex: 'symbol', width: 180 },
  statusColumn,
];

const conversionColumns: TableProps<UnitConversionRow>['columns'] = [
  { title: 'Vật tư hàng hóa', dataIndex: 'material', width: 380, sorter: (a, b) => a.material.localeCompare(b.material, 'vi') },
  { title: 'Đơn vị cơ bản', dataIndex: 'baseUnit', width: 180 },
  { title: 'Đơn vị quy đổi', dataIndex: 'conversionUnit', width: 240 },
  { title: 'Hệ số', dataIndex: 'factor', width: 170, align: 'right', sorter: (a, b) => a.factor - b.factor },
];

const pageConfig = {
  'material-groups': {
    title: 'Nhóm vật tư hàng hóa',
    description: 'Phân loại vật tư dùng chung cho mua hàng, kho và bán hàng.',
    placeholder: 'Tìm mã hoặc tên nhóm…',
  },
  units: {
    title: 'Đơn vị tính',
    description: 'Quản lý các đơn vị đo lường dùng khi khai báo và giao dịch vật tư hàng hóa.',
    placeholder: 'Tìm mã, tên hoặc ký hiệu…',
  },
  'unit-conversions': {
    title: 'Quy đổi đơn vị',
    description: 'Theo dõi hệ số quy đổi giữa đơn vị cơ sở và đơn vị giao dịch của từng vật tư.',
    placeholder: 'Tìm vật tư hoặc đơn vị…',
  },
} satisfies Record<CatalogMasterVariant, { title: string; description: string; placeholder: string }>;

export function AdminCatalogMasterPage({ variant }: AdminCatalogMasterPageProps) {
  const [keyword, setKeyword] = useState('');
  const normalizedKeyword = keyword.trim().toLocaleLowerCase('vi-VN');
  const config = pageConfig[variant];

  const visibleCount = useMemo(() => {
    if (variant === 'material-groups') {
      return materialGroupRows.filter((row) =>
        [row.code, row.name, row.description].some((value) =>
          value.toLocaleLowerCase('vi-VN').includes(normalizedKeyword),
        ),
      ).length;
    }

    if (variant === 'units') {
      return unitRows.filter((row) =>
        [row.code, row.name, row.symbol].some((value) =>
          value.toLocaleLowerCase('vi-VN').includes(normalizedKeyword),
        ),
      ).length;
    }

    return conversionRows.filter((row) =>
      [row.material, row.baseUnit, row.conversionUnit].some((value) =>
        value.toLocaleLowerCase('vi-VN').includes(normalizedKeyword),
      ),
    ).length;
  }, [normalizedKeyword, variant]);

  const table = useMemo(() => {
    if (variant === 'material-groups') {
      const data = materialGroupRows.filter((row) =>
        [row.code, row.name, row.description].some((value) =>
          value.toLocaleLowerCase('vi-VN').includes(normalizedKeyword),
        ),
      );
      return <Table<MaterialGroupRow> rowKey="id" size="small" columns={materialGroupColumns} dataSource={data} scroll={{ x: 940 }} pagination={false} />;
    }

    if (variant === 'units') {
      const data = unitRows.filter((row) =>
        [row.code, row.name, row.symbol].some((value) =>
          value.toLocaleLowerCase('vi-VN').includes(normalizedKeyword),
        ),
      );
      return <Table<UnitRow> rowKey="id" size="small" columns={unitColumns} dataSource={data} scroll={{ x: 800 }} pagination={false} />;
    }

    const data = conversionRows.filter((row) =>
      [row.material, row.baseUnit, row.conversionUnit].some((value) =>
        value.toLocaleLowerCase('vi-VN').includes(normalizedKeyword),
      ),
    );
    return <Table<UnitConversionRow> rowKey="id" size="small" columns={conversionColumns} dataSource={data} scroll={{ x: 970 }} pagination={false} />;
  }, [normalizedKeyword, variant]);

  return (
    <AdminListPage
      title={config.title}
      description={config.description}
      toolbar={
        <Flex justify="space-between" align="center" gap={12} wrap>
          <Input
            allowClear
            value={keyword}
            prefix={<SearchOutlined />}
            placeholder={config.placeholder}
            aria-label={config.placeholder}
            style={{ width: 'min(380px, 100%)' }}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Typography.Text type="secondary">{visibleCount} bản ghi</Typography.Text>
        </Flex>
      }
    >
      {table}
    </AdminListPage>
  );
}
