-- O NINHO — schema inicial
-- Rode no SQL Editor do Supabase (ou `supabase db push`).

-- ========== TABELAS ==========
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  nome text,
  whatsapp text,
  role text not null default 'member' check (role in ('member', 'admin')),
  quiz_profile text check (quiz_profile in ('A', 'B', 'C', 'D')),
  criado_em timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  tipo text not null default 'produto' check (tipo in ('produto', 'consulta')),
  descricao text,
  preco text,
  checkout_url text,
  ativo boolean not null default true
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  origem text not null default 'manual' check (origem in ('compra', 'manual')),
  criado_em timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  produto text not null,
  valor numeric,
  gateway_id text,
  status text not null default 'aprovada',
  criado_em timestamptz not null default now()
);

-- ========== TRIGGER: cria profile no signup (e promove o admin) ==========
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    case when lower(new.email) = 'valoracapitaloficial@gmail.com' then 'admin' else 'member' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- backfill: usuários criados ANTES desta migration também ganham profile
insert into public.profiles (id, email, role)
select id, email, case when lower(email) = 'valoracapitaloficial@gmail.com' then 'admin' else 'member' end
from auth.users
on conflict (id) do nothing;

-- ========== RLS ==========
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.entitlements enable row level security;
alter table public.purchases enable row level security;

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

-- profiles: membro lê/edita o próprio; admin tudo
create policy "profiles: proprio select" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles: proprio update" on public.profiles for update using (id = auth.uid() or public.is_admin());
create policy "profiles: admin delete" on public.profiles for delete using (public.is_admin());

-- products: qualquer logado lê ativos; admin gerencia
create policy "products: select" on public.products for select using (ativo = true or public.is_admin());
create policy "products: admin all" on public.products for all using (public.is_admin()) with check (public.is_admin());

-- entitlements: membro lê os próprios; admin gerencia
create policy "entitlements: proprio select" on public.entitlements for select using (user_id = auth.uid() or public.is_admin());
create policy "entitlements: admin all" on public.entitlements for all using (public.is_admin()) with check (public.is_admin());

-- purchases: só admin
create policy "purchases: admin" on public.purchases for all using (public.is_admin()) with check (public.is_admin());

-- ========== SEED DE PRODUTOS ==========
insert into public.products (nome, slug, tipo, descricao, preco, ativo) values
  ('Mapa de Projeção Comportamental', 'mapa', 'produto', 'O diagnóstico completo: ponto cego, projeção ano a ano e Score de Conexão.', 'R$ 19,99', true),
  ('Manual da Mãe Presente', 'manual', 'produto', 'O passo a passo prático: Ritual dos 10 Minutos, Critério Anti-Paralisia, 12 Frases e Plano de 30 Dias.', 'R$ 27', true),
  ('Consultoria Individual', 'consultoria', 'consulta', 'Atendimento individual para o seu caso. Em breve.', null, true)
on conflict (slug) do nothing;
