(() => {
  window.dataLayer = window.dataLayer || [];
  const push = (event, params = {}) => window.dataLayer.push({ event, ...params });

  document.addEventListener('DOMContentLoaded', () => {
    push('mapa_view', { funnel: 'mapa' });

    document.getElementById('start')?.addEventListener('click', () => {
      push('mapa_start', { funnel: 'mapa' });
    });

    document.getElementById('next')?.addEventListener('click', () => {
      const label = document.getElementById('stepLabel')?.textContent || '';
      const match = label.match(/Paso\s+(\d+)/i);
      const step = match ? Number(match[1]) : null;
      if (step) push('mapa_step_continue', { funnel: 'mapa', step_number: step });
    });

    document.getElementById('leadForm')?.addEventListener('submit', () => {
      push('mapa_lead_submit', { funnel: 'mapa' });
    });

    document.getElementById('wa')?.addEventListener('click', () => {
      const score = Number(document.getElementById('score')?.textContent || 0);
      const level = document.getElementById('level')?.textContent || '';
      push('mapa_whatsapp_click', { funnel: 'mapa', mapa_score: score, mapa_level: level });
    });

    document.getElementById('restart')?.addEventListener('click', () => {
      push('mapa_restart', { funnel: 'mapa' });
    });
  });
})();