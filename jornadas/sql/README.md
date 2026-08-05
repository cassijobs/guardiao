# Banco de dados — Guardião v5.0

Para atualizar um projeto existente, execute **somente**:

`atualizacao_v5_0_completa.sql`

O script é idempotente, preserva os registros existentes, aceita os códigos curtos `MKS-7ZKC4` e mantém compatibilidade com `GRD-MKS-XXXX-XXXX`.

Depois, use o SQL gerado em `admin-artefatos.html` para cadastrar cada novo Artefato.
