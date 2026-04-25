import { ClipboardList } from 'lucide-react'

export default function EmptyState({ filter }) {
  const messages = {
    todas: {
      title: 'Nenhuma tarefa ainda',
      description: 'Crie sua primeira tarefa usando o formulário acima.',
    },
    pendentes: {
      title: 'Nenhuma tarefa pendente',
      description: 'Todas as suas tarefas estão concluídas. Bom trabalho! 🎉',
    },
    concluidas: {
      title: 'Nenhuma tarefa concluída',
      description: 'Marque uma tarefa como concluída para vê-la aqui.',
    },
  }

  const { title, description } = messages[filter] || messages.todas

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-elevated">
        <ClipboardList size={28} className="text-text-muted" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary">{description}</p>
    </div>
  )
}
