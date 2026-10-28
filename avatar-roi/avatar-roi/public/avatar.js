/* Avatar Roi — asistente flotante. Funciona como extensión (chrome.storage) y como demo web (localStorage). */
(() => {
  if (window.__roi) return; window.__roi = 1;
  const isExt = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
  const store = {
    get: async k => isExt ? (await chrome.storage.local.get(k))[k] : JSON.parse(localStorage.getItem(k) || 'null'),
    set: async (k, v) => isExt ? chrome.storage.local.set({ [k]: v }) : localStorage.setItem(k, JSON.stringify(v))
  };
  const COL = ['#e8605a', '#f0913a', '#f2d05c', '#8cc35e', '#5fb760'];
  const MOU = ['M33 68Q50 56 67 68', 'M33 66Q50 58 67 66', 'M34 64H66', 'M32 60Q50 76 68 60', 'M30 58Q50 82 70 58'];
  const AM = ['M41 66Q50 60 59 66', 'M42 66Q50 62 58 66', 'M42 64H58', 'M41 62Q50 70 59 62', 'M39 61Q50 74 61 61'];
  const NAMES = ['Muy mal', 'Mal', 'Neutral', 'Bien', 'Muy bien'];
  const CHIPS = ['Inspirado', 'Tranquilo', 'Motivado', 'Frustrado', 'Indiferente', 'Otro'];
  const ACTS = [['page', 'Valorar esta página'], ['element', 'Señalar un elemento'], ['place', 'Valorar un lugar físico'], ['comment', 'Escribir un comentario']];
  const face = i => `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="${COL[i]}"/><circle cx="36" cy="40" r="5" fill="#3a2a1a"/><circle cx="64" cy="40" r="5" fill="#3a2a1a"/>${i === 0 ? '<path d="M26 28L44 34M74 28L56 34" stroke="#3a2a1a" stroke-width="5" stroke-linecap="round"/>' : ''}<path d="${MOU[i]}" stroke="#3a2a1a" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`;
  const avatar = m => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 100Q14 79 50 77Q86 79 88 100Z" fill="#2f4a6b"/><path d="M39 79L50 93L61 79Z" fill="#cfe2f3"/><rect x="43" y="66" width="14" height="14" fill="#d9a07a"/><ellipse cx="50" cy="47" rx="22" ry="26" fill="#e9b48e"/><path d="M26 46Q22 14 50 14Q80 14 74 46Q69 29 50 29Q33 29 26 46Z" fill="#2b1d16"/><g class="eyes"><ellipse cx="41" cy="48" rx="2.6" ry="3.2" fill="#2b1d16"/><ellipse cx="59" cy="48" rx="2.6" ry="3.2" fill="#2b1d16"/></g>${m === 0 ? '<path d="M35 41L46 44M65 41L54 44" stroke="#2b1d16" stroke-width="2.4" stroke-linecap="round"/>' : ''}<path d="${AM[m]}" stroke="#8a3b2e" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>`;

  const css = `
  :host{all:initial}*{box-sizing:border-box}
  .w{position:fixed;right:20px;bottom:20px;font:14px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;color:#26331f;z-index:2147483647}
  button{font:inherit;color:inherit;cursor:pointer;border:0;background:none}
  button:focus-visible,textarea:focus-visible,input:focus-visible{outline:3px solid #3f5a3a;outline-offset:2px}
  .fab{display:block;width:78px;height:78px;margin-left:auto;border-radius:50%;background:#e9efdc;border:3px solid #fff;box-shadow:0 10px 28px #3f5a3a66;padding:0;overflow:hidden;touch-action:none;animation:bob 4s ease-in-out infinite}
  .fab:active{cursor:grabbing}.fab svg{width:100%;height:100%;display:block}
  .eyes{transform-origin:50px 48px;animation:blink 5s infinite}
  @keyframes blink{0%,94%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
  @keyframes bob{50%{transform:translateY(-4px)}}
  @keyframes pop{from{opacity:0;transform:translateY(8px) scale(.97)}}
  @keyframes cheer{30%{transform:translateY(-14px) rotate(-6deg)}60%{transform:translateY(0) rotate(5deg)}}
  .cheer .fab{animation:cheer .7s}
  .panel,.hi{display:none;position:absolute;right:0;bottom:92px;background:#fbf7ec;border-radius:22px;box-shadow:0 18px 50px #26331f40}
  .panel{width:330px;max-width:calc(100vw - 32px);padding:16px;animation:pop .22s}
  .open .panel{display:block}
  .hi{width:230px;padding:14px 34px 14px 16px;font-size:15px;animation:pop .3s}.showhi:not(.open) .hi{display:block}
  .x{position:absolute;top:8px;right:10px;font-size:20px;color:#7a866f;line-height:1;padding:4px}
  .hd{display:flex;gap:10px;align-items:center;padding-right:18px}.mini{width:44px;height:44px;flex:none;border-radius:50%;overflow:hidden;background:#e9efdc}.hd p{margin:0;font-size:13px}
  .faces{display:flex;justify-content:space-between;margin:14px 2px 10px}
  .faces button{width:42px;height:42px;border-radius:50%;padding:0;transition:transform .15s;opacity:.55}
  .faces button:hover,.faces button[aria-pressed=true]{transform:scale(1.18);opacity:1}
  .faces button[aria-pressed=true]{filter:drop-shadow(0 3px 5px #0003)}
  h4{margin:10px 0 6px;font-size:13px;font-weight:700}
  .chips{display:flex;flex-wrap:wrap;gap:6px}
  .chips button{border:1px solid #cfd6c2;border-radius:99px;padding:5px 12px;font-size:12.5px;background:#fff9}
  .chips button[aria-pressed=true]{background:#3f5a3a;color:#fff;border-color:#3f5a3a}
  .acts{display:grid;gap:4px}.acts button{display:flex;gap:8px;align-items:center;text-align:left;padding:8px 10px;border-radius:10px;border:1px solid transparent;background:#fff8}
  .acts button[aria-pressed=true]{border-color:#3f5a3a;background:#e9efdc;font-weight:600}
  #ctx{font-size:12.5px;color:#4a5a41;margin-top:8px}#ctx input{width:100%;padding:7px 9px;border:1px solid #cfd6c2;border-radius:8px;font:inherit;margin-top:4px}
  textarea{width:100%;height:62px;margin-top:10px;padding:9px 10px;border:1px solid #cfd6c2;border-radius:12px;resize:none;font:inherit;background:#fff}
  .send{width:100%;margin-top:10px;padding:11px;border-radius:12px;background:#3f5a3a;color:#fff;font-weight:600}.send:disabled{opacity:.45;cursor:not-allowed}
  .toast{margin-top:8px;text-align:center;font-weight:600;color:#3f5a3a;min-height:18px}
  @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}`;

  const host = document.createElement('div'); host.id = 'avatar-roi-host';
  const root = host.attachShadow({ mode: 'open' });
  const S = { mood: null, tags: new Set(), act: 'page', comment: '', target: null, place: null };

  root.innerHTML = `<style>${css}</style><div class="w" id="w">
    <div class="hi" id="hi">¡Hola! 👋<br>¿Cómo te sientes con esta experiencia?<button class="x" aria-label="Cerrar">×</button></div>
    <div class="panel" role="dialog" aria-label="Avatar Roi">
      <button class="x" id="cl" aria-label="Cerrar">×</button>
      <div class="hd"><div class="mini">${avatar(3)}</div><p>Hola, soy <b>Roi</b>. ¿Cómo te sientes con <b id="pg"></b>?</p></div>
      <div class="faces">${COL.map((_, i) => `<button data-m="${i}" aria-pressed="false" aria-label="${NAMES[i]}">${face(i)}</button>`).join('')}</div>
      <h4>¿Cómo te hace sentir?</h4><div class="chips">${CHIPS.map(c => `<button aria-pressed="false">${c}</button>`).join('')}</div>
      <h4>¿Qué te gustaría hacer?</h4><div class="acts">${ACTS.map(([k, t]) => `<button data-a="${k}" aria-pressed="${k === 'page'}">${t}</button>`).join('')}</div>
      <div id="ctx"></div>
      <textarea placeholder="Cuéntanos tu experiencia…" aria-label="Comentario"></textarea>
      <button class="send" disabled>Enviar valoración</button><div class="toast" role="status"></div>
    </div>
    <button class="fab" aria-label="Abrir Avatar Roi">${avatar(3)}</button></div>`;

  const $ = s => root.querySelector(s), $$ = s => [...root.querySelectorAll(s)];
  const w = $('#w'), fab = $('.fab'), ta = $('textarea'), send = $('.send'), ctx = $('#ctx'), toast = $('.toast');
  $('#pg').textContent = location.hostname || 'esta página';
  const setAvatar = m => { fab.innerHTML = avatar(m); $('.mini').innerHTML = avatar(m); };
  const refresh = () => { send.disabled = S.mood === null; };
  const say = t => { toast.textContent = t; setTimeout(() => toast.textContent = '', 3500); };

  /* Arrastrar / abrir */
  let drag = null;
  const toggle = o => { w.classList.toggle('open', o); w.classList.remove('showhi'); };
  fab.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, r: parseFloat(w.style.right) || 20, b: parseFloat(w.style.bottom) || 20, moved: false }; fab.setPointerCapture(e.pointerId); });
  fab.addEventListener('pointermove', e => {
    if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
    if (drag.moved) { w.style.right = Math.max(8, drag.r - dx) + 'px'; w.style.bottom = Math.max(8, drag.b - dy) + 'px'; }
  });
  fab.addEventListener('pointerup', () => { if (drag && !drag.moved) toggle(); drag = null; });
  fab.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  $('#cl').onclick = () => toggle(false);
  $('.hi .x').onclick = () => w.classList.remove('showhi');
  setTimeout(() => { if (!w.classList.contains('open')) w.classList.add('showhi'); }, 2500);
  setTimeout(() => w.classList.remove('showhi'), 9000);

  /* Emociones */
  $$('.faces button').forEach(b => b.onclick = () => {
    S.mood = +b.dataset.m; $$('.faces button').forEach(x => x.setAttribute('aria-pressed', x === b)); setAvatar(S.mood); refresh();
  });
  $$('.chips button').forEach(b => b.onclick = () => {
    const t = b.textContent, on = !S.tags.has(t); on ? S.tags.add(t) : S.tags.delete(t); b.setAttribute('aria-pressed', on);
  });
  ta.oninput = () => S.comment = ta.value;

  /* Acciones */
  $$('.acts button').forEach(b => b.onclick = () => {
    S.act = b.dataset.a; $$('.acts button').forEach(x => x.setAttribute('aria-pressed', x === b)); ctx.innerHTML = '';
    if (S.act !== 'element') S.target = null; if (S.act !== 'place') S.place = null;
    if (S.act === 'element') pick(); if (S.act === 'place') locate();
  });

  const sel = el => { const p = []; for (let n = el, d = 0; n && n.nodeType === 1 && d < 3; n = n.parentElement, d++) p.unshift(n.tagName.toLowerCase() + (n.id ? '#' + n.id : n.classList[0] ? '.' + n.classList[0] : '')); return p.join(' > '); };
  function pick() {
    toggle(false); const box = document.createElement('div');
    Object.assign(box.style, { position: 'fixed', zIndex: 2147483646, pointerEvents: 'none', border: '2px solid #3f5a3a', background: '#3f5a3a22', borderRadius: '4px', transition: 'all .08s' });
    document.documentElement.append(box);
    const move = e => { const t = e.target; if (t === host) return; const r = t.getBoundingClientRect(); Object.assign(box.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' }); };
    const done = () => { box.remove(); document.removeEventListener('mousemove', move, true); document.removeEventListener('click', click, true); document.removeEventListener('keydown', key, true); toggle(true); };
    const click = e => { if (e.target === host) return; e.preventDefault(); e.stopPropagation(); S.target = { selector: sel(e.target), text: (e.target.innerText || e.target.alt || '').trim().slice(0, 80) }; ctx.textContent = '🎯 ' + S.target.selector; done(); };
    const key = e => { if (e.key === 'Escape') done(); };
    document.addEventListener('mousemove', move, true); document.addEventListener('click', click, true); document.addEventListener('keydown', key, true);
  }
  function manual(msg) { ctx.innerHTML = `${msg}<input placeholder="Nombre del lugar (ej. Parque Central)" aria-label="Lugar">`; ctx.querySelector('input').oninput = e => S.place = { name: e.target.value }; }
  function locate() {
    ctx.textContent = '📍 Buscando tu ubicación…';
    if (!navigator.geolocation) return manual('No puedo ubicarte. ');
    navigator.geolocation.getCurrentPosition(async p => {
      const { latitude: lat, longitude: lng } = p.coords; let name = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      try { const r = await (await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=es&lat=${lat}&lon=${lng}`)).json(); name = r.name || (r.display_name || name).split(',').slice(0, 2).join(','); } catch {}
      S.place = { name, lat, lng }; ctx.innerHTML = `📍 <b></b> <small>(${lat.toFixed(4)}, ${lng.toFixed(4)})</small>`; ctx.querySelector('b').textContent = name;
    }, () => manual('No tengo permiso de ubicación. '), { timeout: 8000 });
  }

  /* Enviar */
  send.onclick = async () => {
    const rec = { id: Date.now().toString(36), ts: new Date().toISOString(), url: location.href, title: document.title, type: S.act, mood: S.mood, moodName: NAMES[S.mood], tags: [...S.tags], comment: S.comment, target: S.target, place: S.place };
    const list = (await store.get('roi_ratings')) || []; list.unshift(rec); await store.set('roi_ratings', list.slice(0, 500));
    const ep = await store.get('roi_endpoint');
    if (ep) fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rec) }).catch(() => {});
    say('¡Gracias! Valoración guardada 💚'); w.classList.add('cheer'); setTimeout(() => w.classList.remove('cheer'), 800);
    S.mood = null; S.tags.clear(); S.comment = ''; ta.value = ''; ctx.innerHTML = ''; S.target = S.place = null;
    $$('.faces button,.chips button').forEach(b => b.setAttribute('aria-pressed', false)); refresh();
    window.dispatchEvent(new CustomEvent('roi:rated', { detail: rec }));
  };

  window.AvatarRoi = { open: () => toggle(true), close: () => toggle(false) };
  if (isExt) chrome.storage.onChanged.addListener(c => { if (c.roi_hidden) host.style.display = c.roi_hidden.newValue ? 'none' : ''; });
  Promise.resolve(store.get('roi_hidden')).then(h => { if (h) host.style.display = 'none'; });
  document.documentElement.append(host);
  if (document.currentScript && document.currentScript.dataset.open) toggle(true);
})();
