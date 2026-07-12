import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { processingPhrases } from '../data/quiz'
import { useFunnel } from '../store'
import { withName } from '../lib/personalize'
import { Confetti } from '../components/Confetti'
import { playChime } from '../lib/sound'

const dataFlashes = [
  'Padrão de rotina: identificado ✓',
  'Resposta à frustração: mapeada ✓',
  'Nível de conexão: calculado ✓',
]

// Sequência intercalada: frase, flash, frase, flash...
const sequence = [
  processingPhrases[0],
  dataFlashes[0],
  processingPhrases[1],
  dataFlashes[1],
  processingPhrases[2],
  dataFlashes[2],
  processingPhrases[3],
]

/** Tela de análise teatral — navega sozinha ao terminar. */
export function Analisando() {
  const navigate = useNavigate()
  const finishQuiz = useFunnel((s) => s.finishQuiz)
  const answers = useFunnel((s) => s.answers)
  const child = useFunnel((s) => s.child)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    // P2 pode não pontuar (opção E de campo livre) → mínimo de 11 respostas
    if (Object.keys(answers).length < 11) {
      navigate('/quiz', { replace: true })
      return
    }
    playChime()
    const timers = sequence.map((_, i) => setTimeout(() => setTick(i), i * 800))
    const done = setTimeout(() => {
      finishQuiz()
      navigate('/resultado', { replace: true })
    }, 5800)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(done)
    }
  }, [])

  const current = sequence[tick]
  const isFlash = dataFlashes.includes(current)

  return (
    <main className="app-col relative flex min-h-dvh flex-col items-center justify-center px-8 text-center">
      <Confetti />
      <p className="rounded-full border border-gold/60 bg-gold/15 px-4 py-1.5 text-[11px] font-bold tracking-widest text-gold">
        ✓ ETAPA 4 DESBLOQUEADA
      </p>

      {/* Barra completa — a jornada chegou a 100% */}
      <div className="mt-5 w-full max-w-[260px]">
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div className="bar-gold h-full rounded-full" initial={{ width: '86%' }} animate={{ width: '100%' }} transition={{ duration: 5 }} />
        </div>
      </div>

      {/* Anel dourado de "cálculo" */}
      <div className="relative mt-8 h-32 w-32">
        <div className="spin-ring absolute inset-0 rounded-full border-4 border-white/10 border-t-gold" />
        <div className="spin-ring-slow absolute inset-3 rounded-full border-4 border-white/10 border-b-coral" />
        <div className="absolute inset-0 flex items-center justify-center text-3xl">🧠</div>
      </div>

      <div className="mt-8 flex h-14 items-start justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={tick}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={
              isFlash
                ? 'font-mono text-[13px] text-mint'
                : `text-lg ${tick === sequence.length - 1 ? 'font-bold text-gold' : 'text-fog'}`
            }
          >
            {withName(current, child)}
          </motion.p>
        </AnimatePresence>
      </div>
    </main>
  )
}
