const BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

async function api(path, opts) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  if (!res.ok) throw new Error(await res.text());
  return res.status === 204 ? null : res.json();
}

export const Items = {
  list: () => api('/items'),
  create: (data) => api('/items', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => api(`/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => api(`/items/${id}`, { method: 'DELETE' })
};

export const Outfits = {
  list: () => api('/outfits'),
  create: (data) => api('/outfits', { method: 'POST', body: JSON.stringify(data) }),
  remove: (id) => api(`/outfits/${id}`, { method: 'DELETE' })
};
