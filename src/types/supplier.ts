export interface Supplier {
  id: number;
  code: string;
  name: string;
  taxCode?: string;
  phone?: string;
  email?: string;
  address?: string;
  avgLeadTimeDays: number;
  maxLeadTimeDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierProduct {
  id: number;
  supplierId: number;
  productId: number;
  lastPurchasePrice: number;
  leadTimeDays: number;
}
