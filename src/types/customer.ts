export type CustomerType = 'RETAIL' | 'WHOLESALE' | 'VIP';

/**
 * Hồ sơ khách hàng rút gọn đang được Customer Website và POS sử dụng.
 * Giữ nguyên contract này để các kênh bán hàng hiện tại không bị ảnh hưởng.
 */

export interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  type: CustomerType;
  companyName?: string;
  taxCode?: string;
  creditLimit?: number;
  creditUsed?: number;
}

export interface CustomerEntity {
  id: number;
  code: string;
  name: string;
  customerType: CustomerType;
  isCompany: boolean;
  taxCode?: string;
  phone?: string;
  email?: string;
  userId?: number;
  priceListId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  id: number;
  customerId: number;
  receiverName: string;
  phone: string;
  addressLine: string;
  ward?: string;
  district?: string;
  province: string;
  isDefault: boolean;
}

export interface CreditAccount {
  id: number;
  customerId: number;
  creditLimit: number;
  currentBalance: number;
  version: number;
  updatedAt: string;
}
