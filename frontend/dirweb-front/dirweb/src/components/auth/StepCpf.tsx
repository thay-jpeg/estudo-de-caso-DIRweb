import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Contact } from 'lucide-react'
import GovInput from './GovInput'
import GovButton from './GovButton'
import { cpfStepSchema } from '@/types/authSchemas'
import type { CpfStepForm } from '@/types/authSchemas'
import { authService } from '@/services/authService'
import { maskCPF } from '@/utils/masks'

interface Props { initialCpf: string; onResult: (cpf: string, existe: boolean) => void }

export default function StepCpf({ initialCpf, onResult }: Props) {
  const [erro, setErro] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CpfStepForm>({
    resolver: zodResolver(cpfStepSchema), defaultValues: { cpf: initialCpf },
  })

  const onSubmit = async ({ cpf }: CpfStepForm) => {
    try {
      setErro('')
      const { existe } = await authService.verificarCpf(cpf)
      onResult(cpf, existe) // existe → Step 2 (senha) | não existe → Cadastro
    } catch {
      setErro('Não foi possível verificar o CPF. Tente novamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-black">Identifique-se no gov.br com:</h1>
      <div className="flex items-center gap-3 text-lg text-black">
        <Contact className="h-6 w-6 text-brand-action" /> Número do CPF
      </div>
      <p className="text-[0.95rem] text-neutral-800">
        Digite seu CPF para <strong>criar</strong> ou <strong>acessar</strong> sua conta gov.br
      </p>
      <GovInput label="CPF" mask={maskCPF} placeholder="Digite seu CPF" inputMode="numeric" autoFocus
        {...register('cpf')} error={errors.cpf?.message} />
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <div className="flex justify-end">
        <GovButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Verificando...' : 'Continuar'}</GovButton>
      </div>
    </form>
  )
}
