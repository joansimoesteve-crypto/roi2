const E = ['😠', '🙁', '😐', '🙂', '😄'], $ = id => document.getElementById(id);
const dl = (name, text, type) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); };
(async () => {
  const d = await chrome.storage.local.get(['roi_ratings', 'roi_hidden', 'roi_endpoint']), list = d.roi_ratings || [];
  $('show').checked = !d.roi_hidden; $('ep').value = d.roi_endpoint || '';
  if (list.length) { $('e').textContent = E[list[0].mood]; $('s').textContent = list[0].moodName; $('n').textContent = `${list.length} valoraciones en total`; }
  list.slice(0, 20).forEach(r => { const li = document.createElement('li'); li.innerHTML = `<b>${E[r.mood]}</b><i></i>`; li.lastChild.textContent = (r.place && r.place.name) || r.title || r.url; $('l').append(li); });
  $('show').onchange = e => chrome.storage.local.set({ roi_hidden: !e.target.checked });
  $('ep').onchange = e => chrome.storage.local.set({ roi_endpoint: e.target.value.trim() });
  $('json').onclick = () => dl('avatar-roi.json', JSON.stringify(list, null, 2), 'application/json');
  $('csv').onclick = () => { const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; dl('avatar-roi.csv', ['fecha,tipo,valoracion,emociones,url,lugar,lat,lng,comentario', ...list.map(r => [r.ts, r.type, r.moodName, r.tags.join('|'), r.url, r.place && r.place.name, r.place && r.place.lat, r.place && r.place.lng, r.comment].map(q).join(','))].join('\n'), 'text/csv'); };
})();
