import type { Supplier } from '../../types/supplier';
import type {
  AdminSupplierDetail,
  AdminSupplierFilters,
  AdminSupplierListResult,
  ProductReference,
  SupplierFormValues,
  SupplierProductFormValues,
  SupplierProductView,
} from './suppliers.model';

export interface SupplierRepository {
  list(
    filters: AdminSupplierFilters,
    page: number,
    pageSize: number,
  ): Promise<AdminSupplierListResult>;
  getById(id: number): Promise<AdminSupplierDetail>;
  create(values: SupplierFormValues): Promise<Supplier>;
  update(id: number, values: SupplierFormValues): Promise<Supplier>;
  updateStatus(id: number, isActive: boolean): Promise<Supplier>;
  listProductReferences(): Promise<ProductReference[]>;
  linkProduct(supplierId: number, values: SupplierProductFormValues): Promise<SupplierProductView>;
  updateProductLink(
    supplierId: number,
    relationId: number,
    values: SupplierProductFormValues,
  ): Promise<SupplierProductView>;
  unlinkProduct(supplierId: number, relationId: number): Promise<void>;
}
