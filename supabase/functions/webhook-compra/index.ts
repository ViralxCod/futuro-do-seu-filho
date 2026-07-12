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
    const email: string | undefined =
      payload?.Customer?.email ?? payload?.data?.buyer?.email ?? payload?.customer?.email ?? payload?.email
    const produtoNome: string =
      payload?.Product?.product_name ?? payload?.data?.product?.name ?? payload?.product?.name ?? payload?.produto ?? ''
    const status: string =
      payload?.order_status ?? payload?.data?.purchase?.status ?? payload?.status ?? 'aprovada'
    const valor: number | null = Number(payload?.valor ?? payload?.Commissions?.charge_amount ?? payload?.amount) || null
    const gatewayId: string | null = payload?.order_id ?? payload?.data?.purchase?.transaction ?? payload?.id ?? null

    if (!email) return new Response('missing email', { status: 400 })

    const slug = /manual/i.test(produtoNome) ? 'manual' : 'mapa'
    const aprovada = /paid|approved|aprovad|complete/i.test(status)

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // registra a compra (mesmo não aprovada, para auditoria no admin)
    await admin.from('purchases').insert({ email, produto: slug, valor, gateway_id: gatewayId, status })
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

    // entitlement: Mapa sempre; Manual se for o upsell
    const { data: prod } = await admin.from('products').select('id').eq('slug', slug).single()
    if (prod) {
      await admin.from('entitlements').upsert(
        { user_id: userId, product_id: prod.id, origem: 'compra' },
        { onConflict: 'user_id,product_id' },
      )
    }
    if (slug === 'manual') {
      const { data: mapa } = await admin.from('products').select('id').eq('slug', 'mapa').single()
      if (mapa) {
        await admin.from('entitlements').upsert(
          { user_id: userId, product_id: mapa.id, origem: 'compra' },
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
