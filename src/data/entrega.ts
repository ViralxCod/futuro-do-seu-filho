import type { Letter } from './quiz'

// CONTEÚDO REAL DA ENTREGA — fonte: ENTREGA-PRODUTO.md
// Tokens {NOME}/{o}/{ele}/{dele}/{filho} são interpolados na renderização (fill).

/** Rodapé obrigatório em todas as telas da entrega (compliance). */
export const rodapeCompliance =
  'O Mapa identifica tendências comportamentais com base nas suas respostas — o futuro d{o} {NOME} não está escrito. É por isso que este Mapa existe.'

export interface FaixaScore {
  label: string
  texto: string
}

export function scoreFaixa(score: number): FaixaScore {
  if (score >= 75)
    return { label: 'Conexão Forte', texto: 'Seu radar tá ligado e {o} {NOME} sente isso. Seu desafio não é conexão — é constância.' }
  if (score >= 55)
    return { label: 'Conexão Real com Ruído', texto: 'O amor tá aí, mas o cansaço tá gritando mais alto em alguns dias. Dá pra subir 20 pontos em 30 dias.' }
  return {
    label: 'Conexão no Modo Sobrevivência',
    texto: 'Você tá dando o que tem. O problema é que ninguém te deu nada primeiro. Os ajustes abaixo são pra VOCÊ antes de serem pra {ele}.',
  }
}

export interface MapaContent {
  abertura: string
  pontoCego: { titulo: string; texto: string; frases: string[] }
  projecao: { idade: number; texto: string; comAjuste?: string }[]
  ajustes: string[]
  scoreMedia: number
}

export const mapaContent: Record<Letter, MapaContent> = {
  A: {
    abertura:
      'Mãe firme. Na sua casa tem ordem, tem palavra e tem consequência. {O} {NOME} está crescendo com uma coisa raríssima hoje: previsibilidade. Criança que sabe as regras do jogo cresce segura. Só que existe um detalhe que quase nenhuma mãe firme enxerga a tempo...',
    pontoCego: {
      titulo: 'A Distância Silenciosa',
      texto:
        'Firmeza demais sem afeto declarado vira muro. {O} {NOME} obedece — mas pode estar aprendendo que errar perto de você é perigoso. Na adolescência, isso tem nome: {ele} vai te contar cada vez menos. Não porque não te ama. Porque aprendeu que contar dá bronca.',
      frases: ['"Eu avisei."', '"Chorar não resolve."', '"Na minha casa é assim e pronto."'],
    },
    projecao: [
      { idade: 7, texto: 'Obediente e organizad{o}. Elogiad{o} por adultos. Mas já escolhe o que te contar.' },
      { idade: 14, texto: 'O quarto vira fortaleza. Notas ok, conversa zero. Você sabe TUDO da rotina {dele} e NADA da vida {dele}.' },
      { idade: 18, texto: 'Independente cedo — às vezes cedo demais, como quem foge.' },
      {
        idade: 25,
        texto: 'Adulto competente, chefe respeitado... que liga pra você no aniversário e em datas.',
        comAjuste: 'O mesmo adulto competente — que te liga à toa numa terça, só pra conversar.',
      },
    ],
    ajustes: [
      'Uma vez por dia, elogie o ESFORÇO sem corrigir nada junto ("gostei de como você tentou" — ponto final, sem "mas").',
      'Conte pr{o} {NOME} um erro SEU do dia. Mãe que erra em voz alta cria filho que confessa.',
    ],
    scoreMedia: 74,
  },
  B: {
    abertura:
      'Sua casa tem riso. Você transforma birra em brincadeira e caos em história engraçada — e isso está dando a{o} {NOME} um dom que não se ensina: leveza pra atravessar problema. Mas tem um preço escondido nessa leveza...',
    pontoCego: {
      titulo: 'O Chão que Balança',
      texto:
        "Improviso demais vira imprevisibilidade. Se cada dia as regras mudam de lugar, {o} {NOME} aprende a testar TUDO, sempre — porque talvez hoje o 'não' vire 'sim'. A criatividade {dele} é linda; a insegurança de não saber onde o chão está, não.",
      frases: ['"Ah, hoje pode."', '"Deixa, depois eu resolvo."', '"Só dessa vez."'],
    },
    projecao: [
      { idade: 7, texto: 'Criativ{o}, sociável, adora novidade. Mas negocia CADA regra como advogado.' },
      { idade: 14, texto: 'Carismátic{o} e dispers{o}. Começa 10 coisas, termina 2. Testa limite em casa e na escola.' },
      { idade: 18, texto: 'Mil ideias, zero rotina. Sofre no primeiro chefe que exige constância.' },
      {
        idade: 25,
        texto: 'Adulto criativo que se reinventa — mas recomeça do zero toda vez.',
        comAjuste: 'O mesmo criativo, com disciplina de terminar o que começa. Essa combinação é rara e vale ouro.',
      },
    ],
    ajustes: [
      'Escolha 3 regras da casa que NUNCA viram exceção (só 3 — e morra por elas).',
      'Ritual fixo de 5 min todo dia no MESMO horário (história antes de dormir conta). Âncora de previsibilidade muda cérebro de criança.',
    ],
    scoreMedia: 71,
  },
  C: {
    abertura:
      'Primeiro, o mais importante: você NÃO é uma mãe ruim. Mãe ruim não termina um teste desses às {HORA}. Mãe ruim não chora escondida depois do grito. O que o teste encontrou nas suas respostas não foi falta de amor — foi EXCESSO DE PESO. E peso demais em cima de uma pessoa só sempre transborda. No caso da sua casa, transborda em grito.',
    pontoCego: {
      titulo: 'O Ciclo Cede-Explode',
      texto:
        "Seu padrão não é o grito. É o VAIVÉM. Você segura, segura, segura (cede aqui, engole ali)... até explodir. Aí vem a culpa, você compensa sendo mole demais... e o ciclo recomeça. {O} {NOME} não aprende com o grito nem com o mimo — {ele} aprende com o PADRÃO: que o 'não' da mamãe é elástico, e que amor vem em ondas imprevisíveis. Aos 14 anos, isso aparece como um adolescente que sabe exatamente qual botão apertar — e uma mãe esgotada que já não sabe mais quem manda em quem.",
      frases: [
        '"Tá bom, TÁ BOM, pode ficar mais um pouquinho!"',
        '"CHEGA! Eu não aguento MAIS!"',
        '"Desculpa, filho... a mamãe tava nervosa." (a terceira sem mudar nada depois — desculpa sem reparo vira senha pro próximo ciclo)',
      ],
    },
    projecao: [
      { idade: 7, texto: '{O} {NOME} já sabe: insistir 10 vezes funciona. Birra não é gênio ruim — é estratégia que VOCÊ ensinou sem querer.' },
      { idade: 14, texto: 'As explosões viram gritaria dos dois lados. {Ele} repete com você o tom que aprendeu — e você escuta seus próprios gritos na boca {dele}.' },
      { idade: 18, texto: '{Ele} ama você, mas descreve a casa como "tensa". Sai cedo, não pelo mundo — pelo alívio.' },
      {
        idade: 25,
        texto: 'Um adulto que ou explode como aprendeu, ou engole tudo como você engolia.',
        comAjuste: 'Um adulto que viu a mãe QUEBRAR O CICLO — e essa é a herança emocional mais valiosa que existe. Quem vê o reparo aprende o reparo.',
      },
    ],
    ajustes: [
      'O Ritual dos 10 Minutos Depois (está no seu Manual — é a peça que desmonta esse ciclo pelo lado certo).',
      "UM 'não' por dia mantido até o fim, no assunto que você escolher de manhã. Não precisa vencer todas — precisa vencer UMA por dia, todo dia. Constância pequena > firmeza épica.",
    ],
    scoreMedia: 62,
  },
  D: {
    abertura:
      'Na sua casa, sentimento tem nome e tem vez. {O} {NOME} está crescendo com o que 90% dos adultos pagam terapia pra aprender: vocabulário emocional. Mas empatia sem fronteira tem um efeito colateral que ninguém te contou...',
    pontoCego: {
      titulo: 'A Mãe Esponja',
      texto:
        "Você absorve tanto o que {ele} sente que esquece de sentir o que é SEU. Filho de mãe esponja aprende duas coisas perigosas: que os sentimentos dele são urgentes e os dos outros são adiáveis — e que amar é se anular. {Ele} pode virar um adulto incrível de escutar... e péssimo de dizer 'não'. Igualzinho a você.",
      frases: ['"Não fica assim, meu amor, a mamãe resolve."', '"Eu tô bem, filho" (mentindo).', '"Deixa, eu faço."'],
    },
    projecao: [
      { idade: 7, texto: 'Sensível, verbal, querid{o}. Mas terceiriza pra você toda frustração.' },
      { idade: 14, texto: 'Ótim{o} pra conversar — e especialista em te convencer. Limite virou debate.' },
      { idade: 18, texto: 'Empátic{o} com todo mundo, sem saber dizer não. Atrai amizades que drenam.' },
      {
        idade: 25,
        texto: 'O amigo que todo mundo procura e que ninguém pergunta como está — o mesmo papel que você faz hoje.',
        comAjuste: 'Empatia COM fronteira: um adulto que acolhe sem se anular. Líder nato.',
      },
    ],
    ajustes: [
      'Diga "eu não posso agora, e tá tudo bem você ficar chateado" 1x por dia — e sustente o chateado sem resgatar.',
      'Na frente d{ele}, faça UMA coisa só sua por dia e nomeie: "agora é a vez da mamãe". Fronteira se ensina mostrando.',
    ],
    scoreMedia: 78,
  },
}

// ---------- PARTE 2 — MANUAL DA MÃE PRESENTE (upsell R$ 27) ----------

export const manualContent = {
  ritual: {
    intro:
      'O grito acontece. Nas melhores casas, com as melhores mães. O que separa uma infância marcada de uma infância segura NÃO é a ausência de grito — é o que acontece nos 10 minutos seguintes. Cérebro de criança grava o final da cena, não o meio.',
    passos: [
      { titulo: 'Passo 1 (minuto 0-3) — Se recolha, não se justifique.', texto: 'Saia de perto. Água no rosto. NÃO volte ainda: pedir desculpa com raiva no corpo assusta de novo.' },
      { titulo: 'Passo 2 (minuto 3-5) — Uma frase pra VOCÊ:', texto: '"Eu gritei porque transbordei. Eu não sou o meu pior momento." (Culpa paralisa; responsabilidade repara.)' },
      { titulo: 'Passo 3 (minuto 5-8) — Volte e conserte SEM drama.', texto: 'Na altura dos olhos: "Filho, a mamãe gritou e grito machuca. Você não merece grito. Eu tava muito cansada, mas a culpa não é sua. Me dá um abraço?" — curto assim. NÃO diga: "mas é que VOCÊ também..." (desculpa com \'mas\' não é desculpa, é acusação).' },
      { titulo: 'Passo 4 (minuto 8-10) — Reconecte no corpo.', texto: 'Abraço, cafuné, encostar ombro. Criança acredita em pele, não em discurso.' },
    ],
    nunca: [
      'Presente de culpa (ensina que explosão gera prêmio)',
      'Sumir e fingir que nada houve (ensina que amor some)',
      'Desculpa-novela chorando MUITO (inverte os papéis: ele vira o consolador)',
    ],
  },
  criterio: {
    intro: 'A régua de 3 perguntas — se as 3 respostas forem SIM, aplique o limite sem medo:',
    perguntas: [
      { p: 'É sobre o comportamento, não sobre quem ele é?', ex: '("Bater no colega tem consequência" ✓ / "Você é um menino mau" ✗)' },
      { p: 'Ele sabia da regra antes?', ex: 'Consequência anunciada educa; surpresa assusta.' },
      { p: 'Você consegue aplicar SEM humilhar?', ex: 'Voz firme ✓; gritar na frente dos amiguinhos, ironizar, comparar com o irmão ✗.' },
    ],
    fraseOuro:
      'Trauma não vem de limite — vem de limite IMPREVISÍVEL, DESPROPORCIONAL ou HUMILHANTE. Castigo curto, avisado e cumprido = segurança. "Deixa pra lá" + explosão depois = o verdadeiro dano.',
  },
  frases: [
    { situacao: 'Birra no mercado', diga: '"Eu tô aqui. Quando você terminar de chorar, a gente resolve junto."', nunca: '"Todo mundo tá olhando pra você!" (ensina que a opinião dos outros manda nele)' },
    { situacao: 'Ignorou seu pedido', diga: '"Vou falar uma vez e vou esperar você fazer." (e espere do lado)', nunca: '"Você é surdo?"' },
    { situacao: 'Derrubou/quebrou', diga: '"Foi sem querer. Como a gente conserta?"', nunca: '"Eu SABIA que ia acontecer!"' },
    { situacao: 'Quer desistir', diga: '"Tá difícil. Vamos até a próxima parte juntos, aí você decide."', nunca: '"Desistir é coisa de fraco."' },
    { situacao: '"Eu te odeio, mãe"', diga: '"Pode ficar bravo comigo. Eu vou continuar te amando bravo assim mesmo."', nunca: '"Então some daqui!"' },
    { situacao: 'Nota ruim / errou na escola', diga: '"O que essa prova te mostrou?"', nunca: '"Fulaninho conseguiu, por que você não?"' },
    { situacao: 'Medo (escuro, pesadelo)', diga: '"Eu já tive medo disso também. Te conto o que me ajudava?"', nunca: '"Isso é bobeira."' },
    { situacao: 'Mentiu', diga: '"Obrigada por me contar a verdade agora. Falar verdade aqui nunca piora as coisas."', nunca: '"Mentiroso igual ao seu pai."' },
    { situacao: 'Chorou "à toa"', diga: '"Tá saindo lágrima, então não é à toa. O que pesou?"', nunca: '"Engole esse choro."' },
    { situacao: 'Apanhou/brigou', diga: '"Primeiro: você tá bem? Depois a gente fala do que houve."', nunca: '"Apanhou por quê? O que VOCÊ fez?"' },
    { situacao: 'Ganhou/conquistou algo', diga: '"Eu vi o quanto você TENTOU. Isso é o que me orgulha."', nunca: 'Só "parabéns" seco ou "demorou, né?"' },
    { situacao: 'Antes de dormir (todo dia)', diga: '"Qual foi a melhor e a pior parte do seu dia?" (e escute a pior sem corrigir)', nunca: 'Deixar a última fala do dia ser bronca.' },
  ],
  plano30: [
    { semana: 'Semana 1 — Parar a sangria', texto: 'Só o Ritual dos 10 Minutos. Nada mais. Toda explosão termina em reparo.' },
    { semana: 'Semana 2 — Um NÃO por dia', texto: 'Escolha de manhã qual não vai sustentar. Anote no espelho quantos venceu.' },
    { semana: 'Semana 3 — 10 minutos de chão', texto: 'Todo dia, 10 min de brincadeira NO CHÃO, celular em outro cômodo, ele escolhe a brincadeira e você obedece as regras dele.' },
    { semana: 'Semana 4 — A pergunta da noite', texto: 'Frase 12 todos os dias + 1 erro seu confessado por semana.' },
    { semana: 'Dia 30', texto: 'Refaça o teste. Compare o Score. Mães que aplicam as 4 semanas sobem em média 20 pontos.' },
  ],
}
