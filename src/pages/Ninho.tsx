import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase, type Product, type Profile } from '../lib/supabase'
import { Logo } from '../components/Logo'
import { useFunnel } from '../store'
import { openCheckout } from '../config'

export function Ninho() {
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setReady(true)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!supabase) {
    return (
      <Shell>
        <p className="mt-8 rounded-2xl bg-night-card p-5 text-center text-[14px] text-fog">
          O Ninho ainda não foi conectado ao Supabase. Cole <code className="text-gold">SUPABASE_URL</code> e{' '}
          <code className="text-gold">SUPABASE_ANON_KEY</code> em <code className="text-gold">src/config.ts</code> (veja
          NINHO-SETUP.md).
        </p>
        <button onClick={() => navigate('/')} className="mx-auto mt-6 block text-[13px] text-white/40 underline">
          ← voltar ao início
        </button>
      </Shell>
    )
  }

  if (!ready) return <Shell />
  return session ? <Dashboard session={session} /> : <Login />
}

function Shell({ children }: { children?: React.ReactNode }) {
  return (
    <main className="app-col min-h-dvh px-5 pb-14 pt-10">
      <Logo size="lg" />
      <p className="mt-2 text-center text-[12px] italic text-fog">onde mães criam filhos prontos pra voar</p>
      {children}
    </main>
  )
}

// ---------------- LOGIN ----------------
function Login() {
  const [mode, setMode] = useState<'senha' | 'magic' | 'cadastro'>('senha')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const run = async () => {
    if (!supabase || !email.trim()) return
    setBusy(true)
    setMsg(null)
    try {
      if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({ email: email.trim() })
        setMsg(error ? `Erro: ${error.message}` : '✓ Link enviado! Confira seu e-mail.')
      } else if (mode === 'cadastro') {
        const { error } = await supabase.auth.signUp({ email: email.trim(), password })
        setMsg(error ? `Erro: ${error.message}` : '✓ Conta criada! Confirme no seu e-mail (ou entre direto).')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) setMsg(`Erro: ${error.message}`)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <Shell>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-3xl bg-night-card p-6 shadow-xl">
        <h1 className="text-center font-headline text-xl font-bold text-cream">
          {mode === 'cadastro' ? 'Criar minha conta' : 'Entrar n’O Ninho'}
        </h1>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu e-mail"
          type="email"
          className="mt-5 w-full rounded-2xl border-2 border-white/10 bg-cream px-4 py-3 text-[15px] text-cocoa outline-none focus:border-gold"
        />
        {mode !== 'magic' && (
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="sua senha"
            type="password"
            className="mt-3 w-full rounded-2xl border-2 border-white/10 bg-cream px-4 py-3 text-[15px] text-cocoa outline-none focus:border-gold"
          />
        )}
        <button onClick={run} disabled={busy} className="cta mt-4 disabled:animate-none disabled:opacity-50">
          {busy ? 'Aguarde...' : mode === 'magic' ? 'Enviar link mágico →' : mode === 'cadastro' ? 'Criar conta →' : 'Entrar →'}
        </button>
        {msg && <p className="mt-3 text-center text-[13px] text-mint">{msg}</p>}
        <div className="mt-5 space-y-2 text-center text-[13px]">
          {mode !== 'magic' && (
            <button onClick={() => setMode('magic')} className="block w-full text-gold underline underline-offset-2">
              Entrar sem senha (link mágico por e-mail)
            </button>
          )}
          {mode !== 'senha' && (
            <button onClick={() => setMode('senha')} className="block w-full text-white/40 underline underline-offset-2">
              Entrar com e-mail e senha
            </button>
          )}
          {mode !== 'cadastro' && (
            <button onClick={() => setMode('cadastro')} className="block w-full text-white/40 underline underline-offset-2">
              Primeira vez aqui? Criar conta
            </button>
          )}
        </div>
      </motion.div>
    </Shell>
  )
}

// ---------------- DASHBOARD ----------------
function Dashboard({ session }: { session: Session }) {
  const navigate = useNavigate()
  const { profile, markPaidMapa, markPaidManual, setProfile } = useFunnel()
  const [me, setMe] = useState<Profile | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [owned, setOwned] = useState<Set<string>>(new Set()) // product_id

  useEffect(() => {
    if (!supabase) return
    void (async () => {
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      if (prof) {
        setMe(prof as Profile)
        // sincroniza o perfil do quiz: local → conta, ou conta → local
        if (profile && !prof.quiz_profile) {
          await supabase.from('profiles').update({ quiz_profile: profile }).eq('id', session.user.id)
        } else if (!profile && prof.quiz_profile) {
          setProfile(prof.quiz_profile)
        }
      }
      const { data: prods } = await supabase.from('products').select('*').eq('ativo', true).order('nome')
      setProducts((prods as Product[]) ?? [])
      const { data: ents } = await supabase.from('entitlements').select('product_id').eq('user_id', session.user.id)
      const ids = new Set<string>((ents ?? []).map((e: { product_id: string }) => e.product_id))
      setOwned(ids)
      // entitlements da conta liberam a entrega local
      const bySlug = (slug: string) => (prods as Product[])?.find((p) => p.slug === slug)
      if (bySlug('mapa') && ids.has(bySlug('mapa')!.id)) markPaidMapa()
      if (bySlug('manual') && ids.has(bySlug('manual')!.id)) markPaidManual()
    })()
  }, [session.user.id])

  const child = useFunnel((s) => s.child)
  const firstName = me?.nome?.split(' ')[0] ?? null

  const cardFor = (p: Product) => {
    const has = owned.has(p.id)
    if (p.slug === 'mapa') {
      return (
        <ProductCard key={p.id} title={child?.name ? `Meu Mapa do ${child.name}` : 'Meu Mapa'} desc={p.descricao} unlocked={has}>
          {has ? (
            <button onClick={() => navigate('/mapa')} className="cta mt-3 py-3 text-[14px]">Abrir meu Mapa →</button>
          ) : (
            <button onClick={() => navigate('/')} className="cta mt-3 py-3 text-[14px]">Fazer o teste →</button>
          )}
        </ProductCard>
      )
    }
    if (p.slug === 'manual') {
      return (
        <ProductCard key={p.id} title={p.nome} desc={p.descricao} unlocked={has}>
          {has ? (
            <button onClick={() => navigate('/mapa')} className="cta mt-3 py-3 text-[14px]">Abrir o Manual →</button>
          ) : (
            <button onClick={() => (p.checkout_url ? (window.location.href = p.checkout_url) : openCheckout('manual'))} className="cta mt-3 py-3 text-[14px]">
              🔒 Desbloquear por {p.preco ?? 'R$ 27'} →
            </button>
          )}
        </ProductCard>
      )
    }
    return (
      <ProductCard key={p.id} title={p.nome} desc={p.descricao} unlocked={has} soon={p.tipo === 'consulta' && !p.checkout_url}>
        {has ? (
          <p className="mt-3 text-[13px] text-mint">✓ Liberado</p>
        ) : p.checkout_url ? (
          <button onClick={() => (window.location.href = p.checkout_url!)} className="cta mt-3 py-3 text-[14px]">
            {p.preco ? `Quero — ${p.preco} →` : 'Quero →'}
          </button>
        ) : (
          <p className="mt-3 text-[12px] tracking-widest text-gold/70">EM BREVE</p>
        )}
      </ProductCard>
    )
  }

  return (
    <main className="app-col min-h-dvh px-5 pb-14 pt-8">
      <Logo />
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center font-headline text-2xl font-bold text-cream">
        Bem-vinda de volta{firstName ? `, ${firstName}` : ''} 💛
      </motion.h1>

      <div className="mt-6 space-y-4">{products.map(cardFor)}</div>

      <div className="mt-8 flex items-center justify-center gap-5 text-[13px]">
        {me?.role === 'admin' && (
          <Link to="/ninho/admin" className="text-gold underline underline-offset-2">Painel admin</Link>
        )}
        <button onClick={() => supabase?.auth.signOut()} className="text-white/40 underline underline-offset-2">Sair</button>
      </div>
    </main>
  )
}

function ProductCard({ title, desc, unlocked, soon, children }: { title: string; desc: string | null; unlocked: boolean; soon?: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border p-5 shadow-lg ${unlocked ? 'border-gold/40 bg-night-card' : 'border-white/10 bg-night-card/70'}`}
    >
      <h2 className="font-headline text-lg font-bold text-cream">
        {unlocked ? '🗝️ ' : soon ? '🕊️ ' : '🔒 '}
        {title}
      </h2>
      {desc && <p className="mt-1.5 text-[13px] leading-relaxed text-fog">{desc}</p>}
      {children}
    </motion.div>
  )
}
