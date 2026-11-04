import dotenv from 'dotenv'
dotenv.config()

export const env = {
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  AI_PROVIDER: (process.env.AI_PROVIDER ?? 'mock') as 'mock' | 'openai' | 'watsonx',
  AI_API_KEY: process.env.AI_API_KEY ?? '',
  AI_MODEL: process.env.AI_MODEL ?? 'gpt-4o-mini',
  AI_BASE_URL: process.env.AI_BASE_URL ?? '',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
}
