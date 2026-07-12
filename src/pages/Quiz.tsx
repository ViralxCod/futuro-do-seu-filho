import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { questions, insights, progressPhrases, type Option, type Question, type Insight } from '../data/quiz'
import { useFunnel } from '../store'
import { track } from '../lib/tracking'
import { fill, withName } from '../lib/personalize'
import { playTick, playChime, haptic, soundEnabled, toggleSound } from '../lib/sound'
import { Confetti } from '../components/Confetti'
import { Radar } from '../components/Radar'

type Step =
  | { kind: 'gender' }
  | { kind: 'age' }
  | { kind: 'name' }
  | { kind: 'question'; q: Question }
  | { kind: 'insight'; ins: Insight; block: number }
  | { kind: 'commitment' }

const questionSteps: Step[] = questions.flatMap((q): Step[] => {
  const ins = insights.find((i) => i.afterQuestionId === q.id)
  return ins
    ? [{ kind: 'question', q }, { kind: 'insight', ins, block: Math.ceil(q.id / 3) }]
    : [{ kind: 'question', q }]
})

const steps: Step[] = [{ kind: 'gender' }, { kind: 'age' }, { kind: 'name' }, ...questionSteps, { kind: 'commitment' }]

const AGES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

export function Quiz() {
  const navigate = useNavigate()
  const { quizStep, setQuizStep, answer, child, setChild, setCommitment, setBirraNote } = useFunnel()
  const [selected, setSelected] = useState<Option['letter'] | null>(null)
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState('')
  const [draft, setDraft] = useState<{ gender?: 'menino' | 'menina'; age?: number; name: string }>({ name: '' })
  const [soundOn, setSoundOn] = useState(soundEnabled)

  const step = steps[Math.min(quizStep, steps.length - 1)]

  // Progresso inflado: micro-telas levam a 20%; perguntas vão de 20% a 100%
  const completedQuestions = steps.slice(0, quizStep).filter((s) => s.kind === 'question').length
  const progress = quizStep <= 2 ? [0, 7, 14][quizStep] : Math.round(20 + (completedQuestions / questions.length) * 80)
  const phrase = progressPhrases[Math.min(3, Math.floor(Math.max(0, progress - 20) / 20))]

  const advance = () => {
    setSelected(null)
    setNoteOpen(false)
    setNote('')
    if (quizStep + 1 >= steps.length) {
      navigate('/analisando')
    } else {
      setQuizStep(quizStep + 1)
    }
  }

  const back = () => {
    if (quizStep > 0) {
      setSelected(null)
      setNoteOpen(false)
      setQuizStep(quizStep - 1)
    }
  }

  const pick = (q: Question, o: Option) => {
    if (selected) return
    haptic()
    playTick()
    if (o.freeText) {
      // opção E da P2: campo livre opcional — não pontua, não trava o fluxo
      setSelected(o.letter)
      setNoteOpen(true)
      return
    }
    setSelected(o.letter)
    answer(q.id, o.scoreAs ?? (o.letter as 'A' | 'B' | 'C' | 'D'))
    if (q.id === 6) track('bloco2_completo') // fim do Bloco 2 = lead de alta intenção
    setTimeout(advance, 480)
  }

  const chooseMicro = (fn: () => void) => {
    haptic()
    playTick()
    fn()
    setTimeout(advance, 250)
  }

  return (
    <main className="app-col flex min-h-dvh flex-col px-5 pb-8 pt-4">
      {/* Cabeçalho: voltar + barra dourada com % + som */}
      <div className="flex items-center gap-3">
        <button
          onClick={back}
          aria-label="Voltar"
          className={`text-lg text-white/30 transition-opacity ${quizStep === 0 ? 'pointer-events-none opacity-0' : ''}`}
        >
          ‹
        </button>
        <div className="flex-1">
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="bar-gold h-full rounded-full"
              animate={{ width: `${Math.max(3, progress)}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
        <span className="w-10 text-right text-[13px] font-bold tabular-nums text-gold">{Math.max(0, progress)}%</span>
        <Radar />
        <button
          onClick={() => setSoundOn(toggleSound())}
          aria-label="Som"
          className={`text-base ${soundOn ? '' : 'opacity-30 grayscale'}`}
        >
          🔊
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={phrase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 text-center text-[13px] italic text-fog"
        >
          {phrase}
        </motion.p>
      </AnimatePresence>

      <div className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
          {step.kind === 'gender' && (
            <motion.div key="gender" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.3 }}>
              <h2 className="text-center text-[22px] font-bold leading-snug">É menino ou menina?</h2>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {(['menino', 'menina'] as const).map((op) => (
                  <motion.button
                    key={op}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => chooseMicro(() => setDraft((d) => ({ ...d, gender: op })))}
                    className="flex flex-col items-center gap-3 rounded-3xl border-2 border-white/10 bg-cream py-8 text-cocoa shadow-lg transition-colors active:border-gold"
                  >
                    <span className="text-5xl">{op === 'menino' ? '👦' : '👧'}</span>
                    <span className="text-lg font-bold capitalize">{op}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step.kind === 'age' && (
            <motion.div key="age" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.3 }}>
              <h2 className="text-center text-[22px] font-bold leading-snug">Qual a idade?</h2>
              <div className="mt-6 grid grid-cols-4 gap-3">
                {AGES.map((age) => (
                  <motion.button
                    key={age}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => chooseMicro(() => setDraft((d) => ({ ...d, age })))}
                    className="rounded-2xl border-2 border-white/10 bg-cream py-4 text-xl font-bold text-cocoa shadow-md transition-colors active:border-gold"
                  >
                    {age}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step.kind === 'name' && (
            <motion.div key="name" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.3 }}>
              <h2 className="text-center text-[22px] font-bold leading-snug">
                Qual o nome {draft.gender === 'menina' ? 'dela' : 'dele'}?
              </h2>
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder={draft.gender === 'menina' ? 'ex.: Alice' : 'ex.: Theo'}
                autoFocus
                className="mt-6 w-full rounded-2xl border-2 border-white/10 bg-cream px-5 py-4 text-center text-xl font-bold text-cocoa shadow-lg outline-none placeholder:font-normal placeholder:text-cocoa-soft/50 focus:border-gold"
              />
              <button
                disabled={!draft.name.trim()}
                onClick={() => {
                  haptic()
                  playTick()
                  setChild({
                    name: draft.name.trim(),
                    gender: draft.gender ?? 'menino',
                    age: draft.age ?? 5,
                  })
                  advance()
                }}
                className="cta mt-5 disabled:animate-none disabled:opacity-40"
              >
                Começar a análise →
              </button>
            </motion.div>
          )}

          {step.kind === 'question' && (
            <motion.div
              key={`q${step.q.id}`}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-center text-xs font-bold uppercase tracking-widest text-gold">
                Pergunta {step.q.id} de {questions.length}
              </p>
              <h2 className="mt-3 text-center text-[20px] font-bold leading-snug">{fill(step.q.text, child)}</h2>
              {step.q.id === 11 && (
                <p className="mt-2 text-center text-[12px] italic text-fog">92% das mães nunca contaram isso a ninguém.</p>
              )}
              <div className="mt-6 space-y-3">
                {step.q.options.map((o) => {
                  const isPicked = selected === o.letter
                  return (
                    <motion.button
                      key={o.letter}
                      onClick={() => pick(step.q, o)}
                      whileTap={{ scale: 0.97 }}
                      animate={isPicked && !o.freeText ? { scale: [1, 1.04, 0.99, 1] } : {}}
                      transition={isPicked && !o.freeText ? { duration: 0.4 } : {}}
                      className={`relative w-full rounded-2xl border-2 p-4 pr-10 text-left text-[15px] leading-snug text-cocoa shadow-md transition-colors ${
                        isPicked ? 'border-gold bg-cream ring-2 ring-gold/50' : 'border-transparent bg-cream/95 active:border-gold'
                      }`}
                    >
                      {fill(o.text, child)}
                      {isPicked && <span className="pop-in absolute right-3 top-1/2 -translate-y-1/2 text-xl font-bold text-mint">✓</span>}
                    </motion.button>
                  )
                })}
              </div>
              {noteOpen && step.q.options.some((o) => o.freeText) && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                  <p className="text-center text-[13px] text-fog">
                    {fill(step.q.options.find((o) => o.freeText)!.freeText!.prompt, child)}
                  </p>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    autoFocus
                    placeholder="(opcional)"
                    className="mt-2 w-full rounded-2xl border-2 border-white/10 bg-cream px-4 py-3 text-[15px] text-cocoa outline-none placeholder:text-cocoa-soft/50 focus:border-gold"
                  />
                  <button
                    onClick={() => {
                      if (note.trim()) setBirraNote(note.trim())
                      advance()
                    }}
                    className="cta mt-3"
                  >
                    Continuar →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step.kind === 'insight' && (
            <motion.div
              key={`ins${step.ins.afterQuestionId}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              onAnimationStart={() => playChime()}
              className="relative rounded-3xl border border-gold/30 bg-night-card p-6 text-center shadow-2xl"
            >
              <Confetti />
              <motion.p
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring' }}
                className="mx-auto w-fit rounded-full border border-gold/60 bg-gold/15 px-4 py-1.5 text-[11px] font-bold tracking-widest text-gold"
              >
                ✓ ETAPA {step.block} DESBLOQUEADA
              </motion.p>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="mt-4 inline-block text-5xl"
              >
                {step.ins.emoji}
              </motion.span>
              <p className="mt-4 text-[15px] leading-relaxed text-cream">
                {step.ins.title && <strong>{step.ins.title} </strong>}
                {withName(step.ins.text, child)}
              </p>
              {step.block === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 rounded-2xl border border-mint/40 bg-mint/10 p-4 text-left"
                >
                  <p className="w-fit rounded-full border border-mint/60 bg-mint/15 px-3 py-1 text-[10px] font-bold tracking-widest text-mint">
                    ✓ DESCOBERTA 1 DE 4 DESBLOQUEADA
                  </p>
                  <p className="mt-3 text-[14px] leading-relaxed text-cream">
                    O horário em que seu padrão quebra não é aleatório: é quando o seu tanque emocional zera. Anotar o
                    horário das explosões por 3 dias revela o seu gatilho mais comum.
                  </p>
                </motion.div>
              )}
              <button onClick={advance} className="cta mt-6">
                {step.ins.button}
              </button>
            </motion.div>
          )}

          {step.kind === 'commitment' && (
            <motion.div
              key="commitment"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-[22px] font-bold leading-snug">
                Se o Mapa revelar o ponto cego do seu padrão... <span className="hl">você quer saber?</span>
              </h2>
              <button
                onClick={() => {
                  haptic()
                  setCommitment('verdade')
                  track('compromisso_verdade')
                  navigate('/analisando')
                }}
                className="cta mt-8"
              >
                🔓 Quero a verdade completa
              </button>
              <button
                onClick={() => {
                  setCommitment('resumo')
                  track('compromisso_verdade')
                  navigate('/analisando')
                }}
                className="mt-5 text-[13px] text-white/35 underline underline-offset-2"
              >
                Prefiro só o resumo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
