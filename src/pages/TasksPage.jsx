import { useState, useMemo } from 'react'
import { useTasks } from '../hooks/useTasks'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import FilterBar from '../components/FilterBar'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import TaskDetailsModal from '../components/TaskDetailsModal'

export default function TasksPage() {
  const { tasks, isLoading, addTask, toggleTask, deleteTask, updateTask } = useTasks()
  const [filter, setFilter] = useState('todas')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [activeTask, setActiveTask] = useState(null)

  function handleAddTask(data) {
    addTask(data)
  }

  function handleToggle(id) {
    toggleTask(id)
  }

  function handleDelete(id) {
    setDeleteTarget(id)
  }

  function confirmDelete() {
    deleteTask(deleteTarget)
    setDeleteTarget(null)
  }

  function handleSaveTaskDetails(id, updates) {
    updateTask(id, updates)
    setActiveTask(null)
  }

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'pendentes': return tasks.filter((t) => !t.completed)
      case 'concluidas': return tasks.filter((t) => t.completed)
      default: return tasks
    }
  }, [tasks, filter])

  const counts = useMemo(() => ({
    todas: tasks.length,
    pendentes: tasks.filter((t) => !t.completed).length,
    concluidas: tasks.filter((t) => t.completed).length,
  }), [tasks])

  return (
    <div className="space-y-4 pb-20 animate-fade-in sm:space-y-6 md:pb-0">
      <div>
        <h1 className="text-xl font-bold text-text-primary sm:text-2xl">Minhas Tarefas</h1>
        <p className="mt-0.5 text-xs text-text-secondary sm:mt-1 sm:text-sm">
          Organize e acompanhe suas atividades do dia a dia.
        </p>
      </div>

      <TaskForm onAddTask={handleAddTask} />
      <FilterBar activeFilter={filter} onFilterChange={setFilter} counts={counts} />

      {isLoading && tasks.length === 0 ? (
        <div className="py-12 flex justify-center">
          <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
        </div>
      ) : filteredTasks.length > 0 ? (
        <TaskList 
          tasks={filteredTasks} 
          onToggle={handleToggle} 
          onDelete={handleDelete} 
          onClick={setActiveTask} 
        />
      ) : (
        <EmptyState filter={filter} />
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Excluir tarefa?"
        message="Esta ação não pode ser desfeita. A tarefa será removida permanentemente."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <TaskDetailsModal
        task={activeTask}
        isOpen={!!activeTask}
        onClose={() => setActiveTask(null)}
        onSave={handleSaveTaskDetails}
      />
    </div>
  )
}
