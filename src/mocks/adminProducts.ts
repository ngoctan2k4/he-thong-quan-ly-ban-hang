import type {
  AdminProductFilters,
  AdminProductListResult,
  AdminProductRecord,
  ProductCategoryOption,
  ProductFormValues,
} from '../features/products/adminProducts.model';
import type { ProductStatus } from '../types/product';

export const mockProductCategories: ProductCategoryOption[] = [
  { value: 101, label: 'Thời trang' },
  { value: 102, label: 'Điện tử' },
  { value: 103, label: 'Gia dụng' },
  { value: 104, label: 'Mỹ phẩm' },
  { value: 105, label: 'Thực phẩm' },
];

function createProductImage(label: string, tone: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="20" fill="${tone}"/>
      <rect x="28" y="28" width="104" height="104" rx="18" fill="white" fill-opacity="0.72"/>
      <text x="80" y="87" text-anchor="middle" font-family="Arial, sans-serif" font-size="25" font-weight="700" fill="#1f2937">${label}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const seedProducts: AdminProductRecord[] = [
  {
    id: 1,
    sku: 'TSH-BLK-M',
    name: 'Áo thun cotton cổ tròn',
    categoryId: 101,
    categoryName: 'Thời trang',
    brand: 'Mộc Wear',
    unit: 'Cái',
    retailPrice: 249000,
    wholesalePrice: 199000,
    availableStock: 84,
    status: 'ACTIVE',
    imageUrl: createProductImage('TS', '#dbeafe'),
    updatedAt: '2026-09-18T08:30:00.000Z',
  },
  {
    id: 2,
    sku: 'SHO-RUN-42',
    name: 'Giày chạy bộ đế nhẹ',
    categoryId: 101,
    categoryName: 'Thời trang',
    brand: 'Stride',
    unit: 'Đôi',
    retailPrice: 1290000,
    wholesalePrice: 1090000,
    availableStock: 18,
    status: 'ACTIVE',
    imageUrl: createProductImage('GR', '#e0e7ff'),
    updatedAt: '2026-09-17T10:15:00.000Z',
  },
  {
    id: 3,
    sku: 'EAR-BT-PRO',
    name: 'Tai nghe Bluetooth Pro',
    categoryId: 102,
    categoryName: 'Điện tử',
    brand: 'Sonic',
    unit: 'Bộ',
    retailPrice: 890000,
    wholesalePrice: 760000,
    availableStock: 0,
    status: 'OUT_OF_STOCK',
    imageUrl: createProductImage('BT', '#cffafe'),
    updatedAt: '2026-09-18T07:45:00.000Z',
  },
  {
    id: 4,
    sku: 'KET-GLS-18',
    name: 'Ấm đun thủy tinh 1,8 lít',
    categoryId: 103,
    categoryName: 'Gia dụng',
    brand: 'HomePlus',
    unit: 'Cái',
    retailPrice: 459000,
    availableStock: 32,
    status: 'ACTIVE',
    imageUrl: createProductImage('AD', '#dcfce7'),
    updatedAt: '2026-09-16T14:20:00.000Z',
  },
  {
    id: 5,
    sku: 'SER-VIT-C30',
    name: 'Tinh chất Vitamin C 30 ml',
    categoryId: 104,
    categoryName: 'Mỹ phẩm',
    brand: 'Lá Lab',
    unit: 'Chai',
    retailPrice: 369000,
    wholesalePrice: 299000,
    availableStock: 12,
    status: 'ACTIVE',
    imageUrl: createProductImage('VC', '#fef3c7'),
    updatedAt: '2026-09-15T09:00:00.000Z',
  },
  {
    id: 6,
    sku: 'COF-ARA-500',
    name: 'Cà phê Arabica rang vừa 500 g',
    categoryId: 105,
    categoryName: 'Thực phẩm',
    brand: 'Đồi Gió',
    unit: 'Gói',
    retailPrice: 285000,
    wholesalePrice: 238000,
    availableStock: 45,
    status: 'ACTIVE',
    imageUrl: createProductImage('CF', '#ffedd5'),
    updatedAt: '2026-09-14T16:40:00.000Z',
  },
  {
    id: 7,
    sku: 'PAN-NST-24',
    name: 'Chảo chống dính 24 cm',
    categoryId: 103,
    categoryName: 'Gia dụng',
    brand: 'Bếp Việt',
    unit: 'Cái',
    retailPrice: 395000,
    availableStock: 27,
    status: 'ACTIVE',
    imageUrl: createProductImage('CH', '#f1f5f9'),
    updatedAt: '2026-09-13T11:25:00.000Z',
  },
  {
    id: 8,
    sku: 'PWR-20K-BLK',
    name: 'Pin sạc dự phòng 20.000 mAh',
    categoryId: 102,
    categoryName: 'Điện tử',
    brand: 'Volt',
    unit: 'Cái',
    retailPrice: 749000,
    wholesalePrice: 665000,
    availableStock: 9,
    status: 'ACTIVE',
    imageUrl: createProductImage('20K', '#e2e8f0'),
    updatedAt: '2026-09-12T13:10:00.000Z',
  },
  {
    id: 9,
    sku: 'JKT-DNM-L',
    name: 'Áo khoác denim dáng rộng',
    categoryId: 101,
    categoryName: 'Thời trang',
    brand: 'Mộc Wear',
    unit: 'Cái',
    retailPrice: 720000,
    availableStock: 0,
    status: 'INACTIVE',
    imageUrl: createProductImage('AK', '#dbeafe'),
    updatedAt: '2026-09-11T15:55:00.000Z',
  },
  {
    id: 10,
    sku: 'SUN-SPF50-50',
    name: 'Kem chống nắng SPF50 50 ml',
    categoryId: 104,
    categoryName: 'Mỹ phẩm',
    brand: 'Lá Lab',
    unit: 'Tuýp',
    retailPrice: 315000,
    availableStock: 41,
    status: 'ACTIVE',
    imageUrl: createProductImage('SPF', '#fce7f3'),
    updatedAt: '2026-09-10T08:35:00.000Z',
  },
  {
    id: 11,
    sku: 'RICE-ST25-5K',
    name: 'Gạo thơm ST25 túi 5 kg',
    categoryId: 105,
    categoryName: 'Thực phẩm',
    brand: 'Mùa Vàng',
    unit: 'Túi',
    retailPrice: 198000,
    wholesalePrice: 175000,
    availableStock: 63,
    status: 'ACTIVE',
    imageUrl: createProductImage('ST', '#fef9c3'),
    updatedAt: '2026-09-09T10:05:00.000Z',
  },
  {
    id: 12,
    sku: 'MSE-WLS-BLK',
    name: 'Chuột không dây công thái học',
    categoryId: 102,
    categoryName: 'Điện tử',
    brand: 'Nexa',
    unit: 'Cái',
    retailPrice: 629000,
    availableStock: 21,
    status: 'ACTIVE',
    imageUrl: createProductImage('MS', '#e0f2fe'),
    updatedAt: '2026-09-08T12:45:00.000Z',
  },
  {
    id: 13,
    sku: 'BOT-THER-750',
    name: 'Bình giữ nhiệt inox 750 ml',
    categoryId: 103,
    categoryName: 'Gia dụng',
    brand: 'Everyday',
    unit: 'Bình',
    retailPrice: 349000,
    availableStock: 37,
    status: 'ACTIVE',
    imageUrl: createProductImage('BG', '#d1fae5'),
    updatedAt: '2026-09-07T09:20:00.000Z',
  },
  {
    id: 14,
    sku: 'TON-CALM-150',
    name: 'Nước cân bằng dịu nhẹ 150 ml',
    categoryId: 104,
    categoryName: 'Mỹ phẩm',
    brand: 'An Nhiên',
    unit: 'Chai',
    retailPrice: 279000,
    availableStock: 0,
    status: 'OUT_OF_STOCK',
    imageUrl: createProductImage('CB', '#fce7f3'),
    updatedAt: '2026-09-06T17:05:00.000Z',
  },
  {
    id: 15,
    sku: 'TEE-WHT-S',
    name: 'Áo thun trắng form regular',
    categoryId: 101,
    categoryName: 'Thời trang',
    brand: 'Basic Lab',
    unit: 'Cái',
    retailPrice: 219000,
    availableStock: 54,
    status: 'INACTIVE',
    imageUrl: createProductImage('AT', '#f8fafc'),
    updatedAt: '2026-09-05T11:50:00.000Z',
  },
  {
    id: 16,
    sku: 'TEA-LOT-200',
    name: 'Trà ô long túi 200 g',
    categoryId: 105,
    categoryName: 'Thực phẩm',
    brand: 'Sơn Trà',
    unit: 'Gói',
    retailPrice: 168000,
    availableStock: 26,
    status: 'ACTIVE',
    imageUrl: createProductImage('OL', '#ecfccb'),
    updatedAt: '2026-09-04T14:30:00.000Z',
  },
  {
    id: 17,
    sku: 'LMP-DESK-LED',
    name: 'Đèn bàn LED chống chói',
    categoryId: 103,
    categoryName: 'Gia dụng',
    brand: 'Lumo',
    unit: 'Cái',
    retailPrice: 589000,
    availableStock: 14,
    status: 'ACTIVE',
    imageUrl: createProductImage('LED', '#fef3c7'),
    updatedAt: '2026-09-03T08:15:00.000Z',
  },
  {
    id: 18,
    sku: 'KEY-MEC-87',
    name: 'Bàn phím cơ 87 phím',
    categoryId: 102,
    categoryName: 'Điện tử',
    brand: 'Nexa',
    unit: 'Cái',
    retailPrice: 1390000,
    wholesalePrice: 1210000,
    availableStock: 7,
    status: 'ACTIVE',
    imageUrl: createProductImage('87', '#ede9fe'),
    updatedAt: '2026-09-02T16:20:00.000Z',
  },
];

let products = seedProducts.map((product) => ({ ...product }));

function wait(duration = 360): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function findCategoryName(categoryId: number): string {
  return mockProductCategories.find((category) => category.value === categoryId)?.label ?? 'Chưa phân loại';
}

export async function listMockAdminProducts(
  filters: AdminProductFilters,
  page: number,
  size: number,
): Promise<AdminProductListResult> {
  await wait();
  const normalizedKeyword = filters.keyword.trim().toLocaleLowerCase('vi-VN');

  const filteredProducts = products.filter((product) => {
    const matchesKeyword =
      normalizedKeyword.length === 0 ||
      product.name.toLocaleLowerCase('vi-VN').includes(normalizedKeyword) ||
      product.sku.toLocaleLowerCase('vi-VN').includes(normalizedKeyword);
    const matchesCategory = filters.categoryId === undefined || product.categoryId === filters.categoryId;
    const matchesStatus = filters.status === 'ALL' || product.status === filters.status;
    const matchesStock =
      filters.stock === 'ALL' ||
      (filters.stock === 'IN_STOCK' && product.availableStock > 0) ||
      (filters.stock === 'OUT_OF_STOCK' && product.availableStock === 0);

    return matchesKeyword && matchesCategory && matchesStatus && matchesStock;
  });

  const start = (page - 1) * size;
  const content = filteredProducts.slice(start, start + size).map((product) => ({ ...product }));

  return {
    content,
    totalElements: filteredProducts.length,
    page,
    size,
    totalPages: Math.ceil(filteredProducts.length / size),
  };
}

export async function createMockAdminProduct(values: ProductFormValues): Promise<AdminProductRecord> {
  await wait(420);
  const nextId = Math.max(...products.map((product) => product.id), 0) + 1;
  const nextStatus: ProductStatus = values.availableStock === 0 ? 'OUT_OF_STOCK' : values.status;
  const product: AdminProductRecord = {
    ...values,
    id: nextId,
    status: nextStatus,
    categoryName: findCategoryName(values.categoryId),
    updatedAt: new Date().toISOString(),
  };

  products = [product, ...products];
  return { ...product };
}

export async function updateMockAdminProduct(
  id: number,
  values: ProductFormValues,
): Promise<AdminProductRecord> {
  await wait(420);
  const existingProduct = products.find((product) => product.id === id);
  if (!existingProduct) {
    throw new Error('Không tìm thấy sản phẩm cần cập nhật.');
  }

  const nextStatus: ProductStatus = values.availableStock === 0 ? 'OUT_OF_STOCK' : values.status;
  const updatedProduct: AdminProductRecord = {
    ...existingProduct,
    ...values,
    status: nextStatus,
    categoryName: findCategoryName(values.categoryId),
    updatedAt: new Date().toISOString(),
  };

  products = products.map((product) => (product.id === id ? updatedProduct : product));
  return { ...updatedProduct };
}

export async function updateMockAdminProductStatus(
  id: number,
  status: Exclude<ProductStatus, 'OUT_OF_STOCK'>,
): Promise<AdminProductRecord> {
  await wait(300);
  const existingProduct = products.find((product) => product.id === id);
  if (!existingProduct) {
    throw new Error('Không tìm thấy sản phẩm cần cập nhật.');
  }
  if (status === 'ACTIVE' && existingProduct.availableStock === 0) {
    throw new Error('Sản phẩm đã hết hàng. Hãy cập nhật tồn kho trước khi kích hoạt.');
  }

  const updatedProduct = {
    ...existingProduct,
    status,
    updatedAt: new Date().toISOString(),
  };
  products = products.map((product) => (product.id === id ? updatedProduct : product));
  return { ...updatedProduct };
}
