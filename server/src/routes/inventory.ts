import { Router } from 'express';
import { z } from 'zod';
import { asId, HttpError, ok } from '../http.js';
import { nextId, store } from '../store.js';

const router = Router();

router.get('/products', (_request, response) => ok(response, store.products.map((item) => ({ value: item.id, label: `${item.sku} · ${item.name}`, disabled: !item.isActive }))));

function balanceView(item: (typeof store.inventoryBalances)[number]) {
  const product = store.products.find((record) => record.id === item.productId);
  return {
    ...item,
    sku: product?.sku ?? `#${item.productId}`,
    product: product?.name ?? 'Sản phẩm không còn tồn tại',
    available: item.onHand - item.reserved,
    reorderPoint: product?.reorderPoint ?? 0,
  };
}

router.get('/balances', (_request, response) => ok(response, store.inventoryBalances.map(balanceView)));

router.put('/balances/:productId', (request, response) => {
  const productId = asId(String(request.params.productId));
  const values = z.object({ onHand: z.number().nonnegative(), reserved: z.number().nonnegative() })
    .refine((item) => item.reserved <= item.onHand, { message: 'Số lượng giữ chỗ không được vượt tồn thực tế.' })
    .parse(request.body);
  if (!store.products.some((item) => item.id === productId)) throw new HttpError(404, 'Không tìm thấy sản phẩm.');
  const now = new Date().toISOString();
  let record = store.inventoryBalances.find((item) => item.productId === productId);
  if (record) Object.assign(record, values, { updatedAt: now });
  else {
    record = { id: nextId(store.inventoryBalances), productId, ...values, updatedAt: now };
    store.inventoryBalances.push(record);
  }
  ok(response, balanceView(record));
});

router.get('/issues', (_request, response) => ok(response, store.stockIssues.map((item) => {
  const product = store.products.find((record) => record.id === item.productId);
  return { ...item, sku: product?.sku ?? `#${item.productId}`, product: product?.name ?? 'Sản phẩm không còn tồn tại' };
})));

router.post('/issues', (request, response) => {
  const values = z.object({ reference: z.string().trim().min(1), productId: z.number().int().positive(), quantity: z.number().positive() }).parse(request.body);
  const product = store.products.find((item) => item.id === values.productId);
  if (!product) throw new HttpError(404, 'Không tìm thấy sản phẩm.');
  const balance = store.inventoryBalances.find((item) => item.productId === values.productId);
  const available = balance ? balance.onHand - balance.reserved : 0;
  if (!balance || values.quantity > available) throw new HttpError(409, `Không thể xuất ${values.quantity}. Tồn khả dụng hiện tại là ${available}.`);
  balance.onHand -= values.quantity;
  balance.updatedAt = new Date().toISOString();
  const record = {
    id: nextId(store.stockIssues),
    code: `PXK-${String(nextId(store.stockIssues)).padStart(6, '0')}`,
    ...values,
    createdAt: new Date().toISOString(),
  };
  store.stockIssues.unshift(record);
  ok(response, { ...record, sku: product.sku, product: product.name, availableAfter: balance.onHand - balance.reserved }, 201);
});

export default router;
