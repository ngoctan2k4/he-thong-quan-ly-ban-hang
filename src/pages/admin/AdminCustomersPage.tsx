import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Flex, Skeleton, Spin, Typography } from 'antd';
import { useCallback, useState } from 'react';
import { AdminListPage } from '../../components/admin/AdminListPage';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { ErrorState } from '../../components/common/ErrorState';
import '../../features/customers/customers.css';
import { CustomerDetailDrawer } from '../../features/customers/components/CustomerDetailDrawer';
import { CustomerFilters } from '../../features/customers/components/CustomerFilters';
import { CustomerFormDrawer } from '../../features/customers/components/CustomerFormDrawer';
import { CustomerTable } from '../../features/customers/components/CustomerTable';
import { useAdminCustomers } from '../../features/customers/hooks/useAdminCustomers';
import type {
  AdminCustomerFilters,
  AdminCustomerRecord,
  CustomerAddressFormValues,
  CustomerFormMode,
  CustomerFormValues,
} from '../../features/customers/customers.model';
import { initialAdminCustomerFilters } from '../../features/customers/customers.model';

interface PendingStatusChange {
  customer: AdminCustomerRecord;
  isActive: boolean;
}

export function AdminCustomersPage() {
  const { message } = App.useApp();
  const [filters, setFilters] = useState<AdminCustomerFilters>(initialAdminCustomerFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>();
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomerRecord>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CustomerFormMode>('create');
  const [pendingStatusChange, setPendingStatusChange] = useState<PendingStatusChange>();

  const {
    listQuery,
    detailQuery,
    priceListsQuery,
    createCustomer,
    updateCustomer,
    updateCustomerStatus,
    createAddress,
    updateAddress,
    setDefaultAddress,
    removeAddress,
    isSavingCustomer,
    isUpdatingStatus,
    isSavingAddress,
    isUpdatingAddress,
  } = useAdminCustomers({ filters, page, pageSize, selectedCustomerId });

  const handleFilterChange = useCallback((nextFilters: AdminCustomerFilters) => {
    setFilters(nextFilters);
    setPage(1);
  }, []);

  const openCreateDrawer = () => {
    setSelectedCustomer(undefined);
    setFormMode('create');
    setFormOpen(true);
  };

  const openDetailDrawer = (customer: AdminCustomerRecord) => {
    setSelectedCustomer(customer);
    setSelectedCustomerId(customer.id);
    setDetailOpen(true);
  };

  const openEditDrawer = (customer: AdminCustomerRecord) => {
    setSelectedCustomer(customer);
    setSelectedCustomerId(customer.id);
    setDetailOpen(false);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleSaveCustomer = async (values: CustomerFormValues) => {
    try {
      if (formMode === 'edit' && selectedCustomer) {
        await updateCustomer({ id: selectedCustomer.id, values });
        void message.success('Đã cập nhật khách hàng.');
      } else {
        await createCustomer(values);
        setPage(1);
        void message.success('Đã thêm khách hàng.');
      }
      setFormOpen(false);
      setSelectedCustomer(undefined);
      setSelectedCustomerId(undefined);
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể lưu khách hàng. Vui lòng thử lại.');
    }
  };

  const performStatusChange = async (change: PendingStatusChange) => {
    try {
      await updateCustomerStatus({ id: change.customer.id, isActive: change.isActive });
      void message.success(change.isActive ? 'Đã kích hoạt khách hàng.' : 'Đã ngừng hoạt động khách hàng.');
      setPendingStatusChange(undefined);
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái khách hàng.');
    }
  };

  const handleSaveAddress = async (values: CustomerAddressFormValues, addressId?: number) => {
    if (selectedCustomerId === undefined) {
      return false;
    }
    try {
      if (addressId === undefined) {
        await createAddress({ customerId: selectedCustomerId, values });
        void message.success('Đã thêm địa chỉ khách hàng.');
      } else {
        await updateAddress({ customerId: selectedCustomerId, addressId, values });
        void message.success('Đã cập nhật địa chỉ khách hàng.');
      }
      return true;
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể lưu địa chỉ.');
      return false;
    }
  };

  const handleSetDefaultAddress = async (addressId: number) => {
    if (selectedCustomerId === undefined) {
      return false;
    }
    try {
      await setDefaultAddress({ customerId: selectedCustomerId, addressId });
      void message.success('Đã đặt địa chỉ mặc định.');
      return true;
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể đặt địa chỉ mặc định.');
      return false;
    }
  };

  const handleRemoveAddress = async (addressId: number) => {
    if (selectedCustomerId === undefined) {
      return false;
    }
    try {
      await removeAddress({ customerId: selectedCustomerId, addressId });
      void message.success('Đã xóa địa chỉ khách hàng.');
      return true;
    } catch (error) {
      void message.error(error instanceof Error ? error.message : 'Không thể xóa địa chỉ.');
      return false;
    }
  };

  const listResult = listQuery.data;
  const customers = listResult?.content ?? [];
  const total = listResult?.totalElements ?? 0;

  return (
    <div className="admin-customers-page">
      <AdminListPage
        title="Khách hàng"
        description="Quản lý hồ sơ, địa chỉ và hạn mức công nợ của khách hàng."
        primaryAction={<Button type="primary" icon={<PlusOutlined />} onClick={openCreateDrawer}>Thêm khách hàng</Button>}
        toolbar={
          <CustomerFilters
            filters={filters}
            loading={listQuery.isFetching}
            onChange={handleFilterChange}
            onReset={() => {
              setFilters(initialAdminCustomerFilters);
              setPage(1);
            }}
          />
        }
        summary={
          <Flex justify="space-between" align="center" gap={12} wrap className="admin-customers__summary">
            <Typography.Text strong>{total} khách hàng</Typography.Text>
            {listQuery.isFetching && !listQuery.isLoading ? (
              <Flex align="center" gap={8} aria-live="polite">
                <Spin size="small" />
                <Typography.Text type="secondary">Đang cập nhật dữ liệu</Typography.Text>
              </Flex>
            ) : null}
          </Flex>
        }
      >
        {listQuery.isLoading ? <div className="admin-entity__loading"><Skeleton active paragraph={{ rows: 8 }} /></div> : null}
        {listQuery.isError ? (
          <ErrorState message="Không thể tải danh sách khách hàng mock." onRetry={() => void listQuery.refetch()} />
        ) : null}
        {!listQuery.isLoading && !listQuery.isError ? (
          <CustomerTable
            customers={customers}
            loading={listQuery.isFetching}
            page={page}
            pageSize={pageSize}
            total={total}
            onPaginationChange={(nextPage, nextPageSize) => {
              setPage(nextPageSize !== pageSize ? 1 : nextPage);
              setPageSize(nextPageSize);
            }}
            onCreate={openCreateDrawer}
            onView={openDetailDrawer}
            onEdit={openEditDrawer}
            onRequestStatusChange={(customer, isActive) => setPendingStatusChange({ customer, isActive })}
          />
        ) : null}
      </AdminListPage>

      <CustomerDetailDrawer
        open={detailOpen}
        customer={detailQuery.data}
        loading={detailQuery.isLoading}
        error={detailQuery.error}
        addressSaving={isSavingAddress}
        addressUpdating={isUpdatingAddress}
        onClose={() => {
          setDetailOpen(false);
          setSelectedCustomerId(undefined);
        }}
        onRetry={() => void detailQuery.refetch()}
        onEdit={openEditDrawer}
        onSaveAddress={handleSaveAddress}
        onSetDefaultAddress={handleSetDefaultAddress}
        onRemoveAddress={handleRemoveAddress}
      />

      <CustomerFormDrawer
        open={formOpen}
        mode={formMode}
        customer={selectedCustomer}
        priceLists={priceListsQuery.data ?? []}
        loading={isSavingCustomer}
        onClose={() => {
          setFormOpen(false);
          setSelectedCustomer(undefined);
          setSelectedCustomerId(undefined);
        }}
        onSubmit={(values) => void handleSaveCustomer(values)}
      />

      <ConfirmModal
        open={Boolean(pendingStatusChange)}
        title={pendingStatusChange?.isActive ? 'Kích hoạt khách hàng?' : 'Ngừng hoạt động khách hàng?'}
        content={pendingStatusChange
          ? `Xác nhận ${pendingStatusChange.isActive ? 'kích hoạt' : 'ngừng hoạt động'} “${pendingStatusChange.customer.name}”.`
          : ''}
        confirmText={pendingStatusChange?.isActive ? 'Kích hoạt' : 'Ngừng hoạt động'}
        danger={!pendingStatusChange?.isActive}
        loading={isUpdatingStatus}
        onConfirm={() => {
          if (pendingStatusChange) {
            void performStatusChange(pendingStatusChange);
          }
        }}
        onCancel={() => setPendingStatusChange(undefined)}
      />
    </div>
  );
}
