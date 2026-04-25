import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { CheckSquare, BarChart3, CalendarDays, LogOut, Menu, X } from 'lucide-react'

const navItems = [
  { to: '/tarefas', label: 'Tarefas', icon: CheckSquare },
  { to: '/analises', label: 'Análises', icon: BarChart3 },
  { to: '/calendario', label: 'Calendário', icon: CalendarDays },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3 lg:px-8">
        <NavLink to="/tarefas" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent sm:h-9 sm:w-9">
            <CheckSquare size={16} className="text-bg-base sm:hidden" />
            <CheckSquare size={18} className="text-bg-base hidden sm:block" />
          </div>
          <span className="text-base font-bold tracking-tight text-text-primary sm:text-lg">
            TaskFlow
          </span>
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent-muted text-accent'
                    : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-all duration-200 hover:bg-danger/10 hover:text-danger md:flex"
            onClick={() => alert('Funcionalidade de logout será integrada com Supabase.')}
          >
            <LogOut size={16} />
            Sair
          </button>

          <button
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-hover md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile bottom nav for main navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-surface/95 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-around px-2 py-1.5">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-4 py-1.5 text-[10px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-accent'
                    : 'text-text-muted'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span>{label}</span>
              </NavLink>
            )
          })}
          <button
            className="flex flex-col items-center gap-0.5 rounded-lg px-4 py-1.5 text-[10px] font-medium text-text-muted transition-all duration-200"
            onClick={() => alert('Funcionalidade de logout será integrada com Supabase.')}
          >
            <LogOut size={20} strokeWidth={1.5} />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Mobile slide menu (optional extra) */}
      {mobileOpen && (
        <div className="border-t border-border px-3 py-3 md:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-accent-muted text-accent'
                      : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
            <button
              className="mt-2 flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium text-text-secondary transition-all duration-200 hover:bg-danger/10 hover:text-danger"
              onClick={() => alert('Funcionalidade de logout será integrada com Supabase.')}
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
