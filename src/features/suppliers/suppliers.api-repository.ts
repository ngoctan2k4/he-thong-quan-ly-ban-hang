import { apiClient } from '../../api/client';
import type { ApiResponse } from '../../types/api';
import type { Supplier } from '../../types/supplier';
import type { SupplierRepository } from './suppliers.repository';
import type { AdminSupplierDetail, AdminSupplierListResult, ProductReference, SupplierProductView } from './suppliers.model';

const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data;

export const suppliersApiRepository: SupplierRepository = {
  async list(filters, page, size) { return unwrap(await apiClient.get<ApiResponse<AdminSupplierListResult>>('/admin/suppliers', { params: { ...filters, page, size } })); },
  async getById(id) { return unwrap(await apiClient.get<ApiResponse<AdminSupplierDetail>>(`/admin/suppliers/${id}`)); },
  async create(values) { return unwrap(await apiClient.post<ApiResponse<Supplier>>('/admin/suppliers', values)); },
  async update(id, values) { return unwrap(await apiClient.put<ApiResponse<Supplier>>(`/admin/suppliers/${id}`, values)); },
  async updateStatus(id, isActive) { return unwrap(await apiClient.patch<ApiResponse<Supplier>>(`/admin/suppliers/${id}/status`, { isActive })); },
  async listProductReferences() { return unwrap(await apiClient.get<ApiResponse<ProductReference[]>>('/admin/suppliers/products')); },
  async linkProduct(supplierId, values) { return unwrap(await apiClient.post<ApiResponse<SupplierProductView>>(`/admin/suppliers/${supplierId}/products`, values)); },
  async updateProductLink(supplierId, relationId, values) { return unwrap(await apiClient.put<ApiResponse<SupplierProductView>>(`/admin/suppliers/${supplierId}/products/${relationId}`, values)); },
  async unlinkProduct(supplierId, relationId) { await apiClient.delete(`/admin/suppliers/${supplierId}/products/${relationId}`); },
};
