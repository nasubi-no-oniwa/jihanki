// 携帯自販機：当たりの演出（虹の7色それぞれ別もの）と、7色そろったときの演出
// どれも「当たってからの秒 u」だけで絵が決まる（飛ばす・動画にするときも同じ絵）
import { COLORS, NCOL, OPT } from './data.js?v=1';
import { TAU, cl, lerp, sm, eo, eb, hash, F, rain, fa, rr, fit, outline, drawCan, night } from './draw.js?v=1';

const INTRO = 1.4, OUT0 = 8.3;
function ball(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.arc(x, y, Math.max(.1, r), 0, TAU); g.fill(); }
function star4(g, x, y, r, col, rot) { g.fillStyle = col; g.beginPath(); for (let i = 0; i < 8; i++) { const a = (rot || 0) + i * TAU / 8, q = i % 2 ? r * .28 : r; g.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } g.fill(); }
function rays(x, n, col, a, spd) { const { g, W, H, M, it } = x, cx = W / 2, cy = M.y + M.h / 2, R = Math.hypot(W, H); for (let i = 0; i < n; i++) { const an = i * TAU / n + it * (spd || .6); g.fillStyle = typeof col === 'function' ? col(i) : col; g.globalAlpha = fa(a); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(an) * R, cy + Math.sin(an) * R); g.lineTo(cx + Math.cos(an + TAU / n / 2) * R, cy + Math.sin(an + TAU / n / 2) * R); g.fill(); } g.globalAlpha = 1; }
function firework(g, cx, cy, R, tau, n, col, seed, s) {
  if (tau < 0) { if (tau > -.5) { const k = 1 + tau / .5; g.strokeStyle = 'rgba(255,240,200,.8)'; g.lineWidth = s * .05; g.beginPath(); g.moveTo(cx, cy + (1 - k) * R * 2.2); g.lineTo(cx, cy + (1 - k) * R * 2.2 + s * .5); g.stroke(); } return; }
  if (tau > 1.7) return; const a = 1 - Math.pow(tau / 1.7, 2); g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const an = i * TAU / n + hash(i, seed) * .2, q = R * eo(tau / 1.1) * (.55 + .45 * hash(i, seed + 1)), px = cx + Math.cos(an) * q, py = cy + Math.sin(an) * q + tau * tau * s * .7; g.globalAlpha = a; ball(g, px, py, s * (.07 + .05 * hash(i, seed + 2)), typeof col === 'function' ? col(i) : col); g.globalAlpha = a * .35; g.strokeStyle = typeof col === 'function' ? col(i) : col; g.lineWidth = s * .04; g.beginPath(); g.moveTo(px, py); g.lineTo(cx + Math.cos(an) * q * .8, cy + Math.sin(an) * q * .8 + tau * tau * s * .6); g.stroke(); }
  if (tau < .12) { g.globalAlpha = fa(1 - tau / .12); ball(g, cx, cy, R * .5, '#fff'); } g.restore();
}
function bigText(x, text, y, k, fill, stroke, px, rot) { const { g, W, s } = x; if (k <= 0) return; g.save(); g.translate(W / 2, y); g.rotate(rot || 0); g.scale(k, k); g.textAlign = 'center'; g.textBaseline = 'middle'; fit(g, text, W * .9, px || 1.9 * s); g.lineJoin = 'round'; g.lineWidth = .34 * s; g.strokeStyle = '#000b'; g.strokeText(text, 0, .06 * s); outline(g, text, 0, 0, fill, stroke, .16 * s); g.restore(); }
function skyGrad(g, W, H, stops) { const gr = g.createLinearGradient(0, 0, 0, H); stops.forEach(([p, c]) => gr.addColorStop(p, c)); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function flame(g, x, by, w, h, t, seed, c0, c1) { const gr = g.createLinearGradient(0, by, 0, by - h); gr.addColorStop(0, c0); gr.addColorStop(1, c1); g.fillStyle = gr; g.beginPath(); g.moveTo(x - w / 2, by); const n = 5; for (let i = 0; i <= n; i++) { const px = x - w / 2 + (w * i) / n, ph = h * (.45 + .55 * Math.abs(Math.sin(t * (7 + hash(i, seed) * 6) + i * 2 + seed))) * Math.sin(Math.PI * (i + .5) / (n + 1)); g.quadraticCurveTo(px - w / n / 2, by - ph * 1.25, px, by - ph * .3); } g.lineTo(x + w / 2, by); g.fill(); }
function coin(g, x, y, r, sp) { const w = Math.max(.12, Math.abs(Math.cos(sp))) * r; g.fillStyle = '#ffd23a'; g.beginPath(); g.ellipse(x, y, w, r, 0, 0, TAU); g.fill(); g.strokeStyle = '#a8760a'; g.lineWidth = r * .16; g.stroke(); g.fillStyle = '#fff3'; g.beginPath(); g.ellipse(x - w * .25, y - r * .25, w * .3, r * .3, 0, 0, TAU); g.fill(); }
const gyOf = M => M.y + M.h - .15 * M.s;
function cloud(g, cx, cy, s, col, k) { g.fillStyle = col; for (const [dx, dy, rx, ry] of [[0, 0, 1.5, .5], [.8, -.25, 1.0, .5], [-.7, -.1, .8, .4]]) { g.beginPath(); g.ellipse(cx + dx * s * (k || 1), cy + dy * s * (k || 1), rx * s * (k || 1), ry * s * (k || 1), 0, 0, TAU); g.fill(); } }

// ---- はじまり（共通）：白い光・虹の放射・「当たり！」 ----
function intro(x) {
  const { g, W, H, M, s, u, t, tx } = x; if (u > INTRO + .1) return;
  const a = u < 1.15 ? 1 : cl(1 - (u - 1.15) / .3, 0, 1), bw = s * .55;
  for (let i = 0; i < 30; i++) { const q = i / 30; g.fillStyle = rain(i, t * 2.4, 58, a); g.fillRect(q * W, 0, W / 30 + 1, bw); g.fillRect(q * W, H - bw, W / 30 + 1, bw); g.fillRect(0, q * H, bw, H / 30 + 1); g.fillRect(W - bw, q * H, bw, H / 30 + 1); }
  for (let i = 0; i < 44; i++) { const an = hash(i, 71) * TAU, v = (3 + hash(i, 72) * 7) * s, k = eo(u / .9), px = W / 2 + Math.cos(an) * v * k, py = M.y + .75 * s + Math.sin(an) * v * k; star4(g, px, py, s * (.12 + .16 * hash(i, 73)) * a, rain(i, 0, 70, a), u * 4 + i); }
  g.globalAlpha = a; bigText(x, tx('win'), M.y + 3.9 * s + (hash(Math.floor(u * 40), 4) - .5) * s * .12 * a, eb((u - .06) / .3), rain(0, t * 3, 62), '#fff', 2.4 * s, -.05); g.globalAlpha = 1;
  if (u < .16) { g.fillStyle = 'rgba(255,255,255,' + fa((1 - u / .16) * .9) + ')'; g.fillRect(0, 0, W, H); }
}
// ---- おわり（共通）：何色の当たりかを見せる帯 ----
function outro(x, c) {
  const { g, W, H, M, s, u, t, tx, seq } = x; if (u < OUT0) return; const k = eo((u - OUT0) / .3), C = COLORS[c], bh = 3.3 * s, by = M.y + 3.2 * s;
  g.save(); g.globalAlpha = k; g.fillStyle = 'rgba(8,10,24,.86)'; g.fillRect(0, by, W, bh); g.fillStyle = C.hex; g.fillRect(0, by, W, .12 * s); g.fillRect(0, by + bh - .12 * s, W, .12 * s);
  g.textAlign = 'center'; g.textBaseline = 'middle'; const h1 = tx('winc', { c: tx('c' + c) }); fit(g, h1, W * .9, 1.15 * s); outline(g, h1, W / 2, by + .98 * s, C.lite, '#000', .1 * s);
  g.font = F(.62 * s); g.fillStyle = '#fff'; g.fillText(seq.d.join('') + '  ' + tx('e' + c), W / 2, by + 2.02 * s);
  const sub = seq.newc ? tx('newc') : tx('dupc', { n: seq.cnt || 2 }); g.font = F(.44 * s, 800); g.fillStyle = seq.newc ? '#ffd60a' : '#9fb0d8'; g.fillText(sub, W / 2, by + 2.72 * s);
  for (let i = 0; i < 14; i++) { const px = hash(i, 91) * W, py = by + (hash(i, 92) < .5 ? -.25 * s : bh + .25 * s), tw = .5 + .5 * Math.sin(t * 6 + i * 2); star4(g, px, py, s * .2 * tw, C.lite, t + i); }
  g.restore();
}
const introMach = x => ({ dx: (hash(Math.floor(x.u * 50), 1) - .5) * x.s * .16, dy: -Math.sin(Math.min(x.u / .5, 1) * Math.PI) * .6 * x.s, rot: (hash(Math.floor(x.u * 50), 2) - .5) * .03, sc: 1.04 });
function wrapScene(c, sc) {
  return {
    bg(x) { const { g, W, H, M, u } = x; if (u < INTRO + .2) { night(g, W, H, x.it, M); g.fillStyle = 'rgba(4,6,20,.5)'; g.fillRect(0, 0, W, H); rays(x, 14, i => rain(i, x.t, 58), .5, 1.2); } if (u > INTRO - .2) { g.save(); if (u < INTRO + .2) { g.beginPath(); g.arc(W / 2, M.y + M.h / 2, eo((u - INTRO + .2) / .4) * Math.hypot(W, H) * .6, 0, TAU); g.clip(); } sc.bg(x, Math.max(0, u - INTRO)); g.restore(); } },
    back(x) { if (x.u >= INTRO) sc.back(x, x.u - INTRO); },
    mach(x) { return x.u < INTRO ? introMach(x) : sc.mach(x, x.u - INTRO); },
    fx(x) { return x.u < INTRO ? { glow: rain(0, x.t * 2), glowK: 1 } : (sc.fx ? sc.fx(x, x.u - INTRO) : {}); },
    front(x) { if (x.u >= INTRO) sc.front(x, x.u - INTRO); intro(x); outro(x, c); }
  };
}

// ===== 0 赤：大噴火 =====
const RED = {
  bg(x, v) { const { g, W, H, M, s, it } = x, gy = gyOf(M); skyGrad(g, W, H, [[0, '#120202'], [.55, '#5c0b07'], [1, '#ff5a1f']]);
    for (let i = 0; i < 5; i++) { const bx = (i - .5) * W / 4, bh = (2 + hash(i, 3) * 3) * s; g.fillStyle = '#1a0503'; g.beginPath(); g.moveTo(bx - 3 * s, gy); g.lineTo(bx - .5 * s, gy - bh); g.lineTo(bx + .5 * s, gy - bh); g.lineTo(bx + 3 * s, gy); g.fill(); g.fillStyle = 'rgba(255,120,30,' + (.5 + .3 * Math.sin(it * 5 + i)) + ')'; g.fillRect(bx - .45 * s, gy - bh, .9 * s, .14 * s); }
    g.fillStyle = '#170403'; g.fillRect(0, gy, W, H - gy);
    g.strokeStyle = 'rgba(255,140,40,' + (.6 + .3 * Math.sin(it * 9)) + ')'; g.lineWidth = s * .08; g.lineJoin = 'round'; for (let i = 0; i < 7; i++) { const a0 = -Math.PI * (i / 6), len = (2 + hash(i, 5) * 3) * s * cl(v / 1.2, 0, 1); g.beginPath(); let px = W / 2, py = gy + .25 * s; g.moveTo(px, py); for (let j = 0; j < 5; j++) { px += Math.cos(a0 + (hash(i * 9 + j, 6) - .5)) * len / 5; py += Math.abs(Math.sin(a0)) * len / 14 + (hash(i * 9 + j, 7)) * s * .1; g.lineTo(px, py); } g.stroke(); }
    for (let i = 0; i < 70; i++) { const px = hash(i, 21) * W + Math.sin(it * 2 + i) * s * .3, py = H - ((it * (1.5 + hash(i, 22) * 2.5) * s + hash(i, 23) * H) % (H * 1.1)); g.globalAlpha = .4 + .5 * hash(i, 24); ball(g, px, py, s * (.03 + .05 * hash(i, 25)), i % 3 ? '#ff9a3a' : '#ffe08a'); } g.globalAlpha = 1; },
  back(x, v) { const { g, W, M, s, it } = x; if (v > .7) { const k = cl((v - .7) / .4, 0, 1); g.save(); g.globalCompositeOperation = 'lighter'; flame(g, W / 2, M.y + .4 * s, 3.4 * s * k, 7.5 * s * k, it, 3, 'rgba(255,90,20,.95)', 'rgba(255,210,60,0)'); flame(g, W / 2, M.y + .4 * s, 2 * s * k, 5.5 * s * k, it * 1.3, 9, 'rgba(255,220,120,.9)', 'rgba(255,255,255,0)'); g.restore(); } },
  mach(x, v) { const { s, t } = x, q = Math.floor(t * 50), amp = v < .7 ? v / .7 * .12 : .2 + .12 * Math.sin(v * 3); return { dx: (hash(q, 1) - .5) * s * amp * 2, dy: (hash(q, 2) - .5) * s * amp - (v > .7 ? Math.abs(Math.sin((v - .7) * 5.5)) * .12 * s : 0), rot: (hash(q, 3) - .5) * amp * .14, sc: 1 + cl(v / .7, 0, 1) * .05 }; },
  fx(x, v) { return { body: v < .7 ? '#ffe3dc' : '#ffb9a6', glow: '#ff3b1e', glowK: .6 + .4 * Math.sin(x.it * 12), noCan: v > .7 }; },
  front(x, v) { const { g, W, H, M, s, it, tx } = x, gy = gyOf(M);
    if (v > .7) { const N = 90, per = 5.6; for (let i = 0; i < N; i++) { const e = .7 + ((i * .0622) % per), tau = (v - e) % per; if (v < e || tau < 0 || tau > 3.2) continue; const vx = (hash(i, 31) - .5) * 9 * s, vy = -(13 + hash(i, 32) * 9) * s, px = W / 2 + vx * tau, py = M.y + .2 * s + vy * tau + 9.5 * s * tau * tau; if (py > H + s) continue; g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .5; ball(g, px, py, .5 * s, 'rgba(255,120,30,.5)'); g.restore(); drawCan(g, px, py, .5 * s, .82 * s, i % 2 ? 0 : 9, tau * (6 + hash(i, 33) * 8)); } }
    g.save(); g.globalCompositeOperation = 'lighter'; flame(g, M.x - .2 * s, gy + .3 * s, 2.4 * s, 3.2 * s * cl(v / .8, 0, 1), it, 5, 'rgba(255,80,20,.9)', 'rgba(255,200,60,0)'); flame(g, M.x + M.w + .2 * s, gy + .3 * s, 2.4 * s, 3.2 * s * cl(v / .8, 0, 1), it, 8, 'rgba(255,80,20,.9)', 'rgba(255,200,60,0)'); g.restore();
    for (const b of [.7, 3.3, 5.6]) { const r = v - b; if (r > 0 && r < .9) { g.strokeStyle = 'rgba(255,200,120,' + (1 - r / .9) + ')'; g.lineWidth = s * .2 * (1 - r / .9); g.beginPath(); g.arc(W / 2, M.y + .5 * s, r * 11 * s, 0, TAU); g.stroke(); if (r < .14) { g.fillStyle = 'rgba(255,230,200,' + fa((1 - r / .14) * .7) + ')'; g.fillRect(0, 0, W, H); } } }
    if (v > .9 && v < OUT0 - INTRO) bigText(x, tx('e0'), M.y - 1.3 * s + (hash(Math.floor(it * 30), 5) - .5) * s * .14, eb((v - .9) / .3), '#ffd23a', '#b3261e', 2.0 * s, -.04); }
};
// ===== 1 橙：夏祭り =====
const ORANGE = {
  bg(x, v) { const { g, W, H, M, s, it } = x, gy = gyOf(M); skyGrad(g, W, H, [[0, '#2a1048'], [.45, '#b8402f'], [.75, '#ff9a2a'], [1, '#ffd27a']]);
    ball(g, W / 2, gy - .2 * s, 2.6 * s, '#ffe9a8'); g.fillStyle = '#3a1608'; g.fillRect(0, gy, W, H - gy);
    for (let k = 0; k < 2; k++) { const bx = k ? W - 2.3 * s : -.4 * s, bw = 2.7 * s; g.fillStyle = '#2a0f06'; g.fillRect(bx + .15 * s, gy - 2.1 * s, .14 * s, 2.1 * s); g.fillRect(bx + bw - .29 * s, gy - 2.1 * s, .14 * s, 2.1 * s); for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#fff4e0' : '#e8452c'; g.fillRect(bx + (bw / 6) * i, gy - 2.7 * s, bw / 6 + 1, .7 * s); } g.fillStyle = '#ffcf6a'; g.fillRect(bx + .3 * s, gy - 1.6 * s, bw - .6 * s, .9 * s); }
    const FW = [[.2, .22, .4], [.75, .16, 1.2], [.5, .1, 2.0], [.15, .12, 2.9], [.82, .25, 3.6], [.45, .2, 4.4], [.28, .08, 5.2], [.7, .1, 5.9]];
    FW.forEach(([fx_, fy, b], i) => firework(g, W * fx_, H * fy + s, (2.2 + hash(i, 4)) * s, v - b, 34, i % 3 === 0 ? '#ffb347' : i % 3 === 1 ? '#fff1a8' : '#ff7a9a', i * 7 + 1, s)); },
  back(x, v) { const { g, W, M, s, it } = x, k = eb(v / .6);
    for (let side = 0; side < 2; side++) { const x0 = side ? W + s : -s, x1 = W / 2, y0 = M.y - 3.4 * s, y1 = M.y - 1.0 * s; g.strokeStyle = '#2a0f06'; g.lineWidth = s * .05; g.beginPath(); for (let i = 0; i <= 20; i++) { const q = i / 20, px = lerp(x0, x1, q), py = lerp(y0, y1, q) + Math.sin(q * Math.PI) * 1.3 * s - (1 - k) * 6 * s; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke();
      for (let i = 1; i < 7; i++) { const q = i / 7.5, px = lerp(x0, x1, q), py = lerp(y0, y1, q) + Math.sin(q * Math.PI) * 1.3 * s - (1 - k) * 6 * s, sw = Math.sin(it * 2.2 + i + side * 2) * .12; g.save(); g.translate(px, py); g.rotate(sw); g.save(); g.globalCompositeOperation = 'lighter'; ball(g, 0, .5 * s, .75 * s, 'rgba(255,150,50,.22)'); g.restore(); g.fillStyle = i % 2 ? '#ff5a2a' : '#ff9a2a'; g.beginPath(); g.ellipse(0, .5 * s, .34 * s, .44 * s, 0, 0, TAU); g.fill(); g.fillStyle = '#2a0f06'; g.fillRect(-.16 * s, .02 * s, .32 * s, .1 * s); g.fillRect(-.16 * s, .9 * s, .32 * s, .1 * s); g.strokeStyle = '#0003'; g.lineWidth = 1; for (let j = -1; j <= 1; j++) { g.beginPath(); g.ellipse(0, .5 * s, .34 * s * Math.abs(j) * .6 + .02 * s, .44 * s, 0, 0, TAU); g.stroke(); } g.restore(); } }
    for (let i = 0; i < 10; i++) { const an = i * TAU / 10 + v * .9; if (Math.sin(an) >= 0) continue; drawCan(g, W / 2 + Math.cos(an) * 4.0 * s, M.y + M.h * .62 + Math.sin(an) * 1.1 * s - Math.abs(Math.sin(v * 7 + i)) * .3 * s, .5 * s, .8 * s, i, Math.sin(v * 7 + i) * .2); } },
  mach(x, v) { const b = Math.abs(Math.sin(v * Math.PI / .45)); return { dy: -b * .38 * x.s, rot: Math.sin(v * Math.PI / .9) * .05, sc: 1 + b * .02 }; },
  fx() { return { glow: '#ff9500', glowK: .7, body: '#fff1dc' }; },
  front(x, v) { const { g, W, H, M, s, it, tx } = x;
    for (let i = 0; i < 10; i++) { const an = i * TAU / 10 + v * .9; if (Math.sin(an) < 0) continue; drawCan(g, W / 2 + Math.cos(an) * 4.0 * s, M.y + M.h * .62 + Math.sin(an) * 1.1 * s - Math.abs(Math.sin(v * 7 + i)) * .3 * s, .56 * s, .9 * s, i, Math.sin(v * 7 + i) * .2); }
    for (let i = 0; i < 40; i++) { const px = (hash(i, 41) * W + Math.sin(it + i) * s) % W, py = ((it * (1 + hash(i, 42)) * s * 1.6 + hash(i, 43) * H) % (H + s)) - s * .5; g.fillStyle = ['#ff9500', '#fff1a8', '#ff5a2a', '#fff'][i % 4]; g.save(); g.translate(px, py); g.rotate(it * 3 + i); g.fillRect(-.08 * s, -.05 * s, .16 * s, .1 * s); g.restore(); }
    const beat = 1 + .08 * Math.abs(Math.sin(v * Math.PI / .45)); if (v > .5 && v < OUT0 - INTRO) bigText(x, tx('e1'), M.y - 1.3 * s, eb((v - .5) / .3) * beat, '#fff', '#e8452c', 2.0 * s, .03); }
};
// ===== 2 黄：一攫千金（雷→金貨の雨） =====
const STR = [.25, 1.25, 2.25];
const YELLOW = {
  bg(x, v) { const { g, W, H, M, s, it } = x, gy = gyOf(M), k = sm((v - 2.9) / .6);
    skyGrad(g, W, H, [[0, '#0a0a12'], [.6, '#23232e'], [1, '#4a4420']]);
    if (k > 0) { g.globalAlpha = k; skyGrad(g, W, H, [[0, '#ffb300'], [.5, '#ffe27a'], [1, '#fff6c8']]); g.globalAlpha = 1; rays(x, 12, 'rgba(255,255,255,1)', .22 * k, .3); }
    for (let i = 0; i < 9; i++) { const cx = ((hash(i, 51) * W * 1.4 + it * s * (.3 + hash(i, 52))) % (W * 1.4)) - W * .2, cy = hash(i, 53) * H * .3; g.globalAlpha = (1 - k) * .85; cloud(g, cx, cy, s, '#15151c', 1.7); } g.globalAlpha = 1;
    g.fillStyle = k > .5 ? '#c8961e' : '#14141a'; g.fillRect(0, gy, W, H - gy); },
  back(x, v) { const { g, W, H, M, s, seq } = x;
    STR.forEach((b, j) => { const r = v - b; if (r < 0 || r > .32) return; const a = 1 - r / .32; g.save(); g.lineJoin = 'miter'; for (let w = 0; w < 2; w++) { g.strokeStyle = w ? 'rgba(255,255,255,' + a + ')' : 'rgba(255,220,60,' + a * .8 + ')'; g.lineWidth = s * (w ? .1 : .34); g.beginPath(); let px = W / 2 + (hash(j, 61) - .5) * 4 * s, py = -s; g.moveTo(px, py); const n = 10; for (let i = 1; i <= n; i++) { const q = i / n; px = lerp(px, W / 2, q * q) + (hash(j * 20 + i, 62) - .5) * s * 1.5 * (1 - q); py = lerp(-s, M.y + .1 * s, q); g.lineTo(px, py); } g.stroke(); } g.restore(); if (r < .1) { g.fillStyle = 'rgba(255,255,230,' + fa((1 - r / .1) * .75) + ')'; g.fillRect(0, 0, W, H); } });
    if (v > 3) { const n = Math.min(60, Math.floor((v - 3) * 14)); for (let i = 0; i < n; i++) { const px = W / 2 + (hash(i, 65) - .5) * (2 + i * .13) * s * 1.6, py = gyOf(M) + .5 * s - Math.max(0, (1 - Math.abs(px - W / 2) / (5 * s))) * (i * .03) * s; coin(g, px, py, .26 * s, Math.PI / 2 - .35); } } },
  mach(x, v) { const { s, t } = x; let j = 0, sh = 0; STR.forEach(b => { const r = v - b; if (r > 0 && r < .5) { j = Math.max(j, Math.sin(r / .5 * Math.PI)); sh = Math.max(sh, 1 - r / .5); } }); const q = Math.floor(t * 50); return { dx: (hash(q, 1) - .5) * s * .3 * sh, dy: -j * .45 * s + (v > 3 ? Math.sin(v * 2.4) * .12 * s - .25 * s * sm((v - 3) / .8) : 0), rot: (hash(q, 2) - .5) * .05 * sh, sc: 1 + (v > 3 ? .04 : 0) }; },
  fx(x, v) { return v > 3 ? { body: '#ffe27a', glow: '#ffd60a', glowK: 1 } : { glow: '#ffe45a', glowK: Math.max(0, ...STR.map(b => { const r = v - b; return r > 0 && r < .6 ? 1 - r / .6 : 0; })) }; },
  front(x, v) { const { g, W, H, M, s, it, t, tx } = x;
    STR.forEach((b, j) => { const r = v - b; if (r < 0 || r > .6) return; g.strokeStyle = 'rgba(255,240,120,' + (1 - r / .6) + ')'; g.lineWidth = s * .07; g.beginPath(); const n = 40; for (let i = 0; i <= n; i++) { const q = i / n, per = (M.w + M.h) * 2, d = q * per, jx = (hash(Math.floor(t * 30) * 50 + i, 66) - .5) * s * .5, jy = (hash(Math.floor(t * 30) * 50 + i, 67) - .5) * s * .5; let px, py; if (d < M.w) { px = M.x + d; py = M.y; } else if (d < M.w + M.h) { px = M.x + M.w; py = M.y + d - M.w; } else if (d < 2 * M.w + M.h) { px = M.x + M.w - (d - M.w - M.h); py = M.y + M.h; } else { px = M.x; py = M.y + M.h - (d - 2 * M.w - M.h); } i ? g.lineTo(px + jx, py + jy) : g.moveTo(px + jx, py + jy); } g.stroke(); });
    if (v > 2.9) { for (let i = 0; i < 110; i++) { const sp = (5 + hash(i, 71) * 6) * s, y0 = -hash(i, 72) * H * 1.2, py = ((y0 + (v - 2.9) * sp + H * 2) % (H * 1.25)) - s, px = hash(i, 73) * W; if ((v - 2.9) * sp + y0 < -s) continue; coin(g, px, py, s * (.2 + .14 * hash(i, 74)), v * (4 + hash(i, 75) * 6) + i); }
      for (let i = 0; i < 16; i++) { const tw = Math.max(0, Math.sin(it * 5 + i * 1.9)); star4(g, hash(i, 76) * W, hash(i, 77) * H, s * .32 * tw, '#fff', it + i); }
      if (v < OUT0 - INTRO) { bigText(x, tx('e2'), M.y - 1.3 * s, eb((v - 3.1) / .35), '#ffe27a', '#8a5a00', 2.0 * s, -.03); } } }
};
// ===== 3 緑：大豊作（つるが伸びて、空まで育つ） =====
const GREEN = {
  bg(x, v) { const { g, W, H, M, s, it } = x, gy = gyOf(M), up = sm((v - .8) / 2.2), drop = up * H * .9;
    skyGrad(g, W, H, [[0, '#2f9bff'], [.6, '#9fe0ff'], [1, '#e9fff0']]); rays(x, 10, 'rgba(255,255,255,1)', .16, .15);
    ball(g, W * .8, H * .16 + drop * .15, 1.1 * s, '#fff6b0');
    for (let i = 0; i < 9; i++) { const cx = ((hash(i, 81) * W * 1.5 + it * s * .25) % (W * 1.5)) - W * .25, cy = ((hash(i, 82) * H * 1.6 - H * .7 + drop * (.5 + hash(i, 83) * .5)) % (H * 1.4)) - H * .1; cloud(g, cx, cy, s, '#fffffff0'); }
    g.fillStyle = '#3aa648'; g.beginPath(); g.moveTo(0, gy + drop); for (let i = 0; i <= 12; i++) g.lineTo(W * i / 12, gy + drop - Math.sin(i * 1.3) * .35 * s); g.lineTo(W, H + drop); g.lineTo(0, H + drop); g.fill(); g.fillStyle = '#2c8a3a'; g.fillRect(0, gy + drop + .6 * s, W, H); },
  back(x, v) { const { g, W, H, M, s, it } = x, gy = gyOf(M), k = sm(v / .9), top = gy, bot = H + s * 2;
    g.lineCap = 'round'; for (let w = 0; w < 2; w++) { g.strokeStyle = w ? '#5fd86f' : '#1f8a3a'; g.lineWidth = s * (w ? .5 : 1.3); g.beginPath(); for (let i = 0; i <= 24; i++) { const q = i / 24, py = lerp(bot, top, q * k), px = W / 2 + Math.sin(q * 7 + it * .8) * s * .5 * (1 - q) + (w ? -.2 * s : 0); i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); }
    for (let i = 0; i < 6; i++) { const q = (i + 1) / 7; if (q > k) continue; const py = lerp(bot, top, q), px = W / 2 + Math.sin(q * 7 + it * .8) * s * .5 * (1 - q), dir = i % 2 ? 1 : -1, lk = eb(cl((k - q) * 6, 0, 1)); g.fillStyle = '#34b84e'; g.save(); g.translate(px, py); g.rotate(dir * (.5 + Math.sin(it * 1.6 + i) * .1)); g.scale(lk, lk); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(dir * 1.2 * s, -1.0 * s, dir * 2.4 * s, 0); g.quadraticCurveTo(dir * 1.2 * s, .7 * s, 0, 0); g.fill(); g.restore(); } },
  mach(x, v) { return { dy: -sm(v / 1.2) * .5 * x.s + Math.sin(v * 1.8) * .1 * x.s, rot: Math.sin(v * 1.2) * .035, sc: 1 }; },
  fx() { return { glow: '#30c759', glowK: .6, body: '#effbe9' }; },
  front(x, v) { const { g, W, H, M, s, it, tx } = x;
    g.save(); const md = GREEN.mach(x, v); g.translate(0, md.dy);
    const VN = [[M.x - .1 * s, M.y + M.h * .95, M.x + M.w * .4, M.y + M.h * .5, M.x + M.w + .1 * s, M.y + M.h * .62], [M.x + M.w + .1 * s, M.y + M.h * .9, M.x + M.w * .5, M.y + M.h * .3, M.x - .1 * s, M.y + M.h * .34], [M.x - .1 * s, M.y + M.h * .7, M.x + M.w * .2, M.y + M.h * .05, M.x + M.w * .7, M.y - .2 * s], [M.x + M.w + .1 * s, M.y + M.h * .45, M.x + M.w * .9, M.y - .3 * s, M.x + M.w * .25, M.y - .15 * s]];
    VN.forEach((p, j) => { const k = sm((v - .5 - j * .35) / 1.3); if (k <= 0) return; g.strokeStyle = '#229a3c'; g.lineWidth = s * .13; g.lineCap = 'round'; g.beginPath(); const n = 22, pts = []; for (let i = 0; i <= n; i++) { const q = (i / n) * k, a = 1 - q; const px = a * a * p[0] + 2 * a * q * p[2] + q * q * p[4] + Math.sin(q * 16 + j) * s * .12, py = a * a * p[1] + 2 * a * q * p[3] + q * q * p[5]; pts.push([px, py]); i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke();
      for (let i = 2; i < pts.length; i += 3) { const [px, py] = pts[i], lk = eb(cl((k * n - i) / 3, 0, 1)); if (lk <= 0) continue; const kind = (i + j) % 4; if (kind === 0 && v > 2.4 + j * .2) { const fk = eb(cl((v - 2.4 - j * .2 - i * .03) / .4, 0, 1)); for (let pz = 0; pz < 5; pz++) { const an = pz * TAU / 5 + it * .4; ball(g, px + Math.cos(an) * .17 * s * fk, py + Math.sin(an) * .17 * s * fk, .13 * s * fk, ['#ffb3d1', '#fff', '#ffe27a'][j % 3]); } ball(g, px, py, .09 * s * fk, '#ffb300'); }
        else if (kind === 2 && v > 3.4) { const fk = eb(cl((v - 3.4 - i * .04) / .4, 0, 1)); g.strokeStyle = '#229a3c'; g.lineWidth = s * .04; g.beginPath(); g.moveTo(px, py); g.lineTo(px, py + .3 * s * fk); g.stroke(); drawCan(g, px + Math.sin(it * 2 + i) * .05 * s, py + .6 * s * fk, .36 * s * fk, .58 * s * fk, 3 + i, Math.sin(it * 2 + i) * .15); }
        else { g.fillStyle = '#3fcf5c'; g.save(); g.translate(px, py); g.rotate(i * 1.3 + Math.sin(it * 2 + i) * .15); g.scale(lk, lk); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(.25 * s, -.22 * s, .5 * s, 0); g.quadraticCurveTo(.25 * s, .18 * s, 0, 0); g.fill(); g.restore(); } } });
    g.restore();
    for (let i = 0; i < 7; i++) { const bx = ((hash(i, 91) * W + it * s * (.6 + hash(i, 92)) * (i % 2 ? 1 : -1)) % (W + 2 * s) + W + 2 * s) % (W + 2 * s) - s, by = H * (.2 + hash(i, 93) * .6) + Math.sin(it * 3 + i) * s * .5, fl = Math.abs(Math.sin(it * 14 + i)); if (v < 1.5) continue; g.fillStyle = ['#ffb3d1', '#ffe27a', '#fff', '#b8e0ff'][i % 4]; g.beginPath(); g.ellipse(bx - .12 * s * fl, by, .16 * s * fl + .02 * s, .22 * s, -.3, 0, TAU); g.ellipse(bx + .12 * s * fl, by, .16 * s * fl + .02 * s, .22 * s, .3, 0, TAU); g.fill(); }
    for (let i = 0; i < 26; i++) { const px = (hash(i, 95) * W + Math.sin(it * 1.5 + i) * s * .8), py = ((it * (.8 + hash(i, 96)) * s * 1.3 + hash(i, 97) * H) % (H + s)) - s * .5; g.fillStyle = i % 2 ? '#ffd0e2' : '#fff'; g.beginPath(); g.ellipse(px, py, .1 * s, .06 * s, it * 2 + i, 0, TAU); g.fill(); }
    if (v > 1.6 && v < OUT0 - INTRO) bigText(x, tx('e3'), M.y - 1.6 * s, eb((v - 1.6) / .35), '#fff', '#1f8a3a', 2.0 * s, .02); }
};
// ===== 4 青：大波（自販機が波に乗る） =====
function wave(g, W, H, y, amp, len, ph, col, s) { g.fillStyle = col; g.beginPath(); g.moveTo(0, H + s); for (let i = 0; i <= 30; i++) { const px = W * i / 30; g.lineTo(px, y + Math.sin(px / len + ph) * amp + Math.sin(px / len * 2.3 + ph * 1.7) * amp * .35); } g.lineTo(W, H + s); g.fill(); }
const BLUE = {
  bg(x, v) { const { g, W, H, M, s, it } = x; skyGrad(g, W, H, [[0, '#0b6fe0'], [.5, '#6ec6ff'], [1, '#dff6ff']]); ball(g, W * .2, H * .14, 1.0 * s, '#fffbe0'); rays(x, 8, 'rgba(255,255,255,1)', .12, .1);
    for (let i = 0; i < 5; i++) { const cx = ((hash(i, 101) * W * 1.4 + it * s * .3) % (W * 1.4)) - W * .2, cy = H * (.08 + hash(i, 102) * .2); cloud(g, cx, cy, s, '#fffffff0', .95); }
    const hy = H * .46; wave(g, W, H, hy, .12 * s, 1.4 * s, it * 1.2, '#0b62c8', s); wave(g, W, H, hy + .7 * s, .18 * s, 1.8 * s, -it * 1.6, '#0a56b4', s); },
  back(x, v) { const { g, W, H, M, s, it } = x, k = sm(v / 1.6), wy = lerp(H * 1.05, M.y + M.h * .74, k), ph = it * 2.2;
    // 大波（左から巻いてくる）
    g.fillStyle = '#0d7fe8'; g.beginPath(); g.moveTo(-s, H + s); g.lineTo(-s, wy + 1.5 * s); const cx = lerp(-W * .5, W * .1, k) + Math.sin(it) * s * .4; g.bezierCurveTo(cx - 2 * s, wy - 7.5 * s, cx + 4.5 * s, wy - 10 * s, cx + 5.4 * s, wy - 5.2 * s); g.bezierCurveTo(cx + 4.4 * s, wy - 6.6 * s, cx + 2.6 * s, wy - 4.6 * s, cx + 3 * s, wy); g.lineTo(W + s, wy + Math.sin(ph) * .2 * s); g.lineTo(W + s, H + s); g.fill();
    g.strokeStyle = '#fff'; g.lineWidth = s * .16; g.lineCap = 'round'; g.beginPath(); g.moveTo(-s, wy + 1.5 * s); g.bezierCurveTo(cx - 2 * s, wy - 7.5 * s, cx + 4.5 * s, wy - 10 * s, cx + 5.4 * s, wy - 5.2 * s); g.stroke();
    for (let i = 0; i < 14; i++) { const q = hash(i, 105), px = cx + 5.4 * s + (hash(i, 106) - .3) * s * 1.6, py = wy - 5.2 * s + ((it * 2 + q * 3) % 1.4) * s * 3.2; ball(g, px, py, s * (.06 + .1 * q), '#ffffffd0'); }
    wave(g, W, H, wy, .26 * s, 1.5 * s, ph, '#1590ff', s);
    // 板
    const md = BLUE.mach(x, v); g.save(); g.translate(W / 2 + md.dx, M.y + M.h / 2 + md.dy); g.rotate(md.rot); g.fillStyle = '#ffd23a'; g.beginPath(); g.ellipse(0, M.h / 2 - .05 * s, M.w * .78, .26 * s, 0, 0, TAU); g.fill(); g.fillStyle = '#ff6b3a'; g.fillRect(-M.w * .7, M.h / 2 - .09 * s, M.w * 1.4, .07 * s); g.restore(); },
  mach(x, v) { const s = x.s, k = sm(v / 1.6); return { dx: Math.sin(v * 1.1) * .5 * s * k, dy: -k * 1.3 * s + Math.sin(v * 2.6) * .3 * s * k, rot: (-.16 + Math.sin(v * 2.6 + .8) * .08) * k, sc: 1 - .1 * k }; },
  fx() { return { glow: '#6ec6ff', glowK: .5, body: '#eaf6ff' }; },
  front(x, v) { const { g, W, H, M, s, it, tx } = x, k = sm(v / 1.6), wy = lerp(H * 1.05, M.y + M.h * .74, k), md = BLUE.mach(x, v);
    const fy = M.y + M.h / 2 + md.dy + M.h * .42 * (1 - .08 * k);
    for (let i = 0; i < 26; i++) { const tau = ((it * 1.3 + hash(i, 111) * 2) % 1), an = -Math.PI * (.15 + hash(i, 112) * .7), sp = (3 + hash(i, 113) * 4) * s; ball(g, W / 2 + md.dx + (hash(i, 114) - .5) * M.w + Math.cos(an) * sp * tau, fy + Math.sin(an) * sp * tau + 5 * s * tau * tau, s * (.05 + .09 * hash(i, 115)) * (1 - tau) * k, '#ffffffe0'); }
    wave(g, W, H, wy + 1.15 * s, .26 * s, 1.9 * s, -it * 2.6, '#0d7fe8e8', s); wave(g, W, H, wy + 2.5 * s, .34 * s, 2.2 * s, it * 2, '#0a62c8f0', s);
    for (const [b, dir, yy] of [[2.2, 1, .2], [4.3, -1, .32], [6.1, 1, .12]]) { const r = (v - b) / 1.2; if (r < 0 || r > 1) continue; const px = lerp(dir > 0 ? -s : W + s, dir > 0 ? W + s : -s, r), py = wy + (1.6 - yy * 4) * s - Math.sin(r * Math.PI) * 4.6 * s; g.save(); g.translate(px, py); g.scale(dir, 1); g.rotate(-Math.cos(r * Math.PI) * .6); g.fillStyle = '#2b4f8a'; g.beginPath(); g.moveTo(-.9 * s, 0); g.quadraticCurveTo(-.2 * s, -.5 * s, .8 * s, -.08 * s); g.quadraticCurveTo(1.05 * s, 0, .8 * s, .08 * s); g.quadraticCurveTo(-.1 * s, .38 * s, -.9 * s, 0); g.fill(); g.beginPath(); g.moveTo(-.1 * s, -.3 * s); g.lineTo(-.35 * s, -.72 * s); g.lineTo(-.4 * s, -.26 * s); g.fill(); g.beginPath(); g.moveTo(-.85 * s, 0); g.lineTo(-1.3 * s, -.3 * s); g.lineTo(-1.15 * s, 0); g.lineTo(-1.3 * s, .3 * s); g.fill(); g.fillStyle = '#dfefff'; g.beginPath(); g.ellipse(.1 * s, .12 * s, .5 * s, .1 * s, 0, 0, TAU); g.fill(); g.restore(); }
    for (let i = 0; i < 6; i++) { const px = ((hash(i, 117) * W + it * s * .8) % (W + s)) - s * .5, py = wy + 1.9 * s + Math.sin(it * 2.4 + i) * .2 * s; drawCan(g, px, py, .44 * s, .7 * s, 4 + i, Math.sin(it * 2 + i) * .4 + 1.2); }
    for (let i = 0; i < 24; i++) { const px = hash(i, 118) * W + Math.sin(it * 2 + i) * .2 * s, py = H - ((it * (.6 + hash(i, 119)) * s * 2 + hash(i, 120) * H) % (H * .7)); g.strokeStyle = '#ffffffa0'; g.lineWidth = s * .03; g.beginPath(); g.arc(px, py, s * (.06 + .1 * hash(i, 121)), 0, TAU); g.stroke(); }
    if (v > 1.5 && v < OUT0 - INTRO) bigText(x, tx('e4'), M.y - 1.75 * s + Math.sin(it * 3) * .1 * s, eb((v - 1.5) / .35), '#fff', '#0a56b4', 2.0 * s, -.05); }
};
// ===== 5 藍：宇宙へ（打ち上げ） =====
const INDIGO = {
  bg(x, v) { const { g, W, H, M, s, it } = x, gy = gyOf(M), up = sm((v - 1.2) / 1.8), sp = sm((v - 2.2) / 1.6), calm = sm((v - 4.4) / 1.2);
    skyGrad(g, W, H, [[0, '#04041a'], [.6, '#10104f'], [1, '#2a2a8a']]);
    if (sp < 1) { g.save(); g.translate(0, up * H * 1.3); g.globalAlpha = 1 - sp; skyGrad(g, W, H, [[0, '#10104f00'], [.5, '#2a3a9a'], [1, '#6a7ad8']]); g.globalAlpha = 1; g.fillStyle = '#12142a'; g.fillRect(0, gy, W, H); for (let i = 0; i < 12; i++) { const bw = (.6 + hash(i, 5) * 1.1) * s, bh = (1 + hash(i, 6) * 3) * s; g.fillRect((i / 12) * W * 1.1 - s * .5, gy - bh, bw, bh); } g.restore(); }
    for (let i = 0; i < 90; i++) { const px = hash(i, 131) * W, spd = (6 + hash(i, 132) * 16) * s * (sp * (1 - calm * .93)), py = (hash(i, 133) * H + v * spd * 1.0 + it * s * .1) % H, len = Math.max(s * .04, spd * .05); g.strokeStyle = 'rgba(255,255,255,' + (.35 + .6 * hash(i, 134)) * sp + ')'; g.lineWidth = s * (.03 + .04 * hash(i, 135)); g.lineCap = 'round'; g.beginPath(); g.moveTo(px, py); g.lineTo(px, py + len); g.stroke(); }
    if (calm > 0) { g.globalAlpha = calm; const ey = H + 6.2 * s - calm * 1.6 * s; const eg = g.createRadialGradient(W / 2, ey, 6 * s, W / 2, ey, 8.4 * s); eg.addColorStop(0, '#1e6fe0'); eg.addColorStop(.86, '#2f9bff'); eg.addColorStop(.93, '#9fe0ff'); eg.addColorStop(1, '#9fe0ff00'); g.fillStyle = eg; g.beginPath(); g.arc(W / 2, ey, 8.4 * s, 0, TAU); g.fill(); g.fillStyle = '#34b84e99'; for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(W / 2 + (hash(i, 137) - .5) * 9 * s, ey - 7.2 * s + hash(i, 138) * 1.4 * s, 1.2 * s, .35 * s, hash(i, 139), 0, TAU); g.fill(); }
      ball(g, W * .82, H * .16, .75 * s, '#f1f0e4'); ball(g, W * .8, H * .15, .14 * s, '#d9d7c6'); ball(g, W * .85, H * .175, .1 * s, '#d9d7c6');
      g.save(); g.translate(W * .16, H * .26); g.rotate(-.4); ball(g, 0, 0, .5 * s, '#e8a85a'); g.strokeStyle = '#ffe0a8'; g.lineWidth = s * .08; g.beginPath(); g.ellipse(0, 0, .95 * s, .22 * s, 0, 0, TAU); g.stroke(); g.restore(); g.globalAlpha = 1; } },
  back(x, v) { const { g, W, H, M, s, it } = x, md = INDIGO.mach(x, v), gy = gyOf(M), calm = sm((v - 4.4) / 1.2);
    if (v < 3.2) { for (let i = 0; i < 26; i++) { const tau = (v * .7 + hash(i, 141)) % 1, dir = hash(i, 142) < .5 ? -1 : 1, up = sm((v - 1.2) / 1.8); ball(g, W / 2 + dir * (1 + tau * 5) * s * (.4 + hash(i, 143)), gy + up * H * 1.3 - tau * 1.6 * s * hash(i, 144), s * (.5 + tau * 1.3), 'rgba(220,225,240,' + (.5 * (1 - tau)) * cl(v / .4, 0, 1) + ')'); } }
    if (v > .3 && calm < 1) { g.save(); g.translate(W / 2 + md.dx, M.y + M.h / 2 + md.dy); g.rotate(md.rot); g.globalCompositeOperation = 'lighter'; const fl = cl((v - .3) / .6, 0, 1) * (1 - calm), fh = (4 + Math.sin(it * 40) * .6) * s * fl; for (const [w, c0] of [[2.6, 'rgba(255,120,30,.9)'], [1.6, 'rgba(255,230,120,.95)'], [.8, 'rgba(255,255,255,1)']]) { const gr = g.createLinearGradient(0, M.h / 2, 0, M.h / 2 + fh); gr.addColorStop(0, c0); gr.addColorStop(1, 'rgba(80,80,255,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(-w * s / 2, M.h / 2 - .2 * s); g.quadraticCurveTo(0, M.h / 2 + fh * 2 * (w / 2.6), w * s / 2, M.h / 2 - .2 * s); g.fill(); } g.restore(); }
    if (calm > 0) for (let i = 0; i < 8; i++) { const an = i * TAU / 8 + v * .8; if (Math.sin(an) >= 0) continue; drawCan(g, W / 2 + md.dx + Math.cos(an) * 3.9 * s, M.y + M.h / 2 + md.dy + Math.sin(an) * 1.2 * s, .42 * s * calm, .68 * s * calm, i + 4, an * 2); } },
  mach(x, v) { const { s, t } = x, q = Math.floor(t * 50), rum = v < 3 ? cl(v / .5, 0, 1) * (1 - sm((v - 2.2) / .8)) : 0, calm = sm((v - 4.4) / 1.2); return { dx: (hash(q, 1) - .5) * s * .2 * rum + Math.sin(v * .9) * .3 * s * calm, dy: (hash(q, 2) - .5) * s * .14 * rum - sm((v - 1.0) / 1.4) * .9 * s + Math.sin(v * 1.3) * .25 * s * calm, rot: Math.sin(v * .7) * .22 * calm + (hash(q, 3) - .5) * .02 * rum, sc: 1 - .12 * calm }; },
  fx(x, v) { return { glow: '#7a7aff', glowK: .7, noCan: v > 1 }; },
  front(x, v) { const { g, W, H, M, s, it, tx } = x, md = INDIGO.mach(x, v), calm = sm((v - 4.4) / 1.2);
    if (calm > 0) for (let i = 0; i < 8; i++) { const an = i * TAU / 8 + v * .8; if (Math.sin(an) < 0) continue; drawCan(g, W / 2 + md.dx + Math.cos(an) * 3.9 * s, M.y + M.h / 2 + md.dy + Math.sin(an) * 1.2 * s, .5 * s * calm, .8 * s * calm, i + 4, an * 2); }
    for (const [b, x0, y0] of [[4.8, .9, .1], [5.7, .6, .05], [6.4, 1.0, .3]]) { const r = (v - b) / .6; if (r < 0 || r > 1) continue; const px = W * x0 - r * W * .7, py = H * y0 + r * H * .3; g.strokeStyle = 'rgba(255,255,255,' + (1 - r) + ')'; g.lineWidth = s * .07; g.lineCap = 'round'; g.beginPath(); g.moveTo(px, py); g.lineTo(px + 1.6 * s, py - .7 * s); g.stroke(); star4(g, px, py, .2 * s, '#fff', it); }
    for (let i = 0; i < 14; i++) { const tw = Math.max(0, Math.sin(it * 4 + i * 2.1)); star4(g, hash(i, 151) * W, hash(i, 152) * H * .8, s * .26 * tw * calm, '#cfd4ff', it + i); }
    if (v > 2.4 && v < OUT0 - INTRO) bigText(x, tx('e5'), M.y - 1.75 * s, eb((v - 2.4) / .35), '#fff', '#3a3ad0', 2.0 * s, .04); }
};
// ===== 6 紫：降臨（魔法陣と、巨大な缶） =====
const PURPLE = {
  bg(x, v) { const { g, W, H, M, s, it } = x; skyGrad(g, W, H, [[0, '#0d0220'], [.6, '#3a0b5c'], [1, '#7a2aa8']]); rays(x, 18, i => i % 2 ? 'rgba(220,150,255,1)' : 'rgba(120,60,200,1)', .16, -.25);
    for (let i = 0; i < 60; i++) { const px = hash(i, 161) * W + Math.sin(it + i) * s * .4, py = H - ((it * (.5 + hash(i, 162)) * s * 1.4 + hash(i, 163) * H) % (H * 1.05)); g.globalAlpha = .3 + .6 * hash(i, 164); ball(g, px, py, s * (.03 + .06 * hash(i, 165)), i % 3 ? '#e0b0ff' : '#fff'); } g.globalAlpha = 1; },
  back(x, v) { const { g, W, H, M, s, it } = x, gy = gyOf(M), k = eo(v / .9);
    g.save(); g.translate(W / 2, gy + .2 * s); g.scale(1, .3); g.rotate(it * .7); g.globalCompositeOperation = 'lighter'; g.strokeStyle = 'rgba(224,160,255,' + (.9 * k) + ')'; g.lineWidth = s * .09; const R = 4.6 * s * k;
    for (const q of [1, .82, .5]) { g.beginPath(); g.arc(0, 0, R * q, 0, TAU); g.stroke(); }
    for (let tri = 0; tri < 2; tri++) { g.beginPath(); for (let i = 0; i <= 3; i++) { const an = i * TAU / 3 + tri * Math.PI; g.lineTo(Math.cos(an) * R * .82, Math.sin(an) * R * .82); } g.stroke(); }
    g.save(); g.rotate(-it * 1.6); for (let i = 0; i < 24; i++) { const an = i * TAU / 24; g.beginPath(); g.moveTo(Math.cos(an) * R * .86, Math.sin(an) * R * .86); g.lineTo(Math.cos(an) * R * .96, Math.sin(an) * R * .96); g.stroke(); if (i % 3 === 0) { g.beginPath(); g.arc(Math.cos(an + .13) * R * .91, Math.sin(an + .13) * R * .91, s * .1, 0, TAU); g.stroke(); } } g.restore(); g.restore();
    if (v > .7) { const pk = sm((v - .7) / .8), pw = (2.6 + Math.sin(it * 9) * .2) * s * pk; g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(W / 2 - pw, 0, W / 2 + pw, 0); gr.addColorStop(0, 'rgba(180,85,232,0)'); gr.addColorStop(.5, 'rgba(240,200,255,' + fa(.55) + ')'); gr.addColorStop(1, 'rgba(180,85,232,0)'); g.fillStyle = gr; g.fillRect(W / 2 - pw, 0, pw * 2, gy + .3 * s); g.restore(); }
    if (v > 2.2) { const dk = eo((v - 2.2) / 1.9), cy = lerp(-4 * s, M.y - 2.2 * s, dk) + Math.sin(it * 1.5) * .15 * s; g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 16; i++) { const an = i * TAU / 16 + it * .5; g.fillStyle = 'rgba(255,230,160,' + fa(.2) + ')'; g.beginPath(); g.moveTo(W / 2, cy); g.lineTo(W / 2 + Math.cos(an) * 7 * s, cy + Math.sin(an) * 7 * s); g.lineTo(W / 2 + Math.cos(an + .16) * 7 * s, cy + Math.sin(an + .16) * 7 * s); g.fill(); } ball(g, W / 2, cy, 2.6 * s, 'rgba(255,240,200,' + fa(.3) + ')'); g.restore(); } },
  mach(x, v) { const s = x.s, k = eo((v - .5) / 1.6); return { dy: -k * .55 * s + Math.sin(v * 1.6) * .12 * s * k + sm((v - 2.2) / 1.9) * 1.0 * s, rot: Math.sin(v * 1.1) * .03 * k, sc: 1 - .1 * sm((v - 2.2) / 1.9) }; },
  fx() { return { glow: '#c77dff', glowK: .9, body: '#f4e6ff' }; },
  front(x, v) { const { g, W, H, M, s, it, tx } = x, md = PURPLE.mach(x, v);
    for (let i = 0; i < 7; i++) { const an = i * TAU / 7 + v * 1.4, px = W / 2 + Math.cos(an) * 3.7 * s, py = M.y + M.h / 2 + md.dy + Math.sin(an) * 1.0 * s + Math.sin(v * 3 + i) * .3 * s; g.save(); g.globalCompositeOperation = 'lighter'; ball(g, px, py, .34 * s, 'rgba(200,120,255,.35)'); ball(g, px, py, .14 * s, COLORS[i].lite); g.restore(); }
    if (v > 2.2) { const dk = eo((v - 2.2) / 1.9), cy = lerp(-4 * s, M.y - 2.2 * s, dk) + Math.sin(it * 1.5) * .15 * s; g.save(); g.shadowColor = '#ffe9a8'; g.shadowBlur = s * 1.2; drawCan(g, W / 2, cy, 2.3 * s, 3.7 * s, 5, Math.sin(it * 1.2) * .06); g.restore();
      g.save(); g.translate(W / 2, cy - 2.25 * s); g.scale(1, .3); g.strokeStyle = '#ffe27a'; g.lineWidth = s * .16; g.beginPath(); g.arc(0, 0, 1.2 * s, 0, TAU); g.stroke(); g.restore();
      const r = v - 4.1; if (r > 0 && r < 1) { g.strokeStyle = 'rgba(255,240,200,' + (1 - r) + ')'; g.lineWidth = s * .22 * (1 - r); g.beginPath(); g.arc(W / 2, cy, r * 10 * s, 0, TAU); g.stroke(); if (r < .14) { g.fillStyle = 'rgba(255,245,255,' + fa((1 - r / .14) * .7) + ')'; g.fillRect(0, 0, W, H); } }
      for (let i = 0; i < 22; i++) { const px = hash(i, 171) * W + Math.sin(it * 1.2 + i) * s, py = ((it * (.5 + hash(i, 172) * .6) * s * 1.6 + hash(i, 173) * H) % (H + s)) - s * .5; g.fillStyle = '#fff6e0d0'; g.save(); g.translate(px, py); g.rotate(Math.sin(it * 2 + i) * .8); g.beginPath(); g.ellipse(0, 0, .26 * s, .07 * s, 0, 0, TAU); g.fill(); g.restore(); } }
    if (v > 4.2 && v < OUT0 - INTRO) bigText(x, tx('e6'), M.y + M.h * .62, eb((v - 4.2) / .4), '#fff', '#8a2be2', 2.5 * s, 0); }
};
export const winFX = [RED, ORANGE, YELLOW, GREEN, BLUE, INDIGO, PURPLE].map((sc, c) => wrapScene(c, sc));

// ===== 7色そろったとき：光の柱→虹がかかる→王冠 =====
export const compFX = {
  bg(x) { const { g, W, H, M, s, it, cu } = x, k = sm((cu - 3.5) / .9); g.fillStyle = '#03030a'; g.fillRect(0, 0, W, H);
    if (k > 0) { g.globalAlpha = k; skyGrad(g, W, H, [[0, '#3a7bff'], [.55, '#ffc8e0'], [1, '#fff3c0']]); g.globalAlpha = 1; rays(x, 14, 'rgba(255,255,255,1)', .2 * k, .25); const gy = gyOf(M); g.fillStyle = 'rgba(255,255,255,' + k + ')'; for (let i = 0; i < 7; i++) { g.beginPath(); g.ellipse(W * (i / 6), gy + .5 * s, 1.6 * s, .7 * s, 0, 0, TAU); g.fill(); } g.fillRect(0, gy + .5 * s, W, H); } },
  back(x) { const { g, W, H, M, s, it, cu } = x, gy = gyOf(M);
    g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < NCOL; i++) { const b = .3 + i * .42, r = cu - b; if (r < 0) continue; const a = Math.min(1, r / .2) * (1 - sm((cu - 3.6) / .7)), bw = W / 8, cx = W * (i + .5) / 7, gr = g.createLinearGradient(cx - bw, 0, cx + bw, 0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(.5, COLORS[i].hex); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.globalAlpha = fa(a * (.75 + .25 * Math.sin(it * 10 + i))) + (OPT.dim ? a * .25 : 0); g.fillStyle = gr; g.fillRect(cx - bw, H * (1 - eo(r / .35)), bw * 2, H); } g.restore(); g.globalAlpha = 1;
    if (cu > 3.6) { const k = eo((cu - 3.6) / 1.5), cx = W / 2, cy = M.y + 3.9 * s; g.lineCap = 'butt'; for (let i = 0; i < NCOL; i++) { g.strokeStyle = COLORS[i].hex; g.lineWidth = s * .34; g.beginPath(); g.arc(cx, cy, 3.55 * s + (6 - i) * s * .32, Math.PI * .98, Math.PI * .98 + Math.PI * 1.04 * k); g.stroke(); } }
    const FW = [[.2, .2, 5.0], [.8, .16, 5.5], [.5, .1, 6.0], [.14, .34, 6.5], [.86, .36, 7.0], [.35, .14, 7.4], [.66, .24, 7.8]]; FW.forEach(([fx_, fy, b], i) => firework(g, W * fx_, H * fy, (2 + hash(i, 4) * 1.4) * s, cu - b, 36, j => COLORS[(i + j) % 7].hex, i * 5 + 3, s)); },
  mach(x) { const { s, cu } = x, j = cu > 5 ? Math.abs(Math.sin((cu - 5) * 4)) * .3 * s : 0; return { dy: -j, rot: cu > 5 ? Math.sin((cu - 5) * 4) * .04 : 0, sc: 1 }; },
  fx(x) { return x.cu > 3.6 ? { body: '#ffe9a0', glow: rain(0, x.t * 1.5), glowK: 1, all: 1 } : { glow: '#ffffff', glowK: .4, all: 1 }; },
  front(x) { const { g, W, H, M, s, it, t, cu, tx, V } = x, md = compFX.mach(x);
    if (cu > 5) { const k = eb((cu - 5) / .45), cy = M.y - .15 * s + md.dy - (1 - Math.min(1, k)) * 6 * s; g.save(); g.translate(W / 2, cy); g.rotate(md.rot); g.fillStyle = '#ffd23a'; g.strokeStyle = '#a8760a'; g.lineWidth = s * .08; g.lineJoin = 'round'; g.beginPath(); g.moveTo(-1.5 * s, 0); g.lineTo(-1.7 * s, -1.3 * s); g.lineTo(-.85 * s, -.6 * s); g.lineTo(0, -1.6 * s); g.lineTo(.85 * s, -.6 * s); g.lineTo(1.7 * s, -1.3 * s); g.lineTo(1.5 * s, 0); g.closePath(); g.fill(); g.stroke(); for (let i = 0; i < 5; i++) ball(g, (i - 2) * .62 * s, -.25 * s, .14 * s, COLORS[(i * 2) % 7].hex); g.restore(); }
    if (cu > 4) { for (let i = 0; i < 90; i++) { const px = (hash(i, 181) * W + Math.sin(it * 1.4 + i) * s * .6), py = (((cu - 4) * (2.5 + hash(i, 182) * 3) * s + hash(i, 183) * H * 1.2) % (H * 1.2)) - H * .1; g.fillStyle = COLORS[i % 7].hex; g.save(); g.translate(px, py); g.rotate(it * (2 + hash(i, 184) * 4) + i); g.fillRect(-.11 * s, -.06 * s, .22 * s, .12 * s); g.restore(); } }
    if (cu > 4.9) { const k = eb((cu - 4.9) / .4), y = M.y + M.h * .5; const txt = tx('comp'); g.save(); g.translate(W / 2, y); g.rotate(-.04); g.scale(k * (1 + .04 * Math.sin(it * 8)), k); g.textAlign = 'center'; g.textBaseline = 'middle'; fit(g, txt, W * .92, 2.3 * s); const tw = g.measureText(txt).width, gr = g.createLinearGradient(-tw / 2, 0, tw / 2, 0); for (let i = 0; i < 7; i++) gr.addColorStop(i / 6, COLORS[i].hex); g.lineJoin = 'round'; g.lineWidth = .5 * s; g.strokeStyle = '#000c'; g.strokeText(txt, 0, .08 * s); g.lineWidth = .24 * s; g.strokeStyle = '#fff'; g.strokeText(txt, 0, 0); g.fillStyle = gr; g.fillText(txt, 0, 0); g.restore(); }
    if (cu > 5.8 && V.st) { const k = eo((cu - 5.8) / .4), y = M.y + M.h * .5 + 1.9 * s; g.save(); g.globalAlpha = k; g.textAlign = 'center'; g.textBaseline = 'middle'; const l = tx('certB', { b: V.st.b.toLocaleString() }) + '・' + tx('certY', { y: V.st.yen.toLocaleString() }); const p = fit(g, l, W * .86, .8 * s), tw = g.measureText(l).width; rr(g, W / 2 - tw / 2 - .4 * s, y - p * .8, tw + .8 * s, p * 1.6, .25 * s); g.fillStyle = 'rgba(8,10,24,.85)'; g.fill(); g.fillStyle = '#fff'; g.fillText(l, W / 2, y + p * .04); g.restore(); }
    if (cu < .25) { g.fillStyle = 'rgba(0,0,0,' + (1 - cu / .25) + ')'; g.fillRect(0, 0, W, H); } }
};
