(function () {
  const burger = document.getElementById('bbBurger');
  const nav = document.getElementById('bbNav');
  if (burger && nav) {
    burger.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  const form = document.getElementById('bbForm');
  const ok = document.getElementById('bbFormOk');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const phone = String(data.phone || '').replace(/\D/g, '');
    if (phone.length < 10) {
      alert('Укажите корректный телефон');
      return;
    }

    const text = [
      'Заявка на выкуп авто (АвтоПрайс)',
      'Марка: ' + (data.brand || '—'),
      'Модель: ' + (data.model || '—'),
      'Год: ' + (data.year || '—'),
      'Пробег: ' + (data.mileage || '—'),
      'Состояние: ' + (data.condition || '—'),
      'Телефон: ' + (data.phone || '—'),
      'Комментарий: ' + (data.comment || '—')
    ].join('\n');

    window.open('https://wa.me/79950500600?text=' + encodeURIComponent(text), '_blank');
    if (ok) ok.hidden = false;
    form.reset();
  });
})();
