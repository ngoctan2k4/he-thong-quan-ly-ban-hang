import 'dotenv/config';
import { createApp } from './app.js';
import { closeDatabase } from './database.js';

const port = Number(process.env.PORT) || 3000;
const databaseUrl = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/sales_management';
const app = await createApp({ databaseUrl });
const server = app.listen(port, () => console.log(`Backend đang chạy tại http://localhost:${port}`));

function shutdown(signal: string) {
  console.log(`Nhận ${signal}, đang dừng backend...`);
  server.close(async (error) => {
    await closeDatabase();
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
