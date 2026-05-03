/**
 * Serves `dist/` and proxies POST /api/llm → Anthropic (same contract as Vite dev middleware).
 * Usage: `npm run build && npm start` after setting ANTHROPIC_API_KEY in `.env`.
 */
import 'dotenv/config'
import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..', 'dist')
const PORT = Number(process.env.PORT) || 4173

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}

function safeFilePath(urlPath) {
  try {
    const pathname = decodeURIComponent(urlPath.split('?')[0])
    const relative = pathname === '/' ? '/index.html' : pathname
    const resolved = path.normalize(path.join(ROOT, relative))
    if (!resolved.startsWith(ROOT)) return null
    return resolved
  } catch {
    return null
  }
}

async function readBody(req) {
  const chunks = []
  for await (const ch of req) chunks.push(ch)
  return Buffer.concat(chunks).toString('utf8')
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url?.split('?')[0] === '/api/llm') {
    const key = process.env.ANTHROPIC_API_KEY
    if (!key) {
      res.writeHead(503, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          error: {
            message:
              'Missing ANTHROPIC_API_KEY. Set it in .env or the environment before npm start.',
          },
        }),
      )
      return
    }
    try {
      const body = await readBody(req)
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
        },
        body,
      })
      const text = await r.text()
      res.writeHead(r.status, { 'Content-Type': 'application/json' })
      res.end(text)
    } catch (e) {
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: { message: String(e) } }))
    }
    return
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405)
    res.end()
    return
  }

  const filePath = safeFilePath(req.url ?? '/')
  if (!filePath) {
    res.writeHead(403)
    res.end()
    return
  }

  try {
    const data = await fs.readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' })
    res.end(req.method === 'HEAD' ? undefined : data)
  } catch {
    if ((req.url ?? '/').split('?')[0].includes('.')) {
      res.writeHead(404)
      res.end()
      return
    }
    try {
      const html = await fs.readFile(path.join(ROOT, 'index.html'))
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(req.method === 'HEAD' ? undefined : html)
    } catch {
      res.writeHead(500)
      res.end('Build not found. Run npm run build first.')
    }
  }
})

server.listen(PORT, () => {
  console.log(`Future Me → http://localhost:${PORT}  (dist + /api/llm)`)
})
