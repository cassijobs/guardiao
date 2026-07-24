const SUPABASE_URL = "https://wpnrujzxqxztlqtmkwfw.supabase.co/rest/v1/";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_GJ0P5fcqW_-a-qO_TQKIBQ_swfsLe-B";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
