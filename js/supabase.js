/*
    GUARDIÃO — CONEXÃO COM O SUPABASE

    Este arquivo cria a conexão usada pelo restante do projeto.
    Nunca coloque aqui uma Secret Key.
*/

const SUPABASE_URL = "https://wpnrujzxqxztlqtmkwfw.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_GJ0P5fcqW_-a-qO_TQKIBQ_swfsLe-B";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("Cliente Supabase preparado.");
