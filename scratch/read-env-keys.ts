import * as fs from 'fs'
const envContent = fs.readFileSync('.env.local', 'utf8')
console.log("Env keys:")
envContent.split('\n').forEach(line => {
  const t = line.trim()
  if (!t || t.startsWith('#')) return
  const idx = t.indexOf('=')
  if (idx !== -1) {
    console.log(`- ${t.substring(0, idx).trim()}`)
  }
})
