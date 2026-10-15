import 'dotenv/config';
import { closeDatabase } from './database.js';
import { initializeStore, persistStore, store } from './store.js';

const databaseUrl = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/sales_management';
await initializeStore(databaseUrl);

if (store.products.length > 0 || store.categories.length > 0 || store.units.length > 0) {
  console.log('Database đã có dữ liệu, bỏ qua seed để bảo toàn dữ liệu hiện tại.');
  await closeDatabase();
} else {
  const now = new Date().toISOString();
  store.categories.push(
    { id: 1, code: 'DIEN-TU', name: 'Điện tử', description: 'Sản phẩm điện tử và công nghệ', isActive: true, createdAt: now, updatedAt: now },
    { id: 2, code: 'DIEN-THOAI', name: 'Điện thoại', parentId: 1, isActive: true, createdAt: now, updatedAt: now },
  );
  store.units.push(
    { id: 1, code: 'CAI', name: 'Cái', isActive: true },
    { id: 2, code: 'THUNG', name: 'Thùng', isActive: true },
  );
  store.suppliers.push({ id: 1, code: 'NCC-DEMO', name: 'Nhà cung cấp mẫu', phone: '0900000000', avgLeadTimeDays: 3, maxLeadTimeDays: 7, isActive: true, createdAt: now, updatedAt: now });
  store.products.push({ id: 1, code: 'SP-DEMO', sku: 'SKU-DEMO-01', barcode: '8930000000001', name: 'Sản phẩm mẫu', categoryId: 2, brand: 'Demo', baseUnitId: 1, retailPrice: 120000, wholesalePrice: 100000, moq: 10, minStock: 5, maxStock: 100, safetyStock: 10, reorderPoint: 15, status: 'ACTIVE', isActive: true, defaultSupplierId: 1, createdAt: now, updatedAt: now });
  store.conversions.push({ id: 1, productId: 1, unitId: 2, factor: 12 });
  store.supplierProducts.push({ id: 1, supplierId: 1, productId: 1, lastPurchasePrice: 80000, leadTimeDays: 3 });
  store.priceLists.push({ id: 1, code: 'BG-SI-DEMO', name: 'Bảng giá sỉ mẫu', customerType: 'WHOLESALE', validFrom: now.slice(0, 10), isActive: true, createdAt: now });
  store.priceTiers.push({ id: 1, priceListId: 1, productId: 1, minQty: 10, maxQty: 49, unitPrice: 98000 }, { id: 2, priceListId: 1, productId: 1, minQty: 50, unitPrice: 95000 });
  store.inventoryBalances.push({ id: 1, productId: 1, onHand: 50, reserved: 5, updatedAt: now });
  await persistStore();
  await closeDatabase();
  console.log('Đã tạo dữ liệu mẫu trong PostgreSQL.');
}
