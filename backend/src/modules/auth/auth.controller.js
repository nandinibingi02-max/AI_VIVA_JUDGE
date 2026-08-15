import { env } from '../../config/env.js';
import * as service from './auth.service.js';
import { changePasswordSchema, loginSchema, registerSchema } from './auth.schema.js';

const cookieOptions = { httpOnly: true, secure: env.cookieSecure, sameSite: env.cookieSameSite, path: '/api/auth', maxAge: env.refreshTokenTtlSeconds };
const setRefreshCookie = (reply, token) => reply.setCookie(env.refreshCookieName, token, cookieOptions);
const clearRefreshCookie = (reply) => reply.clearCookie(env.refreshCookieName, { httpOnly: true, secure: env.cookieSecure, sameSite: env.cookieSameSite, path: '/api/auth' });
export const register = async (request, reply) => { const result = await service.register(registerSchema.parse(request.body), request.server); if (!result) return reply.code(409).send({ error: { code: 'EMAIL_UNAVAILABLE', message: 'Unable to create an account with the supplied details.' } }); setRefreshCookie(reply, result.refreshToken); return reply.code(201).send({ user: result.user, accessToken: result.accessToken }); };
export const login = async (request, reply) => { const result = await service.login(loginSchema.parse(request.body), request.server); setRefreshCookie(reply, result.refreshToken); return reply.send({ user: result.user, accessToken: result.accessToken }); };
export const refresh = async (request, reply) => { const result = await service.refresh(request.cookies[env.refreshCookieName], request.server); setRefreshCookie(reply, result.refreshToken); return reply.send({ user: result.user, accessToken: result.accessToken }); };
export const logout = async (request, reply) => { if (request.cookies[env.refreshCookieName]) await service.logout(request.cookies[env.refreshCookieName], request.server); clearRefreshCookie(reply); return reply.code(204).send(); };
export const me = async (request, reply) => reply.send({ user: await service.getCurrentUser(request.user.sub) });
export const changePassword = async (request, reply) => { await service.changePassword(request.user.sub, changePasswordSchema.parse(request.body)); clearRefreshCookie(reply); return reply.code(204).send(); };
