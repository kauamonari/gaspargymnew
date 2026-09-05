-- Gaspar Gym — schema do Supabase (login + persistência)
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase
-- (Project > SQL Editor > New query > colar tudo > Run).

-- user_state guarda TODO o estado do app (perfil, refeições, pesos, treinos,
-- exercícios personalizados, seções de refeição) como um único JSON por
-- usuário — o mesmo formato que já vive no localStorage hoje. Isso evita
-- recriar uma tabela relacional pra cada tipo de dado.
create table if not exists public.user_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;

create policy "usuário lê o próprio estado"
  on public.user_state for select
  using (auth.uid() = user_id);

create policy "usuário cria o próprio estado"
  on public.user_state for insert
  with check (auth.uid() = user_id);

create policy "usuário atualiza o próprio estado"
  on public.user_state for update
  using (auth.uid() = user_id);

-- Necessária pro botão "Excluir conta" em Configurações > Privacidade: o
-- usuário apaga a própria linha (todos os dados na nuvem). O login em si
-- (auth.users) continua existindo — apagar isso exige uma service role key,
-- que nunca deve rodar no cliente, então não é feito por aqui.
create policy "usuário apaga o próprio estado"
  on public.user_state for delete
  using (auth.uid() = user_id);
