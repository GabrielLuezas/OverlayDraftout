/**
 * Draftout Overlay — OBS Browser Source Logic
 * Reads config from URL params, fetches data + ranks, drives rotating widget.
 */
(() => {
  // ── Parse config ─────────────────────────────────────────────
  function parseConfig() {
    const p = new URLSearchParams(location.search);
    const bool = (key, def = true) =>
      p.has(key) ? (p.get(key) === '1' || p.get(key) === 'true') : def;

    return {
      username:          p.get('username')     || '',
      showRankIcon:      bool('showRankIcon',   true),
      showElo:           bool('showElo',        true),
      showWL:            bool('showWL',         true),
      showWinRate:       bool('showWinRate',    true),
      showStreak:        bool('showStreak',     true),
      showMatches:       bool('showMatches',    true),
      // Rotating slides
      showRankingSlide:  bool('showRankingSlide', true),
      showRecordsSlide:  bool('showRecordsSlide', true),
      showRecentSlide:   bool('showRecentSlide',  true),
      rotationSpeed:     parseInt(p.get('rotationSpeed') || '5', 10),
      // Appearance
      layout:            p.get('layout')    || 'vertical',
      position:          p.get('position')  || 'bottom-left',
      scale:             parseFloat(p.get('scale') || '1'),
      theme:             p.get('theme')     || 'dark',
      accent:            p.get('accent')    || '#6366f1',
      lang:              p.get('lang')      || 'es',
      refresh:           parseInt(p.get('refresh') || '60', 10),
    };
  }

  const cfg       = parseConfig();
  document.documentElement.lang = cfg.lang;
  const container = document.getElementById('ow-container');
  const page      = document.getElementById('ow-page');
  if (page) page.dataset.pos = cfg.position;

  let lastStats    = null;
  let ranks        = null;
  let leaderboard  = null;
  let refreshTimer = null;

  // ── Render helper ────────────────────────────────────────────
  function renderWidget(stats) {
    DraftoutWidget.render(container, stats, cfg, ranks, leaderboard);
    setTimeout(() => {
      const d = document.getElementById('ow-refresh-dot');
      if (d) {
        d.classList.add('pulsing');
        setTimeout(() => d.classList.remove('pulsing'), 700);
      }
    }, 50);
  }

  // ── Data refresh ─────────────────────────────────────────────
  async function refresh() {
    if (!cfg.username) {
      renderWidget(DraftoutWidget.MOCK);
      return;
    }
    try {
      const stats = await DraftoutAPI.getPlayerStats(cfg.username);
      lastStats = stats;
      // Refresh leaderboard too (rank may have changed)
      try {
        const limit = (stats.player?.rank || 20) + 5;
        leaderboard = await DraftoutAPI.getLeaderboard({ limit });
      } catch (_) {}
      renderWidget(stats);
    } catch (err) {
      console.error('[Draftout Overlay]', err);
      renderWidget(lastStats);
    }
  }

  // ── Init ─────────────────────────────────────────────────────
  async function init() {
    // Show mock immediately
    renderWidget(DraftoutWidget.MOCK);

    // Load ranks + initial leaderboard
    try { ranks = await DraftoutAPI.getRanks(); } catch (_) {}
    try { leaderboard = await DraftoutAPI.getLeaderboard({ limit: 25 }); } catch (_) {}

    // Load real player data
    await refresh();

    // Auto-refresh loop
    const interval = Math.max(15, cfg.refresh) * 1000;
    refreshTimer = setInterval(refresh, interval);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
