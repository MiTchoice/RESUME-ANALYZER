/**
 * Simple in-memory store for resume sessions.
 * In production, replace with Redis or a database.
 */
const store = new Map();
const TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function set(id, data) {
  store.set(id, { data, expiresAt: Date.now() + TTL_MS });
}

function get(id) {
  const entry = store.get(id);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { store.delete(id); return null; }
  return entry.data;
}

function del(id) {
  store.delete(id);
}

// Cleanup expired entries every 30 minutes
setInterval(() => {
  for (const [id, entry] of store.entries()) {
    if (Date.now() > entry.expiresAt) store.delete(id);
  }
}, 30 * 60 * 1000);

module.exports = { set, get, del };
