import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function anthropicProxy(): Plugin {
  let apiKey = ''

  return {
    name: 'anthropic-proxy',
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, '')
      apiKey = env.ANTHROPIC_API_KEY || ''
    },
    configureServer(server) {
      server.middlewares.use('/api/generate-impact', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!apiKey || apiKey === 'your_api_key_here') {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured in .env' }))
          return
        }

        const chunks: Buffer[] = []
        for await (const chunk of req) {
          chunks.push(chunk as Buffer)
        }
        const body = JSON.parse(Buffer.concat(chunks).toString())

        try {
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: 'claude-haiku-4-5-20251001',
              max_tokens: 300,
              messages: [
                {
                  role: 'user',
                  content: body.prompt,
                },
              ],
            }),
          })

          if (!response.ok) {
            const err = await response.text()
            res.statusCode = response.status
            res.end(JSON.stringify({ error: err }))
            return
          }

          const data = await response.json() as { content?: { text?: string }[] }
          const text = data.content?.[0]?.text ?? ''

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ text }))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), anthropicProxy()],
})
