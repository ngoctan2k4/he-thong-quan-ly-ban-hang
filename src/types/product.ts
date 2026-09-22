export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

export interface PriceTier {
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
}

export interface Product {
  id: number;
  sku: string;
  barcode?: string;
  name: string;
  categoryId: number;
  brand?: string;
  unit: string;
  retailPrice: number;
  wholesalePrice?: number;
  moq?: number;
  priceTiers?: PriceTier[];
  availableStock: number;
  status: ProductStatus;
  imageUrl?: string;
}
