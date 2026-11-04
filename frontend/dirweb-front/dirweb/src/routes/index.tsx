import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import LayoutBase from '@/components/layout/LayoutBase'
import AuditorLayout from '@/components/auditor/AuditorLayout'
import Login from '@/pages/Login'
import Inicio from '@/pages/Inicio'
import DadosContribuinte from '@/pages/DadosContribuinte'
import Dependentes from '@/pages/Dependentes'
import Rendimentos from '@/pages/Rendimentos'
import BensDireitos from '@/pages/BensDireitos'
import Resumo from '@/pages/Resumo'
import Triagem from '@/pages/auditor/Triagem'
import Auditoria from '@/pages/auditor/Auditoria'
import GestaoAcessos from '@/pages/auditor/GestaoAcessos'
import { useAuthStore } from '@/store/useAuthStore'
import { homePorPerfil } from '@/utils/perfil'
import type { PerfilAcesso } from '@/types'

function RequireAuth({ perfil }: { perfil: PerfilAcesso }) {
  const { token, usuario } = useAuthStore()
  if (!token || !usuario) return <Navigate to="/login" replace />
  if (usuario.perfilAcesso !== perfil) return <Navigate to={homePorPerfil(usuario.perfilAcesso)} replace />
  return <Outlet />
}
function PublicOnly() {
  const { token, usuario } = useAuthStore()
  return token && usuario ? <Navigate to={homePorPerfil(usuario.perfilAcesso)} replace /> : <Outlet />
}
function HomeRedirect() {
  const usuario = useAuthStore((s) => s.usuario)
  return <Navigate to={usuario ? homePorPerfil(usuario.perfilAcesso) : '/login'} replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnly />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<RequireAuth perfil="contribuinte" />}>
        <Route element={<LayoutBase />}>
          <Route path="/home" element={<Inicio />} />
          <Route path="/dados-contribuinte" element={<DadosContribuinte />} />
          <Route path="/dependentes" element={<Dependentes />} />
          <Route path="/rendimentos" element={<Rendimentos />} />
          <Route path="/bens-direitos" element={<BensDireitos />} />
          <Route path="/resumo" element={<Resumo />} />
        </Route>
      </Route>

      <Route element={<RequireAuth perfil="auditorFiscal" />}>
        <Route element={<AuditorLayout />}>
          <Route path="/auditor" element={<Triagem />} />
          <Route path="/auditor/declaracoes/:id" element={<Auditoria />} />
          <Route path="/auditor/acessos" element={<GestaoAcessos />} />
        </Route>
      </Route>

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  )
}
