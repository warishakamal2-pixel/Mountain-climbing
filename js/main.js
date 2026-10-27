/* main.js – navigation, footer, JSON rendering, filters, forms. Media helpers live in media.js */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const PAGES = [['index', 'Home'], ['expeditions', 'Expeditions'], ['destinations', 'Destinations'], ['guides', 'Guides'], ['gallery', 'Gallery'], ['safety', 'Safety'], ['about', 'About'], ['faq', 'FAQ'], ['contact', 'Contact']];
const load = async f => { const r = await fetch('data/' + f + '.json'); if (!r.ok) throw new Error(f); return r.json() };
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fail = (el, m) => el && (el.innerHTML = `<p class="note" role="alert">${m || 'Could not load data. Run via a local server (e.g. VS Code Live Server), not file://.'}</p>`);
const cur = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
$('#nav').innerHTML = `<header><div class="wrap"><a class="logo" href="index.html">Alpine<span>Ascents</span></a><nav aria-label="Main"><button id="menu" aria-expanded="false" aria-controls="ml">Menu</button><ul id="ml">${PAGES.map(([p, t]) => `<li><a href="${p}.html"${p === cur ? ' aria-current="page"' : ''}>${t}</a></li>`).join('')}<li><a class="btn pri" href="booking.html">Book</a></li></ul></nav></div></header>`;
$('#menu').onclick = e => { const o = $('#ml').classList.toggle('open'); e.target.setAttribute('aria-expanded', o) };
$('#foot').innerHTML = `<footer><div class="wrap"><p><b>Alpine Ascents</b> · Mountain climbing expeditions</p><p>${PAGES.map(([p, t]) => `<a href="${p}.html">${t}</a>`).join(' · ')} · <a href="booking.html">Booking</a></p></div></footer><button id="top" aria-label="Back to top">↑</button>`;
$('#top').onclick = () => scrollTo({ top: 0 }); addEventListener('scroll', () => $('#top').style.display = scrollY > 600 ? 'block' : 'none');
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))));
const reveal = () => $$('.rv:not(.in)').forEach(e => io.observe(e)); reveal();
// Read each photo from its local file and keep its alt text and source credit.
const ph = (n, m) => `<div class="ph"><img src="${esc(imgSrc(m))}" alt="${esc(m.alt || n)}" loading="lazy" decoding="async" onerror="this.remove()"></div>${credit(m)}`;
const card = e => `<article class="card rv">${ph(e.name, e.image)}<div class="body"><span class="tag">${esc(e.difficulty)}</span><h3>${esc(e.name)}</h3><dl><dt>Country</dt><dd>${esc(e.country)}</dd><dt>Altitude</dt><dd>${e.altitude.toLocaleString()} m</dd><dt>Typical duration</dt><dd>~${e.days} days</dd><dt>Season</dt><dd>${esc(e.season)}</dd></dl><a class="btn" href="expedition-details.html?id=${e.id}">Details</a></div></article>`;
const P = document.body.dataset.page;
if (P === 'home') heroMedia();
else pagePhoto();
(async () => {
   const g = $('#grid');
   if (P === 'home') { try { g.innerHTML = (await load('expeditions')).slice(0, 3).map(card).join(''); reveal() } catch { fail(g) } }
   if (P === 'expeditions') {
      try {
         const all = await load('expeditions');
         $('#country').innerHTML += [...new Set(all.flatMap(e => e.country.split(' / ')))].sort().map(c => `<option>${c}</option>`).join('');
         const run = () => {
            const q = $('#q').value.toLowerCase(), d = $('#diff').value, c = $('#country').value, m = +$('#dur').value, s = $('#sort').value;
            let l = all.filter(e => (!q || (e.name + e.country).toLowerCase().includes(q)) && (!d || e.difficulty === d) && (!c || e.country.includes(c)) && (!m || e.days <= m));
            l.sort((a, b) => s === 'alt' ? b.altitude - a.altitude : s === 'dur' ? a.days - b.days : a.name.localeCompare(b.name));
            g.innerHTML = l.map(card).join('') || '<p>No expeditions match.</p>'; reveal()
         };
         $$('.tools input,.tools select').forEach(x => x.oninput = run); run()
      } catch { fail(g) }
   }
   if (P === 'details') {
      const a = $('#app'); try {
         const id = new URLSearchParams(location.search).get('id'), e = (await load('expeditions')).find(x => x.id === id);
         if (!e) return fail(a, 'Expedition not found. <a href="expeditions.html">Browse expeditions</a>'); document.title = e.name + ' – Alpine Ascents';
         a.innerHTML = `<h1>${esc(e.name)}</h1><p>${esc(e.overview)}</p>${ph(e.name, e.image)}<div class="split"><div><h2>Key facts</h2><dl><dt>Altitude</dt><dd>${e.altitude} m</dd><dt>Country</dt><dd>${esc(e.country)}</dd><dt>Difficulty</dt><dd>${e.difficulty}</dd><dt>Season</dt><dd>${esc(e.season)}</dd><dt>Duration</dt><dd>~${e.days} days</dd><dt>Source</dt><dd><a href="${e.source}" rel="noopener">Reference</a></dd></dl><h2>Before you climb</h2><p class="note">Confirm permits, itinerary, costs and accommodation with the operator before departure.</p></div><div><h2>Equipment checklist</h2><ul class="chk"><li>Mountaineering boots, crampons and ice axe</li><li>Harness, helmet and rope kit for the route</li><li>Layered clothing and weatherproof shell</li><li>Sleeping system rated for expected temperatures</li><li>Sun protection and first-aid kit</li></ul><h2>Safety</h2><p>Altitude illness, weather and avalanche or rockfall risks apply. Check rescue and evacuation insurance.</p><a class="btn pri" href="booking.html?id=${e.id}">Send enquiry</a></div></div>`
      } catch { fail(a) }
   }
   if (P === 'destinations') { try { const all = await load('destinations'), r = () => { const q = $('#q').value.toLowerCase(); g.innerHTML = all.filter(d => (d.name + d.country + d.range).toLowerCase().includes(q)).map(d => `<article class="card rv">${ph(d.name, d.image)}<div class="body"><h3>${d.name}</h3><dl><dt>Country</dt><dd>${d.country}</dd><dt>Range</dt><dd>${d.range}</dd><dt>Altitude</dt><dd>${d.altitude} m</dd><dt>Season</dt><dd>${d.season}</dd><dt>Difficulty</dt><dd>${d.difficulty}</dd></dl><p>Plan acclimatization and gain relevant experience before climbing.</p></div></article>`).join(''); reveal() }; $('#q').oninput = r; r() } catch { fail(g) } }
   if (P === 'guides') { try { g.innerHTML = (await load('guides')).map(x => `<article class="card rv">${ph(x.name, x.image)}<div class="body"><h3>${esc(x.name)}</h3><span class="tag">${esc(x.role)}</span><p>${esc(x.bio)}</p></div></article>`).join(''); reveal() } catch { fail(g) } }
   if (P === 'gallery') {
      try {
         const all = await load('gallery'), dlg = $('#lb'); $('#cat').innerHTML += [...new Set(all.map(x => x.cat))].map(c => `<option>${c}</option>`).join('');
         const r = () => { g.innerHTML = all.filter(x => !$('#cat').value || x.cat === $('#cat').value).map(x => `<button class="card" style="padding:0;color:inherit;cursor:pointer" data-c="${esc(x.caption)}">${ph(x.caption, x.image)}</button>`).join(''); $$('button[data-c]', g).forEach(b => b.onclick = () => { $('#cap').textContent = b.dataset.c; dlg.showModal() }) }; $('#cat').onchange = r; r(); dlg.onclick = e => e.target === dlg && dlg.close()
      } catch { fail(g) }
   }
   if (P === 'faq') { const f = $('#faq'); try { f.innerHTML = (await load('faqs')).map((x, i) => `<button aria-expanded="false" aria-controls="a${i}">${esc(x.q)}<span>+</span></button><div class="a" id="a${i}">${esc(x.a)}</div>`).join(''); $$('button', f).forEach(b => b.onclick = () => { const o = b.classList.toggle('open'); b.setAttribute('aria-expanded', o) }) } catch { fail(f) } }
   const sel = $('#exp'); if (sel) { try { const all = await load('expeditions'); sel.innerHTML = '<option value="">Select…</option>' + all.map(e => `<option value="${e.id}">${e.name}</option>`).join(''); sel.value = new URLSearchParams(location.search).get('id') || '' } catch { sel.innerHTML = '<option value="">Unavailable</option>' } }
   $$('form[data-form]').forEach(f => f.onsubmit = e => {
      e.preventDefault(); let bad = 0; $$('[required]', f).forEach(i => {
         const er = i.nextElementSibling, v = i.value.trim(); let m = '';
         if (!v) m = 'Required.'; else if (i.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) m = 'Enter a valid email.'; else if (i.type === 'number' && (+v < 1 || +v > 20)) m = 'Enter 1–20.';
         if (er) er.textContent = m; i.setAttribute('aria-invalid', !!m); bad += !!m
      });
      $('.ok', f).textContent = bad ? '' : 'This form is not connected. Your message was not sent.'
   });
})();
