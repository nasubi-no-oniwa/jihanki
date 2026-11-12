// 携帯自販機のルールの試験（試し用のデータベースで試す。本番には触らない）
const B = 'http://127.0.0.1:9000';
const NS = '?ns=ft-red-default-rtdb';
const tok = uid => { const e = o => Buffer.from(JSON.stringify(o)).toString('base64url'); return e({ alg: 'none', typ: 'JWT' }) + '.' + e({ uid, sub: uid, user_id: uid, provider_id: 'anonymous', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600, aud: 'ft-red', iss: 'https://securetoken.google.com/ft-red', firebase: { sign_in_provider: 'anonymous' } }) + '.'; };
async function req(method, path, body, uid) {
  const r = await fetch(B + '/jihanki' + path + '.json' + NS + (uid ? '&auth=' + tok(uid) : ''), { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
  return r.status;
}
const now = { '.sv': 'timestamp' }, inc = { '.sv': { increment: 1 } };
const A = 'userAaaaaaaaaaaaaaaaaaaaa', Bu = 'userBbbbbbbbbbbbbbbbbbbbb', C = 'userCccccccccccccccccccccc';
let bad = 0;
async function ok(name, p, want) { const s = await p; const pass = want ? s === 200 : s !== 200; console.log((pass ? 'OK ' : 'NG ') + name + ' (' + s + ')'); if (!pass) bad++; }
// ---- 色ごとの「当てたことがある人数」 ----
await ok('Aが赤を当てる（数を1ふやす）', req('PATCH', '', { ['u/' + A + '/c0']: now, ['c/c0']: inc }, A), true);
await ok('Aがもう一度赤を数える', req('PATCH', '', { ['u/' + A + '/c0']: now, ['c/c0']: inc }, A), false);
await ok('印なしで数だけふやす', req('PATCH', '', { ['c/c0']: inc }, A), false);
await ok('数をふやさず印だけつける', req('PATCH', '', { ['u/' + A + '/c1']: now }, A), false);
await ok('2つふやす', req('PATCH', '', { ['u/' + A + '/c1']: now, ['c/c1']: { '.sv': { increment: 2 } } }, A), false);
await ok('Bが赤を当てる', req('PATCH', '', { ['u/' + Bu + '/c0']: now, ['c/c0']: inc }, Bu), true);
await ok('BがAの印をつける', req('PATCH', '', { ['u/' + A + '/c2']: now, ['c/c2']: inc }, Bu), false);
await ok('ない色', req('PATCH', '', { ['u/' + Bu + '/c7']: now, ['c/c7']: inc }, Bu), false);
await ok('時刻をごまかす', req('PATCH', '', { ['u/' + Bu + '/c3']: 123, ['c/c3']: inc }, Bu), false);
await ok('ログインなし', req('PATCH', '', { ['u/' + C + '/c3']: now, ['c/c3']: inc }), false);
await ok('数を消す', req('DELETE', '/c/c0', undefined, A), false);
await ok('印を消す', req('DELETE', '/u/' + A + '/c0', undefined, A), false);
await ok('Bが紫を当てる', req('PATCH', '', { ['u/' + Bu + '/c6']: now, ['c/c6']: inc }, Bu), true);
await ok('Bがコンプを数える', req('PATCH', '', { ['u/' + Bu + '/comp']: now, ['c/comp']: inc }, Bu), true);
await ok('人数を読む（ログインなし）', fetch(B + '/jihanki/c.json' + NS).then(r => r.status), true);
await ok('ほかの人の印は読めない', fetch(B + '/jihanki/u/' + A + '.json' + NS + '&auth=' + tok(Bu)).then(r => r.status), false);
// ---- みんなの当たり ----
await ok('Aの当たりを流す', req('PUT', '/f/' + A, { c: 0, b: 37, t: now }, A), true);
await ok('すぐもう一度（3秒以内）', req('PUT', '/f/' + A, { c: 1, b: 38, t: now }, A), false);
await ok('ほかの人の場所に書く', req('PUT', '/f/' + A, { c: 1, b: 38, t: now }, Bu), false);
await ok('ない色（8）', req('PUT', '/f/' + Bu, { c: 8, b: 5, t: now }, Bu), false);
await ok('余計なものを足す', req('PUT', '/f/' + Bu, { c: 2, b: 5, t: now, n: 'x' }, Bu), false);
await ok('時刻をごまかす', req('PUT', '/f/' + Bu, { c: 2, b: 5, t: 1 }, Bu), false);
await ok('Bのコンプを流す（7）', req('PUT', '/f/' + Bu, { c: 7, b: 1800, t: now }, Bu), true);
await ok('当たりを読む（ログインなし・新しい順）', fetch(B + '/jihanki/f.json' + NS + '&orderBy=%22t%22&limitToLast=6').then(r => r.status), true);
// ---- 引き継ぎコード ----
const rec = uid => ({ u: uid, b: 120, w: 3, g: '1,0,2,0,0,0,0', s: 'c0,c2', c: 0, t: now });
await ok('Aがコードを作る', req('PUT', '/x/ABCD2345', rec(A), A), true);
await ok('Aが同じコードを書きなおす', req('PUT', '/x/ABCD2345', rec(A), A), true);
await ok('BがAのコードを書きかえる', req('PUT', '/x/ABCD2345', rec(Bu), Bu), false);
await ok('持ち主をごまかす', req('PUT', '/x/WXYZ6789', rec(A), Bu), false);
await ok('形のちがうコード', req('PUT', '/x/abcd2345', rec(A), A), false);
await ok('中身の形がちがう', req('PUT', '/x/QRST2345', { ...rec(A), g: '1,2,3' }, A), false);
await ok('コードを消す', req('DELETE', '/x/ABCD2345', undefined, A), false);
await ok('コードを知っていれば読める（ログインなし）', fetch(B + '/jihanki/x/ABCD2345.json' + NS).then(r => r.status), true);
await ok('コードの一覧は読めない', fetch(B + '/jihanki/x.json' + NS).then(r => r.status), false);
const c = await fetch(B + '/jihanki/c.json' + NS).then(r => r.json());
console.log('人数', JSON.stringify(c));
if (!c || c.c0 !== 2 || c.c6 !== 1 || c.comp !== 1 || c.c1) bad++;
if (bad) { console.log(bad + ' 件が合いません'); process.exit(1); } else console.log('すべて合いました');
