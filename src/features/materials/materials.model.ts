export const materialGroups = [
  'Thành phẩm',
  'Nguyên vật liệu',
  'Công cụ dụng cụ',
  'Hàng hóa',
  'Bao bì',
] as const;

export const materialTypes = [
  'Hàng hóa',
  'Nguyên vật liệu',
  'Thành phẩm',
  'Công cụ dụng cụ',
] as const;

export const materialUnits = [
  'Cái',
  'Hộp',
  'Kg',
  'Mét',
  'Bộ',
  'Chai',
  'Gói',
  'Cuộn',
  'Thùng',
  'Túi',
  'Đôi',
  'Lon',
] as const;

export type MaterialGroup = (typeof materialGroups)[number];
export type MaterialType = (typeof materialTypes)[number];
export type MaterialUnit = (typeof materialUnits)[number];
export type MaterialStatus = 'ACTIVE' | 'INACTIVE';
export type MaterialStatusFilter = 'ALL' | MaterialStatus;
export type MaterialViewMode = 'list' | 'grid';
export type MaterialFormMode = 'create' | 'edit';
export type MaterialNature = 'MATERIAL_GOODS';
export type MaterialSupplySource = 'PURCHASE' | 'IN_HOUSE' | 'BOTH';
export type MaterialQrRule = 'ITEM' | 'ITEM_BATCH' | 'ITEM_SERIAL' | 'BARCODE' | 'AUTO';
export type MaterialWarrantyUnit = 'DAY' | 'MONTH' | 'YEAR';

export interface MaterialFormValues {
  code: string;
  name: string;
  group: MaterialGroup;
  unit: MaterialUnit;
  type: MaterialType;
  status: MaterialStatus;
  sku?: string;
  barcode?: string;
  description?: string;
  nature?: MaterialNature;
  weightKg?: number;
  industry?: string;
  category?: string;
  grossWeight?: number;
  netWeight?: number;
  brand?: string;
  imageUrl?: string;
  supplySource?: MaterialSupplySource;
  allowSale: boolean;
  visibleOnSalesChannel: boolean;
  requireImeiOnOutbound: boolean;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  qrRule?: MaterialQrRule;
  referenceCode?: string;
  minimumStock?: number;
  quantityFormula?: string;
  defaultWarehouse?: string;
  inventoryAccount?: string;
  revenueAccount?: string;
  discountAccount?: string;
  priceReductionAccount?: string;
  salesReturnAccount?: string;
  expenseAccount?: string;
  purchaseDiscountRate?: number;
  defaultUnit?: MaterialUnit;
  allowProcessingLabel: boolean;
  fixedPurchasePrice?: number;
  latestPurchasePrice?: number;
  sellingPrice?: number;
  internalPrice?: number;
  minimumSellingPrice?: number;
  salePriceIncludesTax: boolean;
  vatRate?: number;
  importTaxRate?: number;
  exportTaxRate?: number;
  specialConsumptionTaxGroup?: string;
  origin?: string;
  warrantyDuration?: number;
  warrantyUnit?: MaterialWarrantyUnit;
  declarationNumber?: string;
  purchaseNote?: string;
  salesNote?: string;
}

export interface AdminMaterialRecord extends MaterialFormValues {
  id: string;
  updatedAt: string;
}

export interface AdminMaterialFilters {
  keyword: string;
  code: string;
  name: string;
  group?: MaterialGroup;
  type?: MaterialType;
  status: MaterialStatusFilter;
}

export interface AdminMaterialListResult {
  content: AdminMaterialRecord[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export const initialMaterialFormValues: MaterialFormValues = {
  code: '',
  name: '',
  nature: 'MATERIAL_GOODS',
  unit: 'Cái',
  weightKg: 0,
  industry: undefined,
  category: undefined,
  group: 'Hàng hóa',
  type: 'Hàng hóa',
  grossWeight: 0,
  netWeight: 0,
  brand: '',
  imageUrl: '',
  supplySource: 'PURCHASE',
  sku: '',
  barcode: '',
  description: '',
  status: 'ACTIVE',
  allowSale: true,
  visibleOnSalesChannel: true,
  requireImeiOnOutbound: false,
  lengthCm: 0,
  widthCm: 0,
  heightCm: 0,
  qrRule: 'ITEM_BATCH',
  referenceCode: '',
  minimumStock: 0,
  quantityFormula: '',
  defaultWarehouse: '',
  inventoryAccount: '',
  revenueAccount: '',
  discountAccount: '',
  priceReductionAccount: '',
  salesReturnAccount: '',
  expenseAccount: '',
  purchaseDiscountRate: 0,
  defaultUnit: 'Cái',
  allowProcessingLabel: false,
  fixedPurchasePrice: 0,
  latestPurchasePrice: 0,
  sellingPrice: 0,
  internalPrice: 0,
  minimumSellingPrice: 0,
  salePriceIncludesTax: false,
  vatRate: 0,
  importTaxRate: 0,
  exportTaxRate: 0,
  specialConsumptionTaxGroup: '',
  origin: '',
  warrantyDuration: undefined,
  warrantyUnit: 'MONTH',
  declarationNumber: '',
  purchaseNote: '',
  salesNote: '',
};

export const initialAdminMaterialFilters: AdminMaterialFilters = {
  keyword: '',
  code: '',
  name: '',
  group: undefined,
  type: undefined,
  status: 'ALL',
};
