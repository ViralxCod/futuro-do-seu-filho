// Edge Function: webhook-compra
// Recebe o webhook do gateway → upsert do usuário pelo e-mail da compra →
// conta criada e aprovada → grava purchase + entitlement → envia magic link.
//
// Deploy:  supabase functions deploy webhook-compra --no-verify-jwt
// Secrets: supabase secrets set WEBHOOK_SECRET=um-segredo-seu
// (SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já existem no ambiente da function)
//
// Configure no gateway a URL:
//   https://SEU-PROJETO.functions.supabase.co/webhook-compra?secret=um-segredo-seu

import { createClient } from 'npm:@supabase/supabase-js@2'

// ===== MAPEAMENTO CAKTO: product id → slug =====
// Cada order bump é um produto na Cakto; todos chegam na compra do Mapa.
const PRODUCT_MAP: Record<string, string> = {
  '39d86f4d-93f0-47c1-9dd8-f81288c08279': 'mapa', // Mapa (7 itens + bônus)
  '10842519-787a-4f50-8e54-821b5fb075b5': 'kit-de-bolso',
  'd2d9c2d6-f40a-4341-ba64-05b89a21adaa': 'sos-hora-de-dormir',
  '458b1a77-f1a2-40dd-a970-ed0434cc998e': 'teste-do-pai',
  '79042258-e62a-4716-abcb-5cd741ce3980': 'completo',
}

// Dependências: cada produto libera também a base de acesso necessária.
const DEPS: Record<string, string[]> = {
  mapa: ['mapa'],
  'kit-de-bolso': ['kit-de-bolso'],
  'sos-hora-de-dormir': ['sos-hora-de-dormir'],
  'teste-do-pai': ['teste-do-pai'],
  manual: ['mapa', 'manual'],
  completo: ['mapa', 'manual', 'completo'],
}

/** Coleta todos os product ids do payload: produto principal + order bumps. */
// deno-lint-ignore no-explicit-any
function collectIds(p: any): string[] {
  const ids = new Set<string>()
  const push = (v: unknown) => {
    if (typeof v === 'string' && v) ids.add(v)
  }
  // deno-lint-ignore no-explicit-any
  const fromItem = (it: any) => {
    if (!it) return
    if (typeof it === 'string') return push(it)
    push(it.id)
    push(it.product_id)
    push(it.productId)
    push(it.product?.id)
    push(it.offer?.id)
  }
  fromItem(p?.data?.product)
  fromItem(p?.product)
  fromItem(p?.data?.offer)
  fromItem(p?.offer)
  push(p?.data?.product_id)
  push(p?.product_id)
  const arrays = [
    p?.data?.products, p?.products, p?.data?.items, p?.items,
    p?.data?.order_bumps, p?.order_bumps, p?.data?.bumps, p?.bumps,
    p?.data?.offers, p?.offers,
  ]
  for (const arr of arrays) if (Array.isArray(arr)) arr.forEach(fromItem)
  return [...ids]
}

Deno.serve(async (req) => {
  try {
    // segredo simples via query param (além do payload do gateway)
    const url = new URL(req.url)
    const secret = Deno.env.get('WEBHOOK_SECRET')
    if (secret && url.searchParams.get('secret') !== secret) {
      return new Response('unauthorized', { status: 401 })
    }

    const payload = await req.json()

    // ===== MAPEAMENTO DO GATEWAY =====
    // TODO: ajustar os campos conforme o gateway escolhido.
    // Kiwify:  payload.Customer.email / payload.Product.product_name / payload.order_status
    // Hotmart: payload.data.buyer.email / payload.data.product.name / payload.event
    // Cakto:   payload.customer.email / payload.product.name / payload.status
    // Cakto costuma enviar em payload.data.customer.email / payload.data.product.name /
    // payload.data.status; mantemos fallbacks p/ outros gateways e formatos.
    const email: string | undefined =
      payload?.Customer?.email ??
      payload?.data?.buyer?.email ??
      payload?.data?.customer?.email ??
      payload?.customer?.email ??
      payload?.email
    const produtoNome: string =
      payload?.Product?.product_name ??
      payload?.data?.product?.name ??
      payload?.data?.offer?.name ??
      payload?.product?.name ??
      payload?.offer?.name ??
      payload?.produto ??
      ''
    const status: string =
      payload?.order_status ?? payload?.data?.purchase?.status ?? payload?.data?.status ?? payload?.status ?? 'aprovada'
    const valor: number | null =
      Number(payload?.valor ?? payload?.data?.amount ?? payload?.Commissions?.charge_amount ?? payload?.amount) || null
    const gatewayId: string | null =
      payload?.order_id ?? payload?.data?.id ?? payload?.data?.purchase?.transaction ?? payload?.id ?? null

    if (!email) return new Response('missing email', { status: 400 })

    const aprovada = /paid|approved|aprovad|complete|pago/i.test(status)

    // Detecta TODOS os produtos da transação (principal + order bumps).
    // Prioriza o mapeamento por product id (Cakto); usa o nome só como fallback.
    const ids = collectIds(payload)
    const mapped = ids.map((id) => PRODUCT_MAP[id]).filter(Boolean)
    const purchasedSlugs: string[] = mapped.length
      ? [...new Set(mapped)]
      : [/completo|ninho\s*completo/i.test(produtoNome) ? 'completo' : /manual/i.test(produtoNome) ? 'manual' : 'mapa']

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // Uma linha de compra por produto (auditoria). O valor total fica na
    // primeira linha; os bumps não vêm com valor separado no payload.
    for (let i = 0; i < purchasedSlugs.length; i++) {
      await admin
        .from('purchases')
        .insert({ email, produto: purchasedSlugs[i], valor: i === 0 ? valor : null, gateway_id: gatewayId, status })
    }
    if (!aprovada) return new Response('ok (nao aprovada)', { status: 200 })

    // upsert do usuário pelo e-mail da compra — conta criada e APROVADA
    let userId: string | undefined
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
    })
    if (createErr) {
      // já existe → busca
      const { data: list } = await admin.auth.admin.listUsers()
      userId = list?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id
    } else {
      userId = created.user?.id
    }
    if (!userId) return new Response('user error', { status: 500 })

    // Expande dependências (manual→mapa, completo→mapa+manual) e libera TUDO
    // numa só transação — os order bumps entram junto com o Mapa.
    const grantedSlugs = [...new Set(purchasedSlugs.flatMap((s) => DEPS[s] ?? [s]))]
    for (const s of grantedSlugs) {
      const { data: prod } = await admin.from('products').select('id').eq('slug', s).single()
      if (prod) {
        await admin.from('entitlements').upsert(
          { user_id: userId, product_id: prod.id, origem: 'compra' },
          { onConflict: 'user_id,product_id' },
        )
      }
    }

    // magic link: "Sua conta n'O Ninho está pronta — clique para criar sua senha e entrar"
    // (personalize o template em Auth > Email Templates > Magic Link no painel)
    await admin.auth.admin.generateLink({ type: 'magiclink', email })

    return new Response('ok', { status: 200 })
  } catch (e) {
    return new Response(`error: ${e}`, { status: 500 })
  }
})
