import { Tag } from 'antd';
import type { PriceListCustomerType } from '../../../types/catalog';
import type { PriceListEffectiveness } from '../pricing.model';
import { priceListCustomerTypeLabels } from '../pricing.model';

export const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export const dateFormatter = new Intl.DateTimeFormat('vi-VN');

export function CustomerTypeTag({ value }: { value: PriceListCustomerType }) {
  const color = value === 'VIP' ? 'purple' : value === 'WHOLESALE' ? 'blue' : 'cyan';
  return <Tag color={color}>{priceListCustomerTypeLabels[value]}</Tag>;
}

const effectivenessMeta: Record<PriceListEffectiveness, { label: string; color: string }> = {
  UPCOMING: { label: 'Chưa hiệu lực', color: 'processing' },
  ACTIVE: { label: 'Đang hiệu lực', color: 'success' },
  EXPIRED: { label: 'Hết hiệu lực', color: 'default' },
  DISABLED: { label: 'Đã tắt', color: 'error' },
};

export function EffectivenessTag({ value }: { value: PriceListEffectiveness }) {
  const meta = effectivenessMeta[value];
  return <Tag color={meta.color}>{meta.label}</Tag>;
}
