import type { CustomerType } from '../../types/customer';
import type { Product } from '../../types/product';

export function getUnitPrice(product: Product, quantity: number, customerType: CustomerType) {
  if (customerType !== 'WHOLESALE') return product.retailPrice;

  const matchingTier = [...(product.priceTiers ?? [])]
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find((tier) => quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity));

  return matchingTier?.unitPrice ?? product.wholesalePrice ?? product.retailPrice;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}


