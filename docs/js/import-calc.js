// Калькулятор привоза авто под заказ в Иркутск
const EUR_RATE = 103;
const USD_RATE = 95;

const DELIVERY_IRKUTSK = {
  japan: 185000,
  korea: 145000,
  china: 95000,
  usa: 420000,
  germany: 380000
};

const COUNTRY_LABELS = {
  japan: '🇯🇵 Япония',
  korea: '🇰🇷 Южная Корея',
  china: '🇨🇳 Китай',
  usa: '🇺🇸 США',
  germany: '🇩🇪 Германия'
};

// Пошлина для физлиц, авто старше 3 лет — €/см³ (упрощённо по ТС ЕАЭС)
function customsDutyEurPerCc(volumeCc, ageYears) {
  const v = parseInt(volumeCc, 10) || 2000;
  if (v <= 1000) return ageYears <= 5 ? 1.5 : 3.0;
  if (v <= 1500) return ageYears <= 5 ? 1.7 : 3.2;
  if (v <= 1800) return ageYears <= 5 ? 2.5 : 3.5;
  if (v <= 2300) return ageYears <= 5 ? 2.7 : 4.0;
  if (v <= 3000) return ageYears <= 5 ? 3.0 : 5.0;
  return ageYears <= 5 ? 3.6 : 5.7;
}

function customsDutyYoung(carPriceRub, volumeCc) {
  const v = parseInt(volumeCc, 10) || 2000;
  const minEurPerCc = v <= 2800 ? 0.36 : 0.44;
  const minRub = minEurPerCc * v * EUR_RATE;
  const percent = carPriceRub * 0.15;
  return Math.max(percent, minRub);
}

function calcCustomsDuty(carPriceRub, volumeCc, year) {
  const age = Math.max(0, 2026 - parseInt(year, 10));
  const price = parseInt(carPriceRub, 10) || 0;
  if (age <= 3) return Math.round(customsDutyYoung(price, volumeCc));
  const rate = customsDutyEurPerCc(volumeCc, age);
  return Math.round(rate * volumeCc * EUR_RATE);
}

// Утилизационный сбор — физлица, льготный (базовая ставка × коэффициент объёма/года)
function calcRecyclingFee(volumeCc, year) {
  const v = parseInt(volumeCc, 10) || 2000;
  const age = Math.max(0, 2026 - parseInt(year, 10));
  let base = 3400;
  if (v > 3000) base = 5200;
  else if (v > 2000) base = 4200;
  else if (v > 1000) base = 3600;
  const ageCoef = age <= 3 ? 1.0 : age <= 7 ? 1.15 : 1.35;
  return Math.round(base * ageCoef);
}

function calcImportTotal(params) {
  const country = params.country || 'japan';
  const carPrice = parseInt(params.carPrice, 10) || 0;
  const volume = parseInt(params.engineVolume, 10) || 2000;
  const year = parseInt(params.year, 10) || 2019;
  const delivery = DELIVERY_IRKUTSK[country] || 150000;
  const customs = calcCustomsDuty(carPrice, volume, year);
  const recycling = calcRecyclingFee(volume, year);
  const broker = 45000;
  const total = carPrice + customs + recycling + delivery + broker;

  return {
    carPrice,
    customs,
    recycling,
    delivery,
    broker,
    total,
    countryLabel: COUNTRY_LABELS[country] || country
  };
}

function renderImportResult(result) {
  const el = document.getElementById('importCalcResult');
  if (!el) return;
  el.innerHTML =
    '<div class="import-result-grid">' +
    '<div class="import-result-row"><span>Цена авто за рубежом</span><strong>' + fmtImport(result.carPrice) + '</strong></div>' +
    '<div class="import-result-row"><span>Таможенная пошлина РФ</span><strong>' + fmtImport(result.customs) + '</strong></div>' +
    '<div class="import-result-row"><span>Утилизационный сбор</span><strong>' + fmtImport(result.recycling) + '</strong></div>' +
    '<div class="import-result-row"><span>Доставка до Иркутска</span><strong>' + fmtImport(result.delivery) + '</strong></div>' +
    '<div class="import-result-row"><span>Оформление / брокер</span><strong>' + fmtImport(result.broker) + '</strong></div>' +
    '<div class="import-result-row import-result-total"><span>Итого под ключ в Иркутске</span><strong>' + fmtImport(result.total) + '</strong></div>' +
    '</div>' +
    '<p class="import-result-note">* Расчёт ориентировочный. Точная сумма зависит от курса EUR, таможенной стоимости и класса авто. Позвоните — рассчитаем бесплатно.</p>';
  el.style.display = 'block';
}

function fmtImport(n) {
  return (parseInt(n, 10) || 0).toLocaleString('ru-RU') + ' ₽';
}

function runImportCalc() {
  const result = calcImportTotal({
    country: document.getElementById('imp-country')?.value,
    carPrice: document.getElementById('imp-price')?.value,
    engineVolume: document.getElementById('imp-volume')?.value,
    year: document.getElementById('imp-year')?.value
  });
  renderImportResult(result);
}

function initImportCalculator() {
  const btn = document.getElementById('impCalcBtn');
  if (btn) btn.addEventListener('click', runImportCalc);
  ['imp-country', 'imp-price', 'imp-volume', 'imp-year'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', runImportCalc);
    if (el && el.tagName === 'INPUT') el.addEventListener('input', debounceImport(runImportCalc, 400));
  });
  runImportCalc();
}

function debounceImport(fn, ms) {
  let t;
  return function () { clearTimeout(t); t = setTimeout(fn, ms); };
}
