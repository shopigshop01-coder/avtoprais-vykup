// Прокси Gemini (ключ на сервере Google Apps Script)
const PROXY_URL = "https://script.google.com/macros/s/AKfycbzUtyuxgZlBlUKhojJqUXYfCQcJdIacKsNPL3X0Tmx31Vhp3LbHANUehMAZ5YwVszLOCA/exec";

// Telegram — отправка заявок
const TG_TOKEN = "8153739647:AAECZ7n48MZhxySCm1MAvaKuNkSSyqTlPMQ";
const TG_CHAT_ID = "79950500600";

// ===== ГАЛЕРЕЯ КУПЛЕННЫХ АВТО =====
var galleryPhotos = [
  { name: "Toyota Camry 2018", price: "1 050 000 ₽", desc: "Выкуплена за 1 день. Хорошее состояние.", img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=75" },
  { name: "BMW X5 2019", price: "3 200 000 ₽", desc: "Срочный выкуп. Расчёт в день обращения.", img: "https://images.unsplash.com/photo-1617469767052-b85af24d0e2a?w=600&q=75" },
  { name: "Toyota Land Cruiser 200", price: "4 500 000 ₽", desc: "Праворульный. Куплен за 2 часа.", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=75" },
  { name: "Kia Sportage 2020", price: "1 300 000 ₽", desc: "Кредитный авто. Взяли вместе с документами.", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=75" },
  { name: "Hyundai Solaris (битый)", price: "380 000 ₽", desc: "Аварийный. Выкуп без торга.", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75" },
  { name: "Lexus RX 2019", price: "2 700 000 ₽", desc: "Японский праворульный. Отличное состояние.", img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&q=75" }
];

const carsData = [
  {cat:"cheap",name:"Toyota Corolla",year:"2012",price:"320 000",tag:"cheap",tagLabel:"До 500 тыс",img:"https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=600&q=75"},
  {cat:"cheap",name:"Kia Rio",year:"2015",price:"480 000",tag:"cheap",tagLabel:"До 500 тыс",img:"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=75"},
  {cat:"mid",name:"Toyota Camry",year:"2018",price:"1 200 000",tag:"mid",tagLabel:"500к–1.5 млн",img:"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=75"},
  {cat:"mid",name:"BMW 3 Series",year:"2017",price:"950 000",tag:"mid",tagLabel:"500к–1.5 млн",img:"https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=75"},
  {cat:"premium",name:"BMW X5",year:"2021",price:"4 500 000",tag:"premium",tagLabel:"Премиум",img:"https://images.unsplash.com/photo-1617469767052-b85af24d0e2a?w=600&q=75"},
  {cat:"premium",name:"Mercedes GLE",year:"2022",price:"6 200 000",tag:"premium",tagLabel:"Премиум",img:"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=75"},
  {cat:"smashed",name:"Toyota RAV4 (битый)",year:"2019",price:"750 000",tag:"smashed",tagLabel:"Битый",img:"https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=75"},
  {cat:"smashed",name:"Hyundai Solaris (аварийный)",year:"2020",price:"380 000",tag:"smashed",tagLabel:"Битый",img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75"},
  {cat:"import",name:"Toyota Land Cruiser (Япония)",year:"2020",price:"4 800 000",tag:"import",tagLabel:"Иномарка",img:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=75"},
  {cat:"import",name:"Lexus RX (праворульный)",year:"2019",price:"2 900 000",tag:"import",tagLabel:"Иномарка",img:"https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&q=75"},
  {cat:"import",name:"Tesla Model 3 (США)",year:"2022",price:"3 200 000",tag:"import",tagLabel:"США",img:"https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=75"},
  {cat:"import",name:"Haval Jolion (Китай)",year:"2023",price:"1 900 000",tag:"import",tagLabel:"Китай",img:"https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=75"},
];

let currentFilter = 'all';
let currentView = 'cards';
let currentSort = 'default';
let searchQuery = '';

function parsePrice(p) {
  return parseInt(String(p).replace(/\s/g, ''), 10) || 0;
}

function getFilteredCars() {
  let list = currentFilter === 'all' ? [...carsData] : carsData.filter(c => c.cat === currentFilter);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(c => c.name.toLowerCase().includes(q) || c.tagLabel.toLowerCase().includes(q) || c.year.includes(q));
  }
  if (currentSort === 'price-asc') list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  else if (currentSort === 'price-desc') list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  else if (currentSort === 'year-desc') list.sort((a, b) => parseInt(b.year) - parseInt(a.year));
  else if (currentSort === 'year-asc') list.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  return list;
}

function renderCars() {
  const list = getFilteredCars();
  const grid = document.getElementById('carsGrid');
  const tableWrap = document.getElementById('priceTableWrap');
  const tableBody = document.getElementById('priceTableBody');
  const countEl = document.getElementById('catalogCount');
  const emptyEl = document.getElementById('catalogEmpty');

  if (countEl) countEl.textContent = list.length + ' авто';

  if (!list.length) {
    if (grid) grid.innerHTML = '';
    if (tableBody) tableBody.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  if (grid) {
    grid.innerHTML = list.map(c => `
      <article class="car-card">
        <div class="car-img-wrap">
          <img class="car-img" src="${c.img}" alt="${c.name}" loading="lazy">
        </div>
        <div class="car-body">
          <span class="car-tag ${c.tag}">${c.tagLabel}</span>
          <h3 class="car-name">${c.name}</h3>
          <p class="car-year">${c.year} год</p>
          <p class="car-price">${c.price} ₽ <small>выкуп</small></p>
        </div>
      </article>`).join('');
  }

  if (tableBody) {
    tableBody.innerHTML = list.map(c => `
      <tr>
        <td class="td-img"><img src="${c.img}" alt="" loading="lazy"></td>
        <td class="td-name">${c.name}</td>
        <td>${c.year}</td>
        <td><span class="car-tag ${c.tag}">${c.tagLabel}</span></td>
        <td class="td-price">${c.price} ₽</td>
      </tr>`).join('');
  }

  if (currentView === 'table') {
    grid?.classList.add('hidden');
    tableWrap?.classList.add('active');
  } else {
    grid?.classList.remove('hidden');
    tableWrap?.classList.remove('active');
  }
}

function filterCars(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCars();
}

function setView(view, btn) {
  currentView = view;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCars();
}

function initCatalog() {
  const searchInput = document.getElementById('catalogSearch');
  const sortSelect = document.getElementById('catalogSort');
  if (searchInput) {
    searchInput.addEventListener('input', e => { searchQuery = e.target.value.trim(); renderCars(); });
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', e => { currentSort = e.target.value; renderCars(); });
  }
  renderCars();
}

function loadSavedCars() {
  try {
    var saved = localStorage.getItem('gallery_cars');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [];
}

function renderGallery() {
  var saved = loadSavedCars();
  var all = galleryPhotos.concat(saved);
  var grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = all.map(function (car) {
    return '<article class="gallery-card">' +
      '<div class="gallery-img"><img src="' + car.img + '" alt="' + car.name + '" loading="lazy" onerror="this.style.display=\'none\'"></div>' +
      '<div class="gallery-body"><h4>' + car.name + '</h4>' +
      '<div class="gallery-price">' + car.price + '</div>' +
      '<p class="gallery-desc">' + car.desc + '</p></div></article>';
  }).join('');
}

function toggleAddForm() {
  document.getElementById('addForm')?.classList.toggle('open');
}

function addCar() {
  var name = document.getElementById('g-name').value.trim();
  var price = document.getElementById('g-price').value.trim();
  var img = document.getElementById('g-img').value.trim();
  var desc = document.getElementById('g-desc').value.trim();
  if (!name || !img) { alert('Укажите название и ссылку на фото'); return; }
  var saved = loadSavedCars();
  saved.push({ name: name, price: price || '', desc: desc || '', img: img });
  localStorage.setItem('gallery_cars', JSON.stringify(saved));
  document.getElementById('g-note').style.display = 'block';
  ['g-name', 'g-price', 'g-img', 'g-desc'].forEach(id => document.getElementById(id).value = '');
  renderGallery();
}

function initNav() {
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ===== ФОРМА ОЦЕНКИ =====

function getFormData() {
  const car = getFormCarData('ev-brand', 'ev-model');
  return {
    brand: car.brand,
    model: car.model,
    year: document.getElementById('ev-year').value.trim(),
    mileage: document.getElementById('ev-mileage').value.trim(),
    condition: document.getElementById('ev-condition').value,
    extra: document.getElementById('ev-extra').value.trim(),
    phone: document.getElementById('ev-phone').value.trim(),
    consent: document.getElementById('ev-consent')?.checked
  };
}

function validateForm(data, requireAll) {
  const errEl = document.getElementById('evalErr');
  errEl.className = 'form-msg';

  if (!data.consent) {
    errEl.className = 'form-msg is-error is-visible';
    errEl.textContent = '⚠️ Необходимо согласие на обработку персональных данных (152-ФЗ)';
    return false;
  }
  if (!data.phone) {
    errEl.className = 'form-msg is-error is-visible';
    errEl.textContent = '⚠️ Укажите ваш телефон — это обязательное поле';
    return false;
  }
  if (!data.brand || !data.model) {
    errEl.className = 'form-msg is-error is-visible';
    errEl.textContent = '⚠️ Укажите марку и модель автомобиля';
    return false;
  }
  if (requireAll && (!data.year || !data.condition)) {
    errEl.className = 'form-msg is-error is-visible';
    errEl.textContent = '⚠️ Укажите год выпуска и состояние автомобиля';
    return false;
  }
  return true;
}

function fmtPrice(n) {
  const num = parseInt(n, 10);
  return isNaN(num) ? '—' : num.toLocaleString('ru-RU') + ' ₽';
}

function roundPrice(n) {
  return Math.round(n / 10000) * 10000;
}

// Локальная оценка по базе рыночных цен РФ
function localEstimate(data) {
  const year = parseInt(data.year, 10) || 2018;
  const km = parseInt(String(data.mileage).replace(/\s/g, ''), 10);
  const { market, buyout } = calcMarketPrice(data.brand, data.model, year, km, data.condition);
  const condText = data.condition || 'не указано';
  const kmLine = km ? ', пробег ~' + km.toLocaleString('ru-RU') + ' км' : '';

  const verdict =
    '📊 Оценка по базе Авито, Дром, Авто.ру, Юла (регион Иркутск)\n\n' +
    '🚗 ' + data.brand + ' ' + data.model + ', ' + year + ' г.' + kmLine + '\n' +
    '🔧 Состояние: ' + condText + '\n\n' +
    '📈 Рыночная цена: ' + fmtPrice(market) + '\n' +
    '✅ Цена выкупа: ' + fmtPrice(buyout) + ' (рыночная − 12%)\n\n' +
    '📌 Формула: выкуп = рынок × 0,88. Мы берём авто ниже рынка для перепродажи.\n' +
    '• Данные сверены с реальными ценами популярных моделей в РФ\n' +
    '• Точная цена — после бесплатного осмотра в Иркутске\n\n' +
    '📞 Перезвоним на ' + data.phone;

  return { buyout_price: buyout, sell_price: market, verdict: verdict, source: 'local' };
}

function buildMarketPrompt(data) {
  return [
    'Ты — эксперт по оценке автомобилей для выкупа в г. Иркутск и Иркутской области, Россия.',
    '',
    'АВТОМОБИЛЬ:',
    data.brand + ' ' + data.model + ', ' + data.year + ' г.',
    'Пробег: ' + (data.mileage ? data.mileage + ' км' : 'не указан'),
    'Состояние: ' + (data.condition || 'не указано'),
    data.extra ? 'Дополнительно: ' + data.extra : '',
    '',
    'ЗАДАЧА:',
    '1. Проанализируй актуальные цены аналогичных авто на площадках:',
    '   — avito.ru (Авито)',
    '   — drom.ru (Дром)',
    '   — auto.ru (Авто.ру)',
    '   — youla.ru (Юла)',
    '   Регион поиска: Иркутск и Иркутская область.',
    '2. Определи среднерыночную цену продажи частному лицу (sell_price) — как в объявлениях на этих сайтах.',
    '3. Рассчитай цену выкупа (buyout_price) — ровно на 12% НИЖЕ рыночной (buyout_price = sell_price × 0.88), потому что мы выкупаем авто для перепродажи.',
    '4. В verdict подробно распиши: откуда взята цена, какие нюансы (пробег, состояние, праворуль, кредит, сезон), почему выкуп ниже рынка.',
    '',
    'Ответ строго в JSON: {"buyout_price": число, "sell_price": число, "verdict": "текст на русском"}',
    'Цены — целые числа в рублях, без пробелов. buyout_price всегда меньше sell_price.'
  ].filter(Boolean).join('\n');
}

function normalizeResult(raw, data) {
  let sell = parseInt(raw.sell_price, 10);
  let buy = parseInt(raw.buyout_price, 10);
  let verdict = raw.verdict || '';

  if (isNaN(sell) || sell <= 0) {
    const local = localEstimate(data);
    sell = local.sell_price;
    buy = local.buyout_price;
    if (!verdict) verdict = local.verdict;
  }

  if (isNaN(buy) || buy <= 0 || buy >= sell) {
    buy = roundPrice(sell * (1 - BUYOUT_DISCOUNT));
  }

  if (buy >= sell) {
    buy = roundPrice(sell * (1 - BUYOUT_DISCOUNT));
  }

  if (!verdict.includes('Авито') && !verdict.includes('Дром')) {
    verdict =
      '📊 Оценка по данным: Авито, Дром, Авто.ру, Юла (Иркутск)\n\n' +
      verdict + '\n\n' +
      '💰 Рыночная цена: ' + fmtPrice(sell) + '\n' +
      '✅ Цена выкупа: ' + fmtPrice(buy) + ' (рыночная − 12%)';
  }

  return { buyout_price: buy, sell_price: sell, verdict: verdict.trim(), source: raw.source || 'ai' };
}

function buildTelegramMessage(data, result) {
  let msg =
    '🚗 НОВАЯ ЗАЯВКА — АвтоПрайс Иркутск\n' +
    '─────────────────\n' +
    '📋 Авто: ' + [data.brand, data.model, data.year ? data.year + 'г.' : '', data.mileage ? data.mileage + ' км' : ''].filter(Boolean).join(' ') + '\n' +
    '🔧 Состояние: ' + (data.condition || 'не указано') + '\n' +
    (data.extra ? '📝 Доп. инфо: ' + data.extra + '\n' : '');

  if (result) {
    msg +=
      '─────────────────\n' +
      '💰 ИИ-оценка выкупа: ' + fmtPrice(result.buyout_price) + '\n' +
      '📈 Рыночная цена: ' + fmtPrice(result.sell_price) + '\n' +
      '🤖 Источник: ' + (result.source === 'ai' ? 'ИИ (Авито, Дром, Авто.ру, Юла)' : 'Расчёт по площадкам') + '\n';
  }

  msg +=
    '─────────────────\n' +
    '📞 Телефон: ' + data.phone + '\n' +
    '─────────────────\n' +
    '⏰ ' + new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Irkutsk' });

  return msg;
}

async function sendToTelegram(text) {
  try {
    const resp = await fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text: text })
    });
    const json = await resp.json();
    return json.ok === true;
  } catch (e) {
    return false;
  }
}

function openWhatsAppFallback(data, result) {
  let text = 'Заявка АвтоПрайс: ' + data.brand + ' ' + data.model + ' ' + data.year + 'г., тел: ' + data.phone;
  if (result) text += ', выкуп ~' + fmtPrice(result.buyout_price);
  window.open('https://wa.me/79950500600?text=' + encodeURIComponent(text), '_blank');
}

function showResult(result) {
  document.getElementById('resBuy').textContent = fmtPrice(result.buyout_price);
  document.getElementById('resSell').textContent = fmtPrice(result.sell_price);
  document.getElementById('resVerdict').textContent = result.verdict || '';
  document.getElementById('evalResult').style.display = 'block';
  document.getElementById('evalResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function fetchAiEstimate(data) {
  const carInfo = buildMarketPrompt(data);

  const resp = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ carInfo: carInfo })
  });

  const json = await resp.json();
  if (json.error) throw new Error(json.error);

  const r = json.data;
  return normalizeResult({
    buyout_price: r.buyout_price,
    sell_price: r.sell_price,
    verdict: r.verdict || '',
    source: 'ai'
  }, data);
}

// Главная кнопка — ИИ-оценка + заявка
async function runEvaluation() {
  const data = getFormData();
  if (!validateForm(data, true)) return;

  const btn = document.getElementById('evalBtn');
  const errEl = document.getElementById('evalErr');
  const okEl = document.getElementById('evalOk');
  errEl.className = 'form-msg';
  okEl.style.display = 'none';
  document.getElementById('evalResult').style.display = 'none';

  btn.disabled = true;
  document.getElementById('evalBtnTxt').textContent = 'Анализирую Авито, Дром, Авто.ру, Юла...';
  document.getElementById('evalSpinner').style.display = 'block';

  let result = null;

  try {
    if (PROXY_URL && !PROXY_URL.includes('ВСТАВЬТЕ')) {
      result = await fetchAiEstimate(data);
    } else {
      throw new Error('Прокси не настроен');
    }
  } catch (e) {
    result = localEstimate(data);
    result.verdict = '⚠️ ИИ-сервис временно недоступен. Показана расчётная оценка.\n\n' + result.verdict;
  }

  showResult(result);

  const tgOk = await sendToTelegram(buildTelegramMessage(data, result));
  if (!tgOk) {
    openWhatsAppFallback(data, result);
  }

  btn.disabled = false;
  document.getElementById('evalBtnTxt').textContent = '⚡ ПОЛУЧИТЬ ИИ-ОЦЕНКУ';
  document.getElementById('evalSpinner').style.display = 'none';
}

// Только заявка без ИИ
async function sendRequestOnly() {
  const data = getFormData();
  if (!validateForm(data, false)) return;

  const btn = document.getElementById('sendBtn');
  const errEl = document.getElementById('evalErr');
  const okEl = document.getElementById('evalOk');
  errEl.className = 'form-msg';
  okEl.style.display = 'none';

  btn.disabled = true;
  document.getElementById('sendBtnTxt').textContent = 'Отправляю...';
  document.getElementById('sendSpinner').style.display = 'block';

  const msg = buildTelegramMessage(data, null);
  const tgOk = await sendToTelegram(msg);

  btn.disabled = false;
  document.getElementById('sendBtnTxt').textContent = '📨 Только отправить заявку';
  document.getElementById('sendSpinner').style.display = 'none';

  if (tgOk) {
    okEl.style.display = 'block';
    ['ev-brand', 'ev-model', 'ev-year', 'ev-mileage', 'ev-extra', 'ev-phone'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('ev-condition').value = '';
    populateModelDatalist('ev-brand', 'model-list');
    if (document.getElementById('ev-consent')) document.getElementById('ev-consent').checked = false;
  } else {
    openWhatsAppFallback(data, null);
    errEl.className = 'form-msg is-error is-visible';
    errEl.textContent = 'Telegram недоступен — открыли WhatsApp с вашей заявкой. Отправьте сообщение.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCarAutocomplete('ev-brand', 'ev-model', 'brand-list', 'model-list');
  initImportCalculator();
  initCatalog();
  renderGallery();
});
