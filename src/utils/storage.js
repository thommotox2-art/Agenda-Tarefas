const STORAGE_KEY = 'taskflow_tasks'

export function getTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function createTask({ title, category, priority, dueDate }) {
  return {
    id: crypto.randomUUID(),
    title,
    category,
    priority,
    dueDate,
    completed: false,
    notes: '',
    subtasks: [],
    createdAt: new Date().toISOString(),
  }
}

export function getScratchpad() {
  try {
    return localStorage.getItem('taskflow_scratchpad') || ''
  } catch {
    return ''
  }
}

export function saveScratchpad(text) {
  localStorage.setItem('taskflow_scratchpad', text)
}
