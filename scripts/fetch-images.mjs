// Скачивает фотографии из src/data/images.js в public/images.
// Запуск: npm run images  (нужен доступ к images.unsplash.com)
import { mkdir, writeFile, access } from 'node:fs/promises'
import { images } from '../src/data/images.js'

const dir = new URL('../public/images/', import.meta.url)
await mkdir(dir, { recursive: true })
const force = process.argv.includes('--force')

let ok = 0
for (const [key, { id }] of Object.entries(images)) {
  const file = new URL(`${key}.jpg`, dir)
  if (!force) {
    try { await access(file); ok++; console.log(`· ${key} — уже есть`); continue } catch {}
  }
  const url = `https://images.unsplash.com/${id}?w=2000&q=78&fm=jpg&fit=crop`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await writeFile(file, Buffer.from(await res.arrayBuffer()))
    ok++
    console.log(`✓ ${key}`)
  } catch (e) {
    console.log(`✗ ${key} (${id}): ${e.message}`)
  }
}
console.log(`\nГотово: ${ok}/${Object.keys(images).length}`)
