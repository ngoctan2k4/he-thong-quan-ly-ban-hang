import type { ProductUnitConversion } from '../../types/catalog';

export type AdminProductStatus = 'ACTIVE' | 'DISCONTINUED' | 'HIDDEN';
export type AdminProductStatusFilter = 'ALL' | AdminProductStatus;
export type ProductFormMode = 'create' | 'edit';

export interface AdminProductRecord {
  id: number;
  code: string;
  sku: string;
  barcode?: string;
  name: string;
  categoryId: number;
  categoryName: string;
  brand?: string;
  baseUnitId: number;
  baseUnitName: string;
  retailPrice: number;
  wholesalePrice: number;
  moq: number;
  minStock: number;
  maxStock?: number;
  safetyStock: number;
  reorderPoint: number;
  status: AdminProductStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProductFilters {
  keyword: string;
  categoryId?: number;
  brand?: string;
  status: AdminProductStatusFilter;
}

export interface AdminProductListResult {
  content: AdminProductRecord[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface ProductReferenceOption {
  value: number;
  label: string;
  disabled?: boolean;
}

export interface ProductReferences {
  categories: ProductReferenceOption[];
  units: ProductReferenceOption[];
  brands: string[];
}

export interface ProductFormValues {
  code: string;
  sku: string;
  barcode?: string;
  name: string;
  categoryId: number;
  brand?: string;
  baseUnitId: number;
  retailPrice: number;
  wholesalePrice: number;
  moq: number;
  minStock: number;
  maxStock?: number;
  safetyStock: number;
  reorderPoint: number;
  status: AdminProductStatus;
  isActive: boolean;
}

export interface ProductConversionView extends ProductUnitConversion {
  unitName: string;
}

export interface ProductSupplierView {
  id: number;
  supplierId: number;
  productId: number;
  supplierCode: string;
  supplierName: string;
  supplierIsActive: boolean;
  lastPurchasePrice: number;
  leadTimeDays: number;
  isDefaultSupplier: boolean;
}

export interface ProductSupplierFormValues {
  supplierId: number;
  lastPurchasePrice: number;
  leadTimeDays: number;
  isDefaultSupplier: boolean;
}

export type SupplierReferenceOption = ProductReferenceOption;

export const initialAdminProductFilters: AdminProductFilters = {
  keyword: '',
  categoryId: undefined,
  brand: undefined,
  status: 'ALL',
};
