-- =====================================================
-- GUARDIÃO v5.1 — ACESSO EXCLUSIVO DO ADMINISTRADOR
--
-- ANTES:
-- 1. Supabase > Authentication > Users > Add user.
-- 2. Crie seu usuário com e-mail e senha.
-- 3. Troque SEU_EMAIL_AQUI pelo mesmo e-mail e execute tudo.
-- =====================================================

create table if not exists public.admins_guardiao (
    usuario_id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    ativo boolean not null default true,
    criado_em timestamptz not null default now()
);

alter table public.admins_guardiao enable row level security;

-- Nenhuma leitura direta pelo navegador. A verificação ocorre pela função abaixo.
revoke all on table public.admins_guardiao from public, anon, authenticated;

create or replace function public.verificar_admin_guardiao()
returns json
language plpgsql
security definer
set search_path = public, auth, pg_catalog
as $$
declare
    uid uuid := auth.uid();
    registro public.admins_guardiao%rowtype;
begin
    if uid is null then
        return json_build_object('autorizado', false, 'motivo', 'nao_autenticado');
    end if;

    select * into registro
      from public.admins_guardiao
     where usuario_id = uid
       and ativo = true;

    if not found then
        return json_build_object('autorizado', false, 'motivo', 'nao_autorizado');
    end if;

    return json_build_object(
        'autorizado', true,
        'email', registro.email
    );
end;
$$;

revoke all on function public.verificar_admin_guardiao() from public, anon;
grant execute on function public.verificar_admin_guardiao() to authenticated;

-- Autoriza somente a conta indicada abaixo.
insert into public.admins_guardiao (usuario_id, email, ativo)
select id, email, true
  from auth.users
 where lower(email) = lower('SEU_EMAIL_AQUI')
on conflict (usuario_id)
do update set email = excluded.email, ativo = true;

-- Confirmação no SQL Editor:
select usuario_id, email, ativo, criado_em
  from public.admins_guardiao;
