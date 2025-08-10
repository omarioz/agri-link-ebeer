const API_BASE = '/api';

let accessToken: string | null = localStorage.getItem('accessToken');

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, data?: any) => request(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path: string, data?: any) => request(path, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (path: string, data?: any) => request(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (path: string) => request(path, { method: 'DELETE' }),
  login: async (email: string, password: string) => {
    const tokens = await request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username: email, password })
    });
    setAccessToken(tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    return tokens;
  },
  register: (payload: any) => request('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};
