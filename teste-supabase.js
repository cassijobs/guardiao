async function testarSupabase() {
    console.log("=== TESTE SUPABASE ===");

    const { data, error } = await supabaseClient
        .from("encontros")
        .select("*")
        .limit(1);

    if (error) {
        console.error("Erro:", error);
        return;
    }

    console.log("Conectado com sucesso!");
    console.log(data);
}

testarSupabase();
