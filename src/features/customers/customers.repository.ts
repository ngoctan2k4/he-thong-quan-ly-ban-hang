import type { CustomerAddress } from '../../types/customer';
import type {
  AdminCustomerDetail,
  AdminCustomerFilters,
  AdminCustomerListResult,
  AdminCustomerRecord,
  CustomerAddressFormValues,
  CustomerFormValues,
  PriceListOption,
} from './customers.model';

export interface CustomerRepository {
  list(
    filters: AdminCustomerFilters,
    page: number,
    pageSize: number,
  ): Promise<AdminCustomerListResult>;
  getById(id: number): Promise<AdminCustomerDetail>;
  create(values: CustomerFormValues): Promise<AdminCustomerRecord>;
  update(id: number, values: CustomerFormValues): Promise<AdminCustomerRecord>;
  updateStatus(id: number, isActive: boolean): Promise<AdminCustomerRecord>;
  createAddress(customerId: number, values: CustomerAddressFormValues): Promise<CustomerAddress>;
  updateAddress(
    customerId: number,
    addressId: number,
    values: CustomerAddressFormValues,
  ): Promise<CustomerAddress>;
  setDefaultAddress(customerId: number, addressId: number): Promise<CustomerAddress>;
  removeAddress(customerId: number, addressId: number): Promise<void>;
  listPriceLists(): Promise<PriceListOption[]>;
}
