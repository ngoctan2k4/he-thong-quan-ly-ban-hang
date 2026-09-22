import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import type {
  AdminProductFilters,
  ProductCategoryOption,
} from '../adminProducts.model';
import { initialAdminProductFilters } from '../adminProducts.model';

interface ProductFiltersProps {
  filters: AdminProductFilters;
  categories: ProductCategoryOption[];
  loading?: boolean;
  onChange: (filters: AdminProductFilters) => void;
  onReset: () => void;
}

export function ProductFilters({
  filters,
  categories,
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
    filters.status !== initialAdminProductFilters.status ||
    filters.stock !== initialAdminProductFilters.stock;

  return (
    <Row gutter={[12, 12]} align="middle">
      <Col xs={24} md={12} xl={8}>
        <Input
          allowClear
          value={keyword}
          prefix={<SearchOutlined />}
          placeholder="Tìm theo tên sản phẩm hoặc SKU"
          aria-label="Tìm theo tên sản phẩm hoặc SKU"
          onChange={(event) => setKeyword(event.target.value)}
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
            { value: 'ACTIVE', label: 'Đang bán' },
            { value: 'INACTIVE', label: 'Ngừng bán' },
            { value: 'OUT_OF_STOCK', label: 'Hết hàng' },
          ]}
          onChange={(status) =>
            onChange({ ...filters, status: status as AdminProductFilters['status'] })
          }
        />
      </Col>

      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          value={filters.stock}
          aria-label="Lọc theo tình trạng tồn kho"
          style={{ width: '100%' }}
          options={[
            { value: 'ALL', label: 'Tất cả tồn kho' },
            { value: 'IN_STOCK', label: 'Còn hàng' },
            { value: 'OUT_OF_STOCK', label: 'Hết hàng' },
          ]}
          onChange={(stock) =>
            onChange({ ...filters, stock: stock as AdminProductFilters['stock'] })
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
