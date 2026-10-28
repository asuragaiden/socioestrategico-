/* Public-site interaction events. No form values, phone numbers or URL queries. */
(function () {
  'use strict';
  if (window.__seInteractionTracking) return;
  window.__seInteractionTracking = true;
  function emit(name, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({
      event: name, page_path: location.pathname,
      section_id: 'none', button_location: 'none', service: 'general',
      contact_channel: 'none', link_path: 'none'
    }, params));
  }
  function section(el) {
    var parent = el.closest('section[id]');
    return parent ? parent.id : 'none';
  }
  function placement(el) {
    if (el.closest('.whatsapp-float')) return 'floating';
    if (el.closest('header')) return 'header';
    if (el.closest('footer')) return 'footer';
    return section(el);
  }
  document.addEventListener('click', function (event) {
    var target = event.target instanceof Element ? event.target : null;
    var link = target && target.closest('a[href]');
    if (!link) return;
    var url;
    try { url = new URL(link.href, location.href); } catch (_) { return; }
    var params = {
      section_id: section(link), button_location: placement(link),
      service: link.dataset.service || 'general'
    };
    if (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com') {
      params.contact_channel = 'whatsapp';
      emit('contact_intent', params);
    } else if (url.origin === location.origin) {
      params.link_path = url.pathname;
      if (url.hash && url.pathname === location.pathname) {
        params.link_path = url.hash;
        emit('section_navigation', params);
      } else {
        emit('internal_link_click', params);
      }
    }
  });
  function observeSections() {
    if (!('IntersectionObserver' in window)) return;
    var seen = new Set();
    var timers = new Map();
    function clear(el) {
      clearTimeout(timers.get(el));
      timers.delete(el);
    }
    function visible(el) {
      var r = el.getBoundingClientRect();
      var height = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      return !document.hidden && height >= Math.min(r.height, window.innerHeight) * 0.5;
    }
    function update(el) {
      if (seen.has(el) || !visible(el)) { clear(el); return; }
      if (timers.has(el)) return;
      timers.set(el, setTimeout(function () {
        timers.delete(el);
        if (!visible(el) || seen.has(el)) return;
        seen.add(el);
        emit('section_view', { section_id: el.id, visible_time_ms: 1000 });
        observer.unobserve(el);
      }, 1000));
    }
    var sections = Array.from(document.querySelectorAll('main section[id]'));
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { update(entry.target); });
    }, { threshold: Array.from({length: 21}, function (_, i) { return i / 20; }) });
    sections.forEach(function (el) { observer.observe(el); });
    var queued = false;
    function refresh() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        sections.forEach(update);
      });
    }
    window.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('resize', refresh);
    document.addEventListener('visibilitychange', function () {
      sections.forEach(clear);
      refresh();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeSections, { once: true });
  } else { observeSections(); }
})();
