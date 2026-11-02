/**
 * MUPHUS — Website-Logik
 * Rendert Inhalte aus config.js / data.js und steuert Navigation, Hero,
 * Filter, Release-Dialog, Video-Facade, Animationen und das 3D-Objekt.
 */
import { config } from './config.js';
import { releases, labels, performances, milestones } from './data.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const dev = !!config.devMode;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const conn = navigator.connection;
const saveData = !!(conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '')));

/* ------------------------------------------------------------------ */
/* Reveal-on-scroll                                                    */
/* ------------------------------------------------------------------ */
const revealIO = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          revealIO.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
  : null;

function observeReveals(root = document) {
  $$('.reveal:not(.is-in)', root).forEach((el) => {
    if (reduced || !revealIO) el.classList.add('is-in');
    else revealIO.observe(el);
  });
}

/* ------------------------------------------------------------------ */
/* Header / Navigation                                                 */
/* ------------------------------------------------------------------ */
function initNav() {
  const header = $('#site-header');
  const toggle = $('#menu-toggle');
  const nav = $('#nav');

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const mq = window.matchMedia('(max-width: 960px)');
  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) $('a', nav)?.focus();
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    if (!open) return;
    if (e.key === 'Escape') { setOpen(false); toggle.focus(); }
    if (e.key === 'Tab') { // Fokus im geöffneten Menü halten
      const items = [...$$('a', nav), toggle];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  mq.addEventListener?.('change', () => setOpen(false));

  // Aktiver Navigationszustand
  const links = $$('.nav__list a');
  const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const a = map.get(en.target.id);
      if (!a) return;
      if (en.isIntersecting) {
        links.forEach((l) => l.removeAttribute('aria-current'));
        a.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  // Labels-Sektion gehört optisch zu "Music"
  const labelsSection = $('#labels');
  if (labelsSection) {
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting) {
        links.forEach((l) => l.removeAttribute('aria-current'));
        map.get('music')?.setAttribute('aria-current', 'true');
      }
    }, { rootMargin: '-45% 0px -50% 0px' }).observe(labelsSection);
  }
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function initHero() {
  $('#hero-descriptor').textContent = config.artist.descriptor;
  $('#hero-claim').textContent = config.artist.claim;

  const slot = $('#hero-media-slot');
  document.documentElement.style.setProperty('--hero-blur', `${Number(config.hero.blur) || 0}px`);
  const { mp4: mp4Full, mp4Small, webm, poster } = config.hero;
  // Kleinere Datei auf Smartphones/Tablets
  const mp4 = (mp4Small && window.matchMedia('(max-width: 900px)').matches) ? mp4Small : mp4Full;

  if (poster) {
    const img = document.createElement('img');
    img.className = 'hero__poster';
    img.src = poster;
    img.alt = '';
    img.decoding = 'async';
    slot.append(img);
  }

  // Video: nur ohne Reduced-Motion / Datensparmodus, sonst bleibt das Poster stehen
  if ((mp4 || webm) && !reduced && !saveData) {
    const start = () => {
      const v = document.createElement('video');
      v.className = 'hero__media';
      v.muted = true; v.defaultMuted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      v.preload = 'metadata';
      if (poster) v.poster = poster;
      [[webm, 'video/webm'], [mp4, 'video/mp4']].forEach(([src, type]) => {
        if (!src) return;
        const s = document.createElement('source');
        s.src = src; s.type = type;
        v.append(s);
      });
      v.addEventListener('canplay', () => v.classList.add('is-ready'), { once: true });
      v.addEventListener('error', () => v.remove(), true); // Fehler → Poster/Atmosphäre bleibt
      slot.append(v);
      v.play?.().catch(() => {});
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
  }

  // Sehr dezente Parallax-Bewegung
  if (!reduced) {
    const content = $('#hero-content');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          content.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
          content.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.9)));
        }
        ticking = false;
      });
    }, { passive: true });
  }
}

/* 3D-Chrome-Objekt: lazy, mit statischem Fallback */
function initChrome() {
  const canvas = $('#hero-canvas');
  const fallback = $('#chrome-fallback');
  const showFallback = () => { canvas?.remove(); fallback.classList.add('is-on'); };

  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory;
  const isMobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
  const weak = (mem && mem <= 2) || (cores <= 2 && isMobile);
  const hasGL = (() => {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch { return false; }
  })();
  if (weak || saveData || !hasGL) return showFallback();

  const mobile = isMobile;
  const start = async () => {
    try {
      const mod = await import('./chrome3d.js');
      const api = await mod.createChrome(canvas, { reduced, mobile, onFail: showFallback });
      if (!api) showFallback();
    } catch (err) {
      console.warn('[MUPHUS] 3D object unavailable, using static fallback.', err);
      showFallback();
    }
  };
  const go = () => ('requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 2000 }) : setTimeout(start, 500));
  if (document.readyState === 'complete') go();
  else window.addEventListener('load', go, { once: true });
}

/* ------------------------------------------------------------------ */
/* Releases                                                            */
/* ------------------------------------------------------------------ */
const PLATFORMS = [
  ['spotify', 'Spotify'],
  ['appleMusic', 'Apple Music'],
  ['soundcloud', 'SoundCloud'],
  ['youtube', 'YouTube'],
];
const CATEGORY_LABEL = { single: 'Single', collaboration: 'Collaboration', remix: 'Remix' };

const shownReleases = () => releases.filter((r) => dev || !r.placeholder);

function artHTML(r, i) {
  if (r.artwork) {
    return `<img src="${esc(r.artwork)}" alt="${esc(r.title)} – cover artwork" width="800" height="800" loading="lazy" decoding="async">`;
  }
  return `<div class="art--ph" style="--i:${i + 1}" role="img" aria-label="Artwork placeholder"></div>`;
}

function metaLine(r) {
  const parts = [];
  if (r.year || r.releaseDate) parts.push(r.year || String(r.releaseDate).slice(0, 4));
  if (r.label) parts.push(r.label);
  else if (dev && r.placeholder) parts.push('Label TBA');
  return parts.join(' · ');
}

function renderReleases(filter = 'all', animate = false) {
  const grid = $('#release-grid');
  const list = shownReleases().filter((r) => filter === 'all' || r.category === filter);

  if (!list.length) {
    grid.innerHTML = `<li class="empty">${
      shownReleases().length ? 'No releases in this category yet.' : 'New releases coming soon.'
    }</li>`;
    return;
  }

  grid.innerHTML = list.map((r, i) => `
    <li class="reveal" style="--d:${(i % 4) * 80}">
      <button class="release-card" type="button" data-id="${esc(r.id)}" aria-haspopup="dialog">
        <span class="release-card__art">
          ${artHTML(r, i)}
          ${r.placeholder ? '<span class="badge">Placeholder</span>' : ''}
          <span class="release-card__hover"><span class="meta" style="color:#fff">View details</span><span aria-hidden="true">→</span></span>
        </span>
        <span class="release-card__info">
          <span class="release-card__title" style="display:block">${esc(r.title)}</span>
          <span class="release-card__artists" style="display:block">${esc((r.artists || []).join(', '))}</span>
          ${metaLine(r) ? `<span class="release-card__meta meta" style="display:block">${esc(metaLine(r))}</span>` : ''}
        </span>
      </button>
    </li>`).join('');

  if (animate) {
    requestAnimationFrame(() => requestAnimationFrame(() => $$('.reveal', grid).forEach((el) => el.classList.add('is-in'))));
  } else {
    observeReveals(grid);
  }
}

function initReleases() {
  const grid = $('#release-grid');
  const filters = $('#release-filters');
  const dialog = $('#release-dialog');
  let lastFocus = null;

  renderReleases();
  $$('[data-filter]', filters).forEach((b) => {
    const f = b.dataset.filter;
    if (f !== 'all' && !shownReleases().some((r) => r.category === f)) b.hidden = true;
  });

  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    $$('[data-filter]', filters).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    renderReleases(btn.dataset.filter, true);
  });

  const openDialog = (id) => {
    const list = shownReleases();
    const idx = list.findIndex((r) => r.id === id);
    const r = list[idx];
    if (!r) return;

    $('#dialog-art').innerHTML = artHTML(r, idx) + (r.placeholder ? '<span class="badge">Placeholder</span>' : '');
    $('#dialog-kind').textContent = CATEGORY_LABEL[r.category] || 'Release';
    $('#dialog-title').textContent = r.title;
    $('#dialog-artists').textContent = (r.artists || []).join(', ');

    const when = r.releaseDate
      ? new Date(r.releaseDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
      : r.year;
    const credits = [
      ['Label', r.label || (dev && r.placeholder ? 'TBA' : '')],
      ['Distribution', r.distributor || ''],
      ['Released', when || (dev && r.placeholder ? 'TBA' : '')],
      ['Genre', r.genre || ''],
    ].filter(([, v]) => v);
    $('#dialog-credits').innerHTML = credits.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');

    const links = PLATFORMS.filter(([key]) => r.links?.[key]);
    $('#dialog-links').innerHTML = links.length
      ? links.map(([key, name]) => `<a class="btn btn--sm" href="${esc(r.links[key])}" target="_blank" rel="noopener noreferrer">${name}</a>`).join('')
      : '<p class="meta">Streaming links coming soon</p>';

    lastFocus = document.activeElement;
    dialog.showModal();
  };

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.release-card');
    if (card) openDialog(card.dataset.id);
  });
  $('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => lastFocus?.focus?.());
}

/* Official Video — Zwei-Klick-Lösung (DSGVO) */
function initVideo() {
  const { youtubeId, title } = config.officialVideo || {};
  const block = $('#video-block');
  if (!youtubeId) { block.hidden = true; return; }
  $('#video-title').textContent = title || 'Official Music Video';
  $('#video-facade').addEventListener('click', () => {
    const frame = $('#video-frame');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0&playsinline=1`;
    iframe.title = title || 'Official Music Video';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.replaceChildren(iframe);
    iframe.focus();
  });
}

/* ------------------------------------------------------------------ */
/* Labels                                                              */
/* ------------------------------------------------------------------ */
function renderLabels() {
  const grid = $('#label-grid');
  const list = labels.filter((l) => config.showUnverifiedLabels || l.verified !== false);
  if (!list.length) { $('#labels').hidden = true; return; }
  grid.innerHTML = list.map((l) => {
    const inner = l.logo
      ? `<img src="${esc(l.logo)}" alt="${esc(l.name)}" loading="lazy" decoding="async">`
      : `<span class="label-item__name">${esc(l.name)}</span>`;
    const body = l.website ? `<a href="${esc(l.website)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(l.name)}">${inner}</a>` : inner;
    return `<li class="label-item">${body}
      ${dev && l.verified === false ? '<span class="badge">Verify</span>' : ''}
      ${l.relationship ? `<span class="label-item__rel meta">${esc(l.relationship)}</span>` : ''}</li>`;
  }).join('');
}

/* ------------------------------------------------------------------ */
/* Milestones                                                          */
/* ------------------------------------------------------------------ */
const fmt = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 1 });

function renderStats() {
  const wrap = $('#stats');
  wrap.innerHTML = config.stats.map((s, i) => `
    <div class="stat reveal" style="--d:${i * 120}">
      <div class="stat__num" data-value="${s.value}" data-suffix="${esc(s.suffix)}">${fmt(s.value)}${esc(s.suffix)}</div>
      <div class="stat__label meta">${esc(s.label)}</div>
      ${s.note ? `<p class="stat__note">${esc(s.note)}</p>` : ''}
    </div>`).join('');

  const run = (el) => {
    const end = Number(el.dataset.value);
    const suffix = el.dataset.suffix;
    if (reduced) return;
    const t0 = performance.now();
    const dur = 1600;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = `${fmt(Number.isInteger(end) ? Math.round(end * eased) : Math.round(end * eased * 10) / 10)}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = `${fmt(end)}${suffix}`;
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    $$('.stat__num', wrap).forEach((el) => io.observe(el));
  }
  observeReveals(wrap);
}

function renderTimeline() {
  const ol = $('#timeline');
  ol.innerHTML = milestones.map((m, i) => `
    <li class="tl-item reveal${m.highlight ? ' is-highlight' : ''}" style="--d:${Math.min(i, 2) * 60}">
      <div class="tl-year">${esc(m.year || (dev ? 'TBC' : ''))}${m.sub ? `<span class="tl-sub meta">${esc(m.sub)}</span>` : ''}</div>
      <div class="tl-rail" aria-hidden="true"></div>
      <div class="tl-body">
        <h3>${esc(m.title)}</h3>
        ${m.description && (m.confirmed !== false || dev) ? `<p>${esc(m.description)}</p>` : ''}
      </div>
    </li>`).join('');
  observeReveals(ol);
}

/* ------------------------------------------------------------------ */
/* Live                                                                */
/* ------------------------------------------------------------------ */
function renderLive() {
  const sc = $('#live-scroller');
  const list = performances.filter((p) =>
    (dev || !p.placeholder) &&
    (dev || !p.requiresImage || p.image || p.video) &&
    (config.showAliasPerformances || (!p.aliasOnly && p.project === 'MUPHUS')));

  if (!list.length) { $('#live').hidden = true; return; }

  sc.innerHTML = list.map((p, i) => {
    let media;
    if (p.video) media = `<video src="${esc(p.video)}" ${p.image ? `poster="${esc(p.image)}"` : ''} controls preload="none" playsinline muted></video>`;
    else if (p.image) media = `<img src="${esc(p.image)}" alt="${esc(p.alt || p.event + ' – live photo')}" loading="lazy" decoding="async" width="1800" height="1125">`;
    else media = `<div class="art--ph" style="--i:${i + 4}" role="img" aria-label="Photo placeholder"></div>`;
    const badge = p.placeholder ? 'Placeholder' : p.project !== 'MUPHUS' ? `As ${p.project}` : '';
    const when = p.date
      ? new Date(p.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
      : p.year;
    const meta = [p.note, p.venue, p.city, when].filter(Boolean).join(' · ');
    return `<article class="live-card reveal" style="--d:${i * 80}">
      <div class="live-card__media">${media}${badge ? `<span class="badge">${esc(badge)}</span>` : ''}</div>
      <div class="live-card__info">
        <h3 class="live-card__event">${esc(p.event)}</h3>
        ${meta ? `<p class="live-card__meta">${esc(meta)}</p>` : ''}
        ${p.link ? `<a class="live-card__link" href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">Watch / details →</a>` : ''}
      </div>
    </article>`;
  }).join('');
  observeReveals(sc);

  const prev = $('#live-prev');
  const next = $('#live-next');
  const arrows = $('#live-arrows');
  const update = () => {
    const max = sc.scrollWidth - sc.clientWidth - 2;
    arrows.hidden = max <= 0;
    prev.disabled = sc.scrollLeft <= 2;
    next.disabled = sc.scrollLeft >= max;
  };
  const step = (dir) => sc.scrollBy({ left: dir * Math.max(300, sc.clientWidth * 0.7), behavior: reduced ? 'auto' : 'smooth' });
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  sc.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */
function renderAbout() {
  const a = config.about;
  const portrait = $('#about-portrait');
  if (a.portrait) {
    portrait.innerHTML = `<img src="${esc(a.portrait)}" alt="${esc(a.portraitAlt)}" loading="lazy" decoding="async" width="267" height="320">`;
  } else if (dev) {
    portrait.innerHTML = '<div class="art--ph" style="--i:2" role="img" aria-label="Portrait placeholder"></div><span class="badge">Portrait placeholder</span>';
  } else {
    portrait.hidden = true;
    $('.about').style.gridTemplateColumns = '1fr';
  }
  $('#about-copy').innerHTML = a.text.map((t) => `<p>${esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`).join('');
  $('#about-facts').innerHTML = a.facts.map((f) => `<div><dt class="meta">${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('');
}

/* ------------------------------------------------------------------ */
/* EPK, Booking, Socials, Footer                                       */
/* ------------------------------------------------------------------ */
const SOCIAL_NAMES = [
  ['instagram', 'Instagram'],
  ['spotify', 'Spotify'],
  ['soundcloud', 'SoundCloud'],
  ['youtube', 'YouTube'],
  ['tiktok', 'TikTok'],
];

function initContact() {
  const heroSp = $('#hero-spotify');
  if (heroSp) {
    if (config.socials.spotify) heroSp.href = config.socials.spotify;
    else { heroSp.removeAttribute('target'); heroSp.querySelector('svg')?.remove(); heroSp.textContent = 'Explore Music'; }
  }
  const epkUrl = (config.epk.url || '').trim();
  const email = (config.booking.email || '').trim();
  const mailto = email ? `mailto:${email}?subject=${encodeURIComponent(config.booking.subject)}` : '';

  // EPK
  const epkBtn = $('#epk-btn');
  if (epkUrl) {
    epkBtn.href = epkUrl;
    epkBtn.target = '_blank';
    epkBtn.rel = 'noopener';
    const dl = $('#epk-dl');
    dl.href = epkUrl; dl.hidden = false;
    $$('[data-epk-link]').forEach((a) => { a.href = epkUrl; a.target = '_blank'; a.rel = 'noopener'; });
  } else {
    epkBtn.removeAttribute('href');
    if (dev) {
      epkBtn.setAttribute('aria-disabled', 'true');
      epkBtn.classList.add('is-disabled');
      $('#epk-hint').textContent = 'Placeholder: set epk.url in js/config.js';
    } else {
      epkBtn.hidden = true;
      $$('[data-epk-link]').forEach((a) => (a.hidden = true));
    }
  }

  // Booking
  const bookBtn = $('#book-btn');
  if (mailto) {
    bookBtn.href = mailto;
    $$('[data-book-link]').forEach((a) => { if (!a.closest('.hero')) a.href = mailto; });
    const m = $('#book-mail');
    m.href = mailto; m.textContent = email; m.hidden = false;
  } else {
    bookBtn.removeAttribute('href');
    if (dev) {
      bookBtn.setAttribute('aria-disabled', 'true');
      bookBtn.classList.add('is-disabled');
      $('#book-hint').textContent = 'Placeholder: set booking.email in js/config.js';
    } else {
      bookBtn.hidden = true;
    }
  }

  // Socials (Kontaktbereich)
  const wrap = $('#socials');
  const set = SOCIAL_NAMES.filter(([k]) => config.socials[k]);
  const missing = SOCIAL_NAMES.filter(([k]) => !config.socials[k]);
  wrap.innerHTML =
    set.map(([k, n]) => `<a class="btn btn--sm" href="${esc(config.socials[k])}" target="_blank" rel="noopener noreferrer">${n}</a>`).join('') +
    (dev ? missing.map(([, n]) => `<span class="btn btn--sm is-disabled" aria-disabled="true">${n} · not set</span>`).join('') : '');
  if (!wrap.innerHTML.trim()) wrap.hidden = true;

  // Footer
  const items = [];
  if (email) items.push(`<li><a href="${esc(mailto)}">${esc(email)}</a></li>`);
  else if (dev) items.push('<li><span class="is-missing">Booking email — not set</span></li>');
  if (epkUrl) items.push(`<li><a href="${esc(epkUrl)}" target="_blank" rel="noopener">EPK</a></li>`);
  set.forEach(([k, n]) => items.push(`<li><a href="${esc(config.socials[k])}" target="_blank" rel="noopener noreferrer">${n}</a></li>`));
  if (dev && !set.length) items.push('<li><span class="is-missing">Social links — not set</span></li>');
  $('#footer-links').innerHTML = items.join('') || '<li><a href="#contact">Contact</a></li>';

  $('#year').textContent = String(new Date().getFullYear());
}

function initDevPill() {
  if (!dev) return;
  const pill = document.createElement('div');
  pill.className = 'dev-pill';
  pill.setAttribute('role', 'note');
  pill.innerHTML = '<p><strong>DEV MODE</strong><br>Placeholders are visible. Set <code>devMode: false</code> in <code>js/config.js</code> before launch.</p><button type="button" aria-label="Dismiss">×</button>';
  pill.querySelector('button').addEventListener('click', () => pill.remove());
  document.body.append(pill);
}

/* ------------------------------------------------------------------ */
/* Init                                                                */
/* ------------------------------------------------------------------ */
initNav();
if (!reduced && !window.matchMedia('(max-width: 560px)').matches) {
  import('./particles.js').then((m) => m.initParticles($('#particles'), { count: 34 })).catch(() => {});
}
initHero();
// initChrome(); // 3D-Element deaktiviert (js/chrome3d.js bleibt für spätere Nutzung)
initReleases();
initVideo();
renderLabels();
renderStats();
renderTimeline();
renderLive();
renderAbout();
initContact();
initDevPill();
observeReveals();
