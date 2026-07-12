import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { profiles } from '../data/profiles'
import { useFunnel } from '../store'
import { LockedSection } from '../components/LockedSection'
import { TimerCard } from '../components/TimerCard'
import { track } from '../lib/tracking'
import { withName, genderOf } from '../lib/personalize'
import { haptic, playTick } from '../lib/sound'

export function Resultado() {
  const navigate = useNavigate()
  const profile = useFunnel((s) => s.profile)
  const child = useFunnel((s) => s.child)
  const startDeadline = useFunnel((s) => s.startDeadline)
  const paidMapa = useFunnel((s) => s.paidMapa)
  const [revealed, setRevealed] = useState(false)
  const [discoveries, setDiscoveries] = useState(0) // revelação progressiva: 0..3

  useEffect(() => {
    if (!profile) {
      navigate('/', { replace: true })
      return
    }
    if (paidMapa) {
      navigate('/mapa', { replace: true })
      return
    }
    startDeadline() // o prazo de 15 min começa quando ela VÊ o resultado
    track('resultado_visto')
    const t = setTimeout(() => setRevealed(true), 1200)
    return () => clearTimeout(t)
  }, [])

  if (!profile) return null
  const p = profiles[profile]
  const g = genderOf(child)

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-col min-h-dvh px-5 pb-12 pt-0">
      <TimerCard />

      <p className="pt-4 text-center text-[15px] text-fog">
        🏆 Analisamos suas respostas. O Perfil de Futuro {child?.name ? `d${g.o} ${child.name.toUpperCase()}` : 'do seu filho'} é:
      </p>

      {/* Revelação: blur → nítido + brilho dourado */}
      <motion.h1
        initial={{ filter: 'blur(12px)', opacity: 0.3, scale: 0.96 }}
        animate={revealed ? { filter: 'blur(0px)', opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="mt-3 text-center text-[30px] font-bold leading-tight text-gold drop-shadow-[0_0_22px_rgba(240,199,94,0.55)]"
      >
        {p.name}
      </motion.h1>

      {revealed && (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Validação + absolvição — SEMPRE antes de qualquer dado negativo */}
          <p className="mt-6 rounded-2xl bg-cream p-5 text-[15px] leading-relaxed text-cocoa">
            {p.validation.split('você não é um monstro.').length === 2 ? (
              <>
                {p.validation.split('você não é um monstro.')[0]}
                <strong>você não é um monstro.</strong>
                {p.validation.split('você não é um monstro.')[1]}
              </>
            ) : (
              p.validation
            )}
          </p>

          {/* Revelação progressiva — cada descoberta é um clique */}
          <div className="mt-6 space-y-4">
            {discoveries >= 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-mint/30 bg-night-card p-5 shadow-lg">
                <p className="text-[10px] font-bold tracking-widest text-mint/70">DESCOBERTA 1 DE 3</p>
                <h3 className="mt-1 font-bold text-mint">✅ Insight #1 — {p.insight1.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-cream">{withName(p.insight1.text, child)}</p>
              </motion.div>
            )}

            {discoveries >= 2 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-mint/30 bg-night-card p-5 shadow-lg">
                <p className="text-[10px] font-bold tracking-widest text-mint/70">DESCOBERTA 2 DE 3</p>
                <h3 className="mt-1 font-bold text-mint">✅ Insight #2 — {p.insight2.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-cream">{withName(p.insight2.text, child)}</p>
              </motion.div>
            )}

            {discoveries >= 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border-2 border-gold/60 bg-night-card p-5 shadow-xl">
                <p className="text-[10px] font-bold tracking-widest text-gold/70">DESCOBERTA 3 DE 3</p>
                <h3 className="mt-1 font-bold text-gold">⚠️ Insight #3 — {p.insight3.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-cream">
                  {withName(p.insight3.before, child)} <span className="censor-bar px-1">▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span>{' '}
                  {p.insight3.after}
                </p>
              </motion.div>
            )}

            {discoveries < 3 && (
              <button
                onClick={() => {
                  haptic()
                  playTick()
                  setDiscoveries(discoveries + 1)
                }}
                className="cta"
              >
                {discoveries === 0 ? 'Revelar minha 1ª descoberta →' : discoveries === 1 ? 'Revelar a 2ª →' : 'Revelar a última →'}
              </button>
            )}
          </div>

          {discoveries >= 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <LockedSection onUnlock={() => navigate('/desbloquear')} />
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.main>
  )
}
