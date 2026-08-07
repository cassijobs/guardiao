-- =====================================================
-- GUARDIÃO v5.0 — ATUALIZAÇÃO COMPLETA E IDempotente
-- Execute uma única vez no SQL Editor do Supabase.
-- =====================================================

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.caminhadas_guardiao (
    id uuid primary key default gen_random_uuid(),
    possuidor_artefato text not null default '',
    progresso jsonb not null default '{}'::jsonb,
    criado_em timestamptz not null default now(),
    atualizado_em timestamptz not null default now()
);

alter table public.artefatos
    add column if not exists caminhada_id uuid references public.caminhadas_guardiao(id);

-- Corrige registros antigos ativados antes de receberem uma caminhada.
update public.artefatos
   set status = 'disponivel', atualizado_em = now()
 where status = 'ativado' and caminhada_id is null;

create unique index if not exists artefatos_codigo_hash_unico
    on public.artefatos (codigo_hash)
    where codigo_hash is not null;

create unique index if not exists artefatos_numero_serie_unico
    on public.artefatos (upper(numero_serie))
    where numero_serie is not null;

create or replace function public._normalizar_codigo_artefato(p_codigo text)
returns text
language sql
immutable
as $$
    select upper(trim(coalesce(p_codigo, '')))
$$;

create or replace function public._codigo_artefato_valido(p_codigo text)
returns boolean
language sql
immutable
as $$
    select public._normalizar_codigo_artefato(p_codigo) ~
        '^(MKS-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{5}|GRD-MKS-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4})$'
$$;

create or replace function public._hash_codigo_artefato(p_codigo text)
returns text
language sql
immutable
set search_path = public, extensions, pg_catalog
as $$
    select pg_catalog.encode(
        extensions.digest(
            pg_catalog.convert_to(public._normalizar_codigo_artefato(p_codigo), 'UTF8'),
            'sha256'
        ),
        'hex'
    )
$$;

create or replace function public._artefato_por_codigo(p_codigo text)
returns public.artefatos
language plpgsql
security definer
set search_path = public, extensions, pg_catalog
as $$
declare
    registro public.artefatos%rowtype;
    codigo text := public._normalizar_codigo_artefato(p_codigo);
begin
    if not public._codigo_artefato_valido(codigo) then
        return registro;
    end if;

    select * into registro
      from public.artefatos
     where codigo_hash = public._hash_codigo_artefato(codigo)
        or upper(numero_serie) = codigo
     limit 1;

    return registro;
end;
$$;

-- Use esta função somente pelo SQL Editor/painel administrativo.
create or replace function public.cadastrar_artefato(
    p_codigo text,
    p_nome_edicao text default 'Guardião'
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions, pg_catalog
as $$
declare
    codigo text := public._normalizar_codigo_artefato(p_codigo);
    novo_id uuid;
begin
    if not public._codigo_artefato_valido(codigo) then
        raise exception 'Código de Artefato inválido: %', codigo;
    end if;

    insert into public.artefatos (
        codigo_hash,
        nome_edicao,
        numero_serie,
        status,
        atualizado_em
    ) values (
        public._hash_codigo_artefato(codigo),
        coalesce(nullif(trim(p_nome_edicao), ''), 'Guardião'),
        codigo,
        'disponivel',
        now()
    )
    returning id into novo_id;

    return novo_id;
exception
    when unique_violation then
        raise exception 'Este código já está cadastrado: %', codigo;
end;
$$;

-- Reconhecer apenas consulta. Não ativa nem altera o Artefato.
create or replace function public.reconhecer_artefato(p_codigo text)
returns json
language plpgsql
security definer
set search_path = public, extensions, pg_catalog
as $$
declare
    codigo text := public._normalizar_codigo_artefato(p_codigo);
    artefato public.artefatos%rowtype;
    possuidor text := '';
begin
    if not public._codigo_artefato_valido(codigo) then
        return json_build_object('valido', false, 'motivo', 'formato_invalido');
    end if;

    artefato := public._artefato_por_codigo(codigo);
    if artefato.id is null then
        return json_build_object('valido', false, 'motivo', 'nao_encontrado');
    end if;

    if artefato.status in ('bloqueado', 'transferido', 'cancelado') then
        return json_build_object(
            'valido', false,
            'motivo', artefato.status,
            'status', artefato.status
        );
    end if;

    if artefato.caminhada_id is not null then
        select possuidor_artefato into possuidor
          from public.caminhadas_guardiao
         where id = artefato.caminhada_id;
    end if;

    return json_build_object(
        'valido', true,
        'reconhecido', true,
        'codigo', coalesce(artefato.numero_serie, codigo),
        'status', artefato.status,
        'caminhada_id', artefato.caminhada_id,
        'jornada_id', artefato.jornada_id,
        'possuidor_artefato', coalesce(possuidor, '')
    );
end;
$$;

create or replace function public.ativar_nova_caminhada(
    p_codigo text,
    p_progresso jsonb default '{}'::jsonb
)
returns json
language plpgsql
security definer
set search_path = public, extensions, pg_catalog
as $$
declare
    codigo text := public._normalizar_codigo_artefato(p_codigo);
    artefato public.artefatos%rowtype;
    caminhada uuid;
begin
    if not public._codigo_artefato_valido(codigo) then
        return json_build_object('ok', false, 'motivo', 'formato_invalido');
    end if;

    select * into artefato
      from public.artefatos
     where codigo_hash = public._hash_codigo_artefato(codigo)
        or upper(numero_serie) = codigo
     for update
     limit 1;

    if not found then return json_build_object('ok', false, 'motivo', 'nao_encontrado'); end if;
    if artefato.status <> 'disponivel' or artefato.caminhada_id is not null then
        return json_build_object('ok', false, 'motivo', 'indisponivel');
    end if;

    insert into public.caminhadas_guardiao(progresso)
    values (coalesce(p_progresso, '{}'::jsonb))
    returning id into caminhada;

    update public.artefatos
       set caminhada_id = caminhada,
           status = 'ativado',
           ativado_em = coalesce(ativado_em, now()),
           atualizado_em = now(),
           codigo_hash = coalesce(codigo_hash, public._hash_codigo_artefato(codigo)),
           numero_serie = coalesce(numero_serie, codigo)
     where id = artefato.id;

    return json_build_object('ok', true, 'caminhada_id', caminhada);
end;
$$;

create or replace function public.vincular_artefato_a_caminhada(
    p_codigo_novo text,
    p_codigo_atual text
)
returns json
language plpgsql
security definer
set search_path = public, extensions, pg_catalog
as $$
declare
    novo public.artefatos%rowtype;
    atual public.artefatos%rowtype;
begin
    atual := public._artefato_por_codigo(p_codigo_atual);
    if atual.id is null or atual.caminhada_id is null or atual.status <> 'ativado' then
        return json_build_object('ok', false, 'motivo', 'caminhada_nao_encontrada');
    end if;

    select * into novo
      from public.artefatos
     where codigo_hash = public._hash_codigo_artefato(p_codigo_novo)
        or upper(numero_serie) = public._normalizar_codigo_artefato(p_codigo_novo)
     for update
     limit 1;

    if not found or novo.status <> 'disponivel' or novo.caminhada_id is not null then
        return json_build_object('ok', false, 'motivo', 'novo_indisponivel');
    end if;

    update public.artefatos
       set caminhada_id = atual.caminhada_id,
           status = 'ativado',
           ativado_em = coalesce(ativado_em, now()),
           atualizado_em = now()
     where id = novo.id;

    return json_build_object('ok', true, 'caminhada_id', atual.caminhada_id);
end;
$$;

create or replace function public.carregar_caminhada_por_artefato(p_codigo text)
returns json
language plpgsql
security definer
set search_path = public, extensions, pg_catalog
as $$
declare
    artefato public.artefatos%rowtype;
    caminhada public.caminhadas_guardiao%rowtype;
begin
    artefato := public._artefato_por_codigo(p_codigo);
    if artefato.id is null or artefato.caminhada_id is null or artefato.status <> 'ativado' then
        return json_build_object('ok', false, 'motivo', 'sem_caminhada');
    end if;

    select * into caminhada
      from public.caminhadas_guardiao
     where id = artefato.caminhada_id;

    if not found then return json_build_object('ok', false, 'motivo', 'caminhada_ausente'); end if;

    return json_build_object(
        'ok', true,
        'caminhada_id', caminhada.id,
        'possuidor_artefato', caminhada.possuidor_artefato,
        'progresso', caminhada.progresso
    );
end;
$$;

create or replace function public.salvar_progresso_caminhada(
    p_codigo text,
    p_progresso jsonb
)
returns json
language plpgsql
security definer
set search_path = public, extensions, pg_catalog
as $$
declare
    artefato public.artefatos%rowtype;
begin
    artefato := public._artefato_por_codigo(p_codigo);
    if artefato.id is null or artefato.caminhada_id is null or artefato.status <> 'ativado' then
        return json_build_object('ok', false, 'motivo', 'sem_caminhada');
    end if;

    update public.caminhadas_guardiao
       set progresso = coalesce(p_progresso, '{}'::jsonb),
           atualizado_em = now()
     where id = artefato.caminhada_id;

    return json_build_object('ok', true);
end;
$$;

-- Funções administrativas úteis no SQL Editor.
create or replace function public.alterar_status_artefato(p_codigo text, p_status text)
returns json
language plpgsql
security definer
set search_path = public, extensions, pg_catalog
as $$
declare
    permitido text := lower(trim(coalesce(p_status, '')));
begin
    if permitido not in ('disponivel', 'ativado', 'bloqueado', 'transferido', 'cancelado') then
        raise exception 'Status inválido: %', permitido;
    end if;

    update public.artefatos
       set status = permitido, atualizado_em = now()
     where codigo_hash = public._hash_codigo_artefato(p_codigo)
        or upper(numero_serie) = public._normalizar_codigo_artefato(p_codigo);

    if not found then return json_build_object('ok', false, 'motivo', 'nao_encontrado'); end if;
    return json_build_object('ok', true, 'status', permitido);
end;
$$;

revoke all on function public.cadastrar_artefato(text, text) from public, anon, authenticated;
revoke all on function public.alterar_status_artefato(text, text) from public, anon, authenticated;

revoke all on function public.reconhecer_artefato(text) from public;
revoke all on function public.ativar_nova_caminhada(text, jsonb) from public;
revoke all on function public.vincular_artefato_a_caminhada(text, text) from public;
revoke all on function public.carregar_caminhada_por_artefato(text) from public;
revoke all on function public.salvar_progresso_caminhada(text, jsonb) from public;

grant execute on function public.reconhecer_artefato(text) to anon, authenticated;
grant execute on function public.ativar_nova_caminhada(text, jsonb) to anon, authenticated;
grant execute on function public.vincular_artefato_a_caminhada(text, text) to anon, authenticated;
grant execute on function public.carregar_caminhada_por_artefato(text) to anon, authenticated;
grant execute on function public.salvar_progresso_caminhada(text, jsonb) to anon, authenticated;

-- Testes sugeridos após executar:
-- select public.cadastrar_artefato('MKS-7ZKC4', 'Guardião');
-- select public.reconhecer_artefato('MKS-7ZKC4');
