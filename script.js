(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const rp = n => 'Rp ' + n.toLocaleString('id-ID');
  // ====== TUJUAN PESANAN (isi salah satu atau keduanya) ======
  const WA_NUMBER = '62895323126887';        // Nomor WhatsApp penerima, format 628xxxxxxxxxx (tanpa + dan spasi)
  const WEB3FORMS_KEY = 'rezkyramadhansagala@gmail.com';    // Access key dari web3forms.com, pesanan masuk ke email Anda
  const FORM_ENDPOINT = '';    // Alternatif: alamat Formspree, contoh https://formspree.io/f/xxxxxxx
  // ============================================================

  // Header, progress, back-to-top
  const header = $('#header'), prog = $('#progress'), topBtn = $('#toTop');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('scrolled', scrollY > 40);
    prog.style.width = (scrollY / max * 100) + '%';
    topBtn.classList.toggle('show', scrollY > 600);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  topBtn.onclick = () => scrollTo({ top: 0 });
  $('#year').textContent = new Date().getFullYear();

  // Mobile menu
  const nav = $('#navlist'), burger = $('#menuIcon');
  const setMenu = o => { nav.classList.toggle('open', o); burger.innerHTML = `<iconify-icon icon="lucide:${o ? 'x' : 'menu'}"></iconify-icon>`; };
  burger.onclick = () => setMenu(!nav.classList.contains('open'));
  $$('.navlist a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Active nav link
  const links = $$('.navlist a');
  const sio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]').forEach(s => sio.observe(s));

  // Typing effect
  const words = ['boba yang kenyal.', 'milk tea yang segar.', 'sundae yang lembut.', 'smoothies yang dingin.'];
  let w = 0, c = 0, del = false; const typed = $('#typed');
  (function type() {
    const word = words[w]; typed.textContent = word.slice(0, c);
    if (!del && c++ === word.length) { del = true; return setTimeout(type, 1600); }
    if (del && --c < 0) { del = false; c = 0; w = (w + 1) % words.length; }
    setTimeout(type, del ? 35 : 80);
  })();

  // Hero parallax
  const hi = $('#heroImg');
  $('#home').addEventListener('mousemove', e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    hi.style.transform = `translate(${x * -22}px,${y * -16}px)`;
  });

  // Reveal + counters
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach((n, i) => { n.style.transitionDelay = (i % 3) * .1 + 's'; io.observe(n); });
  setTimeout(() => $$('.reveal').forEach(n => n.classList.add('in')), 3000);
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const n = e.target, to = +n.dataset.count, suf = n.dataset.suffix || '', t0 = performance.now();
    const step = ts => {
      const p = Math.min((ts - t0) / 1500, 1);
      n.textContent = Math.floor(to * (1 - Math.pow(1 - p, 3))).toLocaleString('id-ID') + (p === 1 ? suf : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step); cio.unobserve(n);
  }));
  $$('[data-count]').forEach(n => cio.observe(n));

  // Jika gambar tidak ada (mis. folder img belum di-upload), tampilkan placeholder yang rapi
  const icons = { new: 'lucide:cake-slice', rec: 'lucide:cup-soda', sundae: 'lucide:ice-cream-cone', milktea: 'lucide:cup-soda', milkshake: 'lucide:glass-water', fresh: 'lucide:citrus', smoothies: 'lucide:glass-water', coffee: 'lucide:coffee' };
  $$('.dimg img').forEach(img => {
    const mark = () => {
      const box = img.parentElement; if (box.classList.contains('broken')) return;
      box.classList.add('broken'); console.warn('Gambar tidak ditemukan:', img.getAttribute('src'));
      const cd = img.closest('.dcard');
      box.insertAdjacentHTML('beforeend', `<div class="ph"><iconify-icon icon="${icons[cd.dataset.cat] || 'lucide:cup-soda'}"></iconify-icon><span>${cd.dataset.name}</span></div>`);
    };
    img.addEventListener('error', mark);
    if (img.complete && img.naturalWidth === 0) mark();
  });
  const heroPic = $('.hero-img > img');
  const heroFail = () => { heroPic.hidden = true; $('.hero-fallback').hidden = false; };
  heroPic.addEventListener('error', heroFail); if (heroPic.complete && heroPic.naturalWidth === 0) heroFail();
  const logoPic = $('.logo img');
  const logoFail = () => { $('.logo').innerHTML = '<span class="logo-text">WEDRINK</span>'; };
  logoPic.addEventListener('error', logoFail); if (logoPic.complete && logoPic.naturalWidth === 0) logoFail();

  // Tilt on cards
  $$('.dcard,.about-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  // Menu filter + search
  const cards = $$('.dcard'); let cat = 'all';
  const applyFilter = () => {
    const q = $('#search').value.trim().toLowerCase(); let n = 0;
    cards.forEach(cd => {
      const ok = (cat === 'all' || cd.dataset.cat === cat) && (!q || cd.textContent.toLowerCase().includes(q));
      cd.classList.toggle('hide', !ok); if (ok) n++;
    });
    $('#count').textContent = `Menampilkan ${n} menu`;
    $('#empty').hidden = n > 0;
  };
  $$('.tab').forEach(t => t.onclick = () => {
    $$('.tab').forEach(b => b.classList.remove('active')); t.classList.add('active'); cat = t.dataset.f; applyFilter();
  });
  $('#search').addEventListener('input', applyFilter); applyFilter();

  // Cart
  const items = {}; cards.forEach(cd => items[cd.dataset.id] = { name: cd.dataset.name, price: +cd.dataset.price, img: $('img', cd).getAttribute('src') });
  let cart = {}; try { cart = JSON.parse(localStorage.getItem('wd_cart') || '{}'); } catch (e) {}
  Object.keys(cart).forEach(k => { if (!items[k]) delete cart[k]; });
  const drawer = $('#drawer'), overlay = $('#overlay');
  const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); };
  const openDrawer = o => { drawer.classList.toggle('open', o); overlay.classList.toggle('show', o); };
  const summary = () => Object.entries(cart).map(([id, q]) => `${q}x ${items[id].name}`).join(', ');
  const total = () => Object.entries(cart).reduce((s, [id, q]) => s + items[id].price * q, 0);
  function render() {
    try { localStorage.setItem('wd_cart', JSON.stringify(cart)); } catch (e) {}
    const ids = Object.keys(cart), count = ids.reduce((s, id) => s + cart[id], 0);
    $('#cartCount').textContent = count;
    $('#drList').innerHTML = ids.length ? ids.map(id => `<div class="dr-item"><img src="${items[id].img}" alt=""><div class="dr-info"><h6>${items[id].name}</h6><small>${rp(items[id].price * cart[id])}</small></div><div class="qty"><button data-a="-" data-id="${id}" aria-label="Kurangi">−</button><b>${cart[id]}</b><button data-a="+" data-id="${id}" aria-label="Tambah">+</button></div></div>`).join('')
      : '<div class="dr-empty"><iconify-icon icon="lucide:shopping-bag"></iconify-icon><p>Keranjang masih kosong.<br>Tambahkan menu favoritmu!</p></div>';
    $('#drTotal').textContent = $('#fTotal').textContent = rp(total());
    if (ids.length) $('#fOrder').value = summary();
  }
  $$('.add').forEach(b => b.onclick = () => {
    const id = b.closest('.dcard').dataset.id; cart[id] = (cart[id] || 0) + 1; render();
    const bt = $('#cartBtn'); bt.classList.remove('bump'); void bt.offsetWidth; bt.classList.add('bump');
    b.classList.add('done'); b.innerHTML = '<iconify-icon icon="lucide:check"></iconify-icon>';
    setTimeout(() => { b.classList.remove('done'); b.innerHTML = '<iconify-icon icon="lucide:plus"></iconify-icon>'; }, 900);
    toast(`${items[id].name} ditambahkan`);
  });
  $('#drList').addEventListener('click', e => {
    const b = e.target.closest('button[data-id]'); if (!b) return;
    const id = b.dataset.id; cart[id] += b.dataset.a === '+' ? 1 : -1; if (cart[id] <= 0) delete cart[id]; render();
  });
  $('#cartBtn').onclick = () => openDrawer(true); $('#drawerClose').onclick = overlay.onclick = () => openDrawer(false);
  $('#clearCart').onclick = () => { cart = {}; $('#fOrder').value = ''; render(); };
  $('#toOrder').onclick = () => { openDrawer(false); $('#order').scrollIntoView({ behavior: 'smooth' }); };
  render();

  // Order form
  $('#orderForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target, btn = $('button[type=submit]', form), msgEl = $('#formMsg');
    const d = { nama: $('#fName').value, pesanan: $('#fOrder').value, total: rp(total()), telepon: $('#fPhone').value, alamat: $('#fAddr').value };
    const text = `Halo WEDRINK, saya ingin memesan:\nNama: ${d.nama}\nPesanan: ${d.pesanan}\nTotal: ${d.total}\nNo. Telepon: ${d.telepon}\nAlamat: ${d.alamat}`;
    if (!WA_NUMBER && !WEB3FORMS_KEY && !FORM_ENDPOINT) {
      msgEl.textContent = 'Mode demo: belum ada tujuan pesanan. Isi WA_NUMBER atau WEB3FORMS_KEY di js/script.js.'; return;
    }
    if (WA_NUMBER) window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank'); // dibuka dulu agar tidak diblokir browser
    let ok = !!WA_NUMBER;
    if (WEB3FORMS_KEY || FORM_ENDPOINT) {
      btn.disabled = true; msgEl.textContent = 'Mengirim pesanan...';
      try {
        const body = WEB3FORMS_KEY ? { access_key: WEB3FORMS_KEY, subject: 'Pesanan baru WEDRINK', from_name: 'Website WEDRINK', ...d } : { ...d, message: text };
        const r = await fetch(WEB3FORMS_KEY ? 'https://api.web3forms.com/submit' : FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
        ok = r.ok;
      } catch (err) { ok = false; }
      btn.disabled = false;
    }
    if (ok) {
      msgEl.textContent = `Terima kasih, ${d.nama}! Pesanan Anda sudah dikirim.`;
      cart = {}; render(); form.reset(); $('#fTotal').textContent = rp(0);
    } else msgEl.textContent = 'Pesanan gagal dikirim. Coba lagi atau hubungi kami langsung.';
  });
})();
