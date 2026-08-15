import 'dotenv/config';

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};
const integer = (name) => {
  const value = Number(required(name));
  if (!Number.isInteger(value) || value < 1) throw new Error(`Invalid environment variable: ${name}`);
  return value;
};
const boolean = (name) => {
  const value = required(name);
  if (value !== 'true' && value !== 'false') throw new Error(`Invalid environment variable: ${name}`);
  return value === 'true';
};
const durationSeconds = (name) => {
  const match = /^(\d+)(s|m|h|d)$/.exec(required(name));
  if (!match) throw new Error(`Invalid duration environment variable: ${name}`);
  return Number(match[1]) * ({ s: 1, m: 60, h: 3600, d: 86400 }[match[2]]);
};
const sameSite = required('COOKIE_SAME_SITE');
if (!['strict', 'lax', 'none'].includes(sameSite)) throw new Error('Invalid environment variable: COOKIE_SAME_SITE');

export const env = Object.freeze({
  nodeEnv: required('NODE_ENV'),
  host: required('HOST'),
  port: integer('PORT'),
  databaseUrl: required('DATABASE_URL'),
  dbPoolMax: integer('DB_POOL_MAX'),
  jwtAccessSecret: required('JWT_ACCESS_SECRET'),
  jwtRefreshSecret: required('JWT_REFRESH_SECRET'),
  accessTokenTtl: required('ACCESS_TOKEN_TTL'),
  refreshTokenTtl: required('REFRESH_TOKEN_TTL'),
  refreshTokenTtlSeconds: durationSeconds('REFRESH_TOKEN_TTL'),
  refreshCookieName: required('REFRESH_COOKIE_NAME'),
  cookieSecure: boolean('COOKIE_SECURE'),
  cookieSameSite: sameSite,
  corsOrigin: required('CORS_ORIGIN'),
  authRateLimitMax: integer('AUTH_RATE_LIMIT_MAX'),
  authRateLimitWindow: required('AUTH_RATE_LIMIT_WINDOW'),
  groqApiKey: process.env.GROQ_API_KEY ?? null,
});
