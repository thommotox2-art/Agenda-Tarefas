const FILTERS = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendentes', label: 'Pendentes' },
  { key: 'concluidas', label: 'Concluídas' },
]

export default function FilterBar({ activeFilter, onFilterChange, counts }) {
  return (
    <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm ${
            activeFilter === key
              ? 'bg-accent text-bg-base shadow-md'
              : 'bg-bg-surface text-text-secondary border border-border hover:bg-bg-hover hover:text-text-primary'
          }`}
        >
          {label}
          {counts[key] !== undefined && (
            <span
              className={`ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full text-[10px] font-semibold sm:ml-2 sm:text-xs ${
                activeFilter === key
                  ? 'bg-bg-base/20 text-bg-base'
                  : 'bg-bg-elevated text-text-secondary'
              }`}
            >
              {counts[key]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
