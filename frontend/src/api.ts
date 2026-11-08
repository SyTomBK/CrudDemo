export type Product = { id: number; name: string; price: number; createdAt: string };
export type ProductInput = { name: string; price: number };
export type AppInfo = { environment: string; version: string };

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export const api = {
  list: () => request<Product[]>('/api/products'),
  create: (p: ProductInput) =>
    request<Product>('/api/products', { method: 'POST', body: JSON.stringify(p) }),
  update: (id: number, p: ProductInput) =>
    request<void>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  remove: (id: number) => request<void>(`/api/products/${id}`, { method: 'DELETE' }),
  info: () => request<AppInfo>('/api/info'),
};