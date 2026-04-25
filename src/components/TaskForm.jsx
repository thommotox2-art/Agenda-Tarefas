import { useState } from 'react'
import { Plus } from 'lucide-react'

const CATEGORIES = [
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'pessoal', label: 'Pessoal' },
  { value: 'estudos', label: 'Estudos' },
]

const PRIORITIES = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
]

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('trabalho')
  const [priority, setPriority] = useState('media')
  const [dueDate, setDueDate] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAddTask({ title: title.trim(), category, priority, dueDate: dueDate || null })
    setTitle('')
    setCategory('trabalho')
    setPriority('media')
    setDueDate('')
    setIsExpanded(false)
  }

  const selectClass = 'w-full rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-[13px] text-text-primary outline-none transition-colors focus:border-accent sm:py-2 sm:text-sm'
  const labelClass = 'mb-1 block text-[10px] font-medium uppercase tracking-wider text-text-secondary sm:text-xs'

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-bg-surface p-3 shadow-sm transition-all duration-300 sm:p-4">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 sm:h-10 sm:w-10">
          <Plus size={18} className="text-accent" />
        </div>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} onFocus={() => setIsExpanded(true)}
          placeholder="Adicionar nova tarefa..." className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-muted outline-none sm:text-sm" id="task-title-input" />
        {!isExpanded && (
          <button type="button" onClick={() => setIsExpanded(true)} className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-bg-base transition-all duration-200 hover:bg-accent-hover sm:px-4 sm:py-2 sm:text-sm">
            Adicionar
          </button>
        )}
      </div>
      {isExpanded && (
        <div className="mt-3 animate-slide-up space-y-3 sm:mt-4 sm:space-y-4">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
            <div>
              <label htmlFor="task-category" className={labelClass}>Categoria</label>
              <select id="task-category" value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                {CATEGORIES.map(({ value, label }) => (<option key={value} value={value}>{label}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="task-priority" className={labelClass}>Prioridade</label>
              <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value)} className={selectClass}>
                {PRIORITIES.map(({ value, label }) => (<option key={value} value={value}>{label}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="task-duedate" className={labelClass}>Data de Vencimento</label>
              <input type="date" id="task-duedate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={selectClass} />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={() => { setIsExpanded(false); setTitle('') }} className="rounded-lg px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-bg-hover sm:px-4 sm:text-sm">Cancelar</button>
            <button type="submit" disabled={!title.trim()} className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-bg-base transition-all duration-200 hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed sm:px-6 sm:text-sm">
              <span className="flex items-center gap-1.5"><Plus size={14} />Criar Tarefa</span>
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
