import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import GovInput from './GovInput'
import GovButton from './GovButton'
import { cadastroSchema } from '@/types/authSchemas'
import type { CadastroForm } from '@/types/authSchemas'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/useAuthStore'
import { useDeclaracaoStore } from '@/store/useDeclaracaoStore'

interface Props { cpf: string; onCancel: () => void }

export default function StepCadastro({ cpf, onCancel }: Props) {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const showToast = useDeclaracaoStore((s) => s.showToast)
  const [erro, setErro] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CadastroForm>({
    resolver: zodResolver(cadastroSchema), defaultValues: { cpf },
  })

  const onSubmit = async (d: CadastroForm) => {
    try {
      setErro('')
      const { token, usuario } = await authService.cadastrarContribuinte({ ...d, cpf })
      login(token, usuario)
      showToast('Cadastro realizado com sucesso!')
      navigate('/home', { replace: true })
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao cadastrar')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-black">Cadastro de novo contribuinte</h1>
      <p className="text-[0.95rem] text-neutral-800">Não encontramos uma conta para este CPF. Preencha os dados para criá-la.</p>
      <GovInput label="Nome Completo" placeholder="Digite seu nome completo" autoFocus {...register('nome')} error={errors.nome?.message} />
      <GovInput label="CPF" readOnly tabIndex={-1} {...register('cpf')} error={errors.cpf?.message} />
      <GovInput label="Senha de Acesso" type="password" placeholder="Mínimo de 8 caracteres" {...register('senha')} error={errors.senha?.message} />
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <div className="flex justify-center gap-4">
        <GovButton variant="outline" onClick={onCancel}>Cancelar</GovButton>
        <GovButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Cadastrando...' : 'Cadastrar'}</GovButton>
      </div>
    </form>
  )
}
