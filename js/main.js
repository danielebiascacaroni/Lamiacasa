// ── Lamiacasa.ch – Main JS ──────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile nav toggle ──
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // close when a link is clicked
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ── Scroll-to-top button ──
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Cookie banner ──
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieAccept = document.querySelector('#cookie-accept');
  const cookieDecline = document.querySelector('#cookie-decline');
  if (cookieBanner) {
    if (localStorage.getItem('cookie-consent')) {
      cookieBanner.classList.add('hidden');
    }
    if (cookieAccept) {
      cookieAccept.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'accepted');
        cookieBanner.classList.add('hidden');
      });
    }
    if (cookieDecline) {
      cookieDecline.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'declined');
        cookieBanner.classList.add('hidden');
      });
    }
  }

  // ── Wishlist (heart) buttons ──
  document.querySelectorAll('.apt-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('liked');
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = btn.classList.contains('liked')
          ? 'fas fa-heart'
          : 'far fa-heart';
      }
    });
  });

  // ── Apartment filter pills ──
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filterType = pill.dataset.filter;
      document.querySelectorAll('.apt-card').forEach(card => {
        if (!filterType || filterType === 'tutti') {
          card.style.display = '';
        } else {
          card.style.display = card.dataset.type === filterType ? '' : 'none';
        }
      });
    });
  });

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Login form ──
  const loginForm = document.querySelector('#login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Accesso temporaneamente disabilitato. Contattaci per assistenza.');
    });
  }

  // ── Contact form ──
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Inviato!';
      btn.disabled = true;
      btn.style.background = '#2eaf64';
      setTimeout(() => {
        btn.innerHTML = originalButtonText;
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ── Fade-in on scroll (Intersection Observer) ──
  const fadeEls = document.querySelectorAll('.service-card, .apt-card, .step-item, .testimonial-card, .tenant-feature');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity .5s ease ${i * 0.07}s, transform .5s ease ${i * 0.07}s`;
      io.observe(el);
    });
  }

  // ── Active nav link on scroll ──
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navAs.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  });

});
