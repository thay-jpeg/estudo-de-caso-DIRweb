import { AlertTriangle, Send } from 'lucide-react'
import Button from '@/components/ui/Button'
import PageHeader from '@/components/ui/PageHeader'
import { somar, useDeclaracaoStore, validarDeclaracao } from '@/store/useDeclaracaoStore'
import { useEnviarDeclaracao } from '@/hooks'
import { formatBRL } from '@/utils/masks'

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl bg-brand-soft p-5 text-brand">
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs opacity-70">{hint}</p>}
    </div>
  )
}

export default function Resumo() {
  const s = useDeclaracaoStore()
  const { enviar, enviando } = useEnviarDeclaracao()

  if (!s.carregado) return <p className="text-brand">Carregando...</p>

  const totalRend = somar(s.rendimentos, (r) => r.Valor_Total_Recebido)
  const total13 = somar(s.rendimentos, (r) => r.valor13Salario)
  const totalInss = somar(s.rendimentos, (r) => r.INSS)
  const totalIrrf = somar(s.rendimentos, (r) => r.IRRF_pago)
  const bensAnt = somar(s.bens, (b) => b.Valor_ano_anterior)
  const bensAtual = somar(s.bens, (b) => b.Valor_31_12_2026)
  const evolucao = bensAtual - bensAnt
  const evolucaoPct = bensAnt > 0 ? (evolucao / bensAnt) * 100 : 0
  const pendencias = validarDeclaracao(s)

  return (
    <div>
      <PageHeader title="Resumo da Declaração" subtitle="Confira os dados antes de enviar." />

      {s.enviada && (
        <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          Declaração enviada com sucesso.
        </p>
      )}
      {pendencias.length > 0 && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p className="mb-1 flex items-center gap-2 font-bold"><AlertTriangle className="h-4 w-4" /> Pendências</p>
          <ul className="list-disc pl-6">{pendencias.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Stat label="Contribuinte" value={s.contribuinte ? `${s.contribuinte.Nome} ${s.contribuinte.Sobrenome}` : '—'} hint={s.contribuinte ? `CPF ${s.contribuinte.CPF}` : undefined} />
        <Stat label="Dependentes" value={String(s.dependentes.length)} hint={s.semDependentes ? 'Declarado: sem dependentes' : undefined} />
        <Stat label="Empresas pagadoras" value={String(s.rendimentos.length)} />
        <Stat label="Total de Rendimentos" value={formatBRL(totalRend)} hint={`13º salário: ${formatBRL(total13)}`} />
        <Stat label="INSS retido" value={formatBRL(totalInss)} />
        <Stat label="IRRF pago" value={formatBRL(totalIrrf)} />
        <Stat label="Bens em 31/12/2025" value={formatBRL(bensAnt)} hint="Valor do ano anterior" />
        <Stat label="Bens em 31/12/2026" value={formatBRL(bensAtual)} />
        <Stat
          label="Evolução Patrimonial"
          value={`${evolucao >= 0 ? '+' : ''}${formatBRL(evolucao)}`}
          hint={`${evolucaoPct >= 0 ? '+' : ''}${evolucaoPct.toFixed(1)}% em relação ao ano anterior`}
        />
      </div>

      <Button
        variant="action"
        disabled={enviando}
        icon={<Send className="h-5 w-5" fill="currentColor" />}
        className="mt-8 w-full rounded-xl py-4 text-base"
        onClick={enviar}
      >
        {enviando ? 'ENVIANDO...' : 'ENVIAR DECLARAÇÃO'}
      </Button>
    </div>
  )
}
