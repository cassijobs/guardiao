# Artefatos e recuperação — v5.0

O novo formato é `MKS-7ZKC4`. Letras e números ambíguos como O, 0, I e 1 não são usados.

Um segundo Artefato disponível pode ser vinculado à caminhada que já está aberta no aparelho. O primeiro Artefato continua válido até ser bloqueado ou cancelado administrativamente.

Exemplos no SQL Editor:

```sql
select public.alterar_status_artefato('MKS-7ZKC4', 'bloqueado');
select public.alterar_status_artefato('MKS-7ZKC4', 'ativado');
select public.alterar_status_artefato('MKS-7ZKC4', 'cancelado');
```
