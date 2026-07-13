import { config, SUPABASE_URL, SUPABASE_ANON_KEY, MAPA_VALUE } from '../config'

// Eventos do funil
export type FunnelEvent =
  | 'quiz_start'
  | 'bloco2_completo' // lead de alta intenção
  | 'resultado_visto'
  | 'compromisso_verdade' // micro-compromisso antes da análise
  | 'checkout_1999_iniciado'
  | 'compra_1999'
  | 'upsell_visto'
  | 'compra_27'
  | 'completo_visto' // oferta O Ninho Completo exibida
  | 'checkout_completo_iniciado'
  | 'compra_completo'
  | 'mapa_entregue'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void; load?: (id: string) => void; page?: () => void }
    _fbq?: unknown
  }
}

let initialized = false

/** Injeta o Meta Pixel (e stub do TikTok) — chame uma vez no boot. */
export function initPixels() {
  if (initialized) return
  initialized = true

  if (config.pixels.metaPixelId) {
    // Snippet oficial do Meta Pixel
    ;(function (f: Window, b: Document, e: string, v: string) {
      if (f.fbq) return
      const n: any = (f.fbq = function (...args: unknown[]) {
        n.callMethod ? n.callMethod(...args) : n.queue.push(args)
      })
      if (!f._fbq) f._fbq = n
      n.push = n
      n.loaded = true
      n.version = '2.0'
      n.queue = []
      const t = b.createElement(e) as HTMLScriptElement
      t.async = true
      t.src = v
      const s = b.getElementsByTagName(e)[0]
      s.parentNode?.insertBefore(t, s)
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
    window.fbq?.('init', config.pixels.metaPixelId)
    window.fbq?.('track', 'PageView')
  }

  // TikTok Pixel — stub: implemente com o snippet oficial quando tiver o ID
  if (config.pixels.tiktokPixelId && !window.ttq) {
    window.ttq = {
      track: (event, params) => console.info('[ttq stub]', event, params ?? ''),
    }
  }
}

// Purchase é tratado exclusivamente por `trackPurchase` (com event_id +
// CAPI). Aqui ficam só os eventos padrão que não representam compra.
const META_STANDARD: Partial<Record<FunnelEvent, { name: string; params?: Record<string, unknown> }>> = {
  quiz_start: { name: 'Lead' },
  checkout_completo_iniciado: { name: 'InitiateCheckout', params: { value: 67.55, currency: 'BRL' } },
}

/** InitiateCheckout do Mapa usa o preço único (R$ 24,90). */
function metaFor(event: FunnelEvent): { name: string; params?: Record<string, unknown> } | undefined {
  if (event === 'checkout_1999_iniciado') {
    return { name: 'InitiateCheckout', params: { value: MAPA_VALUE, currency: 'BRL' } }
  }
  return META_STANDARD[event]
}

/** Dispara um evento do funil para Meta + TikTok (deduplicado por sessão). */
export function track(event: FunnelEvent) {
  const key = `track_${event}`
  if (sessionStorage.getItem(key)) return
  sessionStorage.setItem(key, '1')

  if (window.fbq) {
    const std = metaFor(event)
    if (std) window.fbq('track', std.name, std.params)
    window.fbq('trackCustom', event)
  }
  window.ttq?.track(event)

  if (import.meta.env.DEV) console.info('[track]', event)
}

// ============================================================
// PURCHASE — evento de compra confirmada (Pixel + Conversions API)
// ============================================================

/** Gera um id único (event_id) — usado igual no Pixel e na CAPI p/ deduplicação. */
function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  // fallback simples
  return 'evt-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
}

export interface PurchaseInput {
  /** produto comprado (define o valor padrão e o dedup fallback) */
  product: 'mapa' | 'manual' | 'completo'
  /** valor REAL pago — dinâmico se houver order bump/upsell */
  value: number
  /** moeda ISO (padrão BRL) */
  currency?: string
  /** id do pedido vindo do gateway (Cakto). Torna o dedup à prova de reload/volta. */
  orderId?: string | null
  /** e-mail da compra, se disponível — melhora o match da CAPI (é hasheado no servidor) */
  email?: string | null
}

/**
 * Dispara o evento padrão `Purchase` no momento em que o pagamento está
 * confirmado como aprovado — UMA ÚNICA vez por compra real.
 *
 * - Deduplicação: flag em localStorage por `orderId` (ou por produto, se o
 *   gateway não enviar id). Não redispara em reload nem se a pessoa voltar.
 * - O NAVEGADOR gera o `event_id` e envia esse MESMO id ao servidor (Edge
 *   Function). Assim a Meta deduplica Pixel + CAPI sem depender de a Cakto
 *   injetar o id do pedido na URL de retorno.
 * - `value` é dinâmico (reflete o valor real, incluindo order bumps/upsells).
 */
export function trackPurchase({ product, value, currency = 'BRL', orderId, email }: PurchaseInput): void {
  const dedupKey = `purchase_fired_${orderId ?? product}`
  if (localStorage.getItem(dedupKey)) return

  // event_id gerado no navegador. Se houver orderId, usamos um formato estável
  // (à prova de reload); senão, um UUID aleatório — o servidor recebe ESTE id.
  const eventId = orderId ? `purchase-${orderId}` : uuid()
  localStorage.setItem(dedupKey, eventId)

  const params = { value, currency, content_type: 'product', content_name: product }

  // 1) Pixel do navegador — carrega o eventID para deduplicar com a CAPI.
  window.fbq?.('track', 'Purchase', params, { eventID: eventId })
  window.ttq?.track('CompletePayment', params)

  // 2) Conversions API (server-side) via Edge Function, MESMO event_id.
  void sendCapiPurchase({ eventId, value, currency, product, email })

  if (import.meta.env.DEV) console.info('[purchase]', { eventId, value, currency, product })
}

// Endpoint da Edge Function que reenvia o Purchase à CAPI (token fica no
// Supabase, nunca no navegador). Deriva da URL do projeto Supabase.
const CAPI_ENDPOINT = `${SUPABASE_URL.replace(/\/(rest\/v1)?\/?$/, '')}/functions/v1/capi-purchase`

/** Lê um cookie do navegador (para pegar _fbp / _fbc do Meta). */
function readCookie(name: string): string | undefined {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : undefined
}

/** Reconstrói o _fbc a partir do ?fbclid= caso o cookie ainda não exista. */
function fbcFromUrl(): string | undefined {
  const fbclid = new URLSearchParams(window.location.search).get('fbclid')
  if (!fbclid) return undefined
  return `fb.1.${Date.now()}.${fbclid}`
}

/** Envia o Purchase à Conversions API via Edge Function (mesmo event_id do Pixel). */
async function sendCapiPurchase(input: {
  eventId: string
  value: number
  currency: string
  product: string
  email?: string | null
}): Promise<void> {
  try {
    await fetch(CAPI_ENDPOINT, {
      method: 'POST',
      keepalive: true, // sobrevive à navegação de página (Obrigada redireciona)
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        eventId: input.eventId,
        value: input.value,
        currency: input.currency,
        product: input.product,
        email: input.email ?? undefined,
        eventSourceUrl: window.location.href,
        fbp: readCookie('_fbp'),
        fbc: readCookie('_fbc') ?? fbcFromUrl(),
      }),
    })
  } catch (err) {
    // CAPI é redundância — nunca deve quebrar a página se falhar.
    if (import.meta.env.DEV) console.warn('[capi] falhou', err)
  }
}

/**
 * Extrai os dados de uma compra a partir dos parâmetros de retorno do gateway.
 * O Cakto pode enviar valor/pedido/e-mail na URL de retorno; se não vier,
 * usamos o preço configurado como fallback.
 */
export function purchaseFromParams(product: 'mapa' | 'manual' | 'completo', params: URLSearchParams): PurchaseInput {
  const fallback = product === 'mapa' ? MAPA_VALUE : product === 'manual' ? 27.99 : 67.55
  const raw = params.get('value') ?? params.get('valor') ?? params.get('amount')
  // aceita "27,99" ou "27.99"
  const parsed = raw ? Number(raw.replace(',', '.')) : NaN
  const value = Number.isFinite(parsed) && parsed > 0 ? parsed : fallback

  const orderId =
    params.get('order') ??
    params.get('order_id') ??
    params.get('pedido') ??
    params.get('transaction_id') ??
    params.get('transaction') ??
    params.get('ref') ??
    null

  const email = params.get('email') ?? params.get('customer_email') ?? null

  return { product, value, orderId, email }
}
