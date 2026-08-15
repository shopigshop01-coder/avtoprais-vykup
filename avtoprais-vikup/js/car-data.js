// База марок, моделей и рыночных цен РФ (Иркутск / Сибирь, 2025–2026)
const BUYOUT_DISCOUNT = 0.10; // минус 10% — быстрый выкуп

const CAR_CATALOG = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Land Cruiser Prado', 'Highlander', 'Alphard', 'Hilux', 'Fortuner', 'C-HR', 'Yaris'],
  Lexus: ['RX', 'LX', 'ES', 'NX', 'GX', 'IS'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5', 'X6', 'X7', '7 Series'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLE', 'GLC', 'S-Class', 'GLS'],
  Audi: ['A4', 'A6', 'Q5', 'Q7', 'Q8'],
  Volkswagen: ['Polo', 'Jetta', 'Tiguan', 'Passat', 'Touareg'],
  Kia: ['Rio', 'Cerato', 'Sportage', 'Sorento', 'K5', 'Seltos'],
  Hyundai: ['Solaris', 'Creta', 'Tucson', 'Santa Fe', 'Sonata', 'Elantra'],
  Nissan: ['Qashqai', 'X-Trail', 'Murano', 'Teana', 'Patrol', 'Juke'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit'],
  Mazda: ['3', '6', 'CX-5', 'CX-9'],
  Ford: ['Focus', 'Mondeo', 'Kuga', 'Explorer', 'Wildtrak'],
  Chevrolet: ['Cruze', 'Niva', 'Tahoe', 'Camaro'],
  Mitsubishi: ['Outlander', 'Pajero', 'L200', 'ASX'],
  Subaru: ['Forester', 'Outback', 'XV'],
  Suzuki: ['Vitara', 'Jimny', 'Swift', 'SX4'],
  Haval: ['Jolion', 'F7', 'Dargo', 'H9'],
  Chery: ['Tiggo 4', 'Tiggo 7 Pro', 'Tiggo 8'],
  Geely: ['Coolray', 'Atlas', 'Monjaro'],
  Lada: ['Vesta', 'Granta', 'Niva Travel', 'Largus', 'XRAY'],
  Renault: ['Logan', 'Duster', 'Kaptur', 'Arkana'],
  Skoda: ['Octavia', 'Rapid', 'Kodiaq', 'Karoq'],
  Volvo: ['XC60', 'XC90', 'S60'],
  Tesla: ['Model 3', 'Model Y', 'Model X']
};

// Рыночная цена NEW за год (руб), далее корректируется по году/пробегу/состоянию
const MARKET_ANCHORS = {
  'Toyota|Camry': { 2024: 3200000, 2023: 2900000, 2022: 2650000, 2021: 2400000, 2020: 2200000, 2019: 2100000, 2018: 2200000, 2017: 1950000, 2016: 1750000, 2015: 1550000, 2014: 1350000, 2012: 950000 },
  'Toyota|Corolla': { 2022: 2100000, 2020: 1750000, 2018: 1450000, 2016: 1150000, 2015: 980000, 2012: 720000 },
  'Toyota|RAV4': { 2023: 3800000, 2021: 2900000, 2019: 2400000, 2018: 2200000, 2017: 1950000 },
  'Toyota|Land Cruiser': { 2022: 8500000, 2020: 6200000, 2018: 4800000, 2015: 3200000 },
  'Toyota|Land Cruiser Prado': { 2022: 5500000, 2020: 4200000, 2018: 3500000, 2015: 2600000 },
  'Kia|Rio': { 2022: 1450000, 2020: 1150000, 2018: 920000, 2016: 780000, 2015: 720000 },
  'Kia|Sportage': { 2023: 2800000, 2021: 2200000, 2020: 1950000, 2018: 1650000 },
  'Hyundai|Solaris': { 2022: 1350000, 2020: 1050000, 2018: 880000, 2016: 720000 },
  'Hyundai|Creta': { 2023: 2200000, 2021: 1750000, 2019: 1450000 },
  'BMW|3 Series': { 2022: 4200000, 2020: 3200000, 2018: 2400000, 2017: 2100000, 2015: 1650000 },
  'BMW|X5': { 2023: 7200000, 2022: 6500000, 2021: 5800000, 2020: 5200000, 2019: 4500000, 2018: 3800000 },
  'Mercedes-Benz|GLE': { 2023: 7800000, 2022: 7200000, 2021: 6500000, 2020: 5800000 },
  'Mercedes-Benz|C-Class': { 2020: 3200000, 2018: 2400000, 2016: 1850000 },
  'Lexus|RX': { 2022: 5800000, 2020: 4500000, 2019: 3800000, 2018: 3200000 },
  'Volkswagen|Polo': { 2020: 1350000, 2018: 1100000, 2016: 880000 },
  'Lada|Vesta': { 2024: 1450000, 2022: 1150000, 2020: 950000, 2018: 780000 },
  'Lada|Granta': { 2022: 850000, 2020: 680000, 2018: 520000 },
  'Haval|Jolion': { 2024: 2100000, 2023: 1950000, 2022: 1750000 },
  'Tesla|Model 3': { 2023: 4200000, 2022: 3800000 }
};

// Сегменты для авто без точной записи в базе
const SEGMENT_BASE = {
  budget: 650000,
  compact: 1100000,
  mid: 1800000,
  business: 2800000,
  premium: 4500000,
  luxury: 7000000
};

const BRAND_SEGMENT = {
  Toyota: 'mid', Lexus: 'premium', BMW: 'premium', 'Mercedes-Benz': 'premium', Audi: 'premium',
  Volkswagen: 'compact', Kia: 'compact', Hyundai: 'compact', Nissan: 'mid', Honda: 'mid',
  Mazda: 'mid', Ford: 'mid', Chevrolet: 'compact', Mitsubishi: 'mid', Subaru: 'mid',
  Haval: 'compact', Chery: 'compact', Geely: 'compact', Lada: 'budget', Renault: 'budget',
  Skoda: 'compact', Volvo: 'premium', Tesla: 'premium'
};

const PREMIUM_MODELS = /x5|x7|gle|gls|q7|q8|land cruiser|prado|rx|lx|s-class|7 series|tahoe|model s/i;

const BRAND_ALIASES = {
  mercedes: 'Mercedes-Benz',
  'mercedes benz': 'Mercedes-Benz',
  'mercedes-benz': 'Mercedes-Benz',
  mb: 'Mercedes-Benz',
  vw: 'Volkswagen',
  volkswagen: 'Volkswagen',
  toyota: 'Toyota',
  nissan: 'Nissan',
  honda: 'Honda',
  hyundai: 'Hyundai',
  kia: 'Kia',
  bmw: 'BMW',
  audi: 'Audi',
  lexus: 'Lexus',
  lada: 'Lada',
  ваз: 'Lada',
  mazda: 'Mazda',
  ford: 'Ford',
  tesla: 'Tesla'
};

function resolveBrand(raw) {
  const s = (raw || '').trim();
  if (!s) return '';
  if (CAR_CATALOG[s]) return s;
  const lower = s.toLowerCase();
  if (BRAND_ALIASES[lower]) return BRAND_ALIASES[lower];
  for (const brand of Object.keys(CAR_CATALOG)) {
    if (brand.toLowerCase() === lower) return brand;
  }
  return s;
}

function resolveModel(brand, raw) {
  const s = (raw || '').trim();
  if (!s) return '';
  const resolvedBrand = resolveBrand(brand);
  const models = CAR_CATALOG[resolvedBrand];
  if (!models) return s;
  if (models.includes(s)) return s;
  const lower = s.toLowerCase();
  for (const m of models) {
    if (m.toLowerCase() === lower) return m;
  }
  return s;
}

function findMarketAnchor(brand, model) {
  const b = resolveBrand(brand);
  const m = resolveModel(b, model);
  const key = b + '|' + m;
  if (MARKET_ANCHORS[key]) return MARKET_ANCHORS[key];
  const target = (b + '|' + m).toLowerCase();
  for (const k of Object.keys(MARKET_ANCHORS)) {
    if (k.toLowerCase() === target) return MARKET_ANCHORS[k];
  }
  return null;
}

function normalizeKey(brand, model) {
  return resolveBrand(brand) + '|' + resolveModel(resolveBrand(brand), model);
}

function interpolatePrice(anchors, year) {
  const years = Object.keys(anchors).map(Number).sort((a, b) => a - b);
  if (anchors[year]) return anchors[year];
  if (year > years[years.length - 1]) {
    const last = years[years.length - 1];
    return Math.round(anchors[last] * Math.pow(1.04, year - last));
  }
  if (year < years[0]) {
    const first = years[0];
    return Math.round(anchors[first] * Math.pow(0.88, first - year));
  }
  let lower = years[0], upper = years[years.length - 1];
  for (let i = 0; i < years.length - 1; i++) {
    if (year >= years[i] && year <= years[i + 1]) {
      lower = years[i]; upper = years[i + 1]; break;
    }
  }
  const ratio = (year - lower) / (upper - lower);
  return Math.round(anchors[lower] + (anchors[upper] - anchors[lower]) * ratio);
}

function getSegmentBase(brand, model) {
  let seg = BRAND_SEGMENT[brand] || 'mid';
  if (PREMIUM_MODELS.test(model)) seg = seg === 'budget' || seg === 'compact' ? 'premium' : 'luxury';
  return SEGMENT_BASE[seg];
}

function calcMarketPrice(brand, model, year, mileage, condition) {
  const y = parseInt(year, 10) || 2018;
  const km = parseInt(String(mileage).replace(/\s/g, ''), 10);
  const resolvedBrand = resolveBrand(brand);
  const resolvedModel = resolveModel(resolvedBrand, model);
  const anchors = findMarketAnchor(brand, model);
  let market;

  if (anchors) {
    market = interpolatePrice(anchors, y);
  } else {
    const base = getSegmentBase(resolvedBrand, resolvedModel);
    const age = Math.max(0, 2026 - y);
    market = base * Math.pow(0.92, Math.min(age, 12));
    if (age > 12) market *= 0.85;
  }

  if (!isNaN(km) && km > 0) {
    const refKm = 90000;
    if (km > refKm) market *= Math.max(0.72, 1 - (km - refKm) / 350000 * 0.22);
    else if (km < 50000) market *= 1.04;
  }

  const condMap = {
    'отличное': 1.0,
    'хорошее': 0.96,
    'среднее': 0.85,
    'битое': 0.58,
    'не на ходу': 0.38
  };
  market *= condMap[condition] || 0.94;

  market = Math.round(market / 5000) * 5000;
  const buyout = Math.round(market * (1 - BUYOUT_DISCOUNT) / 5000) * 5000;

  return { market, buyout };
}

function populateModelDatalist(brandInputId, modelListId) {
  const brandInput = document.getElementById(brandInputId);
  const modelList = document.getElementById(modelListId);
  if (!modelList) return;
  modelList.innerHTML = '';
  const brand = resolveBrand(brandInput?.value || '');
  const models = CAR_CATALOG[brand];
  const addOption = (value) => {
    const opt = document.createElement('option');
    opt.value = value;
    modelList.appendChild(opt);
  };
  if (models && models.length) {
    models.forEach(addOption);
    return;
  }
  ['Camry', 'Corolla', 'RAV4', 'Solaris', 'Creta', 'Rio', 'Sportage', 'X5', '3 Series', 'C-Class', 'Qashqai', 'CR-V'].forEach(addOption);
}

function initCarAutocomplete(brandInputId, modelInputId, brandListId, modelListId) {
  const brandList = document.getElementById(brandListId);
  const brandInput = document.getElementById(brandInputId);
  const modelInput = document.getElementById(modelInputId);

  if (brandList) {
    brandList.innerHTML = '';
    Object.keys(CAR_CATALOG).sort().forEach(brand => {
      const opt = document.createElement('option');
      opt.value = brand;
      brandList.appendChild(opt);
    });
  }

  const refreshModels = () => populateModelDatalist(brandInputId, modelListId);
  if (brandInput) {
    brandInput.addEventListener('input', refreshModels);
    brandInput.addEventListener('change', refreshModels);
  }
  if (modelInput) {
    modelInput.addEventListener('focus', refreshModels);
  }
  refreshModels();
}

/** @deprecated use initCarAutocomplete */
function initCarDropdowns(brandId, modelId) {
  initCarAutocomplete(brandId, modelId, 'brand-list', 'model-list');
}

function getFormCarData(brandId, modelId) {
  const rawBrand = document.getElementById(brandId)?.value || '';
  const rawModel = document.getElementById(modelId)?.value || '';
  const brand = resolveBrand(rawBrand);
  const model = resolveModel(brand, rawModel);
  return { brand: brand || rawBrand.trim(), model: model || rawModel.trim() };
}
