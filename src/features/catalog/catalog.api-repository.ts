import { apiClient } from '../../api/client';
import type { ApiResponse } from '../../types/api';
import { mockCatalogRepository } from '../../mocks/adminCatalogV1';
import type { CatalogRepository } from './catalog.repository';
import type { CatalogListResult, CatalogReferences, CategoryListResult } from './catalog.model';
import type { ProductCategory, Unit } from '../../types/catalog';

const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data;

export const catalogApiRepository: CatalogRepository = {
  async listCategories(filters, page, size) { return unwrap(await apiClient.get<ApiResponse<CategoryListResult>>('/admin/catalog/categories', { params: { ...filters, page, size } })); },
  async createCategory(values) { return unwrap(await apiClient.post<ApiResponse<ProductCategory>>('/admin/catalog/categories', values)); },
  async updateCategory(id, values) { return unwrap(await apiClient.put<ApiResponse<ProductCategory>>(`/admin/catalog/categories/${id}`, values)); },
  async updateCategoryStatus(id, isActive) { return unwrap(await apiClient.patch<ApiResponse<ProductCategory>>(`/admin/catalog/categories/${id}/status`, { isActive })); },
  async listUnits(filters, page, size) { return unwrap(await apiClient.get<ApiResponse<CatalogListResult<Unit>>>('/admin/catalog/units', { params: { ...filters, page, size } })); },
  async createUnit(values) { return unwrap(await apiClient.post<ApiResponse<Unit>>('/admin/catalog/units', values)); },
  async updateUnit(id, values) { return unwrap(await apiClient.put<ApiResponse<Unit>>(`/admin/catalog/units/${id}`, values)); },
  async updateUnitStatus(id, isActive) { return unwrap(await apiClient.patch<ApiResponse<Unit>>(`/admin/catalog/units/${id}/status`, { isActive })); },
  listBranches: mockCatalogRepository.listBranches,
  getBranch: mockCatalogRepository.getBranch,
  createBranch: mockCatalogRepository.createBranch,
  updateBranch: mockCatalogRepository.updateBranch,
  updateBranchStatus: mockCatalogRepository.updateBranchStatus,
  listWarehouses: mockCatalogRepository.listWarehouses,
  createWarehouse: mockCatalogRepository.createWarehouse,
  updateWarehouse: mockCatalogRepository.updateWarehouse,
  updateWarehouseStatus: mockCatalogRepository.updateWarehouseStatus,
  async listReferences() {
    const backend = unwrap(await apiClient.get<ApiResponse<CatalogReferences>>('/admin/catalog/references'));
    const mock = await mockCatalogRepository.listReferences();
    return { ...backend, branches: mock.branches };
  },
};
