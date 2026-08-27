document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const progressLine = document.getElementById('progressLine');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    const doc = document.documentElement;
    const scrollTop = window.scrollY;
    const height = doc.scrollHeight - doc.clientHeight;
    progressLine.style.width = height > 0 ? `${(scrollTop / height) * 100}%` : '0%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if ('IntersectionObserver' in window) {
    document.body.classList.add('js-reveal');
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  const langSwitch = document.getElementById('langSwitch');
  const SUPPORTED_LANGS = ['es', 'ca', 'en'];
  const DEFAULT_LANG = 'es';

  const applyLang = (lang) => {
    const dict = window.SENSE_FONS_I18N && window.SENSE_FONS_I18N[lang];
    if (!dict) return;

    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = dict[key];
      if (value === undefined) return;
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      const value = dict[key];
      if (value !== undefined) el.setAttribute('alt', value);
    });

    if (langSwitch) {
      langSwitch.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.lang === lang);
      });
    }

    try { localStorage.setItem('sf-lang', lang); } catch (e) {}
  };

  if (langSwitch) {
    langSwitch.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-btn');
      if (!btn) return;
      applyLang(btn.dataset.lang);
    });
  }

  let initialLang = DEFAULT_LANG;
  try {
    const stored = localStorage.getItem('sf-lang');
    if (stored && SUPPORTED_LANGS.includes(stored)) initialLang = stored;
  } catch (e) {}
  applyLang(initialLang);
});
