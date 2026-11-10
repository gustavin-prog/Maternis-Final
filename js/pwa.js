/* Maternis - Registro do PWA
   O Service Worker só pode ser registrado em HTTP/HTTPS (não funciona em file://). */
(function () {
  'use strict';

  if (!('serviceWorker' in navigator)) return;

  var protocol = window.location.protocol;
  if (protocol !== 'http:' && protocol !== 'https:') return;

  function registrar() {
    navigator.serviceWorker
      .register('sw.js', { scope: './' })
      .then(function (registration) {
        // Verifica se há uma versão nova do app em segundo plano.
        if (registration.update) registration.update();
      })
      .catch(function (erro) {
        console.warn('[Maternis PWA] Não foi possível registrar o Service Worker:', erro);
      });
  }

  if (document.readyState === 'complete') {
    registrar();
  } else {
    window.addEventListener('load', registrar);
  }
})();
