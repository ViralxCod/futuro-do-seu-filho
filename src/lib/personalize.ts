import type { Child } from '../store'

// Insere nome/gênero na copy SEM reescrever as frases.
// Tokens: {NOME} {o} {O} {ele} {Ele} {dele} {filho}
// Sem criança cadastrada, cai num fallback neutro ("seu filho").

export interface Gender {
  o: string // o / a
  ele: string // ele / ela
  dele: string // dele / dela
  filho: string // filho / filha
}

export function genderOf(child: Child | null): Gender {
  if (child?.gender === 'menina') return { o: 'a', ele: 'ela', dele: 'dela', filho: 'filha' }
  return { o: 'o', ele: 'ele', dele: 'dele', filho: 'filho' }
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Preenche os tokens de personalização de um texto. */
export function fill(text: string, child: Child | null): string {
  const g = genderOf(child)
  const nome = child?.name?.trim() || `seu ${g.filho}`
  return text
    .replaceAll('{NOME}', nome)
    .replaceAll('{O}', cap(g.o))
    .replaceAll('{o}', g.o)
    .replaceAll('{Ele}', cap(g.ele))
    .replaceAll('{ele}', g.ele)
    .replaceAll('{dele}', g.dele)
    .replaceAll('{filho}', g.filho)
}

/** Substitui "seu filho" / "do seu filho" pelo nome nas telas de copy fixa. */
export function withName(text: string, child: Child | null): string {
  if (!child?.name) return text
  const g = genderOf(child)
  const nome = child.name
  return text
    .replaceAll('do seu filho', `d${g.o} ${nome}`)
    .replaceAll('o cérebro do seu filho', `o cérebro d${g.o} ${nome}`)
    .replaceAll('seu filho', `${g.o} ${nome}`)
}
