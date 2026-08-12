(() => {
  const experienceStyles = document.createElement('link');
  experienceStyles.rel = 'stylesheet';
  experienceStyles.href = 'experience.css?v=1';
  document.head.appendChild(experienceStyles);

  const navMenu = document.querySelector('#nav nav');
  const podcastNav = navMenu?.querySelector('a[href="#podcast"]');
  if (navMenu && podcastNav && !navMenu.querySelector('a[href="#docencia"]')) {
    const teachingNav = document.createElement('a');
    teachingNav.href = '#docencia';
    teachingNav.className = 'docencia-link';
    teachingNav.textContent = 'Docencia';
    navMenu.insertBefore(teachingNav, podcastNav);
  }

  const heroMeta = document.querySelector('.hero-meta');
  if (heroMeta && !heroMeta.querySelector('[data-teaching-meta]')) {
    const teachingMeta = document.createElement('span');
    teachingMeta.dataset.teachingMeta = 'true';
    teachingMeta.textContent = 'Docencia universitaria · 2020–2026';
    heroMeta.appendChild(teachingMeta);
  }

  const podcastSection = document.getElementById('podcast');
  if (podcastSection && !document.getElementById('docencia')) {
    const section = document.createElement('section');
    section.id = 'docencia';
    section.className = 'teaching-section shell';
    section.innerHTML = `
      <div class="section-kicker reveal"><span>05</span><p>DOCENCIA UNIVERSITARIA</p></div>
      <div class="teaching-head">
        <h2 class="reveal">Estrategia que se ejecuta y <span class="serif">también se enseña.</span></h2>
        <p class="teaching-head-copy reveal" data-delay="80">He combinado la práctica profesional con la formación universitaria en marketing, publicidad, medios digitales y estrategia, llevando casos reales y lógica de negocio al aula.</p>
      </div>
      <div class="teaching-grid">
        <article class="teaching-card reveal">
          <div class="teaching-brand">
            <div class="teaching-logo-shell"><img src="https://pbs.twimg.com/profile_images/1800700404252250112/ppcxrRkw.jpg" alt="Universidad YMCA" loading="lazy"></div>
            <span class="teaching-period">ene. 2024 — jun. 2024</span>
          </div>
          <div class="teaching-role">
            <p class="micro">UNIVERSIDAD YMCA</p>
            <h3>Profesor universitario</h3>
            <p>Profesor de Mercadotecnia con enfoque en estrategia, posicionamiento y comunicación aplicada.</p>
            <div class="teaching-subjects"><span>Mercadotecnia política</span><span>Estrategias de publicidad y promoción</span></div>
            <div class="teaching-note">Ciudad de México · Jornada completa</div>
          </div>
        </article>
        <article class="teaching-card reveal" data-delay="70">
          <div class="teaching-brand">
            <div class="teaching-logo-shell"><img src="https://seeklogo.com/images/U/universidad-tecnologica-de-mexico-logo-7765151E17-seeklogo.com.png" alt="UNITEC" loading="lazy"></div>
            <span class="teaching-period">sept. 2023 — jun. 2024</span>
          </div>
          <div class="teaching-role">
            <p class="micro">UNITEC</p>
            <h3>Profesor universitario</h3>
            <p>Docencia en licenciatura con énfasis en marketing digital, interacción y ejecución de campañas.</p>
            <div class="teaching-subjects"><span>Mercadotecnia Digital</span><span>Promoción Interactiva</span></div>
            <div class="teaching-note">Campus Sur · Modalidad presencial</div>
          </div>
        </article>
        <article class="teaching-card reveal" data-delay="140">
          <div class="teaching-brand">
            <div class="teaching-logo-shell"><img src="https://www.google.com/s2/favicons?domain=amerike.edu.mx&sz=128" alt="AMERIKE" loading="lazy"></div>
            <span class="teaching-period">feb. 2020 — may. 2024</span>
          </div>
          <div class="teaching-role">
            <p class="micro">AMERIKE MÉXICO</p>
            <h3>Profesor de Licenciatura y Posgrado</h3>
            <p>Formación de estudiantes de licenciatura y maestría en medios, publicidad y negocios digitales.</p>
            <div class="teaching-subjects"><span>Seminario de Medios Digitales</span><span>Estrategias de Publicidad Digital</span><span>Publicidad en Dispositivos Móviles</span></div>
            <div class="teaching-note">Maestrías en Alta Dirección en Comunicación y Publicidad, Marketing Digital y Administración de Negocios Digitales y Creativos</div>
          </div>
        </article>
      </div>`;
    podcastSection.parentNode.insertBefore(section, podcastSection);
  }

  const trajectory = document.querySelector('.trajectory-names');
  if (trajectory) {
    const brands = [
      ['telat-group.com','TELAT GROUP'],
      ['darhe.com.mx','DARHE'],
      ['ipn.mx','IPN'],
      ['quierocasa.com.mx','QUIERO CASA'],
      ['grupoacir.com.mx','GRUPO ACIR'],
      ['socialand.com','SOCIALAND'],
      ['telmex.com','TELMEX']
    ];
    trajectory.innerHTML = brands.map(([domain,name]) => `<span class="trajectory-brand"><img src="https://www.google.com/s2/favicons?domain=${domain}&sz=128" alt="${name}" loading="lazy" onerror="this.style.display='none'"><span>${name}</span></span>`).join('');
  }

  const aboutCopy = document.querySelector('.about-copy');
  const credentials = aboutCopy?.querySelector('.credentials');
  if (aboutCopy && credentials && !aboutCopy.querySelector('.teaching-about')) {
    const p = document.createElement('p');
    p.className = 'teaching-about';
    p.innerHTML = '<strong>La docencia forma parte de mi perfil estratégico.</strong> Desde 2020 he impartido materias de marketing, publicidad y medios digitales en licenciatura y posgrado, conectando teoría, evidencia y casos reales de negocio.';
    aboutCopy.insertBefore(p, credentials);
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  const nav = document.getElementById('nav');
  const progress = document.querySelector('.scroll-progress span');
  const heroCard = document.querySelector('.hero-card');

  reveals.forEach(el => {
    const delay = el.dataset.delay;
    if (delay) el.style.setProperty('--delay', `${delay}ms`);
  });

  if (reduced) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(y / max, 1) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    }
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (!reduced && heroCard && window.matchMedia('(pointer:fine)').matches) {
    heroCard.addEventListener('pointermove', (e) => {
      const r = heroCard.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      heroCard.style.transform = `perspective(1100px) rotateX(${-y * 2.4}deg) rotateY(${x * 2.4}deg) translateZ(0)`;
    });
    heroCard.addEventListener('pointerleave', () => {
      heroCard.style.transform = 'perspective(1100px) rotateX(0) rotateY(0) translateZ(0)';
    });
  }
})();
