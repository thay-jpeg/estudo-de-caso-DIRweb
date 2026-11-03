import { NavLink, useNavigate } from 'react-router-dom'
import { CircleDollarSign, FileCheck2, House, Landmark, LogOut, User, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const itens: { to: string; label: string; Icon: LucideIcon }[] = [
  { to: '/', label: 'Início', Icon: House },
  { to: '/dados-contribuinte', label: 'Dados do Contribuinte', Icon: User },
  { to: '/dependentes', label: 'Dependentes', Icon: Users },
  { to: '/rendimentos', label: 'Rendimentos', Icon: CircleDollarSign },
  { to: '/bens-direitos', label: 'Bens e Direitos', Icon: Landmark },
  { to: '/resumo', label: 'Resumo da Declaração', Icon: FileCheck2 },
]

const row = 'flex items-center gap-4 rounded-lg px-5 py-3.5 text-[0.9375rem] transition-colors'

export default function Sidebar() {
  const navigate = useNavigate()
  return (
    <aside className="flex w-60 shrink-0 flex-col rounded-xl bg-brand-soft p-2 lg:w-64">
      <nav className="flex flex-col gap-1">
        {itens.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `${row} ${isActive ? 'bg-brand text-white' : 'bg-brand-soft text-brand hover:bg-[#e4e9fb]'}`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mx-4 my-3 mt-auto h-1 rounded-full bg-[#dde1f4]" />
      <button type="button" onClick={() => navigate('/')} className={`${row} text-left text-brand hover:bg-[#e4e9fb]`}>
        <LogOut className="h-5 w-5 shrink-0" />
        <span>Sair do Sistema</span>
      </button>
    </aside>
  )
}
