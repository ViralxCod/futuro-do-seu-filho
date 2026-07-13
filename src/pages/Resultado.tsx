import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { profiles } from '../data/profiles'
import { useFunnel } from '../store'
import { LockedSection } from '../components/LockedSection'
import { TimerCard } from '../components/TimerCard'
import { track } from '../lib/tracking'
import { withName, genderOf, fill } from '../lib/personalize'
import { haptic, playTick } from '../lib/sound'

export function Resultado() {
  const navigate = useNavigate()
  const profile = useFunnel((s) => s.profile)
  const child = useFunnel((s) => s.child)
  const startDeadline = useFunnel((s) => s.startDeadline)
  const paidMapa = useFunnel((s) => s.paidMapa)
  const [absolved, setAbsolved] = useState(false) // absolvição vem ANTES de qualquer resultado
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

  // ── PASSO 0: ABSOLVIÇÃO ──────────────────────────────────────────────
  // Antes de score, perfil ou projeção: tirar a mãe do estado de vergonha.
  // Sem TimerCard aqui — o "respira" não convive com contador de escassez.
  if (!absolved) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="app-col flex min-h-dvh flex-col justify-center px-6 pb-12 pt-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center font-headline text-4xl font-bold text-mint drop-shadow-[0_0_18px_rgba(122,209,168,0.4)]"
        >
          Respira.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-7 rounded-2xl bg-cream p-6 text-center text-[17px] leading-relaxed text-cocoa"
        >
          Antes de qualquer resultado: <strong>você não é uma má mãe.</strong> Mãe ruim não perde o sono com isso — você
          perde porque ama. O que vem agora não é uma nota. <strong>É um mapa pra sair do ciclo.</strong>
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          onClick={() => {
            haptic()
            setAbsolved(true)
          }}
          className="cta mt-8"
        >
          Estou pronta. Ver meu mapa →
        </motion.button>
      </motion.main>
    )
  }

  // ── RESULTADO: mapa da saída (onde você está hoje → o caminho) ────────
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-col min-h-dvh px-5 pb-12 pt-0">
      <TimerCard />

      <p className="pt-4 text-center text-[15px] text-fog">
        🧭 Este é o seu ponto de partida {child?.name ? `— o mapa d${g.o} ${child.name.toUpperCase()}` : '— o mapa do seu filho'}:
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

      <p className="mt-3 text-center text-[14px] italic text-fog">
        Isso não é uma nota nem uma sentença — é onde você está hoje. E a rota daqui pra frente ainda está toda nas suas mãos.
      </p>

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

            {/* DESCOBERTA 3 — os dois futuros. O bom em destaque; o de hoje, discreto. */}
            {discoveries >= 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <p className="text-[10px] font-bold tracking-widest text-gold/70">DESCOBERTA 3 DE 3 — OS DOIS FUTUROS POSSÍVEIS</p>

                {/* COM ajuste — o futuro bom, em destaque */}
                <div className="rounded-2xl border-2 border-mint/60 bg-mint/5 p-5 shadow-xl">
                  <h3 className="font-headline text-lg font-bold text-mint">🌱 Com o ajuste certo — o futuro que ainda está todo em aberto</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-cream">
                    Bastam alguns minutos por dia pra a projeção virar outra: {fill('{o} {NOME} cresce aprendendo que depois da tempestade sempre vem o colo', child)}. Que erra sem se odiar. Que aos 14 procura você em vez de fugir de você. Esse caminho não é sorte — é a soma de decisões pequenas, a partir de hoje.
                  </p>
                </div>

                {/* SEM ajuste — a rota atual, discreta: não é ameaça, é o ponto que dá pra corrigir */}
                <p className="rounded-xl bg-night-card/60 px-4 py-3 text-[13px] leading-relaxed text-fog">
                  Sem nenhuma mudança, o padrão de hoje tende a seguir com ele — {withName(p.insight3.before, child)}{' '}
                  <span className="censor-bar px-1">▓▓▓▓▓▓▓▓▓▓</span> {p.insight3.after} Mas isso é só a rota atual, não um
                  destino. Dá pra trocar de rota — e o primeiro passo é agora.
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
              {/* GANHO RÁPIDO GRÁTIS — ela sente o método funcionar ANTES de pagar */}
              <div className="mt-8 rounded-2xl border border-gold/40 bg-cream p-6 text-cocoa shadow-lg">
                <p className="text-[11px] font-bold tracking-widest text-gold">SEU PRIMEIRO PASSO — DE GRAÇA, PRA USAR HOJE</p>
                <h3 className="mt-2 font-headline text-xl font-bold">A frase de 10 segundos que desarma a birra pela raiz</h3>
                <p className="mt-3 text-[15px] leading-relaxed">
                  Na próxima explosão, agacha na altura dele, respira uma vez e diz devagar, olhando nos olhos:
                </p>
                <blockquote className="mt-3 rounded-xl border-l-4 border-mint bg-white/60 px-4 py-3 text-[16px] font-semibold italic leading-relaxed">
                  “Eu vejo que você tá com muita raiva. Tá tudo bem sentir isso. Eu tô aqui do seu lado até passar.”
                </blockquote>
                <p className="mt-3 text-[15px] leading-relaxed">
                  Não é mágica nem chantagem: você valida a emoção <em>antes</em> que ela vire explosão. Na maioria das
                  vezes, o choro perde a força em segundos — porque ele se sente visto, não combatido. Testa hoje e repara
                  na cara dele.
                </p>
              </div>

              {/* TRANSIÇÃO PRO PAYWALL */}
              <p className="mt-8 text-center text-[16px] font-semibold leading-relaxed text-cream">
                Você acabou de sentir o primeiro passo funcionar.
                <br />
                <span className="text-gold">O passo a passo completo pra domar a birra sem gritar — e sem a culpa depois — tá aqui ↓</span>
              </p>

              <LockedSection onUnlock={() => navigate('/desbloquear')} />
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.main>
  )
}
