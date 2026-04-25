import { NavLink, useLocation } from 'react-router-dom'
import { CheckSquare, BarChart3, CalendarDays, LogOut, Home } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/tarefas', label: 'Tarefas', icon: CheckSquare },
  { to: '/calendario', label: 'Calendário', icon: CalendarDays },
  { to: '/analises', label: 'Análises', icon: BarChart3 },
]

export default function Sidebar() {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-bg-surface/50 h-screen sticky top-0 p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <CheckSquare size={18} className="text-bg-base" />
          </div>
          <span className="text-lg font-bold tracking-tight text-text-primary">
            TaskFlow
          </span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
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
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-all duration-200 hover:bg-danger/10 hover:text-danger"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Top Header (Minimal) */}
      <header className="md:hidden sticky top-0 z-40 border-b border-border bg-bg-surface/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent">
            <CheckSquare size={14} className="text-bg-base" />
          </div>
          <span className="text-base font-bold tracking-tight text-text-primary">
            TaskFlow
          </span>
        </div>
        
        <button
          onClick={signOut}
          className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
          title="Sair"
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-surface/95 backdrop-blur-xl md:hidden pb-safe">
        <div className="flex items-center justify-around px-2 py-1.5">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all duration-200 ${
                  isActive ? 'text-accent' : 'text-text-muted'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span>{label}</span>
              </NavLink>
            )
          })}
        </div>
      </div>
    </>
  )
}
