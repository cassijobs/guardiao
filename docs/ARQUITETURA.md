# Arquitetura do Guardião v5.0

O Artefato é uma chave física. A caminhada é um registro independente no Supabase.

Fluxo:

1. `404.html` recebe a URL curta e redireciona para `index.html?artefato=...`.
2. `artefato.js` valida o formato localmente.
3. `reconhecer_artefato` consulta o banco sem alterar o status.
4. Um Artefato disponível pode criar uma caminhada ou se vincular à caminhada já existente no aparelho.
5. `memoria.js` mantém uma cópia local por `caminhada_id` e sincroniza o progresso remotamente.

A separação evita que a perda ou troca do objeto físico apague a caminhada da pessoa.
