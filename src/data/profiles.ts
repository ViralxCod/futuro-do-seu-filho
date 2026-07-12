import type { Letter } from './quiz'

// Perfil C: copy palavra por palavra do arquivo-fonte.
// Perfis A, B e D: gerados replicando a ESTRUTURA exata do C
// (validação/absolvição → 2 insights positivos → ponto cego censurado → seção bloqueada)
// a partir das descrições de força/ponto cego da seção "OS 4 PERFIS".

export interface Profile {
  letter: Letter
  name: string
  /** Validação + absolvição — SEMPRE antes de qualquer dado negativo */
  validation: string
  insight1: { title: string; text: string }
  insight2: { title: string; text: string }
  /** Insight #3 — ponto cego: parte antes da tarja, e a parte final após a tarja */
  insight3: { title: string; before: string; after: string }
}

export const profiles: Record<Letter, Profile> = {
  C: {
    letter: 'C',
    name: 'O CORAÇÃO EM CONSTRUÇÃO',
    validation:
      'Primeiro, o mais importante: você não é um monstro. Mãe que grita e chora escondida depois não é mãe ruim — é mãe exausta, sem rede de apoio, carregando tudo sozinha. O teste detectou exatamente isso: por trás das suas respostas existe uma mãe que AMA — e um padrão que dá para corrigir.',
    insight1: {
      title: 'O que você está acertando (e ninguém te fala):',
      text: 'A culpa que você sente depois de gritar? Ela é a prova de que sua conexão com ele está viva. Mães que não sentem nada — essas sim criam adultos frios. Seu radar emocional está funcionando. Ele só está apontando para o alvo errado: para você, em vez de para o padrão.',
    },
    insight2: {
      title: 'O que ele está gravando de verdade:',
      text: 'Seu filho não vai lembrar de cada grito. O cérebro dele grava o ciclo: tensão → explosão → silêncio. É o que acontece DEPOIS do grito que define se ele vai crescer seguro ou com medo de errar. E existe um jeito de reescrever esse ciclo em menos de 2 minutos por dia.',
    },
    insight3: {
      title: 'O ponto cego (parcialmente revelado):',
      before:
        'Suas respostas dos Blocos 2 e 4 revelam um padrão específico: a paralisia entre "traumatizar" e "mimar" está fazendo você alternar entre ceder e explodir. Se mantido, esse vaivém tende a aparecer nele como',
      after: 'por volta dos 14 anos — e é exatamente aí que a maioria das mães percebe tarde demais.',
    },
  },
  A: {
    letter: 'A',
    name: 'O VISIONÁRIO DETERMINADO',
    validation:
      'Primeiro, o mais importante: sua firmeza não é frieza. Mãe que sustenta o "não" mesmo com todo mundo olhando não é mãe dura demais — é mãe que entende que limite é uma forma de amor. O teste detectou exatamente isso: por trás das suas respostas existe uma mãe consistente — e um detalhe que dá para ajustar.',
    insight1: {
      title: 'O que você está acertando (e ninguém te fala):',
      text: 'A consistência que você mantém, mesmo cansada? Ela está construindo no seu filho algo raríssimo hoje: tolerância à frustração. Crianças criadas com limites firmes lidam melhor com o "não" da vida adulta. Seu radar de estrutura está funcionando — e ele é a base de tudo.',
    },
    insight2: {
      title: 'O que ele está gravando de verdade:',
      text: 'Seu filho não vai lembrar de cada regra. O cérebro dele grava a previsibilidade: combinado → consequência → segurança. É essa constância que define se ele vai crescer sabendo se controlar ou esperando que o mundo ceda. E existe um jeito de somar calor a essa estrutura em menos de 2 minutos por dia.',
    },
    insight3: {
      title: 'O ponto cego (parcialmente revelado):',
      before:
        'Suas respostas dos Blocos 2 e 4 revelam um padrão específico: a firmeza que hoje organiza a casa, sem o contrapeso certo, tende a aparecer nele como',
      after: 'na adolescência — e é exatamente aí que a maioria das mães firmes percebe tarde demais.',
    },
  },
  B: {
    letter: 'B',
    name: 'O CRIATIVO RESILIENTE',
    validation:
      'Primeiro, o mais importante: sua leveza não é falta de pulso. Mãe que transforma birra em brincadeira não é mãe permissiva — é mãe que escolheu preservar a alegria da casa mesmo exausta. O teste detectou exatamente isso: por trás das suas respostas existe uma mãe criativa — e um padrão que dá para equilibrar.',
    insight1: {
      title: 'O que você está acertando (e ninguém te fala):',
      text: 'O humor que você usa para desarmar o caos? Ele está construindo no seu filho flexibilidade emocional — a capacidade de rir do erro e recomeçar. Crianças criadas na leveza pedem ajuda com mais facilidade quando crescem. Seu radar de conexão pelo riso está funcionando.',
    },
    insight2: {
      title: 'O que ele está gravando de verdade:',
      text: 'Seu filho não vai lembrar de cada brincadeira. O cérebro dele grava o padrão: tensão → improviso → alívio. É a presença (ou ausência) de uma âncora constante que define se ele vai crescer flexível ou sem chão. E existe um jeito de criar essa âncora em menos de 2 minutos por dia.',
    },
    insight3: {
      title: 'O ponto cego (parcialmente revelado):',
      before:
        'Suas respostas dos Blocos 2 e 4 revelam um padrão específico: o improviso que hoje salva o dia, sem uma estrutura constante por trás, tende a aparecer nele como',
      after: 'por volta dos 14 anos — e é exatamente aí que a maioria das mães leves percebe tarde demais.',
    },
  },
  D: {
    letter: 'D',
    name: 'O COMUNICADOR EMPÁTICO',
    validation:
      'Primeiro, o mais importante: sua entrega não é exagero. Mãe que agacha, nomeia o sentimento e valida antes de corrigir não é mãe "moderna demais" — é mãe que está dando ao filho o que quase ninguém recebeu. O teste detectou exatamente isso: por trás das suas respostas existe uma mãe presente — e um alerta que precisa ser visto.',
    insight1: {
      title: 'O que você está acertando (e ninguém te fala):',
      text: 'A validação que você oferece em cada birra? Ela está construindo no seu filho inteligência emocional de verdade — a capacidade de nomear o que sente em vez de explodir. Crianças criadas assim viram adultos que conversam em vez de gritar. Seu radar empático está funcionando.',
    },
    insight2: {
      title: 'O que ele está gravando de verdade:',
      text: 'Seu filho não vai lembrar de cada conversa. O cérebro dele grava o modelo: sentir → nomear → resolver. Mas ele também grava OUTRA coisa: como você trata a si mesma. É o seu autocuidado (ou a falta dele) que define o que ele vai achar normal receber — e exigir — de quem ama.',
    },
    insight3: {
      title: 'O ponto cego (parcialmente revelado):',
      before:
        'Suas respostas dos Blocos 3 e 4 revelam um padrão específico: você valida todo mundo — menos você. Esse autoabandono silencioso tende a aparecer nele como',
      after: 'na vida adulta — e é exatamente aí que a maioria das mães empáticas percebe tarde demais.',
    },
  },
}

// Seção bloqueada (blur + cadeado) — copy exata da Etapa 3
export const lockedSection = {
  title: '🔒 O seu Mapa Completo de Projeção revela:',
  bullets: [
    'O ponto cego completo — e as 3 frases que você fala nos dias de caos que o alimentam sem você perceber',
    'A projeção ano a ano: como seu filho tende a estar aos 7, 14, 18 e 25 anos se o ciclo atual continuar — e a versão dele se você corrigir agora',
    'O Ritual dos 10 Minutos Depois — o protocolo exato para reparar depois de uma explosão (o que falar, o que nunca falar)',
    'A resposta definitiva para o cabo de guerra "traumatizar vs. mimar" — o critério simples que desfaz a paralisia na hora do limite',
    'Seu Score de Conexão (0 a 100) comparado com a média das mães do seu perfil',
  ],
  cta: '🔓 DESBLOQUEAR MEU MAPA COMPLETO →',
  microcopy: 'Seu resultado expira em 07:00 e suas respostas são apagadas.',
}
