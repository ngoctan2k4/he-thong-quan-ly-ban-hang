import assert from 'node:assert/strict';
import { after, describe, it } from 'node:test';
import { Pool } from 'pg';
import { closeDatabase, loadStore, type DatabasePool } from './database.js';
import { initializeStore, persistStore, store } from './store.js';
import { createTestDatabase } from './testDatabase.js';

after(closeDatabase);

describe('PostgreSQL persistence', () => {
  it('giữ dữ liệu sau khi nạp lại store từ database', async () => {
    const pool = process.env.DATABASE_URL
      ? new Pool({ connectionString: process.env.DATABASE_URL }) as DatabasePool
      : createTestDatabase();
    await initializeStore(process.env.DATABASE_URL ?? 'test', pool);
    const now = new Date().toISOString();
    store.categories.push(
      { id: 2, code: 'CHILD', name: 'Nhóm con', parentId: 1, isActive: true, createdAt: now, updatedAt: now },
      { id: 1, code: 'PERSIST', name: 'Nhóm lưu bền vững', isActive: true, createdAt: now, updatedAt: now },
    );
    await persistStore();

    store.categories.length = 0;
    await loadStore(store);
    assert.equal(store.categories.length, 2);
    assert.equal(store.categories[0]?.code, 'PERSIST');
    assert.equal(store.categories[1]?.parentId, 1);
  });
});
