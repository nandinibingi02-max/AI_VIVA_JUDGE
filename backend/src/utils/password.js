import argon2 from 'argon2';
import { createHash } from 'node:crypto';

const options = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 };
export const hashPassword = (password) => argon2.hash(password, options);
export const verifyPassword = (hash, password) => argon2.verify(hash, password);
export const hashRefreshToken = (token) => createHash('sha256').update(token).digest('hex');
