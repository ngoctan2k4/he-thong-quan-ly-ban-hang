import { newDb } from 'pg-mem';
import type { DatabasePool } from './database.js';

export function createTestDatabase(): DatabasePool {
  const memory = newDb({ autoCreateForeignKeyIndices: true });
  const adapter = memory.adapters.createPg();
  return new adapter.Pool() as unknown as DatabasePool;
}
