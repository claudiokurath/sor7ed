// scratch/add_revenue_validation_todo.ts
// Run with: npx tsx scratch/add_revenue_validation_todo.ts

import { Client } from "@notionhq/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// The parent page (or database) where you keep your master to‑do list.
// Add the page ID to your .env.local as NOTION_TODO_PAGE_ID.
const PARENT_PAGE_ID = process.env.NOTION_TODO_PAGE_ID;

if (!PARENT_PAGE_ID) {
  console.error("⚠️  NOTION_TODO_PAGE_ID is missing in .env.local");
  process.exit(1);
}

async function main() {
  try {
    const response = await notion.pages.create({
      parent: { page_id: PARENT_PAGE_ID },
      properties: {
        title: {
          title: [
            {
              type: "text",
              text: { content: "Revenue Validation – 90‑Day Action Plan" },
            },
          ],
        },
      },
      // Add a checklist of the immediate next actions
      children: [
        {
          object: "block",
          type: "to_do",
          to_do: { text: [{ type: "text", text: { content: "Run new Supabase migrations (waitlist & credit tables)" } }], checked: false },
        },
        {
          object: "block",
          type: "to_do",
          to_do: { text: [{ type: "text", text: { content: "Add Stripe env vars (secret key, webhook secret, price IDs) to .env.local" } }], checked: false },
        },
        {
          object: "block",
          type: "to_do",
          to_do: { text: [{ type: "text", text: { content: "Deploy Stripe webhook endpoint and register URL in Stripe Dashboard" } }], checked: false },
        },
        {
          object: "block",
          type: "to_do",
          to_do: { text: [{ type: "text", text: { content: "Publish the three SEO blog posts (ADHD Tax, Productivity Apps, Notification Detox)" } }], checked: false },
        },
        {
          object: "block",
          type: "to_do",
          to_do: { text: [{ type: "text", text: { content: "Start manual outreach to 20‑30 target users and capture waitlist sign‑ups" } }], checked: false },
        },
        {
          object: "block",
          type: "to_do",
          to_do: { text: [{ type: "text", text: { content: "Test Stripe checkout flow with a test card (4242 4242 4242 4242)" } }], checked: false },
        },
        {
          object: "block",
          type: "to_do",
          to_do: { text: [{ type: "text", text: { content: "Convert first manual concierge trial into a paid credit purchase" } }], checked: false },
        },
      ],
    });
    console.log("✅  To‑do page created with ID:", response.id);
  } catch (error) {
    console.error("❌  Notion API error:", error);
  }
}

main();
