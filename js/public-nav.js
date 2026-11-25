/* Maternis - Navegação pública
   Atualiza a área de usuário das páginas públicas e compartilha o cliente
   Supabase já configurado no projeto, sem alterar nenhuma regra de banco. */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://llktarpnobeigwgxfwwz.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_OKqhjXKeDyuon0S05JJX-g_zvIl-Kk1';

  var cliente = null;

  try {
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
      cliente = supabaseClient;
    } else if (typeof supabase !== 'undefined') {
      cliente = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  } catch (erro) {
    cliente = null;
  }

  if (cliente) {
    window.maternisPublicSupabase = cliente;
  }

  function escaparHtml(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderizarAcoes(session) {
    var area = document.getElementById('areaUsuarioHome');
    if (!area) return;

    if (session && session.user && session.user.email) {
      var nome = session.user.email.split('@')[0];

      area.innerHTML =
        '<div class="pill-user">' +
          '<span class="pill-user-name">' +
            '<i class="fa-solid fa-user-circle" style="color: #f48fb1;"></i> Olá, ' + escaparHtml(nome) +
          '</span>' +
          '<button class="pill-action pill-action-ghost" type="button" onclick="maternisPublicLogout()">' +
            '<i class="fa-solid fa-right-from-bracket"></i> Sair' +
          '</button>' +
        '</div>';
      return;
    }

    area.innerHTML =
      '<a class="pill-action pill-action-ghost" href="cadastrar.html">' +
        '<i class="fa-solid fa-user-plus"></i> Cadastrar' +
      '</a>' +
      '<a class="pill-action pill-action-primary" href="entrar.html">' +
        '<i class="fa-solid fa-arrow-right-to-bracket"></i> Entrar' +
      '</a>';
  }

  async function sair() {
    if (!confirm('Deseja realmente sair da sua conta?')) return;

    if (cliente) {
      await cliente.auth.signOut();
    }

    Object.keys(localStorage).forEach(function (chave) {
      if (chave.indexOf('sb-') === 0 || chave.toLowerCase().indexOf('supabase') !== -1) {
        localStorage.removeItem(chave);
      }
    });

    window.location.href = 'index.html';
  }

  window.maternisPublicLogout = sair;

  if (!cliente) {
    renderizarAcoes(null);
    return;
  }

  cliente.auth.getSession()
    .then(function (resultado) {
      renderizarAcoes(resultado && resultado.data ? resultado.data.session : null);
    })
    .catch(function () {
      renderizarAcoes(null);
    });

  cliente.auth.onAuthStateChange(function (evento, session) {
    renderizarAcoes(session);
  });
})();
