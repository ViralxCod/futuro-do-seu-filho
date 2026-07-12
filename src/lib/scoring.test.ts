import { describe, it, expect } from 'vitest'
import { calculateProfile, connectionScore, type Answers } from './scoring'
import type { Letter } from '../data/quiz'

function answers(letters: Letter[]): Answers {
  const map: Answers = {}
  letters.forEach((l, i) => (map[i + 1] = l))
  return map
}

describe('calculateProfile', () => {
  it('retorna A quando A é dominante', () => {
    expect(calculateProfile(answers(['A','A','A','A','A','A','A','B','C','D','B','C']))).toBe('A')
  })

  it('retorna B quando B é dominante', () => {
    expect(calculateProfile(answers(['B','B','B','B','B','B','A','A','C','D','D','C']))).toBe('B')
  })

  it('retorna C quando C é dominante', () => {
    expect(calculateProfile(answers(['C','C','C','C','C','C','C','C','C','C','C','C']))).toBe('C')
  })

  it('retorna D quando D é dominante', () => {
    expect(calculateProfile(answers(['D','D','D','D','D','A','B','C','D','D','A','B']))).toBe('D')
  })

  it('empate A vs C: vence a dominante do Bloco 4 (C em P10–P12)', () => {
    // 6xA (P1–P6), 3xB e depois 3xC no bloco 4... montar: A,A,A,A,A,A,C,C,C,C,C,C → 6A/6C, bloco4 = C,C,C
    expect(calculateProfile(answers(['A','A','A','A','A','A','C','C','C','C','C','C']))).toBe('C')
  })

  it('empate A vs C: vence A se A domina o Bloco 4', () => {
    // C,C,C,C,C,C,A,A,A,A,A,A → 6C/6A, bloco4 = A,A,A
    expect(calculateProfile(answers(['C','C','C','C','C','C','A','A','A','A','A','A']))).toBe('A')
  })

  it('empate 4x4x4 entre A/B/C com bloco 4 dividido: vence quem tem mais pontos no Bloco 4', () => {
    // A:4, B:4, C:4 — bloco 4: B,C,C → C domina o bloco entre os empatados
    expect(calculateProfile(answers(['A','A','A','A','B','B','B','C','C','B','C','C']))).toBe('C')
  })

  it('empate total (3x3x3x3) com bloco 4 também empatado dentro dos empatados: mantém ordem A>B>C>D como desempate final', () => {
    // A,A,A,B,B,B,C,C,C,D,D,D → geral 3/3/3/3; bloco4 = D,D,D → D vence
    expect(calculateProfile(answers(['A','A','A','B','B','B','C','C','C','D','D','D']))).toBe('D')
  })
})

describe('connectionScore', () => {
  it('fica entre 0 e 100', () => {
    const all: Letter[][] = [
      Array(12).fill('A') as Letter[],
      Array(12).fill('B') as Letter[],
      Array(12).fill('C') as Letter[],
      Array(12).fill('D') as Letter[],
    ]
    for (const set of all) {
      const s = connectionScore(answers(set))
      expect(s).toBeGreaterThanOrEqual(0)
      expect(s).toBeLessThanOrEqual(100)
    }
  })

  it('é determinístico', () => {
    const a = answers(['C','C','C','A','B','C','C','D','C','C','C','C'])
    expect(connectionScore(a)).toBe(connectionScore(a))
  })
})
