import type { CatalogProduct } from '../../mocks/commerce';

export interface StorefrontSpec {
  label: string;
  value: string;
}

export interface StorefrontReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface StorefrontProductView {
  gallery: Array<'front' | 'detail' | 'package'>;
  rating?: number;
  reviewCount: number;
  reviews: StorefrontReview[];
  specs: StorefrontSpec[];
  warrantyLabel: string;
  flashSale: boolean;
  oldPrice?: number;
}

const featuredProductIds = new Set([1, 2, 3, 4]);

export function getStorefrontProductView(product: CatalogProduct): StorefrontProductView {
  return {
    gallery: ['front', 'detail', 'package'],
    rating: undefined,
    reviewCount: 0,
    reviews: [],
    specs: [
      { label: 'Mã sản phẩm', value: product.sku },
      { label: 'Thương hiệu', value: product.brand ?? 'Đang cập nhật' },
      { label: 'Đơn vị bán', value: product.unit },
      { label: 'Tồn khả dụng', value: `${product.availableStock} ${product.unit.toLowerCase()}` },
      { label: 'Barcode', value: product.barcode ?? 'Đang cập nhật' },
    ],
    warrantyLabel: 'Chính sách đổi trả theo điều kiện bán hàng',
    flashSale: featuredProductIds.has(product.id),
    oldPrice: undefined,
  };
}

export function getStorefrontBrands(products: CatalogProduct[]) {
  return Array.from(new Set(products.map((product) => product.brand).filter(Boolean))) as string[];
}
