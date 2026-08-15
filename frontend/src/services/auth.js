const API_BASE_URL = import.meta.env.VITE_API_URL;
let accessToken = null;

class AuthRequestError extends Error {
  constructor(message, details) { super(message); this.details = details; }
}

async function request(path, options = {}) {
  if (!API_BASE_URL) throw new AuthRequestError('Authentication service is not configured.');
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { credentials: 'include', ...options });
  } catch {
    throw new AuthRequestError('Unable to reach the authentication service.');
  }
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new AuthRequestError(body?.error?.message ?? 'Unable to complete this request.', body?.error?.details);
  return body;
}

export const auth = {
  getAccessToken: () => accessToken,
  async login(credentials) {
    const result = await request('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) });
    accessToken = result.accessToken;
    return result.user;
  },
  async register(details) {
    const result = await request('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(details) });
    accessToken = result.accessToken;
    return result.user;
  },
  async restoreSession() {
    try {
      const result = await request('/auth/refresh', { method: 'POST' });
      accessToken = result.accessToken;
      return result.user;
    } catch { accessToken = null; return null; }
  },
  async logout() {
    try { await request('/auth/logout', { method: 'POST' }); }
    finally { accessToken = null; }
  },
};
