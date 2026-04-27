import {
  SYNODIC_DAYS,
  lunarDayToAge01,
  age01ToIllumination,
  age01ToPhaseName,
  drawMoonPhase
} from './moon.js';
import { mountTweaks } from './tweaks.js';

const state = {
  day: 1,
  hemisphere: 'north'
};

function pct(n) {
  return `${Math.round(n * 1000) / 10}%`;
}

function setupCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const size = Math.max(1, Math.floor(Math.min(rect.width, rect.height) * dpr));
  canvas.width = size;
  canvas.height = size;
  return canvas.getContext('2d');
}

function renderHero(ctxMain, els) {
  const age01 = lunarDayToAge01(state.day);
  const illum = age01ToIllumination(age01);
  const name = age01ToPhaseName(age01);
  const ageDays = age01 * SYNODIC_DAYS;

  els.dayLarge.textContent = String(state.day);
  els.phaseName.textContent = name;
  els.illum.textContent = pct(illum);
  els.ageDays.textContent = `${ageDays.toFixed(2)} 天（模型内）`;

  drawMoonPhase(ctxMain, age01, state.hemisphere);
}

function renderTiles(tileCanvases) {
  tileCanvases.forEach(({ canvas, lunarDay }) => {
    const ctx = setupCanvas(canvas);
    if (!ctx) return;
    drawMoonPhase(ctx, lunarDayToAge01(lunarDay), state.hemisphere);
  });
}

function init() {
  const root = document.querySelector('[data-wdp-root]');
  if (!root) return;

  mountTweaks(root);

  const els = {
    dayLarge: document.getElementById('wdp-day-large'),
    phaseName: document.getElementById('wdp-phase-name'),
    illum: document.getElementById('wdp-illum'),
    ageDays: document.getElementById('wdp-age-days'),
    slider: document.getElementById('wdp-slider'),
    hemiBtn: document.getElementById('wdp-hemisphere'),
    tiles: Array.from(document.querySelectorAll('[data-wdp-day-tile]'))
  };

  const canvasMain = document.getElementById('wdp-moon-main');
  let ctxMain = /** @type {CanvasRenderingContext2D | null} */ (null);

  const tileCanvases = els.tiles.map((btn) => ({
    canvas: btn.querySelector('canvas'),
    lunarDay: Number(btn.dataset.day)
  }));

  function setDay(next) {
    state.day = Math.min(30, Math.max(1, next));
    els.slider.value = String(state.day);
    els.tiles.forEach((btn) => {
      const d = Number(btn.dataset.day);
      const on = d === state.day;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.classList.toggle('ring-2', on);
      btn.classList.toggle('ring-wdp-accent', on);
      btn.classList.toggle('shadow-[0_0_calc(24px*var(--wdp-glow))_rgba(126,184,218,0.55)]', on);
    });
    if (ctxMain) {
      renderHero(ctxMain, els);
    }
    renderTiles(tileCanvases);
  }

  els.slider.addEventListener('input', () => {
    setDay(Number(els.slider.value));
  });

  els.tiles.forEach((btn) => {
    btn.addEventListener('click', () => setDay(Number(btn.dataset.day)));
  });

  els.hemiBtn.addEventListener('click', () => {
    state.hemisphere = state.hemisphere === 'north' ? 'south' : 'north';
    els.hemiBtn.setAttribute('aria-pressed', state.hemisphere === 'south' ? 'true' : 'false');
    els.hemiBtn.textContent = state.hemisphere === 'north' ? '北半球视角' : '南半球视角';
    if (ctxMain) {
      renderHero(ctxMain, els);
    }
    renderTiles(tileCanvases);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setDay(state.day <= 1 ? 30 : state.day - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setDay(state.day >= 30 ? 1 : state.day + 1);
    }
  });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      ctxMain = setupCanvas(canvasMain);
      if (ctxMain) {
        renderHero(ctxMain, els);
      }
      renderTiles(tileCanvases);
    }, 120);
  });

  requestAnimationFrame(() => {
    ctxMain = setupCanvas(canvasMain);
    setDay(1);
  });
}

document.addEventListener('DOMContentLoaded', init);
