# Guardião — Mega Kraft Studio

Versão consolidada com reconhecimento de Artefatos.

## Fluxo do Artefato

Cada tag NFC recebe uma URL exclusiva:

`https://SEU-ENDERECO/?artefato=GRD-MKS-XXXX-XXXX`

Ao abrir o link, o Guardião:

1. valida o formato do código;
2. consulta o Supabase;
3. confirma se o Artefato está ativo;
4. guarda o código no aparelho;
5. inicia ou continua a caminhada.

## Preparação do Supabase

Execute uma vez:

`sql/criar_sistema_artefatos.sql`

## Criar um novo Artefato

Abra:

`admin-artefatos.html`

A página gera:

- código `GRD-MKS-XXXX-XXXX`;
- link para gravar no NFC Tools;
- SQL para cadastrar o Artefato no Supabase.

O painel não contém chave administrativa e não cadastra diretamente no banco. Isso evita expor permissões de administração no GitHub Pages.

## Gravar no NFC Tools

1. Abra **Escrever**.
2. Escolha **Adicionar registro**.
3. Selecione **URL/URI**.
4. Cole o link gerado.
5. Toque em **Escrever** e aproxime a tag ou o anel.

## Arquivos principais

- `index.html` — entrada do Guardião;
- `admin-artefatos.html` — gerador de código, link e SQL;
- `js/artefato.js` — identidade e reconhecimento do Artefato;
- `js/script.js` — inicialização;
- `js/loader.js` — ordem de carregamento;
- `sql/criar_sistema_artefatos.sql` — estrutura do Supabase;
- `jornadas/` — roteiros locais de segurança.

## Ferramentas de desenvolvimento

Use `?dev` no endereço para abrir as ferramentas internas.
