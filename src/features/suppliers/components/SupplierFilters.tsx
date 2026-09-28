import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import type { AdminSupplierFilters } from '../suppliers.model';
import { initialAdminSupplierFilters } from '../suppliers.model';

interface SupplierFiltersProps {
  filters: AdminSupplierFilters;
  loading?: boolean;
  onChange: (filters: AdminSupplierFilters) => void;
  onReset: () => void;
}

export function SupplierFilters({ filters, loading = false, onChange, onReset }: SupplierFiltersProps) {
  const [keyword, setKeyword] = useState(filters.keyword);

  useEffect(() => setKeyword(filters.keyword), [filters.keyword]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (keyword !== filters.keyword) {
        onChange({ ...filters, keyword });
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [filters, keyword, onChange]);

  const hasActiveFilters = filters.keyword !== initialAdminSupplierFilters.keyword
    || filters.status !== initialAdminSupplierFilters.status;

  return (
    <Row gutter={[12, 12]} align="middle">
      <Col xs={24} md={14} xl={12}>
        <Input
          allowClear
          value={keyword}
          prefix={<SearchOutlined />}
          placeholder="Tìm mã NCC, tên, MST hoặc điện thoại"
          aria-label="Tìm nhà cung cấp theo mã, tên, mã số thuế hoặc điện thoại"
          onChange={(event) => setKeyword(event.target.value)}
        />
      </Col>
      <Col xs={24} sm={12} md={5} xl={4}>
        <Select
          value={filters.status}
          aria-label="Lọc theo trạng thái nhà cung cấp"
          style={{ width: '100%' }}
          options={[
            { value: 'ALL', label: 'Tất cả trạng thái' },
            { value: 'ACTIVE', label: 'Hoạt động' },
            { value: 'INACTIVE', label: 'Ngừng hoạt động' },
          ]}
          onChange={(status) => onChange({ ...filters, status })}
        />
      </Col>
      <Col xs={24} sm={12} md={5} xl={4}>
        <Button block icon={<ReloadOutlined />} disabled={!hasActiveFilters || loading} onClick={onReset}>
          Đặt lại bộ lọc
        </Button>
      </Col>
    </Row>
  );
}
