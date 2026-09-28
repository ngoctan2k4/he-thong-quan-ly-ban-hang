import type { PriceList } from '../../types/catalog';
import type {
  PriceListDetail,
  PriceListFilters,
  PriceListFormValues,
  PriceListResult,
  PriceTierFormValues,
  PriceTierMutationResult,
  PriceTierView,
  PricingProductOption,
} from './pricing.model';

export interface PricingRepository {
  listPriceLists(filters: PriceListFilters, page: number, pageSize: number): Promise<PriceListResult>;
  getPriceList(id: number): Promise<PriceListDetail>;
  createPriceList(values: PriceListFormValues): Promise<PriceList>;
  updatePriceList(id: number, values: PriceListFormValues): Promise<PriceList>;
  updatePriceListStatus(id: number, isActive: boolean): Promise<PriceList>;
  createTier(priceListId: number, values: PriceTierFormValues): Promise<PriceTierMutationResult>;
  updateTier(id: number, values: PriceTierFormValues): Promise<PriceTierMutationResult>;
  deleteTier(id: number): Promise<void>;
  listTiers(priceListId: number): Promise<PriceTierView[]>;
  listProductOptions(): Promise<PricingProductOption[]>;
}
