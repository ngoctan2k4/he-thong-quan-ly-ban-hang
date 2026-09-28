import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import type { GoodsReceiptFilters, PurchaseReferenceData } from '../purchasing.model';
import { initialGoodsReceiptFilters } from '../purchasing.model';
import { goodsReceiptStatusConfig } from '../purchasing.utils';

const { RangePicker } = DatePicker;

interface GoodsReceiptFiltersProps {
  filters: GoodsReceiptFilters;
  references?: PurchaseReferenceData;
  loading?: boolean;
  onChange: (filters: GoodsReceiptFilters) => void;
  onReset: () => void;
}

export function GoodsReceiptFiltersPanel({
  filters,
  references,
  loading = false,
  onChange,
  onReset,
}: GoodsReceiptFiltersProps) {
  const [keyword, setKeyword] = useState(filters.keyword);
  const [purchaseOrderCode, setPurchaseOrderCode] = useState(filters.purchaseOrderCode);

  useEffect(() => setKeyword(filters.keyword), [filters.keyword]);
  useEffect(() => setPurchaseOrderCode(filters.purchaseOrderCode), [filters.purchaseOrderCode]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (keyword !== filters.keyword || purchaseOrderCode !== filters.purchaseOrderCode) {
        onChange({ ...filters, keyword, purchaseOrderCode });
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [filters, keyword, onChange, purchaseOrderCode]);

  const hasActiveFilters =
    filters.keyword !== initialGoodsReceiptFilters.keyword
    || filters.purchaseOrderCode !== initialGoodsReceiptFilters.purchaseOrderCode
    || filters.supplierId !== undefined
    || filters.warehouseId !== undefined
    || filters.status !== initialGoodsReceiptFilters.status
    || filters.receivedDateFrom !== undefined
    || filters.receivedDateTo !== undefined;

  return (
    <Row gutter={[12, 12]} align="middle" className="purchasing__filters">
      <Col xs={24} md={12} xl={4}>
        <Input
          allowClear
          value={keyword}
          prefix={<SearchOutlined />}
          placeholder="Mã phiếu nhận"
          aria-label="Tìm theo mã phiếu nhận"
          onChange={(event) => setKeyword(event.target.value)}
        />
      </Col>
      <Col xs={24} md={12} xl={4}>
        <Input
          allowClear
          value={purchaseOrderCode}
          placeholder="Mã PO"
          aria-label="Tìm theo mã PO liên quan"
          onChange={(event) => setPurchaseOrderCode(event.target.value)}
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
          aria-label="Lọc theo trạng thái phiếu nhận"
          style={{ width: '100%' }}
          options={[
            { value: 'ALL', label: 'Tất cả trạng thái' },
            ...Object.entries(goodsReceiptStatusConfig).map(([value, config]) => ({
              value,
              label: config.label,
            })),
          ]}
          onChange={(status) => onChange({
            ...filters,
            status: status as GoodsReceiptFilters['status'],
          })}
        />
      </Col>
      <Col xs={24} md={12} xl={6}>
        <RangePicker
          allowClear
          value={filters.receivedDateFrom && filters.receivedDateTo
            ? [dayjs(filters.receivedDateFrom), dayjs(filters.receivedDateTo)]
            : null}
          placeholder={['Ngày nhận từ', 'Ngày nhận đến']}
          aria-label="Lọc theo khoảng ngày nhận"
          format="DD/MM/YYYY"
          style={{ width: '100%' }}
          onChange={(dates) => onChange({
            ...filters,
            receivedDateFrom: dates?.[0]?.format('YYYY-MM-DD'),
            receivedDateTo: dates?.[1]?.format('YYYY-MM-DD'),
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
