import type {
  AdminProductFilters,
  AdminProductListResult,
  AdminProductRecord,
  AdminProductStatus,
  ProductConversionView,
  ProductFormValues,
  ProductReferences,
} from './adminProducts.model';

export interface ProductConversionFormValues {
  unitId: number;
  factor: number;
}

export interface AdminProductsRepository {
  list(filters: AdminProductFilters, page: number, pageSize: number): Promise<AdminProductListResult>;
  listReferences(): Promise<ProductReferences>;
  create(values: ProductFormValues): Promise<AdminProductRecord>;
  update(id: number, values: ProductFormValues): Promise<AdminProductRecord>;
  updateActive(id: number, isActive: boolean): Promise<AdminProductRecord>;
  updateStatus(id: number, status: AdminProductStatus): Promise<AdminProductRecord>;
  listConversions(productId: number): Promise<ProductConversionView[]>;
  createConversion(productId: number, values: ProductConversionFormValues): Promise<ProductConversionView>;
  updateConversion(id: number, factor: number): Promise<ProductConversionView>;
  deleteConversion(id: number): Promise<void>;
}
