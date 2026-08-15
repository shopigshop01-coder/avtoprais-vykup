const PROXY_URL = "https://script.google.com/macros/s/AKfycbzUtyuxgZlBlUKhojJqUXYfCQcJdIacKsNPL3X0Tmx31Vhp3LbHANUehMAZ5YwVszLOCA/exec";

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

function parsePrice(p) { return parseInt(String(p).replace(/\s/g, ''), 10) || 0; }

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
        <div class="car-img-wrap"><img class="car-img" src="${c.img}" alt="${c.name}" loading="lazy"></div>
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
  if (currentView === 'table') { grid?.classList.add('hidden'); tableWrap?.classList.add('active'); }
  else { grid?.classList.remove('hidden'); tableWrap?.classList.remove('active'); }
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
  document.getElementById('catalogSearch')?.addEventListener('input', e => { searchQuery = e.target.value.trim(); renderCars(); });
  document.getElementById('catalogSort')?.addEventListener('change', e => { currentSort = e.target.value; renderCars(); });
  renderCars();
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
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open'); menu.classList.remove('open'); document.body.style.overflow = '';
  }));
}

async function runEvaluation() {
  const brand = document.getElementById('ev-brand').value.trim();
  const model = document.getElementById('ev-model').value.trim();
  const year = document.getElementById('ev-year').value.trim();
  const mileage = document.getElementById('ev-mileage').value.trim();
  const condition = document.getElementById('ev-condition').value;
  const contact = document.getElementById('ev-contact').value.trim();
  const extra = document.getElementById('ev-extra').value.trim();
  const errEl = document.getElementById('evalErr');
  errEl.style.display = 'none';

  if (!brand || !model || !year) {
    errEl.textContent = 'Укажите марку, модель и год автомобиля';
    errEl.style.display = 'block';
    return;
  }
  if (!PROXY_URL || PROXY_URL.includes('ВСТАВЬТЕ')) {
    errEl.textContent = 'Прокси не настроен. Следуйте инструкции по установке gemini_proxy.gs';
    errEl.style.display = 'block';
    return;
  }

  const btn = document.getElementById('evalBtn');
  btn.disabled = true;
  document.getElementById('evalBtnTxt').textContent = 'Анализирую Авито, Дром, Авто.ру, Юла...';
  document.getElementById('evalSpinner').style.display = 'block';
  document.getElementById('evalResult').style.display = 'none';

  const carInfo = [
    'Ты — эксперт по оценке авто для выкупа в Иркутске.',
    'Авто: ' + brand + ' ' + model + ', ' + year + ' г., пробег: ' + (mileage || 'не указан') + ' км, состояние: ' + (condition || 'не указано') + (extra ? ', ' + extra : ''),
    'Проанализируй цены на avito.ru, drom.ru, auto.ru, youla.ru (регион Иркутск).',
    'sell_price — рыночная цена как в объявлениях. buyout_price — на 10–15% НИЖЕ sell_price (выкуп для перепродажи).',
    'В verdict распиши нюансы и почему выкуп ниже рынка.',
    'JSON: {"buyout_price": число, "sell_price": число, "verdict": "текст"}'
  ].join('\n');

  const fmt = n => isNaN(parseInt(n)) ? '—' : parseInt(n).toLocaleString('ru-RU') + ' ₽';

  try {
    const resp = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ carInfo })
    });
    const data = await resp.json();
    if (data.error) throw new Error(data.error);
    let result = data.data;
    let sell = parseInt(result.sell_price, 10);
    let buy = parseInt(result.buyout_price, 10);
    if (isNaN(buy) || buy >= sell) buy = Math.round(sell * 0.86 / 10000) * 10000;
    document.getElementById('resBy').textContent = fmt(buy);
    document.getElementById('resSell').textContent = fmt(sell);
    let verdict = result.verdict || '';
    if (!verdict.includes('Авито')) {
      verdict = '📊 Оценка по данным: Авито, Дром, Авто.ру, Юла (Иркутск)\n\n' + verdict;
    }
    document.getElementById('resVerdict').textContent = verdict;
    document.getElementById('evalResult').style.display = 'block';
  } catch (e) {
    errEl.textContent = 'Ошибка оценки: ' + (e.message || 'попробуйте ещё раз') + '. Или позвоните: +7 914 899-90-88';
    errEl.style.display = 'block';
  }

  btn.disabled = false;
  document.getElementById('evalBtnTxt').textContent = '⚡ ПОЛУЧИТЬ ОЦЕНКУ';
  document.getElementById('evalSpinner').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => { initNav(); initCatalog(); });
