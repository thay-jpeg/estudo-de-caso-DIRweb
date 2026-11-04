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
import Select from '@/components/ui/Select'
import { bemSchema } from '@/types'
import type { Bem, BemSchema } from '@/types'
import { declaracaoService } from '@/services/declaracaoService'
import { somar, useDeclaracaoStore } from '@/store/useDeclaracaoStore'
import { formatBRL } from '@/utils/masks'

export default function BensDireitos() {
  const { bens, tiposBem, carregado, setBens, showToast } = useDeclaracaoStore()
  const [aberto, setAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<BemSchema>({
    resolver: zodResolver(bemSchema),
  })

  const totalAtual = somar(bens, (b) => b.Valor_31_12_2026)
  const fechar = () => { setAberto(false); reset() }

  const onSubmit = async (data: BemSchema) => {
    // Regra: a soma total dos bens (31/12/2026) deve ser > R$ 100,00
    if (totalAtual + data.Valor_31_12_2026 <= 100) {
      setError('Valor_31_12_2026', { message: 'A soma total dos bens deve ser maior que R$ 100,00' })
      return
    }
    try {
      setSalvando(true)
      const tipo = tiposBem.find((t) => t.idTipo_Bem === data.Tipo_Bem_idTipo_Bem)
      const novo = await declaracaoService.registrarBem({ ...data, Tipo_Bem: tipo?.descricao_tipo })
      setBens([...bens, novo])
      showToast('Bem adicionado com sucesso!')
      fechar()
    } catch {
      showToast('Erro ao salvar o bem.', 'error')
    } finally {
      setSalvando(false)
    }
  }

  const remover = async (id?: number) => {
    if (id === undefined || !window.confirm('Remover este bem?')) return
    await declaracaoService.removerBem(id)
    setBens(bens.filter((b) => b.idBens_direitos !== id))
    showToast('Bem removido.')
  }

  const columns: Column<Bem>[] = [
    { header: 'Tipo de Bem', render: (b) => b.Tipo_Bem },
    { header: 'Nome do Bem', render: (b) => b.Nome_bem },
    { header: 'Valor ano anterior', align: 'right', render: (b) => formatBRL(b.Valor_ano_anterior) },
    { header: 'Valor em 31/12/2026', align: 'right', render: (b) => formatBRL(b.Valor_31_12_2026) },
    {
      header: 'Ações', align: 'right',
      render: (b) => (
        <button type="button" aria-label="Remover" onClick={() => remover(b.idBens_direitos)} className="rounded p-1.5 text-red-600 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Bens e Direitos"
        action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setAberto(true)}>Adicionar Bem</Button>}
      />

      <DataGrid
        columns={columns}
        rows={bens}
        rowKey={(b) => b.idBens_direitos ?? b.Nome_bem}
        loading={!carregado}
        footer={`Total em 31/12/2026: ${formatBRL(totalAtual)}`}
      />

      <Modal open={aberto} title="Adicionar Bem" onClose={fechar}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Tipo de Bem"
            options={tiposBem.map((t) => ({ value: t.idTipo_Bem, label: t.descricao_tipo }))}
            {...register('Tipo_Bem_idTipo_Bem')}
            error={errors.Tipo_Bem_idTipo_Bem?.message}
          />
          <Input label="Nome do Bem" {...register('Nome_bem')} error={errors.Nome_bem?.message} />
          <Input label="Valor ano anterior (R$)" type="number" step="0.01" {...register('Valor_ano_anterior')} error={errors.Valor_ano_anterior?.message} />
          <Input label="Valor em 31/12/2026 (R$)" type="number" step="0.01" {...register('Valor_31_12_2026')} error={errors.Valor_31_12_2026?.message} />
          <div className="mt-2 flex justify-end gap-2 sm:col-span-2">
            <Button variant="ghost" onClick={fechar}>Cancelar</Button>
            <Button type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
