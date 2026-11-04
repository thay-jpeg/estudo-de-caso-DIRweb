import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import DataGrid from '@/components/ui/DataGrid'
import type { Column } from '@/components/ui/DataGrid'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import PageHeader from '@/components/ui/PageHeader'
import { rendimentoSchema } from '@/types'
import type { Rendimento, RendimentoSchema } from '@/types'
import { declaracaoService } from '@/services/declaracaoService'
import { somar, useDeclaracaoStore } from '@/store/useDeclaracaoStore'
import { formatBRL, maskCNPJ } from '@/utils/masks'

export default function Rendimentos() {
  const { rendimentos, carregado, setRendimentos, showToast } = useDeclaracaoStore()
  const [aberto, setAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RendimentoSchema>({
    resolver: zodResolver(rendimentoSchema),
  })

  const fechar = () => { setAberto(false); reset() }

  const onSubmit = async (data: RendimentoSchema) => {
    try {
      setSalvando(true)
      const novo = await declaracaoService.registrarRendimento(data)
      setRendimentos([...rendimentos, novo])
      showToast('Rendimento adicionado com sucesso!')
      fechar()
    } catch {
      showToast('Erro ao salvar o rendimento.', 'error')
    } finally {
      setSalvando(false)
    }
  }

  const remover = async (id?: number) => {
    if (id === undefined || !window.confirm('Remover este rendimento?')) return
    await declaracaoService.removerRendimento(id)
    setRendimentos(rendimentos.filter((r) => r.idRendimentos !== id))
    showToast('Rendimento removido.')
  }

  const columns: Column<Rendimento>[] = [
    { header: 'CNPJ Empresa', render: (r) => r.CNPJ },
    { header: 'Nome Empresa', render: (r) => r.nomeEmpresa },
    { header: 'Valor Total Recebido', align: 'right', render: (r) => formatBRL(r.Valor_Total_Recebido) },
    { header: 'INSS', align: 'right', render: (r) => formatBRL(r.INSS) },
    { header: 'IRRF Pago', align: 'right', render: (r) => formatBRL(r.IRRF_pago) },
    { header: '13º Salário', align: 'right', render: (r) => formatBRL(r.valor13Salario) },
    {
      header: 'Ações', align: 'right',
      render: (r) => (
        <button type="button" aria-label="Remover" onClick={() => remover(r.idRendimentos)} className="rounded p-1.5 text-red-600 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Rendimentos Tributáveis Recebidos de Pessoa Jurídica"
        action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setAberto(true)}>Adicionar Rendimento</Button>}
      />

      <DataGrid
        columns={columns}
        rows={rendimentos}
        rowKey={(r) => r.idRendimentos ?? r.CNPJ}
        loading={!carregado}
        footer={`Total recebido: ${formatBRL(somar(rendimentos, (r) => r.Valor_Total_Recebido))}`}
      />

      <Modal open={aberto} title="Adicionar Rendimento" onClose={fechar}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="CNPJ da Empresa" mask={maskCNPJ} placeholder="00.000.000/0000-00" {...register('CNPJ')} error={errors.CNPJ?.message} />
          <Input label="Nome da Empresa" {...register('nomeEmpresa')} error={errors.nomeEmpresa?.message} />
          <Input className="sm:col-span-2" label="Valor Total Recebido (R$)" type="number" step="0.01" {...register('Valor_Total_Recebido')} error={errors.Valor_Total_Recebido?.message} />
          <Input label="INSS (R$)" type="number" step="0.01" {...register('INSS')} error={errors.INSS?.message} />
          <Input label="IRRF Pago (R$)" type="number" step="0.01" {...register('IRRF_pago')} error={errors.IRRF_pago?.message} />
          <Input className="sm:col-span-2" label="Valor 13º Salário (R$)" type="number" step="0.01" {...register('valor13Salario')} error={errors.valor13Salario?.message} />
          <div className="mt-2 flex justify-end gap-2 sm:col-span-2">
            <Button variant="ghost" onClick={fechar}>Cancelar</Button>
            <Button type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
