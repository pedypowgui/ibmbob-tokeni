import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { AppRouter } from './routes/AppRouter'

// Apply persisted theme before first render to avoid flash
const storedTheme = localStorage.getItem('tokeni_theme')
document.documentElement.setAttribute(
  'data-theme',
  storedTheme === 'dark' || storedTheme === 'light'
    ? storedTheme
    : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
