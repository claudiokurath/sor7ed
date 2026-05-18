// scratch/map_notion_workspace.ts
import { Client } from "@notionhq/client";
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

const notion = new Client({ auth: env.NOTION_API_KEY });

async function main() {
  try {
    console.log("Searching for ALL pages and databases in Notion...");
    let hasMore = true;
    let cursor: string | undefined = undefined;
    let total = 0;

    while (hasMore) {
      const response: any = await notion.search({
        start_cursor: cursor,
      });

      total += response.results.length;

      response.results.forEach((item: any) => {
        const title = item.title?.[0]?.text?.content || 
                      item.properties?.Title?.title?.[0]?.text?.content || 
                      item.properties?.Name?.title?.[0]?.text?.content ||
                      "Untitled";
        const type = item.object;
        console.log(`- [${type.toUpperCase()}] ${title} (ID: ${item.id})`);
      });

      hasMore = response.has_more;
      cursor = response.next_cursor;
    }

    console.log(`Total items found: ${total}`);

  } catch (error) {
    console.error("❌  Notion API error:", error);
  }
}

main();
