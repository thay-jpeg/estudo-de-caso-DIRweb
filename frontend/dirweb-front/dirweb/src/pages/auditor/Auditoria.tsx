import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Check, ShieldAlert } from 'lucide-react'
import Button from '@/components/ui/Button'
import DataGrid from '@/components/ui/DataGrid'
import type { Column } from '@/components/ui/DataGrid'
import Modal from '@/components/ui/Modal'
import StatusBadge from '@/components/ui/StatusBadge'
import Tabs from '@/components/ui/Tabs'
import { auditoriaService } from '@/services/auditoriaService'
import { useDeclaracaoStore } from '@/store/useDeclaracaoStore'
import type { Bem, Dependente, DeclaracaoAuditoria, Rendimento } from '@/types'
import { patrimonioIncompativel, totais } from '@/utils/auditoria'
import { formatBRL } from '@/utils/masks'

type Aba = 'dados' | 'rendimentos' | 'bens'
const abas: { id: Aba; label: string }[] = [
  { id: 'dados', label: 'Dados e Dependentes' },
  { id: 'rendimentos', label: 'Rendimentos' },
  { id: 'bens', label: 'Bens e Direitos' },
]

const retencaoSchema = z.object({ justificativa: z.string().trim().min(10, 'Descreva a justificativa (mínimo de 10 caracteres)') })
type RetencaoForm = z.infer<typeof retencaoSchema>

function ResumoCard({ label, value, alerta }: { label: string; value: string; alerta?: boolean }) {
  return (
    <div className="relative rounded-xl bg-brand-soft p-5 text-brand">
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {alerta && (
        <span tabIndex={0} aria-label="Risco de Inconsistência Patrimonial detectado" className="group absolute right-4 top-4 outline-none">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <span role="tooltip" className="pointer-events-none absolute right-0 top-8 z-20 hidden w-56 rounded-lg bg-red-700 px-3 py-2 text-xs font-medium text-white shadow-lg group-hover:block group-focus:block">
            ⚠️ Risco de Inconsistência Patrimonial detectado
          </span>
        </span>
      )}
    </div>
  )
}

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-brand/70">{label}</p>
      <p className="text-sm font-bold text-brand">{value || '—'}</p>
    </div>
  )
}

export default function Auditoria() {
  const { id } = useParams()
  const navigate = useNavigate()
  const showToast = useDeclaracaoStore((s) => s.showToast)
  const [decl, setDecl] = useState<DeclaracaoAuditoria | null>(null)
  const [naoEncontrada, setNaoEncontrada] = useState(false)
  const [aba, setAba] = useState<Aba>('dados')
  const [modal, setModal] = useState(false)
  const [agindo, setAgindo] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RetencaoForm>({ resolver: zodResolver(retencaoSchema) })

  useEffect(() => {
    auditoriaService.obterDeclaracao(Number(id)).then(setDecl).catch(() => setNaoEncontrada(true))
  }, [id])

  if (naoEncontrada) return <p className="text-brand">Declaração não encontrada. <button className="underline" onClick={() => navigate('/auditor')}>Voltar</button></p>
  if (!decl) return <p className="text-brand">Carregando...</p>

  const t = totais(decl)
  const alerta = patrimonioIncompativel(t.totalBens, t.totalRendimentos)
  const c = decl.contribuinte

  const aprovar = async () => {
    try { setAgindo(true); setDecl(await auditoriaService.aprovarDeclaracao(decl.idDeclaracao)); showToast('Declaração aprovada e marcada como Processada.') }
    catch { showToast('Erro ao aprovar a declaração.', 'error') } finally { setAgindo(false) }
  }
  const reter = async ({ justificativa }: RetencaoForm) => {
    try {
      setAgindo(true)
      setDecl(await auditoriaService.reterEmMalhaFina(decl.idDeclaracao, justificativa))
      showToast('Declaração retida em malha fina.')
      setModal(false); reset()
    } catch { showToast('Erro ao reter a declaração.', 'error') } finally { setAgindo(false) }
  }

  const colsDep: Column<Dependente>[] = [
    { header: 'Nome', render: (d) => d.Nome },
    { header: 'CPF', render: (d) => d.CPF },
    { header: 'Tipo de Dependência', render: (d) => d.Tipo_dependente },
  ]
  const colsRend: Column<Rendimento>[] = [
    { header: 'CNPJ Empresa', render: (r) => r.CNPJ },
    { header: 'Fonte Pagadora', render: (r) => r.nomeEmpresa },
    { header: 'Valor Total Recebido', align: 'right', render: (r) => formatBRL(r.Valor_Total_Recebido) },
    { header: 'INSS', align: 'right', render: (r) => formatBRL(r.INSS) },
    { header: 'IRRF Pago', align: 'right', render: (r) => formatBRL(r.IRRF_pago) },
    { header: '13º Salário', align: 'right', render: (r) => formatBRL(r.valor13Salario) },
  ]
  const colsBens: Column<Bem>[] = [
    { header: 'Tipo', render: (b) => b.Tipo_Bem },
    { header: 'Bem', render: (b) => b.Nome_bem },
    { header: 'Valor Anterior', align: 'right', render: (b) => formatBRL(b.Valor_ano_anterior) },
    { header: 'Valor Atual (31/12/2026)', align: 'right', render: (b) => formatBRL(b.Valor_31_12_2026) },
    {
      header: 'Variação', align: 'right',
      render: (b) => {
        const v = b.Valor_31_12_2026 - b.Valor_ano_anterior
        return <span className={v >= 0 ? 'text-emerald-700' : 'text-red-600'}>{v >= 0 ? '+' : ''}{formatBRL(v)}</span>
      },
    },
  ]

  return (
    <div className="flex min-h-full flex-col">
      <button type="button" onClick={() => navigate('/auditor')} className="mb-3 flex items-center gap-1.5 self-start text-sm font-bold text-brand hover:underline">
        <ArrowLeft className="h-4 w-4" /> Voltar para a triagem
      </button>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-brand">{c.nome} {c.sobrenome}</h1>
          <p className="text-sm text-brand/70">CPF {c.cpf} · Declaração #{decl.idDeclaracao} · Exercício {decl.anoExercicio}</p>
        </div>
        <StatusBadge status={decl.status} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ResumoCard label="Total de Rendimentos" value={formatBRL(t.totalRendimentos)} />
        <ResumoCard label="Total de Bens" value={formatBRL(t.totalBens)} alerta={alerta} />
        <ResumoCard label="Total de Imposto Pago" value={formatBRL(t.totalImposto)} />
      </div>

      <div className="mt-6 flex-1">
        <Tabs tabs={abas} active={aba} onChange={setAba} />
        <div className="pt-4">
          {aba === 'dados' && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-4 rounded-xl bg-brand-soft p-5 sm:grid-cols-2 lg:grid-cols-3">
                <Campo label="Nome" value={c.nome} />
                <Campo label="Sobrenome" value={c.sobrenome} />
                <Campo label="Nome Social" value={c.nomeSocial} />
                <Campo label="CPF" value={c.cpf} />
                <Campo label="RG" value={c.rg} />
                <Campo label="Sexo" value={c.sexo} />
                <Campo label="E-mail" value={c.email} />
                <Campo label="Telefone" value={c.telefone} />
                <div className="sm:col-span-2 lg:col-span-3"><Campo label="Endereço" value={c.endereco} /></div>
              </div>
              <div>
                <h2 className="mb-2 text-base font-bold text-brand">Dependentes ({decl.dependentes.length})</h2>
                <DataGrid columns={colsDep} rows={decl.dependentes} rowKey={(d) => d.idDependente ?? d.CPF} emptyMessage="Sem dependentes." />
              </div>
            </div>
          )}

          {aba === 'rendimentos' && (
            <DataGrid columns={colsRend} rows={decl.rendimentos} rowKey={(r) => r.idRendimentos ?? r.CNPJ}
              footer={`Total recebido: ${formatBRL(t.totalRendimentos)} · IRRF: ${formatBRL(t.totalImposto)}`} />
          )}

          {aba === 'bens' && (
            <div className="flex flex-col gap-3">
              {alerta && (
                <div className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span><strong>Risco de Inconsistência Patrimonial detectado:</strong> os bens ({formatBRL(t.totalBens)}) superam o dobro dos rendimentos anuais ({formatBRL(t.totalRendimentos)}).</span>
                </div>
              )}
              <DataGrid columns={colsBens} rows={decl.bens} rowKey={(b) => b.idBens_direitos ?? b.Nome_bem}
                footer={`Anterior: ${formatBRL(t.totalBensAnterior)} → Atual: ${formatBRL(t.totalBens)}`} />
            </div>
          )}

          {decl.status === 'Retida' && decl.justificativaRetencao && (
            <div className="mt-5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
              <p className="mb-1 flex items-center gap-2 font-bold"><ShieldAlert className="h-4 w-4" /> Justificativa da retenção</p>
              {decl.justificativaRetencao}
            </div>
          )}
        </div>
      </div>

      {/* Rodapé fixo com as ações do auditor */}
      <div className="sticky bottom-0 -mx-1 mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-brand/20 bg-white px-1 py-3 shadow-[0_-6px_12px_rgba(26,63,134,.06)]">
        <button type="button" disabled={agindo || decl.status === 'Retida'} onClick={() => setModal(true)}
          className="rounded-lg border-2 border-red-600 px-5 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
          Reter em Malha Fina
        </button>
        <Button disabled={agindo || decl.status === 'Processada'} onClick={aprovar} icon={<Check className="h-4 w-4" />}
          className="!bg-emerald-600 px-5 hover:!brightness-110">
          Aprovar Declaração
        </Button>
      </div>

      <Modal open={modal} title="Reter em Malha Fina" onClose={() => { setModal(false); reset() }}>
        <form onSubmit={handleSubmit(reter)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="justificativa" className="text-sm font-medium text-brand">Justificativa da Retenção</label>
            <textarea id="justificativa" rows={4} {...register('justificativa')} aria-invalid={!!errors.justificativa}
              className={`rounded-lg border bg-neutral-100 px-3 py-2 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-brand/30 ${errors.justificativa ? 'border-red-500' : 'border-brand/50'}`} />
            {errors.justificativa && <span className="text-xs text-red-600">{errors.justificativa.message}</span>}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setModal(false); reset() }}>Cancelar</Button>
            <Button type="submit" disabled={agindo} className="!bg-red-600">{agindo ? 'Confirmando...' : 'Confirmar retenção'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
