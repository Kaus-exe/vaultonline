const API_URL = 'http://localhost:8080/api';
const TOKEN_KEY = 'vault_jwt_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logoutUser() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function loginUser(phone, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });

  if (!response.ok) {
    throw new Error('Ошибка авторизации');
  }

  const data = await response.json();
  localStorage.setItem(TOKEN_KEY, data.token);
  return data.user;
}

export async function authFetch(endpoint, options = {}) {
  const token = getToken();
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}