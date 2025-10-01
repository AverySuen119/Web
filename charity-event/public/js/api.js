const API_BASE = ''; // same origin

async function fetchJSON(url) {
  const res = await fetch(url, { credentials: 'same-origin' });
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text || ''}`);
  }
  return res.json();
}

// 获取 events
export async function getEvents({ upcoming = true, limit } = {}) {
  const params = new URLSearchParams();
  if (upcoming) params.set('upcoming', 'true');
  if (limit) params.set('limit', limit);
  const url = `/api/events?${params.toString()}`;
  return fetchJSON(url);
}

// 获取 categories
export async function getCategories() {
  return fetchJSON('/api/categories');
}

// 获取单个事件
export async function getEventById(id) {
  return fetchJSON(`/api/events/${encodeURIComponent(id)}`);
}

/**
 *搜索 events（ */
export async function searchEvents({ year, month, day, location, category } = {}) {
  const params = new URLSearchParams();
  if (year) params.set('year', year);
  if (month) params.set('month', month);
  if (day) params.set('day', day);
  if (location) params.set('location', location);
  if (category) params.set('category', category);

  return fetchJSON(`/api/events/search?${params.toString()}`);
}
