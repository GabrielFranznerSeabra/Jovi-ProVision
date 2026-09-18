/* ==========================================================================
   JOVI ProVision — script.js
   Organização: ESTADO → FILTROS → UI → EVENTOS → INIT

   Regra central do arquivo: existe UMA tabela de controles (CONTROLES) e UM
   objeto de estado. O painel do celular, os quatro cards, o painel-guia da
   Seção 3 e os oito cards da Seção 4 são todos projeções dessa mesma tabela.
   ========================================================================== */

/* ==========================================================================
   1. ESTADO
   ========================================================================== */

/* --- Ícones (um só lugar, usados no painel, nos cards e na Seção 4) --- */
const ICONES = {
  iso:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="3.4"/><path d="M12 3.4v2.1M12 18.5v2.1M3.4 12h2.1M18.5 12h2.1M6 6l1.5 1.5M16.5 16.5 18 18M18 6l-1.5 1.5M7.5 16.5 6 18"/></svg>',
  ev:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="7.6"/></svg>',
  wb:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 3.6a8.4 8.4 0 1 0 0 16.8c1.2 0 2-.7 2-1.7 0-1.3-1-1.7-1-2.7 0-.8.7-1.4 1.6-1.4h1.5a4.3 4.3 0 0 0 4.3-4.3c0-3.8-3.8-6.7-8.4-6.7z"/><circle cx="8.3" cy="10.4" r=".9" fill="currentColor" stroke="none"/><circle cx="12" cy="8.1" r=".9" fill="currentColor" stroke="none"/><circle cx="15.6" cy="10.2" r=".9" fill="currentColor" stroke="none"/></svg>',
  foco:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 8.6V6.2A2.2 2.2 0 0 1 6.2 4h2.4M15.4 4h2.4A2.2 2.2 0 0 1 20 6.2v2.4M20 15.4v2.4a2.2 2.2 0 0 1-2.2 2.2h-2.4M8.6 20H6.2A2.2 2.2 0 0 1 4 17.8v-2.4"/><circle cx="12" cy="12" r="2.3"/></svg>',
  ss:    '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13.6 2.4 5 13.6h5.5L9.4 21.6 19 10.4h-6l.6-8z"/></svg>',
  sharp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4.5 7.5h15M4.5 12h15M4.5 16.5h15"/></svg>',
  sat:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="7.8"/><path d="M4.4 12h15.2"/></svg>',
  nr:    '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="6.5" cy="6.5" r="1.5"/><circle cx="12" cy="6.5" r="1.5"/><circle cx="17.5" cy="6.5" r="1.5"/><circle cx="6.5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="17.5" cy="12" r="1.5"/><circle cx="6.5" cy="17.5" r="1.5"/><circle cx="12" cy="17.5" r="1.5"/><circle cx="17.5" cy="17.5" r="1.5"/></svg>'
};

/* --- Tabela dos oito controles: a fonte única de verdade do projeto ---
   tipo 'lista'  = valores fotográficos escalonados (ISO, velocidade)
   tipo 'faixa'  = slider contínuo entre min e max
   tipo 'opcoes' = botões segmentados                                     */
const CONTROLES = [
  {
    id: 'iso', num: '01', cat: 'SENSIBILIDADE', pagina: 0, tipo: 'lista',
    nome: 'Controle de Luz', curto: 'Ctrl Luz', tech: 'ISO', cor: '--c-iso',
    valores: [100, 200, 400, 800, 1600, 3200], padrao: 800,
    dica: 'Mais luz em ambientes escuros. Valores altos podem adicionar granulação.',
    texto: 'Mais luz em ambientes escuros, sem menus crípticos. O slider mostra o efeito e avisa quando a granulação começa a aparecer.',
    faixa: 'ISO 100 – 3200',
    fmt: v => String(v)
  },
  {
    id: 'ev', num: '02', cat: 'EXPOSIÇÃO', pagina: 0, tipo: 'faixa',
    nome: 'Clareza da Imagem', curto: 'Clareza', tech: 'EV', cor: '--c-ev',
    min: -2, max: 2, passo: 0.1, padrao: 0.7,
    dica: 'Deixe a foto mais clara (+) ou mais escura (−). Ideal para corrigir a exposição geral.',
    texto: 'Deixe a foto mais clara (+) ou mais escura (−). Um único gesto corrige contraluz e cenas difíceis.',
    faixa: 'EV −2.0 até +2.0',
    fmt: v => (v > 0 ? '+' : '') + v.toFixed(1)
  },
  {
    id: 'wb', num: '03', cat: 'TEMPERATURA DE COR', pagina: 0, tipo: 'faixa',
    nome: 'Cores Naturais', curto: 'Cores', tech: 'WB', cor: '--c-wb',
    min: 2500, max: 8000, passo: 100, padrao: 5200,
    trilha: 'linear-gradient(90deg,#4A90D9,#8FC7E8,#F4F6FA 50%,#FFD9A0,#FFAA44)',
    legendas: ['Fria · 2500K', 'Quente · 8000K'],
    dica: 'Temperatura de cor: fria (azulada) para dias nublados, quente (amarelada) para luz solar.',
    texto: 'Fria e azulada para dias nublados, quente e dourada para a luz do fim de tarde. A pele fica real, o céu fica fiel.',
    faixa: '2500K frio – 8000K quente',
    fmt: v => v + 'K'
  },
  {
    id: 'foco', num: '04', cat: 'PRECISÃO', pagina: 0, tipo: 'opcoes',
    nome: 'Foco Inteligente', curto: 'Foco', tech: 'FOCO', cor: '--c-foco',
    opcoes: [
      { v: 'manual', r: 'Manual' }, { v: 'centro', r: 'Centro' },
      { v: 'rosto',  r: 'Rosto'  }, { v: 'objeto', r: 'Objeto' }
    ],
    padrao: 'centro',
    dica: 'Define onde a câmera foca. Toque na tela para focar em qualquer ponto.',
    texto: 'Manual, centro, rosto ou objeto. Toque na tela para focar em qualquer ponto.',
    faixa: '4 modos de foco',
    fmt: v => ({ manual: 'Manual', centro: 'Centro', rosto: 'Rosto', objeto: 'Objeto' })[v]
  },
  {
    id: 'ss', num: '05', cat: 'TEMPO', pagina: 1, tipo: 'lista',
    nome: 'Velocidade de Captura', curto: 'Veloc.', tech: 'SS', cor: '--c-ss',
    valores: [30, 60, 125, 250, 500, 1000], padrao: 500,
    rotulos: ['Lento', 'Rápido'],
    dica: 'Congela movimentos rápidos (1/1000s) ou cria efeito de movimento intencional (1/30s).',
    texto: 'Congele a gota de água em 1/1000s ou desenhe o movimento com um arrasto lento de 1/30s.',
    faixa: '1/30s – 1/1000s',
    fmt: v => '1/' + v + 's'
  },
  {
    id: 'sharp', num: '06', cat: 'DETALHE', pagina: 1, tipo: 'faixa',
    nome: 'Nitidez', curto: 'Nitidez', tech: 'SHARP', cor: '--c-sharp',
    min: -3, max: 3, passo: 1, padrao: 2,
    rotulos: ['Suave', 'Nítido'],
    dica: 'Realça contornos e detalhes. Excesso pode deixar a foto artificial.',
    texto: 'Realça contornos e microtexturas na medida certa. A IA sinaliza quando o excesso começa a deixar a foto artificial.',
    faixa: 'Suave −3 até Nítido +3',
    fmt: v => (v > 0 ? '+' : '') + v
  },
  {
    id: 'sat', num: '07', cat: 'COR', pagina: 1, tipo: 'faixa',
    nome: 'Saturação', curto: 'Satur.', tech: 'SAT', cor: '--c-sat',
    min: -3, max: 3, passo: 1, padrao: 1,
    rotulos: ['P&B', 'Vib.'],
    trilha: 'linear-gradient(90deg,#6E6E76,#B99A78,#FF8A65,#FF6FBB)',
    dica: 'Intensidade das cores. Mais vibrante = tudo colorido; menos saturado = próximo do P&B.',
    texto: 'Do preto e branco cinematográfico ao vibrante intenso, com preview instantâneo.',
    faixa: 'P&B −3 até Vibrante +3',
    fmt: v => (v > 0 ? '+' : '') + v
  },
  {
    id: 'nr', num: '08', cat: 'LIMPEZA', pagina: 1, tipo: 'opcoes', duplo: true,
    nome: 'Redução de Ruído', curto: 'Rd.Ruído', tech: 'NR', cor: '--c-nr',
    opcoes: [
      { v: 'ia',     r: 'IA Automático', sub: 'Recomendado' },
      { v: 'manual', r: 'Manual',        sub: 'Controle total' }
    ],
    padrao: 'ia',
    dica: 'Remove "granulação" em ambientes escuros. Excesso pode deixar a imagem plástica.',
    texto: 'Remove a granulação das cenas escuras preservando textura. No automático, a IA calcula a dose.',
    faixa: 'IA Automático ou Manual',
    fmt: v => (v === 'ia' ? 'Auto' : 'Manual')
  }
];

/* Acesso rápido por id: CTRL.iso, CTRL.wb ... */
const CTRL = {};
CONTROLES.forEach(c => { CTRL[c.id] = c; });

/* --- Ajuste da IA para o cenário detectado na abertura ("Cenário: Paisagem") --- */
const AJUSTE_PAISAGEM = { iso: 400, ev: 0.3, wb: 5500, foco: 'centro', ss: 500, sharp: 2, sat: 1, nr: 'ia' };

/* --- O objeto único de estado --- */
const estado = {
  modo: 'auto',          // 'auto' | 'pro'
  controleAtivo: null,   // id do controle com painel aberto, ou null
  pagina: 0,             // 0 = básica, 1 = avançada
  paginaDescoberta: false, // o usuário já trocou de página alguma vez (para a pulsação)
  zoom: 1,               // 0.85 | 1 | 1.6 | 2.6
  verOriginal: false,    // botão "Ver original" pressionado
  introFeita: false,     // a sequência de abertura já começou
  introCancelada: false, // o usuário interagiu e pulou para o estado final
  valores: { iso: 800, ev: 0.7, wb: 5200, foco: 'centro', ss: 500, sharp: 2, sat: 1, nr: 'ia' },
  capturas: []           // fotos guardadas só em memória
};

/* --- Referências do DOM --- */
const el = {};
['telefone', 'cenaImg', 'camadaWB', 'camadaGrao', 'camadaNitidez', 'camadaAgua', 'camadaFoco',
 'flash', 'badgeModo', 'visor', 'molduraFoco', 'linhaZoom', 'pontos', 'painel', 'faixaControles',
 'modoPro', 'miniatura', 'miniaturaImg', 'miniaturaWB', 'contador', 'obturador', 'btnVirar',
 'guia', 'guiaNum', 'guiaCat', 'guiaNome', 'guiaTech', 'guiaTexto', 'guiaFaixa',
 'grade8', 'btnVerOriginal', 'laboratorio', 'toastBoasVindas', 'toastCena',
 'labCelular', 'dicaPontos'
].forEach(id => { el[id] = document.getElementById(id); });

/* A tela interna é a referência para converter o toque em coordenadas da cena */
el.tela = document.querySelector('.telefone__tela');


/* ==========================================================================
   2. FILTROS
   Uma string de filter recalculada inteira a cada mudança. O que precisa de
   opacidade própria, máscara ou blend fica em camada separada.
   ========================================================================== */

/* Fator de zoom: .5x vale 0.85 na spec, mas escalar abaixo de 1 deixaria
   bordas vazias. Multiplicamos tudo pela mesma base, preservando a relação
   entre as pílulas e mantendo a imagem sempre cobrindo a tela. */
const BASE_ZOOM = 1 / 0.85;

/* Posição 0–1 de um valor dentro da faixa do seu controle. Para os controles
   escalonados isso é o índice na lista — é o que reproduz a posição do thumb
   vista nos prints (ISO 800 a ~60% da trilha, e não a 22% de uma régua linear). */
function posicao(c, valor) {
  if (c.tipo === 'lista') return c.valores.indexOf(valor) / (c.valores.length - 1);
  return (valor - c.min) / (c.max - c.min);
}

function brilhoISO(v)  { return 0.85 + posicao(CTRL.iso, v) * 0.40; }   // 0.85 – 1.25
function brilhoEV(v)   { return 0.70 + ((v + 2) / 4) * 0.65; }          // 0.70 – 1.35
function satValor(v)   { return ((v + 3) / 6) * 2; }                    // 0 – 2
function contraste(v)  { return 0.95 + ((v + 3) / 6) * 0.20; }          // 0.95 – 1.15

/* Normalização: sem ela o estado padrão (ISO 800 + EV +0.7) já sairia 24%
   mais claro que a foto original e estouraria o sol. Dividindo pelo produto
   dos padrões, o estado inicial reproduz a cena e os sliders continuam com
   exatamente a mesma amplitude da spec. */
const NORM = 1 / (brilhoISO(800) * brilhoEV(0.7));

function opacidadeGrao() {
  let o = posicao(CTRL.iso, estado.valores.iso) * 0.35;
  if (estado.valores.nr === 'ia') o /= 2;   // a IA corta a granulação pela metade
  return o;
}

function opacidadeWB() {
  const wb = estado.valores.wb;
  const d = wb < 5200 ? (5200 - wb) / 2700 : (wb - 5200) / 2800;
  return d * 0.28;
}

function corWB() { return estado.valores.wb < 5200 ? '#4A90D9' : '#FFAA44'; }

function blurSS() { return (1 - posicao(CTRL.ss, estado.valores.ss)) * 2; }

function opacidadeNitidez() {
  const s = estado.valores.sharp;
  return s > 0 ? (s / 3) * 0.16 : 0;
}

/* Recalcula e aplica TODOS os efeitos de uma vez, na ordem correta. */
function aplicarFiltros() {
  const v = estado.valores;

  el.cenaImg.style.transform = 'scale(' + (BASE_ZOOM * estado.zoom).toFixed(3) + ')';

  /* "Ver original": tira tudo e mostra a foto crua */
  if (estado.verOriginal) {
    el.cenaImg.style.filter = 'none';
    el.camadaWB.style.opacity = 0;
    el.camadaGrao.style.opacity = 0;
    el.camadaNitidez.style.opacity = 0;
    el.camadaAgua.style.setProperty('--blur-ss', '0px');
    return;
  }

  el.cenaImg.style.filter = [
    'brightness(' + (brilhoISO(v.iso) * brilhoEV(v.ev) * NORM).toFixed(3) + ')',
    'saturate(' + satValor(v.sat).toFixed(3) + ')',
    'contrast(' + contraste(v.sharp).toFixed(3) + ')'
  ].join(' ');

  el.camadaGrao.style.opacity = opacidadeGrao().toFixed(3);

  el.camadaWB.style.background = corWB();
  el.camadaWB.style.opacity = opacidadeWB().toFixed(3);

  el.camadaNitidez.style.opacity = opacidadeNitidez().toFixed(3);

  el.camadaAgua.style.setProperty('--blur-ss', blurSS().toFixed(2) + 'px');

  el.camadaFoco.dataset.ponto = v.foco;
}


/* ==========================================================================
   3. UI
   ========================================================================== */

function movimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function controleAtual() {
  return estado.controleAtivo ? CTRL[estado.controleAtivo] : null;
}

/* Valor que vai para o <input type="range">: índice nos controles escalonados */
function valorDoInput(c) {
  const v = estado.valores[c.id];
  return c.tipo === 'lista' ? c.valores.indexOf(v) : v;
}

/* Ponto onde o preenchimento da trilha deve parar: acompanha o centro do
   thumb, que nas pontas não coincide com 0% e 100% da largura. */
function pctDaTrilha(c) {
  const p = posicao(c, estado.valores[c.id]);
  const desvio = (0.5 - p) * 15;
  return 'calc(' + (p * 100).toFixed(2) + '% + ' + desvio.toFixed(2) + ' * var(--u))';
}

/* ---------- Painel do controle ativo ---------- */
function montarPainel(c) {
  let corpo = '';

  if (c.tipo === 'opcoes') {
    const botoes = c.opcoes.map(o =>
      '<button type="button" data-opcao="' + o.v + '"' +
      (estado.valores[c.id] === o.v ? ' class="esta-ativa"' : '') + '>' + o.r +
      (o.sub ? '<span class="segmentos__sub">' + o.sub + '</span>' : '') +
      '</button>'
    ).join('');
    corpo = '<div class="segmentos' + (c.duplo ? ' segmentos--duplo' : '') + '">' + botoes + '</div>';

  } else {
    const min  = c.tipo === 'lista' ? 0 : c.min;
    const max  = c.tipo === 'lista' ? c.valores.length - 1 : c.max;
    const step = c.tipo === 'lista' ? 1 : c.passo;

    const estilo = 'style="--pct:' + pctDaTrilha(c) +
      (c.trilha ? ';--trilha:' + c.trilha : '') + '"';

    corpo =
      '<div class="slider">' +
        (c.rotulos ? '<span class="slider__rotulo">' + c.rotulos[0] + '</span>' : '') +
        '<input type="range" class="slider__input' + (c.trilha ? ' slider__input--gradiente' : '') +
          '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + valorDoInput(c) + '" ' +
          estilo + ' aria-label="' + c.nome + '">' +
        (c.rotulos ? '<span class="slider__rotulo">' + c.rotulos[1] + '</span>' : '') +
        '<span class="slider__valor">' + c.fmt(estado.valores[c.id]) + '</span>' +
      '</div>' +
      (c.legendas
        ? '<div class="slider__legendas">' +
            '<span class="slider__legenda--fria">' + c.legendas[0] + '</span>' +
            '<span class="slider__legenda--quente">' + c.legendas[1] + '</span>' +
          '</div>'
        : '');
  }

  el.painel.style.setProperty('--cor', 'var(' + c.cor + ')');
  el.painel.innerHTML =
    '<div class="painel__topo">' +
      '<span class="painel__icone">' + ICONES[c.id] + '</span>' +
      '<span class="painel__nome">' + c.nome + '</span>' +
      '<span class="painel__tech">(' + c.tech + ')</span>' +
      '<button type="button" class="painel__redefinir" data-redefinir>Redefinir</button>' +
    '</div>' +
    '<p class="painel__dica">' + c.dica + '</p>' +
    corpo;

  el.painel.hidden = false;

  /* Reinicia a animação de entrada, já que o elemento é sempre o mesmo */
  el.painel.classList.remove('entrando');
  void el.painel.offsetWidth;
  el.painel.classList.add('entrando');
}

/* Atualiza o painel sem remontá-lo (usado durante as animações de valores) */
function atualizarPainel() {
  const c = controleAtual();
  if (!c || el.painel.hidden) return;

  const input = el.painel.querySelector('.slider__input');
  if (input) {
    input.value = valorDoInput(c);
    input.style.setProperty('--pct', pctDaTrilha(c));
  }

  const valor = el.painel.querySelector('.slider__valor');
  if (valor) valor.textContent = c.fmt(estado.valores[c.id]);

  el.painel.querySelectorAll('[data-opcao]').forEach(b => {
    b.classList.toggle('esta-ativa', b.dataset.opcao === estado.valores[c.id]);
  });
}

/* ---------- Faixa com os quatro cards da página corrente ---------- */
function montarFaixa() {
  el.faixaControles.innerHTML = CONTROLES
    .filter(c => c.pagina === estado.pagina)
    .map(c =>
      '<button type="button" class="card-controle" data-ctrl="' + c.id + '" ' +
        'style="--cor: var(' + c.cor + ')">' +
        '<span class="card-controle__icone">' + ICONES[c.id] + '</span>' +
        '<span class="card-controle__nome">' + c.curto + '</span>' +
        '<span class="card-controle__tech">(' + c.tech + ')</span>' +
        '<span class="card-controle__valor">' + c.fmt(estado.valores[c.id]) + '</span>' +
      '</button>'
    ).join('');
  atualizarCards();
}

function atualizarCards() {
  el.faixaControles.querySelectorAll('.card-controle').forEach(card => {
    const c = CTRL[card.dataset.ctrl];
    card.querySelector('.card-controle__valor').textContent = c.fmt(estado.valores[c.id]);
    card.classList.toggle('esta-ativa', c.id === estado.controleAtivo);
  });
}

/* ---------- Painel-guia da Seção 3 ---------- */
function renderizarGuia(c) {
  el.guia.style.setProperty('--cor', 'var(' + c.cor + ')');
  el.guiaNum.textContent   = c.num;
  el.guiaCat.textContent   = c.cat;
  el.guiaNome.textContent  = c.nome;
  el.guiaTech.textContent  = '(' + c.tech + ')';
  el.guiaTexto.textContent = c.texto;
  el.guiaFaixa.textContent = c.faixa;
}

/* ---------- Ponto único que troca o controle ativo ----------
   Tudo que depende do controle selecionado passa por aqui: painel, cards,
   moldura de foco e painel-guia. Não existe caminho alternativo, então nada
   sai de sincronia. */
function definirControleAtivo(id, opcoes) {
  opcoes = opcoes || {};

  if (!id) {                       // fecha o painel
    estado.controleAtivo = null;
    el.telefone.dataset.ctrl = '';
    el.painel.hidden = true;
    atualizarCards();
    return;
  }

  const c = CTRL[id];
  if (estado.modo !== 'pro') entrarProVision();
  if (c.pagina !== estado.pagina) definirPagina(c.pagina);

  estado.controleAtivo = id;
  el.telefone.dataset.ctrl = id;

  montarPainel(c);
  atualizarCards();
  renderizarGuia(c);

  if (opcoes.rolar) {
    el.laboratorio.scrollIntoView({
      behavior: movimentoReduzido() ? 'auto' : 'smooth',
      block: 'center'
    });
  }
}

/* Toda troca de página passa por aqui — pontinhos, arrasto na faixa e cards
   da Seção 4 —, então é aqui que a pulsação de descoberta para de vez. */
function definirPagina(p) {
  const mudou = p !== estado.pagina;

  estado.pagina = p;
  el.telefone.dataset.pagina = p;
  el.pontos.querySelectorAll('.ponto').forEach(b => {
    b.classList.toggle('esta-ativa', Number(b.dataset.pagina) === p);
  });
  montarFaixa();

  if (!mudou) return;

  if (!estado.paginaDescoberta) {
    estado.paginaDescoberta = true;
    el.pontos.classList.remove('pulsando');
  }

  /* A página avançada entra pela direita, a básica pela esquerda */
  el.faixaControles.classList.remove('vindo-direita', 'vindo-esquerda');
  void el.faixaControles.offsetWidth;
  el.faixaControles.classList.add(p === 1 ? 'vindo-direita' : 'vindo-esquerda');
}

function alternarPagina() {
  definirPagina(estado.pagina === 0 ? 1 : 0);
}

/* ---------- Dica de navegação ao lado do celular ----------
   Mede onde os pontinhos estão de fato e passa a altura para o CSS (--dica-y),
   para a seta apontar para eles mesmo quando o painel abre, fecha ou muda de
   tamanho. Só vale no desktop, onde a dica fica ao lado do aparelho. */
function posicionarDica() {
  const coluna = el.labCelular.getBoundingClientRect();
  const pontos = el.pontos.getBoundingClientRect();
  if (!pontos.height) return;      // pontinhos ocultos (modo AUTO)
  const y = pontos.top + pontos.height / 2 - coluna.top;
  el.dicaPontos.style.setProperty('--dica-y', y.toFixed(1) + 'px');
}

function definirZoom(z) {
  estado.zoom = z;
  el.linhaZoom.querySelectorAll('.pilula-zoom').forEach(b => {
    b.classList.toggle('esta-ativa', Number(b.dataset.zoom) === z);
  });
  aplicarFiltros();
}

function entrarProVision() {
  if (estado.modo === 'pro') return;
  estado.modo = 'pro';
  el.telefone.dataset.modo = 'pro';
  el.badgeModo.textContent = 'PRO Vision';
  aplicarFiltros();
  posicionarDica();
  el.dicaPontos.classList.add('esta-visivel');
}

/* ---------- Toasts ---------- */
function mostrarToast(node) {
  node.classList.remove('saindo');
  node.hidden = false;
}

function esconderToast(node, imediato) {
  if (node.hidden) return;
  if (imediato || movimentoReduzido()) { node.hidden = true; return; }
  node.classList.add('saindo');
  setTimeout(() => { node.hidden = true; node.classList.remove('saindo'); }, 300);
}

/* ---------- Animação de valores (ajuste da IA na sequência de abertura) ---------- */
let animacaoId = null;

function aplicarValores(alvo) {
  CONTROLES.forEach(c => { estado.valores[c.id] = alvo[c.id]; });
  aplicarFiltros();
  atualizarCards();
  atualizarPainel();
}

function maisProximo(lista, x) {
  return lista.reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a));
}

function arredondar(c, x) {
  if (c.passo >= 1) return Math.round(x / c.passo) * c.passo;
  return Math.round(x * 10) / 10;
}

function animarValores(alvo, ms) {
  cancelAnimationFrame(animacaoId);

  if (movimentoReduzido()) { aplicarValores(alvo); return; }

  const inicio = Object.assign({}, estado.valores);
  const t0 = performance.now();

  const passo = agora => {
    const p = Math.min(1, (agora - t0) / ms);
    const e = 1 - Math.pow(1 - p, 3);          // desaceleração suave

    CONTROLES.forEach(c => {
      const de = inicio[c.id], para = alvo[c.id];
      if (typeof para === 'number') {
        const bruto = de + (para - de) * e;
        estado.valores[c.id] = c.tipo === 'lista' ? maisProximo(c.valores, bruto) : arredondar(c, bruto);
      } else if (e >= 0.5) {
        estado.valores[c.id] = para;           // opções trocam no meio do caminho
      }
    });

    aplicarFiltros();
    atualizarCards();
    atualizarPainel();

    if (p < 1) animacaoId = requestAnimationFrame(passo);
  };

  animacaoId = requestAnimationFrame(passo);
}

/* ---------- Captura de foto ----------
   A miniatura é uma réplica em miniatura da pilha da cena com os filtros do
   momento. Nada de canvas: desenhar um JPG local num canvas o contamina e
   quebraria justamente no cenário de abrir o arquivo com duplo-clique. */
function capturar() {
  const foto = {
    filtro: el.cenaImg.style.filter,
    escala: BASE_ZOOM * estado.zoom,
    corWB: corWB(),
    opWB: estado.verOriginal ? 0 : opacidadeWB()
  };
  estado.capturas.push(foto);

  el.flash.classList.remove('disparar');
  void el.flash.offsetWidth;
  el.flash.classList.add('disparar');

  el.obturador.classList.add('disparando');
  setTimeout(() => el.obturador.classList.remove('disparando'), 130);

  el.miniaturaImg.style.filter = foto.filtro;
  el.miniaturaImg.style.transform = 'scale(' + foto.escala.toFixed(3) + ')';
  el.miniaturaWB.style.background = foto.corWB;
  el.miniaturaWB.style.opacity = foto.opWB;

  const n = estado.capturas.length;
  el.contador.textContent = n + (n === 1 ? ' foto' : ' fotos');
  el.contador.hidden = false;
}

/* ---------- Sequência de abertura ----------
   AUTO → PRO Vision → boas-vindas → cenário detectado → painel de ISO.
   Entre cada passo checamos estado.introCancelada: qualquer toque do usuário
   encerra a sequência na hora e salta para o estado final. */
function pausa(ms) {
  return new Promise(resolver => setTimeout(() => resolver(estado.introCancelada), ms));
}

async function sequenciaIntro() {
  if (estado.introFeita || estado.introCancelada) return;
  estado.introFeita = true;

  entrarProVision();
  mostrarToast(el.toastBoasVindas);
  if (await pausa(2600)) return;

  esconderToast(el.toastBoasVindas);
  if (await pausa(420)) return;

  mostrarToast(el.toastCena);
  animarValores(AJUSTE_PAISAGEM, 700);
  if (await pausa(3200)) return;

  esconderToast(el.toastCena);
  if (await pausa(360)) return;

  definirControleAtivo('iso');
  estado.introCancelada = true;   // a sequência terminou: nada mais a cancelar
}

function encerrarIntro() {
  if (estado.introCancelada) return;
  estado.introCancelada = true;
  estado.introFeita = true;

  cancelAnimationFrame(animacaoId);
  entrarProVision();
  esconderToast(document.getElementById('toastBoasVindas'), true);
  esconderToast(document.getElementById('toastCena'), true);
  aplicarValores(AJUSTE_PAISAGEM);
  if (!estado.controleAtivo) definirControleAtivo('iso');
}

/* ---------- Seção 4: os oito cards ---------- */
function montarGrade8() {
  el.grade8.innerHTML = CONTROLES.map(c =>
    '<button type="button" class="card-8" data-ir="' + c.id + '" style="--cor: var(' + c.cor + ')">' +
      '<span class="card-8__icone">' + ICONES[c.id] + '</span>' +
      '<span class="card-8__num">' + c.num + ' · ' + c.cat + '</span>' +
      '<span class="card-8__nome">' + c.nome + '<span class="card-8__tech">(' + c.tech + ')</span></span>' +
      '<span class="card-8__texto">' + c.texto + '</span>' +
      '<span class="card-8__faixa">' + c.faixa + '</span>' +
    '</button>'
  ).join('');
}


/* ==========================================================================
   4. EVENTOS
   ========================================================================== */
function ligarEventos() {

  /* Qualquer toque no celular ou no "Ver original" cancela a sequência de
     abertura. Em fase de captura, para rodar antes do handler do elemento. */
  document.addEventListener('pointerdown', ev => {
    if (ev.target.closest('.telefone, .btn-original')) encerrarIntro();
  }, true);

  /* --- Painel: slider, segmentos e "Redefinir" (delegação) --- */
  el.painel.addEventListener('input', ev => {
    const input = ev.target.closest('.slider__input');
    if (!input) return;
    const c = controleAtual();
    if (!c) return;

    const bruto = Number(input.value);
    estado.valores[c.id] = c.tipo === 'lista' ? c.valores[bruto] : bruto;

    input.style.setProperty('--pct', pctDaTrilha(c));
    el.painel.querySelector('.slider__valor').textContent = c.fmt(estado.valores[c.id]);
    aplicarFiltros();
    atualizarCards();
  });

  el.painel.addEventListener('click', ev => {
    const c = controleAtual();
    if (!c) return;

    if (ev.target.closest('[data-redefinir]')) {
      estado.valores[c.id] = c.padrao;
      aplicarFiltros();
      atualizarCards();
      atualizarPainel();
      return;
    }

    const opcao = ev.target.closest('[data-opcao]');
    if (opcao) {
      estado.valores[c.id] = opcao.dataset.opcao;
      if (c.id === 'foco') {          // volta ao ponto padrão da opção escolhida
        el.camadaFoco.style.removeProperty('--fx');
        el.camadaFoco.style.removeProperty('--fy');
      }
      aplicarFiltros();
      atualizarCards();
      atualizarPainel();
    }
  });

  /* --- Arrastar a faixa para o lado troca de página, como num celular ---
     Funciona com mouse e toque (Pointer Events). O movimento é acompanhado
     na window para o gesto não se perder se o dedo sair da faixa. */
  const LIMIAR_ARRASTO = 40;         // px na horizontal para valer como swipe
  let arrasto = null;                // { id, x, y } do ponteiro em curso
  let ignorarClique = false;         // o soltar de um arrasto não abre card

  el.faixaControles.addEventListener('pointerdown', ev => {
    if (ev.pointerType === 'mouse' && ev.button !== 0) return;
    arrasto = { id: ev.pointerId, x: ev.clientX, y: ev.clientY };
    ignorarClique = false;
  });

  window.addEventListener('pointermove', ev => {
    if (!arrasto || ev.pointerId !== arrasto.id) return;
    const dx = ev.clientX - arrasto.x;
    const dy = ev.clientY - arrasto.y;
    if (Math.abs(dx) >= LIMIAR_ARRASTO && Math.abs(dx) > Math.abs(dy)) {
      arrasto = null;                // um gesto = uma troca
      ignorarClique = true;
      alternarPagina();
    }
  });

  const fimArrasto = ev => { if (arrasto && ev.pointerId === arrasto.id) arrasto = null; };
  window.addEventListener('pointerup', fimArrasto);
  window.addEventListener('pointercancel', fimArrasto);

  /* --- Cards da faixa: abrem (ou fecham) o painel do controle --- */
  el.faixaControles.addEventListener('click', ev => {
    if (ignorarClique) { ignorarClique = false; return; }
    const card = ev.target.closest('.card-controle');
    if (!card) return;
    const id = card.dataset.ctrl;
    definirControleAtivo(id === estado.controleAtivo ? null : id);
  });

  /* --- Pílulas de zoom --- */
  el.linhaZoom.addEventListener('click', ev => {
    const pilula = ev.target.closest('.pilula-zoom');
    if (pilula) { definirZoom(Number(pilula.dataset.zoom)); return; }

    const ponto = ev.target.closest('.ponto');
    if (ponto) definirPagina(Number(ponto.dataset.pagina));
  });

  /* --- Entrar no PRO Vision pelo badge ou pela barra de modos --- */
  el.modoPro.addEventListener('click', () => { encerrarIntro(); });
  el.badgeModo.addEventListener('click', () => { encerrarIntro(); });

  /* --- Toque na tela para focar (só quando o controle FOCO está ativo) --- */
  el.visor.addEventListener('click', ev => {
    if (estado.controleAtivo !== 'foco') return;
    const tela = el.tela.getBoundingClientRect();
    const x = ((ev.clientX - tela.left) / tela.width) * 100;
    const y = ((ev.clientY - tela.top) / tela.height) * 100;
    el.camadaFoco.style.setProperty('--fx', x.toFixed(1) + '%');
    el.camadaFoco.style.setProperty('--fy', y.toFixed(1) + '%');
    estado.valores.foco = 'manual';
    aplicarFiltros();
    atualizarCards();
    atualizarPainel();
  });

  /* --- Obturador e botão de virar câmera --- */
  el.obturador.addEventListener('click', capturar);
  el.btnVirar.addEventListener('click', () => {
    el.btnVirar.classList.remove('girando');
    void el.btnVirar.offsetWidth;
    el.btnVirar.classList.add('girando');
  });

  /* --- "Ver original": vale enquanto estiver pressionado --- */
  const ligarOriginal = () => {
    estado.verOriginal = true;
    el.btnVerOriginal.classList.add('esta-ativa');
    aplicarFiltros();
  };
  const desligarOriginal = () => {
    if (!estado.verOriginal) return;
    estado.verOriginal = false;
    el.btnVerOriginal.classList.remove('esta-ativa');
    aplicarFiltros();
  };

  el.btnVerOriginal.addEventListener('pointerdown', ligarOriginal);
  el.btnVerOriginal.addEventListener('keydown', ev => {
    if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); ligarOriginal(); }
  });
  el.btnVerOriginal.addEventListener('keyup', desligarOriginal);
  el.btnVerOriginal.addEventListener('pointerleave', desligarOriginal);
  window.addEventListener('pointerup', desligarOriginal);
  window.addEventListener('pointercancel', desligarOriginal);

  /* --- Cards da Seção 4: rolam até o laboratório e já ativam o controle --- */
  el.grade8.addEventListener('click', ev => {
    const card = ev.target.closest('.card-8');
    if (!card) return;
    encerrarIntro();
    definirControleAtivo(card.dataset.ir, { rolar: true });
  });

  /* --- Dica ao lado do celular: reposiciona sempre que o cluster inferior
     muda de altura (painel abre/fecha/troca) ou a janela muda de tamanho --- */
  if ('ResizeObserver' in window) {
    new ResizeObserver(posicionarDica).observe(document.querySelector('.rodape-camera'));
  }
  window.addEventListener('resize', posicionarDica);
}

/* A sequência de abertura dispara quando a Seção 3 aparece na tela */
function observarLaboratorio() {
  if (!('IntersectionObserver' in window)) { sequenciaIntro(); return; }

  const observador = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (e.isIntersecting) {
        observador.disconnect();
        sequenciaIntro();
      }
    });
  }, { threshold: 0.55 });

  observador.observe(el.laboratorio);
}


/* ==========================================================================
   5. INIT
   ========================================================================== */
function init() {
  montarGrade8();
  definirPagina(0);
  renderizarGuia(CTRL.iso);   // o guia começa mostrando o controle 01
  definirZoom(1);
  aplicarFiltros();
  ligarEventos();
  observarLaboratorio();
}

init();
