# Guia de Configuração — Cakto + Supabase (entrega automática)

Passo a passo para deixar a entrega automática 100% funcional. Faça na ordem.
Tudo que exige seu login (Cakto e Supabase) está aqui — o código já está no ar.

> ⚠️ Não guardo este arquivo no repositório público. Ele é só pra você.

---

## PASSO 1 — Criar os produtos no Supabase (SQL)

Supabase → seu projeto (`cxkexrgoagjmdwhcomrx`) → menu lateral **SQL Editor** → **New query** → cole e clique **Run**.

### 1a) Os 3 order bumps

```sql
insert into products (nome, slug, tipo, descricao, preco, checkout_url, ativo) values
('Kit de Bolso', 'kit-de-bolso', 'produto',
 'Geladeira Calma, Cartas de Perdão e o Frasco da Calma — ferramentas de emergência do dia a dia.',
 'R$ 5,90', null, true),
('SOS Hora de Dormir', 'sos-hora-de-dormir', 'produto',
 'Roteiro da rotina de dormir + áudio de ninar para acabar com a guerra na hora de dormir.',
 'R$ 5,50', null, true),
('O Teste do Pai', 'teste-do-pai', 'produto',
 'A versão do Mapa para o pai/parceiro + guia de comparar os resultados sem brigar.',
 'R$ 6,25', null, true);
```

### 1b) O Ninho Completo (se você ainda não rodou este)

```sql
insert into products (nome, slug, tipo, descricao, preco, checkout_url, ativo) values
('O Ninho Completo', 'completo', 'produto',
 'Programa 21 Dias Sem Grito em vídeo + Biblioteca de Roteiros de Crise + Score de Conexão.',
 'R$ 67,55', 'https://pay.cakto.com.br/3dcdxzp_977565', true);
```

**Conferir depois de rodar:** no SQL Editor, `select slug, nome, preco from products order by nome;`
Deve listar: `completo, consultoria, kit-de-bolso, manual, mapa, sos-hora-de-dormir, teste-do-pai`.

---

## PASSO 2 — Deployar o webhook e definir o segredo

### 2a) Deploy da função (no seu PowerShell, dentro da pasta do projeto)

```powershell
npx supabase functions deploy webhook-compra --project-ref cxkexrgoagjmdwhcomrx --no-verify-jwt
```

(se pedir login, rode antes `npx supabase login`)

### 2b) Definir o segredo do webhook

Dashboard → **Edge Functions** → **Secrets** → **Add new secret**
- **Name:** `WEBHOOK_SECRET`
- **Value:** um segredo à sua escolha (ex.: `ninho-2026-xYz` — anote, vai usar no Passo 4)

---

## PASSO 3 — URLs de retorno na Cakto (por produto)

Na Cakto → **Produtos** → abra cada produto → aba de **Configurações / Redirecionamento após a compra** → cole a URL:

| Produto | Link do checkout | URL de retorno (redirecionamento) |
|---|---|---|
| **Mapa** | `pay.cakto.com.br/322er8j_971607` | `https://futuro-do-seu-filho.vercel.app/obrigada?paid=1` |
| **Manual** (upsell) | `pay.cakto.com.br/399isvc_971606` | `https://futuro-do-seu-filho.vercel.app/mapa?paid2=1` |
| **O Ninho Completo** | `pay.cakto.com.br/3dcdxzp_977565` | `https://futuro-do-seu-filho.vercel.app/mapa?paid3=1` |

> Os order bumps (Kit de Bolso, SOS Hora de Dormir, Teste do Pai) são comprados junto do Mapa — não precisam de URL de retorno própria.

---

## PASSO 4 — Webhook na Cakto (libera o acesso)

Na Cakto → **Configurações → Webhooks / Integrações** (ou "Notificações") → **Adicionar webhook**.
Configure para **todos os produtos** (ou no nível da conta), no evento **compra aprovada / paga**:

```
https://cxkexrgoagjmdwhcomrx.functions.supabase.co/webhook-compra?secret=SEU_SEGREDO
```

Troque `SEU_SEGREDO` pelo mesmo valor que você colocou em `WEBHOOK_SECRET` no Passo 2b.

> O webhook cria a conta n'O Ninho pelo e-mail da compra, libera o(s) produto(s)
> e dispara o e-mail de acesso (magic link). Cada compra também é gravada na
> tabela `purchases` para auditoria.

---

## PASSO 5 — Order bumps na Cakto (produtos que já vêm com o Mapa)

Na Cakto → produto **Mapa** → seção **Order bumps / Ofertas adicionais** → adicione os 3 bumps
(Kit de Bolso, SOS Hora de Dormir, Teste do Pai) como order bumps do checkout do Mapa.

**Importante:** os `product id` da Cakto já estão mapeados no webhook. Confira que batem:

| Product ID (Cakto) | Slug liberado |
|---|---|
| `39d86f4d-93f0-47c1-9dd8-f81288c08279` | mapa (7 itens + bônus) |
| `10842519-787a-4f50-8e54-821b5fb075b5` | kit-de-bolso |
| `d2d9c2d6-f40a-4341-ba64-05b89a21adaa` | sos-hora-de-dormir |
| `458b1a77-f1a2-40dd-a970-ed0434cc998e` | teste-do-pai |
| `79042258-e62a-4716-abcb-5cd741ce3980` | completo |

Se algum ID for diferente no seu painel, me avise que eu ajusto o `PRODUCT_MAP` no webhook.

---

## PASSO 6 — Teste de ponta a ponta (com você)

1. Faça uma compra de teste do **Mapa** marcando 1 ou mais order bumps (use o modo de teste/sandbox da Cakto se tiver, ou um valor real e reembolse depois).
2. Confira o e-mail da compra: deve chegar o **link de acesso n'O Ninho**.
3. Entre em `https://futuro-do-seu-filho.vercel.app/ninho` com esse e-mail.
4. No painel, os produtos comprados devem aparecer com **🗝️ / ✓ Liberado**.
5. No Supabase → **Table Editor → purchases**: deve ter uma linha por produto comprado.
6. **Table Editor → entitlements**: deve ter uma linha por produto liberado (Mapa + cada bump).

Se algo não liberar, veja **Edge Functions → webhook-compra → Logs** na Cakto e no Supabase — o payload real aparece lá e me diga que eu ajusto o mapeamento.

---

## ⚠️ Pendência de conteúdo (importante)

O acesso libera os produtos, **mas os arquivos de conteúdo ainda não estão "pendurados" em cada produto** dentro d'O Ninho:

- O **Mapa** entrega hoje o conteúdo **na tela** (`/mapa`): abertura, Score de Conexão, Ponto Cego, Projeção ano-a-ano e os 2 Ajustes — e as seções do **Manual**, se comprado.
- Os **7 PDFs do produto principal** (o-mapa, guia-5-gatilhos, áudios de primeiro socorro, termômetro, roteiro-da-reparação, checklist, regra-dos-3-passos) e os **conteúdos dos bumps/Completo** que geramos **ainda não têm botão de download/visualização** no painel — o card só marca "✓ Liberado".

👉 Próximo passo sugerido: eu subo os PDFs (ou monto páginas de leitura) e ligo cada produto ao seu conteúdo no painel d'O Ninho, pra o "✓ Liberado" abrir de fato o material.
