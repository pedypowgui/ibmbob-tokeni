import express from 'express'
import cors from 'cors'
import { env } from './config/env'
import router from './routes'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(express.json())

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', router)

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// ─── Error handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler)

app.listen(env.PORT, () => {
  console.log(`[Tokeni API] Running on http://localhost:${env.PORT}`)
  console.log(`[Tokeni API] AI provider: ${env.AI_PROVIDER}`)
})

export default app
