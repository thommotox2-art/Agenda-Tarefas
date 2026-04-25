import { useState, useEffect, useMemo } from 'react'
import { useTasks } from '../hooks/useTasks'
import { getScratchpad, saveScratchpad } from '../utils/storage'
import { PenLine, CheckCircle2, Clock } from 'lucide-react'
import { isToday, isPast } from 'date-fns'
import { NavLink } from 'react-router-dom'
import Badge from '../components/Badge'

export default function HomePage() {
  const { tasks, isLoading } = useTasks()
  const [scratchpadText, setScratchpadText] = useState('')

  // Load scratchpad on mount
  useEffect(() => {
    setScratchpadText(getScratchpad())
  }, [])

  // Auto-save scratchpad
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveScratchpad(scratchpadText)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [scratchpadText])

  const todayTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (t.completed) return false
      if (!t.dueDate) return false
      const date = new Date(t.dueDate + 'T00:00:00')
      return isToday(date) || isPast(new Date(t.dueDate + 'T23:59:59'))
    })
  }, [tasks])

  const recentTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.completed)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
  }, [tasks])

  return (
    <div className="space-y-6 animate-fade-in sm:space-y-8">
      <div>
        <h1 className="text-xl font-bold text-text-primary sm:text-2xl">Bom dia!</h1>
        <p className="mt-0.5 text-xs text-text-secondary sm:mt-1 sm:text-sm">
          Aqui está o seu resumo de hoje.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Scratchpad Widget */}
        <div className="col-span-1 lg:col-span-2 rounded-xl border border-border bg-bg-surface flex flex-col h-[300px] sm:h-[400px]">
          <div className="flex items-center gap-2 border-b border-border p-4">
            <PenLine size={18} className="text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">Bloco de Notas</h2>
          </div>
          <textarea
            value={scratchpadText}
            onChange={(e) => setScratchpadText(e.target.value)}
            placeholder="Anote suas ideias aqui... (salvamento automático)"
            className="flex-1 resize-none bg-transparent p-4 text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
        </div>

        {/* Focus Widget */}
        <div className="col-span-1 space-y-6">
          <div className="rounded-xl border border-border bg-bg-surface p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-danger" />
              <h2 className="text-sm font-semibold text-text-primary">Para Hoje / Atrasadas</h2>
            </div>
            
            <div className="space-y-3">
              {isLoading && tasks.length === 0 ? (
                <div className="flex justify-center py-4">
                  <div className="h-4 w-4 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
                </div>
              ) : todayTasks.length > 0 ? (
                todayTasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex flex-col gap-1 border-b border-border/50 pb-2 last:border-0 last:pb-0">
                    <span className="text-sm font-medium text-text-primary line-clamp-1">{task.title}</span>
                    <div className="flex gap-2">
                      <Badge variant={task.category} />
                      <Badge variant={task.priority} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-secondary">Nenhuma tarefa pendente para hoje! 🎉</p>
              )}
            </div>
            
            {todayTasks.length > 0 && (
              <NavLink to="/tarefas" className="mt-4 block text-center text-xs font-medium text-accent hover:underline">
                Ver todas as tarefas →
              </NavLink>
            )}
          </div>

          <div className="rounded-xl border border-border bg-bg-surface p-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} className="text-accent" />
              <h2 className="text-sm font-semibold text-text-primary">Adicionadas Recentemente</h2>
            </div>
            
            <div className="space-y-3">
              {isLoading && tasks.length === 0 ? (
                <div className="flex justify-center py-4">
                  <div className="h-4 w-4 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
                </div>
              ) : recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div key={task.id} className="flex flex-col gap-1 border-b border-border/50 pb-2 last:border-0 last:pb-0">
                    <span className="text-sm font-medium text-text-primary line-clamp-1">{task.title}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-secondary">Nenhuma tarefa recente.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
