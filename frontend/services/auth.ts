import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: string,
): Promise<User> {
  const { data } = await api.post<User>('/auth/register', { name, email, password, role });
  return data;
}

export function saveSession(token: string, user: User) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function getSession(): { token: string | null; user: User | null } {
  const token = localStorage.getItem('token');
  const raw = localStorage.getItem('user');
  const user = raw ? (JSON.parse(raw) as User) : null;
  return { token, user };
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
