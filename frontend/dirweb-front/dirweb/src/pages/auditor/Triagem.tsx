import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataGrid from '@/components/ui/DataGrid'
import type { Column } from '@/components/ui/DataGrid'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import { auditoriaService } from '@/services/auditoriaService'
import { useDeclaracaoStore } from '@/store/useDeclaracaoStore'
import type { DeclaracaoAuditoria, StatusDeclaracao } from '@/types'

type Filtro = 'Todas' | StatusDeclaracao
const filtros: { id: Filtro; label: string }[] = [
  { id: 'Todas', label: 'Todas' },
  { id: 'Enviada', label: 'Enviadas' },
  { id: 'Processada', label: 'Processadas' },
  { id: 'Retida', label: 'Retidas em Malha Fina' },
]

export default function Triagem() {
  const navigate = useNavigate()
  const showToast = useDeclaracaoStore((s) => s.showToast)
  const [declaracoes, setDeclaracoes] = useState<DeclaracaoAuditoria[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtro, setFiltro] = useState<Filtro>('Todas')

  useEffect(() => {
    auditoriaService.listarDeclaracoes().then(setDeclaracoes)
      .catch(() => showToast('Erro ao carregar as declarações.', 'error'))
      .finally(() => setCarregando(false))
  }, [showToast])

  const visiveis = filtro === 'Todas' ? declaracoes : declaracoes.filter((d) => d.status === filtro)
  const conta = (f: Filtro) => (f === 'Todas' ? declaracoes.length : declaracoes.filter((d) => d.status === f).length)

  const columns: Column<DeclaracaoAuditoria>[] = [
    { header: 'CPF do Contribuinte', render: (d) => d.contribuinte.cpf },
    { header: 'Nome Completo', render: (d) => `${d.contribuinte.nome} ${d.contribuinte.sobrenome}` },
    { header: 'Ano Exercício', render: (d) => d.anoExercicio },
    { header: 'Status', render: (d) => <StatusBadge status={d.status} /> },
  ]

  return (
    <div>
      <PageHeader title="Triagem de Declarações" subtitle="Clique em uma declaração para auditá-la." />

      <div className="mb-4 flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button key={f.id} type="button" onClick={() => setFiltro(f.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition-colors ${
              filtro === f.id ? 'border-brand bg-brand text-white' : 'border-brand/30 bg-brand-soft text-brand hover:bg-brand-card'
            }`}>
            {f.label} <span className="ml-1 opacity-70">({conta(f.id)})</span>
          </button>
        ))}
      </div>

      <DataGrid
        columns={columns}
        rows={visiveis}
        rowKey={(d) => d.idDeclaracao}
        loading={carregando}
        emptyMessage="Nenhuma declaração encontrada para este filtro."
        onRowClick={(d) => navigate(`/auditor/declaracoes/${d.idDeclaracao}`)}
      />
    </div>
  )
}
