import * as fs from 'fs';
import * as path from 'path';

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const keys = envContent.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('=')[0].trim());
  console.log("Environment keys in .env.local:", keys);
} catch (e: any) {
  console.error("Error reading .env.local:", e.message);
}
