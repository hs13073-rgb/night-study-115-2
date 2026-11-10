const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
async function api(action, data = {}) {
  if (typeof API_URL === 'undefined' || API_URL.includes('請貼上')) throw new Error('尚未設定 config.js 的 API_URL');
  const r = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action, ...data }) });
  const j = await r.json();
  if (!j.ok) throw new Error(j.msg || '發生錯誤');
  return j;
}
function show(el, msg, type) { el.className = 'msg ' + (type || ''); el.textContent = msg || ''; el.hidden = !msg; }
async function run(btn, msgEl, fn) {
  const t = btn.textContent; btn.disabled = true; btn.textContent = '處理中…'; if (msgEl) show(msgEl, '');
  try { await fn(); } catch (e) { if (msgEl) show(msgEl, e.message, 'err'); else alert(e.message); }
  btn.disabled = false; btn.textContent = t;
}
function header(active) {
  const l = [['index.html', '報名／加退選'], ['leave.html', '家長請假'], ['teacher.html', '夜讀老師']];
  document.body.insertAdjacentHTML('afterbegin', '<header><h1 id="sysTitle">夜讀／週六自習系統</h1><nav>' +
    l.map(([h, t]) => `<a href="${h}" class="${h === active ? 'on' : ''}">${t}</a>`).join('') + '</nav></header>');
}
// 公約渲染：# 大標、## 小標、- 項目、**粗體**
function renderRules(lines) {
  const inl = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  let h = '', ul = false;
  for (const l of lines) {
    const li = l.startsWith('- ');
    if (ul && !li) { h += '</ul>'; ul = false; }
    if (l.startsWith('## ')) h += '<h3>' + inl(l.slice(3)) + '</h3>';
    else if (l.startsWith('# ')) h += '<h2>' + inl(l.slice(2)) + '</h2>';
    else if (li) { if (!ul) { h += '<ul>'; ul = true; } h += '<li>' + inl(l.slice(2)) + '</li>'; }
    else h += '<p>' + inl(l) + '</p>';
  }
  return h + (ul ? '</ul>' : '');
}
