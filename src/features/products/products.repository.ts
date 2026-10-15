import type {
  AdminProductFilters,
  AdminProductListResult,
  AdminProductRecord,
  AdminProductStatus,
  ProductConversionView,
  ProductFormValues,
  ProductReferences,
  ProductSupplierFormValues,
  ProductSupplierView,
  SupplierReferenceOption,
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
  listSupplierReferences(): Promise<SupplierReferenceOption[]>;
  listSuppliers(productId: number): Promise<ProductSupplierView[]>;
  createSupplier(productId: number, values: ProductSupplierFormValues): Promise<ProductSupplierView>;
  updateSupplier(productId: number, relationId: number, values: ProductSupplierFormValues): Promise<ProductSupplierView>;
  deleteSupplier(productId: number, relationId: number): Promise<void>;
}
