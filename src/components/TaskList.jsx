import TaskItem from './TaskItem'

export default function TaskList({ tasks, onToggle, onDelete, onClick }) {
  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onClick={onClick}
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  )
}
