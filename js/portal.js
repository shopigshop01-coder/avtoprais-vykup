// АвтоПрайс Иркутск — портал автоцентра
const TG_TOKEN = '8153739647:AAECZ7n48MZhxySCm1MAvaKuNkSSyqTlPMQ';
const TG_CHAT_ID = '79950500600';
const PORTAL_BUYOUT_DISCOUNT = 0.05;
const PORTAL_IMPORT_MARKUP = 0.05;

const TRIM_MODIFIERS = {
  Standard: 1.0, G: 1.04, S: 1.06, Z: 1.1, Touring: 1.08,
  Premium: 1.12, Luxury: 1.18, Executive: 1.14, Sport: 1.1, Limited: 1.15
};

const COUNTRY_FACTOR = {
  japan: 0.52, korea: 0.58, china: 0.62, usa: 0.78, germany: 0.72
};

function fmt(n) {
  return (parseInt(n, 10) || 0).toLocaleString('ru-RU') + ' ₽';
}

function debounce(fn, ms) {
  let t;
  return function () { clearTimeout(t); t = setTimeout(fn, ms); };
}

// ===== HERO SLIDER =====
const HERO_AUTO_MS = 4500;

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let idx = 0;
  let timer = null;
  let busy = false;

  function goTo(i, fromUser = false) {
    if (busy && !fromUser) return;
    const next = (i + slides.length) % slides.length;
    if (next === idx && !fromUser) return;

    busy = true;
    slides[idx].classList.remove('active');
    dots[idx]?.classList.remove('active');
    idx = next;
    slides[idx].classList.add('active');
    dots[idx]?.classList.add('active');
    dots[idx]?.setAttribute('aria-current', 'true');
    dots.forEach((d, n) => { if (n !== idx) d.removeAttribute('aria-current'); });

    const cap = document.getElementById('slideCaption');
    if (cap && slides[idx].dataset.caption) cap.textContent = slides[idx].dataset.caption;

    setTimeout(() => { busy = false; }, 1200);
    if (fromUser) restartTimer();
  }

  function next() { goTo(idx + 1); }

  function restartTimer() {
    clearInterval(timer);
    timer = setInterval(next, HERO_AUTO_MS);
  }

  dots.forEach((d, i) => {
    d.type = 'button';
    d.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      goTo(i, true);
    });
  });

  const prev = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  prev?.addEventListener('click', e => { e.preventDefault(); goTo(idx - 1, true); });
  nextBtn?.addEventListener('click', e => { e.preventDefault(); goTo(idx + 1, true); });

  restartTimer();
}

// ===== NAV =====
function initNav() {
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('mobileNav');
  if (!burger || !menu) return;
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function initCalcTabs() {
  document.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      activateCalcPanel(tab.dataset.panel);
    });
  });
}

function activateCalcPanel(panelId) {
  if (!panelId) return;
  document.querySelectorAll('.calc-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.panel === panelId);
  });
  document.querySelectorAll('.calc-panel').forEach(p => {
    p.classList.toggle('active', p.id === panelId);
  });
  const calcSection = document.getElementById('calculators');
  if (calcSection) {
    calcSection.classList.toggle('focus-buyout', panelId === 'panelBuyout');
    calcSection.classList.toggle('focus-import', panelId === 'panelImport');
  }
}

function initServiceImages() {
  document.querySelectorAll('.svc-photo-img img').forEach(img => {
    img.addEventListener('error', () => {
      img.closest('.svc-photo-img')?.classList.add('img-fallback');
    }, { once: true });
  });
}

function initCalcParallax() {
  const section = document.getElementById('calculators');
  if (!section) return;
  const buyout = section.querySelector('[data-parallax="buyout"]');
  const imp = section.querySelector('[data-parallax="import"]');
  if (!buyout || !imp) return;

  let mx = 0, my = 0, raf = null;

  function apply() {
    raf = null;
    buyout.style.backgroundPosition = `calc(35% + ${mx * -18}px) calc(50% + ${my * -12}px)`;
    imp.style.backgroundPosition = `calc(65% + ${mx * 18}px) calc(50% + ${my * -12}px)`;
  }

  section.addEventListener('mousemove', e => {
    const r = section.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - 0.5;
    my = (e.clientY - r.top) / r.height - 0.5;
    if (!raf) raf = requestAnimationFrame(apply);
  }, { passive: true });

  section.addEventListener('mouseleave', () => {
    mx = 0; my = 0;
    if (!raf) raf = requestAnimationFrame(apply);
  });

  window.addEventListener('scroll', () => {
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.bottom < 0 || r.top > vh) return;
    const p = (vh - r.top) / (vh + r.height);
    const shift = (p - 0.5) * 30;
    buyout.style.backgroundPosition = `calc(35% + ${shift * -0.3}px) center`;
    imp.style.backgroundPosition = `calc(65% + ${shift * 0.3}px) center`;
  }, { passive: true });
}

function initSmoothScroll() {
  const navH = () => document.querySelector('.portal-nav')?.offsetHeight || 80;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navH() + 4;
      window.scrollTo({ top, behavior: 'smooth' });

      if (link.dataset.calcTab) {
        setTimeout(() => activateCalcPanel(link.dataset.calcTab), 400);
      }

      document.getElementById('navBurger')?.classList.remove('open');
      document.getElementById('mobileNav')?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

function estimateImportCarPrice() {
  const car = getFormCarData('p-imp-brand', 'p-imp-model');
  const year = parseInt(document.getElementById('p-imp-year')?.value, 10);
  const trim = document.getElementById('p-imp-trim')?.value || 'Standard';
  const country = document.getElementById('p-imp-country')?.value || 'japan';
  if (!car.brand || !car.model || !year || typeof calcMarketPrice !== 'function') return null;
  const { market } = calcMarketPrice(car.brand, car.model, year, 60000, 'хорошее');
  let price = market * (COUNTRY_FACTOR[country] || 0.6);
  price *= TRIM_MODIFIERS[trim] || 1;
  return Math.round(price / 10000) * 10000;
}

function syncImportPrice() {
  const priceEl = document.getElementById('p-imp-price');
  const est = estimateImportCarPrice();
  if (est && priceEl && !priceEl.dataset.manual) {
    priceEl.value = est;
  }
}

// ===== IMPORT CALC =====
function runPortalImportCalc() {
  const el = document.getElementById('portalImportResult');
  if (!el || typeof calcImportTotal !== 'function') return;

  syncImportPrice();
  const car = getFormCarData('p-imp-brand', 'p-imp-model');
  const trim = document.getElementById('p-imp-trim')?.value || 'Standard';
  const country = document.getElementById('p-imp-country')?.value;

  const raw = calcImportTotal({
    country: country,
    carPrice: document.getElementById('p-imp-price')?.value,
    engineVolume: document.getElementById('p-imp-volume')?.value,
    year: document.getElementById('p-imp-year')?.value
  });

  const finalTotal = Math.round(raw.total / 1000) * 1000;

  const carLine = car.brand && car.model
    ? car.brand + ' ' + car.model + (trim ? ', ' + trim : '')
    : '—';

  el.innerHTML =
    '<div class="result-row"><span>Автомобиль</span><strong>' + carLine + '</strong></div>' +
    '<div class="result-row"><span>Цена за рубежом</span><strong>' + fmt(raw.carPrice) + '</strong></div>' +
    '<div class="result-row"><span>Таможня + утиль + доставка + брокер</span><strong>' + fmt(raw.total - raw.carPrice) + '</strong></div>' +
    '<div class="result-total"><span>Итого под ключ</span><strong>' + fmt(finalTotal) + '</strong></div>' +
    '<p class="calc-note">Страна: ' + (raw.countryLabel || country) + '. Расчёт ориентировочный — точная сумма после подбора комплектации.</p>';
}

function initPortalImportCalc() {
  initCarAutocomplete('p-imp-brand', 'p-imp-model', 'p-imp-brand-list', 'p-imp-model-list');

  const priceEl = document.getElementById('p-imp-price');
  if (priceEl) {
    priceEl.addEventListener('input', () => { priceEl.dataset.manual = '1'; });
    priceEl.addEventListener('blur', () => {
      if (!priceEl.value) delete priceEl.dataset.manual;
    });
  }

  const fields = ['p-imp-brand', 'p-imp-model', 'p-imp-trim', 'p-imp-country', 'p-imp-year', 'p-imp-volume', 'p-imp-price'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const handler = () => {
      if (['p-imp-brand', 'p-imp-model', 'p-imp-trim', 'p-imp-country', 'p-imp-year'].includes(id) && priceEl) {
        delete priceEl.dataset.manual;
      }
      runPortalImportCalc();
    };
    el.addEventListener('change', handler);
    el.addEventListener('input', debounce(handler, 320));
  });
  runPortalImportCalc();
}

// ===== BUYOUT CALC =====
function runPortalBuyoutCalc() {
  const el = document.getElementById('portalBuyoutResult');
  if (!el || typeof calcMarketPrice !== 'function') return;
  const car = getFormCarData('p-ev-brand', 'p-ev-model');
  const year = document.getElementById('p-ev-year')?.value;
  const mileage = document.getElementById('p-ev-mileage')?.value;
  const condition = document.getElementById('p-ev-condition')?.value || 'хорошее';

  if (!car.brand || !car.model || !year) {
    el.innerHTML = '<p class="calc-note">Заполните марку, модель и год — расчёт обновится автоматически.</p>';
    return;
  }

  const { market } = calcMarketPrice(car.brand, car.model, year, mileage, condition);
  const buyout = Math.round(market * (1 - PORTAL_BUYOUT_DISCOUNT) / 5000) * 5000;

  el.innerHTML =
    '<div class="result-row"><span>Автомобиль</span><strong>' + car.brand + ' ' + car.model + ', ' + year + '</strong></div>' +
    '<div class="result-row"><span>Рыночная цена (Авито, Дром, Авто.ру)</span><strong>' + fmt(market) + '</strong></div>' +
    '<div class="result-total"><span>Оценка выкупа</span><strong>' + fmt(buyout) + '</strong></div>' +
    '<p class="calc-note">Предварительная оценка. Окончательная цена фиксируется при осмотре автомобиля специалистом в Иркутске.</p>';
}

function initPortalBuyoutCalc() {
  initCarAutocomplete('p-ev-brand', 'p-ev-model', 'p-brand-list', 'p-model-list');
  ['p-ev-brand', 'p-ev-model', 'p-ev-year', 'p-ev-mileage', 'p-ev-condition'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', debounce(runPortalBuyoutCalc, 280));
    el.addEventListener('change', runPortalBuyoutCalc);
  });
  runPortalBuyoutCalc();
}

function initPageDots() {
  const dots = document.querySelectorAll('.page-dots a');
  const sections = Array.from(dots).map(d => document.querySelector(d.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        dots.forEach(d => d.classList.toggle('active', d.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { threshold: 0.45 });
  sections.forEach(s => obs.observe(s));
}

function initFaq() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

function initFaqPanorama() {
  const layers = document.querySelectorAll('#faqPanorama .faq-pan-layer');
  const section = document.getElementById('faq');
  if (!layers.length || !section) return;

  let idx = 0;
  let timer;

  function goTo(i) {
    layers[idx]?.classList.remove('active');
    idx = (i + layers.length) % layers.length;
    layers[idx]?.classList.add('active');
  }

  function next() { goTo(idx + 1); }

  function restart() {
    clearInterval(timer);
    timer = setInterval(next, 5000);
  }

  restart();

  let mx = 0, my = 0, raf = null;
  function applyParallax() {
    raf = null;
    layers.forEach((layer, i) => {
      const depth = (i + 1) * 0.4;
      layer.style.backgroundPosition = `calc(50% + ${mx * depth * 20}px) calc(50% + ${my * depth * 12}px)`;
    });
  }

  section.addEventListener('mousemove', e => {
    const r = section.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - 0.5;
    my = (e.clientY - r.top) / r.height - 0.5;
    if (!raf) raf = requestAnimationFrame(applyParallax);
  }, { passive: true });

  section.addEventListener('mouseleave', () => {
    mx = 0; my = 0;
    if (!raf) raf = requestAnimationFrame(applyParallax);
  });
}

function initCookie() {
  const bar = document.getElementById('cookieBar');
  if (!bar || localStorage.getItem('ap_cookie_ok')) return;
  setTimeout(() => bar.classList.add('show'), 1400);
  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('ap_cookie_ok', '1');
    bar.classList.remove('show');
  });
}

function openModal(id) {
  document.getElementById(id)?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
  document.body.style.overflow = '';
}

function initModals() {
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openModal(btn.dataset.modal);
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
    overlay.querySelector('.modal-close')?.addEventListener('click', () => closeModal(overlay.id));
  });
}

async function sendToTelegram(text) {
  try {
    const r = await fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text: text })
    });
    return (await r.json()).ok === true;
  } catch (e) { return false; }
}

function initCallbackForm() {
  const form = document.getElementById('callbackForm');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const err = document.getElementById('callbackErr');
    const ok = document.getElementById('callbackOk');
    err.style.display = 'none';
    ok.style.display = 'none';
    const name = document.getElementById('cb-name').value.trim();
    const phone = document.getElementById('cb-phone').value.trim();
    const service = document.getElementById('cb-service').value;
    if (!document.getElementById('cb-consent').checked) {
      err.textContent = 'Необходимо согласие на обработку персональных данных (152-ФЗ)';
      err.style.display = 'block';
      return;
    }
    if (!phone) {
      err.textContent = 'Укажите телефон';
      err.style.display = 'block';
      return;
    }
    const msg = '📞 ЗАЯВКА — АвтоПрайс Иркутск\nИмя: ' + (name || '—') + '\nТел: ' + phone + '\nУслуга: ' + service + '\n⏰ ' + new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Irkutsk' });
    if (await sendToTelegram(msg)) {
      ok.style.display = 'block';
      form.reset();
      setTimeout(() => closeModal('modalCallback'), 2500);
    } else {
      window.open('https://wa.me/79950500600?text=' + encodeURIComponent('Заявка: ' + service + ', тел: ' + phone), '_blank');
      err.textContent = 'Telegram недоступен — открыли WhatsApp';
      err.style.display = 'block';
    }
  });
}

function initAudio() {
  const audio = document.getElementById('bgAudio');
  const btn = document.getElementById('audioToggle');
  if (!audio || !btn) return;

  const TARGET_VOL = 0.22;
  const NOTE_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>';
  const SPEAKER_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>';
  let fadeTimer = null;

  audio.volume = 0;

  function setPlaying(on) {
    btn.classList.toggle('playing', on);
    btn.innerHTML = on ? SPEAKER_SVG : NOTE_SVG;
    btn.title = on ? 'Выключить музыку' : 'Включить музыку';
  }

  function fadeIn() {
    clearInterval(fadeTimer);
    let v = 0;
    fadeTimer = setInterval(() => {
      v += 0.035;
      audio.volume = Math.min(v, TARGET_VOL);
      if (audio.volume >= TARGET_VOL) clearInterval(fadeTimer);
    }, 80);
  }

  function fadeOut(cb) {
    clearInterval(fadeTimer);
    fadeTimer = setInterval(() => {
      audio.volume = Math.max(0, audio.volume - 0.05);
      if (audio.volume <= 0) {
        clearInterval(fadeTimer);
        audio.pause();
        cb?.();
      }
    }, 60);
  }

  function playMusic() {
    audio.volume = 0;
    const playPromise = audio.play();
    if (!playPromise) return;
    playPromise.then(() => {
      fadeIn();
      setPlaying(true);
      btn.classList.remove('error');
    }).catch(() => {
      btn.classList.add('error');
      btn.title = 'Не удалось включить — нажмите ещё раз';
    });
  }

  btn.addEventListener('click', () => {
    if (audio.paused) playMusic();
    else fadeOut(() => setPlaying(false));
  });

  audio.addEventListener('error', () => {
    btn.classList.add('error');
    btn.title = 'Файл музыки не найден';
    setPlaying(false);
  });
}

function initCalcCarSliders() {
  document.querySelectorAll('.calc-car-slider').forEach(root => {
    const slides = root.querySelectorAll('.calc-car-slide');
    const dots = root.querySelectorAll('.calc-car-dots button');
    if (!slides.length) return;
    let idx = 0;
    let timer = null;

    function go(i) {
      slides[idx].classList.remove('active');
      dots[idx]?.classList.remove('active');
      idx = (i + slides.length) % slides.length;
      slides[idx].classList.add('active');
      dots[idx]?.classList.add('active');
    }

    root.querySelector('.calc-car-arrow.prev')?.addEventListener('click', () => { go(idx - 1); restart(); });
    root.querySelector('.calc-car-arrow.next')?.addEventListener('click', () => { go(idx + 1); restart(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { go(i); restart(); }));

    function restart() {
      clearInterval(timer);
      timer = setInterval(() => go(idx + 1), 4200);
    }
    restart();
  });
}

function initBgCarSliders() {
  document.querySelectorAll('.bg-car-slider').forEach(root => {
    const slides = root.querySelectorAll('.bg-car-slide');
    if (slides.length < 2) return;
    let idx = 0;
    const ms = parseInt(root.dataset.bgInterval, 10) || 5500;

    setInterval(() => {
      slides[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }, ms);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeroSlider();
  initBgCarSliders();
  initSmoothScroll();
  initPageDots();
  initReveal();
  initCalcTabs();
  initCalcParallax();
  initCalcCarSliders();
  initServiceImages();
  initPortalImportCalc();
  initPortalBuyoutCalc();
  initFaq();
  initFaqPanorama();
  initCookie();
  initModals();
  initCallbackForm();
  initAudio();
});

window.openModal = openModal;
window.closeModal = closeModal;
window.activateCalcPanel = activateCalcPanel;
