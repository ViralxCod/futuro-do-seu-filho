# O NINHO — passo a passo para ativar (15 minutos)

## 1. Criar o projeto Supabase (grátis)

1. Acesse https://supabase.com → **Start your project** → entre com o e-mail
   `valoracapitaloficial@gmail.com`.
2. **New project** → nome `o-ninho` → região `South America (São Paulo)` →
   defina a senha do banco (guarde num gerenciador de senhas, NÃO em .txt).
3. Em **SQL Editor**, cole TODO o conteúdo de `supabase/migrations/0001_init.sql`
   e clique **Run**. Isso cria as tabelas, as regras de segurança (RLS), os 3
   produtos e a regra que torna o seu e-mail admin automaticamente.

## 2. Conectar o site

1. No painel: **Settings → API** → copie a **Project URL** e a **anon public key**.
2. Cole em `src/config.ts`:
   - `SUPABASE_URL = 'https://xxxx.supabase.co'`
   - `SUPABASE_ANON_KEY = 'eyJ...'` (essa chave é pública, pode ir no site)
3. `git push` → deploy automático.

## 3. Criar seu usuário admin

1. Abra `https://viralxcod.github.io/futuro-do-seu-filho/ninho`
2. Clique em **"Primeira vez aqui? Criar conta"** → use
   `valoracapitaloficial@gmail.com` e **digite você mesma a sua senha**
   (nunca envie senha por chat/arquivo — se a que você me mandou foi usada em
   outro lugar, troque).
3. Ao entrar, o link **"Painel admin"** aparece no rodapé do dashboard
   (a regra do banco promove esse e-mail a admin automaticamente).

## 4. Webhook do gateway (contas automáticas na compra)

1. Instale a CLI: `npm i -g supabase` → `supabase login`
2. Na pasta do projeto:
   ```
   supabase link --project-ref SEU_PROJECT_REF
   supabase secrets set WEBHOOK_SECRET=escolha-um-segredo
   supabase functions deploy webhook-compra --no-verify-jwt
   ```
3. No painel do gateway (Kiwify/Hotmart/Cakto), configure o webhook de
   "compra aprovada" para:
   `https://SEU_PROJECT_REF.functions.supabase.co/webhook-compra?secret=escolha-um-segredo`
4. Abra `supabase/functions/webhook-compra/index.ts` e confira o bloco
   "MAPEAMENTO DO GATEWAY" — ajuste os campos para o formato do seu gateway
   (as chaves de API do gateway que você tem vão no painel DELE, não no site).

## 5. E-mail

- Supabase envia os magic links pelo remetente padrão (limitado). Para produção,
  configure **Auth → SMTP** com um remetente seu (ex.: Resend, grátis até 3k/mês).
- Personalize o texto em **Auth → Email Templates → Magic Link**:
  "Sua conta n'O Ninho está pronta — clique para criar sua senha e entrar".

## O que me passar se quiser que eu finalize a integração

1. Project URL + anon key (públicas) — colo no config e faço o deploy.
2. Qual gateway escolheu + um exemplo do payload do webhook dele.
3. O remetente SMTP (se já tiver).

⚠️ NUNCA me envie (nem salve em .txt): service_role key, senha do banco,
senhas de e-mail, token EAAu da Meta. Essas ficam só no painel do Supabase/gateway.
