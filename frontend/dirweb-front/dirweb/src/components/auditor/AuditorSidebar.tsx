import { NavLink, useLocation } from 'react-router-dom'
import { ClipboardList, LogOut, UserCog } from 'lucide-react'
import { useSair } from '@/hooks'

const row = 'flex items-center gap-4 rounded-lg px-5 py-3.5 text-[0.9375rem] transition-colors'

export default function AuditorSidebar() {
  const { pathname } = useLocation()
  const sair = useSair()
  const triagemAtiva = pathname === '/auditor' || pathname.startsWith('/auditor/declaracoes')
  const cls = (ativo: boolean) => `${row} ${ativo ? 'bg-brand text-white' : 'bg-brand-soft text-brand hover:bg-[#e4e9fb]'}`

  return (
    <aside className="flex w-60 shrink-0 flex-col rounded-xl bg-brand-soft p-2 lg:w-64">
      <nav className="flex flex-col gap-1">
        <NavLink to="/auditor" className={cls(triagemAtiva)}>
          <ClipboardList className="h-5 w-5 shrink-0" /> Triagem de Declarações
        </NavLink>
        <NavLink to="/auditor/acessos" className={({ isActive }) => cls(isActive)}>
          <UserCog className="h-5 w-5 shrink-0" /> Gestão de Acessos
        </NavLink>
      </nav>
      <div className="mx-4 my-3 mt-auto h-1 rounded-full bg-[#dde1f4]" />
      <button type="button" onClick={sair} className={`${row} text-left text-brand hover:bg-[#e4e9fb]`}>
        <LogOut className="h-5 w-5 shrink-0" /> Sair do Sistema
      </button>
    </aside>
  )
}
