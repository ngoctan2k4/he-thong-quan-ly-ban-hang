import type { Branch, ProductCategory, Unit, Warehouse } from '../../types/catalog';

export type ActiveFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';
export type CatalogFormMode = 'create' | 'edit';

export interface CatalogListResult<T> {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface CategoryFilters {
  keyword: string;
  status: ActiveFilter;
}

export interface CategoryFormValues {
  code: string;
  name: string;
  parentId?: number;
  description?: string;
  isActive: boolean;
}

export interface UnitFilters {
  keyword: string;
  status: ActiveFilter;
}

export interface UnitFormValues {
  code: string;
  name: string;
  isActive: boolean;
}

export interface BranchFilters {
  keyword: string;
  status: ActiveFilter;
}

export interface BranchFormValues {
  code: string;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
}

export interface WarehouseFilters {
  keyword: string;
  branchId?: number;
  status: ActiveFilter;
}

export interface WarehouseFormValues {
  code: string;
  name: string;
  branchId: number;
  isDefault: boolean;
  isActive: boolean;
}

export interface CategoryView extends ProductCategory {
  parentName?: string;
  children?: CategoryView[];
}

export interface CategoryListResult extends CatalogListResult<CategoryView> {
  categoryCount: number;
}

export interface WarehouseView extends Warehouse {
  branchName: string;
}

export interface BranchDetail extends Branch {
  warehouses: Warehouse[];
}

export interface CatalogReferences {
  categories: ProductCategory[];
  units: Unit[];
  branches: Branch[];
}

export const initialCategoryFilters: CategoryFilters = { keyword: '', status: 'ALL' };
export const initialUnitFilters: UnitFilters = { keyword: '', status: 'ALL' };
export const initialBranchFilters: BranchFilters = { keyword: '', status: 'ALL' };
export const initialWarehouseFilters: WarehouseFilters = {
  keyword: '',
  branchId: undefined,
  status: 'ALL',
};
