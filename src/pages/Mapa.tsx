import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useFunnel } from '../store'
import { mapaContent, manualContent, scoreFaixa, rodapeCompliance } from '../data/entrega'
import { connectionScore } from '../lib/scoring'
import { track } from '../lib/tracking'
import { fill } from '../lib/personalize'
import { haptic, playTick } from '../lib/sound'
import { supabase } from '../lib/supabase'
import type { Child } from '../store'

const PROFILE_NAMES = {
  A: 'O VISIONÁRIO DETERMINADO',
  B: 'O CRIATIVO RESILIENTE',
  C: 'O CORAÇÃO EM CONSTRUÇÃO',
  D: 'O COMUNICADOR EMPÁTICO',
} as const

/** Convite para continuar dentro d'O Ninho (a entrega NUNCA depende disso). */
function NinhoBanner() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState<string | null>(null)
  const resend = async () => {
    if (!supabase || !email.trim()) return
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim() })
    setSent(error ? `Erro: ${error.message}` : '✓ Link reenviado! Confira seu e-mail.')
  }
  return (
    <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-center">
      <p className="text-[14px] text-cream">Sua conta n’O Ninho está pronta — o link de acesso foi para o e-mail da compra.</p>
      <Link to="/ninho" className="cta mt-3 py-3 text-[14px]">
        Continuar na minha conta →
      </Link>
      {supabase && (
        <div className="mt-3">
          {sent ? (
            <p className="text-[12px] text-mint">{sent}</p>
          ) : (
            <div className="flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e-mail da compra"
                type="email"
                className="w-full rounded-xl border-2 border-white/10 bg-cream px-3 py-2 text-[13px] text-cocoa outline-none focus:border-gold"
              />
              <button onClick={resend} className="shrink-0 rounded-xl bg-gold px-3 py-2 text-[12px] font-bold text-night">
                Reenviar link
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Rodape({ child }: { child: Child | null }) {
  return <p className="mt-4 text-center text-[11px] italic leading-relaxed text-white/35">{fill(rodapeCompliance, child)}</p>
}

/** Seção de revelação progressiva (componente estável — não remonta a cada clique). */
function Section({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {children}
    </motion.div>
  )
}

/**
 * Entrega final: o Mapa completo do perfil + o Manual (se comprado),
 * com revelação progressiva (uma seção por vez).
 * Liberação: flag localStorage / ?paid2=1 / entitlement d'O Ninho.
 * TODO (futuro): validação server-side via webhook antes de renderizar.
 */
export function Mapa() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { profile, answers, child, paidMapa, paidManual, markPaidManual } = useFunnel()
  const [sections, setSections] = useState(1) // revelação progressiva

  useEffect(() => {
    if (params.get('paid2') === '1' && paidMapa) {
      markPaidManual()
      track('compra_27')
    }
    if (!profile || !paidMapa) {
      navigate(profile ? '/desbloquear' : '/', { replace: true })
      return
    }
    track('mapa_entregue')
  }, [])

  if (!profile || !paidMapa) return null

  const mapa = mapaContent[profile]
  const score = connectionScore(answers)
  const faixa = scoreFaixa(score)
  const hasManual = paidManual || params.get('paid2') === '1'
  const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const f = (t: string) => fill(t.replaceAll('{HORA}', hora), child)

  const totalSections = hasManual ? 8 : 4
  const reveal = () => {
    haptic()
    playTick()
    setSections((s) => s + 1)
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      className="app-col min-h-dvh px-5 pb-16 pt-10"
    >
      <p className="text-center text-sm uppercase tracking-widest text-fog">
        {child?.name ? f('O Mapa Completo de Projeção d{o} {NOME}') : 'Seu Mapa Completo de Projeção'}
      </p>
      <h1 className="mt-2 text-center text-[28px] font-bold leading-tight text-gold drop-shadow-[0_0_20px_rgba(240,199,94,0.4)]">
        {PROFILE_NAMES[profile]}
      </h1>

      <NinhoBanner />

      {/* Abertura */}
      <Section show={sections >= 1}>
        <section className="mt-6 rounded-3xl bg-cream p-6 text-cocoa shadow-xl">
          <p className="text-[15px] leading-relaxed">{f(mapa.abertura)}</p>
        </section>

        {/* Score */}
        <section className="mt-5 rounded-3xl border border-gold/30 bg-night-card p-6 text-center shadow-xl">
          <h2 className="font-headline text-lg font-bold text-gold">💯 Seu Score de Conexão</h2>
          <motion.p initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="mt-2 font-headline text-6xl font-bold text-gold">
            {score}
          </motion.p>
          <p className="mt-1 font-bold text-cream">{faixa.label}</p>
          <div className="mx-auto mt-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div className="bar-gold h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1.2, delay: 0.4 }} />
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-fog">{f(faixa.texto)}</p>
          <p className="mt-2 text-sm text-fog">
            Média das mães do seu perfil: <strong className="text-cream">{mapa.scoreMedia}</strong>
          </p>
        </section>
        <Rodape child={child} />
      </Section>

      {/* Ponto cego */}
      <Section show={sections >= 2}>
        <section className="mt-5 rounded-3xl border-2 border-gold/50 bg-cream p-6 text-cocoa shadow-xl">
          <h2 className="font-headline text-lg font-bold">📍 O Ponto Cego Revelado: {mapa.pontoCego.titulo}</h2>
          <p className="mt-3 text-[15px] leading-relaxed">{f(mapa.pontoCego.texto)}</p>
          <h3 className="mt-4 text-[15px] font-bold">As 3 frases que o alimentam sem você perceber:</h3>
          <ul className="mt-2 space-y-2">
            {mapa.pontoCego.frases.map((fr, i) => (
              <li key={i} className="rounded-xl bg-cream-deep p-3 text-[14px] italic">{f(fr)}</li>
            ))}
          </ul>
        </section>
        <Rodape child={child} />
      </Section>

      {/* Projeção */}
      <Section show={sections >= 3}>
        <section className="mt-5 rounded-3xl bg-night-card p-6 shadow-xl">
          <h2 className="font-headline text-lg font-bold text-gold">📈 Projeção Ano a Ano</h2>
          <div className="mt-4 space-y-5">
            {mapa.projecao.map((etapa) => (
              <div key={etapa.idade} className="border-l-4 border-gold/60 pl-4">
                <p className="font-headline text-xl font-bold text-gold">
                  {child?.name ? `${child.name} aos ${etapa.idade} anos` : `Aos ${etapa.idade} anos`}
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-cream">{f(etapa.texto)}</p>
                {etapa.comAjuste && (
                  <p className="mt-1 text-[14px] leading-relaxed text-mint">
                    <strong>Com ajuste:</strong> {f(etapa.comAjuste)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
        <Rodape child={child} />
      </Section>

      {/* Ajustes */}
      <Section show={sections >= 4}>
        <section className="mt-5 rounded-3xl border border-mint/30 bg-night-card p-6 shadow-xl">
          <h2 className="font-headline text-lg font-bold text-mint">🌱 Os 2 ajustes de 5 minutos</h2>
          <ol className="mt-3 list-inside list-decimal space-y-3 text-[15px] leading-relaxed text-cream">
            {mapa.ajustes.map((a, i) => (
              <li key={i}>{f(a)}</li>
            ))}
          </ol>
        </section>
        <Rodape child={child} />
        {!hasManual && (
          <p className="mt-8 text-center text-sm text-fog">
            Seu Mapa está completo. O Manual da Mãe Presente não foi adicionado a este pedido — você pode desbloqueá-lo
            dentro d’<Link to="/ninho" className="text-gold underline">O Ninho</Link>.
          </p>
        )}
      </Section>

      {/* MANUAL — só se comprado */}
      {hasManual && (
        <>
          <Section show={sections >= 5}>
            <h2 className="mt-10 text-center font-headline text-2xl font-bold text-gold">📖 Manual da Mãe Presente</h2>
            <section className="mt-4 rounded-3xl bg-cream p-6 text-cocoa shadow-xl">
              <h3 className="font-headline text-lg font-bold">🕯️ 1. O Ritual dos 10 Minutos Depois</h3>
              <p className="mt-2 text-[14px] italic leading-relaxed">{manualContent.ritual.intro}</p>
              <div className="mt-3 space-y-3">
                {manualContent.ritual.passos.map((p, i) => (
                  <div key={i}>
                    <p className="text-[14px] font-bold">{p.titulo}</p>
                    <p className="text-[14px] leading-relaxed">{p.texto}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[14px] font-bold">O que NUNCA fazer depois do grito:</p>
              <ul className="mt-1 space-y-1 text-[14px]">
                {manualContent.ritual.nunca.map((n, i) => (
                  <li key={i}>🚫 {n}</li>
                ))}
              </ul>
            </section>
          </Section>

          <Section show={sections >= 6}>
            <section className="mt-5 rounded-3xl bg-cream p-6 text-cocoa shadow-xl">
              <h3 className="font-headline text-lg font-bold">⚖️ 2. O Critério Anti-Paralisia</h3>
              <p className="mt-2 text-[14px] leading-relaxed">{manualContent.criterio.intro}</p>
              <ol className="mt-3 list-inside list-decimal space-y-2 text-[14px] leading-relaxed">
                {manualContent.criterio.perguntas.map((q, i) => (
                  <li key={i}>
                    <strong>{q.p}</strong> {q.ex}
                  </li>
                ))}
              </ol>
              <p className="mt-4 rounded-xl bg-cream-deep p-3 text-[14px] font-bold leading-relaxed">✨ {manualContent.criterio.fraseOuro}</p>
            </section>
          </Section>

          <Section show={sections >= 7}>
            <section className="mt-5 rounded-3xl bg-cream p-6 text-cocoa shadow-xl">
              <h3 className="font-headline text-lg font-bold">🗣️ 3. As 12 Frases que Programam o Futuro</h3>
              <div className="mt-3 space-y-3">
                {manualContent.frases.map((fr, i) => (
                  <div key={i} className="rounded-xl bg-cream-deep p-3 text-[13px] leading-relaxed">
                    <p className="font-bold">{i + 1}. {fr.situacao}</p>
                    <p className="mt-1">✅ <strong>Diga:</strong> {fr.diga}</p>
                    <p className="mt-1">🚫 <strong>Nunca:</strong> {fr.nunca}</p>
                  </div>
                ))}
              </div>
            </section>
          </Section>

          <Section show={sections >= 8}>
            <section className="mt-5 rounded-3xl bg-cream p-6 text-cocoa shadow-xl">
              <h3 className="font-headline text-lg font-bold">🎁 4. Bônus — Plano 30 Dias do Score (+20 pontos)</h3>
              <div className="mt-3 space-y-3">
                {manualContent.plano30.map((s, i) => (
                  <div key={i}>
                    <p className="text-[14px] font-bold">{s.semana}</p>
                    <p className="text-[14px] leading-relaxed">{s.texto}</p>
                  </div>
                ))}
              </div>
            </section>
            <Rodape child={child} />
          </Section>
        </>
      )}

      {sections < totalSections && (
        <button onClick={reveal} className="cta mt-6">
          Continuar →
        </button>
      )}
    </motion.main>
  )
}
