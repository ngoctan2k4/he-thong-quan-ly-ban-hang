import type { PriceList, PriceListCustomerType, PriceTier } from '../../types/catalog';

export interface PriceListFormValues {
  code: string;
  name: string;
  customerType: PriceListCustomerType;
  validFrom: string;
  validTo?: string;
  isActive: boolean;
}

export interface PriceTierFormValues {
  productId: number;
  minQty: number;
  maxQty?: number;
  unitPrice: number;
}

export type PriceListEffectiveness = 'UPCOMING' | 'ACTIVE' | 'EXPIRED' | 'DISABLED';
export type PriceListEffectivenessFilter = 'ALL' | Exclude<PriceListEffectiveness, 'DISABLED'>;

export interface PriceListFilters {
  keyword: string;
  customerType?: PriceListCustomerType;
  effectiveness: PriceListEffectivenessFilter;
}

export interface PriceListView extends PriceList {
  productCount: number;
  effectiveness: PriceListEffectiveness;
}

export interface PriceListResult {
  content: PriceListView[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface PriceTierView extends PriceTier {
  productCode: string;
  productName: string;
  productIsActive: boolean;
}

export interface PriceListDetail extends PriceList {
  tiers: PriceTierView[];
}

export interface PriceTierMutationResult {
  tier: PriceTier;
}

export interface PricingProductOption {
  value: number;
  label: string;
  disabled?: boolean;
}

export const initialPriceListFilters: PriceListFilters = {
  keyword: '',
  customerType: undefined,
  effectiveness: 'ALL',
};

export const priceListCustomerTypeLabels: Record<PriceListCustomerType, string> = {
  RETAIL: 'Khách lẻ',
  WHOLESALE: 'Khách sỉ',
  VIP: 'Khách VIP',
};

export function getPriceListEffectiveness(priceList: Pick<PriceList, 'isActive' | 'validFrom' | 'validTo'>, now = new Date()): PriceListEffectiveness {
  if (!priceList.isActive) return 'DISABLED';
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  const today = local.toISOString().slice(0, 10);
  if (priceList.validFrom > today) return 'UPCOMING';
  if (priceList.validTo && priceList.validTo < today) return 'EXPIRED';
  return 'ACTIVE';
}
