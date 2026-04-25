import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Check, AlignLeft, CheckSquare } from 'lucide-react'

export default function TaskDetailsModal({ task, isOpen, onClose, onSave }) {
  const [notes, setNotes] = useState('')
  const [subtasks, setSubtasks] = useState([])
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

  // Sync state when task changes
  useEffect(() => {
    if (task) {
      setNotes(task.notes || '')
      setSubtasks(task.subtasks || [])
    }
  }, [task])

  if (!isOpen || !task) return null

  function handleSave() {
    onSave(task.id, { notes, subtasks })
  }

  function addSubtask(e) {
    e.preventDefault()
    if (!newSubtaskTitle.trim()) return
    const newSubtask = {
      id: crypto.randomUUID(),
      title: newSubtaskTitle.trim(),
      completed: false
    }
    setSubtasks([...subtasks, newSubtask])
    setNewSubtaskTitle('')
  }

  function toggleSubtask(id) {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s))
  }

  function deleteSubtask(id) {
    setSubtasks(subtasks.filter(s => s.id !== id))
  }

  const completedCount = subtasks.filter(s => s.completed).length

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] bg-bg-surface rounded-2xl shadow-xl animate-scale-in border border-border">
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-text-primary pr-8">{task.title}</h2>
            <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
              <span className="uppercase tracking-wider font-medium">{task.category}</span>
              <span>•</span>
              <span className="uppercase tracking-wider font-medium">{task.priority}</span>
            </div>
          </div>
          <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-lg text-text-muted hover:bg-bg-hover hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8 scrollbar-none">
          {/* Notes Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <AlignLeft size={18} className="text-accent" />
              Notas
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione detalhes, links ou descrições da tarefa..."
              className="w-full min-h-[120px] rounded-xl border border-border bg-bg-elevated p-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent resize-y"
            />
          </div>

          {/* Subtasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <CheckSquare size={18} className="text-accent" />
                Checklist
              </div>
              {subtasks.length > 0 && (
                <span className="text-xs font-medium text-text-secondary">
                  {completedCount} / {subtasks.length} concluídas
                </span>
              )}
            </div>

            {/* Subtasks Progress */}
            {subtasks.length > 0 && (
              <div className="h-1.5 w-full bg-bg-elevated rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${(completedCount / subtasks.length) * 100}%` }}
                />
              </div>
            )}

            <div className="space-y-2">
              {subtasks.map((subtask) => (
                <div key={subtask.id} className="group flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-bg-elevated transition-colors">
                  <button
                    onClick={() => toggleSubtask(subtask.id)}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                      subtask.completed ? 'border-success bg-success' : 'border-text-muted hover:border-success'
                    }`}
                  >
                    {subtask.completed && <Check size={12} className="text-bg-base" strokeWidth={3} />}
                  </button>
                  <span className={`flex-1 text-sm ${subtask.completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                    {subtask.title}
                  </span>
                  <button
                    onClick={() => deleteSubtask(subtask.id)}
                    className="p-1.5 rounded-md text-text-muted opacity-0 group-hover:opacity-100 transition-all hover:bg-danger/10 hover:text-danger focus:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={addSubtask} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Adicionar subtarefa..."
                className="flex-1 bg-transparent border-b border-border px-2 py-1.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="p-1.5 rounded-md bg-bg-elevated text-text-secondary hover:bg-accent/10 hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-border flex justify-end gap-3 shrink-0 bg-bg-surface rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-accent text-sm font-medium text-bg-base hover:bg-accent-hover transition-colors shadow-sm">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  )
}
