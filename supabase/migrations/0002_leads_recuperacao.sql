-- ============================================================
-- 0002 — CAPTURA DE LEADS + RECUPERAÇÃO (Leona) + DESBLOQUEIO NO 7º DIA
-- Rode no Supabase → SQL Editor (ou `supabase db push`). Reexecutável.
-- Depende do 0001 (função public.is_admin() e tabela profiles).
-- ============================================================

-- ========== LEADS (opt-in de WhatsApp — LGPD) ==========
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  whatsapp text not null,
  nome text,
  origem text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  fbclid text,
  referrer text,
  landing_url text,
  status text not null default 'lead' check (status in ('lead', 'comprou', 'abandonou')),
  opt_in boolean not null default true,
  opt_out boolean not null default false,
  criado_em timestamptz not null default now(),
  comprou_em timestamptz
);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_whats_idx on public.leads(whatsapp);
create index if not exists leads_criado_idx on public.leads(criado_em);

alter table public.leads enable row level security;

-- INSERT anônimo: a visitante grava o próprio lead (opt-in) direto do navegador.
drop policy if exists "leads: anon insert" on public.leads;
create policy "leads: anon insert" on public.leads
  for insert to anon, authenticated
  with check (opt_in = true and opt_out = false and status = 'lead');

-- SELECT/manage: só admin (o painel). Nada de leitura pública de contatos.
drop policy if exists "leads: admin select" on public.leads;
create policy "leads: admin select" on public.leads for select using (public.is_admin());
drop policy if exists "leads: admin manage" on public.leads;
create policy "leads: admin manage" on public.leads for all
  using (public.is_admin()) with check (public.is_admin());

-- Virar "comprou" sem abrir UPDATE anônimo: RPC security-definer restrita.
create or replace function public.mark_lead_comprou(lead_id uuid)
returns void
language sql security definer set search_path = public
as $$
  update public.leads
     set status = 'comprou', comprou_em = now()
   where id = lead_id and status <> 'comprou';
$$;
grant execute on function public.mark_lead_comprou(uuid) to anon, authenticated;

-- Opt-out por token (LGPD): a Leona manda um link ?leadId=...; a Edge Function
-- (service role) chama isto. Exposto também via RPC pra um botão "não quero mais".
create or replace function public.lead_opt_out(lead_id uuid)
returns void
language sql security definer set search_path = public
as $$
  update public.leads set opt_out = true where id = lead_id;
$$;
grant execute on function public.lead_opt_out(uuid) to anon, authenticated;

-- ========== ENVIOS (log da recuperação Leona) ==========
create table if not exists public.envios (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  whatsapp text not null,
  tipo text not null default 'lead' check (tipo in ('lead', 'carrinho')),
  canal text not null default 'whatsapp',
  mensagem text,
  status text not null default 'pendente' check (status in ('pendente', 'enviado', 'erro', 'simulado')),
  provider_id text,
  erro text,
  criado_em timestamptz not null default now()
);
create index if not exists envios_lead_idx on public.envios(lead_id);
create index if not exists envios_criado_idx on public.envios(criado_em);

alter table public.envios enable row level security;
-- Escrita só pela Edge Function (service role bypassa RLS). Leitura: só admin.
drop policy if exists "envios: admin select" on public.envios;
create policy "envios: admin select" on public.envios for select using (public.is_admin());

-- ========== DESBLOQUEIO NO 7º DIA (deliverables.unlock_day) ==========
-- 0 = imediato (núcleo pago); 7 = bônus que abre no 7º dia após a compra.
alter table public.deliverables add column if not exists unlock_day int not null default 0;

-- Bônus do 7º dia para o produto "mapa". Idempotente (guardado por ord=8).
-- ⚠️ O loader BLINDAGEM-deliverables.sql faz `delete from deliverables` ao
-- recarregar o conteúdo; se você rodar aquele arquivo de novo, rode ESTA
-- migration em seguida para restaurar o bônus.
insert into public.deliverables (product_slug, ord, title, body_md, unlock_day)
select 'mapa', 8, 'Bônus do 7º Dia — A Semana da Virada',
$md$# Bônus do 7º Dia — A Semana da Virada

### Você chegou até aqui. Isso já diz tudo.

---

Sete dias atrás você deu o primeiro passo. Talvez tenha gritado menos. Talvez tenha gritado igual, mas reparado mais rápido. Talvez só tenha respirado uma vez antes de explodir — e já foi diferente.

Seja qual for o seu placar, tem uma coisa que não dá pra negar: **você não desistiu.** E é isso que muda um filho. Não a mãe perfeita — a mãe que volta, dia após dia.

Este bônus abriu hoje, no 7º dia, de propósito. Porque agora você já tem prática — e prática é o solo onde estas próximas ferramentas pegam de verdade.

---

## O ritual dos 7 dias: revise a sua semana

Pega um café. Responde por dentro, sem culpa, só com curiosidade:

- **Qual gatilho das 18h mais apareceu essa semana?** (fome, tanque vazio, pressa, barulho, "não ouvir da primeira vez")
- **Qual foi a vez que você conseguiu desarmar antes do grito?** Guarde essa cena. Ela é a prova de que dá.
- **Qual reparação te aproximou mais do seu filho?** Repita essa.

Não é prova. É mapa. Você está aprendendo a ler a sua própria casa.

---

## A regra dos 1% por dia

Você não precisa mudar tudo. Precisa mudar 1% — e repetir.

Um pavio cortado. Uma respiração a mais. Uma frase da coluna da direita no lugar da esquerda. Em 30 dias, esse 1% vira um clima de casa completamente diferente — e seu filho cresce dentro dele.

A virada nunca é um dia. É a soma dos dias em que você escolheu voltar.

---

## O próximo passo (quando você quiser)

Se esta semana te mostrou que dá pra mudar — e mostrou — o passo natural é aprofundar: o programa completo de 21 dias, com um roteiro diário pra cada crise, mora n'O Ninho Completo. Sem pressa. Ele vai estar aqui quando você estiver pronta.

Por hoje, comemora. Você fez sete dias. A maioria não faz um.

---

*Releia o seu Mapa agora, no 7º dia. Você vai ler com outros olhos — porque você já é outra mãe.*
$md$, 7
where not exists (
  select 1 from public.deliverables where product_slug = 'mapa' and ord = 8
);

-- ========== ADMIN ==========
-- Promova o SEU e-mail a admin (edite o e-mail abaixo e rode). O e-mail já
-- precisa ter uma conta n'O Ninho criada.
-- update public.profiles set role = 'admin' where lower(email) = lower('SEU-EMAIL@AQUI.com');

-- ========== (OPCIONAL) AGENDAMENTO DA RECUPERAÇÃO via pg_cron ==========
-- A cada 10 min, dispara a Edge Function `recuperacao` (que varre leads/carrinhos
-- e envia a mensagem da Leona). Requer as extensões pg_cron e pg_net.
-- create extension if not exists pg_cron;
-- create extension if not exists pg_net;
-- select cron.schedule('leona-recuperacao', '*/10 * * * *', $$
--   select net.http_post(
--     url := 'https://SEU-PROJETO.functions.supabase.co/recuperacao',
--     headers := '{"Content-Type":"application/json","x-cron-secret":"SEU-SEGREDO"}'::jsonb,
--     body := '{}'::jsonb
--   );
-- $$);
