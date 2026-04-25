const VARIANTS = {
  trabalho: 'bg-cat-trabalho/15 text-cat-trabalho border-cat-trabalho/30',
  pessoal: 'bg-cat-pessoal/15 text-cat-pessoal border-cat-pessoal/30',
  estudos: 'bg-cat-estudos/15 text-cat-estudos border-cat-estudos/30',
  alta: 'bg-pri-alta/15 text-pri-alta border-pri-alta/30',
  media: 'bg-pri-media/15 text-pri-media border-pri-media/30',
  baixa: 'bg-pri-baixa/15 text-pri-baixa border-pri-baixa/30',
}

const LABELS = {
  trabalho: 'TRABALHO',
  pessoal: 'PESSOAL',
  estudos: 'ESTUDOS',
  alta: 'ALTA',
  media: 'MÉDIA',
  baixa: 'BAIXA',
}

export default function Badge({ variant }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${VARIANTS[variant] || ''}`}
    >
      {LABELS[variant] || variant}
    </span>
  )
}
