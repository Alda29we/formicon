// Efecto de aparición suave al hacer scroll
document.addEventListener('DOMContentLoaded', () => {
  // Existing simple reveal for older elements
  const elementos = document.querySelectorAll('.service-card, .contact-form');

  const aparecer = () => {
    const triggerBottom = window.innerHeight * 0.85;
    elementos.forEach(el => {
      const boxTop = el.getBoundingClientRect().top;
      if (boxTop < triggerBottom) {
        el.classList.add('animate__animated', 'animate__fadeInUp');
      }
    });
  };

  try {
    window.addEventListener('scroll', aparecer, { passive: true });
  } catch (e) {
    window.addEventListener('scroll', aparecer);
  }
  aparecer();

  // IntersectionObserver-based reveal for .reveal elements (more performant)
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  } else {
    // fallback: add visible class
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Smooth scroll for internal anchor links (improves UX)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Dark/Light theme toggle (solo botón flotante)
  const themeFloat = document.getElementById('themeFloat');
  const themeFloatIcon = document.getElementById('themeFloatIcon');
  const setTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (themeFloat) themeFloat.setAttribute('aria-pressed', 'true');
      if (themeFloatIcon) themeFloatIcon.className = 'fa-solid fa-sun';
    } else {
      document.documentElement.classList.remove('dark');
      if (themeFloat) themeFloat.setAttribute('aria-pressed', 'false');
      if (themeFloatIcon) themeFloatIcon.className = 'fa-solid fa-moon';
    }
    try { localStorage.setItem('theme', theme); } catch (e) {}
  };

  // Initialize theme: localStorage > prefers-color-scheme > light
  let initial = 'light';
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') initial = stored;
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) initial = 'dark';
  } catch (e) {}
  setTheme(initial);

  if (themeFloat) {
    themeFloat.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark');
    });
  }

  // Flip-card interaction: support click/tap and keyboard (Enter/Space)
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    // click/tap toggles flip state (useful for touch)
    card.addEventListener('click', (e) => {
      card.classList.toggle('is-flipped');
      const pressed = card.classList.contains('is-flipped');
      card.setAttribute('aria-pressed', pressed.toString());
    });

    // keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-flipped');
        const pressed = card.classList.contains('is-flipped');
        card.setAttribute('aria-pressed', pressed.toString());
      }
    });

    // stop clicks inside links from toggling accidentally
    card.querySelectorAll('a').forEach(link => link.addEventListener('click', (ev) => ev.stopPropagation()));
  });
});
