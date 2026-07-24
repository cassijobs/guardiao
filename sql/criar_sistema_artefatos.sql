-- =====================================================
-- GUARDIÃO — ARTEFATOS MEGA KRAFT STUDIO
-- Execute uma única vez no SQL Editor do Supabase.
-- =====================================================

create table if not exists public.artefatos (
    id uuid primary key default gen_random_uuid(),
    codigo text not null unique,
    status text not null default 'ativo'
        check (status in ('novo', 'ativo', 'bloqueado', 'cancelado')),
    criado_em timestamptz not null default now(),
    ativado_em timestamptz,
    ultimo_acesso_em timestamptz
);

alter table public.artefatos enable row level security;

-- Não liberamos SELECT direto para visitantes.
-- O reconhecimento acontece somente por esta função.
create or replace function public.reconhecer_artefato(codigo_informado text)
returns table (
    reconhecido boolean,
    motivo text,
    status text,
    primeira_ativacao boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
    registro public.artefatos%rowtype;
    primeira boolean := false;
begin
    select *
      into registro
      from public.artefatos
     where codigo = upper(trim(codigo_informado))
     limit 1;

    if not found then
        return query select false, 'nao_cadastrado'::text, null::text, false;
        return;
    end if;

    if registro.status <> 'ativo' then
        return query select false, registro.status, registro.status, false;
        return;
    end if;

    primeira := registro.ativado_em is null;

    update public.artefatos
       set ativado_em = coalesce(ativado_em, now()),
           ultimo_acesso_em = now()
     where id = registro.id;

    return query select true, 'reconhecido'::text, registro.status, primeira;
end;
$$;

revoke all on function public.reconhecer_artefato(text) from public;
grant execute on function public.reconhecer_artefato(text) to anon, authenticated;

-- Exemplo de cadastro:
-- insert into public.artefatos (codigo, status)
-- values ('GRD-MKS-8F4Q-X72P', 'ativo');
