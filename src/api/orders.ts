import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse } from '../types/api';
import type { Order } from '../types/order';

export interface OrderFilterParams {
  status?: string;
  page?: number;
  size?: number;
}

export async function getOrders(params: OrderFilterParams = {}): Promise<PaginatedResponse<Order>> {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>('/orders', { params });
  return response.data.data;
}

export async function getOrder(id: number): Promise<Order> {
  const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
  return response.data.data;
}
