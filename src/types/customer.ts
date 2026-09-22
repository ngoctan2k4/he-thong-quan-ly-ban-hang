export type CustomerType = 'RETAIL' | 'WHOLESALE' | 'VIP';

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
