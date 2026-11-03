import { CalendarDays, ChartNoAxesCombined, Send } from 'lucide-react'
import banner from '@/assets/banner.png'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ProgressDonut from '@/components/ui/ProgressDonut'
import Checklist from '@/components/ui/Checklist'
import { ETAPAS, calcEtapas, calcProgresso, useDeclaracaoStore } from '@/store/useDeclaracaoStore'
import { useEnviarDeclaracao } from '@/hooks'
import { diasRestantes } from '@/utils/date'

export default function Inicio() {
  const s = useDeclaracaoStore()
  const { enviar, enviando } = useEnviarDeclaracao()
  const ok = calcEtapas(s)
  const itens = ETAPAS.map((e) => ({ id: e.id, label: e.label, done: ok.includes(e.id) }))

  return (
    <div className="flex flex-col gap-4">
      <img src={banner} alt="" className="h-auto w-full rounded-xl" />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
        <Card title="Meu Imposto de Renda" icon={<ChartNoAxesCombined className="h-5 w-5" />} className="self-start">
          <div className="flex flex-wrap items-center gap-8 px-6 py-5">
            <ProgressDonut percent={calcProgresso(s)} />
            <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <Checklist items={itens.slice(0, 3)} />
              <div className="sm:mt-6"><Checklist items={itens.slice(3)} /></div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <section
            className="relative overflow-hidden rounded-xl p-5 text-brand"
            style={{ background: 'linear-gradient(135deg, rgba(175,210,251,.8), rgba(223,250,255,.8))' }}
          >
            <div className="flex items-center gap-2 text-sm font-bold">
              <CalendarDays className="h-5 w-5" /> Prazo de Entrega
            </div>
            <p className="mt-3 text-3xl font-extrabold leading-none">30/12/2026</p>
            <p className="mt-3 text-sm font-bold">
              Faltam <span className="mx-1 text-2xl">{diasRestantes()}</span> dias
            </p>
            <CalendarDays strokeWidth={1.5} className="pointer-events-none absolute bottom-2 right-2 h-16 w-16 opacity-20" />
          </section>

          <Button
            variant="action"
            disabled={enviando}
            icon={<Send className="h-5 w-5" fill="currentColor" />}
            className="w-full rounded-xl py-4 text-base"
            onClick={enviar}
          >
            {enviando ? 'ENVIANDO...' : 'ENVIAR DECLARAÇÃO'}
          </Button>
        </div>
      </div>
    </div>
  )
}
