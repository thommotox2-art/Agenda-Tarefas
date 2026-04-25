import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Mapear campos snake_case para camelCase
      const formattedData = data.map(t => ({
        ...t,
        dueDate: t.due_date,
        createdAt: t.created_at
      }))
      
      setTasks(formattedData || [])
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = async (taskData) => {
    try {
      const newTask = {
        title: taskData.title,
        category: taskData.category,
        priority: taskData.priority,
        due_date: taskData.dueDate || null,
        completed: false,
        notes: '',
        subtasks: []
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single()

      if (error) throw error

      const formattedTask = {
        ...data,
        dueDate: data.due_date,
        createdAt: data.created_at
      }

      setTasks(prev => [formattedTask, ...prev])
      return formattedTask
    } catch (err) {
      console.error('Error adding task:', err)
      throw err
    }
  }

  const toggleTask = async (id) => {
    const taskToToggle = tasks.find(t => t.id === id)
    if (!taskToToggle) return

    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !taskToToggle.completed })
        .eq('id', id)

      if (error) {
        // Revert on error
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: taskToToggle.completed } : t))
        throw error
      }
    } catch (err) {
      console.error('Error toggling task:', err)
    }
  }

  const deleteTask = async (id) => {
    // Optimistic update
    const previousTasks = [...tasks]
    setTasks(prev => prev.filter(t => t.id !== id))

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) {
        setTasks(previousTasks)
        throw error
      }
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  const updateTask = async (id, updates) => {
    // Optimistic update
    const taskIndex = tasks.findIndex(t => t.id === id)
    if (taskIndex === -1) return
    const previousTask = tasks[taskIndex]

    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))

    try {
      // Mapear camelCase para snake_case se necessário
      const dbUpdates = { ...updates }
      if (dbUpdates.dueDate !== undefined) {
        dbUpdates.due_date = dbUpdates.dueDate
        delete dbUpdates.dueDate
      }

      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id)

      if (error) {
        setTasks(prev => prev.map(t => t.id === id ? previousTask : t))
        throw error
      }
    } catch (err) {
      console.error('Error updating task:', err)
    }
  }

  return { tasks, isLoading, error, addTask, toggleTask, deleteTask, updateTask, fetchTasks }
}
