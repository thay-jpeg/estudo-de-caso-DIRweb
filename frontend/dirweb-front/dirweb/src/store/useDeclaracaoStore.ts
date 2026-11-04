import { create } from 'zustand'
import type { Bem, ContribuinteForm, Dependente, Rendimento, TipoBem, TipoDependente } from '@/types'

export type EtapaId = 'dados' | 'dependentes' | 'rendimentos' | 'bens' | 'resumo'

export const ETAPAS: { id: EtapaId; label: string; peso: number }[] = [
  { id: 'dados', label: 'Dados do Contribuinte', peso: 10 },
  { id: 'dependentes', label: 'Dependentes', peso: 15 },
  { id: 'rendimentos', label: 'Rendimentos', peso: 30 },
  { id: 'bens', label: 'Bens e Direitos', peso: 30 },
  { id: 'resumo', label: 'Resumo da Declaração', peso: 15 },
]

export type ToastType = 'success' | 'error'

interface DeclaracaoState {
  carregado: boolean
  contribuinte: ContribuinteForm | null
  dependentes: Dependente[]
  semDependentes: boolean
  rendimentos: Rendimento[]
  bens: Bem[]
  tiposDependente: TipoDependente[]
  tiposBem: TipoBem[]
  enviada: boolean
  toast: { id: number; msg: string; type: ToastType } | null

  hydrate: (d: Partial<DeclaracaoState>) => void
  setContribuinte: (c: ContribuinteForm) => void
  setDependentes: (d: Dependente[]) => void
  setSemDependentes: (v: boolean) => void
  setRendimentos: (r: Rendimento[]) => void
  setBens: (b: Bem[]) => void
  setEnviada: (v: boolean) => void
  showToast: (msg: string, type?: ToastType) => void
  clearToast: () => void
  reset: () => void
}

export const useDeclaracaoStore = create<DeclaracaoState>((set) => ({
  carregado: false,
  contribuinte: null,
  dependentes: [],
  semDependentes: false,
  rendimentos: [],
  bens: [],
  tiposDependente: [],
  tiposBem: [],
  enviada: false,
  toast: null,

  hydrate: (d) => set({ ...d, carregado: true }),
  setContribuinte: (contribuinte) => set({ contribuinte }),
  setDependentes: (dependentes) => set({ dependentes }),
  setSemDependentes: (semDependentes) => set({ semDependentes }),
  setRendimentos: (rendimentos) => set({ rendimentos }),
  setBens: (bens) => set({ bens }),
  setEnviada: (enviada) => set({ enviada }),
  showToast: (msg, type = 'success') => set({ toast: { id: Date.now(), msg, type } }),
  clearToast: () => set({ toast: null }),
  reset: () =>
    set({ carregado: false, contribuinte: null, dependentes: [], semDependentes: false, rendimentos: [], bens: [], tiposDependente: [], tiposBem: [], enviada: false }),
}))

type Snapshot = Pick<DeclaracaoState, 'contribuinte' | 'dependentes' | 'semDependentes' | 'rendimentos' | 'bens' | 'enviada'>

export const somar = <T,>(lista: T[], pick: (i: T) => number) => lista.reduce((a, i) => a + pick(i), 0)

export function calcEtapas(s: Snapshot): EtapaId[] {
  const ok: EtapaId[] = []
  if (s.contribuinte) ok.push('dados')
  if (s.dependentes.length > 0 || s.semDependentes) ok.push('dependentes')
  if (s.rendimentos.length > 0) ok.push('rendimentos')
  if (s.bens.length > 0 && somar(s.bens, (b) => b.Valor_31_12_2026) > 100) ok.push('bens')
  if (s.enviada) ok.push('resumo')
  return ok
}

export function calcProgresso(s: Snapshot): number {
  const ok = calcEtapas(s)
  return ETAPAS.filter((e) => ok.includes(e.id)).reduce((a, e) => a + e.peso, 0)
}

/** Pendências que impedem o envio (o resumo/envio não depende de "resumo" estar concluído). */
export function validarDeclaracao(s: Snapshot): string[] {
  const p: string[] = []
  if (!s.contribuinte) p.push('Preencha os Dados do Contribuinte.')
  if (s.dependentes.length === 0 && !s.semDependentes) p.push('Informe os dependentes ou marque "Não possuo dependentes".')
  if (s.rendimentos.length === 0) p.push('Cadastre ao menos um rendimento tributável.')
  else if (s.rendimentos.some((r) => r.Valor_Total_Recebido <= 100)) p.push('Há rendimento com valor total menor ou igual a R$ 100,00.')
  if (s.bens.length === 0 || somar(s.bens, (b) => b.Valor_31_12_2026) <= 100) p.push('A soma dos bens e direitos deve ser maior que R$ 100,00.')
  return p
}
