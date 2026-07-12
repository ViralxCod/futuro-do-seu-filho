import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Answers } from './lib/scoring'
import type { Letter } from './data/quiz'
import { calculateProfile } from './lib/scoring'
import { config } from './config'

export interface Child {
  name: string
  gender: 'menino' | 'menina'
  age: number
}

interface FunnelState {
  child: Child | null
  answers: Answers
  /** índice da tela atual dentro do fluxo do quiz (perguntas + insights) */
  quizStep: number
  profile: Letter | null
  /** timestamp (ms) em que o resultado expira — contador REAL de 15 min */
  deadline: number | null
  paidMapa: boolean
  paidManual: boolean
  upsellDeclined: boolean
  startedAt: number | null
  /** escolha na pergunta de compromisso antes da análise */
  commitment: 'verdade' | 'resumo' | null
  /** resposta livre da opção E da P2 ("como ele reage ao NÃO") */
  birraNote: string | null

  setBirraNote: (note: string) => void
  /** define o perfil diretamente (sincronização com a conta d'O Ninho) */
  setProfile: (p: Letter) => void
  setCommitment: (c: 'verdade' | 'resumo') => void
  setChild: (child: Child) => void
  answer: (questionId: number, letter: Letter) => void
  setQuizStep: (step: number) => void
  finishQuiz: () => Letter
  startDeadline: () => void
  markPaidMapa: () => void
  markPaidManual: () => void
  declineUpsell: () => void
  /** Expira o resultado: apaga respostas e perfil (a promessa da copy é real) */
  expire: () => void
  resetAll: () => void
}

export const useFunnel = create<FunnelState>()(
  persist(
    (set, get) => ({
      child: null,
      answers: {},
      quizStep: 0,
      profile: null,
      deadline: null,
      paidMapa: false,
      paidManual: false,
      upsellDeclined: false,
      startedAt: null,
      commitment: null,
      birraNote: null,

      setBirraNote: (birraNote) => set({ birraNote }),
      setProfile: (profile) => set({ profile }),
      setCommitment: (commitment) => set({ commitment }),
      setChild: (child) => set({ child }),
      answer: (questionId, letter) =>
        set((s) => ({
          answers: { ...s.answers, [questionId]: letter },
          startedAt: s.startedAt ?? Date.now(),
        })),
      setQuizStep: (quizStep) => set({ quizStep }),
      finishQuiz: () => {
        const profile = calculateProfile(get().answers)
        set({ profile })
        return profile
      },
      startDeadline: () => {
        if (get().deadline === null) {
          set({ deadline: Date.now() + config.timerMinutes * 60 * 1000 })
        }
      },
      markPaidMapa: () => set({ paidMapa: true }),
      markPaidManual: () => set({ paidManual: true }),
      declineUpsell: () => set({ upsellDeclined: true }),
      expire: () => {
        // Quem já pagou não perde o acesso; quem não pagou perde o resultado.
        if (get().paidMapa) return
        set({ answers: {}, quizStep: 0, profile: null, deadline: null, startedAt: null })
      },
      resetAll: () =>
        set({
          child: null,
          answers: {},
          quizStep: 0,
          profile: null,
          deadline: null,
          paidMapa: false,
          paidManual: false,
          upsellDeclined: false,
          startedAt: null,
        }),
    }),
    { name: 'funil-futuro-filho' },
  ),
)

/** true se o prazo do resultado já estourou (e ela não pagou) */
export function isExpired(state: Pick<FunnelState, 'deadline' | 'paidMapa'>): boolean {
  return !state.paidMapa && state.deadline !== null && Date.now() > state.deadline
}
