// Pfadfinder Langenwang — main.js

(function () {
  'use strict';

  // ---- Scroll animations (IntersectionObserver) ----
  const animatedEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animatedEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: just show everything
    animatedEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ---- Header scroll state ----
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY;
    if (y > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile nav toggle ----
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !open);
      nav.classList.toggle('is-open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });

    // Close nav on link click
    nav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Dark mode toggle ----
  const themeBtn = document.getElementById('theme-toggle');

  function setTheme(theme, animate) {
    if (animate) {
      document.documentElement.classList.add('theme-transition');
    }
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeBtn) {
      themeBtn.setAttribute('aria-label',
        theme === 'dark' ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln'
      );
    }
    if (animate) {
      setTimeout(function () {
        document.documentElement.classList.remove('theme-transition');
      }, 400);
    }
  }

  if (themeBtn) {
    // Initialise label (theme already set by inline script in <head>)
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    themeBtn.setAttribute('aria-label',
      current === 'dark' ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln'
    );

    themeBtn.addEventListener('click', function () {
      var now = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(now === 'dark' ? 'light' : 'dark', true);
    });
  }

  // Listen for OS preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light', true);
    }
  });
})();
