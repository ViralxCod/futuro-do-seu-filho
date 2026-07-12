import { config } from '../config'

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

const META_STANDARD: Partial<Record<FunnelEvent, { name: string; params?: Record<string, unknown> }>> = {
  quiz_start: { name: 'Lead' },
  checkout_1999_iniciado: { name: 'InitiateCheckout', params: { value: 19.99, currency: 'BRL' } },
  compra_1999: { name: 'Purchase', params: { value: 19.99, currency: 'BRL' } },
  compra_27: { name: 'Purchase', params: { value: 27, currency: 'BRL' } },
}

/** Dispara um evento do funil para Meta + TikTok (deduplicado por sessão). */
export function track(event: FunnelEvent) {
  const key = `track_${event}`
  if (sessionStorage.getItem(key)) return
  sessionStorage.setItem(key, '1')

  if (window.fbq) {
    const std = META_STANDARD[event]
    if (std) window.fbq('track', std.name, std.params)
    window.fbq('trackCustom', event)
  }
  window.ttq?.track(event)

  if (import.meta.env.DEV) console.info('[track]', event)
}
