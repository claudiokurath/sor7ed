// scratch/seed_test_data.ts
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
    console.log("Seeding expanded test data...");

    const protocols = [
      {
        slug: 'test-protocol',
        title: 'The Focus Engine Protocol',
        branch: 'Level Up',
        status: 'Published',
        summary: 'A protocol to help you transition into deep focus without the friction.',
        excerpt: 'Stop fighting your brain. Use this transition protocol to slide into focus.',
        problem: 'Transitions are hard for neurodivergent brains. This protocol helps.',
        keyword: 'FOCUS',
        read_time: '5 min',
      },
      {
        slug: 'time-blindness',
        title: 'The Time Blindness Visualizer',
        branch: 'Plan Ahead',
        status: 'Published',
        summary: 'Make time visible. Stop guessing how long things take.',
        excerpt: 'Time blindness is real. This protocol helps you see time instead of feeling it.',
        problem: 'When you can\'t feel time passing, you need to see it. This protocol builds visual anchors.',
        keyword: 'TIME',
        read_time: '7 min',
      },
      {
        slug: 'dopamine-menu',
        title: 'The Dopamine Menu Builder',
        branch: 'Feel Good',
        status: 'Published',
        summary: 'Proactive stimulation management for when your brain is seeking dopamine.',
        excerpt: 'Don\'t wait for the craving. Build a menu of healthy dopamine hits.',
        problem: 'When dopamine drops, we reach for the closest hit (usually scrolling). This menu gives you options.',
        keyword: 'DOPAMINE',
        read_time: '6 min',
      }
    ];

    for (const p of protocols) {
      const { data, error } = await supabase
        .from('protocols')
        .upsert(p, { onConflict: 'slug' })
        .select();
      
      if (error) console.error(`❌  Error seeding protocol ${p.slug}:`, error);
      else console.log(`✅  Seeded protocol: ${data?.[0]?.title}`);
    }

    const tools = [
      {
        slug: 'test-tool',
        name: 'The Friction Finder Audit',
        branch: 'Keep Going',
        status: 'Published',
        featured: true,
        short_description: 'Identify your specific pattern of friction.',
      },
      {
        slug: 'energy-audit',
        name: 'The Energy Audit',
        branch: 'Feel Good',
        status: 'Published',
        featured: false,
        short_description: 'Track where your battery is leaking and where it recharges.',
      }
    ];

    for (const t of tools) {
      const { data, error } = await supabase
        .from('tools')
        .upsert(t, { onConflict: 'slug' })
        .select();
      
      if (error) console.error(`❌  Error seeding tool ${t.slug}:`, error);
      else console.log(`✅  Seeded tool: ${data?.[0]?.name}`);
    }

  } catch (error) {
    console.error("❌  Unexpected error:", error);
  }
}

main();
