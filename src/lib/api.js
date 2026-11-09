/**
 * Data layer for the site.
 *
 * - Wedding details are bundled from src/data/site.json, so the site works on static hosting
 *   (GitHub Pages) with no backend.
 * - RSVPs and wishes go to the Express API when it is running (local / later Firebase).
 *   In a static build (VITE_STATIC=true) or when the API is unreachable they are kept in this
 *   browser's localStorage, which is enough for a client demo.
 */
import siteData from '../data/site.json';

const STATIC = import.meta.env.VITE_STATIC === 'true';
const BASE = import.meta.env.BASE_URL || '/';

/** "/photos/1.jpeg" -> "/Wedding-site/photos/1.jpeg" when hosted under a sub-path. */
function withBase(value) {
  if (typeof value === 'string') return /^\/(photos|music|videos)\//.test(value) ? BASE + value.slice(1) : value;
  if (Array.isArray(value)) return value.map(withBase);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withBase(v)]));
  return value;
}

async function request(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  const body = await res.json().catch(() => null);
  if (!body) throw new TypeError('API unavailable'); // 404 page / proxy error: no API here
  if (!res.ok) throw new Error(body.error || 'Something went wrong. Please try again.');
  return body;
}

/* ---------- local (browser) fallback ---------- */
const store = {
  read(key) { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } },
  add(key, entry) {
    const saved = { id: crypto.randomUUID?.() || String(Date.now()), createdAt: new Date().toISOString(), ...entry };
    try { localStorage.setItem(key, JSON.stringify([saved, ...store.read(key)].slice(0, 100))); } catch { /* storage blocked */ }
    return saved;
  }
};

async function withFallback(remote, local) {
  if (STATIC) return local();
  try { return await remote(); } catch (e) {
    if (e instanceof TypeError) return local(); // API not running
    throw e; // real validation error from the API
  }
}

export const getSite = async () => withBase(siteData);

export const sendRsvp = (data) => withFallback(
  () => request('/api/rsvp', { method: 'POST', body: JSON.stringify(data) }),
  () => ({ ok: true, ...store.add('wedding.rsvps', data) })
);

export const getWishes = () => withFallback(
  () => request('/api/wishes'),
  () => store.read('wedding.wishes')
);

export const sendWish = (data) => withFallback(
  () => request('/api/wishes', { method: 'POST', body: JSON.stringify(data) }),
  () => store.add('wedding.wishes', { name: data.name.trim(), message: data.message.trim() })
);
