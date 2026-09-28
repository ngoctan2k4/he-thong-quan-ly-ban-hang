import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import type { PurchaseOrderFilters, PurchaseReferenceData } from '../purchasing.model';
import { initialPurchaseOrderFilters } from '../purchasing.model';
import { purchaseOrderStatusConfig, purchaseSourceConfig } from '../purchasing.utils';

const { RangePicker } = DatePicker;

interface PurchaseOrderFiltersProps {
  filters: PurchaseOrderFilters;
  references?: PurchaseReferenceData;
  loading?: boolean;
  onChange: (filters: PurchaseOrderFilters) => void;
  onReset: () => void;
}

export function PurchaseOrderFiltersPanel({
  filters,
  references,
  loading = false,
  onChange,
  onReset,
}: PurchaseOrderFiltersProps) {
  const [keyword, setKeyword] = useState(filters.keyword);

  useEffect(() => setKeyword(filters.keyword), [filters.keyword]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (keyword !== filters.keyword) onChange({ ...filters, keyword });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [filters, keyword, onChange]);

  const hasActiveFilters =
    filters.keyword !== initialPurchaseOrderFilters.keyword
    || filters.supplierId !== undefined
    || filters.warehouseId !== undefined
    || filters.status !== initialPurchaseOrderFilters.status
    || filters.sourceType !== initialPurchaseOrderFilters.sourceType
    || filters.orderDateFrom !== undefined
    || filters.orderDateTo !== undefined
    || filters.expectedDate !== undefined;

  return (
    <Row gutter={[12, 12]} align="middle" className="purchasing__filters">
      <Col xs={24} md={12} xl={5}>
        <Input
          allowClear
          value={keyword}
          prefix={<SearchOutlined />}
          placeholder="Tìm mã PO"
          aria-label="Tìm theo mã đơn mua"
          onChange={(event) => setKeyword(event.target.value)}
        />
      </Col>
      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          value={filters.supplierId}
          placeholder="Nhà cung cấp"
          aria-label="Lọc theo nhà cung cấp"
          loading={!references}
          options={references?.suppliers}
          style={{ width: '100%' }}
          onChange={(supplierId) => onChange({ ...filters, supplierId })}
        />
      </Col>
      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          value={filters.warehouseId}
          placeholder="Kho nhận"
          aria-label="Lọc theo kho nhận"
          loading={!references}
          options={references?.warehouses}
          style={{ width: '100%' }}
          onChange={(warehouseId) => onChange({ ...filters, warehouseId })}
        />
      </Col>
      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          value={filters.status}
          aria-label="Lọc theo trạng thái đơn mua"
          style={{ width: '100%' }}
          options={[
            { value: 'ALL', label: 'Tất cả trạng thái' },
            ...Object.entries(purchaseOrderStatusConfig).map(([value, config]) => ({
              value,
              label: config.label,
            })),
          ]}
          onChange={(status) => onChange({
            ...filters,
            status: status as PurchaseOrderFilters['status'],
          })}
        />
      </Col>
      <Col xs={24} sm={12} md={6} xl={3}>
        <Select
          value={filters.sourceType}
          aria-label="Lọc theo nguồn tạo"
          style={{ width: '100%' }}
          options={[
            { value: 'ALL', label: 'Tất cả nguồn' },
            ...Object.entries(purchaseSourceConfig).map(([value, config]) => ({
              value,
              label: config.label,
            })),
          ]}
          onChange={(sourceType) => onChange({
            ...filters,
            sourceType: sourceType as PurchaseOrderFilters['sourceType'],
          })}
        />
      </Col>
      <Col xs={24} md={12} xl={6}>
        <RangePicker
          allowClear
          value={filters.orderDateFrom && filters.orderDateTo
            ? [dayjs(filters.orderDateFrom), dayjs(filters.orderDateTo)]
            : null}
          placeholder={['Ngày đặt từ', 'Ngày đặt đến']}
          aria-label="Lọc theo khoảng ngày đặt"
          format="DD/MM/YYYY"
          style={{ width: '100%' }}
          onChange={(dates) => onChange({
            ...filters,
            orderDateFrom: dates?.[0]?.format('YYYY-MM-DD'),
            orderDateTo: dates?.[1]?.format('YYYY-MM-DD'),
          })}
        />
      </Col>
      <Col xs={24} sm={12} md={6} xl={4}>
        <DatePicker
          allowClear
          value={filters.expectedDate ? dayjs(filters.expectedDate) : null}
          placeholder="Ngày dự kiến nhận"
          aria-label="Lọc theo ngày dự kiến nhận"
          format="DD/MM/YYYY"
          style={{ width: '100%' }}
          onChange={(date) => onChange({
            ...filters,
            expectedDate: date?.format('YYYY-MM-DD'),
          })}
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
