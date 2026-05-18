// scratch/check_synced_protocol.ts
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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  try {
    const { data: protocols, error } = await supabase
      .from('protocols')
      .select('slug, title, keyword, problem')
      .limit(3);

    if (error) {
      console.error("❌  Error fetching protocols:", error);
      return;
    }

    console.log(`Checked ${protocols.length} protocols:`);
    protocols.forEach((p) => {
      console.log(`\nTitle: ${p.title}`);
      console.log(`Slug: ${p.slug}`);
      console.log(`Keyword: ${p.keyword}`);
      console.log(`Problem Length: ${p.problem?.length || 0} chars`);
      console.log(`Problem Sneak Peek: "${p.problem?.substring(0, 100)}..."`);
    });

  } catch (error) {
    console.error("❌  Unexpected error:", error);
  }
}

main();
