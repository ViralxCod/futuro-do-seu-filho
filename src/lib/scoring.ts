import type { Letter } from '../data/quiz'

export type Answers = Record<number, Letter> // questionId (1..12) -> letra

const LETTERS: Letter[] = ['A', 'B', 'C', 'D']
const BLOCK4_IDS = [10, 11, 12]

function count(ids: number[], answers: Answers): Record<Letter, number> {
  const tally: Record<Letter, number> = { A: 0, B: 0, C: 0, D: 0 }
  for (const id of ids) {
    const letter = answers[id]
    if (letter) tally[letter]++
  }
  return tally
}

function dominant(tally: Record<Letter, number>): Letter[] {
  const max = Math.max(...LETTERS.map((l) => tally[l]))
  return LETTERS.filter((l) => tally[l] === max)
}

/**
 * Cada resposta soma 1 ponto à letra. Letra dominante = perfil.
 * Empate: vence a letra dominante do Bloco 4 (P10–P12).
 */
export function calculateProfile(answers: Answers): Letter {
  const overall = dominant(count(Object.keys(answers).map(Number), answers))
  if (overall.length === 1) return overall[0]

  // Empate geral → dominante do Bloco 4, restrita às letras empatadas
  const block4 = count(BLOCK4_IDS, answers)
  const tiedSorted = [...overall].sort((a, b) => block4[b] - block4[a])
  return tiedSorted[0]
}

/**
 * Score de Conexão (0–100) — fórmula do ENTREGA-PRODUTO.md:
 * base 40 + (D × 5) + (A × 3) + (B × 2) + (C × 1)
 */
export function connectionScore(answers: Answers): number {
  const points: Record<Letter, number> = { A: 3, B: 2, C: 1, D: 5 }
  const total = Object.values(answers).reduce((sum, l) => sum + points[l], 0)
  return Math.min(100, 40 + total)
}
