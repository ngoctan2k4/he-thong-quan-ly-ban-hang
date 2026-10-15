import { Router } from 'express';
import { z } from 'zod';
import { asId, HttpError, normalize, ok, optionalText, pageParams, paginate } from '../http.js';
import { nextId, store } from '../store.js';

const router = Router();
const statusSchema = z.object({ isActive: z.boolean() });
const categorySchema = z.object({
  code: z.string().trim().min(1, 'Mã nhóm hàng là bắt buộc.').max(32),
  name: z.string().trim().min(1, 'Tên nhóm hàng là bắt buộc.').max(160),
  parentId: z.number().int().positive().optional(),
  description: z.string().max(500).optional(),
  isActive: z.boolean(),
});
const unitSchema = z.object({
  code: z.string().trim().min(1, 'Mã đơn vị là bắt buộc.').max(32),
  name: z.string().trim().min(1, 'Tên đơn vị là bắt buộc.').max(100),
  isActive: z.boolean(),
});

function ensureUniqueCode(items: Array<{ id: number; code: string }>, code: string, ignoredId?: number) {
  if (items.some((item) => item.id !== ignoredId && normalize(item.code) === normalize(code))) {
    throw new HttpError(409, 'Mã đã tồn tại.');
  }
}

function ensureValidParent(id: number, parentId?: number) {
  let currentId = parentId;
  const visited = new Set<number>();
  while (currentId) {
    if (currentId === id) throw new HttpError(400, 'Nhóm hàng cha tạo thành vòng lặp phân cấp.');
    if (visited.has(currentId)) throw new HttpError(400, 'Cây nhóm hàng hiện tại không hợp lệ.');
    visited.add(currentId);
    currentId = store.categories.find((item) => item.id === currentId)?.parentId;
  }
}

router.get('/categories', (request, response) => {
  const { page, size } = pageParams(request);
  const keyword = normalize(request.query.keyword);
  const status = String(request.query.status ?? 'ALL');
  const filtered = store.categories.filter((item) => {
    const matchesKeyword = !keyword || [item.code, item.name, item.description].some((value) => normalize(value).includes(keyword));
    const matchesStatus = status === 'ALL' || item.isActive === (status === 'ACTIVE');
    return matchesKeyword && matchesStatus;
  });
  const content = filtered.slice((page - 1) * size, page * size).map((item) => ({
    ...item,
    parentName: store.categories.find((parent) => parent.id === item.parentId)?.name,
  }));
  ok(response, { content, page, size, totalElements: filtered.length, totalPages: Math.ceil(filtered.length / size), categoryCount: store.categories.length });
});

router.post('/categories', (request, response) => {
  const values = categorySchema.parse(request.body);
  ensureUniqueCode(store.categories, values.code);
  if (values.parentId && !store.categories.some((item) => item.id === values.parentId)) throw new HttpError(400, 'Nhóm hàng cha không tồn tại.');
  const now = new Date().toISOString();
  const record = { id: nextId(store.categories), ...values, description: optionalText(values.description), createdAt: now, updatedAt: now };
  store.categories.unshift(record);
  ok(response, record, 201);
});

router.put('/categories/:id', (request, response) => {
  const id = asId(String(request.params.id));
  const values = categorySchema.parse(request.body);
  const index = store.categories.findIndex((item) => item.id === id);
  if (index < 0) throw new HttpError(404, 'Không tìm thấy nhóm hàng.');
  ensureUniqueCode(store.categories, values.code, id);
  if (values.parentId && !store.categories.some((item) => item.id === values.parentId)) throw new HttpError(400, 'Nhóm hàng cha không tồn tại.');
  ensureValidParent(id, values.parentId);
  const current = store.categories[index]!;
  const record = { ...current, ...values, description: optionalText(values.description), updatedAt: new Date().toISOString() };
  store.categories[index] = record;
  ok(response, record);
});

router.patch('/categories/:id/status', (request, response) => {
  const id = asId(String(request.params.id));
  const { isActive } = statusSchema.parse(request.body);
  const record = store.categories.find((item) => item.id === id);
  if (!record) throw new HttpError(404, 'Không tìm thấy nhóm hàng.');
  record.isActive = isActive; record.updatedAt = new Date().toISOString();
  ok(response, record);
});

router.get('/units', (request, response) => {
  const { page, size } = pageParams(request);
  const keyword = normalize(request.query.keyword);
  const status = String(request.query.status ?? 'ALL');
  const filtered = store.units.filter((item) => (!keyword || [item.code, item.name].some((value) => normalize(value).includes(keyword))) && (status === 'ALL' || item.isActive === (status === 'ACTIVE')));
  ok(response, paginate(filtered, page, size));
});

router.post('/units', (request, response) => {
  const values = unitSchema.parse(request.body);
  ensureUniqueCode(store.units, values.code);
  const record = { id: nextId(store.units), ...values };
  store.units.unshift(record); ok(response, record, 201);
});

router.put('/units/:id', (request, response) => {
  const id = asId(String(request.params.id));
  const values = unitSchema.parse(request.body);
  const index = store.units.findIndex((item) => item.id === id);
  if (index < 0) throw new HttpError(404, 'Không tìm thấy đơn vị tính.');
  ensureUniqueCode(store.units, values.code, id);
  const record = { ...store.units[index]!, ...values }; store.units[index] = record; ok(response, record);
});

router.patch('/units/:id/status', (request, response) => {
  const id = asId(String(request.params.id));
  const { isActive } = statusSchema.parse(request.body);
  const record = store.units.find((item) => item.id === id);
  if (!record) throw new HttpError(404, 'Không tìm thấy đơn vị tính.');
  record.isActive = isActive; ok(response, record);
});

router.get('/references', (_request, response) => ok(response, {
  categories: store.categories.map((item) => ({ ...item })),
  units: store.units.map((item) => ({ ...item })),
  branches: [],
}));

export default router;
