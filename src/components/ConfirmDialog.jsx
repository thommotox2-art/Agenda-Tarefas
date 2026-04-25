import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative w-full animate-scale-in rounded-t-2xl border-t border-border bg-bg-surface p-5 shadow-lg sm:max-w-sm sm:rounded-2xl sm:border sm:p-6">
        <button onClick={onCancel} className="absolute right-3 top-3 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-bg-hover hover:text-text-primary sm:right-4 sm:top-4" aria-label="Fechar">
          <X size={16} />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 sm:h-12 sm:w-12">
          <AlertTriangle size={20} className="text-danger sm:hidden" />
          <AlertTriangle size={24} className="text-danger hidden sm:block" />
        </div>

        <h3 className="mt-3 text-base font-semibold text-text-primary sm:mt-4 sm:text-lg">{title}</h3>
        <p className="mt-1.5 text-xs text-text-secondary sm:mt-2 sm:text-sm">{message}</p>

        <div className="mt-5 flex items-center gap-3 sm:mt-6 sm:justify-end">
          <button onClick={onCancel} className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary sm:flex-none sm:py-2">
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-lg bg-danger px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:brightness-110 sm:flex-none sm:py-2">
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}
