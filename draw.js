// 携帯自販機：絵（自販機・数字・外れの演出）。時刻から絵が1つに決まる書き方（動画を作るときも同じ絵になる）
import { COLORS, NCOL, OPT } from './data.js?v=1';
import { winFX, compFX } from './win.js?v=1';
export const O = { tx: k => k, lose: () => '' };
export const TAU = Math.PI * 2;
export const cl = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, k) => a + (b - a) * k;
export const sm = k => { k = cl(k, 0, 1); return k * k * (3 - 2 * k); };
export const eo = k => { k = cl(k, 0, 1); return 1 - Math.pow(1 - k, 3); };
export const eb = k => { k = cl(k, 0, 1); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
export const hash = (i, s) => { let x = Math.imul(((i | 0) + 1) * 374761393 ^ Math.imul((s | 0) + 7, 668265263), 2246822519); x ^= x >>> 13; x = Math.imul(x, 3266489917); x ^= x >>> 16; return (x >>> 0) / 4294967296; };
export const F = (px, w) => (w || 900) + ' ' + Math.max(1, px).toFixed(1) + 'px "Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic","Noto Sans CJK JP","Noto Sans JP","Apple SD Gothic Neo","PingFang TC","Microsoft JhengHei","Malgun Gothic",system-ui,sans-serif';
export const rain = (i, t, l, a) => 'hsla(' + ((((i * 51.43 + t * 140) % 360) + 360) % 360).toFixed(0) + ',100%,' + (l || 58) + '%,' + (a == null ? 1 : a) + ')';
export const fa = a => a * (OPT.dim ? .3 : 1);   // 光の強さ（まぶしさをおさえる設定で弱くする）
export function rr(g, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath(); }
export function fit(g, text, maxW, px, w) { let p = px; g.font = F(p, w); while (p > 6 && g.measureText(text).width > maxW) { p *= .93; g.font = F(p, w); } return p; }
export function wrap(g, text, maxW) { const out = []; const sp = /\s/.test(text) && !/[぀-ヿ一-鿿]/.test(text); const toks = sp ? text.split(/(\s+)/) : [...text]; let line = ''; for (const tk of toks) { if (g.measureText(line + tk).width > maxW && line.trim()) { out.push(line.trim()); line = tk.trim() ? tk : ''; } else line += tk; } if (line.trim()) out.push(line.trim()); return out; }
export function outline(g, text, x, y, fill, stroke, lw) { g.lineJoin = 'round'; g.lineWidth = lw; g.strokeStyle = stroke; g.strokeText(text, x, y); g.fillStyle = fill; g.fillText(text, x, y); }

// ===== 1本ぶんの時間割 =====
export const WINLEN = 9.4, COMPLEN = 8.6;
const PD = { 5: .3, 6: .9, 7: 1.0, 8: .8, 9: .9, 10: .9, 11: 1.5, 12: 1.0, 13: .2, 14: .2, 15: 1.4, 16: .9, 17: .8, 18: 1.0, 19: 1.4, 20: 1.6, 25: 1.6 };
const PO = { 3: .55, 4: .55, 5: .6, 13: 1.1, 14: 1.2, 22: 1.0, 25: .6 };
export function plan(seq) {
  const T1 = .55, T2 = .8; let T3 = 1.05; const g = seq.g, d = seq.d, X = d[0];
  const fr = []; let fr3 = null;
  const push = (arr, t0, list) => { let t = t0; for (const [dg, h] of list) { arr.push({ t, d: ((dg % 10) + 10) % 10 }); t += h; } return arr[arr.length - 1].t; };
  if (g === 21) { fr3 = []; T3 = push(fr3, T2 + .35, d[2] > X ? [[X - 2, .14], [X - 1, .22], [X, .36], [X + 1, 0]] : [[X - 3, .14], [X - 2, .24], [X - 1, 0]]); }
  const reach = d[0] === d[1] && d[1] === d[2];
  const pd = PD[g] || 0, G0 = T3 + .05, G1 = G0 + pd, Ts = T3 + .3 + pd;
  let T4;
  if (!reach) { fr.push({ t: Ts + .1, d: d[3] }); T4 = Ts + .1; }
  else {
    const L = d[3]; let list;
    if (seq.win) list = [[[X - 3, .12], [X - 2, .16], [X - 1, .24], [X, 0]], [[X - 3, .12], [X - 2, .18], [X - 1, .62], [X, 0]], [[X - 1, .2], [X, .28], [X + 1, .42], [X, 0]], [[X - 3, .35], [X - 2, .5], [X - 1, .75], [X, 0]]][seq.wv || 0];
    else if (L === X) list = [[X - 3, .12], [X - 2, .16], [X - 1, .24], [X, 0]];
    else if (L === X + 1) list = g === 3 ? [[X - 2, .14], [X - 1, .2], [X, .62], [X + 1, 0]] : g === 5 ? [[X - 2, .35], [X - 1, .5], [X, .7], [X + 1, 0]] : [[X - 3, .12], [X - 2, .16], [X - 1, .22], [X, .32], [X + 1, 0]];
    else list = g === 4 ? [[X - 2, .14], [X - 1, .2], [X, .28], [X + 1, .36], [X, .42], [X - 1, 0]] : g === 5 ? [[X - 3, .35], [X - 2, .5], [X - 1, 0]] : [[X - 4, .12], [X - 3, .16], [X - 2, .24], [X - 1, 0]];
    T4 = push(fr, Ts, list);
  }
  const po = PO[g] || (reach ? .5 : .45);
  const END = seq.win ? T4 + WINLEN + (seq.comp ? COMPLEN : 0) : T4 + po;
  return { T1, T2, T3, Ts, T4, END, fr, fr3, G0, G1, reach, W0: T4, C0: T4 + WINLEN };
}
export function digitAt(i, t, seq, pl) {
  const sp = () => ({ d: Math.floor(hash(Math.floor(t * 22) * 4 + i, seq.seed) * 10), spin: true });
  if (i === 0) return t < pl.T1 ? sp() : { d: seq.d[0] };
  if (i === 1) return t < pl.T2 ? sp() : { d: seq.d[1] };
  if (i === 2) { if (pl.fr3) { if (t < pl.fr3[0].t) return sp(); let f = pl.fr3[0]; for (const x of pl.fr3) if (x.t <= t) f = x; return { d: f.d, slow: t < pl.T3, ft: t - f.t }; } return t < pl.T3 ? sp() : { d: seq.d[2] }; }
  if (t < pl.fr[0].t) return sp(); let f = pl.fr[0]; for (const x of pl.fr) if (x.t <= t) f = x; return { d: f.d, slow: t < pl.T4, ft: t - f.t };
}

// ===== 置き場所 =====
export function geom(W, H) { const s = Math.min(W / 9, H / 16); const w = 5.6 * s, h = 10.4 * s; return { s, x: W / 2 - w / 2, y: H / 2 - 4.7 * s, w, h, W, H }; }
export function drinkRect(M, i) { const r = Math.floor(i / 4), c = i % 4, s = M.s, cw = (M.w - .7 * s) / 4; return { x: M.x + .35 * s + c * cw, y: M.y + 2.02 * s + r * 1.42 * s, w: cw, h: 1.42 * s }; }
export function hitDrink(px, py, W, H) { const M = geom(W, H); if (px < M.x - M.s * .3 || px > M.x + M.w + M.s * .3 || py < M.y || py > M.y + M.h) return -1; let best = 0, bd = 1e18; for (let i = 0; i < 12; i++) { const r = drinkRect(M, i), dx = px - (r.x + r.w / 2), dy = py - (r.y + r.h / 2), dd = dx * dx + dy * dy; if (dd < bd) { bd = dd; best = i; } } return best; }

// ===== 部品 =====
const CAN = ['#e53935', '#fb8c00', '#f2c200', '#43a047', '#1e88e5', '#5e35b1', '#d81b60', '#00acc1', '#6d4c41', '#f4511e', '#7cb342', '#546e7a'];
export function drawCan(g, cx, cy, w, h, i, rot) {
  g.save(); g.translate(cx, cy); if (rot) g.rotate(rot); const x = -w / 2, y = -h / 2, col = CAN[((i % 12) + 12) % 12];
  const gr = g.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, '#0006'); gr.addColorStop(.25, '#fff5'); gr.addColorStop(.55, '#0000'); gr.addColorStop(1, '#0007');
  rr(g, x, y, w, h, w * .16); g.fillStyle = col; g.fill();
  g.fillStyle = '#fff'; g.fillRect(x, y + h * .34, w, h * .34);
  g.fillStyle = col; const ic = i % 6, ix = 0, iy = y + h * .51, r = Math.min(w, h) * .13; g.beginPath();
  if (ic === 0) g.arc(ix, iy, r, 0, TAU); else if (ic === 1) { g.moveTo(ix, iy - r * 1.1); g.lineTo(ix + r * 1.1, iy + r); g.lineTo(ix - r * 1.1, iy + r); }
  else if (ic === 2) { for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * TAU / 10, q = k % 2 ? r * .5 : r * 1.25; g.lineTo(ix + Math.cos(a) * q, iy + Math.sin(a) * q); } }
  else if (ic === 3) { g.rect(ix - r * 1.3, iy - r * .9, r * 2.6, r * .5); g.rect(ix - r * 1.3, iy + r * .3, r * 2.6, r * .5); }
  else if (ic === 4) { g.moveTo(ix, iy - r * 1.2); g.lineTo(ix + r, iy); g.lineTo(ix, iy + r * 1.2); g.lineTo(ix - r, iy); }
  else { g.arc(ix - r * .6, iy, r * .65, 0, TAU); g.arc(ix + r * .6, iy, r * .65, 0, TAU); }
  g.fill();
  rr(g, x, y, w, h, w * .16); g.fillStyle = gr; g.fill();
  g.fillStyle = '#c9ced6'; rr(g, x + w * .06, y - h * .02, w * .88, h * .08, h * .03); g.fill(); rr(g, x + w * .06, y + h * .94, w * .88, h * .08, h * .03); g.fill();
  g.restore();
}
const SEG = [0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, 0x7f, 0x6f];
function seg7(g, x, y, w, h, d, on, off, lw) {
  const m = SEG[d] || 0, x0 = x + lw / 2, x1 = x + w - lw / 2, y0 = y + lw / 2, y1 = y + h / 2, y2 = y + h - lw / 2, e = lw * .75;
  const L = [[x0 + e, y0, x1 - e, y0], [x1, y0 + e, x1, y1 - e], [x1, y1 + e, x1, y2 - e], [x0 + e, y2, x1 - e, y2], [x0, y1 + e, x0, y2 - e], [x0, y0 + e, x0, y1 - e], [x0 + e, y1, x1 - e, y1]];
  g.lineCap = 'round'; g.lineWidth = lw;
  for (let k = 0; k < 7; k++) { g.strokeStyle = (m >> k) & 1 ? on : off; g.beginPath(); g.moveTo(L[k][0], L[k][1]); g.lineTo(L[k][2], L[k][3]); g.stroke(); }
}
function stars(g, W, H, t, n, seed, a) { for (let i = 0; i < n; i++) { const x = hash(i, seed) * W, y = hash(i, seed + 1) * H * .6, tw = .5 + .5 * Math.sin(t * (1 + hash(i, seed + 2) * 3) + i); g.globalAlpha = a * (.3 + .7 * tw); g.fillStyle = '#fff'; g.fillRect(x, y, 1.5 + hash(i, seed + 3) * 2, 1.5 + hash(i, seed + 3) * 2); } g.globalAlpha = 1; }
export function night(g, W, H, t, M) {
  const s = M.s, gy = Math.min(H, M.y + M.h - .15 * s);
  const sk = g.createLinearGradient(0, 0, 0, gy); sk.addColorStop(0, '#070a1f'); sk.addColorStop(.6, '#15204a'); sk.addColorStop(1, '#2b3a78'); g.fillStyle = sk; g.fillRect(0, 0, W, H);
  stars(g, W, H, t, 46, 11, .9);
  for (let i = 0; i < 14; i++) { const bw = (.6 + hash(i, 5) * 1.1) * s, bh = (1.2 + hash(i, 6) * 3.4) * s, bx = (i / 14) * W * 1.1 - s * .5; g.fillStyle = '#0c1230'; g.fillRect(bx, gy - bh, bw, bh); for (let k = 0; k < 9; k++) { if (hash(i * 16 + k, 9) < .45) continue; g.fillStyle = hash(i * 16 + k, 8) < .5 ? '#ffd97a55' : '#9fd0ff40'; g.fillRect(bx + bw * (.18 + (k % 3) * .26), gy - bh + bh * (.1 + Math.floor(k / 3) * .26), bw * .14, bh * .1); } }
  g.fillStyle = '#1a1c24'; g.fillRect(0, gy, W, H - gy); g.fillStyle = '#ffffff10'; for (let i = 0; i < 6; i++) g.fillRect(0, gy + (i * i) * s * .12 + s * .1, W, 1);
  const gl = g.createRadialGradient(W / 2, gy + s * .2, 0, W / 2, gy + s * .2, s * 5.5); gl.addColorStop(0, '#bcd4ff4a'); gl.addColorStop(1, '#bcd4ff00'); g.fillStyle = gl; g.fillRect(0, gy - s * 2, W, H - gy + s * 2);
}

// 自販機。fx：{led(色), glow(色), all(ボタン全点灯の強さ), dimLed, body(色), noCan}
export function drawMachine(g, M, V, fx) {
  const s = M.s, x = M.x, y = M.y, w = M.w, h = M.h, t = V.t, it = V.it || 0, seq = V.seq, pl = V.pl;
  // 足・影
  g.fillStyle = '#0007'; g.beginPath(); g.ellipse(x + w / 2, y + h - .02 * s, w * .56, .22 * s, 0, 0, TAU); g.fill();
  g.fillStyle = '#2a2f3a'; g.fillRect(x + .35 * s, y + h - .25 * s, .5 * s, .25 * s); g.fillRect(x + w - .85 * s, y + h - .25 * s, .5 * s, .25 * s);
  if (fx.glow) { g.save(); g.shadowColor = fx.glow; g.shadowBlur = s * 1.6 * (fx.glowK == null ? 1 : fx.glowK); g.fillStyle = fx.glow; rr(g, x, y, w, h - .2 * s, .3 * s); g.fill(); g.restore(); }
  // 本体
  const bg = g.createLinearGradient(x, 0, x + w, 0); bg.addColorStop(0, '#c8cfdd'); bg.addColorStop(.08, fx.body || '#f6f8fc'); bg.addColorStop(.9, fx.body || '#f1f4fa'); bg.addColorStop(1, '#b3bccd');
  rr(g, x, y, w, h - .2 * s, .3 * s); g.fillStyle = bg; g.fill();
  // 上の帯（数字）と下の帯
  const hd = g.createLinearGradient(0, y, 0, y + 1.8 * s); hd.addColorStop(0, '#2c4fd0'); hd.addColorStop(1, '#16308f');
  g.save(); rr(g, x, y, w, h - .2 * s, .3 * s); g.clip(); g.fillStyle = hd; g.fillRect(x, y, w, 1.82 * s); g.fillStyle = '#16308f'; g.fillRect(x, y + h - .75 * s, w, .6 * s);
  for (let i = 0; i < 7; i++) { g.fillStyle = COLORS[i].hex; g.fillRect(x + (w / 7) * i, y + 1.82 * s, w / 7 + 1, .07 * s); } g.restore();
  // 数字の窓
  const lw = 3.5 * s, lh = 1.02 * s, lx = x + w / 2 - lw / 2, ly = y + .24 * s;
  rr(g, lx - .08 * s, ly - .08 * s, lw + .16 * s, lh + .16 * s, .16 * s); g.fillStyle = '#0a0d1c'; g.fill();
  rr(g, lx, ly, lw, lh, .1 * s); g.fillStyle = '#140707'; g.fill();
  const cw = lw / 4, dw = cw * .52, dh = lh * .7;
  for (let i = 0; i < 4; i++) {
    let dg = null, on = fx.led || '#ff5a36', a = 1, oy = 0;
    if (seq && t >= 0) { const q = digitAt(i, t, seq, pl); dg = q.d; if (q.spin) { a = .8; oy = (hash(Math.floor(t * 40) + i, 3) - .5) * dh * .12; } else if (q.slow && q.ft != null && q.ft < .1) oy = -(1 - q.ft / .1) * dh * .22; if (fx.ledAt) on = fx.ledAt(i, q) || on; }
    else if (V.last) { dg = V.last[i]; a = .38; } else { a = .25 + .2 * Math.sin(it * 3 + i); }
    const dx = lx + cw * i + (cw - dw) / 2, dy = ly + (lh - dh) / 2 + oy;
    g.globalAlpha = 1; if (dg == null) { g.strokeStyle = on; g.globalAlpha = a; g.lineWidth = dw * .17; g.lineCap = 'round'; g.beginPath(); g.moveTo(dx + dw * .15, dy + dh / 2); g.lineTo(dx + dw * .85, dy + dh / 2); g.stroke(); }
    else { g.save(); if (a >= .7) { g.shadowColor = on; g.shadowBlur = s * .22; } g.globalAlpha = fx.dimLed ? .8 : a; seg7(g, dx, dy, dw, dh, dg, fx.dimLed ? '#b0766c' : on, '#2c1210', dw * .17); g.restore(); }
  }
  g.globalAlpha = 1;
  // 図鑑のランプ（当てた色が光る）
  const got = (V.st && V.st.got) || [];
  for (let i = 0; i < NCOL; i++) { const px = x + w / 2 + (i - 3) * .46 * s, py = y + 1.56 * s, on = got[i] > 0; g.beginPath(); g.arc(px, py, .13 * s, 0, TAU); g.fillStyle = on ? COLORS[i].hex : '#0b1640'; if (on) { g.save(); g.shadowColor = COLORS[i].hex; g.shadowBlur = s * .3; g.fill(); g.restore(); } else g.fill(); g.strokeStyle = '#ffffff40'; g.lineWidth = 1; g.stroke(); }
  // ショーケース
  const sx = x + .3 * s, sy = y + 2.0 * s, sw = w - .6 * s, sh = 4.34 * s;
  rr(g, sx, sy, sw, sh, .14 * s); const sg = g.createLinearGradient(0, sy, 0, sy + sh); sg.addColorStop(0, '#e9f1fb'); sg.addColorStop(1, '#c2d0e4'); g.fillStyle = sg; g.fill(); g.strokeStyle = '#8795ad'; g.lineWidth = Math.max(1, s * .04); g.stroke();
  for (let i = 0; i < 12; i++) {
    const r = drinkRect(M, i), pressed = seq && t >= 0 && t < .35 && V.drink === i;
    g.fillStyle = '#9aa7bd'; g.fillRect(r.x + r.w * .04, r.y + r.h * .74, r.w * .92, r.h * .04);
    drawCan(g, r.x + r.w / 2, r.y + r.h * .4, r.w * .56, r.h * .62, i, 0);
    const blink = fx.all ? (.5 + .5 * Math.sin(it * 18 - i * 1.1)) * fx.all : (seq && t >= 0 ? .25 : .45 + .35 * Math.sin(it * 2.4 + i * .9));
    const bx = r.x + r.w * .18, by = r.y + r.h * .82, bw = r.w * .64, bh = r.h * .13;
    g.save(); g.shadowColor = '#4db4ff'; g.shadowBlur = s * .25 * blink; rr(g, bx, by, bw, bh, bh / 2); g.fillStyle = pressed ? '#fff' : 'hsl(207,100%,' + (38 + blink * 34).toFixed(0) + '%)'; g.fill(); g.restore();
  }
  g.save(); rr(g, sx, sy, sw, sh, .14 * s); g.clip(); g.fillStyle = '#ffffff26'; g.beginPath(); g.moveTo(sx + sw * .08, sy); g.lineTo(sx + sw * .3, sy); g.lineTo(sx + sw * .02, sy + sh); g.lineTo(sx - sw * .2, sy + sh); g.fill(); g.beginPath(); g.moveTo(sx + sw * .38, sy); g.lineTo(sx + sw * .44, sy); g.lineTo(sx + sw * .16, sy + sh); g.lineTo(sx + sw * .1, sy + sh); g.fill(); g.restore();
  // お金のところ
  const my = y + 6.52 * s;
  rr(g, x + .4 * s, my, 1.5 * s, .62 * s, .1 * s); g.fillStyle = '#10152b'; g.fill(); g.fillStyle = '#ffb347'; g.font = F(.4 * s); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('150', x + 1.15 * s, my + .33 * s);
  rr(g, x + 2.15 * s, my + .12 * s, 1.3 * s, .38 * s, .06 * s); g.fillStyle = '#3a4152'; g.fill(); g.fillStyle = '#0c0f18'; g.fillRect(x + 2.3 * s, my + .28 * s, 1.0 * s, .07 * s);
  g.beginPath(); g.arc(x + w - 1.25 * s, my + .31 * s, .3 * s, 0, TAU); g.fillStyle = '#c7ccd6'; g.fill(); g.fillStyle = '#0c0f18'; g.fillRect(x + w - 1.29 * s, my + .13 * s, .08 * s, .36 * s);
  g.beginPath(); g.arc(x + w - .55 * s, my + .31 * s, .17 * s, 0, TAU); g.fillStyle = '#8f97a8'; g.fill();
  // 取り出し口
  const ox = x + .55 * s, oy2 = y + 7.55 * s, ow = w - 1.1 * s, oh = 1.75 * s;
  rr(g, ox, oy2, ow, oh, .16 * s); g.fillStyle = '#0d1018'; g.fill();
  if (seq && t >= .16 && !fx.noCan) { const k = cl((t - .16) / .5, 0, 1), bnc = Math.abs(Math.sin(k * Math.PI * 2.5)) * (1 - k) * .5 * s, drop = (1 - eo(cl((t - .16) / .14, 0, 1))) * oh * .8; drawCan(g, ox + ow / 2 + (hash(1, seq.seed) - .5) * s * .8, oy2 + oh * .66 - bnc - drop, .62 * s, 1.15 * s, V.drink || 0, Math.PI / 2 + (1 - k) * .5); }
  g.fillStyle = '#ffffff14'; rr(g, ox + .08 * s, oy2 + .08 * s, ow - .16 * s, oh * .52, .1 * s); g.fill(); g.fillStyle = '#ffffff30'; g.fillRect(ox + .2 * s, oy2 + oh * .52 + .04 * s, ow - .4 * s, .03 * s);
}

// ===== 外れの演出（うしろ・まえ） =====
function loseBack(g, W, H, M, V) {
  const { seq, pl, t } = V, s = M.s, gm = seq.g, k = cl((t - pl.G0) / Math.max(.01, pl.G1 - pl.G0), 0, 1), inG = t >= pl.G0 && t < pl.G1;
  const has = n => gm === n || (gm === 25 && [6, 7, 8, 11].includes(n));
  if (has(10) && inG) { const ph = Math.floor(k * 3), u = (k * 3) % 1; if (u < .5) { g.strokeStyle = 'rgba(255,255,220,' + fa(1 - u * 2) + ')'; g.lineWidth = s * .12; g.lineJoin = 'miter'; g.beginPath(); let bx = W * (.2 + hash(ph, seq.seed) * .6), by = 0; g.moveTo(bx, by); for (let i = 0; i < 9; i++) { bx += (hash(ph * 10 + i, seq.seed) - .5) * s * 1.6; by += M.y / 8; g.lineTo(bx, by); } g.stroke(); g.fillStyle = 'rgba(255,255,255,' + fa(.35 * (1 - u * 2)) + ')'; g.fillRect(0, 0, W, H); } }
  if (gm === 19 && inG) { const ux = lerp(-s * 2, W + s * 2, k), uy = M.y - s * 1.2 + Math.sin(k * 14) * s * .25; g.fillStyle = '#b8f3ff'; g.beginPath(); g.ellipse(ux, uy - .18 * s, .45 * s, .36 * s, 0, Math.PI, 0); g.fill(); g.fillStyle = '#9aa4b8'; g.beginPath(); g.ellipse(ux, uy, 1.1 * s, .3 * s, 0, 0, TAU); g.fill(); for (let i = 0; i < 5; i++) { g.fillStyle = rain(i, t * 3); g.beginPath(); g.arc(ux + (i - 2) * .4 * s, uy + .06 * s, .08 * s, 0, TAU); g.fill(); } g.fillStyle = 'rgba(180,255,220,' + fa(.25) + ')'; g.beginPath(); g.moveTo(ux - .3 * s, uy + .2 * s); g.lineTo(ux + .3 * s, uy + .2 * s); g.lineTo(ux + 1.0 * s, uy + 2.4 * s); g.lineTo(ux - 1.0 * s, uy + 2.4 * s); g.fill(); }
  if (has(9) && inG) { const a = Math.sin(k * Math.PI); for (let i = 0; i < 12; i++) { const an = i * TAU / 12 + t * .8; g.fillStyle = 'rgba(255,214,90,' + fa(.22 * a) + ')'; g.beginPath(); g.moveTo(W / 2, M.y + M.h / 2); g.lineTo(W / 2 + Math.cos(an) * W * 1.5, M.y + M.h / 2 + Math.sin(an) * W * 1.5); g.lineTo(W / 2 + Math.cos(an + .14) * W * 1.5, M.y + M.h / 2 + Math.sin(an + .14) * W * 1.5); g.fill(); } }
}
function loseFront(g, W, H, M, V) {
  const { seq, pl, t } = V, s = M.s, gm = seq.g, k = cl((t - pl.G0) / Math.max(.01, pl.G1 - pl.G0), 0, 1), inG = t >= pl.G0 && t < pl.G1, tx = O.tx;
  const has = n => gm === n || (gm === 25 && [6, 7, 8, 11].includes(n));
  const gy = M.y + M.h - .15 * s;
  if (gm === 20 && inG) { const cx = lerp(W + s, -s, k), cy = gy + .5 * s, b = Math.abs(Math.sin(k * 26)) * .08 * s; g.fillStyle = '#05060c'; g.beginPath(); g.ellipse(cx, cy - .32 * s - b, .5 * s, .22 * s, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(cx - .52 * s, cy - .5 * s - b, .2 * s, 0, TAU); g.fill(); g.beginPath(); g.moveTo(cx - .68 * s, cy - .62 * s - b); g.lineTo(cx - .62 * s, cy - .86 * s - b); g.lineTo(cx - .5 * s, cy - .66 * s - b); g.fill(); g.beginPath(); g.moveTo(cx - .5 * s, cy - .66 * s - b); g.lineTo(cx - .4 * s, cy - .86 * s - b); g.lineTo(cx - .34 * s, cy - .6 * s - b); g.fill(); g.lineWidth = .07 * s; g.strokeStyle = '#05060c'; g.lineCap = 'round'; for (let i = 0; i < 4; i++) { const lx = cx - .3 * s + i * .2 * s, sw = Math.sin(k * 26 + i * 1.7) * .1 * s; g.beginPath(); g.moveTo(lx, cy - .2 * s - b); g.lineTo(lx + sw, cy); g.stroke(); } g.beginPath(); g.moveTo(cx + .46 * s, cy - .36 * s - b); g.quadraticCurveTo(cx + .9 * s, cy - .5 * s, cx + .8 * s, cy - .95 * s + Math.sin(k * 9) * .08 * s); g.stroke(); g.fillStyle = '#ffe680'; g.fillRect(cx - .62 * s, cy - .54 * s - b, .05 * s, .05 * s); }
  if (gm === 15 && inG) { for (let i = 0; i < 9; i++) { const cx = lerp(-s * 6, W + s, k) + i * .75 * s, hop = Math.abs(Math.sin(k * 30 + i)) * .25 * s; drawCan(g, cx, gy + .35 * s - hop, .5 * s, .8 * s, i, Math.sin(k * 30 + i) * .12); } }
  if (has(12) && inG) { const a = (t * 6) % TAU; g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 2; i++) { const an = a + i * Math.PI; g.fillStyle = 'rgba(255,40,40,' + fa(.3) + ')'; g.beginPath(); g.moveTo(W / 2, M.y - .3 * s); g.arc(W / 2, M.y - .3 * s, W * 1.4, an - .22, an + .22); g.fill(); } g.restore(); g.fillStyle = '#ff2d2d'; g.beginPath(); g.arc(W / 2, M.y - .22 * s, .3 * s, Math.PI, 0); g.fill(); g.fillStyle = '#333'; g.fillRect(W / 2 - .36 * s, M.y - .22 * s, .72 * s, .12 * s); }
  if (has(6) && inG) { const a = Math.sin(k * Math.PI), bw = s * .5; for (let i = 0; i < 28; i++) { const u = i / 28; g.fillStyle = rain(i, t * 2, 58, fa(.85 * a)); g.fillRect(u * W, 0, W / 28 + 1, bw); g.fillRect(u * W, H - bw, W / 28 + 1, bw); g.fillRect(0, u * H, bw, H / 28 + 1); g.fillRect(W - bw, u * H, bw, H / 28 + 1); } }
  if (has(18) && inG) { const a = sm(Math.min(k * 5, (1 - k) * 5, 1)); g.fillStyle = 'rgba(0,0,0,' + (.86 * a) + ')'; const lw = 3.9 * s, lx = M.x + M.w / 2 - lw / 2, ly = M.y + .1 * s; g.beginPath(); g.rect(0, 0, W, H); g.rect(lx, ly, lw, 1.3 * s); g.fill('evenodd'); }
  if (gm === 5 && t >= pl.Ts - .3 && t < pl.T4) { const ph = (t * 1.6) % 1, p = ph < .12 ? 1 : ph < .24 ? .3 : ph < .36 ? .8 : 0; g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(0, 0, W, H); const vg = g.createRadialGradient(W / 2, M.y + .75 * s, s * 2, W / 2, M.y + .75 * s, Math.max(W, H) * .8); vg.addColorStop(0, 'rgba(255,0,40,0)'); vg.addColorStop(1, 'rgba(255,0,40,' + fa(.38 * p) + ')'); g.fillStyle = vg; g.fillRect(0, 0, W, H); }
  if (has(7) && inG) { const xk = k < .2 ? eo(k / .2) : k > .8 ? 1 + (k - .8) / .2 : 1, bx = lerp(-W, 0, Math.min(1, xk)) + (xk > 1 ? (xk - 1) * W : 0), by = M.y + 3.2 * s; g.save(); g.translate(bx, by); g.transform(1, 0, -.18, 1, 0, 0); const bgG = g.createLinearGradient(0, 0, W, 0); bgG.addColorStop(0, '#ff2d2d'); bgG.addColorStop(.5, '#ff9500'); bgG.addColorStop(1, '#ffd60a'); g.fillStyle = bgG; g.fillRect(-W * .2, 0, W * 1.6, 2.1 * s); g.fillStyle = '#000a'; g.fillRect(-W * .2, 0, W * 1.6, .12 * s); g.fillRect(-W * .2, 1.98 * s, W * 1.6, .12 * s); g.textAlign = 'center'; g.textBaseline = 'middle'; fit(g, tx('hot'), W * .8, 1.5 * s); outline(g, tx('hot'), W / 2 + .3 * s, 1.08 * s, '#fff', '#7a0000', .16 * s); g.restore(); }
  if (has(11) && inG) { const n = 3 - Math.min(2, Math.floor(k * 3)), u = (k * 3) % 1; g.save(); g.translate(W / 2, M.y + 4.2 * s); const sc = 1.6 - eo(u) * .6; g.scale(sc, sc); g.globalAlpha = 1 - u * u; g.font = F(3.4 * s); g.textAlign = 'center'; g.textBaseline = 'middle'; outline(g, String(n), 0, 0, '#fff', '#16308f', .22 * s); g.restore(); }
  if (gm === 13 && t >= pl.T4 - .15) { const u = t - (pl.T4 - .15); for (let i = 0; i < 70; i++) { const a = hash(i, seq.seed) * TAU, v = (2 + hash(i, seq.seed + 1) * 5) * s, fr = Math.min(u, .32), px = W / 2 + Math.cos(a) * v * fr * 2.2, py = M.y + 1.2 * s + Math.sin(a) * v * fr * 2.2 + Math.max(0, u - .32) * Math.max(0, u - .32) * s * 26; g.fillStyle = u < .32 ? rain(i, 0) : '#8b8f99'; g.save(); g.translate(px, py); g.rotate(u < .32 ? a + u * 9 : a); g.fillRect(-.09 * s, -.05 * s, .18 * s, .1 * s); g.restore(); } }
  if (gm === 14 && t >= pl.T4) { const u = t - pl.T4, txt = u < .55 ? tx('atari1') : tx('atari2'); g.save(); g.translate(W / 2, M.y + 4.0 * s); const sc = u < .55 ? eb(u / .25) : 1 + Math.max(0, .15 - (u - .55)) * 1.2; g.scale(sc, sc); g.textAlign = 'center'; g.textBaseline = 'middle'; fit(g, tx('atari2'), W * .86, 1.7 * s); outline(g, txt, 0, 0, u < .55 ? '#ffd60a' : '#c9ced6', u < .55 ? '#b3261e' : '#2a2f3a', .2 * s); g.restore(); }
}
// 外れのときの自販機の動き
function loseMotion(V, M) {
  const { seq, pl, t } = V, s = M.s, gm = seq.g, inG = t >= pl.G0 && t < pl.G1, k = cl((t - pl.G0) / Math.max(.01, pl.G1 - pl.G0), 0, 1), m = { dx: 0, dy: 0, rot: 0, sc: 1 };
  const has = n => gm === n || (gm === 25 && [6, 7, 8, 11].includes(n));
  if (has(8) && inG) { m.dx = (hash(Math.floor(t * 50), 1) - .5) * s * .32; m.dy = (hash(Math.floor(t * 50), 2) - .5) * s * .2; m.rot = (hash(Math.floor(t * 50), 3) - .5) * .03; }
  if (gm === 17 && t >= pl.G0 && t < pl.T4 + .2) { const z = sm(Math.min((t - pl.G0) / .5, 1)) * (1 - sm((t - pl.T4) / .2)); m.sc = 1 + z * .55; m.dy = z * 3.4 * s; }
  if (gm === 23 && t >= pl.T4) m.rot = Math.sin(Math.min(1, (t - pl.T4) / .3) * Math.PI * .5) * -.05;
  if (pl.reach && t >= pl.Ts && t < pl.T4 && !seq.win) m.sc *= 1 + .03 * sm((t - pl.Ts) / .4);
  if (!seq.win && t >= pl.T4 && t < pl.T4 + .18) m.dy += Math.sin((t - pl.T4) / .18 * Math.PI) * .08 * s;
  return m;
}

// ===== ぜんぶ描く =====
// V = {seq, pl, t(買ってからの秒。待ち中は-1), it(ずっと進む時計), st:{b,yen,got}, drink, last(前の数字), card(0〜1：動画の最後の札), hint(待ち中の案内), noHud}
export function paint(g, W, H, V) {
  const M = geom(W, H), s = M.s, seq = V.seq, pl = V.pl, t = V.t, it = V.it || 0, tx = O.tx;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.shadowBlur = 0;
  const live = seq && t >= 0, winning = live && seq.win && t >= pl.W0, u = winning ? t - pl.W0 : -1, comping = winning && seq.comp && t >= pl.C0, cu = comping ? t - pl.C0 : -1;
  const wf = winning && !comping ? winFX[seq.c] : null;
  let m = { dx: 0, dy: 0, rot: 0, sc: 1 }, fx = {};
  if (live && !winning) { m = loseMotion(V, M); if (pl.reach && t >= pl.T3 && t < pl.T4) fx.led = '#ffd23a'; if (!seq.win && t >= pl.T4) fx.dimLed = !(seq.g === 22 && t < pl.T4 + .45); if (seq.g === 22 && t >= pl.T4 && t < pl.T4 + .45) fx.led = rain(0, t * 4); if ((seq.g === 16 || seq.g === 25) && t >= pl.G0 && t < pl.G1) fx.all = 1; if (seq.g === 9 && t >= pl.G0 && t < pl.G1) { fx.glow = '#ffd65a'; fx.glowK = Math.sin(cl((t - pl.G0) / (pl.G1 - pl.G0), 0, 1) * Math.PI); } }
  if (winning) { fx.ledAt = i => rain(i, t * 3, 62); fx.all = 1; }
  const ctx = { g, W, H, M, s, V, t, it, u, cu, seq, pl, tx };
  // 背景
  if (comping) compFX.bg(ctx); else if (wf) wf.bg(ctx); else night(g, W, H, it, M);
  if (live && !winning) loseBack(g, W, H, M, V);
  if (comping) { compFX.back(ctx); Object.assign(m, compFX.mach(ctx)); Object.assign(fx, compFX.fx ? compFX.fx(ctx) : {}); }
  else if (wf) { wf.back(ctx); Object.assign(m, wf.mach(ctx)); Object.assign(fx, wf.fx ? wf.fx(ctx) : {}); }
  // 自販機
  if (!m.hide) { g.save(); const cx = W / 2 + (m.dx || 0), cy = M.y + M.h / 2 + (m.dy || 0); g.translate(cx, cy); g.rotate(m.rot || 0); g.scale(m.sc || 1, m.sc || 1); g.translate(-W / 2, -(M.y + M.h / 2)); drawMachine(g, M, V, fx); g.restore(); }
  if (live && !winning) loseFront(g, W, H, M, V);
  if (comping) compFX.front(ctx); else if (wf) wf.front(ctx);
  // はずれの札とひとこと
  if (live && !seq.win && t >= pl.T4 && !(seq.g === 22 && t < pl.T4 + .45) && !(seq.g === 14 && t < pl.T4 + .55)) {
    const k = seq.g === 14 ? 0 : eb(cl((t - pl.T4 - (seq.g === 22 ? .45 : 0)) / .22, 0, 1)); g.save(); g.translate(W / 2, M.y + 2.75 * s); g.rotate(-.06); g.scale(k, k); g.textAlign = 'center'; g.textBaseline = 'middle'; const p = fit(g, tx('lose'), 4.6 * s, 1.15 * s), tw = g.measureText(tx('lose')).width; rr(g, -tw / 2 - .4 * s, -p * .75, tw + .8 * s, p * 1.5, .2 * s); g.fillStyle = '#2a2f3aee'; g.fill(); g.strokeStyle = '#fff'; g.lineWidth = .06 * s; g.stroke(); g.fillStyle = '#fff'; g.fillText(tx('lose'), 0, p * .04); g.restore();
    bubble(g, W, M, O.lose(seq), cl((t - pl.T4 - (seq.g === 22 ? .55 : seq.g === 14 ? .65 : .1)) / .2, 0, 1));
  }
  // 上の表示
  if (!V.noHud && V.st && !(winning && u > 1.4 && (u < 8.3 || comping))) hud(g, W, H, M, V);
  if (V.hint && !live) { const a = .65 + .35 * Math.sin(it * 4); g.globalAlpha = a; g.textAlign = 'center'; g.textBaseline = 'middle'; fit(g, V.hint, W * .86, .62 * s); outline(g, V.hint, W / 2, Math.min(H - .7 * s, M.y + M.h + .75 * s), '#fff', '#0a0d1c', .12 * s); g.globalAlpha = 1; }
  if (winning && V.skipHint && u > .6) { g.globalAlpha = .7; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = F(.36 * s, 700); g.fillStyle = '#fff'; g.fillText(tx('skip'), W / 2, H - .45 * s); g.globalAlpha = 1; }
  if (V.card > 0) endCard(g, W, H, M, V);
}
function bubble(g, W, M, text, k) {
  if (!text || k <= 0) return; const s = M.s, bw = Math.min(W - .6 * s, 8.2 * s), px = .46 * s; g.font = F(px, 800); const lines = wrap(g, text, bw - .8 * s).slice(0, 3), bh = lines.length * px * 1.35 + .5 * s, bx = W / 2 - bw / 2, by = Math.max(.15 * s + 1.5 * s, M.y - bh - .35 * s);
  g.save(); g.globalAlpha = k; g.translate(0, (1 - k) * .3 * s); rr(g, bx, by, bw, bh, .3 * s); g.fillStyle = '#fff'; g.fill(); g.beginPath(); g.moveTo(W / 2 - .3 * s, by + bh - 1); g.lineTo(W / 2 + .3 * s, by + bh - 1); g.lineTo(W / 2, by + bh + .32 * s); g.fill();
  g.fillStyle = '#1b2233'; g.textAlign = 'center'; g.textBaseline = 'middle'; lines.forEach((l, i) => g.fillText(l, W / 2, by + .25 * s + px * .68 + i * px * 1.35)); g.restore();
}
function hud(g, W, H, M, V) {
  const s = M.s, st = V.st, tx = O.tx; g.textBaseline = 'middle'; g.textAlign = 'left';
  const a = tx('hud', { b: st.b.toLocaleString() }), b = tx('yen', { y: st.yen.toLocaleString() });
  g.font = F(.5 * s); outline(g, a, .35 * s, .62 * s, '#fff', '#0a0d1c', .11 * s); g.font = F(.4 * s, 800); outline(g, b, .35 * s, 1.18 * s, '#ffd97a', '#0a0d1c', .1 * s);
  if (V.feed && V.feed.a > 0) { g.globalAlpha = V.feed.a; g.textAlign = 'right'; fit(g, V.feed.text, W - .9 * s - g.measureText(b).width, .34 * s, 800); outline(g, V.feed.text, W - .3 * s, 1.2 * s, V.feed.col || '#fff', '#0a0d1c', .09 * s); g.globalAlpha = 1; g.textAlign = 'left'; }
  for (let i = 0; i < NCOL; i++) { const px = W - .42 * s - (NCOL - 1 - i) * .42 * s, py = .64 * s, on = st.got[i] > 0; g.beginPath(); g.arc(px, py, .15 * s, 0, TAU); g.fillStyle = on ? COLORS[i].hex : '#ffffff22'; g.fill(); g.lineWidth = .04 * s; g.strokeStyle = on ? '#fff' : '#ffffff55'; g.stroke(); }
}
// 動画の最後に出す札（本数・使ったお金・図鑑）
function endCard(g, W, H, M, V) {
  const s = M.s, k = eo(V.card), st = V.st, tx = O.tx, seq = V.seq, ch = 4.3 * s, cy = H - ch * k;
  g.fillStyle = 'rgba(8,10,24,.93)'; g.fillRect(0, cy, W, ch + 2); for (let i = 0; i < 7; i++) { g.fillStyle = COLORS[i].hex; g.fillRect((W / 7) * i, cy, W / 7 + 1, .1 * s); }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const head = seq.comp ? tx('comp') : seq.win ? tx('winc', { c: tx('c' + seq.c) }) : tx('lose'); fit(g, head, W * .9, .82 * s); g.fillStyle = seq.win ? COLORS[seq.c].lite : '#c9ced6'; g.fillText(head + '  ' + seq.d.join(''), W / 2, cy + .78 * s);
  const line = tx('stBv', { b: st.b.toLocaleString() }) + '・' + tx('stYv', { y: st.yen.toLocaleString() }) + '・' + tx('stZ') + ' ' + tx('stZv', { k: st.got.filter(x => x > 0).length }); fit(g, line, W * .92, .5 * s, 800); g.fillStyle = '#fff'; g.fillText(line, W / 2, cy + 1.68 * s);
  for (let i = 0; i < NCOL; i++) { const px = W / 2 + (i - 3) * .7 * s, py = cy + 2.5 * s, on = st.got[i] > 0; g.beginPath(); g.arc(px, py, .24 * s, 0, TAU); g.fillStyle = on ? COLORS[i].hex : '#ffffff1c'; g.fill(); g.lineWidth = .05 * s; g.strokeStyle = on ? '#fff' : '#ffffff44'; g.stroke(); }
  g.font = F(.56 * s); g.fillStyle = '#fff'; g.fillText(tx('title') + '  #携帯自販機', W / 2, cy + 3.42 * s);
  g.font = F(.3 * s, 700); g.fillStyle = '#9fb0d8'; g.fillText('nasubi-no-oniwa.github.io/jihanki', W / 2, cy + 3.95 * s);
}
