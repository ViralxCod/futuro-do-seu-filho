import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type Product, type Profile, type Purchase, type Entitlement } from '../lib/supabase'
import { Logo } from '../components/Logo'

type Tab = 'usuarios' | 'produtos' | 'compras' | 'metricas'

export function NinhoAdmin() {
  const [me, setMe] = useState<Profile | null | 'loading'>('loading')
  const [tab, setTab] = useState<Tab>('usuarios')

  useEffect(() => {
    if (!supabase) {
      setMe(null)
      return
    }
    void (async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        setMe(null)
        return
      }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.session.user.id).single()
      setMe((prof as Profile) ?? null)
    })()
  }, [])

  if (me === 'loading') return null
  if (!me || me.role !== 'admin') {
    return (
      <main className="app-col min-h-dvh px-5 pt-14 text-center">
        <Logo />
        <p className="mt-8 text-fog">Acesso restrito. <Link to="/ninho" className="text-gold underline">Entrar n’O Ninho</Link></p>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-3xl px-4 pb-14 pt-6">
      <div className="flex items-center justify-between">
        <Logo />
        <Link to="/ninho" className="text-[13px] text-white/40 underline">← área de membros</Link>
      </div>
      <div className="mt-6 flex gap-2 overflow-x-auto">
        {(['usuarios', 'produtos', 'compras', 'metricas'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-[13px] font-bold capitalize ${tab === t ? 'bg-gold text-night' : 'bg-night-card text-fog'}`}
          >
            {t === 'metricas' ? 'métricas' : t === 'usuarios' ? 'usuários' : t}
          </button>
        ))}
      </div>
      <div className="mt-5">
        {tab === 'usuarios' && <Usuarios />}
        {tab === 'produtos' && <Produtos />}
        {tab === 'compras' && <Compras />}
        {tab === 'metricas' && <Metricas />}
      </div>
    </main>
  )
}

const inputCls = 'w-full rounded-xl border-2 border-white/10 bg-cream px-3 py-2 text-[14px] text-cocoa outline-none focus:border-gold'
const btnCls = 'rounded-full bg-gold px-4 py-2 text-[13px] font-bold text-night'
const btnGhost = 'rounded-full border border-white/20 px-4 py-2 text-[13px] text-fog'

// ---------------- USUÁRIOS ----------------
function Usuarios() {
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState<Profile[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [ents, setEnts] = useState<Entitlement[]>([])
  const [editing, setEditing] = useState<Profile | null>(null)

  const load = async () => {
    if (!supabase) return
    let q = supabase.from('profiles').select('*').order('criado_em', { ascending: false }).limit(100)
    if (query.trim()) q = q.or(`email.ilike.%${query.trim()}%,nome.ilike.%${query.trim()}%`)
    const { data } = await q
    setRows((data as Profile[]) ?? [])
    const { data: prods } = await supabase.from('products').select('*')
    setProducts((prods as Product[]) ?? [])
    const { data: e } = await supabase.from('entitlements').select('*')
    setEnts((e as Entitlement[]) ?? [])
  }
  useEffect(() => void load(), [])

  const toggleEnt = async (userId: string, productId: string) => {
    if (!supabase) return
    const existing = ents.find((e) => e.user_id === userId && e.product_id === productId)
    if (existing) await supabase.from('entitlements').delete().eq('id', existing.id)
    else await supabase.from('entitlements').insert({ user_id: userId, product_id: productId, origem: 'manual' })
    await load()
  }

  const saveEdit = async () => {
    if (!supabase || !editing) return
    await supabase.from('profiles').update({ nome: editing.nome, whatsapp: editing.whatsapp, role: editing.role }).eq('id', editing.id)
    setEditing(null)
    await load()
  }

  const remove = async (p: Profile) => {
    if (!supabase) return
    if (!confirm(`Excluir ${p.email}? (remove perfil e acessos)`)) return
    await supabase.from('profiles').delete().eq('id', p.id)
    await load()
  }

  return (
    <div>
      <div className="flex gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="buscar por e-mail ou nome" className={inputCls} />
        <button onClick={load} className={btnCls}>Buscar</button>
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((p) => (
          <div key={p.id} className="rounded-2xl bg-night-card p-4">
            {editing?.id === p.id ? (
              <div className="space-y-2">
                <p className="text-[13px] text-fog">{p.email}</p>
                <input value={editing.nome ?? ''} onChange={(e) => setEditing({ ...editing, nome: e.target.value })} placeholder="nome" className={inputCls} />
                <input value={editing.whatsapp ?? ''} onChange={(e) => setEditing({ ...editing, whatsapp: e.target.value })} placeholder="whatsapp" className={inputCls} />
                <select value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value as Profile['role'] })} className={inputCls}>
                  <option value="member">member</option>
                  <option value="admin">admin</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className={btnCls}>Salvar</button>
                  <button onClick={() => setEditing(null)} className={btnGhost}>Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[14px] font-bold text-cream">{p.nome || '(sem nome)'} {p.role === 'admin' && <span className="text-gold">★</span>}</p>
                    <p className="text-[12px] text-fog">{p.email}{p.whatsapp ? ` · ${p.whatsapp}` : ''} · perfil quiz: <strong className="text-gold">{p.quiz_profile ?? '—'}</strong></p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => setEditing(p)} className={btnGhost}>Editar</button>
                    <button onClick={() => remove(p)} className="rounded-full border border-coral/50 px-3 py-2 text-[13px] text-coral">Excluir</button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {products.map((prod) => {
                    const has = ents.some((e) => e.user_id === p.id && e.product_id === prod.id)
                    return (
                      <button
                        key={prod.id}
                        onClick={() => toggleEnt(p.id, prod.id)}
                        className={`rounded-full px-3 py-1.5 text-[12px] font-bold ${has ? 'bg-mint/20 text-mint' : 'bg-white/5 text-white/40'}`}
                      >
                        {has ? '✓ ' : '+ '}{prod.slug}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        ))}
        {rows.length === 0 && <p className="text-center text-[13px] text-fog">Nenhum usuário ainda.</p>}
      </div>
    </div>
  )
}

// ---------------- PRODUTOS ----------------
const emptyProd: Omit<Product, 'id'> = { nome: '', slug: '', tipo: 'produto', descricao: '', preco: '', checkout_url: '', ativo: true }

function Produtos() {
  const [rows, setRows] = useState<Product[]>([])
  const [form, setForm] = useState<(Omit<Product, 'id'> & { id?: string }) | null>(null)

  const load = async () => {
    if (!supabase) return
    const { data } = await supabase.from('products').select('*').order('nome')
    setRows((data as Product[]) ?? [])
  }
  useEffect(() => void load(), [])

  const save = async () => {
    if (!supabase || !form || !form.nome || !form.slug) return
    const { id, ...values } = form
    if (id) await supabase.from('products').update(values).eq('id', id)
    else await supabase.from('products').insert(values)
    setForm(null)
    await load()
  }

  return (
    <div>
      <button onClick={() => setForm(emptyProd)} className={btnCls}>+ Novo produto/consulta</button>
      {form && (
        <div className="mt-4 space-y-2 rounded-2xl bg-night-card p-4">
          <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="nome" className={inputCls} />
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="slug (ex.: mentoria)" className={inputCls} />
          <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as Product['tipo'] })} className={inputCls}>
            <option value="produto">produto</option>
            <option value="consulta">consulta</option>
          </select>
          <input value={form.preco ?? ''} onChange={(e) => setForm({ ...form, preco: e.target.value })} placeholder="preço (ex.: R$ 97)" className={inputCls} />
          <input value={form.checkout_url ?? ''} onChange={(e) => setForm({ ...form, checkout_url: e.target.value })} placeholder="link de checkout" className={inputCls} />
          <textarea value={form.descricao ?? ''} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="descrição" className={inputCls} rows={2} />
          <label className="flex items-center gap-2 text-[13px] text-fog">
            <input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} /> ativo
          </label>
          <div className="flex gap-2">
            <button onClick={save} className={btnCls}>Salvar</button>
            <button onClick={() => setForm(null)} className={btnGhost}>Cancelar</button>
          </div>
        </div>
      )}
      <div className="mt-4 space-y-2">
        {rows.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-2xl bg-night-card p-4">
            <div>
              <p className="text-[14px] font-bold text-cream">{p.nome} {!p.ativo && <span className="text-coral">(inativo)</span>}</p>
              <p className="text-[12px] text-fog">{p.slug} · {p.tipo} · {p.preco || 'sem preço'}</p>
            </div>
            <button onClick={() => setForm(p)} className={btnGhost}>Editar</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------- COMPRAS ----------------
function Compras() {
  const [rows, setRows] = useState<Purchase[]>([])
  useEffect(() => {
    void (async () => {
      if (!supabase) return
      const { data } = await supabase.from('purchases').select('*').order('criado_em', { ascending: false }).limit(200)
      setRows((data as Purchase[]) ?? [])
    })()
  }, [])
  return (
    <div className="space-y-2">
      {rows.map((c) => (
        <div key={c.id} className="rounded-2xl bg-night-card p-4 text-[13px]">
          <p className="font-bold text-cream">{c.email} · {c.produto} {c.valor ? `· R$ ${c.valor}` : ''}</p>
          <p className="text-fog">{new Date(c.criado_em).toLocaleString('pt-BR')} · status: <span className={/aprov|paid/i.test(c.status) ? 'text-mint' : 'text-coral'}>{c.status}</span>{c.gateway_id ? ` · ${c.gateway_id}` : ''}</p>
        </div>
      ))}
      {rows.length === 0 && <p className="text-center text-[13px] text-fog">Nenhuma compra registrada (o webhook do gateway grava aqui).</p>}
    </div>
  )
}

// ---------------- MÉTRICAS ----------------
function Metricas() {
  const [m, setM] = useState<{ membros: number; dia: number; semana: number; upsell: string } | null>(null)
  useEffect(() => {
    void (async () => {
      if (!supabase) return
      const { count: membros } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
      const semana = new Date(Date.now() - 7 * 864e5)
      const { count: dia } = await supabase.from('purchases').select('*', { count: 'exact', head: true }).gte('criado_em', hoje.toISOString())
      const { count: sem } = await supabase.from('purchases').select('*', { count: 'exact', head: true }).gte('criado_em', semana.toISOString())
      const { count: mapas } = await supabase.from('purchases').select('*', { count: 'exact', head: true }).eq('produto', 'mapa')
      const { count: manuais } = await supabase.from('purchases').select('*', { count: 'exact', head: true }).eq('produto', 'manual')
      const upsell = mapas ? `${Math.round(((manuais ?? 0) / mapas) * 100)}%` : '—'
      setM({ membros: membros ?? 0, dia: dia ?? 0, semana: sem ?? 0, upsell })
    })()
  }, [])
  if (!m) return null
  const card = (label: string, value: string | number) => (
    <div className="rounded-2xl bg-night-card p-5 text-center">
      <p className="font-headline text-3xl font-bold text-gold">{value}</p>
      <p className="mt-1 text-[12px] text-fog">{label}</p>
    </div>
  )
  return (
    <div className="grid grid-cols-2 gap-3">
      {card('membros', m.membros)}
      {card('compras hoje', m.dia)}
      {card('compras na semana', m.semana)}
      {card('taxa de upsell', m.upsell)}
    </div>
  )
}
