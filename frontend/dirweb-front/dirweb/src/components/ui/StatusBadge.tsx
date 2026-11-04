import { STATUS_LABEL } from '@/types'
import type { StatusDeclaracao } from '@/types'

const cores: Record<StatusDeclaracao, string> = {
  Enviada: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Processada: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Retida: 'bg-red-100 text-red-800 border-red-300',
}

export default function StatusBadge({ status }: { status: StatusDeclaracao }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full border px-3 py-0.5 text-xs font-bold ${cores[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}
