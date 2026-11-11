/* Maternis - Navegação condicional
   O menu inferior só é injetado quando a página atual é, estritamente,
   uma das seis funcionalidades do app. Index e Menu nunca o recebem. */
(function () {
  'use strict';

  var FUNCIONALIDADES = [
    { slug: 'gestacao', arquivo: 'gestacao.html', rotulo: 'Gestação', icone: 'fa-solid fa-heart-pulse' },
    { slug: 'bebe', arquivo: 'bebe.html', rotulo: 'Bebê', icone: 'fa-solid fa-baby' },
    { slug: 'vacinas', arquivo: 'vacinas.html', rotulo: 'Vacinas', icone: 'fa-solid fa-syringe' },
    { slug: 'consultas', arquivo: 'consultas.html', rotulo: 'Consultas', icone: 'fa-solid fa-calendar-check' },
    { slug: 'dicas', arquivo: 'dicas.html', rotulo: 'Dicas', icone: 'fa-solid fa-lightbulb' },
    { slug: 'diario', arquivo: 'diario.html', rotulo: 'Diário do Bebê', icone: 'fa-solid fa-book-open' }
  ];

  function obterSlugAtual() {
    var caminho = (window.location.pathname || '').replace(/\\/g, '/');
    var arquivo = caminho.substring(caminho.lastIndexOf('/') + 1).toLowerCase();

    if (!arquivo) return null;

    // Aceita tanto "gestacao.html" quanto URLs limpas como "/gestacao".
    return arquivo.replace(/\.html?$/, '');
  }

  function criarBarraInferior(slugAtual) {
    var nav = document.createElement('nav');
    nav.className = 'maternis-bottom-nav';
    nav.setAttribute('aria-label', 'Navegação rápida entre funcionalidades');

    var grade = document.createElement('div');
    grade.className = 'maternis-bottom-grid';

    FUNCIONALIDADES.forEach(function (funcionalidade) {
      var link = document.createElement('a');
      link.className = 'maternis-bottom-link';
      link.href = funcionalidade.arquivo;
      link.title = funcionalidade.rotulo;
      link.setAttribute('aria-label', funcionalidade.rotulo);

      if (funcionalidade.slug === slugAtual) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }

      var icone = document.createElement('i');
      icone.className = funcionalidade.icone;
      icone.setAttribute('aria-hidden', 'true');

      var rotulo = document.createElement('span');
      rotulo.textContent = funcionalidade.rotulo;

      link.appendChild(icone);
      link.appendChild(rotulo);
      grade.appendChild(link);
    });

    nav.appendChild(grade);
    return nav;
  }

  function iniciar() {
    if (!document.body) return;

    var slugAtual = obterSlugAtual();
    var paginaPermitida = FUNCIONALIDADES.some(function (funcionalidade) {
      return funcionalidade.slug === slugAtual;
    });

    if (!paginaPermitida) {
      document.body.classList.remove('has-bottom-nav');
      return;
    }

    if (document.querySelector('.maternis-bottom-nav')) return;

    document.body.classList.add('has-bottom-nav');
    document.body.appendChild(criarBarraInferior(slugAtual));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
