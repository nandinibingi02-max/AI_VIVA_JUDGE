import { query, withTransaction } from '../../db/pool.js';

const userFields = 'id, name, email, password_hash, created_at, updated_at';
export const findUserByEmail = async (email) => (await query(`SELECT ${userFields} FROM users WHERE LOWER(email) = LOWER($1)`, [email])).rows[0] ?? null;
export const findUserById = async (id) => (await query(`SELECT ${userFields} FROM users WHERE id = $1`, [id])).rows[0] ?? null;
export async function createUser({ name, email, passwordHash }) {
  const result = await query(`INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (LOWER(email)) DO NOTHING RETURNING ${userFields}`, [name, email, passwordHash]);
  return result.rows[0] ?? null;
}
export const createRefreshToken = ({ id, userId, tokenHash, expiresAt }) => query('INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)', [id, userId, tokenHash, expiresAt]);
export const revokeRefreshToken = (id) => query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1 AND revoked_at IS NULL', [id]);
export function updatePasswordAndRevokeTokens(userId, passwordHash) {
  return withTransaction(async (client) => {
    await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);
    await client.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL', [userId]);
  });
}
export async function rotateRefreshToken({ currentId, currentTokenHash, userId, nextToken }) {
  return withTransaction(async (client) => {
    const revoked = await client.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1 AND user_id = $2 AND token_hash = $3 AND revoked_at IS NULL AND expires_at > NOW() RETURNING id', [currentId, userId, currentTokenHash]);
    if (revoked.rowCount !== 1) return false;
    await client.query('INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)', [nextToken.id, userId, nextToken.tokenHash, nextToken.expiresAt]);
    return true;
  });
}
