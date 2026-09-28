import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import type {
  AdminProductFilters,
  ProductReferenceOption,
} from '../adminProducts.model';
import { initialAdminProductFilters } from '../adminProducts.model';

interface ProductFiltersProps {
  filters: AdminProductFilters;
  categories: ProductReferenceOption[];
  brands: string[];
  loading?: boolean;
  onChange: (filters: AdminProductFilters) => void;
  onReset: () => void;
}

export function ProductFilters({
  filters,
  categories,
  brands,
  loading = false,
  onChange,
  onReset,
}: ProductFiltersProps) {
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
    filters.keyword !== initialAdminProductFilters.keyword ||
    filters.categoryId !== initialAdminProductFilters.categoryId ||
    filters.brand !== initialAdminProductFilters.brand ||
    filters.status !== initialAdminProductFilters.status;

  return (
    <Row gutter={[12, 12]} align="middle">
      <Col xs={24} md={12} xl={8}>
        <Input
          allowClear
          value={keyword}
          prefix={<SearchOutlined />}
          placeholder="Tìm mã hàng, SKU, barcode hoặc tên"
          aria-label="Tìm mã hàng, SKU, barcode hoặc tên"
          onChange={(event) => setKeyword(event.target.value)}
        />
      </Col>

      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          allowClear
          showSearch
          value={filters.brand}
          placeholder="Tất cả thương hiệu"
          aria-label="Lọc theo thương hiệu"
          options={brands.map((brand) => ({ value: brand, label: brand }))}
          style={{ width: '100%' }}
          onChange={(brand) => onChange({ ...filters, brand })}
        />
      </Col>

      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          allowClear
          showSearch
          value={filters.categoryId}
          optionFilterProp="label"
          placeholder="Tất cả danh mục"
          aria-label="Lọc theo danh mục"
          options={categories}
          style={{ width: '100%' }}
          onChange={(categoryId) => onChange({ ...filters, categoryId })}
        />
      </Col>

      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          value={filters.status}
          aria-label="Lọc theo trạng thái"
          style={{ width: '100%' }}
          options={[
            { value: 'ALL', label: 'Tất cả trạng thái' },
            { value: 'ACTIVE', label: 'Đang kinh doanh' },
            { value: 'DISCONTINUED', label: 'Ngừng kinh doanh' },
            { value: 'HIDDEN', label: 'Đang ẩn' },
          ]}
          onChange={(status) =>
            onChange({ ...filters, status: status as AdminProductFilters['status'] })
          }
        />
      </Col>

      <Col xs={24} sm={12} md={6} xl={4}>
        <Button
          block
          icon={<ReloadOutlined />}
          disabled={!hasActiveFilters || loading}
          onClick={onReset}
        >
          Xóa bộ lọc
        </Button>
      </Col>
    </Row>
  );
}
