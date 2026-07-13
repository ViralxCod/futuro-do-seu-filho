// Metadados da biblioteca da área de membros (título/subtítulo por produto).
// ⚠️ O TEXTO dos entregáveis NÃO fica aqui (nem no bundle): ele é servido
// pelo Supabase via RLS por entitlement — só desce para quem comprou.
// Os documentos (título + corpo) vêm da tabela `deliverables`.

export interface BibliotecaMeta {
  titulo: string
  subtitulo: string
}

export const bibliotecaMeta: Record<string, BibliotecaMeta> = {
  mapa: {
    titulo: 'Meu Mapa — Material Completo',
    subtitulo: 'Os 7 guias que acompanham o seu Mapa do Futuro.',
  },
  'kit-de-bolso': {
    titulo: 'Kit de Bolso',
    subtitulo: 'Suas ferramentas de emergência do dia a dia.',
  },
  'sos-hora-de-dormir': {
    titulo: 'SOS Hora de Dormir',
    subtitulo: 'Roteiro da rotina + áudio de ninar.',
  },
  'teste-do-pai': {
    titulo: 'O Teste do Pai',
    subtitulo: 'A versão do Mapa para o parceiro, sem brigas.',
  },
  completo: {
    titulo: 'O Ninho Completo',
    subtitulo: 'O programa de 21 dias e a biblioteca de roteiros de crise.',
  },
}
