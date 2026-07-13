// ============================================================
// CONFIGURAÇÃO CENTRAL DO FUNIL — edite APENAS este arquivo
// ============================================================

export type Gateway = 'kiwify' | 'hotmart' | 'stripe'

// ---------- PREENCHA AQUI PARA ATIVAR O CHECKOUT E OS PIXELS ----------
export const CHECKOUT_URL_MAPA = 'https://pay.cakto.com.br/322er8j_971607' // Mapa — R$ 19,99
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
  const url = config.checkout[product].url
  if (url) {
    window.location.href = url
  } else {
    // MODO TESTE — sem gateway configurado, simula retorno de pagamento aprovado
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    const testReturn = { mapa: '/obrigada?paid=1', manual: '/mapa?paid2=1', completo: '/mapa?paid3=1' }[product]
    window.location.href = base + testReturn
  }
}
