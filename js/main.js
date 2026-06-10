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
      const filterCity = pill.dataset.filter;
      document.querySelectorAll('.apt-card').forEach(card => {
        if (!filterCity || filterCity === 'tutti') {
          card.style.display = '';
        } else {
          card.style.display = card.dataset.city === filterCity ? '' : 'none';
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

  // ── Contact form → Telegram ──
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {

    // Mostra/nasconde i campi locazione in base all'oggetto selezionato
    const subjectSel    = contactForm.querySelector('#cf-subject');
    const locazioneDiv  = contactForm.querySelector('#cf-locazione');
    subjectSel.addEventListener('change', () => {
      const isLocazione = subjectSel.value === 'locazione';
      locazioneDiv.style.display = isLocazione ? 'flex' : 'none';
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errorDiv = contactForm.querySelector('#cf-error');
      errorDiv.style.display = 'none';

      const name     = contactForm.querySelector('#cf-name').value.trim();
      const email    = contactForm.querySelector('#cf-email').value.trim();
      const whatsapp = contactForm.querySelector('#cf-whatsapp').value.trim();
      const subject  = subjectSel.value;
      const message  = contactForm.querySelector('#cf-message').value.trim();
      const isLocazione = subject === 'locazione';

      // Validazione
      const errors = [];
      if (!name) errors.push('Il nome è obbligatorio.');
      if (!email && !whatsapp) errors.push('Inserisci almeno un contatto: email o WhatsApp.');
      if (isLocazione) {
        if (!contactForm.querySelector('#cf-tipo').value)  errors.push('Seleziona il tipo di appartamento.');
        if (!contactForm.querySelector('#cf-data').value)  errors.push('Inserisci la data di disponibilità.');
        if (!contactForm.querySelector('#cf-zona').value)  errors.push('Seleziona la zona di preferenza.');
      }
      if (!message) errors.push('Il campo "Altre informazioni" è obbligatorio.');

      if (errors.length) {
        errorDiv.textContent = errors.join(' ');
        errorDiv.style.display = 'block';
        return;
      }

      // Costruzione messaggio Telegram
      const fmt = d => { const [y,m,g] = d.split('-'); return `${g}.${m}.${y}`; };
      let text;
      if (isLocazione) {
        const tipo = contactForm.querySelector('#cf-tipo').value;
        const data = fmt(contactForm.querySelector('#cf-data').value);
        const zona = contactForm.querySelector('#cf-zona').value;
        text = `🏠 Richiesta locazione – lamiacasa.ch\n\n👤 ${name}` +
               (email    ? `\n📧 ${email}`    : '') +
               (whatsapp ? `\n📱 ${whatsapp}` : '') +
               `\n\n🏠 Tipo: ${tipo}\n📅 Disponibile da: ${data}\n📍 Zona: ${zona}` +
               `\n\n💬 Altre info:\n${message}`;
      } else {
        const oggetto = subject === 'altro' ? 'Altro argomento' : '(non specificato)';
        text = `📬 Nuovo messaggio – lamiacasa.ch\n\n👤 ${name}` +
               (email    ? `\n📧 ${email}`    : '') +
               (whatsapp ? `\n📱 ${whatsapp}` : '') +
               `\n📌 ${oggetto}\n\n💬 Messaggio:\n${message}`;
      }

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio in corso…';

      try {
        const res = await fetch('https://api.telegram.org/bot8759827611:AAF4aPxxFEv-xXMSgBchmqXNBDmOKy-RlFs/sendMessage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: 8754468854, text })
        });
        if (!res.ok) throw new Error();
        btn.innerHTML = '<i class="fas fa-check"></i> Messaggio inviato!';
        btn.style.background = '#2eaf64';
        contactForm.reset();
        locazioneDiv.style.display = 'none';
      } catch {
        btn.innerHTML = '<i class="fas fa-times"></i> Errore, riprova';
        btn.style.background = '#dc3c3c';
      }
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.style.background = '';
      }, 4000);
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
