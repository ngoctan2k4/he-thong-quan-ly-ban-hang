import { apiClient } from '../../api/client';
import type { ApiResponse } from '../../types/api';

export interface InventoryBalance {
  id: number;
  productId: number;
  sku: string;
  product: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  updatedAt: string;
}

export interface StockIssue {
  id: number;
  code: string;
  reference: string;
  productId: number;
  sku: string;
  product: string;
  quantity: number;
  createdAt: string;
}

export interface ProductOption { value: number; label: string; disabled?: boolean }

const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data;

export const inventoryApi = {
  async listBalances() { return unwrap(await apiClient.get<ApiResponse<InventoryBalance[]>>('/admin/inventory/balances')); },
  async saveBalance(productId: number, values: { onHand: number; reserved: number }) { return unwrap(await apiClient.put<ApiResponse<InventoryBalance>>(`/admin/inventory/balances/${productId}`, values)); },
  async listIssues() { return unwrap(await apiClient.get<ApiResponse<StockIssue[]>>('/admin/inventory/issues')); },
  async createIssue(values: { reference: string; productId: number; quantity: number }) { return unwrap(await apiClient.post<ApiResponse<StockIssue>>('/admin/inventory/issues', values)); },
  async listProducts() { return unwrap(await apiClient.get<ApiResponse<ProductOption[]>>('/admin/inventory/products')); },
};
