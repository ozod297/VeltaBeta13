import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `vite dev` odatiy holda faqat frontendni beradi — Vercel serverless
// funksiyalarini (api/*.js) ishga tushirmaydi. Bu plugin ularni lokal dev
// serverida ham ishlaydigan qiladi, shuning uchun `npm run dev` orqali
// admin panel, aloqa formasi va bot endpointlarini ham test qilish mumkin.
//
// DIQQAT: import() yo'li atayin o'zgaruvchi orqali (literal satr sifatida
// EMAS) tuzilgan. Aks holda `vite build` konfiguratsiya faylini yuklashda
// esbuild bu yo'llarni build vaqtida oldindan tekshirib chiqadi va agar
// build muhitida (masalan, git orqali) shu fayllar topilmasa, butun build
// "Could not resolve" xatosi bilan yiqiladi — garchi runtime uchun hech
// qanday ahamiyati bo'lmasa ham.
function apiDevMiddleware(mode) {
  const routes = {
    '/api/admin-login': 'admin-login.js',
    '/api/contact': 'contact.js',
    '/api/bot': 'bot.js',
  }

  return {
    name: 'local-api-dev-middleware',
    configureServer(server) {
      Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

      server.middlewares.use(async (req, res, next) => {
        const fileName = routes[req.url.split('?')[0]]
        if (!fileName) return next()
        const loader = () => {
          const filePath = path.resolve(process.cwd(), 'api', fileName)
          return import(pathToFileURL(filePath).href)
        }

        let raw = ''
        req.on('data', (chunk) => { raw += chunk })
        req.on('end', async () => {
          try {
            req.body = raw ? JSON.parse(raw) : {}
          } catch {
            req.body = {}
          }
          res.status = (code) => { res.statusCode = code; return res }
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
          }
          res.send = (data) =>
            res.end(typeof data === 'string' ? data : JSON.stringify(data))

          try {
            const mod = await loader()
            await mod.default(req, res)
          } catch (err) {
            console.error('[dev-api]', err)
            res.statusCode = 500
            res.end(JSON.stringify({ ok: false, error: 'Dev server xatoligi' }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    apiDevMiddleware(mode),
  ],
}))
