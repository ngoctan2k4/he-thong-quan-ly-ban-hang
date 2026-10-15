import { apiClient } from '../../api/client';
import type { ApiResponse } from '../../types/api';
import type { PriceList } from '../../types/catalog';
import type { PricingRepository } from './pricing.repository';
import type { PriceListDetail, PriceListResult, PriceTierMutationResult, PriceTierView, PricingProductOption } from './pricing.model';

const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data;

export const pricingApiRepository: PricingRepository = {
  async listPriceLists(filters, page, size) { return unwrap(await apiClient.get<ApiResponse<PriceListResult>>('/admin/price-lists', { params: { ...filters, page, size } })); },
  async getPriceList(id) { return unwrap(await apiClient.get<ApiResponse<PriceListDetail>>(`/admin/price-lists/${id}`)); },
  async createPriceList(values) { return unwrap(await apiClient.post<ApiResponse<PriceList>>('/admin/price-lists', values)); },
  async updatePriceList(id, values) { return unwrap(await apiClient.put<ApiResponse<PriceList>>(`/admin/price-lists/${id}`, values)); },
  async updatePriceListStatus(id, isActive) { return unwrap(await apiClient.patch<ApiResponse<PriceList>>(`/admin/price-lists/${id}/status`, { isActive })); },
  async createTier(priceListId, values) { return unwrap(await apiClient.post<ApiResponse<PriceTierMutationResult>>(`/admin/price-lists/${priceListId}/tiers`, values)); },
  async updateTier(id, values) { return unwrap(await apiClient.put<ApiResponse<PriceTierMutationResult>>(`/admin/price-lists/tiers/${id}`, values)); },
  async deleteTier(id) { await apiClient.delete(`/admin/price-lists/tiers/${id}`); },
  async listTiers(priceListId) { const detail = unwrap(await apiClient.get<ApiResponse<PriceListDetail>>(`/admin/price-lists/${priceListId}`)); return detail.tiers as PriceTierView[]; },
  async listProductOptions() { return unwrap(await apiClient.get<ApiResponse<PricingProductOption[]>>('/admin/price-lists/products')); },
};
