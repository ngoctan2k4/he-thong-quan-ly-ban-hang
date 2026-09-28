import type {
  CreditAccount,
  CustomerAddress,
  CustomerEntity,
  CustomerType,
} from '../../types/customer';

export type CustomerStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';
export type CustomerSubjectFilter = 'ALL' | 'INDIVIDUAL' | 'COMPANY';
export type CustomerTypeFilter = 'ALL' | CustomerType;
export type CustomerFormMode = 'create' | 'edit';

export interface PriceListOption {
  value: number;
  label: string;
}

export interface AdminCustomerRecord extends CustomerEntity {
  priceListName?: string;
  currentBalance?: number;
  creditLimit?: number;
}

export interface AdminCustomerDetail extends AdminCustomerRecord {
  addresses: CustomerAddress[];
  creditAccount?: CreditAccount;
}

export interface AdminCustomerFilters {
  keyword: string;
  customerType: CustomerTypeFilter;
  subjectType: CustomerSubjectFilter;
  status: CustomerStatusFilter;
}

export interface AdminCustomerListResult {
  content: AdminCustomerRecord[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface CustomerFormValues {
  code: string;
  name: string;
  customerType: CustomerType;
  isCompany: boolean;
  taxCode?: string;
  phone?: string;
  email?: string;
  priceListId?: number;
  isActive: boolean;
}

export interface CustomerAddressFormValues {
  receiverName: string;
  phone: string;
  addressLine: string;
  ward?: string;
  district?: string;
  province: string;
  isDefault: boolean;
}

export const initialAdminCustomerFilters: AdminCustomerFilters = {
  keyword: '',
  customerType: 'ALL',
  subjectType: 'ALL',
  status: 'ALL',
};
