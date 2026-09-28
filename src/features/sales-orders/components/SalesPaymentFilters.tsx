import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import type { SalesPaymentFilters as SalesPaymentFiltersValue } from '../salesOrders.model';
import { initialSalesPaymentFilters } from '../salesOrders.model';
import {
  paymentMethodLabels,
  paymentTransactionStatusLabels,
} from '../salesOrders.utils';

const { RangePicker } = DatePicker;

interface SalesPaymentFiltersProps {
  filters: SalesPaymentFiltersValue;
  loading?: boolean;
  onChange: (filters: SalesPaymentFiltersValue) => void;
  onReset: () => void;
}

export function SalesPaymentFilters({
  filters,
  loading = false,
  onChange,
  onReset,
}: SalesPaymentFiltersProps) {
  const [orderCode, setOrderCode] = useState(filters.orderCode);

  useEffect(() => setOrderCode(filters.orderCode), [filters.orderCode]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (orderCode !== filters.orderCode) onChange({ ...filters, orderCode });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [filters, onChange, orderCode]);

  const hasActiveFilters =
    filters.orderCode !== initialSalesPaymentFilters.orderCode ||
    filters.method !== initialSalesPaymentFilters.method ||
    filters.status !== initialSalesPaymentFilters.status ||
    filters.dateFrom !== undefined ||
    filters.dateTo !== undefined;

  return (
    <Row gutter={[12, 12]} align="middle" className="sales-orders__filters">
      <Col xs={24} md={12} xl={7}>
        <Input
          allowClear
          value={orderCode}
          prefix={<SearchOutlined />}
          placeholder="Tìm theo mã đơn"
          aria-label="Tìm giao dịch theo mã đơn"
          onChange={(event) => setOrderCode(event.target.value)}
        />
      </Col>
      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          value={filters.method}
          aria-label="Lọc theo phương thức thanh toán"
          style={{ width: '100%' }}
          options={[
            { value: 'ALL', label: 'Tất cả phương thức' },
            ...Object.entries(paymentMethodLabels).map(([value, label]) => ({ value, label })),
          ]}
          onChange={(method) =>
            onChange({ ...filters, method: method as SalesPaymentFiltersValue['method'] })
          }
        />
      </Col>
      <Col xs={24} sm={12} md={6} xl={4}>
        <Select
          value={filters.status}
          aria-label="Lọc theo trạng thái giao dịch"
          style={{ width: '100%' }}
          options={[
            { value: 'ALL', label: 'Tất cả trạng thái' },
            ...Object.entries(paymentTransactionStatusLabels).map(([value, label]) => ({ value, label })),
          ]}
          onChange={(status) =>
            onChange({ ...filters, status: status as SalesPaymentFiltersValue['status'] })
          }
        />
      </Col>
      <Col xs={24} md={12} xl={5}>
        <RangePicker
          allowClear
          value={
            filters.dateFrom && filters.dateTo
              ? [dayjs(filters.dateFrom), dayjs(filters.dateTo)]
              : null
          }
          placeholder={['Từ ngày', 'Đến ngày']}
          aria-label="Lọc theo khoảng ngày thanh toán"
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
