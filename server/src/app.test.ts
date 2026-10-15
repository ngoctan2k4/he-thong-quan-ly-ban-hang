import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { createApp } from './app.js';
import { resetStore } from './store.js';
import { createTestDatabase } from './testDatabase.js';

const app = await createApp({ databasePool: createTestDatabase() });
beforeEach(resetStore);

describe('module danh mục vật tư hàng hóa', () => {
  it('phục vụ frontend và health API trên cùng server', async () => {
    const frontend = await request(app).get('/').set('Accept', 'text/html').expect(200);
    assert.match(frontend.headers['content-type'] ?? '', /text\/html/);
    const health = await request(app).get('/api/health').expect(200);
    assert.equal(health.body.data.status, 'ok');
    assert.equal(health.body.data.database, 'ready');
  });

  it('trả lỗi chuẩn cho JSON sai và API không tồn tại', async () => {
    const invalidJson = await request(app)
      .post('/api/admin/catalog/categories')
      .set('Content-Type', 'application/json')
      .send('{"code":')
      .expect(400);
    assert.equal(invalidJson.body.message, 'Nội dung JSON không hợp lệ.');
    await request(app).get('/api/khong-ton-tai').expect(404);
  });

  it('tạo nhóm, đơn vị, sản phẩm và quy đổi', async () => {
    const category = await request(app).post('/api/admin/catalog/categories').send({ code: 'NUOC', name: 'Đồ uống', isActive: true }).expect(201);
    const unit = await request(app).post('/api/admin/catalog/units').send({ code: 'LON', name: 'Lon', isActive: true }).expect(201);
    const box = await request(app).post('/api/admin/catalog/units').send({ code: 'THUNG', name: 'Thùng', isActive: true }).expect(201);
    const product = await request(app).post('/api/admin/products').send({ code: 'SP001', sku: 'CC-330', name: 'Nước ngọt lon', categoryId: category.body.data.id, baseUnitId: unit.body.data.id, retailPrice: 12000, wholesalePrice: 10000, moq: 24, minStock: 10, maxStock: 100, safetyStock: 15, reorderPoint: 20, status: 'ACTIVE', isActive: true }).expect(201);
    const conversion = await request(app).post(`/api/admin/products/${product.body.data.id}/conversions`).send({ unitId: box.body.data.id, factor: 24 }).expect(201);
    assert.equal(conversion.body.data.factor, 24);
  });

  it('chặn bậc giá bị chồng lấn', async () => {
    const category = await request(app).post('/api/admin/catalog/categories').send({ code: 'CAT', name: 'Nhóm', isActive: true });
    const unit = await request(app).post('/api/admin/catalog/units').send({ code: 'CAI', name: 'Cái', isActive: true });
    const product = await request(app).post('/api/admin/products').send({ code: 'SP', sku: 'SKU', name: 'Sản phẩm', categoryId: category.body.data.id, baseUnitId: unit.body.data.id, retailPrice: 10, wholesalePrice: 9, moq: 1, minStock: 0, safetyStock: 0, reorderPoint: 0, status: 'ACTIVE', isActive: true });
    const list = await request(app).post('/api/admin/price-lists').send({ code: 'BG', name: 'Bảng giá', customerType: 'RETAIL', validFrom: '2026-01-01', isActive: true });
    await request(app).post(`/api/admin/price-lists/${list.body.data.id}/tiers`).send({ productId: product.body.data.id, minQty: 1, maxQty: 10, unitPrice: 10 }).expect(201);
    const overlap = await request(app).post(`/api/admin/price-lists/${list.body.data.id}/tiers`).send({ productId: product.body.data.id, minQty: 10, unitPrice: 9 }).expect(409);
    assert.match(overlap.body.message, /chồng lấn/);
  });

  it('quản lý nhà cung cấp mặc định từ hồ sơ sản phẩm', async () => {
    const category = await request(app).post('/api/admin/catalog/categories').send({ code: 'CAT', name: 'Nhóm', isActive: true });
    const unit = await request(app).post('/api/admin/catalog/units').send({ code: 'CAI', name: 'Cái', isActive: true });
    const product = await request(app).post('/api/admin/products').send({ code: 'SP', sku: 'SKU', name: 'Sản phẩm', categoryId: category.body.data.id, baseUnitId: unit.body.data.id, retailPrice: 10, wholesalePrice: 9, moq: 1, minStock: 0, safetyStock: 0, reorderPoint: 0, status: 'ACTIVE', isActive: true });
    const supplier = await request(app).post('/api/admin/suppliers').send({ code: 'NCC', name: 'Nhà cung cấp', avgLeadTimeDays: 2, maxLeadTimeDays: 4, isActive: true });
    await request(app).post(`/api/admin/products/${product.body.data.id}/suppliers`).send({ supplierId: supplier.body.data.id, lastPurchasePrice: 7, leadTimeDays: 2, isDefaultSupplier: true }).expect(201);
    const purchasing = await request(app).get(`/api/admin/products/${product.body.data.id}/suppliers`).expect(200);
    assert.equal(purchasing.body.data[0].isDefaultSupplier, true);
    assert.equal(purchasing.body.data[0].lastPurchasePrice, 7);
  });

  it('áp dụng MOQ khách sỉ khi báo giá', async () => {
    const category = await request(app).post('/api/admin/catalog/categories').send({ code: 'CAT', name: 'Nhóm', isActive: true });
    const unit = await request(app).post('/api/admin/catalog/units').send({ code: 'CAI', name: 'Cái', isActive: true });
    const product = await request(app).post('/api/admin/products').send({ code: 'SP', sku: 'SKU', name: 'Sản phẩm', categoryId: category.body.data.id, baseUnitId: unit.body.data.id, retailPrice: 10, wholesalePrice: 8, moq: 10, minStock: 0, safetyStock: 0, reorderPoint: 0, status: 'ACTIVE', isActive: true });
    await request(app).get(`/api/admin/products/${product.body.data.id}/quote?customerType=WHOLESALE&quantity=9`).expect(409);
    const quote = await request(app).get(`/api/admin/products/${product.body.data.id}/quote?customerType=WHOLESALE&quantity=10`).expect(200);
    assert.equal(quote.body.data.unitPrice, 8);
    assert.equal(quote.body.data.minimumQuantity, 10);
  });

  it('chặn xuất vượt tồn khả dụng và trừ tồn khi hợp lệ', async () => {
    const category = await request(app).post('/api/admin/catalog/categories').send({ code: 'CAT', name: 'Nhóm', isActive: true });
    const unit = await request(app).post('/api/admin/catalog/units').send({ code: 'CAI', name: 'Cái', isActive: true });
    const product = await request(app).post('/api/admin/products').send({ code: 'SP', sku: 'SKU', name: 'Sản phẩm', categoryId: category.body.data.id, baseUnitId: unit.body.data.id, retailPrice: 10, wholesalePrice: 8, moq: 1, minStock: 0, safetyStock: 0, reorderPoint: 0, status: 'ACTIVE', isActive: true });
    await request(app).put(`/api/admin/inventory/balances/${product.body.data.id}`).send({ onHand: 10, reserved: 3 }).expect(200);
    const blocked = await request(app).post('/api/admin/inventory/issues').send({ reference: 'SO-001', productId: product.body.data.id, quantity: 8 }).expect(409);
    assert.match(blocked.body.message, /Tồn khả dụng hiện tại là 7/);
    const issued = await request(app).post('/api/admin/inventory/issues').send({ reference: 'SO-001', productId: product.body.data.id, quantity: 7 }).expect(201);
    assert.equal(issued.body.data.availableAfter, 0);
  });
});
