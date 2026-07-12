// Edge Function: capi-purchase
// Recebe o Purchase do NAVEGADOR (com o event_id que o Pixel usou) e reenvia
// para a Meta Conversions API pelo servidor — mesmo event_id ⇒ a Meta
// deduplica os dois lados. O token fica só aqui (secret), nunca no navegador.
//
// Deploy:  supabase functions deploy capi-purchase --no-verify-jwt
// Secrets: supabase secrets set META_CAPI_TOKEN=EAA... (obrigatório)
//          supabase secrets set META_PIXEL_ID=2255954778500790   (opcional)
//          supabase secrets set META_TEST_EVENT_CODE=TESTxxxxx   (só p/ testar)

const GRAPH_VERSION = 'v21.0'
const META_PIXEL_ID = Deno.env.get('META_PIXEL_ID') ?? '2255954778500790'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })

/** SHA-256 hex (minúsculo, sem espaços) — exigido pela Meta p/ dados pessoais. */
async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.trim().toLowerCase())
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)

  const token = Deno.env.get('META_CAPI_TOKEN')
  // Sem token, a CAPI fica desligada — o Pixel do navegador segue funcionando.
  if (!token) return json({ skipped: 'META_CAPI_TOKEN não configurado' })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'json inválido' }, 400)
  }

  const eventId = String(body.eventId ?? '')
  if (!eventId) return json({ error: 'eventId é obrigatório (deduplicação)' }, 400)

  const value = Number(body.value)
  const currency = String(body.currency ?? 'BRL')
  const product = body.product ? String(body.product) : undefined
  const eventSourceUrl = body.eventSourceUrl ? String(body.eventSourceUrl) : undefined

  const userData: Record<string, unknown> = {}
  if (body.fbp) userData.fbp = String(body.fbp)
  if (body.fbc) userData.fbc = String(body.fbc)
  if (body.email) userData.em = [await sha256(String(body.email))]

  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) userData.client_ip_address = fwd.split(',')[0].trim()
  const ua = req.headers.get('user-agent')
  if (ua) userData.client_user_agent = ua

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId, // <- MESMO id do Pixel do navegador ⇒ dedup
        action_source: 'website',
        event_source_url: eventSourceUrl,
        user_data: userData,
        custom_data: {
          value: Number.isFinite(value) ? value : undefined,
          currency,
          content_type: 'product',
          content_name: product,
        },
      },
    ],
  }
  const testCode = Deno.env.get('META_TEST_EVENT_CODE')
  if (testCode) payload.test_event_code = testCode

  try {
    const r = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, access_token: token }),
    })
    const meta = await r.json()
    if (!r.ok) return json({ error: 'meta_error', meta }, 502)
    return json({ ok: true, meta })
  } catch (e) {
    return json({ error: 'fetch_failed', message: String(e) }, 502)
  }
})
