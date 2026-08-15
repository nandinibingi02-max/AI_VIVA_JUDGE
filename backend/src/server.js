import { buildApp } from './app.js';
import { env } from './config/env.js';
import { pool, testDatabaseConnection } from './db/pool.js';

await testDatabaseConnection();

const app = await buildApp();

const close = async () => {
  await app.close();
  await pool.end();
  process.exit(0);
};

process.on('SIGINT', close);
process.on('SIGTERM', close);

await app.listen({
  host: env.host,
  port: env.port,
});