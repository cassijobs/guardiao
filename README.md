# Guardião v5.0

Versão revisada para publicação na branch `guardiao-v5`.

## Principais recursos

- código curto de Artefato: `MKS-7ZKC4`;
- compatibilidade temporária com `GRD-MKS-XXXX-XXXX`;
- URL curta: `https://cassijobs.github.io/guardiao/MKS-7ZKC4`;
- `404.html` converte automaticamente a URL curta para o Guardião;
- reconhecimento apenas valida o Artefato e não o ativa prematuramente;
- a caminhada pertence à pessoa e pode ser vinculada a outro Artefato;
- uma nova caminhada começa vazia, sem copiar progresso anterior;
- sincronização remota em fila para reduzir sobrescritas fora de ordem;
- cadastro protegido contra códigos duplicados.

## Instalação

1. Faça backup da branch `main`.
2. Crie ou selecione a branch `guardiao-v5`.
3. Substitua o conteúdo da branch pelos arquivos deste pacote.
4. No Supabase, abra o SQL Editor e execute:
   `sql/atualizacao_v5_0_completa.sql`
5. Publique a branch para testes.
6. Abra `admin-artefatos.html`, gere um código e execute o SQL de cadastro mostrado na página.

## Teste mínimo

1. Cadastre um código novo, por exemplo `MKS-7ZKC4`.
2. Abra `https://SEU-ENDERECO/guardiao/MKS-7ZKC4`.
3. Confirme que aparece a escolha para iniciar uma nova caminhada.
4. Conclua um encontro e abra novamente no mesmo dia.
5. Confirme a tela de espera.
6. Teste o mesmo link em outro navegador e confirme que o progresso remoto é carregado.

## Segurança

A chave pública do Supabase pode ficar no navegador. Nunca coloque `service_role`, Secret Key ou senha administrativa nos arquivos do GitHub.

## Acesso administrativo — v5.1

1. No Supabase, crie sua conta em **Authentication > Users > Add user**.
2. Abra `sql/atualizacao_v5_1_acesso_admin.sql`.
3. Substitua `SEU_EMAIL_AQUI` pelo e-mail da conta criada e execute o SQL.
4. Entre por `admin-login.html`.

As páginas `admin-artefatos.html` e `admin-dev.html` exigem sessão autenticada e autorização no banco. A senha não fica no JavaScript.


### Regra de acesso sem código
Abrir apenas a raiz do site não ativa nem retoma Artefatos. O código deve vir no caminho ou no parâmetro do link NFC/QR.

## Entrada manual pela chave da caixa

Ao abrir a raiz do Guardião sem código, o portador pode digitar a chave impressa no interior da caixa. O formulário cria o mesmo endereço utilizado pelo NFC e pelo QR Code, portanto todos os acessos passam pelo mesmo reconhecimento e pelas mesmas regras de ativação.

