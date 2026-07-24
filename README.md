# Guardião — projeto completo integrado

Esta pasta contém o projeto completo original do Guardião, acrescido do sistema de Artefatos da Mega Kraft Studio.

## Publicação

Envie o **conteúdo desta pasta `guardiao-main`** para a raiz do repositório do GitHub Pages.

A página pública continua sendo:

`index.html`

## Preparação do Supabase

Antes de testar os Artefatos, execute uma vez no SQL Editor:

`sql/criar_sistema_artefatos.sql`

Esse script cria a tabela `artefatos` e a função pública segura `reconhecer_artefato`.

## Criar um Artefato

Depois da publicação, abra:

`admin-artefatos.html`

A página gera:

- código `GRD-MKS-XXXX-XXXX`;
- URL exclusiva para o NFC Tools;
- SQL para cadastrar o código no Supabase.

Exemplo:

`https://SEU-ENDERECO/?artefato=GRD-MKS-8F4Q-X72P`

## Gravar no NFC Tools

1. Abra **Escrever**.
2. Escolha **Adicionar um registro**.
3. Selecione **URL/URI**.
4. Cole a URL gerada.
5. Toque em **Escrever** e aproxime o anel ou a etiqueta NFC.

## Estrutura preservada

- `index.html`
- `style.css`
- `js/config.js`
- `js/memoria.js`
- `js/api.js`
- `js/fornecedor-encontros.js`
- `js/palco.js`
- `js/condutor.js`
- `js/agenda.js`
- `js/dev.js`
- `js/script.js`
- `jornadas/j1_aprender_a_olhar.js`
- `jornadas/j2_caminhar_ao_lado.js`

## Arquivos novos

- `js/artefato.js`
- `admin-artefatos.html`
- `sql/criar_sistema_artefatos.sql`

## Limpeza

Foram removidos somente:

- `supabase-config.js`, duplicado por `js/supabase.js`;
- `teste-supabase.js`, arquivo isolado de teste;
- o segundo carregamento duplicado de `js/supabase.js` no loader.
