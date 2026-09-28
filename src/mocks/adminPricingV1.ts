import {
  getPriceListEffectiveness,
  PriceListFilters,
  PriceListFormValues,
  PriceTierFormValues,
  PriceTierView,
} from '../features/pricing/pricing.model';
import type { PricingRepository } from '../features/pricing/pricing.repository';
import type { AdminProductRecord } from '../features/products/adminProducts.model';
import type { PriceList, PriceListCustomerType, PriceTier } from '../types/catalog';
import { mockAdminProductsRepository } from './adminProducts';

const createdAt = '2026-01-02T03:00:00.000Z';

let priceLists: PriceList[] = [
  { id: 1, code: 'BG-LE-2025', name: 'Bảng giá bán lẻ 2025', customerType: 'RETAIL', validFrom: '2025-01-01', validTo: '2025-12-31', isActive: true, createdAt },
  { id: 2, code: 'BG-SI-2026', name: 'Bảng giá sỉ 2026', customerType: 'WHOLESALE', validFrom: '2026-01-01', validTo: '2026-12-31', isActive: true, createdAt },
  { id: 3, code: 'BG-VIP-2027', name: 'Bảng giá khách VIP 2027', customerType: 'VIP', validFrom: '2027-01-01', isActive: true, createdAt },
];

let tiers: PriceTier[] = [
  { id: 1, priceListId: 2, productId: 1, minQty: 1, maxQty: 23, unitPrice: 11000 },
  { id: 2, priceListId: 2, productId: 1, minQty: 24, maxQty: 99, unitPrice: 10500 },
  { id: 3, priceListId: 2, productId: 1, minQty: 100, unitPrice: 10000 },
  { id: 4, priceListId: 2, productId: 2, minQty: 1, maxQty: 23, unitPrice: 6500 },
  { id: 5, priceListId: 2, productId: 2, minQty: 24, unitPrice: 5800 },
  { id: 6, priceListId: 1, productId: 9, minQty: 1, unitPrice: 178000 },
  { id: 7, priceListId: 3, productId: 8, minQty: 1, maxQty: 9, unitPrice: 49000 },
  { id: 8, priceListId: 3, productId: 8, minQty: 10, unitPrice: 45000 },
];

function wait(duration = 240): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function nextId(items: Array<{ id: number }>) {
  return Math.max(...items.map((item) => item.id), 0) + 1;
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase('vi-VN');
}

function validatePriceList(values: PriceListFormValues) {
  const customerTypes: PriceListCustomerType[] = ['RETAIL', 'WHOLESALE', 'VIP'];
  if (!values.code.trim()) throw new Error('Mã bảng giá là bắt buộc.');
  if (!values.name.trim()) throw new Error('Tên bảng giá là bắt buộc.');
  if (!customerTypes.includes(values.customerType)) throw new Error('Loại khách hàng không hợp lệ.');
  if (!values.validFrom) throw new Error('Ngày bắt đầu hiệu lực là bắt buộc.');
  if (values.validTo && values.validTo < values.validFrom) {
    throw new Error('Ngày hết hiệu lực không được trước ngày bắt đầu.');
  }
}

function validateTier(values: PriceTierFormValues) {
  if (values.minQty <= 0) throw new Error('Số lượng từ phải lớn hơn 0.');
  if (values.maxQty !== undefined && values.maxQty < values.minQty) {
    throw new Error('Số lượng đến không được nhỏ hơn số lượng từ.');
  }
  if (values.unitPrice < 0) throw new Error('Đơn giá không được âm.');
}

function assertTierDoesNotOverlap(priceListId: number, values: PriceTierFormValues, ignoredId?: number) {
  const nextMax = values.maxQty ?? Number.POSITIVE_INFINITY;
  const overlap = tiers.find((item) => {
    if (item.id === ignoredId || item.priceListId !== priceListId || item.productId !== values.productId) return false;
    const existingMax = item.maxQty ?? Number.POSITIVE_INFINITY;
    return values.minQty <= existingMax && item.minQty <= nextMax;
  });
  if (overlap) {
    const existingRange = `${overlap.minQty}–${overlap.maxQty ?? '∞'}`;
    throw new Error(`Khoảng số lượng bị chồng lấn với bậc ${existingRange} của cùng sản phẩm.`);
  }
}

async function getProducts(): Promise<AdminProductRecord[]> {
  const result = await mockAdminProductsRepository.list({ keyword: '', status: 'ALL' }, 1, 10_000);
  return result.content;
}

function toTierView(tier: PriceTier, products: AdminProductRecord[]): PriceTierView {
  const product = products.find((item) => item.id === tier.productId);
  return {
    ...tier,
    productCode: product?.code ?? `#${tier.productId}`,
    productName: product?.name ?? 'Sản phẩm không còn tồn tại',
    productIsActive: product?.isActive ?? false,
  };
}

async function validateTierProduct(values: PriceTierFormValues, current?: PriceTier) {
  const products = await getProducts();
  const product = products.find((item) => item.id === values.productId);
  if (!product) throw new Error('Sản phẩm không tồn tại.');
  if (!product.isActive && current?.productId !== product.id) {
    throw new Error('Không thể chọn sản phẩm đã ngừng hoạt động cho bậc giá mới.');
  }
}

export const mockPricingRepository: PricingRepository = {
  async listPriceLists(filters: PriceListFilters, page: number, pageSize: number) {
    await wait();
    const keyword = normalize(filters.keyword);
    const visible = priceLists.filter((item) => {
      const effectiveness = getPriceListEffectiveness(item);
      const matchesKeyword = !keyword || [item.code, item.name].some((value) => normalize(value).includes(keyword));
      const matchesCustomerType = filters.customerType === undefined || item.customerType === filters.customerType;
      const matchesEffectiveness = filters.effectiveness === 'ALL' || effectiveness === filters.effectiveness;
      return matchesKeyword && matchesCustomerType && matchesEffectiveness;
    });
    const start = (page - 1) * pageSize;
    return {
      content: visible.slice(start, start + pageSize).map((item) => ({
        ...item,
        effectiveness: getPriceListEffectiveness(item),
        productCount: new Set(tiers.filter((tier) => tier.priceListId === item.id).map((tier) => tier.productId)).size,
      })),
      totalElements: visible.length,
      page,
      size: pageSize,
      totalPages: Math.ceil(visible.length / pageSize),
    };
  },

  async getPriceList(id) {
    await wait();
    const item = priceLists.find((record) => record.id === id);
    if (!item) throw new Error('Không tìm thấy bảng giá.');
    const products = await getProducts();
    return {
      ...item,
      tiers: tiers
        .filter((tier) => tier.priceListId === id)
        .map((tier) => toTierView(tier, products))
        .sort((left, right) => left.productName.localeCompare(right.productName, 'vi') || left.minQty - right.minQty),
    };
  },

  async createPriceList(values) {
    await wait();
    validatePriceList(values);
    const code = values.code.trim();
    const name = values.name.trim();
    if (priceLists.some((item) => normalize(item.code) === normalize(code))) throw new Error('Mã bảng giá đã tồn tại.');
    const record = { id: nextId(priceLists), ...values, code, name, validTo: values.validTo || undefined, createdAt: new Date().toISOString() };
    priceLists = [record, ...priceLists];
    return { ...record };
  },

  async updatePriceList(id, values) {
    await wait();
    validatePriceList(values);
    const code = values.code.trim();
    const name = values.name.trim();
    if (priceLists.some((item) => item.id !== id && normalize(item.code) === normalize(code))) throw new Error('Mã bảng giá đã tồn tại.');
    const current = priceLists.find((item) => item.id === id);
    if (!current) throw new Error('Không tìm thấy bảng giá.');
    const record = { ...current, ...values, code, name, validTo: values.validTo || undefined };
    priceLists = priceLists.map((item) => item.id === id ? record : item);
    return { ...record };
  },

  async updatePriceListStatus(id, isActive) {
    await wait();
    const current = priceLists.find((item) => item.id === id);
    if (!current) throw new Error('Không tìm thấy bảng giá.');
    const record = { ...current, isActive };
    priceLists = priceLists.map((item) => item.id === id ? record : item);
    return { ...record };
  },

  async createTier(priceListId, values) {
    await wait();
    if (!priceLists.some((item) => item.id === priceListId)) throw new Error('Bảng giá không tồn tại.');
    validateTier(values);
    await validateTierProduct(values);
    if (tiers.some((item) => item.priceListId === priceListId && item.productId === values.productId && item.minQty === values.minQty)) {
      throw new Error('Bậc giá cùng sản phẩm và số lượng từ đã tồn tại.');
    }
    assertTierDoesNotOverlap(priceListId, values);
    const tier = { id: nextId(tiers), priceListId, ...values, maxQty: values.maxQty ?? undefined };
    tiers = [...tiers, tier];
    return { tier: { ...tier } };
  },

  async updateTier(id, values) {
    await wait();
    validateTier(values);
    const current = tiers.find((item) => item.id === id);
    if (!current) throw new Error('Không tìm thấy bậc giá.');
    await validateTierProduct(values, current);
    if (tiers.some((item) => item.id !== id && item.priceListId === current.priceListId && item.productId === values.productId && item.minQty === values.minQty)) {
      throw new Error('Bậc giá cùng sản phẩm và số lượng từ đã tồn tại.');
    }
    assertTierDoesNotOverlap(current.priceListId, values, id);
    const tier = { ...current, ...values, maxQty: values.maxQty ?? undefined };
    tiers = tiers.map((item) => item.id === id ? tier : item);
    return { tier: { ...tier } };
  },

  async deleteTier(id) {
    await wait();
    if (!tiers.some((item) => item.id === id)) throw new Error('Không tìm thấy bậc giá.');
    tiers = tiers.filter((item) => item.id !== id);
  },

  async listTiers(priceListId) {
    await wait();
    const products = await getProducts();
    return tiers.filter((item) => item.priceListId === priceListId).map((item) => toTierView(item, products));
  },

  async listProductOptions() {
    const products = await getProducts();
    return products.map((product) => ({
      value: product.id,
      label: `${product.code} - ${product.name}`,
      disabled: !product.isActive,
    }));
  },
};
