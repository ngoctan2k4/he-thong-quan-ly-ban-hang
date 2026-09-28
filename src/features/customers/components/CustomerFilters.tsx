import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import type { AdminCustomerFilters } from '../customers.model';
import { initialAdminCustomerFilters } from '../customers.model';

interface CustomerFiltersProps {
  filters: AdminCustomerFilters;
  loading?: boolean;
  onChange: (filters: AdminCustomerFilters) => void;
  onReset: () => void;
}

export function CustomerFilters({
  filters,
  loading = false,
  onChange,
  onReset,
}: CustomerFiltersProps) {
  const [keyword, setKeyword] = useState(filters.keyword);

  useEffect(() => {
    setKeyword(filters.keyword);
  }, [filters.keyword]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (keyword !== filters.keyword) {
        onChange({ ...filters, keyword });
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [filters, keyword, onChange]);

  const hasActiveFilters =
    filters.keyword !== initialAdminCustomerFilters.keyword
    || filters.customerType !== initialAdminCustomerFilters.customerType
    || filters.subjectType !== initialAdminCustomerFilters.subjectType
    || filters.status !== initialAdminCustomerFilters.status;

  return (
    <Row gutter={[12, 12]} align="middle">
      <Col xs={24} md={12} xl={8}>
        <Input
          allowClear
          value={keyword}
          prefix={<SearchOutlined />}
          placeholder="Tìm mã, tên, điện thoại hoặc email"
          aria-label="Tìm khách hàng theo mã, tên, điện thoại hoặc email"
          onChange={(event) => setKeyword(event.target.value)}
        />
      </Col>
      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          value={filters.customerType}
          aria-label="Lọc theo loại khách hàng"
          style={{ width: '100%' }}
          options={[
            { value: 'ALL', label: 'Tất cả loại khách' },
            { value: 'RETAIL', label: 'Bán lẻ' },
            { value: 'WHOLESALE', label: 'Bán sỉ' },
            { value: 'VIP', label: 'VIP' },
          ]}
          onChange={(customerType) => onChange({ ...filters, customerType })}
        />
      </Col>
      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          value={filters.subjectType}
          aria-label="Lọc theo loại đối tượng"
          style={{ width: '100%' }}
          options={[
            { value: 'ALL', label: 'Tất cả đối tượng' },
            { value: 'INDIVIDUAL', label: 'Cá nhân' },
            { value: 'COMPANY', label: 'Doanh nghiệp' },
          ]}
          onChange={(subjectType) => onChange({ ...filters, subjectType })}
        />
      </Col>
      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          value={filters.status}
          aria-label="Lọc theo trạng thái khách hàng"
          style={{ width: '100%' }}
          options={[
            { value: 'ALL', label: 'Tất cả trạng thái' },
            { value: 'ACTIVE', label: 'Hoạt động' },
            { value: 'INACTIVE', label: 'Ngừng hoạt động' },
          ]}
          onChange={(status) => onChange({ ...filters, status })}
        />
      </Col>
      <Col xs={24} sm={12} md={6} xl={4}>
        <Button
          block
          icon={<ReloadOutlined />}
          disabled={!hasActiveFilters || loading}
          onClick={onReset}
        >
          Đặt lại bộ lọc
        </Button>
      </Col>
    </Row>
  );
}
