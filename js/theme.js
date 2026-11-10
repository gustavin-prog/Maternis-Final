(function () {
  var STORAGE_KEY = 'maternis-theme';

  function getPreferredTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) {}
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme, persist) {
    var next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.setAttribute('data-bs-theme', next);
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    }
    updateToggle(next);
  }

  function updateToggle(theme) {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    var isDark = theme === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
    btn.setAttribute('title', isDark ? 'Modo claro' : 'Modo escuro');
    btn.innerHTML = '<span class="theme-icon" aria-hidden="true">' + (isDark ? '☀️' : '🌙') + '</span>';
  }

  function shouldShowToggle() {
    var path = (window.location.pathname || '').replace(/\\/g, '/');
    var file = path.substring(path.lastIndexOf('/') + 1).toLowerCase();
    return file === 'index.html' || file === 'menu.html' || file === '';
  }

  function ensureToggle() {
    if (!shouldShowToggle() || document.querySelector('.theme-toggle')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark', true);
    });
    document.body.appendChild(btn);
    updateToggle(document.documentElement.getAttribute('data-theme') || getPreferredTheme());
  }

  // API mínima global (útil para depuração)
  window.maternisTheme = {
    apply: function (theme) { applyTheme(theme, true); },
    get: function () { return document.documentElement.getAttribute('data-theme') || 'light'; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureToggle);
  } else {
    ensureToggle();
  }

  // Reage a mudanças do sistema apenas se o usuário não tiver preferência salva
  try {
    var mql = window.matchMedia('(prefers-color-scheme: dark)');
    var handler = function (e) {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch (err) {}
      applyTheme(e.matches ? 'dark' : 'light', false);
    };
    if (mql.addEventListener) mql.addEventListener('change', handler);
    else if (mql.addListener) mql.addListener(handler);
  } catch (e) {}
})();
