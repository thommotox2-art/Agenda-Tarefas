import { useState, useMemo } from 'react'
import { useTasks } from '../hooks/useTasks'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Badge from '../components/Badge'

const WEEKDAYS_SHORT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const WEEKDAYS_FULL = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function CalendarPage() {
  const { tasks } = useTasks()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    return eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) })
  }, [currentMonth])

  const tasksByDate = useMemo(() => {
    const map = {}
    tasks.forEach((task) => {
      if (task.dueDate) {
        if (!map[task.dueDate]) map[task.dueDate] = []
        map[task.dueDate].push(task)
      }
    })
    return map
  }, [tasks])

  const selectedTasks = useMemo(() => {
    if (!selectedDate) return []
    return tasksByDate[format(selectedDate, 'yyyy-MM-dd')] || []
  }, [selectedDate, tasksByDate])

  return (
    <div className="space-y-4 pb-20 animate-fade-in sm:space-y-6 md:pb-0">
      <div>
        <h1 className="text-xl font-bold text-text-primary sm:text-2xl">Calendário</h1>
        <p className="mt-0.5 text-xs text-text-secondary sm:mt-1 sm:text-sm">Visualize suas tarefas por data de vencimento.</p>
      </div>

      <div className="rounded-xl border border-border bg-bg-surface p-3 sm:p-6">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <button onClick={() => setCurrentMonth((m) => subMonths(m, 1))} className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary sm:p-2" aria-label="Mês anterior">
            <ChevronLeft size={18} className="sm:hidden" /><ChevronLeft size={20} className="hidden sm:block" />
          </button>
          <h2 className="text-sm font-semibold capitalize text-text-primary sm:text-lg">
            {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
          <button onClick={() => setCurrentMonth((m) => addMonths(m, 1))} className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary sm:p-2" aria-label="Próximo mês">
            <ChevronRight size={18} className="sm:hidden" /><ChevronRight size={20} className="hidden sm:block" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px">
          {WEEKDAYS_FULL.map((day, i) => (
            <div key={day} className="py-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-text-muted sm:py-2 sm:text-xs">
              <span className="sm:hidden">{WEEKDAYS_SHORT[i]}</span>
              <span className="hidden sm:inline">{day}</span>
            </div>
          ))}

          {calendarDays.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const dayTasks = tasksByDate[key] || []
            const inMonth = isSameMonth(day, currentMonth)
            const today = isToday(day)
            const selected = selectedDate && isSameDay(day, selectedDate)

            return (
              <button key={key} onClick={() => setSelectedDate(day)}
                className={`relative flex min-h-[48px] flex-col items-center rounded-lg p-1 text-xs transition-all duration-150 sm:min-h-[72px] sm:p-2 sm:text-sm ${
                  !inMonth ? 'text-text-muted/40'
                    : selected ? 'bg-accent/15 text-accent ring-1 ring-accent/30'
                    : today ? 'bg-bg-elevated text-accent'
                    : 'text-text-primary hover:bg-bg-hover'
                }`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium sm:h-7 sm:w-7 sm:text-xs ${today && !selected ? 'bg-accent text-bg-base' : ''}`}>
                  {format(day, 'd')}
                </span>
                {dayTasks.length > 0 && (
                  <div className="mt-0.5 flex flex-wrap justify-center gap-0.5 sm:mt-1">
                    {dayTasks.slice(0, 3).map((t) => (
                      <div key={t.id} className={`h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5 ${t.completed ? 'bg-success' : 'bg-accent'}`} />
                    ))}
                    {dayTasks.length > 3 && <span className="text-[7px] text-text-muted sm:text-[8px]">+{dayTasks.length - 3}</span>}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="rounded-xl border border-border bg-bg-surface p-4 animate-slide-up sm:p-6">
          <div className="mb-3 flex items-center gap-2 sm:mb-4">
            <CalendarDays size={16} className="text-accent sm:hidden" />
            <CalendarDays size={18} className="text-accent hidden sm:block" />
            <h3 className="text-sm font-semibold text-text-primary sm:text-base">
              {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h3>
          </div>
          {selectedTasks.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {selectedTasks.map((task) => (
                <div key={task.id} className={`flex flex-col gap-2 rounded-lg border border-border p-2.5 sm:flex-row sm:items-center sm:gap-3 sm:p-3 ${task.completed ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`h-2 w-2 shrink-0 rounded-full sm:h-2.5 sm:w-2.5 ${task.completed ? 'bg-success' : 'bg-accent'}`} />
                    <span className={`text-xs sm:text-sm ${task.completed ? 'text-text-secondary line-through' : 'text-text-primary font-medium'}`}>{task.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 pl-4 sm:gap-2 sm:pl-0">
                    <Badge variant={task.category} />
                    <Badge variant={task.priority} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-secondary sm:text-sm">Nenhuma tarefa para esta data.</p>
          )}
        </div>
      )}
    </div>
  )
}
