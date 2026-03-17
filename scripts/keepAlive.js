const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://fympyfzeceommprgkyin.supabase.co"; // Hardcoded from scripts.js
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function pingDatabase() {
    try {
        if (!SUPABASE_SERVICE_ROLE_KEY) {
            console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Database ping aborted.");
            process.exit(1);
        }

        console.log("Pinging Supabase database to keep it active...");
        
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Perform a simple lightweight query to keep the project active
        const { data, error } = await supabase
            .from('subscribers')
            .select('id')
            .limit(1);

        if (error) {
            console.error("Database ping failed with error:", error.message);
            process.exit(1);
        }

        console.log("✅ Database ping successful. Project remains active.");

    } catch (err) {
        console.error("Unexpected error during database ping:", err.message);
        process.exit(1);
    }
}

pingDatabase();
