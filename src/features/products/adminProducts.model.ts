import type { Product, ProductStatus } from '../../types/product';

export type ProductStatusFilter = 'ALL' | ProductStatus;
export type ProductStockFilter = 'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK';
export type ProductFormMode = 'create' | 'edit';

export interface AdminProductRecord extends Product {
  categoryName: string;
  updatedAt: string;
}

export interface AdminProductFilters {
  keyword: string;
  categoryId?: number;
  status: ProductStatusFilter;
  stock: ProductStockFilter;
}

export interface AdminProductListResult {
  content: AdminProductRecord[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface ProductCategoryOption {
  value: number;
  label: string;
}

export interface ProductFormValues {
  sku: string;
  name: string;
  categoryId: number;
  brand?: string;
  unit: string;
  retailPrice: number;
  wholesalePrice?: number;
  availableStock: number;
  status: Exclude<ProductStatus, 'OUT_OF_STOCK'>;
  imageUrl?: string;
}

export const initialAdminProductFilters: AdminProductFilters = {
  keyword: '',
  categoryId: undefined,
  status: 'ALL',
  stock: 'ALL',
};
