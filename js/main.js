/**
 * Draftout Studio — Setup Page Logic (main.js)
 * Full bilingual (ES/EN) i18n support, tabbed studio deck, stream simulator 2.0 & player avatar
 */
(() => {
  // ── i18n Translations Dictionary ──────────────────────────────
  const I18N = {
    es: {
      pageTitle: 'Draftout Studio — Overlay Esports Suite para OBS',
      pageDesc: 'Diseña y personaliza tu overlay competitivo de Draftout para OBS y Streamlabs en segundos. Estadísticas en tiempo real y estética esports premium.',
      headerTitle: 'DRAFTOUT STUDIO',
      headerSubtitle: 'Esports Broadcast HUD & Overlay Suite',
      headerBadge: 'STUDIO',
      lblPresets: 'Presets rápidos:',
      presetStreamer: 'Streamer Pro',
      presetCompetitive: 'Competitivo',
      presetMinimal: 'Minimalista',
      // Tabs
      tabPlayer: 'Jugador',
      tabDesign: 'Diseño',
      tabModules: 'Módulos',
      tabObs: 'OBS Setup',
      // Player Tab
      lblUsername: 'Nombre de usuario de Minecraft',
      phUsername: 'ej. bing_pigs',
      btnLoad: 'Cargar',
      lblDemoUsers: 'Ejemplos rápidos:',
      lblSuggestions: 'Jugadores sugeridos',
      lblSearchPlayers: 'Jugadores encontrados',
      lblSearchAction: u => `Cargar "${u}"`,
      lblStatsSummary: 'Estadísticas competitivas',
      lblWr: 'Win Rate',
      lblWl: 'V / D',
      lblPeakElo: 'Peak ELO',
      lblStreak: 'Racha',
      // Design Tab
      lblLayout: 'Formato del Overlay',
      layoutVert: 'Tarjeta (Vertical)',
      layoutVertDesc: 'Compacta · 2 filas · Ideal esports',
      layoutHori: 'Barra (Horizontal)',
      layoutHoriDesc: 'Tira ancha · 1 fila · Estilo clásico',
      lblTheme: 'Tema de Color',
      lblThemeSub: 'Glassmorphism pulido',
      themeDark: 'Oscuro',
      themeDarker: 'OLED',
      themeMidnight: 'Midnight',
      themeCyberpunk: 'Cyberpunk',
      themeEmerald: 'Esmeralda',
      themeCrimson: 'Carmesí',
      themeAmethyst: 'Amatista',
      themeLight: 'Claro',
      lblScale: 'Tamaño / Escala',
      lblAccent: 'Color de Acento / Aura',
      // Modules Tab
      secDisplay: 'Elementos del HUD',
      optRankIcon: 'Avatar del jugador',
      optAvatarSub: 'Cabeza Minecraft de tu skin',
      optElo: 'Puntos ELO',
      optEloSub: 'Puntuación actual en directo',
      optWl: 'Victorias / Derrotas',
      optWlSub: 'Contador W / L de la era',
      optWinrate: 'Win Rate (%)',
      optWinrateSub: 'Porcentaje de victoria',
      optStreak: 'Racha actual',
      optStreakSub: 'Victorias consecutivas',
      optMatches: 'Partidas recientes',
      optMatchesSub: 'Cabezas de rivales (+/- ELO)',
      optPeak: 'Peak ELO (Récord)',
      optPeakSub: 'Máxima puntuación alcanzada',
      optGlobalRank: 'Puesto en ranking (#)',
      optGlobalRankSub: 'Posición de leaderboard',
      secRotation: 'Rotación de Paneles Dinámicos',
      lblRotSpeed: 'Velocidad de transición',
      optRankingSlide: 'Slide 2: Ranking y barra de progreso',
      optLastmatchSlide: 'Slide 3: Última partida detallada',
      optRecordsSlide: 'Slide 4: Récords y siguiente rival',
      optRecentSlide: 'Slide 5: Últimas partidas con cabezas',
      secTiming: 'Actualización de Datos',
      lblRefresh: 'Consultar API cada…',
      ref60s: '1 min',
      ref120s: '2 min',
      ref300s: '5 min',
      // OBS Tab
      secPosition: 'Posición en la Pantalla',
      posTopLeft: '↖ Arriba Izq',
      posTopRight: 'Arriba Der ↗',
      posMidLeft: '← Medio Izq',
      posMidRight: 'Medio Der →',
      posBottomLeft: '↙ Abajo Izq',
      posBottomRight: 'Abajo Der ↘',
      urlLabel: 'URL para Fuente de Navegador (OBS)',
      urlBadge: 'Listo para transmitir',
      urlHint: '⚠️ Al cambiar el diseño, copia la URL de nuevo a OBS.',
      urlPh: 'Configura tu usuario primero…',
      btnCopy: 'Copiar URL',
      btnCopied: '¡Copiado!',
      btnOpenTab: 'Abrir',
      obsTitle: 'Pasos de Configuración en OBS',
      stepObs1: 'En OBS, crea una fuente: <strong>Navegador</strong> (Browser Source).',
      stepObs2: 'Pega la <strong>URL copiada</strong> en el campo URL.',
      stepObs3: 'Ajusta resolución a <code>1920 × 1080</code> (ancho x alto).',
      stepObs4: 'Activa <strong>"Permitir transparencia"</strong> y guarda. ¡A streamear!',
      // Simulator Studio
      simLiveText: 'SIMULADOR EN DIRECTO',
      lblSceneBg: 'Escena de fondo:',
      btnCopyUrlShort: 'Copiar URL',
      statusInit: 'Introduce tu usuario o usa un demo rápido',
      statusLoading: u => `Cargando datos de ${u}…`,
      statusNotFound: u => `Jugador "${u}" no encontrado en Draftout`,
      statusCors: 'CORS bloqueado desde file://. Vista previa usa datos simulados — cargará datos reales en OBS',
      statusOk: data => {
        const p = data?.player, r = data?.record;
        return p ? `${p.username} · ${p.rankName} · ${p.elo} ELO · ${r?.wins ?? 0}V ${r?.losses ?? 0}D` : '';
      },
      // Discord Contact
      contactTitle: '¿Sugerencias o Bugs?',
      contactSub: 'Contactame en Discord: <strong>@GabrielLucifer22</strong>',
    },
    en: {
      pageTitle: 'Draftout Studio — Esports Overlay Suite for OBS',
      pageDesc: 'Design and customize your competitive Draftout overlay for OBS and Streamlabs in seconds. Real-time stats, smart rotation, and premium esports design.',
      headerTitle: 'DRAFTOUT STUDIO',
      headerSubtitle: 'Esports Broadcast HUD & Overlay Suite',
      headerBadge: 'STUDIO',
      lblPresets: 'Quick Presets:',
      presetStreamer: 'Streamer Pro',
      presetCompetitive: 'Competitive',
      presetMinimal: 'Minimalist',
      // Tabs
      tabPlayer: 'Player',
      tabDesign: 'Design',
      tabModules: 'Modules',
      tabObs: 'OBS Setup',
      // Player Tab
      lblUsername: 'Minecraft Username',
      phUsername: 'e.g. bing_pigs',
      btnLoad: 'Load',
      lblDemoUsers: 'Quick demos:',
      lblSuggestions: 'Suggested players',
      lblSearchPlayers: 'Found players',
      lblSearchAction: u => `Load "${u}"`,
      lblStatsSummary: 'Competitive Statistics',
      lblWr: 'Win Rate',
      lblWl: 'W / L',
      lblPeakElo: 'Peak ELO',
      lblStreak: 'Streak',
      // Design Tab
      lblLayout: 'Overlay Format',
      layoutVert: 'Card (Vertical)',
      layoutVertDesc: 'Compact · 2 rows · Esports ready',
      layoutHori: 'Bar (Horizontal)',
      layoutHoriDesc: 'Wide strip · 1 row · Classic HUD',
      lblTheme: 'Color Theme',
      lblThemeSub: 'Polished glassmorphism',
      themeDark: 'Dark',
      themeDarker: 'OLED',
      themeMidnight: 'Midnight',
      themeCyberpunk: 'Cyberpunk',
      themeEmerald: 'Emerald',
      themeCrimson: 'Crimson',
      themeAmethyst: 'Amethyst',
      themeLight: 'Light',
      lblScale: 'Size / Scale',
      lblAccent: 'Accent / Aura Color',
      // Modules Tab
      secDisplay: 'HUD Elements',
      optRankIcon: 'Player Avatar',
      optAvatarSub: 'Minecraft skin head avatar',
      optElo: 'ELO Points',
      optEloSub: 'Real-time live score',
      optWl: 'Wins / Losses',
      optWlSub: 'W / L counter for current era',
      optWinrate: 'Win Rate (%)',
      optWinrateSub: 'Victory percentage',
      optStreak: 'Current Streak',
      optStreakSub: 'Consecutive wins',
      optMatches: 'Recent Matches',
      optMatchesSub: 'Opponent heads (+/- ELO)',
      optPeak: 'Peak ELO (Record)',
      optPeakSub: 'All-time highest rating',
      optGlobalRank: 'Leaderboard Rank (#)',
      optGlobalRankSub: 'Global rank standing',
      secRotation: 'Dynamic Panels Rotation',
      lblRotSpeed: 'Transition speed',
      optRankingSlide: 'Slide 2: Ranking & progress bar',
      optLastmatchSlide: 'Slide 3: Last match details',
      optRecordsSlide: 'Slide 4: Records & next rival',
      optRecentSlide: 'Slide 5: Recent matches with heads',
      secTiming: 'Data Refresh',
      lblRefresh: 'Poll API every…',
      ref60s: '1 min',
      ref120s: '2 min',
      ref300s: '5 min',
      // OBS Tab
      secPosition: 'Screen Position',
      posTopLeft: '↖ Top Left',
      posTopRight: 'Top Right ↗',
      posMidLeft: '← Middle Left',
      posMidRight: 'Middle Right →',
      posBottomLeft: '↙ Bottom Left',
      posBottomRight: 'Bottom Right ↘',
      urlLabel: 'Browser Source URL (OBS)',
      urlBadge: 'Ready to stream',
      urlHint: '⚠️ When changing settings, copy the URL to OBS again.',
      urlPh: 'Set your username first…',
      btnCopy: 'Copy URL',
      btnCopied: 'Copied!',
      btnOpenTab: 'Open',
      obsTitle: 'OBS Setup Instructions',
      stepObs1: 'In OBS, add a new source: <strong>Browser Source</strong>.',
      stepObs2: 'Paste the <strong>copied URL</strong> into the URL field.',
      stepObs3: 'Set the resolution to <code>1920 × 1080</code> (width x height).',
      stepObs4: 'Enable <strong>"Allow Transparency"</strong> and save. Enjoy streaming!',
      // Simulator Studio
      simLiveText: 'LIVE SIMULATOR',
      lblSceneBg: 'Scene Background:',
      btnCopyUrlShort: 'Copy URL',
      statusInit: 'Enter your username or click a quick demo',
      statusLoading: u => `Loading data for ${u}…`,
      statusNotFound: u => `Player "${u}" not found on Draftout`,
      statusCors: 'CORS blocked from file://. Preview uses demo stats — real stats load in OBS',
      statusOk: data => {
        const p = data?.player, r = data?.record;
        return p ? `${p.username} · ${p.rankName} · ${p.elo} ELO · ${r?.wins ?? 0}W ${r?.losses ?? 0}L` : '';
      },
      // Discord Contact
      contactTitle: 'Suggestions or Bugs?',
      contactSub: 'Contact me on Discord: <strong>@GabrielLucifer22</strong>',
    },
  };

  // ── Default config ────────────────────────────────────────────
  const DEFAULTS = {
    username:          '',
    // Element toggles
    showRankIcon:      true,
    showElo:           true,
    showWL:            true,
    showWinRate:       true,
    showStreak:        true,
    showMatches:       true,
    showPeak:          true,
    showGlobalRank:    true,
    // Rotation
    rotationSpeed:     5,
    showRankingSlide:  true,
    showLastmatchSlide:true,
    showRecordsSlide:  true,
    showRecentSlide:   true,
    // Appearance
    layout:            'vertical',
    position:          'bottom-left',
    scale:             1,
    theme:             'dark',
    accent:            '#6366f1',
    lang:              'es',
    // Timing
    refresh:           60,
  };

  const ACCENT_SWATCHES = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f97316',
    '#eab308', '#22c55e', '#06b6d4', '#ffffff',
  ];

  let cfg           = { ...DEFAULTS };
  let liveStats     = null;
  let ranks         = null;
  let leaderboard   = null;
  let currentStatus = { type: '', key: 'statusInit', params: null };

  const $ = (id) => document.getElementById(id);

  function cfgToParams(c) {
    const p = new URLSearchParams();
    p.set('username', c.username);
    const bools = [
      'showRankIcon','showElo','showWL','showWinRate','showStreak','showMatches',
      'showRankingSlide','showRecordsSlide','showRecentSlide',
    ];
    bools.forEach(k => p.set(k, c[k] ? '1' : '0'));
    p.set('rotationSpeed', c.rotationSpeed);
    p.set('layout',   c.layout || 'vertical');
    p.set('position', c.position);
    p.set('scale',    c.scale);
    p.set('theme',    c.theme);
    p.set('accent',   c.accent);
    p.set('lang',     c.lang);
    p.set('refresh',  c.refresh);
    return p.toString();
  }

  function getOverlayURL() {
    const base = location.href.replace(/[^/]*$/, '').replace(/\/$/, '');
    return `${base}/overlay.html?${cfgToParams(cfg)}`;
  }

  // ── Status rendering ─────────────────────────────────────────
  function setStatusKey(type, key, params = null) {
    currentStatus = { type, key, params };
    renderStatus();
  }

  function renderStatus() {
    const dot = $('status-dot');
    const txt = $('status-text');
    if (!dot || !txt) return;

    dot.className = `status-dot ${currentStatus.type}`;
    const dict = I18N[cfg.lang] || I18N.es;
    const entry = dict[currentStatus.key];
    if (typeof entry === 'function') {
      txt.textContent = entry(currentStatus.params);
    } else if (typeof entry === 'string') {
      txt.textContent = entry;
    } else {
      txt.textContent = currentStatus.key || '';
    }
  }

  // ── Hero Profile Card Sync ───────────────────────────────────
  function updateProfileHero() {
    const isLive = !!liveStats;
    const p = liveStats?.player || DraftoutWidget.MOCK.player;
    const r = liveStats?.record || DraftoutWidget.MOCK.record;
    const a = liveStats?.aggregate || DraftoutWidget.MOCK.aggregate;

    const uname = cfg.username.trim() || p.username || 'YourUsername';
    const rColor = p?.rankColor || (isLive ? '#888888' : '#D7D284');
    const rName  = p?.rankName  || (isLive ? 'Unranked' : 'Evoker III');
    const eloVal = p?.elo != null ? Number(p.elo).toLocaleString() : (isLive ? '--' : '1,566');

    const uEl = $('deck-username');
    if (uEl) uEl.textContent = uname;

    const rEl = $('deck-rank-name');
    if (rEl) {
      rEl.textContent = rName;
      rEl.style.color = rColor;
    }

    const dotEl = $('deck-rank-dot');
    if (dotEl) {
      dotEl.style.background = rColor;
      dotEl.style.color = rColor;
    }

    const eloEl = $('deck-elo-val');
    if (eloEl) eloEl.textContent = eloVal;

    const avImg = $('deck-avatar-img');
    if (avImg) {
      const cleanUser = uname.toLowerCase() === 'yourusername' ? 'Steve' : uname;
      avImg.src = `https://mc-heads.net/avatar/${encodeURIComponent(cleanUser)}/52`;
      avImg.style.borderColor = rColor;
    }

    const avGlow = $('deck-avatar-glow');
    if (avGlow) avGlow.style.background = rColor;

    // Mini stats
    const wrEl = $('stat-wr');
    if (wrEl) wrEl.textContent = r?.winRate != null ? `${Math.round(r.winRate * 100)}%` : (isLive ? '0%' : '88%');

    const wlEl = $('stat-wl');
    if (wlEl) wlEl.innerHTML = `${r?.wins ?? 0}W <span class="stat-loss">${r?.losses ?? 0}L</span>`;

    const peakEl = $('stat-peak');
    if (peakEl) peakEl.textContent = a?.peakElo != null ? Number(a.peakElo).toLocaleString() : (isLive ? '--' : '1,590');

    const streakEl = $('stat-streak');
    if (streakEl) streakEl.textContent = a?.bestStreak != null ? a.bestStreak : (isLive ? '0' : '12');

    const srcEl = $('deck-data-source');
    if (srcEl) srcEl.textContent = liveStats ? (cfg.lang === 'es' ? 'Datos en directo ✓' : 'Live Data ✓') : (cfg.lang === 'es' ? 'Datos demostración' : 'Demo Data');
  }

  // ── i18n Language Switch ─────────────────────────────────────
  function applyLanguage(lang) {
    if (!I18N[lang]) lang = 'es';
    cfg.lang = lang;
    try { localStorage.setItem('draftout_overlay_lang', lang); } catch (_) {}

    document.documentElement.lang = lang;
    const t = I18N[lang];
    if (t.pageTitle) document.title = t.pageTitle;
    const metaTitle = $('meta-title');
    if (metaTitle && t.pageTitle) metaTitle.textContent = t.pageTitle;
    const metaDesc = $('meta-desc');
    if (metaDesc && t.pageDesc) metaDesc.setAttribute('content', t.pageDesc);

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key] !== undefined) {
        el.innerHTML = t[key];
      }
    });

    // Update input placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.dataset.i18nPh;
      if (t[key] !== undefined) {
        el.placeholder = t[key];
      }
    });

    // Language pills
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.langBtn === lang);
    });

    const loadBtn = $('btn-load');
    if (loadBtn && !loadBtn.disabled) loadBtn.textContent = t.btnLoad;

    const copyBtn = $('btn-copy');
    if (copyBtn && !copyBtn.classList.contains('copied')) copyBtn.textContent = t.btnCopy;

    renderStatus();
    updateProfileHero();
    updatePreview();
  }

  // ── Preview Render ───────────────────────────────────────────
  function updatePreview() {
    const wrap = $('preview-wrap');
    if (wrap) wrap.dataset.pos = cfg.position;
    DraftoutWidget.render($('preview-widget'), liveStats, cfg, ranks, leaderboard);
    const urlOut = $('url-output');
    if (urlOut) urlOut.value = getOverlayURL();
    updateProfileHero();
  }

  // ── Load Player Data ─────────────────────────────────────────
  async function loadPlayer() {
    const username = cfg.username.trim();
    if (!username) {
      setStatusKey('', 'statusInit');
      liveStats = null;
      updatePreview();
      return;
    }

    setStatusKey('loading', 'statusLoading', username);
    const btn = $('btn-load');
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span>';

    try {
      const data = await DraftoutAPI.getPlayerStats(username);
      if (!data.player) {
        setStatusKey('error', 'statusNotFound', username);
        liveStats = null;
      } else {
        liveStats = data;
        const p = data.player, r = data.record;
        setStatusKey('ok', 'statusOk', { player: p, record: r });
        try {
          const limit = (p.rank || 20) + 5;
          leaderboard = await DraftoutAPI.getLeaderboard({ limit });
        } catch (_) {}
      }
    } catch (err) {
      console.error('[Draftout]', err);
      setStatusKey('error', 'statusCors');
      liveStats = null;
    } finally {
      btn.disabled = false;
      btn.textContent = I18N[cfg.lang].btnLoad;
      updatePreview();
    }
  }

  // ── Apply Preset ─────────────────────────────────────────────
  function applyPreset(presetKey) {
    document.querySelectorAll('[data-preset]').forEach(b => {
      b.classList.toggle('active', b.dataset.preset === presetKey);
    });

    if (presetKey === 'streamer') {
      cfg.layout = 'vertical';
      cfg.theme  = 'dark';
      cfg.rotationSpeed = 5;
      cfg.scale  = 1.0;
      cfg.showRankIcon = true;
      cfg.showRankingSlide = true;
      cfg.showRecordsSlide = true;
      cfg.showRecentSlide  = true;
    } else if (presetKey === 'competitive') {
      cfg.layout = 'vertical';
      cfg.theme  = 'cyberpunk';
      cfg.rotationSpeed = 3;
      cfg.scale  = 1.05;
      cfg.showRankIcon = true;
      cfg.showRankingSlide = true;
      cfg.showRecordsSlide = false;
      cfg.showRecentSlide  = true;
    } else if (presetKey === 'minimal') {
      cfg.layout = 'horizontal';
      cfg.theme  = 'darker';
      cfg.rotationSpeed = 8;
      cfg.scale  = 0.95;
      cfg.showRankIcon = true;
      cfg.showRankingSlide = true;
      cfg.showRecordsSlide = false;
      cfg.showRecentSlide  = false;
    }

    syncControlsToConfig();
    updatePreview();
  }

  function syncControlsToConfig() {
    // Layout buttons
    document.querySelectorAll('[data-layout-btn]').forEach(b => {
      b.classList.toggle('active', b.dataset.layoutBtn === cfg.layout);
    });

    // Theme buttons
    document.querySelectorAll('[data-theme-btn]').forEach(b => {
      b.classList.toggle('active', b.dataset.themeBtn === cfg.theme);
    });

    // Position buttons
    document.querySelectorAll('.pos-matrix-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.pos === cfg.position);
    });

    // Rotation buttons
    document.querySelectorAll('[data-rotation-btn]').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.rotationBtn, 10) === cfg.rotationSpeed);
    });

    // Scale
    const scaleSlider = $('scale-slider'), scaleVal = $('scale-val');
    if (scaleSlider && scaleVal) {
      scaleSlider.value = cfg.scale;
      scaleVal.textContent = cfg.scale + 'x';
    }

    // Swatches
    const colorInput = $('accent-color');
    if (colorInput) colorInput.value = cfg.accent;
    const hexText = $('accent-hex');
    if (hexText) hexText.textContent = cfg.accent.toUpperCase();

    // Checkboxes
    const map = {
      'toggle-rank-icon':     'showRankIcon',
      'toggle-elo':           'showElo',
      'toggle-wl':            'showWL',
      'toggle-winrate':       'showWinRate',
      'toggle-streak':        'showStreak',
      'toggle-matches':       'showMatches',
      'toggle-peak':          'showPeak',
      'toggle-global-rank':   'showGlobalRank',
      'toggle-ranking-slide': 'showRankingSlide',
      'toggle-records-slide': 'showRecordsSlide',
      'toggle-recent-slide':  'showRecentSlide',
    };
    Object.entries(map).forEach(([id, k]) => {
      const el = $(id);
      if (el) el.checked = !!cfg[k];
    });
  }



  // ── Wire Inputs & Interactions ───────────────────────────────
  function wireInputs() {
    // 1. Studio Tabs
    document.querySelectorAll('.deck-tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const tab = tabBtn.dataset.tab;
        document.querySelectorAll('.deck-tab').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        tabBtn.classList.add('active');
        tabBtn.setAttribute('aria-selected', 'true');
        const targetPanel = $(`tab-panel-${tab}`);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });

    // 2. Presets in header
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
    });

    // 3. Username Autocomplete & Load
    $('btn-load').addEventListener('click', loadPlayer);
    $('input-username').addEventListener('input', (e) => {
      cfg.username = e.target.value;
      updatePreview();
    });
    $('input-username').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') loadPlayer();
    });

    // 4. Quick Demo User Chips
    document.querySelectorAll('.demo-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const uname = chip.dataset.user;
        const uInput = $('input-username');
        if (uInput) uInput.value = uname;
        cfg.username = uname;
        loadPlayer();
      });
    });

    // 5. Layout Selectors
    document.querySelectorAll('[data-layout-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        cfg.layout = btn.dataset.layoutBtn;
        document.querySelectorAll('[data-layout-btn]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updatePreview();
      });
    });

    // 6. Theme Grid
    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        cfg.theme = btn.dataset.themeBtn;
        document.querySelectorAll('[data-theme-btn]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updatePreview();
      });
    });

    // 7. Scale Slider
    const scaleSlider = $('scale-slider'), scaleVal = $('scale-val');
    scaleSlider.addEventListener('input', () => {
      cfg.scale = parseFloat(scaleSlider.value);
      scaleVal.textContent = cfg.scale + 'x';
      updatePreview();
    });

    // 8. Accent Color & Swatches
    const colorInput = $('accent-color');
    const hexText    = $('accent-hex');
    const swatchWrap = $('accent-swatches');

    function syncSwatches(hex) {
      if (hexText) hexText.textContent = hex.toUpperCase();
      swatchWrap.querySelectorAll('.color-swatch').forEach(s => {
        s.classList.toggle('active', s.title.toLowerCase() === hex.toLowerCase());
      });
    }

    colorInput.addEventListener('input', () => {
      cfg.accent = colorInput.value;
      syncSwatches(cfg.accent);
      updatePreview();
    });

    swatchWrap.innerHTML = '';
    ACCENT_SWATCHES.forEach(hex => {
      const sw = document.createElement('button');
      sw.className = `color-swatch${hex.toLowerCase() === cfg.accent.toLowerCase() ? ' active' : ''}`;
      sw.style.background = hex;
      sw.title = hex;
      sw.addEventListener('click', () => {
        cfg.accent = hex;
        colorInput.value = hex;
        syncSwatches(hex);
        updatePreview();
      });
      swatchWrap.appendChild(sw);
    });

    // 9. Element Toggles
    const toggleMap = {
      'toggle-rank-icon':     'showRankIcon',
      'toggle-elo':           'showElo',
      'toggle-wl':            'showWL',
      'toggle-winrate':       'showWinRate',
      'toggle-streak':        'showStreak',
      'toggle-matches':       'showMatches',
      'toggle-peak':          'showPeak',
      'toggle-global-rank':   'showGlobalRank',
      // Slide toggles
      'toggle-ranking-slide': 'showRankingSlide',
      'toggle-records-slide': 'showRecordsSlide',
      'toggle-recent-slide':  'showRecentSlide',
    };
    Object.entries(toggleMap).forEach(([id, key]) => {
      const el = $(id);
      if (!el) return;
      el.checked = !!cfg[key];
      el.addEventListener('change', () => {
        cfg[key] = el.checked;
        updatePreview();
      });
    });

    // 10. Rotation speed
    document.querySelectorAll('[data-rotation-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        cfg.rotationSpeed = parseInt(btn.dataset.rotationBtn, 10);
        document.querySelectorAll('[data-rotation-btn]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updatePreview();
      });
    });

    // 11. Refresh rate
    document.querySelectorAll('[data-refresh-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        cfg.refresh = parseInt(btn.dataset.refreshBtn, 10);
        document.querySelectorAll('[data-refresh-btn]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updatePreview();
      });
    });

    // 12. Position matrix buttons & canvas corner targets
    function setPosition(pos) {
      cfg.position = pos;
      document.querySelectorAll('.pos-matrix-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.pos === pos);
      });
      updatePreview();
    }

    document.querySelectorAll('.pos-matrix-btn').forEach(btn => {
      btn.addEventListener('click', () => setPosition(btn.dataset.pos));
    });

    document.querySelectorAll('.sim-corner-target').forEach(t => {
      t.addEventListener('click', () => setPosition(t.dataset.corner));
    });

    // 13. Scene Background Switcher
    document.querySelectorAll('.scene-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const scene = pill.dataset.scene;
        document.querySelectorAll('.scene-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const sim = $('screen-sim');
        if (sim) sim.dataset.scene = scene;
      });
    });

    // 14. Language Capsules
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.addEventListener('click', () => applyLanguage(btn.dataset.langBtn));
    });

    // 15. Open in tab
    const openBtn = $('btn-open-preview');
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        window.open(getOverlayURL(), '_blank');
      });
    }
  }

  // ── Copy URL Helpers ─────────────────────────────────────────
  function setupCopyBtns() {
    async function doCopy(btnEl) {
      const url = $('url-output').value;
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        $('url-output').select();
        document.execCommand('copy');
      }

      const originalText = btnEl.innerHTML;
      btnEl.innerHTML = I18N[cfg.lang].btnCopied;
      btnEl.classList.add('copied');
      setTimeout(() => {
        btnEl.innerHTML = originalText;
        btnEl.classList.remove('copied');
      }, 2500);
    }

    const copyBtn1 = $('btn-copy');
    if (copyBtn1) copyBtn1.addEventListener('click', () => doCopy(copyBtn1));

    const copyBtn2 = $('sim-copy-btn');
    if (copyBtn2) copyBtn2.addEventListener('click', () => doCopy(copyBtn2));

    $('url-output').addEventListener('click', function() { this.select(); });
  }

  // ── Init ─────────────────────────────────────────────────────
  async function init() {
    try {
      const saved = localStorage.getItem('draftout_overlay_lang');
      if (saved && (saved === 'es' || saved === 'en')) {
        cfg.lang = saved;
      }
    } catch (_) {}

    wireInputs();
    setupCopyBtns();
    syncControlsToConfig();
    applyLanguage(cfg.lang);

    // Background load of real ranks + leaderboard
    try {
      ranks = await DraftoutAPI.getRanks();
      updatePreview();
    } catch (_) {}

    try {
      leaderboard = await DraftoutAPI.getLeaderboard({ limit: 50 });
      updatePreview();
    } catch (_) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
