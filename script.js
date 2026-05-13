/* ── Mobile menu ── */
function toggleMenu(btn) {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
  btn.classList.toggle('open');
}
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
  const burger = document.querySelector('.burger');
  if (burger) burger.classList.remove('open');
}

/* ── Header scroll ── */
const header = document.getElementById('header');
const stickyCta = document.getElementById('stickyCta');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('header--scrolled');
    stickyCta.classList.add('visible');
  } else {
    header.classList.remove('header--scrolled');
    stickyCta.classList.remove('visible');
  }
}, { passive: true });

/* ── Form submit ── */
function submitForm(e) {
  e.preventDefault();
  const form = e.target;

  let name = '', phone = '', topic = '', message = '';
  form.querySelectorAll('input[type="text"]').forEach(el => { name = el.value; });
  form.querySelectorAll('input[type="tel"]').forEach(el => { phone = el.value; });
  form.querySelectorAll('select').forEach(el => { topic = el.value; });
  form.querySelectorAll('textarea').forEach(el => { message = el.value; });

  const tgLines = [
    'Новая заявка — воинское-право.рф',
    '',
    'Имя: ' + name,
    'Телефон: ' + phone,
  ];
  if (topic) tgLines.push('Тема: ' + topic);
  if (message) tgLines.push('Сообщение: ' + message);

  fetch('https://api.telegram.org/bot8611353051:AAGpkziuS0jSMfcJh2iFUuiIS7FtfjQL_sk/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: '-1003740978392', text: tgLines.join('\n') })
  }).catch(() => {});

  const emailPayload = {
    _subject: 'Новая заявка — воинское-право.рф',
    _cc: 'artklimov77@yandex.com',
    _captcha: 'false',
    'Имя': name,
    'Телефон': phone,
  };
  if (topic) emailPayload['Тема'] = topic;
  if (message) emailPayload['Сообщение'] = message;

  fetch('https://formsubmit.co/ajax/prydovich@mail.ru', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(emailPayload)
  }).catch(() => {});

  document.getElementById('successModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  form.reset();
}
function closeModal() {
  document.getElementById('successModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ── Phone mask ── */
document.querySelectorAll('input[type="tel"]').forEach(input => {
  input.addEventListener('input', function () {
    let digits = this.value.replace(/\D/g, '');
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (!digits.startsWith('7') && digits.length > 0) digits = '7' + digits;
    let out = '';
    if (digits.length > 0) out = '+7';
    if (digits.length > 1) out += ' (' + digits.slice(1, 4);
    if (digits.length > 4) out += ') ' + digits.slice(4, 7);
    if (digits.length > 7) out += '-' + digits.slice(7, 9);
    if (digits.length > 9) out += '-' + digits.slice(9, 11);
    this.value = out;
  });
});

/* ── Scroll fade-in ── */
const fadeTargets = document.querySelectorAll(
  '.service-card, .pain-card, .result-card, .step, .about-fact, .faq-item, .review-item, .stat-item, .trust-box'
);
fadeTargets.forEach(el => el.classList.add('will-fade'));

const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    const delay = (entry.target.dataset.fadeIdx || 0) * 60;
    setTimeout(() => entry.target.classList.add('visible'), delay);
    fadeObs.unobserve(entry.target);
  });
}, { threshold: 0.12 });

fadeTargets.forEach((el, idx) => {
  el.dataset.fadeIdx = idx % 5;
  fadeObs.observe(el);
});

/* ── Animate stat numbers ── */
const statEls = document.querySelectorAll('.stat-item__number[data-target]');
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.dataset.done) return;
    entry.target.dataset.done = '1';
    countUp(entry.target);
  });
}, { threshold: 0.5 });
statEls.forEach(el => statObs.observe(el));

function countUp(el) {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const t0 = performance.now();
  function step(now) {
    const p = Math.min((now - t0) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target).toLocaleString('ru-RU') + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
