import { apiClient } from '../../api/client';
import type { ApiResponse } from '../../types/api';
import type { AdminProductsRepository, ProductConversionFormValues } from './products.repository';
import type { AdminProductListResult, AdminProductRecord, ProductConversionView, ProductReferences, ProductSupplierFormValues, ProductSupplierView, SupplierReferenceOption } from './adminProducts.model';

const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data;

export const productsApiRepository: AdminProductsRepository = {
  async list(filters, page, size) {
    return unwrap(await apiClient.get<ApiResponse<AdminProductListResult>>('/admin/products', { params: { ...filters, categoryId: filters.categoryId, brand: filters.brand, page, size } }));
  },
  async listReferences() {
    return unwrap(await apiClient.get<ApiResponse<ProductReferences>>('/admin/products/references'));
  },
  async create(values) {
    return unwrap(await apiClient.post<ApiResponse<AdminProductRecord>>('/admin/products', values));
  },
  async update(id, values) {
    return unwrap(await apiClient.put<ApiResponse<AdminProductRecord>>(`/admin/products/${id}`, values));
  },
  async updateActive(id, isActive) {
    return unwrap(await apiClient.patch<ApiResponse<AdminProductRecord>>(`/admin/products/${id}/active`, { isActive }));
  },
  async updateStatus(id, status) {
    return unwrap(await apiClient.patch<ApiResponse<AdminProductRecord>>(`/admin/products/${id}/status`, { status }));
  },
  async listConversions(productId) {
    return unwrap(await apiClient.get<ApiResponse<ProductConversionView[]>>(`/admin/products/${productId}/conversions`));
  },
  async createConversion(productId, values: ProductConversionFormValues) {
    return unwrap(await apiClient.post<ApiResponse<ProductConversionView>>(`/admin/products/${productId}/conversions`, values));
  },
  async updateConversion(id, factor) {
    return unwrap(await apiClient.patch<ApiResponse<ProductConversionView>>(`/admin/products/conversions/${id}`, { factor }));
  },
  async deleteConversion(id) {
    await apiClient.delete(`/admin/products/conversions/${id}`);
  },
  async listSupplierReferences() {
    return unwrap(await apiClient.get<ApiResponse<SupplierReferenceOption[]>>('/admin/products/references/suppliers'));
  },
  async listSuppliers(productId) {
    return unwrap(await apiClient.get<ApiResponse<ProductSupplierView[]>>(`/admin/products/${productId}/suppliers`));
  },
  async createSupplier(productId, values: ProductSupplierFormValues) {
    return unwrap(await apiClient.post<ApiResponse<ProductSupplierView>>(`/admin/products/${productId}/suppliers`, values));
  },
  async updateSupplier(productId, relationId, values: ProductSupplierFormValues) {
    return unwrap(await apiClient.put<ApiResponse<ProductSupplierView>>(`/admin/products/${productId}/suppliers/${relationId}`, values));
  },
  async deleteSupplier(productId, relationId) {
    await apiClient.delete(`/admin/products/${productId}/suppliers/${relationId}`);
  },
};
