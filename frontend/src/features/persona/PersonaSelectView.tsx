import { useNavigate } from 'react-router-dom'
import { usePersona } from '../../hooks/usePersona'
import type { PersonaId } from '../../types'

const personas: Array<{
  id: PersonaId
  name: string
  role: string
  avatar: string
  description: string
  theme: string
}> = [
  {
    id: 'janaina',
    name: 'Janaína Brito',
    role: 'Dona de casa',
    avatar: '👩‍👧',
    description: 'Administrar despesas familiares, controlar dívidas e economizar.',
    theme: 'from-green-700 to-green-500',
  },
  {
    id: 'jose',
    name: 'José Fá',
    role: 'Primeiro emprego',
    avatar: '👨‍💼',
    description: 'Equilibrar consumo, lazer e planejamento financeiro.',
    theme: 'from-violet-700 to-violet-500',
  },
]

export function PersonaSelectView() {
  const { setPersona } = usePersona()
  const navigate = useNavigate()

  function choose(id: PersonaId) {
    setPersona(id)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-[var(--color-bg)] px-6 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight">tokeni</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">Sua vida financeira organizada com IA</p>
      </div>

      <p className="text-sm font-semibold text-[var(--color-text)] mb-4">Quem é você?</p>

      <div className="w-full max-w-xs space-y-3">
        {personas.map(p => (
          <button
            key={p.id}
            onClick={() => choose(p.id)}
            className={`w-full bg-gradient-to-r ${p.theme} text-white rounded-2xl p-5 text-left hover:opacity-90 transition-opacity`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{p.avatar}</span>
              <div>
                <p className="font-bold text-base">{p.name}</p>
                <p className="text-xs text-white/70">{p.role}</p>
              </div>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">{p.description}</p>
          </button>
        ))}
      </div>

      <p className="text-xs text-[var(--color-muted)] mt-8 text-center max-w-xs">
        Dados completamente fictícios para fins de demonstração.
      </p>
    </div>
  )
}
