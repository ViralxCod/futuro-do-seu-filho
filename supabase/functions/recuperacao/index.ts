// Edge Function: recuperacao (Leona)
// Recuperação de vendas com IA. Dois gatilhos:
//   (a) carrinho abandonado — InitiateCheckout sem Purchase em X min
//   (b) lead que deixou o WhatsApp e não comprou
// Fluxo por contato: gera a mensagem da Leona (OpenAI) → envia via
// enviarWhatsapp() → registra em public.envios.
//
// LGPD: só processa quem deu opt-in (deixou o WhatsApp) e NÃO deu opt-out.
//
// Deploy:  supabase functions deploy recuperacao --no-verify-jwt
// Secrets (EU configuro):
//   supabase secrets set OPENAI_API_KEY=sk-...            (IA da Leona)
//   supabase secrets set CRON_SECRET=um-segredo-seu       (protege o disparo)
//   supabase secrets set WHATSAPP_API_URL=...             (ferramenta de envio)
//   supabase secrets set WHATSAPP_API_TOKEN=...           (idem)
//   supabase secrets set SITE_URL=https://futuro-do-seu-filho.vercel.app (opt-out)
// (SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já existem no ambiente da function)
//
// Chamada:
//   - Cron (varre a fila):        POST /recuperacao          body {}          header x-cron-secret
//   - Carrinho abandonado (1):    POST /recuperacao  body { "tipo":"carrinho", "whatsapp":"...", "nome":"...", "leadId":"..." }
//   - Lead específico (1):        POST /recuperacao  body { "tipo":"lead", "leadId":"..." }

import { createClient } from 'npm:@supabase/supabase-js@2'
import { buildLeonaMessages, leonaFallback, type LeonaContext } from './leona.ts'

// Janela de espera antes de recuperar (min) e teto por rodada.
const ESPERA_MIN = Number(Deno.env.get('RECUPERACAO_ESPERA_MIN') ?? '15')
const LOTE_MAX = Number(Deno.env.get('RECUPERACAO_LOTE_MAX') ?? '25')

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

interface LeadRow {
  id: string
  whatsapp: string
  nome: string | null
  origem: string | null
  status: string
  opt_out: boolean
  criado_em: string
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)

  // Proteção: exige o segredo do cron (se configurado).
  const cronSecret = Deno.env.get('CRON_SECRET')
  if (cronSecret && req.headers.get('x-cron-secret') !== cronSecret) {
    return json({ error: 'unauthorized' }, 401)
  }

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    /* corpo vazio = modo cron */
  }

  const results: unknown[] = []

  // ---- Modo 1: um contato específico (webhook de carrinho ou lead) ----
  if (body.whatsapp || body.leadId) {
    const lead = await resolveLead(body)
    if (!lead) return json({ error: 'lead não encontrado' }, 404)
    const tipo = (body.tipo as 'lead' | 'carrinho') ?? 'lead'
    results.push(await recuperar(lead, tipo))
    return json({ processados: results.length, results })
  }

  // ---- Modo 2: cron — varre a fila de leads não convertidos ----
  const corte = new Date(Date.now() - ESPERA_MIN * 60_000).toISOString()
  const { data: leads } = await admin
    .from('leads')
    .select('id, whatsapp, nome, origem, status, opt_out, criado_em')
    .eq('status', 'lead')
    .eq('opt_out', false)
    .eq('opt_in', true)
    .lt('criado_em', corte)
    .order('criado_em', { ascending: true })
    .limit(LOTE_MAX)

  for (const lead of (leads ?? []) as LeadRow[]) {
    // Dedupe: não reenvia se já houve um envio pra esse lead.
    const { count } = await admin
      .from('envios')
      .select('id', { count: 'exact', head: true })
      .eq('lead_id', lead.id)
    if ((count ?? 0) > 0) continue
    results.push(await recuperar(lead, 'lead'))
  }

  return json({ modo: 'cron', espera_min: ESPERA_MIN, processados: results.length, results })
})

/** Resolve um lead a partir do corpo (por id, senão por whatsapp). */
async function resolveLead(body: Record<string, unknown>): Promise<LeadRow | null> {
  if (body.leadId) {
    const { data } = await admin.from('leads').select('*').eq('id', String(body.leadId)).maybeSingle()
    if (data) return data as LeadRow
  }
  if (body.whatsapp) {
    const numero = String(body.whatsapp).replace(/[^\d]/g, '')
    const { data } = await admin
      .from('leads')
      .select('*')
      .eq('whatsapp', numero)
      .order('criado_em', { ascending: false })
      .maybeSingle()
    if (data) return data as LeadRow
    // Sem lead salvo (ex.: carrinho sem opt-in de WhatsApp): não podemos
    // contatar por LGPD. Retorna null.
  }
  return null
}

/** Gera a mensagem da Leona, envia e registra em envios. */
async function recuperar(lead: LeadRow, tipo: 'lead' | 'carrinho') {
  // LGPD: nunca contata quem pediu pra sair.
  if (lead.opt_out) return { leadId: lead.id, status: 'pulado', motivo: 'opt_out' }

  const siteUrl = Deno.env.get('SITE_URL') ?? ''
  const ctx: LeonaContext = {
    nome: lead.nome,
    tipo,
    origem: lead.origem,
    optOutUrl: siteUrl ? `${siteUrl}/sair?leadId=${lead.id}` : null,
  }

  const { mensagem, viaIa } = await gerarMensagem(ctx)
  const envio = await enviarWhatsapp(lead.whatsapp, mensagem)

  const { error } = await admin.from('envios').insert({
    lead_id: lead.id,
    whatsapp: lead.whatsapp,
    tipo,
    canal: 'whatsapp',
    mensagem,
    status: envio.status, // 'enviado' | 'erro' | 'pendente' | 'simulado'
    provider_id: envio.providerId ?? null,
    erro: envio.erro ?? null,
  })

  return { leadId: lead.id, viaIa, status: envio.status, erro: error?.message ?? envio.erro ?? null }
}

/** Chama a OpenAI com a persona da Leona. Sem chave → usa o fallback. */
async function gerarMensagem(ctx: LeonaContext): Promise<{ mensagem: string; viaIa: boolean }> {
  const key = Deno.env.get('OPENAI_API_KEY')
  if (!key) return { mensagem: leonaFallback(ctx), viaIa: false }
  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini',
        messages: buildLeonaMessages(ctx),
        temperature: 0.8,
        max_tokens: 220,
      }),
    })
    if (!r.ok) return { mensagem: leonaFallback(ctx), viaIa: false }
    const data = await r.json()
    const texto = data?.choices?.[0]?.message?.content?.trim()
    return texto ? { mensagem: texto, viaIa: true } : { mensagem: leonaFallback(ctx), viaIa: false }
  } catch {
    return { mensagem: leonaFallback(ctx), viaIa: false }
  }
}

// ============================================================
// enviarWhatsapp — FERRAMENTA ABSTRATA de envio.
// Pluga aqui o provedor (Voxuy / API oficial / etc.) quando tiver as creds.
// Sem WHATSAPP_API_URL configurada, a mensagem é GERADA e REGISTRADA como
// 'pendente' (nada é enviado) — assim o pipeline já funciona ponta a ponta.
// ============================================================
interface EnvioResultado {
  status: 'enviado' | 'erro' | 'pendente' | 'simulado'
  providerId?: string | null
  erro?: string | null
}

async function enviarWhatsapp(numero: string, texto: string): Promise<EnvioResultado> {
  const url = Deno.env.get('WHATSAPP_API_URL')
  const token = Deno.env.get('WHATSAPP_API_TOKEN')

  if (!url) {
    // Ferramenta ainda não plugada: registra pra enviar depois.
    return { status: 'pendente', erro: 'WHATSAPP_API_URL não configurada' }
  }

  try {
    // Payload genérico — ajuste os campos conforme o provedor escolhido.
    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ number: numero, phone: numero, message: texto, text: texto }),
    })
    const data = await r.json().catch(() => ({}))
    if (!r.ok) return { status: 'erro', erro: JSON.stringify(data).slice(0, 500) }
    return { status: 'enviado', providerId: data?.id ?? data?.messageId ?? null }
  } catch (e) {
    return { status: 'erro', erro: String(e).slice(0, 500) }
  }
}
