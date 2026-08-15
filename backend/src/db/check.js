import { pool } from './pool.js';

try {
  await pool.query('SELECT 1 AS connected');
  console.log('PostgreSQL connection: ok');
} finally {
  await pool.end();
}
