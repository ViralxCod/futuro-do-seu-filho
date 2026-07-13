// Biblioteca de conteúdo da área de membros: mapeia cada PRODUTO (slug) aos
// seus entregáveis. O texto vem dos .md em src/content/entregaveis (bundle).

import oMapa from '../content/entregaveis/o-mapa-do-seu-filho.md?raw'
import guiaGatilhos from '../content/entregaveis/guia-5-gatilhos-das-18h.md?raw'
import audiosSocorro from '../content/entregaveis/audios-primeiro-socorro-no-grito.md?raw'
import termometro from '../content/entregaveis/termometro-do-corpo.md?raw'
import roteiroReparacao from '../content/entregaveis/roteiro-da-reparacao.md?raw'
import checklistPalavras from '../content/entregaveis/checklist-palavras-que-curam-x-ferem.md?raw'
import regra3 from '../content/entregaveis/regra-dos-3-passos.md?raw'

import geladeira from '../content/entregaveis/geladeira-calma.md?raw'
import cartas from '../content/entregaveis/cartas-de-perdao.md?raw'
import frasco from '../content/entregaveis/o-frasco-da-calma.md?raw'

import sosDormir from '../content/entregaveis/sos-hora-de-dormir.md?raw'
import testePai from '../content/entregaveis/o-teste-do-pai.md?raw'

import programa from '../content/entregaveis/o-ninho-completo-programa.md?raw'
import desafio21 from '../content/entregaveis/21-dias-sem-grito.md?raw'
import birra from '../content/entregaveis/birra-no-mercado.md?raw'
import telas from '../content/entregaveis/telas-sem-guerra.md?raw'
import manhas from '../content/entregaveis/manhas-sem-correria.md?raw'
import audiosResp from '../content/entregaveis/audios-respiracao-da-mae.md?raw'

export interface Doc {
  title: string
  md: string
}

export interface Biblioteca {
  titulo: string
  subtitulo: string
  docs: Doc[]
}

export const biblioteca: Record<string, Biblioteca> = {
  mapa: {
    titulo: 'Meu Mapa — Material Completo',
    subtitulo: 'Os 7 guias que acompanham o seu Mapa do Futuro.',
    docs: [
      { title: 'O Mapa do Seu Filho', md: oMapa },
      { title: 'Guia dos 5 Gatilhos das 18h', md: guiaGatilhos },
      { title: 'Áudios de Primeiro Socorro no Grito', md: audiosSocorro },
      { title: 'Termômetro do Corpo', md: termometro },
      { title: 'Roteiro da Reparação', md: roteiroReparacao },
      { title: 'Palavras que Curam × Palavras que Ferem', md: checklistPalavras },
      { title: 'A Regra dos 3 Passos', md: regra3 },
    ],
  },
  'kit-de-bolso': {
    titulo: 'Kit de Bolso',
    subtitulo: 'Suas ferramentas de emergência do dia a dia.',
    docs: [
      { title: 'Geladeira Calma', md: geladeira },
      { title: 'Cartas de Perdão', md: cartas },
      { title: 'O Frasco da Calma', md: frasco },
    ],
  },
  'sos-hora-de-dormir': {
    titulo: 'SOS Hora de Dormir',
    subtitulo: 'Roteiro da rotina + áudio de ninar.',
    docs: [{ title: 'SOS Hora de Dormir', md: sosDormir }],
  },
  'teste-do-pai': {
    titulo: 'O Teste do Pai',
    subtitulo: 'A versão do Mapa para o parceiro, sem brigas.',
    docs: [{ title: 'O Teste do Pai', md: testePai }],
  },
  completo: {
    titulo: 'O Ninho Completo',
    subtitulo: 'O programa de 21 dias e a biblioteca de roteiros de crise.',
    docs: [
      { title: 'Programa — Visão Geral dos 21 Dias', md: programa },
      { title: '21 Dias Sem Grito', md: desafio21 },
      { title: 'Birra no Mercado', md: birra },
      { title: 'Telas Sem Guerra', md: telas },
      { title: 'Manhãs Sem Correria', md: manhas },
      { title: 'Áudios — Respiração da Mãe', md: audiosResp },
    ],
  },
}
