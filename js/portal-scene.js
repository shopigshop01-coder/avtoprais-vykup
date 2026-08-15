// Живая анимированная сцена — дилерский центр АвтоПрайс Иркутск
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, t = 0;
  const cars = [];
  const people = [];
  const particles = [];

  function resize() {
    w = canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
    h = canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    canvas._cw = canvas.offsetWidth;
    canvas._ch = canvas.offsetHeight;
  }

  function initEntities() {
    cars.length = 0;
    people.length = 0;
    particles.length = 0;
    const cw = canvas._cw;
    const ch = canvas._ch;
    for (let i = 0; i < 5; i++) {
      cars.push({
        x: Math.random() * cw,
        y: ch * 0.72 + Math.random() * 20,
        speed: 0.4 + Math.random() * 0.8,
        dir: Math.random() > 0.5 ? 1 : -1,
        color: ['#e63946', '#2c3e50', '#34495e', '#c1121f', '#1a1a22'][i % 5],
        w: 44 + Math.random() * 20,
        tow: i === 0
      });
    }
    for (let i = 0; i < 6; i++) {
      people.push({
        x: cw * 0.35 + Math.random() * cw * 0.35,
        y: ch * 0.62 + Math.random() * 30,
        speed: 0.15 + Math.random() * 0.2,
        dir: Math.random() > 0.5 ? 1 : -1,
        phase: Math.random() * Math.PI * 2
      });
    }
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: cw * 0.78 + Math.random() * 40,
        y: ch * 0.55 + Math.random() * 50,
        vy: -0.3 - Math.random() * 0.5,
        life: Math.random()
      });
    }
  }

  function drawSky(cw, ch) {
    const g = ctx.createLinearGradient(0, 0, 0, ch);
    g.addColorStop(0, '#87CEEB');
    g.addColorStop(0.45, '#B8E0F5');
    g.addColorStop(0.7, '#E8F4E8');
    g.addColorStop(1, '#C8D8C0');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cw, ch);
    ctx.beginPath();
    ctx.arc(cw * 0.82, ch * 0.12, 38, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,240,180,.95)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cw * 0.82, ch * 0.12, 48, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,220,100,.15)';
    ctx.fill();
  }

  function drawRiver(cw, ch) {
    const ry = ch * 0.38;
    ctx.fillStyle = '#4A90A4';
    ctx.beginPath();
    ctx.moveTo(0, ry);
    for (let x = 0; x <= cw; x += 20) {
      ctx.lineTo(x, ry + Math.sin(x * 0.02 + t * 0.02) * 6);
    }
    ctx.lineTo(cw, ch * 0.55);
    ctx.lineTo(0, ch * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.12)';
    for (let i = 0; i < 8; i++) {
      const px = ((t * 30 + i * 80) % (cw + 100)) - 50;
      ctx.fillRect(px, ry + 8 + i * 5, 40, 2);
    }
  }

  function drawKiosk(cw, ch) {
    const kx = cw * 0.38, ky = ch * 0.48, kw = 120, kh = 70;
    ctx.fillStyle = '#1a1a22';
    ctx.fillRect(kx, ky, kw, kh);
    ctx.fillStyle = '#e63946';
    ctx.fillRect(kx, ky, kw, 14);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Manrope, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('АВТО ПРАЙС', kx + kw / 2, ky + 10);
    ctx.font = '9px Manrope, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.8)';
    ctx.fillText('ИРКУТСК', kx + kw / 2, ky + 28);
    ctx.fillStyle = '#333';
    ctx.fillRect(kx + 15, ky + 35, 35, 30);
    ctx.fillRect(kx + 70, ky + 35, 35, 30);
    ctx.fillStyle = 'rgba(100,180,255,.3)';
    ctx.fillRect(kx + 18, ky + 38, 29, 12);
    ctx.fillRect(kx + 73, ky + 38, 29, 12);
  }

  function drawServiceBay(cw, ch) {
    const sx = cw * 0.72, sy = ch * 0.5, sw = 130, sh = 80;
    ctx.fillStyle = '#2a2a32';
    ctx.fillRect(sx, sy, sw, sh);
    ctx.fillStyle = '#e63946';
    ctx.fillRect(sx, sy, sw, 8);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px Manrope, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('СЕРВИС', sx + sw / 2, sy + 7);
    const wx = sx + sw / 2, wy = sy + 45;
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(wx, wy, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.save();
    ctx.translate(wx, wy);
    ctx.rotate(t * 0.08);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(0, -22);
      ctx.stroke();
      ctx.rotate(Math.PI * 2 / 5);
    }
    ctx.restore();
    particles.forEach(p => {
      p.y += p.vy;
      p.life += 0.02;
      if (p.life > 1) { p.life = 0; p.y = sy + 55; }
      ctx.fillStyle = 'rgba(100,180,255,' + (0.4 * (1 - p.life)) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawRoad(cw, ch) {
    ctx.fillStyle = '#3a3a42';
    ctx.fillRect(0, ch * 0.68, cw, ch * 0.32);
    ctx.strokeStyle = '#d4a853';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(0, ch * 0.78);
    ctx.lineTo(cw, ch * 0.78);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawCar(c) {
    const cw = canvas._cw;
    c.x += c.speed * c.dir;
    if (c.x > cw + 80) c.x = -80;
    if (c.x < -80) c.x = cw + 80;
    ctx.save();
    ctx.translate(c.x, c.y);
    if (c.dir < 0) ctx.scale(-1, 1);
    if (c.tow) {
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(-30, -8, 28, 16);
      ctx.fillStyle = c.color;
      ctx.fillRect(-2, -10, 36, 18);
    } else {
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -10, c.w, 18);
      ctx.fillStyle = 'rgba(150,200,255,.5)';
      ctx.fillRect(-c.w / 2 + 5, -8, c.w * 0.35, 8);
    }
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(-c.w / 2 + 8, 10, 5, 0, Math.PI * 2);
    ctx.arc(c.w / 2 - 8, 10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawPerson(p) {
    const cw = canvas._cw;
    p.x += p.speed * p.dir;
    if (p.x > cw * 0.75) p.dir = -1;
    if (p.x < cw * 0.3) p.dir = 1;
    const bob = Math.sin(t * 0.1 + p.phase) * 2;
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.arc(p.x, p.y + bob, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(p.x - 3, p.y + 4 + bob, 6, 10);
    const leg = Math.sin(t * 0.15 + p.phase) * 4;
    ctx.fillRect(p.x - 3, p.y + 14 + bob, 2, 6 + leg);
    ctx.fillRect(p.x + 1, p.y + 14 + bob, 2, 6 - leg);
  }

  function frame() {
    const cw = canvas._cw, ch = canvas._ch;
    if (!cw || !ch) { requestAnimationFrame(frame); return; }
    t++;
    drawSky(cw, ch);
    drawRiver(cw, ch);
    drawKiosk(cw, ch);
    drawServiceBay(cw, ch);
    drawRoad(cw, ch);
    cars.forEach(drawCar);
    people.forEach(drawPerson);
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', () => { resize(); initEntities(); });
  resize();
  initEntities();
  frame();
})();
