import { loadStore, openDatabase, saveStore, type DatabasePool } from './database.js';

export type ProductStatus = 'ACTIVE' | 'DISCONTINUED' | 'HIDDEN';
export type CustomerType = 'RETAIL' | 'WHOLESALE' | 'VIP';

export interface Category { id: number; code: string; name: string; parentId?: number; description?: string; isActive: boolean; createdAt: string; updatedAt: string }
export interface Unit { id: number; code: string; name: string; isActive: boolean }
export interface Product { id: number; code: string; sku: string; barcode?: string; name: string; categoryId: number; brand?: string; baseUnitId: number; retailPrice: number; wholesalePrice: number; moq: number; minStock: number; maxStock?: number; safetyStock: number; reorderPoint: number; status: ProductStatus; isActive: boolean; defaultSupplierId?: number; createdAt: string; updatedAt: string }
export interface Conversion { id: number; productId: number; unitId: number; factor: number }
export interface PriceList { id: number; code: string; name: string; customerType: CustomerType; validFrom: string; validTo?: string; isActive: boolean; createdAt: string }
export interface PriceTier { id: number; priceListId: number; productId: number; minQty: number; maxQty?: number; unitPrice: number }
export interface Supplier { id: number; code: string; name: string; taxCode?: string; phone?: string; email?: string; address?: string; avgLeadTimeDays: number; maxLeadTimeDays: number; isActive: boolean; createdAt: string; updatedAt: string }
export interface SupplierProduct { id: number; supplierId: number; productId: number; lastPurchasePrice: number; leadTimeDays: number }
export interface InventoryBalance { id: number; productId: number; onHand: number; reserved: number; updatedAt: string }
export interface StockIssue { id: number; code: string; reference: string; productId: number; quantity: number; createdAt: string }

export interface CatalogStore {
  categories: Category[];
  units: Unit[];
  products: Product[];
  conversions: Conversion[];
  priceLists: PriceList[];
  priceTiers: PriceTier[];
  suppliers: Supplier[];
  supplierProducts: SupplierProduct[];
  inventoryBalances: InventoryBalance[];
  stockIssues: StockIssue[];
}

export const store: CatalogStore = {
  categories: [],
  units: [],
  products: [],
  conversions: [],
  priceLists: [],
  priceTiers: [],
  suppliers: [],
  supplierProducts: [],
  inventoryBalances: [],
  stockIssues: [],
};

let persistenceQueue = Promise.resolve();

export async function initializeStore(databaseUrl: string, pool?: DatabasePool): Promise<void> {
  await openDatabase(databaseUrl, pool);
  await loadStore(store);
}

export function persistStore(): Promise<void> {
  const snapshot = structuredClone(store);
  const operation = persistenceQueue.then(() => saveStore(snapshot));
  persistenceQueue = operation.catch(() => undefined);
  return operation;
}

export async function resetStore(): Promise<void> {
  for (const key of Object.keys(store) as Array<keyof CatalogStore>) store[key].length = 0;
  await persistStore();
}

export function nextId(items: Array<{ id: number }>): number {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}

