import { supabase } from './supabase'

// ============================================================
// CAPTURA DE LEAD (WhatsApp) + UTM — opt-in de recuperação (Leona)
// LGPD: só gravamos quem DEIXOU o WhatsApp de propósito (opt-in explícito).
// A visitante pode pular sem bloqueio; o opt-out fica em public.leads.opt_out.
// ============================================================

const UTM_LS_KEY = 'funil-utm'

export interface UtmData {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  fbclid?: string
  referrer?: string
  landing_url?: string
}

/**
 * Grava a origem/UTM da visita na PRIMEIRA carga (antes de o React Router
 * limpar a query). Chame uma vez no boot do app. Não sobrescreve uma origem
 * já gravada com valores vazios (a atribuição é do primeiro toque).
 */
export function captureUtmOnce(): void {
  try {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(UTM_LS_KEY)) return // já atribuído (first-touch)
    const p = new URLSearchParams(window.location.search)
    const data: UtmData = {}
    const keys: (keyof UtmData)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid']
    for (const k of keys) {
      const v = p.get(k)
      if (v) data[k] = v
    }
    data.referrer = document.referrer || undefined
    data.landing_url = window.location.href
    // Só persiste se houver algum sinal de campanha ou um referrer útil.
    if (Object.values(data).some(Boolean)) localStorage.setItem(UTM_LS_KEY, JSON.stringify(data))
  } catch {
    /* localStorage indisponível — segue sem UTM */
  }
}

/** Lê a UTM gravada (objeto vazio se não houver). */
export function getUtm(): UtmData {
  try {
    const raw = localStorage.getItem(UTM_LS_KEY)
    return raw ? (JSON.parse(raw) as UtmData) : {}
  } catch {
    return {}
  }
}

/** Rótulo curto de origem para exibir no admin (ex.: "facebook / cpc" ou "direto"). */
export function origemLabel(utm: UtmData = getUtm()): string {
  if (utm.utm_source || utm.utm_medium) return [utm.utm_source, utm.utm_medium].filter(Boolean).join(' / ')
  if (utm.fbclid) return 'facebook'
  if (utm.referrer) {
    try {
      return new URL(utm.referrer).hostname.replace(/^www\./, '')
    } catch {
      return 'referral'
    }
  }
  return 'direto'
}

export interface CaptureLeadInput {
  whatsapp: string
  nome?: string | null
}

/**
 * Insere (opt-in) um lead em public.leads via cliente anônimo. A RLS permite
 * INSERT anônimo, mas NÃO permite ler de volta — então não usamos .select().
 * Gera o id no cliente para conseguir marcar "comprou" depois sem SELECT.
 * Nunca lança: captura é secundária e não pode travar o funil.
 */
export async function captureLead({ whatsapp, nome }: CaptureLeadInput): Promise<string | null> {
  const numero = normalizeWhats(whatsapp)
  if (!numero) return null
  if (!supabase) return null
  const id = newId()
  const utm = getUtm()
  try {
    const { error } = await supabase.from('leads').insert({
      id,
      whatsapp: numero,
      nome: nome ?? null,
      origem: origemLabel(utm),
      utm_source: utm.utm_source ?? null,
      utm_medium: utm.utm_medium ?? null,
      utm_campaign: utm.utm_campaign ?? null,
      utm_content: utm.utm_content ?? null,
      utm_term: utm.utm_term ?? null,
      fbclid: utm.fbclid ?? null,
      referrer: utm.referrer ?? null,
      landing_url: utm.landing_url ?? null,
      status: 'lead',
      opt_in: true,
    })
    if (error) {
      if (import.meta.env.DEV) console.warn('[leads] insert falhou', error.message)
      return null
    }
    return id
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[leads] insert erro', e)
    return null
  }
}

/**
 * Marca um lead como "comprou" no retorno do pagamento (tira ele da fila da
 * Leona). A RLS de UPDATE anônimo permite apenas virar status=comprou.
 */
export async function markLeadComprou(leadId: string | null): Promise<void> {
  if (!leadId || !supabase) return
  try {
    // RPC security-definer: só permite virar status=comprou por id (não abre
    // UPDATE anônimo geral na tabela).
    await supabase.rpc('mark_lead_comprou', { lead_id: leadId })
  } catch {
    /* não bloqueia o fluxo de pós-compra */
  }
}

/** Mantém dígitos e um "+" inicial opcional; retorna null se não parecer telefone. */
function normalizeWhats(raw: string): string | null {
  const v = raw.trim()
  if (!v) return null
  const digits = v.replace(/[^\d]/g, '')
  if (digits.length < 10) return null // curto demais pra ser um número válido
  return digits
}

/** UUID v4 (crypto quando disponível; fallback simples). */
function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const val = c === 'x' ? r : (r & 0x3) | 0x8
    return val.toString(16)
  })
}
