import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import GovInput from './GovInput'
import GovButton from './GovButton'
import { codigoSchema, novaSenhaSchema } from '@/types/authSchemas'
import type { CodigoForm, NovaSenhaForm } from '@/types/authSchemas'
import { CODIGO_MOCK, authService } from '@/services/authService'
import { useDeclaracaoStore } from '@/store/useDeclaracaoStore'
import { maskCodigo } from '@/utils/masks'

interface Props { cpf: string; onCancel: () => void; onDone: () => void }

/** Tela C — mesmo container da senha: (1) código de 6 dígitos enviado por e-mail, (2) nova senha. */
export default function StepRecuperacao({ cpf, onCancel, onDone }: Props) {
  const [fase, setFase] = useState<'codigo' | 'nova'>('codigo')
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const showToast = useDeclaracaoStore((s) => s.showToast)

  const codigoForm = useForm<CodigoForm>({ resolver: zodResolver(codigoSchema) })
  const novaForm = useForm<NovaSenhaForm>({ resolver: zodResolver(novaSenhaSchema) })

  useEffect(() => {
    let ativo = true
    authService.solicitarCodigo(cpf).then((r) => {
      if (!ativo) return
      setEmail(r.emailMascarado)
      showToast(`Código enviado (simulação): ${CODIGO_MOCK}`)
    }).catch((e: Error) => ativo && setErro(e.message))
    return () => { ativo = false }
  }, [cpf, showToast])

  const confirmarCodigo = async ({ codigo }: CodigoForm) => {
    try { setErro(''); await authService.confirmarCodigo(cpf, codigo); setFase('nova') }
    catch (e) { setErro(e instanceof Error ? e.message : 'Erro') }
  }
  const redefinir = async ({ nova }: NovaSenhaForm) => {
    try {
      setErro('')
      await authService.redefinirSenha(cpf, nova)
      showToast('Senha alterada com sucesso! Entre com a nova senha.')
      onDone() // volta à Tela A para testar o login
    } catch (e) { setErro(e instanceof Error ? e.message : 'Erro') }
  }

  if (fase === 'codigo') {
    const f = codigoForm
    return (
      <form key="fase-codigo" onSubmit={f.handleSubmit(confirmarCodigo)} noValidate className="flex flex-col gap-5">
        <h1 className="text-xl font-bold text-black">Recuperar senha</h1>
        <p className="text-[0.95rem] text-neutral-800">
          Enviamos um código de <strong>6 dígitos</strong> para o e-mail cadastrado{email && <> (<strong>{email}</strong>)</>}.
          Digite-o abaixo para continuar.
        </p>
        <GovInput label="Código" mask={maskCodigo} inputMode="numeric" placeholder="000000" autoFocus
          {...f.register('codigo')} error={f.formState.errors.codigo?.message ?? (erro || undefined)} />
        <div className="flex justify-center gap-4">
          <GovButton variant="outline" onClick={onCancel}>Cancelar</GovButton>
          <GovButton type="submit" disabled={f.formState.isSubmitting}>Confirmar</GovButton>
        </div>
      </form>
    )
  }

  const f = novaForm
  return (
    <form key="fase-nova" onSubmit={f.handleSubmit(redefinir)} noValidate className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-black">Crie uma nova senha</h1>
      <GovInput label="Nova Senha" type="password" placeholder="Digite a nova senha" autoFocus
        {...f.register('nova')} error={f.formState.errors.nova?.message} />
      <GovInput label="Confirmar Nova Senha" type="password" placeholder="Repita a nova senha"
        {...f.register('confirmar')} error={f.formState.errors.confirmar?.message ?? (erro || undefined)} />
      <div className="flex justify-center">
        <GovButton type="submit" disabled={f.formState.isSubmitting}>Confirmar</GovButton>
      </div>
    </form>
  )
}
