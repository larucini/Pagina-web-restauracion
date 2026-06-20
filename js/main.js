/* ===================================================
   RAÍZ — Restauración de Muebles
   JavaScript Principal — v2
   =================================================== */

'use strict';

/* ─── NAV: scroll state, mobile menu & active section ─── */
(function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const links  = document.getElementById('nav-links');
  if (!nav || !burger || !links) return;

  /* — scroll: clase scrolled — */
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* — burger: abrir/cerrar overlay mobile — */
  let open = false;
  const closeMobile = () => {
    open = false;
    links.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
    burger.querySelectorAll('span').forEach(s => s.style.transform = '');
  };

  burger.addEventListener('click', () => {
    open = !open;
    links.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
    const [s1, s2] = burger.querySelectorAll('span');
    s1.style.transform = open ? 'translateY(6.5px) rotate(45deg)' : '';
    s2.style.transform = open ? 'translateY(-6.5px) rotate(-45deg)' : '';
  });

  /* cerrar al hacer click en cualquier enlace */
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));

  /* cerrar con Escape */
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) closeMobile(); });

  /* — active state: IntersectionObserver por sección — */
  const navItems = links.querySelectorAll('.nav__item[data-section]');
  const sections = [];

  navItems.forEach(item => {
    /* el href puede apuntar a #inicio, #proyectos, #contacto, etc.
       Para #que-hacemos y #sobre-raiz usamos el ancla del HTML.
       Si la sección no existe (contenido pendiente) no falla. */
    const id = item.getAttribute('href').replace('#', '');
    const section = document.getElementById(id);
    if (section) sections.push({ section, item });
  });

  if (sections.length) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(({ target, isIntersecting }) => {
          const found = sections.find(s => s.section === target);
          if (!found) return;
          if (isIntersecting) {
            /* quitar activo de todos y poner en este */
            navItems.forEach(i => i.classList.remove('is-active'));
            found.item.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach(({ section }) => io.observe(section));

    /* Activar INICIO por defecto */
    const inicioItem = links.querySelector('[data-section="inicio"]');
    if (inicioItem) inicioItem.classList.add('is-active');
  }
})();


/* ─── REVEAL ON SCROLL ─── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); observer.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  els.forEach(el => observer.observe(el));
})();


/* ─── STATS COUNTER ─── */
(function initCounters() {
  const counters = document.querySelectorAll('.stats__number[data-target]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animate = el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOut(p) * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { animate(e.target); observer.unobserve(e.target); } }),
    { threshold: 0.4 }
  );
  counters.forEach(el => observer.observe(el));
})();


/* ─── SVG RAÍZ: animación de "escritura manual" al cargar ─── */
(function initRaizAnimation() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const svg = document.querySelector('.hero__raiz-svg');
  if (!svg) return;

  // El SVG ya tiene la animación de opacidad/escala desde CSS (raizDraw).
  // Aquí añadimos un efecto de stroke-dasharray sobre los paths para la
  // ilusión de escritura a mano (una vez que el SVG carga).
  svg.addEventListener('load', function() {
    const paths = svg.contentDocument
      ? svg.contentDocument.querySelectorAll('path, polygon, polyline')
      : [];

    if (!paths.length) return;

    paths.forEach((path, i) => {
      try {
        const len = path.getTotalLength ? path.getTotalLength() : 0;
        if (!len) return;
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        path.style.transition = `stroke-dashoffset 1.8s ${0.3 + i * 0.04}s cubic-bezier(0.19,1,0.22,1)`;
      } catch(e) { /* ignorar paths sin getTotalLength */ }
    });

    // Trigger
    requestAnimationFrame(() => {
      paths.forEach(path => { path.style.strokeDashoffset = '0'; });
    });
  });
})();


/* ─── SMOOTH ANCHOR SCROLL ─── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('nav')?.offsetHeight || 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });
})();


/* ─── HERO PARALLAX (sutil, solo desktop) ─── */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 768) return;

  const content = document.querySelector('.hero__content');
  const raiz    = document.querySelector('.hero__raiz-bg');

  const onScroll = () => {
    const sy = window.scrollY;
    if (sy > window.innerHeight) return;
    if (content) content.style.transform = `translateY(${sy * 0.1}px)`;
    if (raiz)    raiz.style.transform    = `translateY(${sy * 0.05}px)`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ─── PROYECTO CARD HOVER ─── */
(function initProjectHover() {
  document.querySelectorAll('.proyecto-card').forEach(card => {
    const after = card.querySelector('.proyecto-card__after');
    if (!after) return;
    card.addEventListener('mouseenter', () => { after.style.transform = 'scale(1.03)'; after.style.transition = 'transform 0.5s cubic-bezier(0.19,1,0.22,1)'; });
    card.addEventListener('mouseleave', () => { after.style.transform = ''; });
  });
})();


/* ─── REDUCED MOTION fallback ─── */
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }
})();
