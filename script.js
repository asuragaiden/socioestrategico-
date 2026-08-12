(() => {
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
