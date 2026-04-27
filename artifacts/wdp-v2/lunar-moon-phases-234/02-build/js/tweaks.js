/**
 * ?debug=1 或 localStorage.wdp_debug=1
 */
export function shouldShowTweaks() {
  try {
    if (localStorage.getItem('wdp_debug') === '1') return true;
  } catch {
    /* ignore */
  }
  return new URLSearchParams(window.location.search).get('debug') === '1';
}

export function mountTweaks(root) {
  if (!shouldShowTweaks()) return;

  const panel = document.createElement('aside');
  panel.className =
    'wdp-tweaks fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl border border-white/10 bg-wdp-nebula/95 p-4 text-wdp-text shadow-wdp backdrop-blur-md';
  panel.style.background = `rgba(18, 16, 31, var(--wdp-panel-alpha, 0.72))`;
  panel.setAttribute('aria-label', 'WDP 调试 Tweaks');

  const title = document.createElement('div');
  title.className = 'font-display text-lg text-wdp-accent mb-3';
  title.textContent = 'Tweaks (debug)';

  const sliders = [
    { key: '--wdp-glow', label: '选中光晕强度', min: 0, max: 1, step: 0.05, value: 0.45 },
    { key: '--wdp-star-opacity', label: '星场透明度', min: 0.1, max: 0.8, step: 0.05, value: 0.35 },
    { key: '--wdp-panel-alpha', label: '面板背景不透明度', min: 0.4, max: 0.95, step: 0.05, value: 0.72 }
  ];

  panel.appendChild(title);

  sliders.forEach((cfg) => {
    const wrap = document.createElement('label');
    wrap.className = 'block mb-3 text-sm';

    const head = document.createElement('div');
    head.className = 'flex justify-between gap-2 text-wdp-muted mb-1';
    const lab = document.createElement('span');
    lab.textContent = cfg.label;
    const val = document.createElement('span');
    val.textContent = String(cfg.value);
    head.appendChild(lab);
    head.appendChild(val);

    const input = document.createElement('input');
    input.type = 'range';
    input.min = String(cfg.min);
    input.max = String(cfg.max);
    input.step = String(cfg.step);
    input.value = String(cfg.value);
    input.className = 'wdp-focus w-full h-11 py-2';

    input.addEventListener('input', () => {
      const v = parseFloat(input.value);
      val.textContent = String(v);
      root.style.setProperty(cfg.key, String(v));
    });

    wrap.appendChild(head);
    wrap.appendChild(input);
    panel.appendChild(wrap);
  });

  document.body.appendChild(panel);
}
