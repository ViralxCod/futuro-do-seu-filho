// ============================================================
// CONFIGURAÇÃO CENTRAL DO FUNIL — edite APENAS este arquivo
// ============================================================

export type Gateway = 'kiwify' | 'hotmart' | 'stripe'

// ---------- PREENCHA AQUI PARA ATIVAR O CHECKOUT E OS PIXELS ----------
export const CHECKOUT_URL_MAPA = 'https://pay.cakto.com.br/322er8j_971607' // Mapa (tripwire) — R$ 8,75
// ⬇️ TESTE DE PREÇO: link Cakto da variante de R$ 24,90 (COLE quando tiver).
//    Enquanto vazio, a variante 2490 cai no link de 8,75 como fallback seguro.
export const CHECKOUT_URL_MAPA_2490 = '' // TODO: cole aqui o checkout Cakto de R$ 24,90
export const CHECKOUT_URL_MANUAL = 'https://pay.cakto.com.br/399isvc_971606' // Manual — ⚠️ está R$ 27,99 no Cakto; a copy promete R$ 27,00
export const CHECKOUT_URL_COMPLETO = 'https://pay.cakto.com.br/3dcdxzp_977565' // O Ninho Completo — R$ 67,55 (upsell final)
export const URL_RETORNO_SUCESSO = 'https://futuro-do-seu-filho.vercel.app'
export const META_PIXEL_ID = '2255954778500790'
export const TIKTOK_PIXEL_ID = '' // COLE_AQUI o ID do TikTok Pixel
// ⚠️ O token de acesso da Meta (EAAu...) é SECRETO e NUNCA entra neste
// site — ele é para a Conversions API, server-side. Como circulou em
// arquivo de texto, gere um novo no Gerenciador de Eventos.

// ---------- SUPABASE (área de membros O NINHO) ----------
export const SUPABASE_URL = 'https://cxkexrgoagjmdwhcomrx.supabase.co'
// anon key — pública por design (a segurança vem do RLS no banco)
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4a2V4cmdvYWdqbWR3aGNvbXJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MTAxMTUsImV4cCI6MjA5OTM4NjExNX0.kdzmnZ1zKU9Be2_QOkfTbXtp1iOinyYSzL01uj2esDk'
// ⚠️ NUNCA coloque aqui: service_role, sb_secret_, chaves do Cakto ou token da Meta.
/** e-mail que vira admin automaticamente ao criar conta n'O Ninho */
export const ADMIN_EMAIL = 'valoracapitaloficial@gmail.com'

/**
 * Lead opcional capturado na tela de análise (WhatsApp ou e-mail).
 * // TODO: conectar webhook/API (CRM, planilha, autoresponder) — por
 * enquanto fica apenas no localStorage do navegador da visitante.
 */
export function saveLead(contact: string) {
  const value = contact.trim()
  if (!value) return
  localStorage.setItem('funil-lead', value)
  if (import.meta.env.DEV) console.info('[lead]', value)
}

// ============================================================
// TESTE DE PREÇO DO TRIPWIRE (Mapa) — R$ 8,75 vs R$ 24,90
// ------------------------------------------------------------
// A variante é escolhida por parâmetro de URL e fica gravada no navegador
// da visitante (para o Purchase no retorno usar o mesmo valor):
//   ?preco=875   ou ?p=a  → R$ 8,75  (padrão)
//   ?preco=2490  ou ?p=b  → R$ 24,90
// InitiateCheckout usa o `value` da variante; Purchase usa o valor REAL
// (o do retorno do Cakto quando vier, senão o `value` da variante).
// ============================================================
export type MapaVariantKey = '875' | '2490'

export interface MapaVariant {
  key: MapaVariantKey
  price: string // rótulo exibido (ex.: "R$ 8,75")
  value: number // valor numérico para os pixels (ex.: 8.75)
  url: string // checkout Cakto da variante
}

export const MAPA_VARIANTS: Record<MapaVariantKey, MapaVariant> = {
  '875': { key: '875', price: 'R$ 8,75', value: 8.75, url: CHECKOUT_URL_MAPA },
  // se o link de 24,90 ainda não foi colado, usa o de 8,75 como fallback
  '2490': { key: '2490', price: 'R$ 24,90', value: 24.9, url: CHECKOUT_URL_MAPA_2490 || CHECKOUT_URL_MAPA },
}

export const DEFAULT_MAPA_VARIANT: MapaVariantKey = '875'

const MAPA_VARIANT_LS_KEY = 'mapa-variant'
const VARIANT_ALIASES: Record<string, MapaVariantKey> = {
  '875': '875', '8': '875', '8,75': '875', '875a': '875', a: '875',
  '2490': '2490', '24': '2490', '24,90': '2490', b: '2490',
}

/**
 * Resolve a variante de preço ativa. Se a URL trouxer ?preco=/`?p=`, grava a
 * escolha no localStorage (para o retorno do pagamento usar o mesmo valor).
 * Seguro no SSR/ausência de window.
 */
export function currentMapaVariant(): MapaVariant {
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const raw = (params.get('preco') ?? params.get('p') ?? params.get('price') ?? '').toLowerCase().trim()
      const picked = VARIANT_ALIASES[raw]
      if (picked) localStorage.setItem(MAPA_VARIANT_LS_KEY, picked)
      const stored = localStorage.getItem(MAPA_VARIANT_LS_KEY) as MapaVariantKey | null
      if (stored && MAPA_VARIANTS[stored]) return MAPA_VARIANTS[stored]
    }
  } catch {
    /* localStorage bloqueado — cai no padrão */
  }
  return MAPA_VARIANTS[DEFAULT_MAPA_VARIANT]
}

export const config = {
  // ---------- GATEWAY DE PAGAMENTO ----------
  // Escolha o gateway e cole as URLs de checkout de cada produto.
  // Deixe a URL vazia ('') para MODO DE TESTE: o clique no CTA simula
  // o pagamento e segue o fluxo (útil para testar antes de configurar).
  gateway: 'kiwify' as Gateway,

  checkout: {
    // Degrau 1 — R$ 8,75: destrava o RESULTADO (o Mapa)
    mapa: {
      price: 'R$ 8,75',
      anchorPrice: 'R$ 161',
      url: CHECKOUT_URL_MAPA, // ex.: 'https://pay.kiwify.com.br/XXXXXX'
    },
    // Degrau 2 — R$ 27: adiciona o MANUAL (a ação)
    manual: {
      price: 'R$ 27,99',
      anchorPrice: 'R$ 140',
      url: CHECKOUT_URL_MANUAL, // ex.: 'https://pay.kiwify.com.br/YYYYYY'
    },
    // Degrau 3 — R$ 67,55: O NINHO COMPLETO (programa de 21 dias + biblioteca)
    completo: {
      price: 'R$ 67,55',
      anchorPrice: 'R$ 197',
      url: CHECKOUT_URL_COMPLETO,
    },
    // URL de retorno após pagamento — configure ISSO no painel do gateway:
    //   Produto 1 (Mapa 19,99)  → retorno para: https://SEUDOMINIO/obrigada?paid=1
    //   Produto 2 (Manual 27)   → retorno para: https://SEUDOMINIO/mapa?paid2=1
    // Verificação nesta versão: flag via query param + localStorage.
    // TODO (futuro): validação server-side via webhook do gateway
    // (Kiwify: Webhooks > pedido aprovado / Hotmart: Postback / Stripe: checkout.session.completed)
    // para confirmar o pagamento de verdade antes de liberar o conteúdo.
    returnBase: URL_RETORNO_SUCESSO,
  },

  // ---------- PIXELS DE TRACKING ----------
  pixels: {
    metaPixelId: META_PIXEL_ID, // ex.: '1234567890'
    tiktokPixelId: TIKTOK_PIXEL_ID, // ex.: 'ABCDEF123'
  },

  // ---------- TIMER DE ESCASSEZ ----------
  // O contador é REAL: quando zera, o resultado é apagado e o quiz
  // precisa ser refeito (exatamente como a copy promete). Não altere
  // a copy sem alterar este comportamento — promessa falsa de expiração
  // é propaganda enganosa.
  timerMinutes: 7,

  // ---------- PROVA SOCIAL ----------
  // ⚠️ ATENÇÃO — LEIA ANTES DE RODAR TRÁFEGO ⚠️
  // Os depoimentos e números abaixo vieram da copy como EXEMPLOS e são
  // FICTÍCIOS. Publicar depoimento inventado ou contador falso é
  // propaganda enganosa (CDC, art. 37) e causa bloqueio de conta de
  // anúncio no Meta/TikTok. Substitua por depoimentos REAIS (com
  // autorização) e números REAIS antes do lançamento.
  socialProof: {
    quizTakenCount: '+14.320 mães já descobriram',
    landingReview:
      '⭐⭐⭐⭐⭐ "Eu li a primeira pergunta e pensei: \'meu Deus, sou eu\'. Chorei no resultado." — Camila R., mãe do Theo (4 anos)',
    offerReviews: [
      '⭐⭐⭐⭐⭐ "O ponto cego era EXATAMENTE a frase que eu falo todo dia às 18h. Fiquei arrepiada." — Juliana M., mãe da Alice (6)',
      '⭐⭐⭐⭐⭐ "Quase não paguei. Quando li a projeção dos 14 anos, chorei. Valeu cada centavo." — Renata S., mãe do Miguel (4)',
    ],
  },
} as const

/** Abre o checkout do gateway. Se a URL estiver vazia (modo teste), simula o pagamento. */
export function openCheckout(product: 'mapa' | 'manual' | 'completo') {
  // O Mapa é o tripwire em teste de preço: usa a URL da variante ativa.
  const url = product === 'mapa' ? currentMapaVariant().url : config.checkout[product].url
  if (url) {
    window.location.href = url
  } else {
    // MODO TESTE — sem gateway configurado, simula retorno de pagamento aprovado
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    const testReturn = { mapa: '/obrigada?paid=1', manual: '/mapa?paid2=1', completo: '/mapa?paid3=1' }[product]
    window.location.href = base + testReturn
  }
}
