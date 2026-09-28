import type { CustomerRepository } from '../features/customers/customers.repository';
import type {
  AdminCustomerDetail,
  AdminCustomerFilters,
  AdminCustomerListResult,
  AdminCustomerRecord,
  CustomerAddressFormValues,
  CustomerFormValues,
  PriceListOption,
} from '../features/customers/customers.model';
import type { CreditAccount, CustomerAddress, CustomerEntity } from '../types/customer';

export const mockPriceLists: PriceListOption[] = [
  { value: 1, label: 'Bảng giá bán lẻ' },
  { value: 2, label: 'Bảng giá bán sỉ' },
  { value: 3, label: 'Bảng giá khách VIP' },
];

const seedCustomers: CustomerEntity[] = [
  {
    id: 1,
    code: 'KH0001',
    name: 'Nguyễn Minh Anh',
    customerType: 'RETAIL',
    isCompany: false,
    phone: '0901234567',
    email: 'minhanh@example.com',
    userId: 101,
    priceListId: 1,
    isActive: true,
    createdAt: '2026-01-08T08:20:00.000Z',
    updatedAt: '2026-09-20T03:10:00.000Z',
  },
  {
    id: 2,
    code: 'KH0002',
    name: 'Công ty TNHH Minh Phát',
    customerType: 'WHOLESALE',
    isCompany: true,
    taxCode: '0312345678',
    phone: '02838778899',
    email: 'muahang@minhphat.vn',
    priceListId: 2,
    isActive: true,
    createdAt: '2025-11-12T02:30:00.000Z',
    updatedAt: '2026-09-19T09:25:00.000Z',
  },
  {
    id: 3,
    code: 'KH0003',
    name: 'Trần Thu Hà',
    customerType: 'VIP',
    isCompany: false,
    phone: '0988765432',
    email: 'thuha@example.com',
    priceListId: 3,
    isActive: true,
    createdAt: '2026-02-16T10:00:00.000Z',
    updatedAt: '2026-09-18T07:45:00.000Z',
  },
  {
    id: 4,
    code: 'KH0004',
    name: 'Công ty Cổ phần An Khang',
    customerType: 'VIP',
    isCompany: true,
    taxCode: '0109988776',
    phone: '02439998888',
    email: 'contact@ankhang.vn',
    priceListId: 3,
    isActive: true,
    createdAt: '2025-08-05T01:15:00.000Z',
    updatedAt: '2026-09-17T08:00:00.000Z',
  },
  {
    id: 5,
    code: 'KH0005',
    name: 'Lê Quốc Bảo',
    customerType: 'RETAIL',
    isCompany: false,
    phone: '0914555666',
    email: 'bao.le@example.com',
    priceListId: 1,
    isActive: false,
    createdAt: '2026-03-02T04:40:00.000Z',
    updatedAt: '2026-08-30T06:20:00.000Z',
  },
  {
    id: 6,
    code: 'KH0006',
    name: 'Hộ kinh doanh Thảo Nguyên',
    customerType: 'WHOLESALE',
    isCompany: true,
    taxCode: '8294561237',
    phone: '0938123456',
    email: 'thaonguyen.shop@example.com',
    priceListId: 2,
    isActive: true,
    createdAt: '2026-04-10T07:05:00.000Z',
    updatedAt: '2026-09-16T02:35:00.000Z',
  },
  {
    id: 7,
    code: 'KH0007',
    name: 'Phạm Gia Hân',
    customerType: 'RETAIL',
    isCompany: false,
    phone: '0977333444',
    email: 'giahann@example.com',
    priceListId: 1,
    isActive: true,
    createdAt: '2026-05-18T11:20:00.000Z',
    updatedAt: '2026-09-14T01:10:00.000Z',
  },
  {
    id: 8,
    code: 'KH0008',
    name: 'Công ty TNHH Hoàng Gia Food',
    customerType: 'WHOLESALE',
    isCompany: true,
    taxCode: '0317654321',
    phone: '02836667777',
    email: 'purchase@hoanggiafood.vn',
    priceListId: 2,
    isActive: false,
    createdAt: '2025-12-20T03:50:00.000Z',
    updatedAt: '2026-09-10T05:45:00.000Z',
  },
  {
    id: 9,
    code: 'KH0009',
    name: 'Võ Hoàng Nam',
    customerType: 'VIP',
    isCompany: false,
    phone: '0909888777',
    email: 'nam.vo@example.com',
    priceListId: 3,
    isActive: true,
    createdAt: '2026-06-12T08:00:00.000Z',
    updatedAt: '2026-09-09T04:15:00.000Z',
  },
  {
    id: 10,
    code: 'KH0010',
    name: 'Đặng Ngọc Lan',
    customerType: 'RETAIL',
    isCompany: false,
    phone: '0962444555',
    priceListId: 1,
    isActive: true,
    createdAt: '2026-07-01T02:10:00.000Z',
    updatedAt: '2026-09-08T09:30:00.000Z',
  },
  {
    id: 11,
    code: 'KH0011',
    name: 'Công ty Cổ phần Đại Nam',
    customerType: 'WHOLESALE',
    isCompany: true,
    taxCode: '3701122334',
    phone: '02743889999',
    email: 'sales@dainam.example',
    priceListId: 2,
    isActive: true,
    createdAt: '2025-09-25T06:30:00.000Z',
    updatedAt: '2026-09-06T03:05:00.000Z',
  },
  {
    id: 12,
    code: 'KH0012',
    name: 'Bùi Anh Tuấn',
    customerType: 'RETAIL',
    isCompany: false,
    phone: '0905222111',
    email: 'atuan@example.com',
    priceListId: 1,
    isActive: true,
    createdAt: '2026-07-22T05:45:00.000Z',
    updatedAt: '2026-09-03T10:20:00.000Z',
  },
];

const seedAddresses: CustomerAddress[] = [
  { id: 1, customerId: 1, receiverName: 'Nguyễn Minh Anh', phone: '0901234567', addressLine: '25 Nguyễn Huệ', ward: 'Phường Sài Gòn', district: 'Quận 1', province: 'TP. Hồ Chí Minh', isDefault: true },
  { id: 2, customerId: 2, receiverName: 'Phòng mua hàng', phone: '02838778899', addressLine: '128 Điện Biên Phủ', ward: 'Phường Gia Định', district: 'Quận Bình Thạnh', province: 'TP. Hồ Chí Minh', isDefault: true },
  { id: 3, customerId: 2, receiverName: 'Kho Minh Phát', phone: '0903332211', addressLine: 'Lô B2, KCN Tân Tạo', ward: 'Phường Tân Tạo', district: 'Quận Bình Tân', province: 'TP. Hồ Chí Minh', isDefault: false },
  { id: 4, customerId: 3, receiverName: 'Trần Thu Hà', phone: '0988765432', addressLine: '42 Trần Phú', ward: 'Phường Hải Châu', district: 'Quận Hải Châu', province: 'Đà Nẵng', isDefault: true },
  { id: 5, customerId: 4, receiverName: 'Bộ phận tiếp nhận', phone: '02439998888', addressLine: '18 Duy Tân', ward: 'Phường Cầu Giấy', district: 'Quận Cầu Giấy', province: 'Hà Nội', isDefault: true },
  { id: 6, customerId: 6, receiverName: 'Nguyễn Thảo', phone: '0938123456', addressLine: '75 Lê Lợi', ward: 'Phường Đông Ba', district: 'Quận Phú Xuân', province: 'Huế', isDefault: true },
];

const seedCreditAccounts: CreditAccount[] = [
  { id: 1, customerId: 2, creditLimit: 50_000_000, currentBalance: 12_500_000, version: 3, updatedAt: '2026-09-19T09:25:00.000Z' },
  { id: 2, customerId: 3, creditLimit: 30_000_000, currentBalance: 4_800_000, version: 2, updatedAt: '2026-09-18T07:45:00.000Z' },
  { id: 3, customerId: 4, creditLimit: 120_000_000, currentBalance: 96_000_000, version: 8, updatedAt: '2026-09-17T08:00:00.000Z' },
  { id: 4, customerId: 6, creditLimit: 20_000_000, currentBalance: 22_400_000, version: 5, updatedAt: '2026-09-16T02:35:00.000Z' },
  { id: 5, customerId: 11, creditLimit: 80_000_000, currentBalance: 0, version: 1, updatedAt: '2026-09-06T03:05:00.000Z' },
];

let customers = seedCustomers.map((customer) => ({ ...customer }));
let addresses = seedAddresses.map((address) => ({ ...address }));
let creditAccounts = seedCreditAccounts.map((account) => ({ ...account }));

function wait(duration = 280): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function normalize(value?: string): string {
  return value?.trim().toLocaleLowerCase('vi-VN') ?? '';
}

function trimOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function getPriceListName(priceListId?: number): string | undefined {
  return mockPriceLists.find((item) => item.value === priceListId)?.label;
}

function toListRecord(customer: CustomerEntity): AdminCustomerRecord {
  const account = creditAccounts.find((item) => item.customerId === customer.id);
  return {
    ...customer,
    priceListName: getPriceListName(customer.priceListId),
    creditLimit: account?.creditLimit,
    currentBalance: account?.currentBalance,
  };
}

function cleanValues(values: CustomerFormValues): CustomerFormValues {
  return {
    ...values,
    code: values.code.trim().toLocaleUpperCase('vi-VN'),
    name: values.name.trim(),
    taxCode: trimOptional(values.taxCode),
    phone: trimOptional(values.phone),
    email: trimOptional(values.email),
  };
}

function ensureCodeAvailable(code: string, currentId?: number): void {
  if (customers.some((item) => item.id !== currentId && normalize(item.code) === normalize(code))) {
    throw new Error('Mã khách hàng đã tồn tại. Hãy dùng mã khác.');
  }
}

async function list(
  filters: AdminCustomerFilters,
  page: number,
  pageSize: number,
): Promise<AdminCustomerListResult> {
  await wait();
  const keyword = normalize(filters.keyword);
  const filtered = customers.filter((customer) => {
    const matchesKeyword = !keyword || [customer.code, customer.name, customer.phone, customer.email]
      .some((value) => normalize(value).includes(keyword));
    const matchesType = filters.customerType === 'ALL' || customer.customerType === filters.customerType;
    const matchesSubject = filters.subjectType === 'ALL'
      || (filters.subjectType === 'COMPANY' ? customer.isCompany : !customer.isCompany);
    const matchesStatus = filters.status === 'ALL'
      || (filters.status === 'ACTIVE' ? customer.isActive : !customer.isActive);
    return matchesKeyword && matchesType && matchesSubject && matchesStatus;
  });
  const start = (page - 1) * pageSize;
  return {
    content: filtered.slice(start, start + pageSize).map(toListRecord),
    totalElements: filtered.length,
    page,
    size: pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}

async function getById(id: number): Promise<AdminCustomerDetail> {
  await wait(180);
  const customer = customers.find((item) => item.id === id);
  if (!customer) {
    throw new Error('Không tìm thấy khách hàng.');
  }
  return {
    ...toListRecord(customer),
    addresses: addresses
      .filter((item) => item.customerId === id)
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
      .map((item) => ({ ...item })),
    creditAccount: creditAccounts.find((item) => item.customerId === id),
  };
}

async function create(values: CustomerFormValues): Promise<AdminCustomerRecord> {
  await wait(360);
  const clean = cleanValues(values);
  ensureCodeAvailable(clean.code);
  const now = new Date().toISOString();
  const customer: CustomerEntity = {
    ...clean,
    id: Math.max(...customers.map((item) => item.id), 0) + 1,
    createdAt: now,
    updatedAt: now,
  };
  customers = [customer, ...customers];
  return toListRecord(customer);
}

async function update(id: number, values: CustomerFormValues): Promise<AdminCustomerRecord> {
  await wait(360);
  const current = customers.find((item) => item.id === id);
  if (!current) {
    throw new Error('Không tìm thấy khách hàng cần cập nhật.');
  }
  const clean = cleanValues(values);
  ensureCodeAvailable(clean.code, id);
  const updated: CustomerEntity = {
    ...current,
    ...clean,
    updatedAt: new Date().toISOString(),
  };
  customers = customers.map((item) => (item.id === id ? updated : item));
  return toListRecord(updated);
}

async function updateStatus(id: number, isActive: boolean): Promise<AdminCustomerRecord> {
  await wait(260);
  const current = customers.find((item) => item.id === id);
  if (!current) {
    throw new Error('Không tìm thấy khách hàng cần cập nhật trạng thái.');
  }
  const updated = { ...current, isActive, updatedAt: new Date().toISOString() };
  customers = customers.map((item) => (item.id === id ? updated : item));
  return toListRecord(updated);
}

async function createAddress(
  customerId: number,
  values: CustomerAddressFormValues,
): Promise<CustomerAddress> {
  await wait(260);
  if (!customers.some((item) => item.id === customerId)) {
    throw new Error('Không tìm thấy khách hàng.');
  }
  const customerAddresses = addresses.filter((item) => item.customerId === customerId);
  const isDefault = values.isDefault || customerAddresses.length === 0;
  if (isDefault) {
    addresses = addresses.map((item) => item.customerId === customerId ? { ...item, isDefault: false } : item);
  }
  const address: CustomerAddress = {
    ...values,
    id: Math.max(...addresses.map((item) => item.id), 0) + 1,
    customerId,
    receiverName: values.receiverName.trim(),
    phone: values.phone.trim(),
    addressLine: values.addressLine.trim(),
    province: values.province.trim(),
    ward: trimOptional(values.ward),
    district: trimOptional(values.district),
    isDefault,
  };
  addresses = [...addresses, address];
  return { ...address };
}

async function updateAddress(
  customerId: number,
  addressId: number,
  values: CustomerAddressFormValues,
): Promise<CustomerAddress> {
  await wait(260);
  const current = addresses.find((item) => item.id === addressId && item.customerId === customerId);
  if (!current) {
    throw new Error('Không tìm thấy địa chỉ cần cập nhật.');
  }
  if (values.isDefault) {
    addresses = addresses.map((item) => item.customerId === customerId ? { ...item, isDefault: false } : item);
  }
  const updated: CustomerAddress = {
    ...current,
    ...values,
    receiverName: values.receiverName.trim(),
    phone: values.phone.trim(),
    addressLine: values.addressLine.trim(),
    province: values.province.trim(),
    ward: trimOptional(values.ward),
    district: trimOptional(values.district),
    isDefault: values.isDefault || current.isDefault,
  };
  addresses = addresses.map((item) => item.id === addressId ? updated : item);
  return { ...updated };
}

async function setDefaultAddress(customerId: number, addressId: number): Promise<CustomerAddress> {
  await wait(220);
  const current = addresses.find((item) => item.id === addressId && item.customerId === customerId);
  if (!current) {
    throw new Error('Không tìm thấy địa chỉ.');
  }
  addresses = addresses.map((item) => item.customerId === customerId
    ? { ...item, isDefault: item.id === addressId }
    : item);
  return { ...current, isDefault: true };
}

async function removeAddress(customerId: number, addressId: number): Promise<void> {
  await wait(220);
  const current = addresses.find((item) => item.id === addressId && item.customerId === customerId);
  if (!current) {
    throw new Error('Không tìm thấy địa chỉ cần xóa.');
  }
  addresses = addresses.filter((item) => item.id !== addressId);
  if (current.isDefault) {
    const replacement = addresses.find((item) => item.customerId === customerId);
    if (replacement) {
      addresses = addresses.map((item) => item.id === replacement.id ? { ...item, isDefault: true } : item);
    }
  }
}

async function listPriceLists(): Promise<PriceListOption[]> {
  await wait(120);
  return mockPriceLists.map((item) => ({ ...item }));
}

export const mockCustomerRepository: CustomerRepository = {
  list,
  getById,
  create,
  update,
  updateStatus,
  createAddress,
  updateAddress,
  setDefaultAddress,
  removeAddress,
  listPriceLists,
};
