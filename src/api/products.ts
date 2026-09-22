import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse } from '../types/api';
import type { Product } from '../types/product';

export interface ProductFilterParams {
  keyword?: string;
  categoryId?: number;
  page?: number;
  size?: number;
}

export async function getProducts(params: ProductFilterParams = {}): Promise<PaginatedResponse<Product>> {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params });
  return response.data.data;
}

export async function getProduct(id: number): Promise<Product> {
  const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data.data;
}
