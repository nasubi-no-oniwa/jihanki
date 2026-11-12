// 携帯自販機：音（すべてその場で作る）。1本ぶんの音は「時刻つきの予定表」にして、動画を作るときも同じ音が鳴る
import { hash, WINLEN } from './draw.js?v=1';
let AC = null, master = null, bus = null, NB = null;
export function audio() {
  if (AC) { if (AC.state === 'suspended') AC.resume().catch(() => { }); return AC; }
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)(); master = AC.createGain(); master.gain.value = .5; master.connect(AC.destination);
    const len = Math.floor(AC.sampleRate * 2); NB = AC.createBuffer(1, len, AC.sampleRate); const d = NB.getChannelData(0); let sd = 7; for (let i = 0; i < len; i++) { sd = (sd * 16807) % 2147483647; d[i] = sd / 2147483647 * 2 - 1; }
    newBus();
  } catch (e) { AC = null; } return AC;
}
export const ctx = () => AC, out = () => master;
export function setVol(v) { if (master) master.gain.value = v; }
function newBus() { bus = AC.createGain(); bus.gain.value = 1; bus.connect(master); }
// いま鳴っている音をすっと消す（飛ばしたとき・次を買ったとき）
export function killBus() { if (!AC || !bus) return; const b = bus, t = AC.currentTime; try { b.gain.setValueAtTime(b.gain.value, t); b.gain.linearRampToValueAtTime(0, t + .07); } catch (e) { } setTimeout(() => { try { b.disconnect(); } catch (e) { } }, 250); newBus(); }
export function tone(f, dur, type, vol, f2, delay) { if (!AC) return; const t0 = AC.currentTime + (delay || 0), o = AC.createOscillator(), g = AC.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur); g.gain.setValueAtTime(vol || .3, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + dur); o.connect(g); g.connect(bus); o.start(t0); o.stop(t0 + dur + .03); }
export function noise(dur, vol, freq, type, delay, swell) { if (!AC || !NB) return; const t0 = AC.currentTime + (delay || 0), s = AC.createBufferSource(); s.buffer = NB; s.loop = true; const f = AC.createBiquadFilter(); f.type = type || 'highpass'; f.frequency.value = freq || 1800; const g = AC.createGain(); if (swell) { g.gain.setValueAtTime(.001, t0); g.gain.exponentialRampToValueAtTime(vol || .3, t0 + dur * swell); } else g.gain.setValueAtTime(vol || .3, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + dur); s.connect(f); f.connect(g); g.connect(bus); s.start(t0, Math.random() * .5); s.stop(t0 + dur + .03); }
const chord = (fs, dur, type, vol, delay) => fs.forEach(f => tone(f, dur, type, vol, null, delay));
const arp = (fs, step, dur, type, vol, delay) => fs.forEach((f, i) => tone(f, dur, type, vol, null, (delay || 0) + i * step));
export const UI = { tap: () => tone(1100, .05, 'square', .08), back: () => tone(700, .06, 'square', .07), ok: () => arp([784, 1047], .08, .14, 'triangle', .18) };

const SCALE = [262, 294, 330, 349, 392, 440, 494];
// 当たりの演出の音（v=演出が始まってからの秒）。[時刻, 鳴らす関数] のならび
function sceneEvents(c, rnd) {
  const E = [], at = (v, f) => E.push([v, f]);
  if (c === 0) { at(0, () => noise(6.6, .42, 150, 'lowpass', 0, .1)); for (const b of [.7, 3.3, 5.6]) at(b, () => { tone(90, .8, 'sine', .9, 28); noise(.7, .7, 420, 'lowpass'); noise(.12, .5, 3000); }); for (let i = 0; i < 40; i++) at(.9 + i * .14 + rnd() * .1, () => noise(.04, .12, 2500 + rnd() * 2000)); at(.9, () => chord([196, 247, 294, 392], 1.4, 'sawtooth', .07)); }
  if (c === 1) { const mel = [587, 698, 784, 880, 1047, 880, 784, 698, 587, 698, 784, 1047, 1175, 1047, 880, 784, 880, 1047, 1175, 1397, 1175, 1047, 880, 784, 698, 784, 880, 1047, 880, 784]; for (let i = 0; i < 15; i++) { at(i * .45, () => { tone(105, .22, 'sine', .85, 50); noise(.05, .2, 300, 'lowpass'); }); at(i * .45 + .225, () => noise(.035, .28, 2600)); if (i % 2) at(i * .45 + .3375, () => noise(.03, .2, 2600)); } mel.forEach((f, i) => at(.5 + i * .225, () => tone(f, .2, 'triangle', .15))); for (const b of [.4, 1.2, 2.0, 2.9, 3.6, 4.4, 5.2, 5.9]) at(b, () => { noise(.3, .3, 800, 'bandpass'); tone(190, .3, 'sine', .28, 60); noise(.5, .12, 5000, 'highpass', .1); }); }
  if (c === 2) { for (const b of [.25, 1.25, 2.25]) at(b, () => { noise(.1, .7, 4000); noise(.9, .9, 260, 'lowpass'); tone(70, .6, 'sine', .8, 30); }); at(0, () => noise(2.8, .16, 300, 'lowpass', 0, .2)); at(3.05, () => { chord([523, 659, 784, 1047], 1.2, 'triangle', .2); arp([1047, 1319, 1568, 2093], .07, .3, 'sine', .16, .1); }); for (let i = 0; i < 62; i++) at(2.95 + i * .062, () => tone(1800 + rnd() * 2600, .07, 'sine', .07)); }
  if (c === 3) { const up = [262, 294, 330, 392, 440, 523, 587, 659, 784, 880, 1047, 1175, 1319]; up.forEach((f, i) => at(i * .17, () => tone(f, .16, 'triangle', .22))); at(1.6, () => chord([262, 330, 392, 523], 1.6, 'triangle', .16)); for (let i = 0; i < 12; i++) at(2.4 + i * .2 + rnd() * .1, () => tone(1100 + rnd() * 500, .08, 'sine', .16, 1900)); for (let i = 0; i < 9; i++) at(1.2 + i * .62 + rnd() * .2, () => { tone(2600, .05, 'sine', .08, 3500); tone(3000, .05, 'sine', .08, 3600, .08); }); const m2 = [523, 659, 784, 659, 587, 698, 880, 698, 659, 784, 1047, 784, 698, 880, 1175, 1047]; m2.forEach((f, i) => at(3.6 + i * .19, () => tone(f, .18, 'triangle', .14))); }
  if (c === 4) { for (const b of [0, 1.5, 3.0, 4.5, 6.0]) at(b, () => noise(1.7, .34, 650, 'bandpass', 0, .45)); const ch = [[262, 330, 392, 523], [220, 262, 330, 440], [175, 220, 262, 349], [196, 247, 294, 392]]; for (let i = 0; i < 8; i++) at(.2 + i * .82, () => arp(ch[i % 4].map(f => f * 2), .035, .5, 'triangle', .13)); for (const b of [2.2, 4.3, 6.1]) at(b, () => { tone(1700, .13, 'sine', .2, 2900); tone(1900, .13, 'sine', .2, 3100, .16); }); at(1.5, () => chord([392, 494, 587, 784], 1.2, 'triangle', .15)); }
  if (c === 5) { at(.25, () => noise(3.4, .7, 200, 'lowpass', 0, .35)); at(1.0, () => tone(90, 2.4, 'sawtooth', .13, 900)); at(2.4, () => chord([220, 277, 330, 440], 1.6, 'triangle', .14)); const sp = [440, 523, 659, 784, 988, 784, 659, 523, 494, 587, 740, 880, 1175]; sp.forEach((f, i) => at(4.2 + i * .2, () => { tone(f, 1.0, 'sine', .15); tone(f * 2, .7, 'sine', .05); })); for (const b of [4.8, 5.7, 6.4]) at(b, () => tone(2400, .35, 'sine', .1, 900)); }
  if (c === 6) { at(0, () => { tone(110, 6.8, 'sawtooth', .05); tone(164.8, 6.8, 'sawtooth', .04); tone(220, 6.8, 'triangle', .07); }); const bl = [1760, 1319, 1568, 1175, 1760, 2093, 1568, 1319]; bl.forEach((f, i) => at(.4 + i * .48, () => { tone(f, 1.2, 'sine', .12); tone(f * 2.01, .6, 'sine', .04); })); at(2.2, () => arp([2093, 1760, 1568, 1319, 1175, 1047, 880], .09, .5, 'sine', .1)); at(4.1, () => { tone(98, 2.2, 'sine', .9, 62); noise(.9, .4, 1500, 'bandpass'); chord([440, 554, 659, 880], 2.0, 'triangle', .16); }); at(4.9, () => arp([880, 1109, 1319, 1760], .12, .9, 'sine', .12)); }
  return E;
}
// 1本ぶんの音の予定表を作る
export function sfxEvents(seq, pl, drink) {
  let rc = 0; const E = [], at = (t, f) => E.push([t, f]), rnd = () => hash(rc++, seq.seed + 99), g = seq.g, has = n => g === n || (g === 25 && [6, 7, 8, 11].includes(n));
  at(0, () => { tone(1200, .05, 'square', .1); tone(2100, .07, 'square', .07, null, .05); tone(2800, .1, 'square', .05, null, .1); });
  at(.16, () => { tone(120, .2, 'sine', .7, 48); noise(.09, .45, 700, 'lowpass'); });
  for (let t = .05; t < pl.T3; t += .07) at(t, () => tone(880, .018, 'square', .03));
  at(pl.T1, () => tone(620, .06, 'triangle', .22)); at(pl.T2, () => tone(700, .06, 'triangle', .22));
  if (pl.fr3) pl.fr3.forEach((f, i) => at(f.t, () => tone(520 + i * 50, .07, 'triangle', .22))); else at(pl.T3, () => tone(780, .06, 'triangle', .22));
  if (pl.reach) at(pl.T3 + .02, () => { tone(880, .1, 'triangle', .22); tone(1175, .16, 'triangle', .22, null, .1); });
  for (let t = pl.T3 + .08; t < pl.fr[0].t - .02; t += .07) at(t, () => tone(980, .018, 'square', .03));
  if (pl.reach) pl.fr.forEach((f, i) => { if (i < pl.fr.length - 1) at(f.t, () => tone(480 + i * 70, .08, 'triangle', .24)); });
  if (g === 5 || (seq.win && seq.wv === 3)) for (let t = pl.Ts - .3; t < pl.T4 - .1; t += .62) at(t, () => { tone(62, .14, 'sine', .9, 40); tone(58, .14, 'sine', .7, 38, .17); });
  const G0 = pl.G0, GD = pl.G1 - pl.G0;
  if (has(6)) at(G0, () => arp([1047, 1319, 1568, 2093, 2637, 3136], .06, .25, 'sine', .14));
  if (has(7)) at(G0 + GD * .12, () => { noise(.25, .4, 3500); tone(440, .35, 'sawtooth', .14, 990); });
  if (has(8)) at(G0, () => noise(GD, .5, 180, 'lowpass'));
  if (has(9)) at(G0, () => arp([1568, 1976, 2349, 3136], .1, .5, 'sine', .1));
  if (has(10)) for (let i = 0; i < 3; i++) at(G0 + GD * i / 3, () => { noise(.08, .5, 4000); noise(.3, .6, 280, 'lowpass'); });
  if (has(11)) for (let i = 0; i < 3; i++) at(G0 + GD * i / 3, () => tone(i < 2 ? 660 : 990, .16, 'square', .14));
  if (has(12)) for (let i = 0; i < 4; i++) at(G0 + GD * i / 4, () => tone(i % 2 ? 620 : 880, GD / 4, 'sawtooth', .09));
  if (g === 15) for (let i = 0; i < 10; i++) at(G0 + GD * i / 10, () => { noise(.03, .25, 2800); tone(i % 2 ? 392 : 523, .08, 'square', .06); });
  if (has(16)) for (let i = 0; i < 12; i++) at(G0 + GD * i / 12, () => tone(900 + (i % 4) * 220, .04, 'square', .08));
  if (g === 17) at(G0, () => noise(.6, .3, 900, 'bandpass', 0, .7));
  if (g === 18) at(G0, () => tone(70, GD, 'sine', .5));
  if (g === 19) for (let i = 0; i < 9; i++) at(G0 + GD * i / 9, () => tone(i % 2 ? 900 : 1300, GD / 9, 'sine', .1, i % 2 ? 1300 : 900));
  if (g === 20) { at(G0 + GD * .3, () => { tone(820, .16, 'triangle', .2, 1000); tone(1000, .3, 'triangle', .2, 560, .16); }); at(G0 + GD * .75, () => { tone(900, .12, 'triangle', .16, 1050); tone(1050, .22, 'triangle', .16, 640, .12); }); }
  if (g === 13) at(pl.T4 - .15, () => { noise(.1, .5, 2500); arp([784, 988, 1175], .05, .12, 'square', .1); });
  if (seq.win) {
    const W0 = pl.W0;
    at(W0, () => { chord([523, 659, 784, 1047], .9, 'triangle', .24); noise(.35, .45, 3000); tone(600, .55, 'sine', .2, 2600); arp([1047, 1175, 1319, 1568, 1760, 2093, 2349, 2637, 3136, 3520], .085, .22, 'square', .07, .3); });
    for (const [v, f] of sceneEvents(seq.c, rnd)) if (v < WINLEN - 1.4 - 1.05) at(W0 + 1.4 + v, f);
    at(W0 + 8.3, () => { chord([523, 659, 784], .16, 'triangle', .26); chord([523, 659, 784, 1047, 1319], 1.0, 'triangle', .22, .18); noise(.4, .25, 5000, 'highpass', .18); });
    if (seq.comp) { const C0 = pl.C0; for (let i = 0; i < 7; i++) at(C0 + .3 + i * .42, () => { tone(SCALE[i], .7, 'triangle', .3); tone(SCALE[i] * 2, .5, 'sine', .12); noise(.2, .12, 4000 + i * 400); });
      at(C0 + 3.5, () => arp([523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319, 1568, 2093], .09, .3, 'triangle', .16));
      at(C0 + 4.9, () => { chord([262, 330, 392, 523, 659, 784, 1047], 2.8, 'triangle', .16); noise(.9, .4, 4000); tone(2093, .7, 'sine', .22); tone(3136, .7, 'sine', .14, null, .12); });
      for (const b of [5.0, 5.5, 6.0, 6.5, 7.0, 7.4, 7.8]) at(C0 + b, () => { noise(.3, .3, 800, 'bandpass'); tone(190, .3, 'sine', .28, 60); noise(.5, .12, 5000, 'highpass', .1); });
      const fin = [523, 659, 784, 1047, 784, 1047, 1319, 1568]; fin.forEach((f, i) => at(C0 + 5.9 + i * .26, () => tone(f, .3, 'triangle', .16))); }
  } else {
    const tb = pl.T4 + (g === 22 ? .45 : g === 14 ? .55 : 0);
    if (g === 22) at(pl.T4, () => arp([523, 659, 784], .09, .14, 'triangle', .24));
    if (g === 14) at(pl.T4, () => chord([523, 659, 784], .4, 'triangle', .22));
    if (g === 3) at(pl.T4, () => tone(520, .16, 'sawtooth', .12, 190));
    at(tb, () => { tone(175, .26, 'sawtooth', .13, 115); if (pl.reach) tone(130, .3, 'sawtooth', .1, 90, .1); });
  }
  E.sort((a, b) => a[0] - b[0]); return E;
}
// 時刻 a〜b のあいだの音を鳴らす
export function runSfx(E, a, b) { if (!AC || !E) return; for (const [t, f] of E) { if (t >= b) break; if (t >= a) { try { f(); } catch (e) { } } } }
