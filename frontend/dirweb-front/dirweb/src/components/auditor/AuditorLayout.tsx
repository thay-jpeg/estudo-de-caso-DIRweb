import { Outlet } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Toast from '@/components/ui/Toast'
import AuditorSidebar from './AuditorSidebar'

export default function AuditorLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="flex flex-1 gap-5 px-6 py-5">
        <AuditorSidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
      <Toast />
    </div>
  )
}
