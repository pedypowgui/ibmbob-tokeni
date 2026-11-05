import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, PieChart, Star, Bot, LogOut, Trophy } from 'lucide-react'
import { usePersona } from '../hooks/usePersona'

const navItems = [
  { to: '/dashboard', label: 'Início', Icon: LayoutDashboard },
  { to: '/transactions', label: 'Extrato', Icon: ArrowLeftRight },
  { to: '/budget', label: 'Orçamento', Icon: PieChart },
  { to: '/dreams', label: 'Sonhos', Icon: Star },
  { to: '/goals', label: 'Metas', Icon: Trophy },
  { to: '/assistant', label: 'Assistente', Icon: Bot },
]

export function AppLayout() {
  const { clearPersona } = usePersona()
  const navigate = useNavigate()

  function handleLogout() {
    clearPersona()
    navigate('/')
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-56 bg-[var(--color-primary)] z-20 py-8 px-4">
        <div className="mb-10 px-2">
          <span className="text-white text-2xl font-bold tracking-tight">tokeni</span>
          <span className="text-green-300 text-xs ml-1">●</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-green-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-green-200 hover:bg-white/10 hover:text-white transition-colors mt-auto"
        >
          <LogOut size={20} />
          Sair
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-56 pb-[var(--bottom-nav-height)] lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[var(--bottom-nav-height)] bg-white border-t border-[var(--color-border)] flex items-center z-20 safe-area-inset-bottom">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full gap-1 text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-muted)]'
              }`
            }
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
