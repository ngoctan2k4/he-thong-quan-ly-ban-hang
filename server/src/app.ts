import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { errorHandler, notFound, ok } from './http.js';
import catalogRouter from './routes/catalog.js';
import pricingRouter from './routes/pricing.js';
import productsRouter from './routes/products.js';
import suppliersRouter from './routes/suppliers.js';
import inventoryRouter from './routes/inventory.js';
import { isDatabaseReady } from './database.js';
import type { DatabasePool } from './database.js';
import { initializeStore, persistStore } from './store.js';

export async function createApp(options: { databaseUrl?: string; databasePool?: DatabasePool } = {}) {
  await initializeStore(options.databaseUrl ?? process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/sales_management', options.databasePool);
  const app = express();
  const frontendDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist');
  const frontendIndex = path.join(frontendDist, 'index.html');
  app.use(helmet());
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? ['http://localhost:5173'];
  app.disable('x-powered-by');
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json({ limit: '1mb' }));
  app.use((request, response, next) => {
    const originalJson = response.json.bind(response);
    response.json = ((body: unknown) => {
      if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) && response.statusCode < 400 && (body as { success?: boolean })?.success) {
        void persistStore().then(() => originalJson(body)).catch(next);
        return response;
      }
      return originalJson(body);
    }) as typeof response.json;
    next();
  });
  app.get('/api/health', async (_request, response) => {
    const database = await isDatabaseReady() ? 'ready' : 'unavailable';
    return ok(response, { service: 'sales-management-backend', status: database === 'ready' ? 'ok' : 'degraded', database }, database === 'ready' ? 200 : 503);
  });
  app.use('/api/admin/catalog', catalogRouter);
  app.use('/api/admin/products', productsRouter);
  app.use('/api/admin/price-lists', pricingRouter);
  app.use('/api/admin/suppliers', suppliersRouter);
  app.use('/api/admin/inventory', inventoryRouter);
  app.use(express.static(frontendDist));
  app.use((request, response, next) => {
    if (request.method !== 'GET' || request.path.startsWith('/api/') || !request.accepts('html')) return next();
    if (!existsSync(frontendIndex)) {
      return response.status(503).json({
        success: false,
        message: 'Chưa có bản build frontend. Hãy chạy npm run build:all rồi khởi động lại server.',
      });
    }
    return response.sendFile(frontendIndex);
  });
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
