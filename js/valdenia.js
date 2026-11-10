/* Maternis - Assistente Valdênia
   Chat flutuante com respostas baseadas em palavras-chave. */
(function () {
  'use strict';

  if (window.Valdenia) return;

  /* =========================================================
     BASE DE CONHECIMENTO
     ========================================================= */
  const baseConhecimentoValdenia = [
    // 1. VACINAS E CALENDÁRIO DE IMUNIZAÇÃO
    {
      keywords: ['vacina', 'vacinação', 'gotinha', 'imunização', 'dose', 'cartão', 'febre da vacina', 'injeção', 'posto de saúde', 'calendário', 'reação da vacina', 'lugar da picada', 'inchado', 'perna dura', 'febre pós vacina', 'atrasada', 'perdeu a data', 'BCG', 'pentavalente', 'poliomielite', 'rotavírus', 'pneumocócica', 'meningocócica', 'febre amarela', 'sarampo', 'tríplice', 'varicela', 'hepatite', 'gotinhas', 'bracinho', 'perninha', 'choro após vacina', 'dor no local', 'SUS', 'posto', 'ubs'],
      resposta: "O acompanhamento das vacinas é fundamental para proteger a saúde do bebê! Consulte sempre o cartão de imunização na aba de Saúde do Maternis. Reações leves como febre baixa, irritabilidade e leve inchaço no local da aplicação são normais e passam em até 48h. Para dor ou febre, consulte o pediatra sobre analgésicos seguros."
    },

    // 2. SONO E ROTINA DE DESCANSO
    {
      keywords: ['sono', 'dormir', 'acordando', 'noite', 'cochilo', 'insônia', 'cansada', 'madrugada', 'rotina de sono', 'dormir mal', 'acorda muito', 'não dorme', 'choro para dormir', 'sono agitado', 'dorme no colo', 'acorda chorando', 'soneca', 'sono diurno', 'dormir de bruços', 'morte súbita', 'quarto escuro', 'ruído branco', 'chupeta', 'regressão do sono', 'berço', 'naninha', 'exausta', 'acorda 5 vezes', 'dormir mamando'],
      resposta: "Recém-nascidos dormem entre 14 e 17 horas por dia, em ciclos curtos devido à fome. Para ajudar à noite, mantenha o ambiente com luz baixa e ruído branco suave. Por segurança contra a morte súbita, coloque sempre o bebê de barriga para cima no berço, sem travesseiros ou cobertores soltos."
    },

    // 3. CHORO E COMPORTAMENTO INCONSOLÁVEL
    {
      keywords: ['choro', 'chorando', 'grito', 'irritado', 'acalmado', 'inconsolável', 'berro', 'esbaforido', 'choro noturno', 'choro sem parar', 'choro de dor', 'choro de fome', 'choradeira', 'choro estridente', 'irritação', 'estressado', 'birra', 'enjoadinho', 'manhoso', 'grude', 'quer colo', 'colinho', 'braço', 'chororô', 'choro escândalo'],
      resposta: "O choro é a principal forma de comunicação do bebê. Verifique os passos essenciais em ordem: fome, fralda suja, calor/frio, sono excessivo ou gases. O contato pele a pele, o balanço suave e o som de 'shhh' ajudam bastante a acalmar."
    },

    // 4. AMAMENTAÇÃO E PEGA CORRETA
    {
      keywords: ['amamentar', 'leite', 'peito', 'mama', 'fome', 'sucção', 'fissura', 'dor ao amamentar', 'bico do peito', 'leite empedrado', 'mastite', 'produção de leite', 'pouco leite', 'leite fraco', 'mama toda hora', 'peito rachado', 'sangrando', 'bomba tira leite', 'bico de silicone', 'pega errada', 'freio lingual', 'língua presa', 'mama 5 minutos', 'leite secou'],
      resposta: "A amamentação em livre demanda nutre e fortalece o vínculo. Certifique-se de que a pega está correta — abocanhando boa parte da aréola, não apenas o bico — para evitar fissuras. Se o peito empedrar ou houver dor intensa, procure ajuda de um banco de leite ou obstetra."
    },

    // 5. FÓRMULA, MAMADEIRA E ALIMENTAÇÃO
    {
      keywords: ['formula', 'mamadeira', 'nan', 'aptamil', 'enfamil', 'milnutri', 'leite em pó', 'trocar de leite', 'formula engorda', 'engasgo', 'arroto', 'refluxo', 'água', 'pode dar água', 'suco', 'vitamina', 'ferro', 'papinha', 'introdução alimentar', 'purê', 'fruta raspada', 'papinha salgada', 'engasgou com leite'],
      resposta: "Caso utilize fórmula, siga rigorosamente as instruções de preparo e esterilização do pediatra. Lembre-se sempre de fazer o bebê arrotar após as mamadas para evitar refluxo. Água pura e introdução alimentar só são recomendadas pelo Ministério da Saúde após os 6 meses."
    },

    // 6. CÓLICAS, GASES E DESCONFORTO ABDOMINAL
    {
      keywords: ['cólica', 'coliquinha', 'barrigudinho', 'pernas encolhidas', 'dor na barriga', 'choro de cólica', 'gases preso', 'pum preso', 'massagem na barriga', 'compressa morna', 'remédio para cólica', 'simeticona', 'luftal', 'colicaliv', 'chá para cólica', 'barriga dura', 'barriga inchada'],
      resposta: "As cólicas são comuns nos primeiros meses devido à imaturidade digestiva. Para aliviar, faça massagens circulares no sentido horário na barriguinha, flexione as perninhas em direção ao peito e use compressas mornas. Remédios só devem ser usados com orientação do pediatra."
    },

    // 7. INTESTINO, COCOS E CONSTIPAÇÃO
    {
      keywords: ['intestino preso', 'fezes', 'coco', 'coco verde', 'coco com muco', 'coco duro', 'constipação', 'dificuldade para evacuar', 'dias sem fazer coco', 'esganiçado', 'fazendo força', 'pum fedido', 'espuma no coco', 'liquido', 'diarreia amarela', 'esverdeado', 'coco preto', 'coco com sangue', 'nao faz coco ha 3 dias'],
      resposta: "A frequência das evacuações varia muito, especialmente em bebês em aleitamento materno. Coco com muco persistente, sangue ou fezes muito duras com sinais de dor exigem avaliação do pediatra. Monitore se há sinais de desidratação se houver diarreia líquida."
    },

    // 8. FEBRE, GRIPE E SINTOMAS RESPIRATÓRIOS
    {
      keywords: ['febre', 'temperatura', 'quente', 'doente', 'gripe', 'tosse', 'resfriado', 'nariz entupido', 'catarro', 'espirro', 'respiração rápida', 'costelinha puxando', 'apática', 'prostrado', 'mole', 'tosse cachorrinho', 'laringite', 'bronquiolite', 'chiado no peito', 'falta de ar', 'unha roxa', 'labios roxos', 'desidratação', 'olhos fundos'],
      resposta: "⚠️ **Atenção:** Febre em bebês com menos de 3 meses exige atendimento médico imediato no pronto-socorro. Para bebês maiores, se houver apatia extrema, lábios roxos ou dificuldade para respirar (costelinhas afundando), procure o hospital sem hesitar."
    },

    // 9. ACIDENTES, QUEDAS E URGÊNCIAS
    {
      keywords: ['urgência', 'hospital', 'socorro', 'pronto socorro', 'queda', 'bateu a cabeça', 'caiu da cama', 'caiu do sofa', 'bateu a testa', 'inchaço cabeca', 'vomito com sangue', 'mancha vermelha nao some', 'picada de inseto', 'alergia', 'brotoejas', 'convulsão', 'convulsao febril'],
      resposta: "Em caso de quedas com perda de consciência, vômitos persistentes, choro incontrolável prolongado ou convulsões, leve o bebê imediatamente ao pronto-socorro mais próximo para avaliação neurológica e geral."
    },

    // 10. CUIDADOS DIÁRIOS E HIGIENE CORPORAL
    {
      keywords: ['banho', 'cotovelo', 'temperatura da água', 'banheira', 'corrente de ar', 'cabelo', 'crosta láctea', 'caspa', 'olhinho', 'laga', 'sujeira no olho', 'roupa', 'amaciante', 'sabonete', 'shampoo', 'cortar unha', 'tesourinha', 'lixa', 'ouvido sujo', 'cerume', 'cotonete', 'hastes flexíveis'],
      resposta: "O banho deve ser rápido e em ambiente sem correntes de ar, com água morna testada no cotovelo. Nunca introduza cotonetes no canal auditivo ou dentro do narizinho. Para limpar os olhos, utilize gaze limpa umedecida em soro fisiológico ou água filtrada."
    },

    // 11. COTO UMBILICAL E CUIDADOS COM A PELE
    {
      keywords: ['umbigo', 'coto umbilical', 'alcool 70', 'queda do umbigo', 'pele', 'assadura', 'talco', 'pomada', 'bepantol', 'oxido de zinco', 'vermelhidão na virilha', 'pele descascando', 'espinha no bebe', 'acne neonatal', 'milium', 'bolinhas brancas rosto', 'banho de sol', 'ictericia', 'amarelado'],
      resposta: "O coto umbilical deve ser limpo a cada troca de fralda com álcool 70% até cair naturalmente. Para evitar assaduras, faça trocas frequentes, limpe bem as dobras e utilize pomadas de barreira. Bolinhas brancas no rosto (milium) ou acne neonatal costumam sumir sozinhas."
    },

    // 12. NARIZINHO, RESPIRAÇÃO E SECREÇÃO
    {
      keywords: ['nariz entupido', 'soro fisiológico', 'aspirador nasal', 'limpeza do nariz', 'catarro preso', 'respiração ronca', 'coriza', 'narizinho trancado', 'inalação', 'nebulização'],
      resposta: "Bebês respiram naturalmente pelo nariz, por isso o narizinho entupido incomoda bastante. Use gotas de soro fisiológico prescritas para fluidificar a secreção e utilize um aspirador nasal de forma suave apenas externamente quando necessário."
    },

    // 13. DESENVOLVIMENTO E MARCOS DO CRESCIMENTO
    {
      keywords: ['desenvolvimento', 'mesversario', 'meses', 'peso', 'crescimento', 'engatinhar', 'andar', 'falar', 'sorrir', 'sorriso social', 'olhar nos olhos', 'sustentar a cabeça', 'virar de lado', 'sentar', 'salto de desenvolvimento', 'fase difícil', 'crise de crescimento', 'tummy time', 'bruços', 'rolar', 'dentes', 'dentinho', 'coceira na gengiva', 'mordedor', 'salivação', 'babando'],
      resposta: "Cada bebê tem seu próprio ritmo, mas existem marcos esperados para cada mês! Na aba de Acompanhamento do Maternis, você acompanha os saltos de desenvolvimento e fases de dentição. O 'tummy time' (tempo de bruços acordado) ajuda a fortalecer a musculatura."
    },

    // 14. SAÚDE MATERNAL E PÓS-PARTO (PUERPÉRIO)
    {
      keywords: ['mae', 'pós-parto', 'resguardo', 'quarentena', 'depressão', 'baby blues', 'tristeza', 'chorando à toa', 'esgotada', 'esgotamento', 'cansaço extremo', 'pontos', 'cesárea', 'parto normal', 'sangramento', 'lóquios', 'dor nas costas', 'dor na pelve', 'cabelo caindo', 'queda de cabelo', 'solidão', 'ansiedade', 'medo', 'culpa materna', 'pontos da cesarea doendo', 'cheiro ruim loquios', 'febre pos parto', 'nao sinto amor pelo bebe', 'depressao pos parto'],
      resposta: "O puerpério é uma fase de enorme transformação física e emocional. O 'baby blues' (sensibilidade e choro nos primeiros dias) é comum, mas se houver tristeza profunda persistente, febre pós-parto ou dor intensa nos pontos, procure apoio médico e da sua rede de apoio. Você não está sozinha!"
    },

    // 15. ORIENTAÇÕES GERAIS E SEGURANÇA DOMÉSTICA
    {
      keywords: ['segurança', 'casa segura', 'tomada', 'quarto do bebe', 'produto de limpeza', 'engasgo preventivo', 'primeiros socorros', 'visita', 'bebe na rua', 'passeio', 'sol', 'protetor solar', 'repelente', 'idade do repelente'],
      resposta: "Mantenha produtos de limpeza trancados e protetores em todas as tomadas acessíveis conforme o bebê começar a explorar a casa. Evite passar protetor solar ou repelente em menores de 6 meses sem recomendação expressa do pediatra. Em caso de dúvidas gerais, consulte sempre o profissional de saúde que acompanha a criança."
    }
  ];

  /* =========================================================
     NORMALIZAÇÃO E PONTUAÇÃO
     ========================================================= */
  function normalizar(texto) {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const PALAVRAS_VAZIAS = new Set([
    'a', 'o', 'as', 'os', 'um', 'uma', 'de', 'da', 'do', 'das', 'dos',
    'e', 'ou', 'em', 'no', 'na', 'nos', 'nas', 'com', 'por', 'para',
    'que', 'meu', 'minha', 'meus', 'minhas', 'seu', 'sua', 'ao', 'aos',
    'é', 'ser', 'está', 'esta', 'muito', 'mais', 'como', 'sobre'
  ]);

  // Remove fórmulas de cortesia do início da pergunta
  // (ex.: "quero saber sobre vacina" -> "vacina").
  function prepararEntrada(entrada) {
    return normalizar(entrada)
      .replace(/\b(quero|queria|gostaria|preciso|posso)\s+(de\s+)?(saber|entender|conhecer)\s*(sobre|a respeito de)?\s*/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Termos comuns que apontam para assuntos já cobertos pela base.
  const SINONIMOS = {
    gas: ['colica'],
    gases: ['colica'],
    refluxo: ['arroto'],
    regurgitacao: ['arroto'],
    xixi: ['assadura'],
    fralda: ['assadura'],
    fraldas: ['assadura'],
    assando: ['assadura'],
    febril: ['febre'],
    mamada: ['amamentar'],
    mamadas: ['amamentar'],
    pezinho: ['vacina'],
    imunizacao: ['vacina'],
    unha: ['cortar unha'],
    unhas: ['cortar unha'],
    maes: ['mae']
  };

  function expandirSinonimos(textoNormalizado) {
    const extras = [];
    textoNormalizado.split(' ').forEach(function (palavra) {
      if (SINONIMOS[palavra]) extras.push.apply(extras, SINONIMOS[palavra]);
    });
    return extras.length ? textoNormalizado + ' ' + extras.join(' ') : textoNormalizado;
  }

  function radical(palavra) {
    let p = palavra;
    if (p.length <= 3) return p;

    const sufixos = [
      'acoes', 'acao', 'icoes', 'icao', 'ando', 'endo', 'indo',
      'ado', 'ido', 'aria', 'mente', 'oes', 'aes', 'ais', 'eis',
      'ois', 'ns', 'res', 'zes', 'ar', 'er', 'ir', 'ou', 'am',
      'em', 'as', 'es', 'os', 'us', 'a', 'e', 'o', 's'
    ];

    for (let i = 0; i < sufixos.length; i++) {
      const sufixo = sufixos[i];
      if (p.endsWith(sufixo) && p.length - sufixo.length >= 3) {
        p = p.slice(0, -sufixo.length);
        break;
      }
    }

    return p;
  }

  function extrairTokens(textoNormalizado) {
    return new Set(
      textoNormalizado
        .split(' ')
        .filter(function (t) { return t.length >= 3 && !PALAVRAS_VAZIAS.has(t); })
    );
  }

  function extrairRadicais(textoNormalizado) {
    return new Set(
      Array.from(extrairTokens(textoNormalizado)).map(radical)
    );
  }

  function calcularRelevancia(entrada, item) {
    const texto = expandirSinonimos(prepararEntrada(entrada));
    const tokens = extrairTokens(texto);
    const radicais = extrairRadicais(texto);
    let pontuacao = 0;

    item.keywords.forEach(function (palavraChave) {
      const chave = normalizar(palavraChave);
      if (!chave) return;

      const partes = chave.split(' ').filter(Boolean);

      // Palavras curtas (ex.: "nan", "sol", "SUS") exigem correspondência
      // exata ou por radical para não casarem dentro de outras palavras.
      if (partes.length === 1 && chave.length <= 4) {
        const exata = tokens.has(chave);
        const porRadical = chave.length >= 4 && radicais.has(radical(chave));
        if (exata || porRadical) {
          pontuacao += 6 + (exata ? 2 : 0);
        }
        return;
      }

      if (texto.includes(chave)) {
        // Frases completas valem mais; palavras únicas também pontuam bem.
        pontuacao += 4 + partes.length * 2;
        if (tokens.has(chave)) pontuacao += 2;
      } else {
        // Correspondência parcial por tokens e radicais
        // (ex.: "vacinas" -> "vacina", "amamentação" -> "amamentar").
        const partesValidas = partes.filter(function (t) { return t.length >= 3; });
        const acertos = partesValidas.filter(function (t) {
          return tokens.has(t) || radicais.has(radical(t));
        }).length;
        if (acertos > 0) pontuacao += acertos / partesValidas.length;
      }
    });

    return pontuacao;
  }

  function encontrarResposta(entrada) {
    const texto = prepararEntrada(entrada);
    if (!texto) {
      return 'Como posso ajudar? 💗 Pergunte-me sobre vacinas, sono, amamentação, cólicas, febre, banho, desenvolvimento e outros cuidados com o bebê.';
    }

    let melhor = null;
    let melhorPontuacao = 0;

    baseConhecimentoValdenia.forEach(function (item) {
      const pontos = calcularRelevancia(entrada, item);
      if (pontos > melhorPontuacao) {
        melhorPontuacao = pontos;
        melhor = item;
      }
    });

    if (melhor && melhorPontuacao > 0) {
      return melhor.resposta;
    }

    // Saudações e agradecimentos.
    if (/\b(oi|ola|opa|bom dia|boa tarde|boa noite|e ai|eae)\b/.test(texto)) {
      return 'Olá, mamãe! 💗 Eu sou a Valdênia, sua assistente de maternidade. Posso ajudar com dúvidas sobre vacinas, sono, amamentação, cólicas, febre, banho e cuidados com o bebê. Sobre o que você gostaria de saber?';
    }

    if (/\b(obrigad[ao]|obrigada|valeu|brigad[ao]|agradeco)\b/.test(texto)) {
      return 'De nada, mamãe! 💗 Estou aqui sempre que precisar. Cuide-se bem e conte comigo para o que surgir nessa jornada.';
    }

    if (/\b(quem e voce|seu nome|qual seu nome|quem é você)\b/.test(texto)) {
      return 'Eu sou a Valdênia, a assistente virtual do Maternis. Fui criada para acolher mães de primeira viagem com orientações práticas sobre saúde, rotina e cuidados com o bebê. Pergunte à vontade!';
    }

    return 'Ainda não encontrei uma resposta específica para essa dúvida. 💗 Experimente me perguntar sobre vacinas, sono do bebê, amamentação, choro e cólicas, febre ou cuidados diários como banho e troca de fralda. Para questões de saúde mais delicadas, procure sempre o pediatra.';
  }

  /* =========================================================
     ESTRUTURA DO CHAT
     ========================================================= */
  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'valdenia-launcher';
  launcher.id = 'valdeniaLauncher';
  launcher.setAttribute('aria-label', 'Abrir chat com a assistente Valdênia');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'valdeniaWindow');
  launcher.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>' +
    '</svg>';

  const janela = document.createElement('div');
  janela.className = 'valdenia-window';
  janela.id = 'valdeniaWindow';
  janela.setAttribute('role', 'dialog');
  janela.setAttribute('aria-labelledby', 'valdeniaTitle');
  janela.setAttribute('aria-hidden', 'true');
  janela.innerHTML =
    '<header class="valdenia-header">' +
      '<span class="valdenia-avatar" aria-hidden="true">V</span>' +
      '<div class="valdenia-header-text">' +
        '<h2 id="valdeniaTitle">Assistente Valdênia</h2>' +
        '<span class="valdenia-status"><span class="valdenia-status-dot"></span> Online agora</span>' +
      '</div>' +
      '<button type="button" class="valdenia-close" aria-label="Fechar chat">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">' +
          '<path d="M6 6l12 12M18 6L6 18"/>' +
        '</svg>' +
      '</button>' +
    '</header>' +
    '<div class="valdenia-messages" id="valdeniaMessages" role="log" aria-live="polite"></div>' +
    '<div class="valdenia-suggestions" id="valdeniaSuggestions">' +
      '<button type="button" class="valdenia-chip" data-question="Vacinas do bebê">Vacinas</button>' +
      '<button type="button" class="valdenia-chip" data-question="Sono do bebê">Sono</button>' +
      '<button type="button" class="valdenia-chip" data-question="Amamentação">Amamentação</button>' +
      '<button type="button" class="valdenia-chip" data-question="Febre no bebê">Febre</button>' +
    '</div>' +
    '<form class="valdenia-form" id="valdeniaForm">' +
      '<input type="text" class="valdenia-input" id="valdeniaInput" placeholder="Escreva sua dúvida..." autocomplete="off" aria-label="Escreva sua mensagem para a Valdênia">' +
      '<button type="submit" class="valdenia-send" aria-label="Enviar mensagem">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>' +
        '</svg>' +
      '</button>' +
    '</form>';

  document.body.appendChild(launcher);
  document.body.appendChild(janela);

  const campoMensagens = janela.querySelector('#valdeniaMessages');
  const formulario = janela.querySelector('#valdeniaForm');
  const input = janela.querySelector('#valdeniaInput');
  const botaoFechar = janela.querySelector('.valdenia-close');
  const sugestoes = janela.querySelector('#valdeniaSuggestions');

  let aberto = false;
  let boasVindasEnviadas = false;

  /* =========================================================
     RENDERIZAÇÃO DE MENSAGENS
     ========================================================= */
  function formatarTexto(texto) {
    const seguro = String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return seguro.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  function rolarParaFim() {
    campoMensagens.scrollTop = campoMensagens.scrollHeight;
  }

  function adicionarMensagem(texto, autor) {
    const linha = document.createElement('div');
    linha.className = 'valdenia-msg ' + (autor === 'user' ? 'valdenia-msg-user' : 'valdenia-msg-bot');

    if (autor !== 'user') {
      const avatar = document.createElement('span');
      avatar.className = 'valdenia-msg-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = 'V';
      linha.appendChild(avatar);
    }

    const balao = document.createElement('div');
    balao.className = 'valdenia-bubble';

    if (autor === 'user') {
      balao.textContent = texto;
    } else {
      balao.innerHTML = formatarTexto(texto);
    }

    linha.appendChild(balao);
    campoMensagens.appendChild(linha);
    rolarParaFim();
    return linha;
  }

  function mostrarDigitando() {
    const linha = document.createElement('div');
    linha.className = 'valdenia-msg valdenia-msg-bot';
    linha.id = 'valdeniaTyping';

    const avatar = document.createElement('span');
    avatar.className = 'valdenia-msg-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = 'V';

    const balao = document.createElement('div');
    balao.className = 'valdenia-bubble valdenia-typing';
    balao.setAttribute('aria-label', 'Valdênia está digitando');
    balao.innerHTML = '<span></span><span></span><span></span>';

    linha.appendChild(avatar);
    linha.appendChild(balao);
    campoMensagens.appendChild(linha);
    rolarParaFim();
    return linha;
  }

  /* =========================================================
     ABRIR / FECHAR
     ========================================================= */
  function abrirChat() {
    if (aberto) return;
    aberto = true;

    janela.classList.add('is-open');
    janela.setAttribute('aria-hidden', 'false');
    launcher.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', 'Fechar chat com a assistente Valdênia');

    if (!boasVindasEnviadas) {
      boasVindasEnviadas = true;
      adicionarMensagem(
        'Olá, mamãe! 💗 Eu sou a Valdênia, sua assistente virtual do Maternis. Posso tirar dúvidas sobre vacinas, sono, amamentação, cólicas, febre e cuidados diários com o bebê. Como posso ajudar hoje?',
        'bot'
      );
    }

    window.setTimeout(function () {
      input.focus();
    }, 180);
  }

  function fecharChat() {
    if (!aberto) return;
    aberto = false;

    janela.classList.remove('is-open');
    janela.setAttribute('aria-hidden', 'true');
    launcher.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', 'Abrir chat com a assistente Valdênia');
    launcher.focus();
  }

  function alternarChat() {
    if (aberto) fecharChat();
    else abrirChat();
  }

  /* =========================================================
     ENVIO E RESPOSTA
     ========================================================= */
  function enviarMensagem(texto) {
    const limpo = String(texto || '').trim();
    if (!limpo) return;

    adicionarMensagem(limpo, 'user');
    input.value = '';
    sugestoes.style.display = 'none';

    const digitando = mostrarDigitando();
    const resposta = encontrarResposta(limpo);

    window.setTimeout(function () {
      if (digitando && digitando.parentNode) {
        digitando.parentNode.removeChild(digitando);
      }
      adicionarMensagem(resposta, 'bot');
      if (aberto) input.focus();
    }, 650);
  }

  /* =========================================================
     EVENTOS
     ========================================================= */
  launcher.addEventListener('click', alternarChat);
  botaoFechar.addEventListener('click', fecharChat);

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    enviarMensagem(input.value);
  });

  sugestoes.addEventListener('click', function (evento) {
    const chip = evento.target.closest('.valdenia-chip');
    if (!chip) return;
    enviarMensagem(chip.getAttribute('data-question') || chip.textContent);
  });

  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && aberto) {
      // Não fecha o chat quando um modal do site estiver aberto por cima.
      if (document.querySelector('.modal.show')) return;
      fecharChat();
    }
  });

  /* =========================================================
     API PÚBLICA
     ========================================================= */
  window.Valdenia = {
    abrir: abrirChat,
    fechar: fecharChat,
    alternar: alternarChat,
    perguntar: enviarMensagem,
    baseConhecimento: baseConhecimentoValdenia
  };
})();
