export interface Branch {
  id: number;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: number;
  code: string;
  branchId: number;
  name: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface ProductCategory {
  id: number;
  code: string;
  name: string;
  parentId?: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductUnitConversion {
  id: number;
  productId: number;
  unitId: number;
  factor: number;
}

export type PriceListCustomerType = 'RETAIL' | 'WHOLESALE' | 'VIP';

export interface PriceList {
  id: number;
  code: string;
  name: string;
  customerType: PriceListCustomerType;
  validFrom: string;
  validTo?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PriceTier {
  id: number;
  priceListId: number;
  productId: number;
  minQty: number;
  maxQty?: number;
  unitPrice: number;
}
