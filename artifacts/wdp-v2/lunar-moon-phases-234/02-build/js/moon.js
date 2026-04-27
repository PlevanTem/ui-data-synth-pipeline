/**
 * 朔望月近似：教学演示用（非实时历表）。
 * 八相阈值（天）与公开 JS 月相文一致：Jason Sturges / lunarphase-js 常用分段。
 */
export const SYNODIC_DAYS = 29.530588853;

const PHASE_THRESHOLDS = [
  { max: 1.84566, name: '新月' },
  { max: 5.53699, name: '蛾眉月' },
  { max: 9.22831, name: '上弦月' },
  { max: 12.91963, name: '盈凸月' },
  { max: 16.61096, name: '满月' },
  { max: 20.30228, name: '亏凸月' },
  { max: 23.99361, name: '下弦月' },
  { max: 29.53059, name: '残月' }
];

/**
 * @param {number} lunarDay 农历日序 1-30
 */
export function lunarDayToAge01(lunarDay) {
  const d = Math.min(30, Math.max(1, lunarDay));
  return (d - 1) / SYNODIC_DAYS;
}

export function age01ToIllumination(age01) {
  const chi = 2 * Math.PI * age01;
  return (1 - Math.cos(chi)) / 2;
}

export function age01ToPhaseName(age01) {
  const days = age01 * SYNODIC_DAYS;
  for (const row of PHASE_THRESHOLDS) {
    if (days < row.max) return row.name;
  }
  return '残月';
}

/**
 * 双圆叠加法绘制月相（北半球：亮面自右侧渐长）。
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} age01 0..1
 * @param {'north'|'south'} hemisphere
 */
export function drawMoonPhase(ctx, age01, hemisphere) {
  const canvas = ctx.canvas;
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.42;

  ctx.clearRect(0, 0, w, h);

  const p = 2 * Math.PI * age01;
  /** 北半球蛾眉月亮面向东（视线上偏右）；与 offset=+r·cos(p) 相比取负号以纠正朔后亮向。 */
  let offset = -r * Math.cos(p);
  if (hemisphere === 'south') offset *= -1;

  const illum = age01ToIllumination(age01);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  if (illum > 0.005) {
    const limb = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.1, cx, cy, r);
    limb.addColorStop(0, '#f3f0e8');
    limb.addColorStop(0.55, '#e6e2d8');
    limb.addColorStop(1, '#cfc7b8');
    ctx.fillStyle = limb;
    ctx.fillRect(cx - r * 2, cy - r * 2, r * 4, r * 4);
  } else {
    ctx.fillStyle = '#1a1f28';
    ctx.fillRect(cx - r * 2, cy - r * 2, r * 4, r * 4);
  }

  if (illum < 0.995) {
    ctx.fillStyle = '#1a1f28';
    ctx.beginPath();
    ctx.arc(cx + offset, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = Math.max(1, r * 0.02);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}
