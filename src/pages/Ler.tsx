import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { bibliotecaMeta } from '../data/biblioteca'
import { Markdown } from '../components/Markdown'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/Logo'

type Status = 'loading' | 'ok' | 'locked'
interface Doc {
  title: string
  body_md: string
  ord?: number
  /** dia (após a compra) em que este material abre. 0 = imediato; 7 = bônus do 7º dia */
  unlock_day?: number
}

const DAY_MS = 86_400_000

/**
 * Página de leitura nativa de um produto da área de membros (/ninho/ler/:slug).
 * O conteúdo NÃO está no bundle: é buscado no Supabase (tabela `deliverables`)
 * e a RLS por entitlement só devolve as linhas para quem comprou o produto.
 */
export function Ler() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const meta = bibliotecaMeta[slug]
  const [status, setStatus] = useState<Status>('loading')
  const [docs, setDocs] = useState<Doc[]>([])
  const [daysSince, setDaysSince] = useState(0) // dias desde a compra deste produto

  useEffect(() => {
    if (!meta) {
      navigate('/ninho', { replace: true })
      return
    }
    if (!supabase) {
      setStatus('locked')
      return
    }
    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        navigate('/ninho', { replace: true })
        return
      }
      // A RLS libera as linhas só se o usuário tiver o entitlement do produto.
      const { data } = await supabase
        .from('deliverables')
        .select('title, body_md, ord, unlock_day')
        .eq('product_slug', slug)
        .order('ord')

      // Data da compra deste produto → quantos dias já se passaram (desbloqueio no 7º dia).
      const { data: ents } = await supabase
        .from('entitlements')
        .select('criado_em, products(slug)')
        .eq('user_id', session.user.id)
      // `products` vem como objeto ou array embutido — normalizamos o slug.
      const slugOf = (e: { products?: unknown }): string | undefined => {
        const p = e.products as { slug?: string } | { slug?: string }[] | null | undefined
        return Array.isArray(p) ? p[0]?.slug : p?.slug
      }
      const times = (ents ?? [])
        .filter((e) => slugOf(e as { products?: unknown }) === slug)
        .map((e) => new Date((e as { criado_em: string }).criado_em).getTime())
        .filter((t) => Number.isFinite(t))
      if (times.length) {
        setDaysSince(Math.max(0, Math.floor((Date.now() - Math.min(...times)) / DAY_MS)))
      }

      if (data && data.length > 0) {
        setDocs(data as Doc[])
        setStatus('ok')
      } else {
        setStatus('locked')
      }
    })()
  }, [slug])

  if (!meta) return null

  if (status === 'loading') {
    return (
      <main className="app-col min-h-dvh px-5 pt-10">
        <Logo />
        <p className="mt-10 text-center text-fog">Carregando seu material...</p>
      </main>
    )
  }

  if (status === 'locked') {
    return (
      <main className="app-col min-h-dvh px-5 pt-10">
        <Logo />
        <div className="mt-10 rounded-2xl bg-night-card p-6 text-center">
          <p className="text-[15px] text-cream">Este material ainda não está liberado para a sua conta.</p>
          <Link to="/ninho" className="cta mt-4 inline-block py-3 text-[14px]">
            Voltar para O Ninho →
          </Link>
        </div>
      </main>
    )
  }

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-col min-h-dvh px-5 pb-16 pt-8">
      {/* Cabeçalho + ações (não vão pro PDF) */}
      <div className="no-print">
        <div className="flex items-center justify-between">
          <Link to="/ninho" className="text-[13px] text-white/50 underline underline-offset-2">
            ‹ O Ninho
          </Link>
          <button onClick={() => window.print()} className="rounded-full bg-gold px-4 py-2 text-[13px] font-bold text-night">
            ⬇ Baixar PDF
          </button>
        </div>

        <h1 className="mt-5 text-center font-headline text-[26px] font-bold text-gold">{meta.titulo}</h1>
        <p className="mt-1 text-center text-[13px] text-fog">{meta.subtitulo}</p>

        {slug === 'mapa' && (
          <Link to="/mapa" className="mx-auto mt-4 block w-fit rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-[13px] font-bold text-gold">
            📈 Ver meu Mapa de Projeção personalizado →
          </Link>
        )}

        {/* Índice, quando há mais de um documento */}
        {docs.length > 1 && (
          <nav className="mt-6 rounded-2xl border border-white/10 bg-night-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gold/70">Neste material</p>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-[14px] text-cream">
              {docs.map((d, i) => {
                const locked = (d.unlock_day ?? 0) > daysSince
                return (
                  <li key={i} className={locked ? 'text-fog/60' : ''}>
                    {locked ? (
                      <span>🔒 {d.title} <span className="text-gold/70">(abre no {d.unlock_day}º dia)</span></span>
                    ) : (
                      <a href={`#doc-${i}`} className="underline underline-offset-2 hover:text-gold">
                        {d.title}
                      </a>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>
        )}
      </div>

      {/* Conteúdo (vai pro PDF). Materiais com desbloqueio futuro viram teaser. */}
      <div className="print-area mt-6 space-y-6">
        {docs.map((d, i) => {
          const unlockDay = d.unlock_day ?? 0
          const locked = unlockDay > daysSince
          if (locked) {
            const faltam = unlockDay - daysSince
            return (
              <section key={i} id={`doc-${i}`} className="no-print rounded-3xl border-2 border-gold/40 bg-night-card p-6 text-center shadow-xl">
                <span className="text-4xl">🔒</span>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-gold/70">Bônus do {unlockDay}º dia</p>
                <h3 className="mt-1 font-headline text-xl font-bold text-gold">No {unlockDay}º dia você desbloqueia: {d.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-fog">
                  Seu núcleo já está todo liberado. Este material extra abre automaticamente {faltam <= 1 ? 'amanhã' : `em ${faltam} dias`} —
                  quando você já tiver praticado o passo a passo e estiver pronta pra ele.
                </p>
              </section>
            )
          }
          return (
            <section key={i} id={`doc-${i}`} className="rounded-3xl bg-cream p-6 shadow-xl print:rounded-none print:p-0 print:shadow-none">
              <Markdown md={d.body_md} />
            </section>
          )
        })}
      </div>

      <button onClick={() => window.print()} className="no-print cta mt-8">
        ⬇ Baixar este material em PDF
      </button>
    </motion.main>
  )
}
