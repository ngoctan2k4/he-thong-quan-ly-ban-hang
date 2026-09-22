import { Card, Col, Row, Statistic } from 'antd';
import type { DebtTotals, PaymentSide } from '../payments.model';
import { formatCurrency } from '../payment.utils';

interface DebtSummaryProps {
  side: PaymentSide;
  totals: DebtTotals;
  loading?: boolean;
}

export function DebtSummary({ side, totals, loading }: DebtSummaryProps) {
  const labels = side === 'CUSTOMER'
    ? ['Tổng phải thu', 'Đã thu', 'Còn nợ', 'Quá hạn']
    : ['Tổng phải trả', 'Đã trả', 'Còn nợ', 'Quá hạn'];
  const values = [
    totals.totalAmount,
    totals.paidAmount,
    totals.remainingAmount,
    totals.overdueAmount,
  ];

  return (
    <Row gutter={[8, 8]} className="payment-summary">
      {labels.map((label, index) => (
        <Col xs={12} lg={6} key={label}>
          <Card size="small" className="payment-summary__card" loading={loading}>
            <Statistic
              title={label}
              value={values[index]}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={index === 3 && values[index] > 0 ? { color: 'var(--payments-color-error)' } : undefined}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
