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
import { dependenteSchema } from '@/types'
import type { Dependente, DependenteSchema } from '@/types'
import { declaracaoService } from '@/services/declaracaoService'
import { useDeclaracaoStore } from '@/store/useDeclaracaoStore'
import { maskCPF } from '@/utils/masks'

export default function Dependentes() {
  const { dependentes, tiposDependente, semDependentes, carregado, setDependentes, setSemDependentes, showToast } =
    useDeclaracaoStore()
  const [aberto, setAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DependenteSchema>({
    resolver: zodResolver(dependenteSchema),
  })

  const fechar = () => { setAberto(false); reset({ Nome: '', CPF: '' }) }

  const onSubmit = async (data: DependenteSchema) => {
    try {
      setSalvando(true)
      const tipo = tiposDependente.find((t) => t.idTipo_dependente === data.Tipo_dependente_idTipo_dependente)
      const novo = await declaracaoService.cadastrarDependente({ ...data, Tipo_dependente: tipo?.Tipo_dependente })
      setDependentes([...dependentes, novo])
      setSemDependentes(false)
      showToast('Dependente adicionado com sucesso!')
      fechar()
    } catch {
      showToast('Erro ao salvar o dependente.', 'error')
    } finally {
      setSalvando(false)
    }
  }

  const remover = async (id?: number) => {
    if (id === undefined || !window.confirm('Remover este dependente?')) return
    await declaracaoService.removerDependente(id)
    setDependentes(dependentes.filter((d) => d.idDependente !== id))
    showToast('Dependente removido.')
  }

  const columns: Column<Dependente>[] = [
    { header: 'Nome', render: (d) => d.Nome },
    { header: 'CPF', render: (d) => d.CPF },
    { header: 'Tipo de Dependência', render: (d) => d.Tipo_dependente },
    {
      header: 'Ações', align: 'right',
      render: (d) => (
        <button type="button" aria-label="Remover" onClick={() => remover(d.idDependente)} className="rounded p-1.5 text-red-600 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Dependentes"
        subtitle="O contribuinte pode não ter ou ter vários dependentes."
        action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setAberto(true)}>Adicionar Dependente</Button>}
      />

      <DataGrid columns={columns} rows={dependentes} rowKey={(d) => d.idDependente ?? d.CPF} loading={!carregado} />

      <label className={`mt-4 flex items-center gap-2 text-sm text-brand ${dependentes.length ? 'opacity-50' : ''}`}>
        <input
          type="checkbox"
          checked={semDependentes}
          disabled={dependentes.length > 0}
          onChange={(e) => setSemDependentes(e.target.checked)}
          className="h-4 w-4 accent-[#1a3f86]"
        />
        Não possuo dependentes
      </label>

      <Modal open={aberto} title="Adicionar Dependente" onClose={fechar}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Input label="Nome" {...register('Nome')} error={errors.Nome?.message} />
          <Input label="CPF" mask={maskCPF} placeholder="000.000.000-00" {...register('CPF')} error={errors.CPF?.message} />
          <Select
            label="Tipo de Dependência"
            options={tiposDependente.map((t) => ({ value: t.idTipo_dependente, label: t.Tipo_dependente }))}
            {...register('Tipo_dependente_idTipo_dependente')}
            error={errors.Tipo_dependente_idTipo_dependente?.message}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={fechar}>Cancelar</Button>
            <Button type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
