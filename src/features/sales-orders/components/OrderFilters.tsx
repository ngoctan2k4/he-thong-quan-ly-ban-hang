import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import type { OrderChannel } from '../../../types/order';
import type {
  SalesOrderFilters,
  SalesOrderReferenceData,
} from '../salesOrders.model';
import { initialSalesOrderFilters } from '../salesOrders.model';
import {
  channelLabels,
  orderPaymentStatusLabels,
  orderStatusLabels,
} from '../salesOrders.utils';

const { RangePicker } = DatePicker;

interface OrderFiltersProps {
  filters: SalesOrderFilters;
  references?: SalesOrderReferenceData;
  fixedChannel?: OrderChannel;
  loading?: boolean;
  onChange: (filters: SalesOrderFilters) => void;
  onReset: () => void;
}

export function OrderFilters({
  filters,
  references,
  fixedChannel,
  loading = false,
  onChange,
  onReset,
}: OrderFiltersProps) {
  const [keyword, setKeyword] = useState(filters.keyword);
  const channelOptions = Object.entries(channelLabels)
    .filter(([value]) => !filters.retailOnly || value !== 'WHOLESALE')
    .map(([value, label]) => ({ value, label }));

  useEffect(() => setKeyword(filters.keyword), [filters.keyword]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (keyword !== filters.keyword) onChange({ ...filters, keyword });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [filters, keyword, onChange]);

  const hasActiveFilters =
    filters.keyword !== initialSalesOrderFilters.keyword ||
    (!fixedChannel && filters.channel !== initialSalesOrderFilters.channel) ||
    filters.status !== initialSalesOrderFilters.status ||
    filters.paymentStatus !== initialSalesOrderFilters.paymentStatus ||
    filters.branchId !== undefined ||
    filters.warehouseId !== undefined ||
    filters.dateFrom !== undefined ||
    filters.dateTo !== undefined;

  return (
    <Row gutter={[12, 12]} align="middle" className="sales-orders__filters">
      <Col xs={24} md={12} xl={fixedChannel ? 8 : 6}>
        <Input
          allowClear
          value={keyword}
          prefix={<SearchOutlined />}
          placeholder="Tìm mã đơn hoặc khách hàng"
          aria-label="Tìm theo mã đơn hoặc khách hàng"
          onChange={(event) => setKeyword(event.target.value)}
        />
      </Col>

      {!fixedChannel ? (
        <Col xs={24} sm={12} md={6} xl={3}>
          <Select
            value={filters.channel}
            aria-label="Lọc theo kênh bán"
            style={{ width: '100%' }}
            options={[
              { value: 'ALL', label: 'Tất cả kênh' },
              ...channelOptions,
            ]}
            onChange={(channel) =>
              onChange({ ...filters, channel: channel as SalesOrderFilters['channel'] })
            }
          />
        </Col>
      ) : null}

      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          value={filters.status}
          aria-label="Lọc theo trạng thái đơn"
          style={{ width: '100%' }}
          options={[
            { value: 'ALL', label: 'Tất cả trạng thái đơn' },
            ...Object.entries(orderStatusLabels).map(([value, label]) => ({ value, label })),
          ]}
          onChange={(status) =>
            onChange({ ...filters, status: status as SalesOrderFilters['status'] })
          }
        />
      </Col>

      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          value={filters.paymentStatus}
          aria-label="Lọc theo trạng thái thanh toán"
          style={{ width: '100%' }}
          options={[
            { value: 'ALL', label: 'Tất cả thanh toán' },
            ...Object.entries(orderPaymentStatusLabels).map(([value, label]) => ({ value, label })),
          ]}
          onChange={(paymentStatus) =>
            onChange({
              ...filters,
              paymentStatus: paymentStatus as SalesOrderFilters['paymentStatus'],
            })
          }
        />
      </Col>

      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          value={filters.branchId}
          placeholder="Tất cả chi nhánh"
          aria-label="Lọc theo chi nhánh"
          loading={!references}
          options={references?.branches}
          style={{ width: '100%' }}
          onChange={(branchId) => onChange({ ...filters, branchId })}
        />
      </Col>

      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          value={filters.warehouseId}
          placeholder="Tất cả kho"
          aria-label="Lọc theo kho"
          loading={!references}
          options={references?.warehouses}
          style={{ width: '100%' }}
          onChange={(warehouseId) => onChange({ ...filters, warehouseId })}
        />
      </Col>

      <Col xs={24} md={12} xl={6}>
        <RangePicker
          allowClear
          value={
            filters.dateFrom && filters.dateTo
              ? [dayjs(filters.dateFrom), dayjs(filters.dateTo)]
              : null
          }
          placeholder={['Từ ngày', 'Đến ngày']}
          aria-label="Lọc theo khoảng ngày đặt hàng"
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
          onChange={(dates) =>
            onChange({
              ...filters,
              dateFrom: dates?.[0]?.format('YYYY-MM-DD'),
              dateTo: dates?.[1]?.format('YYYY-MM-DD'),
            })
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
