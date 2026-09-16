/**
 * Draftout API Module
 * Community API: https://draftoutmc.com
 * Spec: https://github.com/memerson12/draftout-api-spec
 * Supports Vercel Serverless Proxy (Zero CORS), Direct OBS Fetch & Fallbacks
 */
const DraftoutAPI = (() => {
  const BASE = 'https://draftoutmc.com';

  async function fetchEndpoint(endpointPath) {
    const isHosted = typeof location !== 'undefined' && location.protocol.startsWith('http');

    // 1) When hosted on Vercel, use same-origin serverless proxy or rewrite (100% bypasses CORS!)
    if (isHosted) {
      // 1A) Vercel rewrite rule: /api/draftout/...
      try {
        const res = await fetch(`/api/draftout/${endpointPath}`, {
          headers: { Accept: 'application/json' },
        });
        if (res.ok) return await res.json();
      } catch (_) {}

      // 1B) Vercel Serverless Function: /api/proxy?endpoint=...
      try {
        const res = await fetch(`/api/proxy?endpoint=${encodeURIComponent(endpointPath)}`, {
          headers: { Accept: 'application/json' },
        });
        if (res.ok) return await res.json();
      } catch (_) {}
    }

    // 2) Try direct fetch to draftoutmc.com (works in OBS Browser Source!)
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${BASE}/api/${endpointPath}`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timer);
      if (res.ok) return await res.json();
    } catch (_) {}

    // 3) CORS fallback proxies for local testing
    const targetUrl = `${BASE}/api/${endpointPath}`;
    const proxies = [
      (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      (u) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
    ];

    for (const pFn of proxies) {
      try {
        const pUrl = pFn(targetUrl);
        const res = await fetch(pUrl, { headers: { Accept: 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.contents === 'string') {
            return JSON.parse(data.contents);
          }
          return data;
        }
      } catch (_) {}
    }

    throw new Error('No se pudo conectar con la API de Draftout.');
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
      return fetchEndpoint(`stats/${encodeURIComponent(username)}?${params}`);
    },

    /**
     * Get all rank bands in ascending order.
     */
    getRanks() {
      return fetchEndpoint('ranks');
    },

    /**
     * Get the leaderboard.
     * @param {{ metric?: string, q?: string, limit?: number, era?: number }} opts
     */
    getLeaderboard({ metric = 'elo', q, limit = 100, era } = {}) {
      const params = new URLSearchParams({ metric, limit });
      if (q) params.set('q', q);
      if (era != null) params.set('era', era);
      return fetchEndpoint(`stats?${params}`);
    },
  };
})();
