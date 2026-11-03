import { Navigate, Route, Routes } from 'react-router-dom'
import LayoutBase from '@/components/layout/LayoutBase'
import Inicio from '@/pages/Inicio'
import DadosContribuinte from '@/pages/DadosContribuinte'
import Dependentes from '@/pages/Dependentes'
import Rendimentos from '@/pages/Rendimentos'
import BensDireitos from '@/pages/BensDireitos'
import Resumo from '@/pages/Resumo'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<LayoutBase />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/dados-contribuinte" element={<DadosContribuinte />} />
        <Route path="/dependentes" element={<Dependentes />} />
        <Route path="/rendimentos" element={<Rendimentos />} />
        <Route path="/bens-direitos" element={<BensDireitos />} />
        <Route path="/resumo" element={<Resumo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
