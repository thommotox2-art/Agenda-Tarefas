import { Trash2, CalendarDays, Check, AlignLeft, CheckSquare } from 'lucide-react'
import { format, isPast, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Badge from './Badge'

export default function TaskItem({ task, onToggle, onDelete, onClick, style }) {
  const isOverdue = task.dueDate && !task.completed && isPast(new Date(task.dueDate + 'T23:59:59'))
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate + 'T00:00:00'))

  function formatDueDate(dateStr) {
    if (!dateStr) return null
    const date = new Date(dateStr + 'T00:00:00')
    if (isDueToday) return 'Hoje'
    return format(date, "dd 'de' MMM", { locale: ptBR })
  }

  const hasNotes = task.notes && task.notes.trim().length > 0
  const hasSubtasks = task.subtasks && task.subtasks.length > 0
  const completedSubtasks = hasSubtasks ? task.subtasks.filter(s => s.completed).length : 0

  return (
    <div
      style={style}
      onClick={() => onClick && onClick(task)}
      className={`group flex items-start gap-3 rounded-xl border bg-bg-surface p-3 transition-all duration-200 cursor-pointer hover:border-border-hover hover:shadow-md sm:items-center sm:gap-4 sm:p-4 ${
        task.completed
          ? 'border-border/50 opacity-50'
          : 'border-border'
      }`}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 sm:mt-0 sm:h-[22px] sm:w-[22px] ${
          task.completed
            ? 'border-accent bg-accent'
            : 'border-text-muted hover:border-accent'
        }`}
        aria-label={task.completed ? 'Desmarcar tarefa' : 'Marcar como concluída'}
      >
        {task.completed && <Check size={12} className="text-bg-base" strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-[13px] font-medium leading-snug sm:text-sm ${
            task.completed
              ? 'text-text-secondary line-through'
              : 'text-text-primary'
          }`}
        >
          {task.title}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:mt-2 sm:gap-2">
          <Badge variant={task.category} />
          <Badge variant={task.priority} />

          {task.dueDate && (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium sm:text-xs ${
                isOverdue
                  ? 'text-danger'
                  : isDueToday
                    ? 'text-accent'
                    : 'text-text-secondary'
              }`}
            >
              <CalendarDays size={11} className="sm:hidden" />
              <CalendarDays size={12} className="hidden sm:block" />
              {formatDueDate(task.dueDate)}
            </span>
          )}

          {(hasNotes || hasSubtasks) && (
            <div className="flex items-center gap-2 ml-1 px-1.5 py-0.5 rounded-md bg-bg-elevated text-[10px] sm:text-xs text-text-muted">
              {hasNotes && <AlignLeft size={12} />}
              {hasSubtasks && (
                <span className="flex items-center gap-1">
                  <CheckSquare size={12} />
                  {completedSubtasks}/{task.subtasks.length}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
        className="shrink-0 rounded-lg p-1.5 text-text-muted transition-all duration-200 hover:bg-danger/10 hover:text-danger sm:p-2 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label="Excluir tarefa"
      >
        <Trash2 size={15} className="sm:hidden" />
        <Trash2 size={16} className="hidden sm:block" />
      </button>
    </div>
  )
}
