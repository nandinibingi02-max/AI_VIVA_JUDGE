const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = {
  getDashboardData: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  startViva: async (projectData) => {
    const response = await fetch(`${API_BASE_URL}/viva/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error('Failed to start viva');
    return await response.json();
  },

  submitAnswer: async (sessionId, answer) => {
    const response = await fetch(`${API_BASE_URL}/viva/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, answer }),
    });
    if (!response.ok) throw new Error('Failed to submit answer');
    return await response.json();
  },

  getResults: async (sessionId) => {
    const response = await fetch(`${API_BASE_URL}/viva/results/${sessionId}`);
    if (!response.ok) throw new Error('Failed to get results');
    return await response.json();
  },

  getHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/viva/history`);
    if (!response.ok) throw new Error('Failed to get session history');
    return await response.json();
  }
};
