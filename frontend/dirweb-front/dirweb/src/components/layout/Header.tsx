import { CircleUserRound } from 'lucide-react'
import logoGov from '@/assets/logo-governo-federal.png'
import logoRF from '@/assets/logo-receita-federal.png'
import { useDeclaracaoStore } from '@/store/useDeclaracaoStore'

export default function Header() {
  const nome = useDeclaracaoStore((s) => s.usuarioNome)
  return (
    <header className="bg-brand text-white">
      <div className="flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-5">
          <img src={logoGov} alt="Governo Federal - Brasil" className="h-12 w-auto" />
          <span className="h-9 w-[3px] rounded-full bg-white" />
          <img src={logoRF} alt="Receita Federal" className="h-9 w-auto" />
        </div>
        <div className="flex items-center gap-5">
          <span className="hidden h-9 w-[3px] rounded-full bg-white sm:block" />
          <div className="flex items-center gap-3">
            <CircleUserRound className="h-9 w-9" strokeWidth={1.5} />
            <span className="hidden text-base sm:block">Olá, {nome}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
