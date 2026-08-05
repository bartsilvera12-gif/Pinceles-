// Íconos Lucide
if (window.lucide) lucide.createIcons();

// Header: fondo al hacer scroll
(function () {
  var header = document.getElementById('header');
  if (!header) return;
  function onScroll() {
    if (window.scrollY > 24) {
      header.style.background = 'rgba(255,255,255,.92)';
      header.style.boxShadow = '0 6px 24px rgba(5,5,5,.08)';
    } else {
      header.style.background = 'rgba(248,246,241,.55)';
      header.style.boxShadow = 'none';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Animaciones de entrada
(function () {
  var els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(function (el) { el.classList.add('revealed'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

// Filtros de proyectos
(function () {
  var buttons = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.project-card');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var show = f === 'Todos' || card.getAttribute('data-category') === f;
        card.classList.toggle('show', show);
      });
    });
  });
})();

// Lightbox
(function () {
  var lb = document.getElementById('lightbox');
  if (!lb) return;
  var img = document.getElementById('lb-img');
  var elCat = document.getElementById('lb-cat');
  var elTitle = document.getElementById('lb-title');
  var elPlace = document.getElementById('lb-place');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.project-card'));
  var current = -1;

  function visibleCards() { return cards.filter(function (c) { return c.classList.contains('show'); }); }
  function open(card) {
    var list = visibleCards();
    current = list.indexOf(card);
    render(list[current]);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function render(card) {
    if (!card) return;
    img.src = card.getAttribute('data-src');
    img.alt = card.getAttribute('data-alt') || '';
    elCat.textContent = card.getAttribute('data-cat') || '';
    elTitle.textContent = card.getAttribute('data-title') || '';
    elPlace.textContent = card.getAttribute('data-place') || '';
  }
  function move(dir) {
    var list = visibleCards();
    if (!list.length) return;
    current = (current + dir + list.length) % list.length;
    render(list[current]);
  }
  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }

  cards.forEach(function (card) { card.addEventListener('click', function () { open(card); }); });
  document.getElementById('lb-prev').addEventListener('click', function () { move(-1); });
  document.getElementById('lb-next').addEventListener('click', function () { move(1); });
  document.getElementById('lb-close').addEventListener('click', close);
  lb.addEventListener('click', function (ev) { if (ev.target === lb) close(); });
  document.addEventListener('keydown', function (ev) {
    if (!lb.classList.contains('open')) return;
    if (ev.key === 'Escape') close();
    if (ev.key === 'ArrowRight') move(1);
    if (ev.key === 'ArrowLeft') move(-1);
  });
})();
