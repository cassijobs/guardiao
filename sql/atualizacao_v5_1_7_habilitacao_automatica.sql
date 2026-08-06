-- =====================================================
-- GUARDIÃO v5.1.7 — HABILITAÇÃO AUTOMÁTICA PELO PAINEL
-- Execute este arquivo UMA ÚNICA VEZ no SQL Editor.
-- Depois disso, novos Artefatos são cadastrados pelo painel.
-- =====================================================

create or replace function public.habilitar_artefato_admin(
    p_codigo text,
    p_nome_edicao text default 'Guardião'
)
returns json
language plpgsql
security definer
set search_path = public, auth, extensions, pg_catalog
as $$
declare
    uid uuid := auth.uid();
    novo_id uuid;
begin
    if uid is null then
        return json_build_object('ok', false, 'motivo', 'nao_autenticado', 'mensagem', 'Sessão administrativa não encontrada.');
    end if;

    if not exists (
        select 1
          from public.admins_guardiao
         where usuario_id = uid
           and ativo = true
    ) then
        return json_build_object('ok', false, 'motivo', 'nao_autorizado', 'mensagem', 'Acesso administrativo não autorizado.');
    end if;

    novo_id := public.cadastrar_artefato(p_codigo, p_nome_edicao);

    return json_build_object(
        'ok', true,
        'id', novo_id,
        'codigo', public._normalizar_codigo_artefato(p_codigo),
        'status', 'disponivel'
    );
exception
    when others then
        return json_build_object(
            'ok', false,
            'motivo', 'falha_cadastro',
            'mensagem', SQLERRM
        );
end;
$$;

revoke all on function public.habilitar_artefato_admin(text, text) from public, anon;
grant execute on function public.habilitar_artefato_admin(text, text) to authenticated;

-- Teste opcional: faça login no painel e habilite um Artefato.
