import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import Toast from '@/components/ui/Toast'
import { declaracaoService } from '@/services/declaracaoService'
import { useDeclaracaoStore } from '@/store/useDeclaracaoStore'

export default function LayoutBase() {
  useEffect(() => {
    const s = useDeclaracaoStore.getState()
    if (s.carregado) return
    declaracaoService
      .carregarDeclaracao()
      .then((d) => s.hydrate(d))
      .catch(() => s.showToast('Erro ao carregar a declaração.', 'error'))
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="flex w-full flex-1 gap-5 px-6 py-5">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
      <Toast />
    </div>
  )
}
