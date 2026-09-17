/**
 * Draftout Overlay Widget Renderer — with vertical/stacked and horizontal layouts
 * Shared between setup page (preview) and overlay.html (OBS source)
 */
const DraftoutWidget = (() => {
  // ── Mock data ────────────────────────────────────────────────
  const MOCK = {
    player: {
      username: 'YourUsername', elo: 1566, rankName: 'Evoker III',
      rankColor: '#D7D284', rank: 7, ranked: true, eraId: 2,
    },
    record: {
      wins: 14, losses: 2, draws: 0, winRate: 0.875,
      matches: 16, completedMatches: 12,
      averageFinishTime: 1436573, averageGoals: 4.33,
    },
    aggregate: { peakElo: 1590, bestStreak: 12, fastestWinMs: 861628, forfeitCount: 0 },
    matches: [
      { participants: [{ username: 'YourUsername', won: true, score: 25, eloChange: +21 }, { username: 'DragonSlayer99', won: false, score: 14, eloChange: -21 }] },
      { participants: [{ username: 'YourUsername', won: true, score: 25, eloChange: +18 }, { username: 'CraftMaster_X',  won: false, score: 21, eloChange: -18 }] },
      { participants: [{ username: 'YourUsername', won: true, score: 25, eloChange: +15 }, { username: 'NightOwl_Pro',   won: false, score: 9, eloChange: -15 }] },
      { participants: [{ username: 'YourUsername', won: false, score: 11, eloChange: -10 }, { username: 'SpeedRunner42',  won: true, score: 25, eloChange: +10 }] },
      { participants: [{ username: 'YourUsername', won: true, score: 25, eloChange: +12 }, { username: 'BlockBreaker7',  won: false, score: 0, eloChange: -12 }] },
    ],
  };

  const MOCK_LEADERBOARD = {
    rows: [
      { rank: 6, username: 'ProRival6', elo: 1620, rankColor: '#D7D284', rankName: 'Evoker III' },
      { rank: 7, username: 'YourUsername', elo: 1566 },
      { rank: 8, username: 'Below8', elo: 1520 },
    ]
  };

  // ── Helpers ──────────────────────────────────────────────────
  function computeStreak(matches, username) {
    if (!matches?.length) return { count: 0, type: 'none' };
    let type = null, count = 0;
    for (const m of matches) {
      const p = m.participants?.find(pt => pt.username?.toLowerCase() === username?.toLowerCase());
      if (!p) continue;
      const r = p.won ? 'win' : 'loss';
      if (!type) { type = r; count = 1; }
      else if (r === type) count++;
      else break;
    }
    return { count, type: type || 'none' };
  }

  function matchParticipants(match, username) {
    const me  = match.participants?.find(pt => pt.username?.toLowerCase() === username?.toLowerCase());
    const opp = match.participants?.find(pt => pt.username?.toLowerCase() !== username?.toLowerCase());
    return { me, opp };
  }

  const DEFAULT_RANKS = [
    { name: 'Silverfish I', min: 0, max: 99, color: '#ACB1B4' },
    { name: 'Silverfish II', min: 100, max: 199, color: '#ACB1B4' },
    { name: 'Silverfish III', min: 200, max: 299, color: '#ACB1B4' },
    { name: 'Silverfish IV', min: 300, max: 399, color: '#ACB1B4' },
    { name: 'Silverfish V', min: 400, max: 499, color: '#ACB1B4' },
    { name: 'Slime I', min: 500, max: 599, color: '#77B07D' },
    { name: 'Slime II', min: 600, max: 699, color: '#77B07D' },
    { name: 'Slime III', min: 700, max: 799, color: '#77B07D' },
    { name: 'Slime IV', min: 800, max: 899, color: '#77B07D' },
    { name: 'Slime V', min: 900, max: 999, color: '#77B07D' },
    { name: 'Vex I', min: 1000, max: 1099, color: '#A7C6D7' },
    { name: 'Vex II', min: 1100, max: 1199, color: '#A7C6D7' },
    { name: 'Vex III', min: 1200, max: 1299, color: '#A7C6D7' },
    { name: 'Evoker I', min: 1300, max: 1399, color: '#D7D284' },
    { name: 'Evoker II', min: 1400, max: 1499, color: '#D7D284' },
    { name: 'Evoker III', min: 1500, max: 1599, color: '#D7D284' },
    { name: 'Phantom I', min: 1600, max: 1699, color: '#5970C0' },
    { name: 'Phantom II', min: 1700, max: 1799, color: '#5970C0' },
    { name: 'Guardian I', min: 1800, max: 1899, color: '#36775F' },
    { name: 'Guardian II', min: 1900, max: 1999, color: '#36775F' },
    { name: 'Warden', min: 2000, max: null, color: '#1CCEDA' },
  ];

  function findRankBands(elo, ranks) {
    const list = (ranks && ranks.length) ? ranks : DEFAULT_RANKS;
    if (!list?.length || elo == null) return {};
    const sorted = [...list].sort((a, b) => a.min - b.min);
    for (let i = 0; i < sorted.length; i++) {
      const r = sorted[i];
      if (elo >= r.min && (r.max == null || elo < r.max)) {
        return {
          current:  r,
          next:     sorted[i + 1] || null,
          aboveMin: elo - r.min,
          toNext:   sorted[i + 1] ? sorted[i + 1].min - elo : null,
          pct:      sorted[i + 1]
            ? Math.min(100, Math.round(((elo - r.min) / (sorted[i + 1].min - r.min)) * 100))
            : 100,
        };
      }
    }
    return {};
  }

  const fmt   = n  => (n == null ? '--' : Number(n).toLocaleString());
  const fmtWR = wr => (wr == null ? '--' : `${Math.round(wr * 100)}%`);

  // ── i18n strings ─────────────────────────────────────────────
  const STRINGS = {
    en: {
      RANK:       'RANK',
      WIN_RATE:   'WIN RATE',
      ELO:        'ELO',
      MATCHES:    'MATCHES',
      PEAK_ELO:   'PEAK ELO',
      MAX_RANK:   'MAX',
      NO_RECENT:  'No matches',
      TOP_LB:     '#1 RANKING',
      LAST_WIN:   'Win',
      LAST_LOSS:  'Loss',
      eloToNext:  n => `A ${n} ELO`,
      eloRival:   n => `A ${n} ELO`,
      aboveRival: u => `↑ ${u}`,
      aboveMin:   (n, name) => `+${n} · ${name}`,
    },
    es: {
      RANK:       'RANK',
      WIN_RATE:   'WIN RATE',
      ELO:        'ELO',
      MATCHES:    'PARTIDAS',
      PEAK_ELO:   'PEAK ELO',
      MAX_RANK:   'MAX',
      NO_RECENT:  'Sin partidas',
      TOP_LB:     '#1 RANKING',
      LAST_WIN:   'Victoria',
      LAST_LOSS:  'Derrota',
      eloToNext:  n => `A ${n} ELO`,
      eloRival:   n => `A ${n} ELO`,
      aboveRival: u => `↑ ${u}`,
      aboveMin:   (n, name) => `+${n} · ${name}`,
    },
  };
  const T = lang => STRINGS[lang] || STRINGS.es;

  function mcHead(username, size = 32, cls = 'ow-mc-head') {
    if (!username || username === 'unknown') {
      return `<div class="${cls} ow-mc-head-fallback"></div>`;
    }
    return `<img class="${cls}" 
      src="https://mc-heads.net/avatar/${encodeURIComponent(username)}/${size}"
      alt="${username}"
      loading="lazy"
      onerror="this.onerror=null;this.replaceWith(document.createElement('div'));this.className='${cls} ow-mc-head-fallback'"/>`;
  }

  function playerAvatar(username, rColor, size = 36) {
    const uname = (!username || username === 'unknown') ? 'Steve' : username;
    return `<div class="ow-player-avatar notranslate" translate="no" style="--rc:${rColor}">
      <img class="ow-avatar-img"
        src="https://mc-heads.net/avatar/${encodeURIComponent(uname)}/${size}"
        alt="${uname}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://mc-heads.net/avatar/Steve/${size}'"
      />
    </div>`;
  }

  // ════════════════════════════════════════════════════════════
  // SLIDE 1 — Stats: Win Rate & Matches
  // ════════════════════════════════════════════════════════════
  function slideMain(stats, cfg) {
    const { player, record } = stats;
    const t = T(cfg.lang);
    const isVert = (cfg.layout || 'vertical') !== 'horizontal';

    if (isVert) {
      return `
        <div class="ow-slide-row">
          <div class="ow-stat-item">
            <span class="ow-bval ow-green">${fmtWR(record?.winRate)}</span>
            <span class="ow-meta-label">${t.WIN_RATE}</span>
          </div>
          <div class="ow-stat-item" style="text-align:right">
            <span class="ow-bval">${record?.wins ?? 0}W <span class="ow-losses">${record?.losses ?? 0}L</span></span>
            <span class="ow-meta-label">${record?.completedMatches ?? 0} ${t.MATCHES}</span>
          </div>
        </div>`;
    }

    return `
      <div class="ow-elo-block">
        <div class="ow-elo-val">${fmt(player?.elo)}</div>
        <div class="ow-meta-label">${t.ELO}</div>
      </div>
      <div class="ow-sep-line"></div>
      <div class="ow-block">
        <div class="ow-bval ow-green" style="font-size:20px">${fmtWR(record?.winRate)}</div>
        <div class="ow-meta-label">${t.WIN_RATE}</div>
      </div>`;
  }

  // ════════════════════════════════════════════════════════════
  // SLIDE 2 — Ranking & Progress Bar
  // ════════════════════════════════════════════════════════════
  function slideRanking(stats, cfg, ranks) {
    const { player } = stats;
    const elo = player?.elo;
    const isUnranked = (elo == null || !player?.ranked || player?.rankName?.toLowerCase() === 'unranked');
    const { current, next, pct } = findRankBands(elo, ranks);
    const t = T(cfg.lang);
    const isVert = (cfg.layout || 'vertical') !== 'horizontal';

    // Target rank label
    let targetHtml = '';
    if (isUnranked) {
      const firstTarget = (ranks && ranks[0]) || DEFAULT_RANKS[0]; // Silverfish I
      targetHtml = `<div class="ow-next-rank" style="color:${firstTarget?.color || '#ACB1B4'}">▲ ${firstTarget?.name || 'Silverfish I'}</div>`;
    } else if (next) {
      targetHtml = `<div class="ow-next-rank" style="color:${next.color || 'var(--rc)'}">▲ ${next.name}</div>`;
    } else {
      // Truly top rank (Titan/Apex with elo >= 1800)
      targetHtml = `<div class="ow-bval ow-gold" style="font-size:13px">🏆 MAX</div>`;
    }

    const fillPct  = isUnranked ? 0 : (pct || 0);
    const barColor = isUnranked ? 'rgba(255,255,255,0.15)' : (current?.color || 'var(--rc)');

    if (isVert) {
      return `
        <div class="ow-ranking-vert">
          <div class="ow-ranking-vert-header">
            <div class="ow-bval ow-purple">#${player?.rank ?? '--'} <span class="ow-meta-label">${t.RANK}</span></div>
            ${targetHtml}
          </div>
          <div class="ow-rank-bar-track">
            <div class="ow-rank-bar-fill" style="width:${fillPct}%;background:${barColor}"></div>
          </div>
        </div>`;
    }

    return `
      <div class="ow-block">
        <div class="ow-bval ow-purple">#${player?.rank ?? '--'}</div>
        <div class="ow-meta-label">${t.RANK}</div>
      </div>
      <div class="ow-sep-line"></div>
      <div class="ow-rank-bar-wrap">
        <div class="ow-rank-bar-track">
          <div class="ow-rank-bar-fill" style="width:${fillPct}%;background:${barColor}"></div>
        </div>
        ${targetHtml}
      </div>`;
  }

  // ════════════════════════════════════════════════════════════
  // SLIDE 3 — Recent Matches (Opponent Heads)
  // ════════════════════════════════════════════════════════════
  function slideRecent(stats, cfg) {
    const { player, matches } = stats;
    const uname  = player?.username || cfg.username;
    const recent = (matches || []).slice(0, 5);
    const t = T(cfg.lang);

    if (!recent.length)
      return `<div class="ow-meta-label" style="opacity:.6;text-align:center;width:100%">${t.NO_RECENT}</div>`;

    const items = recent.map(m => {
      const { me, opp } = matchParticipants(m, uname);
      const change  = me?.eloChange ?? 0;
      const type    = me?.won ? 'win' : 'loss';
      const sign    = change >= 0 ? '+' : '';
      const oppUser = opp?.username || 'unknown';

      return `<div class="ow-recent-item ow-recent-${type}">
        ${mcHead(oppUser, 24, 'ow-mc-head')}
        <div class="ow-recent-chg">${sign}${change}</div>
      </div>`;
    }).join('');

    return `<div class="ow-recent-list">${items}</div>`;
  }

  // ════════════════════════════════════════════════════════════
  // SLIDE 3.5 — Last Match (Última Partida)
  // ════════════════════════════════════════════════════════════
  function slideLastMatch(stats, cfg) {
    const { player, matches } = stats;
    const uname = player?.username || cfg.username;
    const lastMatch = (matches || [])[0];
    const t = T(cfg.lang);
    const isVert = (cfg.layout || 'vertical') !== 'horizontal';

    if (!lastMatch)
      return `<div class="ow-meta-label" style="opacity:.6;text-align:center;width:100%">${t.NO_RECENT}</div>`;

    const { me, opp } = matchParticipants(lastMatch, uname);
    const change = me?.eloChange ?? 0;
    const type = me?.won ? 'win' : 'loss';
    const sign = change >= 0 ? '+' : '';
    const oppUser = opp?.username || 'unknown';
    
    // Fallback to 0 if score doesn't exist
    const myScore = me?.score ?? 0;
    const oppScore = opp?.score ?? 0;
    const resultText = `${myScore} - ${oppScore}`;
    
    if (isVert) {
      return `
        <div class="ow-slide-row" style="align-items:center; gap: 8px;">
          ${mcHead(oppUser, 28, 'ow-mc-head')}
          <div class="ow-stat-item" style="flex:1; align-items:flex-start;">
            <span class="ow-bval" style="font-size:13px; max-width:80px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${oppUser}</span>
            <span class="ow-meta-label">${resultText}</span>
          </div>
          <div class="ow-stat-item" style="text-align:right">
            <span class="ow-bval ow-${type === 'win' ? 'green' : 'red'}">${sign}${change}</span>
            <span class="ow-meta-label">ELO</span>
          </div>
        </div>`;
    }

    return `
      <div class="ow-block">
        ${mcHead(oppUser, 24, 'ow-mc-head')}
      </div>
      <div class="ow-block" style="text-align:left; min-width:0;">
        <div class="ow-bval" style="font-size:14px; max-width:100px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${oppUser}</div>
        <div class="ow-meta-label">${resultText}</div>
      </div>
      <div class="ow-sep-line"></div>
      <div class="ow-block">
        <div class="ow-bval ow-${type === 'win' ? 'green' : 'red'}">${sign}${change}</div>
        <div class="ow-meta-label">ELO</div>
      </div>`;
  }

  // ════════════════════════════════════════════════════════════
  // SLIDE 4 — Records & Next on Leaderboard
  // ════════════════════════════════════════════════════════════
  function slideRecords(stats, cfg, ranks, leaderboard) {
    const { aggregate, record, player } = stats;
    const myRank = player?.rank;
    const t = T(cfg.lang);
    const isVert = (cfg.layout || 'vertical') !== 'horizontal';

    let above = null;
    if (leaderboard?.rows && myRank) {
      above = leaderboard.rows.find(r => r.rank === myRank - 1) || null;
    }
    const eloDiff = (above && player?.elo != null) ? above.elo - player.elo : null;

    if (isVert) {
      return `
        <div class="ow-slide-row">
          <div class="ow-stat-item">
            <span class="ow-bval ow-gold">🏆 ${fmt(aggregate?.peakElo)}</span>
            <span class="ow-meta-label">${t.PEAK_ELO}</span>
          </div>
          ${above && eloDiff != null ? `
          <div class="ow-rival-block">
            ${mcHead(above.username, 24, 'ow-mc-head-sm')}
            <div class="ow-rival-info">
              <span class="ow-rival-name">↑ ${above.username}</span>
              <span class="ow-bval ow-blue" style="font-size:12px">A ${eloDiff} ELO</span>
            </div>
          </div>` : (myRank === 1 ? `
          <div class="ow-stat-item" style="text-align:right">
            <span class="ow-bval ow-gold">🏆 #1</span>
            <span class="ow-meta-label">${t.TOP_LB}</span>
          </div>` : `
          <div class="ow-stat-item" style="text-align:right">
            <span class="ow-bval">${record?.completedMatches ?? 0}</span>
            <span class="ow-meta-label">${t.MATCHES}</span>
          </div>`)}
        </div>`;
    }

    return `
      <div class="ow-block">
        <div class="ow-bval ow-gold">${fmt(aggregate?.peakElo)}</div>
        <div class="ow-meta-label">${t.PEAK_ELO}</div>
      </div>
      <div class="ow-sep-line"></div>
      <div class="ow-block">
        <div class="ow-bval ow-green">${record?.completedMatches ?? '--'}</div>
        <div class="ow-meta-label">${t.MATCHES}</div>
      </div>
      <div class="ow-sep-line"></div>
      ${above && eloDiff != null ? `
      <div class="ow-rival-block">
        ${mcHead(above.username, 26, 'ow-mc-head-sm')}
        <div class="ow-rival-info">
          <div class="ow-bval ow-blue" style="font-size:14px">A ${eloDiff} ELO</div>
          <div class="ow-meta-label" style="white-space:nowrap">↑ ${above.username}</div>
        </div>
      </div>` : (myRank === 1 ? `
      <div class="ow-block">
        <div class="ow-bval ow-gold" style="font-size:14px">🏆 TOP</div>
        <div class="ow-meta-label">${t.TOP_LB}</div>
      </div>` : `
      <div class="ow-block">
        <div class="ow-bval ow-purple" style="font-size:14px">#${myRank ?? '--'}</div>
        <div class="ow-meta-label">${t.RANK}</div>
      </div>`)}`;
  }

  // ── Slide registry ───────────────────────────────────────────
  const SLIDE_DEFS = {
    main:    { label: 'Principal', render: (s, c, r, lb) => slideMain(s, c) },
    ranking: { label: 'Ranking',   render: (s, c, r, lb) => slideRanking(s, c, r) },
    lastmatch:{ label: 'Última Partida', render: (s, c, r, lb) => slideLastMatch(s, c) },
    recent:  { label: 'Recientes', render: (s, c, r, lb) => slideRecent(s, c) },
    records: { label: 'Récords',   render: (s, c, r, lb) => slideRecords(s, c, r, lb) },
  };

  function getActiveSlides(cfg) {
    const all = ['main', 'ranking', 'lastmatch', 'recent', 'records'];
    return all.filter(id => {
      if (id === 'main') return true;
      const key = `show${id.charAt(0).toUpperCase() + id.slice(1)}Slide`;
      return cfg[key] !== false && cfg[key] !== '0';
    });
  }

  // ── Main render ──────────────────────────────────────────────
  function render(container, stats, cfg, ranks, leaderboard) {
    if (!stats) {
      stats       = MOCK;
      leaderboard = leaderboard || MOCK_LEADERBOARD;
    }

    const { player } = stats;
    const uname    = player?.username || cfg.username || 'Player';
    const rColor   = player?.rankColor || '#888888';
    const rName    = player?.rankName  || 'Unranked';
    const eloVal   = player?.elo != null ? fmt(player.elo) : '--';
    const scale    = parseFloat(cfg.scale)        || 1;
    const theme    = cfg.theme                    || 'dark';
    const accent   = cfg.accent                   || '#6366f1';
    const rotSpeed = parseInt(cfg.rotationSpeed)  || 5;
    const layout   = cfg.layout                   || 'vertical';

    const activeSlides = getActiveSlides(cfg);

    // Clear old rotation timer
    if (container._rotTimer) { clearInterval(container._rotTimer); container._rotTimer = null; }
    let slideIdx = (container._slideIdx || 0) % activeSlides.length;

    // Build skeleton based on layout
    if (layout === 'vertical') {
      container.innerHTML = `
        <div class="ow-widget notranslate" translate="no" data-layout="vertical" data-theme="${theme}" style="--rc:${rColor};--ac:${accent};--sc:${scale}">
          <div class="ow-top-bar notranslate" translate="no"></div>
          
          <!-- ROW 1: Player info -->
          <div class="ow-row-header">
            ${cfg.showRankIcon !== false ? playerAvatar(uname, rColor, 34) : ''}
            <div class="ow-player-details">
              <div class="ow-username notranslate" translate="no">${uname}</div>
              <div class="ow-rank-name notranslate" translate="no" style="color:${rColor}">${rName}</div>
            </div>
            <div class="ow-elo-badge">
              <span class="ow-elo-number">${eloVal}</span>
              <span class="ow-elo-badge-lbl">ELO</span>
            </div>
          </div>

          <!-- DIVIDER -->
          <div class="ow-h-sep"></div>

          <!-- ROW 2: Rotating slide -->
          <div class="ow-row-slide">
            <div class="ow-slide-content notranslate" id="ow-sc" translate="no"></div>
          </div>
        </div>`;
    } else {
      // Horizontal layout
      container.innerHTML = `
        <div class="ow-widget notranslate" translate="no" data-layout="horizontal" data-theme="${theme}" style="--rc:${rColor};--ac:${accent};--sc:${scale}">
          <div class="ow-top-bar notranslate" translate="no"></div>
          ${cfg.showRankIcon !== false ? playerAvatar(uname, rColor, 36) : ''}
          <div class="ow-player notranslate" translate="no">
            <div class="ow-username notranslate" translate="no">${uname}</div>
            <div class="ow-rank-name notranslate" translate="no" style="color:${rColor}">${rName}</div>
          </div>
          <div class="ow-sep-line"></div>
          <div class="ow-rotating-panel notranslate" translate="no">
            <div class="ow-slide-content notranslate" id="ow-sc" translate="no"></div>
          </div>
          <div class="ow-refresh-dot" id="ow-refresh-dot"></div>
        </div>`;
    }

    function paintSlide(animate) {
      const id  = activeSlides[slideIdx];
      const def = SLIDE_DEFS[id];
      const sc  = container.querySelector('#ow-sc');
      if (!sc) return;

      const doUpdate = () => {
        sc.innerHTML = def ? def.render(stats, cfg, ranks, leaderboard) : '';
        if (animate) {
          sc.classList.add('ow-slide-enter');
          setTimeout(() => sc.classList.remove('ow-slide-enter'), 350);
        }
      };

      if (animate) {
        sc.classList.add('ow-slide-exit');
        setTimeout(() => { sc.classList.remove('ow-slide-exit'); doUpdate(); }, 200);
      } else {
        doUpdate();
      }
    }

    paintSlide(false);

    if (activeSlides.length > 1) {
      container._rotTimer = setInterval(() => {
        slideIdx = (slideIdx + 1) % activeSlides.length;
        container._slideIdx = slideIdx;
        paintSlide(true);
      }, rotSpeed * 1000);
    }
    container._slideIdx = slideIdx;
  }

  return { render, MOCK, MOCK_LEADERBOARD };
})();
