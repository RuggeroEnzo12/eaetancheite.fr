/* ================================================================
   EA Étanchéité — script.js
   - Header sticky (shadow on scroll)
   - Mobile menu toggle
   - Smooth scroll with header offset
   - Scroll reveal animations
   - Form submission (Web3Forms)
   - Year in footer
   ================================================================ */

(function () {
  'use strict';

  /* -------- 0. Cookie consent (RGPD) -------- */
  const cookieBanner = document.getElementById('cookieBanner');
  if (cookieBanner) {
    const STORAGE_KEY = 'ea_cookie_consent';
    const choice = localStorage.getItem(STORAGE_KEY);

    if (!choice) {
      // First visit : show banner after a short delay (better UX)
      setTimeout(() => {
        cookieBanner.hidden = false;
      }, 800);
    }

    const persist = (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, date: new Date().toISOString() }));
      } catch (e) {
        /* localStorage may be disabled */
      }
      cookieBanner.classList.add('hidden');
    };

    const acceptBtn = document.getElementById('cookieAccept');
    const refuseBtn = document.getElementById('cookieRefuse');
    if (acceptBtn) acceptBtn.addEventListener('click', () => persist('accepted'));
    if (refuseBtn) refuseBtn.addEventListener('click', () => persist('refused'));
  }

  /* -------- 1. Year in footer -------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------- 2. Header shadow on scroll -------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* -------- 3. Mobile menu -------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMenu = () => {
    if (!navToggle || !mobileMenu) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Ouvrir le menu');
    mobileMenu.classList.remove('open');
    mobileMenu.hidden = true;
  };
  const openMenu = () => {
    if (!navToggle || !mobileMenu) return;
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fermer le menu');
    mobileMenu.classList.add('open');
    mobileMenu.hidden = false;
  };

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu();
      else openMenu();
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        navToggle.focus();
      }
    });

    // Close when viewport grows past mobile breakpoint
    const mq = window.matchMedia('(min-width: 1025px)');
    const onMqChange = () => { if (mq.matches) closeMenu(); };
    if (mq.addEventListener) mq.addEventListener('change', onMqChange);
    else if (mq.addListener) mq.addListener(onMqChange);
  }

  /* -------- 4. Smooth scroll with sticky-header offset -------- */
  const getHeaderOffset = () => (header ? header.offsetHeight : 0);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 12;
      window.scrollTo({ top, behavior: 'smooth' });

      // Update history without jumping
      if (history.pushState) history.pushState(null, '', href);
    });
  });

  /* -------- 5. Scroll reveal -------- */
  // Exclude elements that have a hover transform — those would conflict with the reveal transform.
  const revealEls = [
    ...document.querySelectorAll(
      '.section-header, .apropos-text, .apropos-card, .zone-deps, .zone-cities, .devis-text, .devis-form, .trust-strip li'
    ),
  ];
  revealEls.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* -------- 6. Custom dropdowns (remplace <select> natifs) -------- */
  const dropdowns = document.querySelectorAll('[data-dropdown]');

  const closeAllDropdowns = (except) => {
    dropdowns.forEach((dd) => {
      if (dd === except) return;
      dd.classList.remove('open');
      const trigger = dd.querySelector('.dropdown-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      dd.querySelectorAll('.dropdown-menu li').forEach((li) => li.classList.remove('focused'));
    });
  };

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const valueEl = dropdown.querySelector('.dropdown-value');
    const menu = dropdown.querySelector('.dropdown-menu');
    const hidden = dropdown.querySelector('input[type="hidden"]');
    const options = Array.from(menu.querySelectorAll('li[role="option"]'));
    if (!trigger || !menu || !hidden) return;

    const open = () => {
      closeAllDropdowns(dropdown);
      dropdown.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      // Focus the selected (or first) option
      const selected = menu.querySelector('li[aria-selected="true"]') || options[0];
      options.forEach((o) => o.classList.remove('focused'));
      if (selected) {
        selected.classList.add('focused');
        selected.scrollIntoView({ block: 'nearest' });
      }
    };
    const close = () => {
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      options.forEach((o) => o.classList.remove('focused'));
    };
    const selectOption = (li) => {
      const value = li.dataset.value || li.textContent.trim();
      hidden.value = value;
      valueEl.textContent = value;
      valueEl.classList.add('has-value');
      options.forEach((o) => o.setAttribute('aria-selected', 'false'));
      li.setAttribute('aria-selected', 'true');
      dropdown.classList.remove('error');
      // Notify form / listeners
      hidden.dispatchEvent(new Event('change', { bubbles: true }));
      close();
      trigger.focus();
    };

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dropdown.classList.contains('open')) close();
      else open();
    });

    options.forEach((li) => {
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        selectOption(li);
      });
      li.addEventListener('mouseenter', () => {
        options.forEach((o) => o.classList.remove('focused'));
        li.classList.add('focused');
      });
    });

    // Keyboard navigation
    trigger.addEventListener('keydown', (e) => {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        if (!dropdown.classList.contains('open')) open();
        else if (e.key === 'Enter' || e.key === ' ') {
          const focused = menu.querySelector('li.focused');
          if (focused) selectOption(focused);
        }
      } else if (e.key === 'Escape' && dropdown.classList.contains('open')) {
        e.preventDefault();
        close();
      }
    });

    menu.addEventListener('keydown', (e) => {
      if (!['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Escape', 'Tab'].includes(e.key)) return;
      const focused = menu.querySelector('li.focused');
      const idx = focused ? options.indexOf(focused) : -1;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = options[Math.min(idx + 1, options.length - 1)];
        options.forEach((o) => o.classList.remove('focused'));
        next.classList.add('focused');
        next.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = options[Math.max(idx - 1, 0)];
        options.forEach((o) => o.classList.remove('focused'));
        prev.classList.add('focused');
        prev.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focused) selectOption(focused);
      } else if (e.key === 'Escape' || e.key === 'Tab') {
        close();
        if (e.key === 'Escape') trigger.focus();
      }
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-dropdown]')) closeAllDropdowns(null);
  });

  // Close on Escape (global)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns(null);
  });

  /* -------- 6b. Service modals -------- */
  const serviceCards = document.querySelectorAll('.service-card[data-modal]');
  const allModals = document.querySelectorAll('.modal');
  let lastFocused = null;

  const openModal = (key) => {
    const modal = document.getElementById(`modal-${key}`);
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    // Force reflow for transition
    void modal.offsetWidth;
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    // Focus the close button after animation
    const closeBtn = modal.querySelector('.modal-close');
    setTimeout(() => { if (closeBtn) closeBtn.focus(); }, 80);
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    setTimeout(() => { modal.hidden = true; }, 220);
    if (lastFocused) {
      try { lastFocused.focus(); } catch (e) { /* ignore */ }
    }
  };

  const closeAnyOpenModal = () => {
    document.querySelectorAll('.modal.open').forEach(closeModal);
  };

  // Click & keyboard on service cards
  serviceCards.forEach((card) => {
    const key = card.dataset.modal;
    card.addEventListener('click', () => openModal(key));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(key);
      }
    });
  });

  // Close on close-button / overlay click
  allModals.forEach((modal) => {
    modal.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', (e) => {
        // For the CTA "Demander un devis" which is a link, let it navigate AND close
        closeModal(modal);
      });
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAnyOpenModal();
  });

  /* -------- 7. Form submission (Web3Forms) -------- */
  const form = document.getElementById('devisForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (form && status && submitBtn) {
    const accessKeyInput = form.querySelector('input[name="access_key"]');
    const accessKey = accessKeyInput ? accessKeyInput.value : '';
    const isConfigured = accessKey && !accessKey.includes('[');

    // Reset dropdowns when the form is reset
    form.addEventListener('reset', () => {
      form.querySelectorAll('[data-dropdown]').forEach((dd) => {
        const valueEl = dd.querySelector('.dropdown-value');
        const hidden = dd.querySelector('input[type="hidden"]');
        if (valueEl) {
          valueEl.textContent = valueEl.dataset.placeholder || '— Choisir —';
          valueEl.classList.remove('has-value');
        }
        if (hidden) hidden.value = '';
        dd.querySelectorAll('li[role="option"]').forEach((o) => o.setAttribute('aria-selected', 'false'));
        dd.classList.remove('error');
      });
    });

    // Clear field error when user starts typing/correcting
    form.querySelectorAll('.form-field input, .form-field textarea').forEach((field) => {
      field.addEventListener('input', () => {
        const wrapper = field.closest('.form-field');
        if (wrapper && wrapper.classList.contains('error') && field.value.trim()) {
          wrapper.classList.remove('error');
        }
      });
    });
    // Clear consent error when checked
    const consentInput = form.querySelector('.form-consent input[type="checkbox"]');
    if (consentInput) {
      consentInput.addEventListener('change', () => {
        const wrap = consentInput.closest('.form-consent');
        if (wrap && consentInput.checked) wrap.classList.remove('error');
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      status.className = 'form-status';

      let firstInvalid = null;

      // Clear all previous error states
      form.querySelectorAll('.form-field.error').forEach((el) => el.classList.remove('error'));
      form.querySelectorAll('[data-dropdown].error').forEach((el) => el.classList.remove('error'));

      // Validate required inputs/textareas
      form.querySelectorAll('.form-field input[required], .form-field textarea[required]').forEach((field) => {
        const isEmpty = !field.value.trim();
        const isInvalidEmail = field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        if (isEmpty || isInvalidEmail) {
          const wrapper = field.closest('.form-field');
          if (wrapper) wrapper.classList.add('error');
          if (!firstInvalid) firstInvalid = field;
        }
      });

      // Validate required custom dropdowns
      form.querySelectorAll('[data-dropdown][data-required="true"]').forEach((dd) => {
        const hidden = dd.querySelector('input[type="hidden"]');
        if (!hidden || !hidden.value) {
          dd.classList.add('error');
          if (!firstInvalid) firstInvalid = dd.querySelector('.dropdown-trigger');
        }
      });

      // Validate consent checkbox
      const consent = form.querySelector('.form-consent input[type="checkbox"]');
      if (consent && !consent.checked) {
        const consentWrap = consent.closest('.form-consent');
        if (consentWrap) consentWrap.classList.add('error');
        if (!firstInvalid) firstInvalid = consent;
      }

      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: true });
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        status.textContent = 'Merci de compléter tous les champs obligatoires.';
        status.classList.add('error');
        return;
      }

      if (!isConfigured) {
        status.textContent =
          "⚠️ Le formulaire n'est pas encore configuré. Contactez-nous directement par téléphone ou email.";
        status.classList.add('error');
        return;
      }

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      status.textContent = 'Envoi en cours…';

      try {
        const fd = new FormData(form);
        const prenom = (fd.get('firstname') || '').toString().trim();
        const nom = (fd.get('lastname') || '').toString().trim();
        const emailClient = (fd.get('email') || '').toString().trim();
        const telephone = (fd.get('phone') || '').toString().trim();
        const ville = (fd.get('city') || '').toString().trim();
        const profil = (fd.get('profile') || '').toString().trim();
        const prestation = (fd.get('service') || '').toString().trim() || 'Non précisée';
        const descriptionProjet = (fd.get('message') || '').toString().trim();

        const nomComplet = `${prenom} ${nom}`.trim() || 'Visiteur';
        const dateDemande = new Date().toLocaleString('fr-FR', {
          timeZone: 'Europe/Paris',
          day: '2-digit', month: 'long', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        });

        // Payload structuré pour Web3Forms — chaque clé devient un libellé dans le mail
        const payload = {
          access_key: accessKey,
          subject: `🔔 Nouvelle demande de devis — ${nomComplet}`,
          from_name: '🔔 Demande de devis',
          replyto: emailClient,
          botcheck: fd.get('botcheck') || '',

          '👤 Nom complet': nomComplet,
          '📧 Adresse email': emailClient,
          '📞 Téléphone': telephone,
          '🏢 Profil du client': profil,
          '📍 Ville du chantier': ville,
          '🔧 Prestation souhaitée': prestation,
          '📝 Description du projet': descriptionProjet,
          '🕒 Date de la demande': dateDemande,
          '🌐 Source': 'Formulaire en ligne — eaetancheite.fr',
        };

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.success !== false) {
          status.textContent =
            '✅ Merci ! Votre demande a bien été envoyée. Nous vous recontactons sous 24h.';
          status.classList.add('success');
          form.reset();
        } else {
          throw new Error(data.message || 'Erreur lors de l\'envoi');
        }
      } catch (err) {
        status.textContent =
          '❌ Une erreur est survenue. Merci de réessayer ou de nous contacter directement par téléphone.';
        status.classList.add('error');
        console.error('[EA Étanchéité] form error:', err);
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    });
  }
})();
