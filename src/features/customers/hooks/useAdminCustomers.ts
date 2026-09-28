import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockCustomerRepository } from '../../../mocks/adminCustomers';
import type { CustomerAddressFormValues, CustomerFormValues } from '../customers.model';
import type { AdminCustomerFilters } from '../customers.model';

const customerRepository = mockCustomerRepository;
const adminCustomersQueryKey = ['admin-customers'] as const;

interface UseAdminCustomersParams {
  filters: AdminCustomerFilters;
  page: number;
  pageSize: number;
  selectedCustomerId?: number;
}

export function useAdminCustomers({
  filters,
  page,
  pageSize,
  selectedCustomerId,
}: UseAdminCustomersParams) {
  const queryClient = useQueryClient();
  const listQuery = useQuery({
    queryKey: [...adminCustomersQueryKey, 'list', filters, page, pageSize],
    queryFn: () => customerRepository.list(filters, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const detailQuery = useQuery({
    queryKey: [...adminCustomersQueryKey, 'detail', selectedCustomerId],
    queryFn: () => customerRepository.getById(selectedCustomerId as number),
    enabled: selectedCustomerId !== undefined,
  });
  const priceListsQuery = useQuery({
    queryKey: [...adminCustomersQueryKey, 'price-lists'],
    queryFn: () => customerRepository.listPriceLists(),
  });

  const invalidateCustomers = () => queryClient.invalidateQueries({ queryKey: adminCustomersQueryKey });
  const createMutation = useMutation({
    mutationFn: (values: CustomerFormValues) => customerRepository.create(values),
    onSuccess: invalidateCustomers,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: CustomerFormValues }) =>
      customerRepository.update(id, values),
    onSuccess: invalidateCustomers,
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      customerRepository.updateStatus(id, isActive),
    onSuccess: invalidateCustomers,
  });
  const createAddressMutation = useMutation({
    mutationFn: ({ customerId, values }: { customerId: number; values: CustomerAddressFormValues }) =>
      customerRepository.createAddress(customerId, values),
    onSuccess: invalidateCustomers,
  });
  const updateAddressMutation = useMutation({
    mutationFn: ({
      customerId,
      addressId,
      values,
    }: {
      customerId: number;
      addressId: number;
      values: CustomerAddressFormValues;
    }) => customerRepository.updateAddress(customerId, addressId, values),
    onSuccess: invalidateCustomers,
  });
  const defaultAddressMutation = useMutation({
    mutationFn: ({ customerId, addressId }: { customerId: number; addressId: number }) =>
      customerRepository.setDefaultAddress(customerId, addressId),
    onSuccess: invalidateCustomers,
  });
  const removeAddressMutation = useMutation({
    mutationFn: ({ customerId, addressId }: { customerId: number; addressId: number }) =>
      customerRepository.removeAddress(customerId, addressId),
    onSuccess: invalidateCustomers,
  });

  return {
    listQuery,
    detailQuery,
    priceListsQuery,
    createCustomer: createMutation.mutateAsync,
    updateCustomer: updateMutation.mutateAsync,
    updateCustomerStatus: statusMutation.mutateAsync,
    createAddress: createAddressMutation.mutateAsync,
    updateAddress: updateAddressMutation.mutateAsync,
    setDefaultAddress: defaultAddressMutation.mutateAsync,
    removeAddress: removeAddressMutation.mutateAsync,
    isSavingCustomer: createMutation.isPending || updateMutation.isPending,
    isUpdatingStatus: statusMutation.isPending,
    isSavingAddress: createAddressMutation.isPending || updateAddressMutation.isPending,
    isUpdatingAddress: defaultAddressMutation.isPending || removeAddressMutation.isPending,
  };
}
