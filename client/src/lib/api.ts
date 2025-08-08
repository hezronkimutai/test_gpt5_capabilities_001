import type { EchoInput, EchoResponse, HealthResponse } from '../types/shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export const api = {
  health: () => get<HealthResponse>('/health'),
  echo: (payload: EchoInput) => post<EchoResponse>('/example/echo', payload),
};
