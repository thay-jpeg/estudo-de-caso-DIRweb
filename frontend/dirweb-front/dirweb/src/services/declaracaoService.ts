import type { Bem, ContribuinteForm, Dependente, Rendimento, TipoBem, TipoDependente } from '@/types'
import {
  mockBens, mockContribuinte, mockDependentes, mockRendimentos, mockTiposBem, mockTiposDependente,
} from './mockData'

/**
 * API MOCKING — nenhuma chamada HTTP é feita.
 * Cada função devolve uma Promise resolvida após 500 ms (simula latência de rede).
 * Para integrar com o back-end Java, troque o corpo de cada função por uma chamada
 * `api.get/post(...)` de './api' mantendo as mesmas assinaturas.
 */
const DELAY_MS = 500
const delay = <T,>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), DELAY_MS))

// "Banco" em memória (reinicia ao recarregar a página)
const db = {
  contribuinte: structuredClone(mockContribuinte) as ContribuinteForm | null,
  dependentes: structuredClone(mockDependentes),
  rendimentos: structuredClone(mockRendimentos),
  bens: structuredClone(mockBens),
  nextId: 100,
}

export interface DeclaracaoCompleta {
  contribuinte: ContribuinteForm | null
  dependentes: Dependente[]
  rendimentos: Rendimento[]
  bens: Bem[]
  tiposDependente: TipoDependente[]
  tiposBem: TipoBem[]
}

export const declaracaoService = {
  carregarDeclaracao: () =>
    delay<DeclaracaoCompleta>({
      contribuinte: db.contribuinte,
      dependentes: db.dependentes,
      rendimentos: db.rendimentos,
      bens: db.bens,
      tiposDependente: mockTiposDependente,
      tiposBem: mockTiposBem,
    }),

  cadastrarContribuinte: (data: ContribuinteForm) => {
    db.contribuinte = { ...data }
    return delay(db.contribuinte)
  },

  cadastrarDependente: (data: Dependente) => {
    const novo = { ...data, idDependente: db.nextId++ }
    db.dependentes.push(novo)
    return delay(novo)
  },
  removerDependente: (id: number) => {
    db.dependentes = db.dependentes.filter((d) => d.idDependente !== id)
    return delay(true)
  },

  registrarRendimento: (data: Rendimento) => {
    const novo = { ...data, idRendimentos: db.nextId++ }
    db.rendimentos.push(novo)
    return delay(novo)
  },
  removerRendimento: (id: number) => {
    db.rendimentos = db.rendimentos.filter((r) => r.idRendimentos !== id)
    return delay(true)
  },

  registrarBem: (data: Bem) => {
    const novo = { ...data, idBens_direitos: db.nextId++ }
    db.bens.push(novo)
    return delay(novo)
  },
  removerBem: (id: number) => {
    db.bens = db.bens.filter((b) => b.idBens_direitos !== id)
    return delay(true)
  },

  enviarDeclaracao: () => delay({ protocolo: `IRPF2026-${Date.now().toString().slice(-8)}` }),
}
