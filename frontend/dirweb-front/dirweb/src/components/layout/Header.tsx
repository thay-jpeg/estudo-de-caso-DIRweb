import { CircleUserRound, LogOut, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logoGov from '@/assets/logo-governo-federal.png'
import logoRF from '@/assets/logo-receita-federal.png'
import logoGovBr from '@/assets/govbr.png'
import { useAuthStore } from '@/store/useAuthStore'
import { useSair } from '@/hooks'

export default function Header() {
  const usuario = useAuthStore((s) => s.usuario)
  const navigate = useNavigate()
  const sair = useSair()
  const auditor = usuario?.perfilAcesso === 'auditorFiscal'

  // Ícone gov.br: leva à tela de login (se houver sessão ativa, ela é encerrada)
  const irParaLogin = () => (usuario ? sair() : navigate('/login'))

  return (
    <header className="bg-brand text-white">
      <div className="flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-5">
          <img src={logoGov} alt="Governo Federal - Brasil" className="h-12 w-auto" />
          <span className="h-9 w-[3px] rounded-full bg-white" />
          <img src={logoRF} alt="Receita Federal" className="h-9 w-auto" />
        </div>

        <div className="flex items-center gap-5">
          <button type="button" onClick={irParaLogin} title="gov.br - ir para o login" aria-label="gov.br - ir para o login">
            <img src={logoGovBr} alt="gov.br" className="h-9 w-auto" />
          </button>

          {usuario && (
            <>
              <span className="hidden h-9 w-[3px] rounded-full bg-white sm:block" />
              {auditor && (
                <span className="hidden items-center gap-1.5 rounded-full border border-white/50 bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide md:flex">
                  <ShieldCheck className="h-4 w-4" /> Modo Auditoria
                </span>
              )}
              <div className="flex items-center gap-3">
                <CircleUserRound className="h-9 w-9" strokeWidth={1.5} />
                <span className="hidden text-base sm:block">Olá, {usuario.nome} {usuario.sobrenome}</span>
              </div>
              {auditor && (
                <button type="button" onClick={sair}
                  className="flex items-center gap-1.5 rounded-lg border border-white/50 px-3 py-1.5 text-sm font-bold hover:bg-white/15">
                  <LogOut className="h-4 w-4" /> Sair
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
