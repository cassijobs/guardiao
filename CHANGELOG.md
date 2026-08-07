## v5.1.11 — Painel de Artefatos centralizado

- Centralização geral da página `admin-artefatos.html`.
- Botões mais compactos, mantendo área confortável para toque no celular.
- Campos, QR Code, mensagens e ações alinhados ao centro.
- Espaçamentos verticais discretamente reduzidos.
- Nenhuma lógica de geração, habilitação ou integração com Supabase foi alterada.

# Guardião v5.1.10

- Centralização geral da página Ferramentas do desenvolvedor.
- Botões mais compactos, mantendo área confortável para toque no celular.
- Espaçamentos internos e entre ações reduzidos.
- Removida a palavra “Pronto.” abaixo de Diagnóstico.
- A área de saída do diagnóstico agora aparece somente quando houver resultado.

# Guardião v5.1.9

- Corrige a página Ferramentas do desenvolvedor que permanecia invisível após a autorização.
- Adiciona tela visível de verificação de acesso.
- Exibe mensagem de erro e opções para tentar novamente ou voltar ao login.
- Padroniza o acesso ao cliente global do Supabase.

# Guardião v5.1.8

- Mensagem da habilitação movida para uma área visível acima dos botões.
- Estado “Habilitando…” exibido imediatamente.
- Erros do Supabase agora aparecem claramente.
- Aviso específico quando a função SQL ainda não foi instalada.
- Tempo limite para evitar espera indefinida.

# Guardião v5.1.7

- Habilitação automática de novos Artefatos pelo painel administrativo.
- Removida a área de SQL da tela do gerador.
- Chave, link e QR Code só aparecem depois da confirmação do Supabase.
- Tentativa automática com nova chave em caso de colisão.
- Adicionado `sql/atualizacao_v5_1_7_habilitacao_automatica.sql`.

# Guardião v5.1.6

- Todos os botões passaram a usar o formato branco com laterais anguladas.
- Removido o seletor antigo “Formato do link”.
- O painel mostra Chave do Artefato, Endereço do Artefato e QR Code.
- Mensagem atualizada para “Artefato habilitado com sucesso.”
- Incluído botão para imprimir a etiqueta.

## v5.1.5
- Corrigida a conexão global do Supabase nas páginas administrativas.
- Fixada a versão UMD do CDN do Supabase.
- Adicionado diagnóstico quando a biblioteca externa não carregar.

# Changelog

## v5.1.3

- A página principal agora oferece entrada manual da chave impressa na caixa.
- A chave é normalizada em letras maiúsculas e validada antes do acesso.
- O formulário reutiliza o mesmo link e o mesmo fluxo de reconhecimento de NFC e QR Code.
- A raiz sem código continua sem ativar ou retomar Artefatos automaticamente.

## v5.1.1
- Corrige tela vazia em admin-artefatos.html e admin-dev.html.
- Expõe supabaseClient em window para o módulo de autenticação.

# Histórico de versões

## v5.0 — 2026-07-29

- adotado código curto `MKS-7ZKC4`;
- criada URL curta automática por `404.html`;
- mantida compatibilidade com códigos antigos;
- corrigido reconhecimento que ativava o Artefato antes da escolha;
- corrigida nova caminhada que podia herdar progresso anterior;
- unificados os scripts SQL conflitantes;
- adicionadas transações com bloqueio durante ativação e vínculo;
- adicionados índices únicos contra códigos duplicados;
- melhorada a fila de sincronização do progresso;
- atualizado o gerador administrativo;
- revisados documentação e testes locais.

## 5.1.0
- Login administrativo com Supabase Auth.
- Acesso exclusivo autorizado pela tabela `admins_guardiao`.
- Proteção de `admin-artefatos.html`.
- Novo painel `admin-dev.html` para limpeza local e diagnóstico.
- Nova página `admin-login.html`.

## v5.1.2 — acesso sem código

- A página principal aberta sem código não recupera mais automaticamente o último Artefato salvo no navegador.
- Um Artefato só é reconhecido, ativado ou retomado quando seu código está presente no link NFC/QR.
- O endereço raiz agora mostra apenas a orientação neutra para aproximar o Artefato.

## v5.1.4 — painel administrativo visível e robusto
- Remove o ocultamento total da página durante a autenticação.
- Exibe carregamento e mensagem de erro em caso de falha.
- Inicializa o gerador somente após confirmar o acesso.
- Corrige estilos de campos e botões no painel administrativo.

## v5.1.12 — Recuperação de senha administrativa
- Adicionado “Esqueci minha senha” à tela de login.
- Adicionada a página `redefinir-senha.html`.
- O pedido de recuperação aponta automaticamente para a página publicada no mesmo diretório.
- Validação de senha mínima e confirmação antes de salvar.

## Studio 12.0 — Produção gráfica
- Novo cartão oficial no modelo CARD(3).
- Tamanho final de impressão: 63 × 99 mm.
- Exportação PNG em 300 DPI (744 × 1169 px).
- Impressão individual em tamanho real.
- Folha A4 com 6 cartões e marcas de corte.
- Casa, essência e código dinâmicos por artefato.
- Nova área de Produção gráfica.
- Versionamento do ecossistema em `STUDIO/version.json` e `AR/version.json`.
