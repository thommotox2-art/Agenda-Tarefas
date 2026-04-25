import { useState, useMemo } from 'react'
import { useTasks } from '../hooks/useTasks'
import { CheckCircle2, Clock, ListTodo, TrendingUp, Briefcase, User, BookOpen, ChevronRight, X } from 'lucide-react'
import Badge from '../components/Badge'

const CATEGORY_CONFIG = {
  trabalho: { label: 'Trabalho', icon: Briefcase, color: 'text-cat-trabalho', bg: 'bg-cat-trabalho/15' },
  pessoal: { label: 'Pessoal', icon: User, color: 'text-cat-pessoal', bg: 'bg-cat-pessoal/15' },
  estudos: { label: 'Estudos', icon: BookOpen, color: 'text-cat-estudos', bg: 'bg-cat-estudos/15' },
}

const PRIORITY_CONFIG = {
  alta: { label: 'Alta', barBg: 'bg-pri-alta' },
  media: { label: 'Média', barBg: 'bg-pri-media' },
  baixa: { label: 'Baixa', barBg: 'bg-pri-baixa' },
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-3.5 transition-all duration-200 hover:border-border-hover hover:shadow-md sm:p-5">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${accent}`}>
        <Icon size={16} className="sm:hidden" />
        <Icon size={20} className="hidden sm:block" />
      </div>
      <p className="mt-3 text-xl font-bold text-text-primary sm:mt-4 sm:text-2xl">{value}</p>
      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary sm:mt-1 sm:text-xs">{label}</p>
    </div>
  )
}

function ProgressBar({ value, max, colorClass }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated sm:h-2 mt-1.5">
      <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function AnalyticsPage() {
  const { tasks } = useTasks()
  const [activeFilter, setActiveFilter] = useState(null) // { type: 'category' | 'priority', value: string }

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.completed).length
    const pending = total - completed
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0
    const byCategory = {}
    const byPriority = {}
    tasks.forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + 1
      byPriority[t.priority] = (byPriority[t.priority] || 0) + 1
    })
    return { total, completed, pending, rate, byCategory, byPriority }
  }, [tasks])

  const filteredTasks = useMemo(() => {
    if (!activeFilter) return []
    return tasks.filter((t) => t[activeFilter.type] === activeFilter.value)
  }, [tasks, activeFilter])

  return (
    <div className="space-y-5 pb-20 animate-fade-in sm:space-y-8 md:pb-0">
      <div>
        <h1 className="text-xl font-bold text-text-primary sm:text-2xl">Análises</h1>
        <p className="mt-0.5 text-xs text-text-secondary sm:mt-1 sm:text-sm">Visão geral do seu progresso e produtividade.</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
        <StatCard icon={ListTodo} label="Total" value={stats.total} accent="bg-accent/10 text-accent" />
        <StatCard icon={CheckCircle2} label="Concluídas" value={stats.completed} accent="bg-success/10 text-success" />
        <StatCard icon={Clock} label="Pendentes" value={stats.pending} accent="bg-pri-media/10 text-pri-media" />
        <StatCard icon={TrendingUp} label="Conclusão" value={`${stats.rate}%`} accent="bg-accent/10 text-accent" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="rounded-xl border border-border bg-bg-surface p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-text-primary sm:text-base">Por Categoria</h2>
          <div className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
              const count = stats.byCategory[key] || 0
              const isSelected = activeFilter?.type === 'category' && activeFilter.value === key
              return (
                <button 
                  key={key}
                  onClick={() => count > 0 && setActiveFilter(isSelected ? null : { type: 'category', value: key })}
                  className={`w-full text-left p-2 -mx-2 rounded-lg transition-colors ${count > 0 ? 'cursor-pointer hover:bg-bg-elevated' : 'opacity-50 cursor-default'} ${isSelected ? 'bg-bg-elevated ring-1 ring-border' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-md sm:h-7 sm:w-7 ${cfg.bg}`}>
                        <cfg.icon size={12} className={`${cfg.color} sm:hidden`} />
                        <cfg.icon size={14} className={`${cfg.color} hidden sm:block`} />
                      </div>
                      <span className="text-xs font-medium text-text-primary sm:text-sm">{cfg.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-secondary sm:text-sm">{count}</span>
                      {count > 0 && <ChevronRight size={14} className={`text-text-muted transition-transform ${isSelected ? 'rotate-90' : ''}`} />}
                    </div>
                  </div>
                  <ProgressBar value={count} max={stats.total} colorClass="bg-accent" />
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-surface p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-text-primary sm:text-base">Por Prioridade</h2>
          <div className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
            {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => {
              const count = stats.byPriority[key] || 0
              const isSelected = activeFilter?.type === 'priority' && activeFilter.value === key
              return (
                <button 
                  key={key}
                  onClick={() => count > 0 && setActiveFilter(isSelected ? null : { type: 'priority', value: key })}
                  className={`w-full text-left p-2 -mx-2 rounded-lg transition-colors ${count > 0 ? 'cursor-pointer hover:bg-bg-elevated' : 'opacity-50 cursor-default'} ${isSelected ? 'bg-bg-elevated ring-1 ring-border' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3 ${cfg.barBg}`} />
                      <span className="text-xs font-medium text-text-primary sm:text-sm">{cfg.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-secondary sm:text-sm">{count}</span>
                      {count > 0 && <ChevronRight size={14} className={`text-text-muted transition-transform ${isSelected ? 'rotate-90' : ''}`} />}
                    </div>
                  </div>
                  <ProgressBar value={count} max={stats.total} colorClass={cfg.barBg} />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Filtered Tasks Details Section */}
      {activeFilter && filteredTasks.length > 0 && (
        <div className="rounded-xl border border-border bg-bg-surface p-4 sm:p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary sm:text-base flex items-center gap-2">
              Tarefas com {activeFilter.type === 'category' ? 'Categoria' : 'Prioridade'}: 
              <span className="text-accent capitalize">{
                activeFilter.type === 'category' 
                  ? CATEGORY_CONFIG[activeFilter.value].label 
                  : PRIORITY_CONFIG[activeFilter.value].label
              }</span>
            </h2>
            <button onClick={() => setActiveFilter(null)} className="p-1 rounded-md hover:bg-bg-elevated text-text-muted">
              <X size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <div key={task.id} className={`flex items-center gap-3 p-3 rounded-lg border border-border bg-bg-elevated ${task.completed ? 'opacity-60' : ''}`}>
                <div className={`w-2 h-2 rounded-full shrink-0 ${task.completed ? 'bg-success' : 'bg-accent'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${task.completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                    {task.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {activeFilter.type !== 'category' && <Badge variant={task.category} />}
                  {activeFilter.type !== 'priority' && <Badge variant={task.priority} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.total === 0 && (
        <div className="rounded-xl border border-dashed border-border py-10 text-center sm:py-12">
          <p className="text-xs text-text-secondary sm:text-sm">Crie algumas tarefas para ver as análises aqui.</p>
        </div>
      )}
    </div>
  )
}
