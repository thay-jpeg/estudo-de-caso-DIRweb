import { useState } from 'react'
import { Search } from 'lucide-react'
import Button from '@/components/ui/Button'
import PageHeader from '@/components/ui/PageHeader'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/useAuthStore'
import { useDeclaracaoStore } from '@/store/useDeclaracaoStore'
import type { SessaoUsuario } from '@/types'
import { maskCPF } from '@/utils/masks'

export default function GestaoAcessos() {
  const meuCpf = useAuthStore((s) => s.usuario?.loginCpf)
  const showToast = useDeclaracaoStore((s) => s.showToast)
  const [cpf, setCpf] = useState('')
  const [encontrado, setEncontrado] = useState<SessaoUsuario | null>(null)
  const [erro, setErro] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [salvando, setSalvando] = useState(false)

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(''); setEncontrado(null)
    if (cpf.replace(/\D/g, '').length !== 11) { setErro('Informe os 11 dígitos do CPF'); return }
    try { setBuscando(true); setEncontrado(await authService.buscarUsuarioPorCpf(cpf)) }
    catch (err) { setErro(err instanceof Error ? err.message : 'Erro na busca') }
    finally { setBuscando(false) }
  }

  const alternar = async () => {
    if (!encontrado) return
    const novo = encontrado.perfilAcesso === 'auditorFiscal' ? 'contribuinte' : 'auditorFiscal'
    try {
      setSalvando(true)
      setEncontrado(await authService.alterarPerfil(encontrado.loginCpf, novo))
      showToast(novo === 'auditorFiscal' ? 'Permissão de auditor concedida.' : 'Permissão de auditor removida.')
    } catch { showToast('Erro ao alterar o perfil.', 'error') }
    finally { setSalvando(false) }
  }

  const ehAuditor = encontrado?.perfilAcesso === 'auditorFiscal'
  const sou = encontrado && encontrado.loginCpf === meuCpf

  return (
    <div>
      <PageHeader title="Gestão de Acessos" subtitle="Busque um contribuinte pelo CPF para conceder ou remover a permissão de auditor." />

      <form onSubmit={buscar} noValidate className="flex max-w-xl items-end gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="busca-cpf" className="text-sm font-medium text-brand">CPF do contribuinte</label>
          <input id="busca-cpf" value={cpf} onChange={(e) => setCpf(maskCPF(e.target.value))} placeholder="000.000.000-00" inputMode="numeric"
            className="h-10 rounded-lg border border-brand/50 bg-neutral-100 px-3 text-sm outline-none focus:ring-2 focus:ring-brand/30" />
        </div>
        <Button type="submit" disabled={buscando} icon={<Search className="h-4 w-4" />} className="h-10">{buscando ? 'Buscando...' : 'Buscar'}</Button>
      </form>
      {erro && <p className="mt-2 text-sm text-red-600">{erro}</p>}

      {encontrado && (
        <div className="mt-6 flex max-w-xl items-center justify-between gap-4 rounded-xl bg-brand-soft p-5 text-brand">
          <div>
            <p className="text-lg font-bold">{encontrado.nome} {encontrado.sobrenome}</p>
            <p className="text-sm opacity-80">CPF {encontrado.loginCpf}</p>
            <p className="mt-1 text-sm">Perfil atual: <strong>{encontrado.perfilAcesso}</strong></p>
            {sou && <p className="mt-1 text-xs opacity-70">Você não pode alterar o seu próprio perfil.</p>}
          </div>
          <div className="flex flex-col items-center gap-1">
            <button type="button" role="switch" aria-checked={ehAuditor} aria-label="Conceder perfil de auditor fiscal"
              disabled={salvando || !!sou} onClick={alternar}
              className={`relative h-7 w-12 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${ehAuditor ? 'bg-brand' : 'bg-brand-muted'}`}>
              <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${ehAuditor ? 'left-[1.4rem]' : 'left-0.5'}`} />
            </button>
            <span className="text-xs font-bold">Auditor Fiscal</span>
          </div>
        </div>
      )}
    </div>
  )
}
