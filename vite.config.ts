import { defineConfig, loadEnv, type Plugin, type PreviewServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect } from 'vite'

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => chunks.push(c as Buffer))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function anthropicProxyMiddleware(getKey: () => string | undefined): Connect.NextHandleFunction {
  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: Connect.NextFunction,
  ) => {
    if (req.url?.split('?')[0] !== '/api/llm' || req.method !== 'POST') {
      next()
      return
    }
    const key = getKey()
    if (!key) {
      res.statusCode = 503
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          error:
            'Missing ANTHROPIC_API_KEY. Add it to a .env file in the project root for local dev.',
        }),
      )
      return
    }
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
    res.statusCode = r.status
    res.setHeader('content-type', 'application/json')
    res.end(text)
  }
}

function anthropicProxyPlugin(): Plugin {
  return {
    name: 'anthropic-proxy',
    configureServer(server) {
      server.middlewares.use(
        anthropicProxyMiddleware(() => {
          const env = loadEnv(server.config.mode, process.cwd(), '')
          return env.ANTHROPIC_API_KEY
        }),
      )
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use(
        anthropicProxyMiddleware(() => {
          const env = loadEnv('production', process.cwd(), '')
          return env.ANTHROPIC_API_KEY
        }),
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), anthropicProxyPlugin()],
  server: {
    port: 5173,
    strictPort: false,
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
})
