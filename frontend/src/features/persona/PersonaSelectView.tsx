import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { usePersona } from '../../hooks/usePersona'

// Credenciais aceitas (simuladas)
const VALID_EMAIL = 'jose@tokeni.app'
const VALID_PASSWORD = '123456'

export function PersonaSelectView() {
  const { setPersona } = usePersona()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Simula uma latência de autenticação
    setTimeout(() => {
      if (
        email.trim().toLowerCase() === VALID_EMAIL &&
        password === VALID_PASSWORD
      ) {
        setPersona('jose')
        navigate('/dashboard')
      } else {
        setError('E-mail ou senha incorretos.')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-[var(--color-bg)] px-6 py-10">

      {/* Logo */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-[var(--color-primary)] tracking-tight">tokeni</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">Sua vida financeira organizada com IA</p>
      </div>

      {/* Card de login */}
      <div className="w-full max-w-sm bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] shadow-sm p-8">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-7">
          <p className="text-base font-bold text-[var(--color-text)]">Login</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* E-mail */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-[var(--color-text)]">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jose@tokeni.app"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            />
          </div>

          {/* Senha */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-[var(--color-text)]">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <p className="text-xs text-[var(--color-danger)] text-center -mt-1">{error}</p>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 w-full py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl text-sm disabled:opacity-60 hover:bg-[var(--color-primary-light)] transition-colors"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={16} />
                Entrar
              </>
            )}
          </button>
        </form>

        {/* Dica de credenciais */}
        <div className="mt-6 bg-[var(--color-bg)] rounded-2xl px-4 py-3 border border-[var(--color-border)]">
          <p className="text-[11px] text-[var(--color-muted)] font-medium mb-1">Credenciais de demonstração</p>
          <p className="text-[11px] text-[var(--color-text)]">
            E-mail: <span className="font-mono font-semibold">jose@tokeni.app</span>
          </p>
          <p className="text-[11px] text-[var(--color-text)]">
            Senha: <span className="font-mono font-semibold">123456</span>
          </p>
        </div>
      </div>
    </div>
  )
}
