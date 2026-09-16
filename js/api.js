/**
 * Draftout API Module
 * Community API: https://draftoutmc.com
 * Spec: https://github.com/memerson12/draftout-api-spec
 */
const DraftoutAPI = (() => {
  const BASE = 'https://draftoutmc.com';

  // Multiple CORS proxy options — tried in order until one succeeds
  const PROXIES = [
    // allorigins: wraps in { contents: "..." }
    (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    // corsproxy.io: returns raw response
    (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    // thingproxy: returns raw response
    (url) => `https://thingproxy.freeboard.io/fetch/${url}`,
  ];

  async function tryFetch(fetchUrl, parseAllorigins = false) {
    const res = await fetch(fetchUrl, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // allorigins wraps the JSON string in { contents: "..." }
    if (parseAllorigins && data && typeof data.contents === 'string') {
      return JSON.parse(data.contents);
    }
    return data;
  }

  async function fetchJSON(url) {
    // 1) Try direct (works in OBS, fails locally due to CORS)
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
        mode: 'cors',
      });
      clearTimeout(timer);
      if (res.ok) return await res.json();
    } catch (_) { /* fall through to proxies */ }

    // 2) Try each proxy in sequence
    const errors = [];
    for (let i = 0; i < PROXIES.length; i++) {
      try {
        const proxyUrl = PROXIES[i](url);
        const isAllorigins = proxyUrl.includes('allorigins');
        return await tryFetch(proxyUrl, isAllorigins);
      } catch (e) {
        errors.push(e.message);
      }
    }

    throw new Error(`No se pudo cargar datos. Errores: ${errors.join(', ')}`);
  }

  return {
    /**
     * Get player stats and recent matches.
     * @param {string} username - Minecraft username
     * @param {{ page?: number, filter?: string, era?: number }} opts
     */
    getPlayerStats(username, { page = 1, filter = 'competitive', era } = {}) {
      const params = new URLSearchParams({ page, filter });
      if (era != null) params.set('era', era);
      return fetchJSON(`${BASE}/api/stats/${encodeURIComponent(username)}?${params}`);
    },

    /**
     * Get all rank bands in ascending order.
     */
    getRanks() {
      return fetchJSON(`${BASE}/api/ranks`);
    },

    /**
     * Get the leaderboard.
     * @param {{ metric?: string, q?: string, limit?: number, era?: number }} opts
     */
    getLeaderboard({ metric = 'elo', q, limit = 100, era } = {}) {
      const params = new URLSearchParams({ metric, limit });
      if (q) params.set('q', q);
      if (era != null) params.set('era', era);
      return fetchJSON(`${BASE}/api/stats?${params}`);
    },
  };
})();

