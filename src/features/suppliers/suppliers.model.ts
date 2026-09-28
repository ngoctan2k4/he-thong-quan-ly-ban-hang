import type { Supplier, SupplierProduct } from '../../types/supplier';

export type SupplierStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';
export type SupplierFormMode = 'create' | 'edit';

export interface AdminSupplierFilters {
  keyword: string;
  status: SupplierStatusFilter;
}

export interface AdminSupplierListResult {
  content: Supplier[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface SupplierFormValues {
  code: string;
  name: string;
  taxCode?: string;
  phone?: string;
  email?: string;
  address?: string;
  avgLeadTimeDays: number;
  maxLeadTimeDays: number;
  isActive: boolean;
}

export interface SupplierProductFormValues {
  productId: number;
  lastPurchasePrice: number;
  leadTimeDays: number;
}

export interface ProductReference {
  id: number;
  code: string;
  name: string;
  defaultSupplierId?: number;
}

export interface SupplierProductView extends SupplierProduct {
  productCode: string;
  productName: string;
  isDefaultSupplier: boolean;
}

export interface AdminSupplierDetail extends Supplier {
  products: SupplierProductView[];
}

export const initialAdminSupplierFilters: AdminSupplierFilters = {
  keyword: '',
  status: 'ALL',
};
