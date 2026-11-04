import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import GovInput from './GovInput'
import GovButton from './GovButton'
import { senhaStepSchema } from '@/types/authSchemas'
import type { SenhaStepForm } from '@/types/authSchemas'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/useAuthStore'
import { homePorPerfil } from '@/utils/perfil'

interface Props { cpf: string; onCancel: () => void; onForgot: () => void }

export default function StepSenha({ cpf, onCancel, onForgot }: Props) {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [erro, setErro] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SenhaStepForm>({
    resolver: zodResolver(senhaStepSchema),
  })

  const onSubmit = async ({ senha }: SenhaStepForm) => {
    try {
      setErro('')
      const { token, usuario } = await authService.autenticar(cpf, senha)
      login(token, usuario)
      navigate(homePorPerfil(usuario.perfilAcesso), { replace: true })
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao autenticar')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-black">Digite sua senha</h1>
      <div>
        <p className="text-lg text-black">CPF</p>
        <p className="text-lg font-bold text-black">{cpf}</p>
      </div>
      <GovInput label="Senha" type="password" placeholder="Digite sua senha atual" autoFocus
        {...register('senha')} error={errors.senha?.message ?? (erro || undefined)} />
      <div className="flex justify-center gap-4">
        <GovButton variant="outline" onClick={onCancel}>Cancelar</GovButton>
        <GovButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Entrando...' : 'Entrar'}</GovButton>
      </div>
      <button type="button" onClick={onForgot} className="self-center text-lg text-brand-action underline">
        Esqueci minha senha
      </button>
    </form>
  )
}
