// COPY V3 — linguagem real de mãe (AJUSTES-V3). Tokens de personalização:
// {NOME} nome do filho · {o}/{O} artigo · {ele}/{Ele} pronome · {dele} posse · {filho} filho/filha
// A substituição acontece em src/lib/personalize.ts (fill).

export type Letter = 'A' | 'B' | 'C' | 'D'

export interface Option {
  letter: Letter | 'E'
  text: string
  /** letra que esta opção pontua (default: a própria); ex.: E da P12 pontua C */
  scoreAs?: Letter
  /** abre campo de texto curto opcional (não pontua) */
  freeText?: { prompt: string }
}

export interface Question {
  id: number
  block: 1 | 2 | 3 | 4
  text: string
  options: Option[]
}

export const progressPhrases = [
  'Analisando sua rotina real (não a ideal)...', // 0–25%
  'Mapeando o que acontece depois da explosão...', // 25–50%
  'Medindo o peso que você carrega sozinha...', // 50–75%
  'Calculando o Perfil de Futuro...', // 75–100%
]

export const questions: Question[] = [
  // BLOCO 1 — O CAOS DO DIA A DIA
  {
    id: 1,
    block: 1,
    text: 'Você manda {o} {NOME} guardar os brinquedos. Fala uma vez, duas, DEZ. O que acontece na sua casa?',
    options: [
      { letter: 'A', text: 'Na primeira ele já sabe que é sério. Aqui tem ordem' },
      { letter: 'B', text: 'Invento um joguinho pra {ele} topar (funciona... às vezes)' },
      { letter: 'C', text: 'Eu grito. Aí {ele} chora, eu me sinto um lixo — e o brinquedo continua lá' },
      { letter: 'D', text: 'Respiro, agacho e explico. Na maioria das vezes funciona' },
    ],
  },
  {
    id: 2,
    block: 1,
    text: 'Se {o} {NOME} fizer birra no meio do mercado, todo mundo olhando... o que passa pela sua cabeça NA HORA?',
    options: [
      { letter: 'A', text: '"Pode chorar. O \'não\' continua sendo não"' },
      { letter: 'B', text: '"Vou distrair {ele} e sair dessa o mais rápido possível"' },
      { letter: 'C', text: '"Que vergonha. Todo mundo pensando que eu não sei ser mãe"' },
      { letter: 'D', text: '"{Ele} não tá me desafiando, tá transbordando. Vou agachar e conversar"' },
      {
        letter: 'E',
        text: '✍️ {O} {NOME} não faz birra',
        freeText: { prompt: 'Conta rapidinho: como {ele} reage quando ouve um NÃO?' },
      },
    ],
  },
  {
    id: 3,
    block: 1,
    text: '{O} {NOME} te olha nos olhos... e faz EXATAMENTE o oposto do que você pediu. Qual sua reação honesta?',
    options: [
      { letter: 'A', text: 'Consequência na hora. Combinado é combinado' },
      { letter: 'B', text: 'Respiro fundo e viro brincadeira pra não virar guerra' },
      { letter: 'C', text: 'GRITO. Falei com calma 10 vezes e fui ignorada — ninguém é de ferro' },
      { letter: 'D', text: 'Pergunto o que tá acontecendo com {ele} antes de reagir' },
    ],
  },
  // BLOCO 2 — DEPOIS DA EXPLOSÃO
  {
    id: 4,
    block: 2,
    text: 'O dia foi pesado, você tá no limite... e {o} {NOME} apronta MAIS uma. O que sai de você?',
    options: [
      { letter: 'A', text: 'Firmeza fria. Castigo dado, sem escândalo' },
      { letter: 'B', text: 'Conto até dez e tento o humor (nem sempre sai)' },
      { letter: 'C', text: 'Sai um grito que eu nem reconheço minha voz. Depois vem aquele aperto no peito' },
      { letter: 'D', text: 'Saio de perto, me acalmo, e volto pra resolver' },
    ],
  },
  {
    id: 5,
    block: 2,
    text: 'Depois de gritar com {o} {NOME}... o que você faz?',
    options: [
      { letter: 'A', text: 'Sigo em frente. Culpa não educa ninguém' },
      { letter: 'B', text: 'Faço uma graça pra quebrar o gelo e ver {ele} rir de novo' },
      { letter: 'C', text: 'Espero {ele} dormir, fico olhando {ele} na cama e choro baixinho. Juro que amanhã vai ser diferente' },
      { letter: 'D', text: 'Peço desculpa na hora e explico o que eu senti' },
    ],
  },
  {
    id: 6,
    block: 2,
    text: "Você salva aqueles posts de 'como educar sem gritar', promete que agora vai... e na hora do caos?",
    options: [
      { letter: 'A', text: 'Aplico o que dá. Teoria é teoria, minha casa é real' },
      { letter: 'B', text: 'Improviso uma mistura do que li com o que inventei' },
      { letter: 'C', text: 'Prometo pra mim mesma que vou mudar... e nunca mudo. No fim grito igual minha mãe gritava comigo' },
      { letter: 'D', text: 'Consigo aplicar na maioria das vezes, mesmo imperfeita' },
    ],
  },
  // BLOCO 3 — O PESO QUE VOCÊ CARREGA
  {
    id: 7,
    block: 3,
    text: "Seu marido (ou sua sogra) solta: 'você não faz NADA o dia todo'. O que você faz?",
    options: [
      { letter: 'A', text: 'Corto na hora. Aqui ninguém fala assim comigo' },
      { letter: 'B', text: 'Rio pra não brigar... e engulo seco' },
      { letter: 'C', text: "Exploto. E no final EU viro 'a descontrolada' da história" },
      { letter: 'D', text: 'Já rendeu uma conversa séria que precisava acontecer' },
    ],
  },
  {
    id: 8,
    block: 3,
    text: 'Lanche da escola, pediatra, tamanho do sapato, fantasia da festa junina... quem carrega TUDO isso na cabeça?',
    options: [
      { letter: 'A', text: 'Eu — mas montei um esquema e deleguei o que deu' },
      { letter: 'B', text: 'Eu — do meu jeito bagunçado que funciona' },
      { letter: 'C', text: 'EU. TUDO. SEMPRE. E se der errado, a culpa ainda vai ser minha' },
      { letter: 'D', text: 'Eu na frente, mas tenho quem divida comigo' },
    ],
  },
  {
    id: 9,
    block: 3,
    text: "Completa com sinceridade: 'A mulher que eu era antes d{o} {NOME}...'",
    options: [
      { letter: 'A', text: '...ainda existe. Eu me recuso a sumir' },
      { letter: 'B', text: '...aparece nas raras horas só minhas' },
      { letter: 'C', text: "...morreu. Hoje sou só 'a mãe d{o} {NOME}'. Ninguém pergunta como EU tô" },
      { letter: 'D', text: '...virou outra — e tô aprendendo a gostar dela' },
    ],
  },
  // BLOCO 4 — O MEDO DO FUTURO
  {
    id: 10,
    block: 4,
    text: 'Na hora de dar um castigo DE VERDADE n{o} {NOME}, o que trava você?',
    options: [
      { letter: 'A', text: 'Nada. Limite é amor e aqui funciona' },
      { letter: 'B', text: 'Tento o meio-termo, sem drama' },
      { letter: 'C', text: 'Medo. Se castigo, traumatizo. Se deixo, crio um sem-limites. Fico travada — e {ele} PERCEBE' },
      { letter: 'D', text: 'Dou o limite, mas acolho o choro depois' },
    ],
  },
  {
    id: 11,
    block: 4,
    text: 'Casa em silêncio, cabeça no travesseiro. Qual pensamento vem te assombrar?',
    options: [
      { letter: 'A', text: "'Tô sendo dura demais... será que {ele} vai me achar fria?'" },
      { letter: 'B', text: "'Tá faltando pulso firme aqui em casa e eu sei disso'" },
      { letter: 'C', text: "'Eu tô estragando {o} meu {filho}. {Ele} vai crescer e me odiar — e vai ser culpa minha'" },
      { letter: 'D', text: "'Será que eu dou conta de tudo o que {ele} sente?'" },
    ],
  },
  {
    id: 12,
    block: 4,
    text: 'Daqui a 20 anos, {o} {NOME}, adult{o}, senta na sua frente e fala da infância {dele}. Qual frase você MAIS teme ouvir?',
    options: [
      { letter: 'A', text: '"Você era dura demais, mãe"' },
      { letter: 'B', text: '"Era divertido, mas faltou alguém no comando"' },
      { letter: 'C', text: '"Eu lembro dos seus gritos. Eu tinha medo de você"' },
      { letter: 'D', text: '"Você cuidava de todo mundo... menos de você"' },
      { letter: 'E', text: '"Você era uma péssima mãe"', scoreAs: 'C' },
    ],
  },
]

// Telas de insight entre blocos (a recompensa do bloco)
export interface Insight {
  afterQuestionId: number
  emoji: string
  title: string
  text: string
  button: string
}

export const insights: Insight[] = [
  {
    afterQuestionId: 3,
    emoji: '💡',
    title: 'Você sabia?',
    text: 'Antes dos 7 anos, o cérebro do seu filho aprende mais observando você do que ouvindo qualquer instrução. Ele não grava o que você fala 10 vezes — grava o que você FAZ na 11ª. As próximas perguntas revelam o que ele está gravando...',
    button: 'Continuar →',
  },
  {
    afterQuestionId: 6,
    emoji: '⚠️',
    title: 'Isso precisa ser dito:',
    text: 'o grito não é o que define o futuro do seu filho. É o que acontece nos 10 minutos depois dele. Suas respostas estão revelando exatamente esse padrão — e ele é mais importante do que você imagina. Faltam 6 perguntas...',
    button: 'Continuar →',
  },
  {
    afterQuestionId: 9,
    emoji: '💛',
    title: '',
    text: 'Se algumas dessas respostas doeram, respira: você não está sendo julgada aqui. 73% das mães que chegam neste ponto respondem igual a você. O bloco final é o mais importante — ele revela não o presente... mas o futuro.',
    button: 'Ver as últimas 3 perguntas →',
  },
]

// Tela de processamento (Etapa 3) — 4 frases em sequência
export const processingPhrases = [
  'Cruzando suas 12 respostas...',
  'Comparando com padrões de +14.000 perfis de mães...',
  "Identificando o que seu filho está 'gravando' de você...",
  '✓ Perfil encontrado.',
]
