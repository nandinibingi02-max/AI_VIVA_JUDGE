import { randomUUID } from 'node:crypto';
import { env } from '../../config/env.js';
import { invalidCredentials, unauthorized } from '../../utils/errors.js';
import { hashPassword, hashRefreshToken, verifyPassword } from '../../utils/password.js';
import * as repository from './auth.repository.js';

const publicUser = ({ id, name, email, created_at: createdAt, updated_at: updatedAt }) => ({ id, name, email, createdAt, updatedAt });
const expiresAt = () => new Date(Date.now() + env.refreshTokenTtlSeconds * 1000);
export async function register(input, fastify) {
  const passwordHash = await hashPassword(input.password);
  const user = await repository.createUser({ name: input.name, email: input.email, passwordHash });
  if (!user) return null;
  return { user: publicUser(user), ...(await createSession(user, fastify)) };
}
export async function login(input, fastify) {
  const user = await repository.findUserByEmail(input.email);
  if (!user || !(await verifyPassword(user.password_hash, input.password))) throw invalidCredentials();
  return { user: publicUser(user), ...(await createSession(user, fastify)) };
}
export async function refresh(refreshToken, fastify) {
  let claims;
  try { claims = fastify.jwt.refreshJwt.verify(refreshToken); } catch { throw unauthorized(); }
  const user = await repository.findUserById(claims.sub);
  if (!user) throw unauthorized();
  const next = await buildRefreshToken(user, fastify);
  const rotated = await repository.rotateRefreshToken({ currentId: claims.jti, currentTokenHash: hashRefreshToken(refreshToken), userId: user.id, nextToken: next.record });
  if (!rotated) throw unauthorized();
  return { user: publicUser(user), accessToken: signAccessToken(user, fastify), refreshToken: next.token };
}
export async function logout(refreshToken, fastify) {
  try { const claims = fastify.jwt.refreshJwt.verify(refreshToken); await repository.revokeRefreshToken(claims.jti); } catch { /* Always return the same successful logout response. */ }
}
export async function getCurrentUser(userId) { const user = await repository.findUserById(userId); if (!user) throw unauthorized(); return publicUser(user); }
export async function changePassword(userId, input) {
  const user = await repository.findUserById(userId);
  if (!user || !(await verifyPassword(user.password_hash, input.currentPassword))) throw invalidCredentials();
  await repository.updatePasswordAndRevokeTokens(userId, await hashPassword(input.newPassword));
}
function signAccessToken(user, fastify) { return fastify.jwt.sign({ sub: user.id, email: user.email }, { expiresIn: env.accessTokenTtl }); }
async function buildRefreshToken(user, fastify) {
  const id = randomUUID();
  const token = fastify.jwt.refreshJwt.sign({ sub: user.id, jti: id }, { expiresIn: env.refreshTokenTtl });
  return { token, record: { id, userId: user.id, tokenHash: hashRefreshToken(token), expiresAt: expiresAt() } };
}
async function createSession(user, fastify) { const refresh = await buildRefreshToken(user, fastify); await repository.createRefreshToken(refresh.record); return { accessToken: signAccessToken(user, fastify), refreshToken: refresh.token }; }
