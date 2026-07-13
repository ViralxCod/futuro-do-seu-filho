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
}

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
        .select('title, body_md, ord')
        .eq('product_slug', slug)
        .order('ord')
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
              {docs.map((d, i) => (
                <li key={i}>
                  <a href={`#doc-${i}`} className="underline underline-offset-2 hover:text-gold">
                    {d.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>

      {/* Conteúdo (vai pro PDF) */}
      <div className="print-area mt-6 space-y-6">
        {docs.map((d, i) => (
          <section key={i} id={`doc-${i}`} className="rounded-3xl bg-cream p-6 shadow-xl print:rounded-none print:p-0 print:shadow-none">
            <Markdown md={d.body_md} />
          </section>
        ))}
      </div>

      <button onClick={() => window.print()} className="no-print cta mt-8">
        ⬇ Baixar este material em PDF
      </button>
    </motion.main>
  )
}
