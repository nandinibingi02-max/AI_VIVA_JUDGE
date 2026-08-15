import { unauthorized } from '../utils/errors.js';

export async function authenticate(request) {
  try { await request.jwtVerify(); }
  catch { throw unauthorized(); }
}
