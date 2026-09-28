import type { Branch, ProductCategory, Unit, Warehouse } from '../../types/catalog';
import type {
  BranchDetail,
  BranchFilters,
  BranchFormValues,
  CatalogListResult,
  CategoryListResult,
  CatalogReferences,
  CategoryFilters,
  CategoryFormValues,
  UnitFilters,
  UnitFormValues,
  WarehouseFilters,
  WarehouseFormValues,
  WarehouseView,
} from './catalog.model';

export interface CatalogRepository {
  listCategories(filters: CategoryFilters, page: number, pageSize: number): Promise<CategoryListResult>;
  createCategory(values: CategoryFormValues): Promise<ProductCategory>;
  updateCategory(id: number, values: CategoryFormValues): Promise<ProductCategory>;
  updateCategoryStatus(id: number, isActive: boolean): Promise<ProductCategory>;
  listUnits(filters: UnitFilters, page: number, pageSize: number): Promise<CatalogListResult<Unit>>;
  createUnit(values: UnitFormValues): Promise<Unit>;
  updateUnit(id: number, values: UnitFormValues): Promise<Unit>;
  updateUnitStatus(id: number, isActive: boolean): Promise<Unit>;
  listBranches(filters: BranchFilters, page: number, pageSize: number): Promise<CatalogListResult<Branch>>;
  getBranch(id: number): Promise<BranchDetail>;
  createBranch(values: BranchFormValues): Promise<Branch>;
  updateBranch(id: number, values: BranchFormValues): Promise<Branch>;
  updateBranchStatus(id: number, isActive: boolean): Promise<Branch>;
  listWarehouses(filters: WarehouseFilters, page: number, pageSize: number): Promise<CatalogListResult<WarehouseView>>;
  createWarehouse(values: WarehouseFormValues): Promise<Warehouse>;
  updateWarehouse(id: number, values: WarehouseFormValues): Promise<Warehouse>;
  updateWarehouseStatus(id: number, isActive: boolean): Promise<Warehouse>;
  listReferences(): Promise<CatalogReferences>;
}
