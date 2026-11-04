import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserRound } from 'lucide-react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import PageHeader from '@/components/ui/PageHeader'
import { SEXOS, UFS, contribuinteSchema } from '@/types'
import type { ContribuinteSchema } from '@/types'
import { declaracaoService } from '@/services/declaracaoService'
import { useDeclaracaoStore } from '@/store/useDeclaracaoStore'
import { useAuthStore } from '@/store/useAuthStore'
import { maskCEP, maskCPF, maskTelefone } from '@/utils/masks'

export default function DadosContribuinte() {
  const contribuinte = useDeclaracaoStore((s) => s.contribuinte)
  const carregado = useDeclaracaoStore((s) => s.carregado)
  const setContribuinte = useDeclaracaoStore((s) => s.setContribuinte)
  const showToast = useDeclaracaoStore((s) => s.showToast)
  const [salvando, setSalvando] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContribuinteSchema>({
    resolver: zodResolver(contribuinteSchema),
  })

  const usuario = useAuthStore((s) => s.usuario)
  useEffect(() => {
    if (contribuinte) reset(contribuinte)
    else if (usuario) reset({ Nome: usuario.nome, Sobrenome: usuario.sobrenome, CPF: usuario.loginCpf })
  }, [contribuinte, usuario, reset])

  const onSubmit = async (data: ContribuinteSchema) => {
    try {
      setSalvando(true)
      const salvo = await declaracaoService.cadastrarContribuinte(data)
      setContribuinte(salvo)
      showToast('Dados do contribuinte salvos com sucesso!')
    } catch {
      showToast('Erro ao salvar os dados.', 'error')
    } finally {
      setSalvando(false)
    }
  }

  if (!carregado) return <p className="text-brand">Carregando...</p>

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <PageHeader title="Dados do Contribuinte" subtitle="Todos os campos, exceto o complemento, são obrigatórios." />

      <div className="flex gap-5">
        <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-brand text-white sm:flex">
          <UserRound className="h-14 w-14" fill="currentColor" />
        </div>
        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
          <Input label="Nome" {...register('Nome')} error={errors.Nome?.message} />
          <Input label="Sobrenome" {...register('Sobrenome')} error={errors.Sobrenome?.message} />
          <Input label="Nome Social" {...register('Nome_Social')} error={errors.Nome_Social?.message} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input label="CPF" mask={maskCPF} placeholder="000.000.000-00" {...register('CPF')} error={errors.CPF?.message} />
        <Input label="RG" {...register('RG')} error={errors.RG?.message} />
        <Select label="Sexo" options={SEXOS.map((v) => ({ value: v, label: v }))} {...register('Sexo')} error={errors.Sexo?.message} />
      </div>

      <h2 className="mb-3 mt-7 text-base font-bold text-brand">Endereço</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <Input className="md:col-span-2" label="CEP" mask={maskCEP} placeholder="00000-000" {...register('CEP')} error={errors.CEP?.message} />
        <Input className="md:col-span-3" label="Rua" {...register('Rua')} error={errors.Rua?.message} />
        <Input className="md:col-span-1" label="Número" {...register('Numero')} error={errors.Numero?.message} />
        <Input className="md:col-span-2" label="Complemento" {...register('Complemento')} error={errors.Complemento?.message} />
        <Input className="md:col-span-2" label="Bairro" {...register('Bairro')} error={errors.Bairro?.message} />
        <Input className="md:col-span-1" label="Cidade" {...register('Cidade')} error={errors.Cidade?.message} />
        <Select className="md:col-span-1" label="UF" placeholder="UF" options={UFS.map((v) => ({ value: v, label: v }))} {...register('UF')} error={errors.UF?.message} />
      </div>

      <h2 className="mb-3 mt-7 text-base font-bold text-brand">Contato</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="E-mail" type="email" {...register('Email')} error={errors.Email?.message} />
        <Input label="Telefone" mask={maskTelefone} placeholder="(00) 00000-0000" {...register('Telefone')} error={errors.Telefone?.message} />
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="submit" disabled={salvando} className="px-8">{salvando ? 'Salvando...' : 'Salvar dados'}</Button>
      </div>
    </form>
  )
}
