import { ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-soft text-brand">
      <div className="flex flex-col items-center gap-2 px-6 py-4 text-xs md:flex-row md:justify-between">
        <span className="hidden w-64 md:block" />
        <p className="text-center text-sm">DIRweb - Declaração de Imposto de Renda v1.0.0</p>
        <nav className="flex items-center divide-x divide-brand/40">
          <a href="#" className="flex items-center gap-1.5 pr-3 hover:underline">
            <ShieldCheck className="h-4 w-4" /> Acesso Seguro
          </a>
          <a href="#" className="px-3 hover:underline">Política de Privacidade</a>
          <a href="#" className="pl-3 hover:underline">Termos de Uso</a>
        </nav>
      </div>
    </footer>
  )
}
