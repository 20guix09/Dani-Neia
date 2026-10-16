(() => {
  'use strict';
  const config = window.DANI_CONFIG;
  if (!config) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const whatsapp = /^55\d{10,11}$/.test(config.whatsapp) ? config.whatsapp : '';
  const contactUrl = (key = 'geral') => `https://wa.me/${whatsapp}?text=${encodeURIComponent(config.whatsappMessages?.[key] || config.whatsappMessage)}`;
  $$('[data-contact]').forEach(link => {
    if (whatsapp) {
      link.href = contactUrl(link.dataset.message);
      const use = $('use', link);
      if (use) use.setAttribute('href', '#i-whatsapp');
    }
  });
  if (whatsapp) $$('[data-contact-label]').forEach(el => { el.textContent = 'WhatsApp'; });
  $$('[data-instagram]').forEach(link => { link.href = config.instagram; });
  $$('[data-developer]').forEach(link => { link.href = config.developerUrl; });
  $$('[data-address]').forEach(el => { el.textContent = config.address; });
  const route = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(config.mapQuery)}`;
  $$('[data-route]').forEach(link => { link.href = route; });
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
  if (config.canonicalUrl && /^https:\/\//.test(config.canonicalUrl)) {
    const canonical = $('link[rel="canonical"]') || document.createElement('link');
    canonical.rel = 'canonical'; canonical.href = config.canonicalUrl;
    if (!canonical.parentNode) document.head.append(canonical);
    const ogImage = $('meta[property="og:image"]');
    if (ogImage) ogImage.content = new URL('assets/images/dani-neia-enhanced.webp', config.canonicalUrl).href;
    const ogUrl = $('meta[property="og:url"]') || document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url'); ogUrl.content = config.canonicalUrl;
    if (!ogUrl.parentNode) document.head.append(ogUrl);
  }
  const toggle = $('.menu-toggle'), nav = $('#menu');
  if (toggle && nav) {
    const closeMenu = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menu'); };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    $$('a', nav).forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
    document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
    window.matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  }
  const progress = $('.scroll-progress');
  const windowImage = $('.window-image img');
  const windowBox = $('.window-image');
  const floating = $('.floating-contact');
  const footer = $('.site-footer');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 701px)');
  let framePending = false;
  const updateScroll = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${available > 0 ? Math.max(0, Math.min(1, window.scrollY / available)) : 0})`;
    if (windowImage && windowBox) {
      const bounds = windowBox.getBoundingClientRect();
      const offset = Math.max(-30, Math.min(30, (window.innerHeight / 2 - bounds.top - bounds.height / 2) * .08));
      windowImage.style.transform = !reducedMotion.matches && desktop.matches ? `translateY(${offset}px)` : '';
    }
    if (floating && footer) {
      const near = footer.getBoundingClientRect().top < window.innerHeight;
      floating.classList.toggle('is-near-footer', near);
      floating.tabIndex = near ? -1 : 0;
      if (near) floating.setAttribute('aria-hidden', 'true'); else floating.removeAttribute('aria-hidden');
    }
    framePending = false;
  };
  const requestUpdate = () => { if (!framePending) { framePending = true; window.requestAnimationFrame(updateScroll); } };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  window.addEventListener('load', requestUpdate); reducedMotion.addEventListener('change', requestUpdate); updateScroll();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    $$('.reveal').forEach(el => observer.observe(el));
  }
  const mapFrame = $('#location-map');
  if (mapFrame) {
    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(config.mapQuery)}&output=embed`;
  }
  /* The optional form is enabled only with a real recipient. No simulated sends. */
  const form = $('#contact-form');
  if (form && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.formEmail)) {
    $('#form-section').hidden = false;
    form.action = `https://formsubmit.co/${encodeURIComponent(config.formEmail)}`;
    const phone = $('#phone');
    const formatPhone = raw => {
      const d = raw.replace(/\D/g, '').slice(0, 11);
      if (!d) return '';
      if (d.length < 3) return `(${d}`;
      const number = d.slice(2), split = number.length > 8 ? 5 : 4;
      return `(${d.slice(0, 2)}) ${number.slice(0, split)}${number.length > split ? '-' + number.slice(split) : ''}`;
    };
    phone.addEventListener('input', () => { phone.value = formatPhone(phone.value); phone.setCustomValidity(''); });
    if (config.canonicalUrl) {
      const next = document.createElement('input'); next.type = 'hidden'; next.name = '_next'; next.value = new URL('obrigado.html', config.canonicalUrl).href; form.append(next);
    }
    form.addEventListener('submit', e => {
      phone.setCustomValidity(/^\d{10,11}$/.test(phone.value.replace(/\D/g, '')) ? '' : 'Informe um telefone com DDD, com 10 ou 11 dígitos.');
      if (!form.reportValidity()) { e.preventDefault(); return; }
      const button = $('button[type="submit"]', form);
      button.disabled = true; button.textContent = 'Continuar envio…';
      $('#form-status').textContent = 'Você será direcionado à confirmação segura do envio. Se a página não abrir, tente novamente.';
      /* Native POST keeps FormSubmit CAPTCHA, activation, success and error handling intact. */
      window.setTimeout(() => { button.disabled = false; button.textContent = 'Enviar solicitação'; }, 15000);
    });
    window.addEventListener('pageshow', () => { const b = $('button[type="submit"]', form); b.disabled = false; b.textContent = 'Enviar solicitação'; });
  }
})();
