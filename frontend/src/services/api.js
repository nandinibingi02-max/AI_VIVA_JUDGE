import { auth } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');

const apiBaseUrl = () => {
  if (!API_BASE_URL || !/^https?:\/\//.test(API_BASE_URL)) {
    throw new Error('Viva API is not configured. Set VITE_API_URL to your backend URL followed by /api and redeploy the frontend.');
  }
  return API_BASE_URL;
};

export const api = {
  getDashboardData: async () => {
    const response = await fetch(`${apiBaseUrl()}/dashboard`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  startViva: async (projectData, projectFile) => {
    const baseUrl = apiBaseUrl();
    const token = await auth.ensureAccessToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const body = projectFile
      ? (() => {
          const formData = new FormData();
          formData.append('title', projectData.title ?? '');
          formData.append('subject', projectData.subject ?? '');
          formData.append('description', projectData.description ?? '');
          formData.append('projectFile', projectFile);
          return formData;
        })()
      : JSON.stringify(projectData);
    if (!projectFile) headers['Content-Type'] = 'application/json';
    const response = await fetch(`${baseUrl}/viva/start`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body,
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error?.message ?? 'Failed to start viva');
    }
    return await response.json();
  },

  submitAnswer: async (sessionId, answer) => {
    const baseUrl = apiBaseUrl();
    const token = await auth.ensureAccessToken();
    const response = await fetch(`${baseUrl}/viva/${encodeURIComponent(sessionId)}/answer`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ answer }),
    });
    if (!response.ok) throw new Error((await response.json().catch(() => null))?.error?.message ?? 'Failed to submit answer');
    return await response.json();
  },

  getResults: async (sessionId) => {
    const baseUrl = apiBaseUrl();
    const token = await auth.ensureAccessToken();
    const response = await fetch(`${baseUrl}/viva/${encodeURIComponent(sessionId)}/results`, { credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!response.ok) throw new Error('Failed to get results');
    return await response.json();
  },

  getHistory: async () => {
    const baseUrl = apiBaseUrl();
    const token = await auth.ensureAccessToken();
    const response = await fetch(`${baseUrl}/viva/history`, { credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!response.ok) throw new Error('Failed to get session history');
    return await response.json();
  }
};
