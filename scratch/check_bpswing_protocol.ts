// scratch/check_bpswing_protocol.ts
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Manually parse .env.local
const envPath = path.join(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env: { [key: string]: string } = {};
envContent.split("\n").forEach((line) => {
  const [key, ...value] = line.split("=");
  if (key && value) {
    env[key.trim()] = value.join("=").trim();
  }
});

// Use ANON KEY this time!
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  try {
    console.log("Querying with ANON KEY...");
    const { data: protocol, error } = await supabase
      .from('protocols')
      .select('slug, title, status, keyword')
      .eq('slug', 'bipolar-swings-sex-relationships')
      .eq('status', 'Published')
      .single();

    if (error) {
      console.error("❌  Error fetching protocol with Anon Key:", error);
      return;
    }

    console.log("✅  Found protocol with Anon Key:");
    console.log(protocol);

  } catch (error) {
    console.error("❌  Unexpected error:", error);
  }
}

main();
