import type { DeclaracaoAuditoria, StatusDeclaracao } from '@/types'
import { mockDeclaracoes } from './mockAuditoria'

const DELAY_MS = 500
const delay = <T,>(v: T): Promise<T> => new Promise((res) => setTimeout(() => res(structuredClone(v)), DELAY_MS))
const fail = (m: string): Promise<never> => new Promise((_, rej) => setTimeout(() => rej(new Error(m)), DELAY_MS))

const db: DeclaracaoAuditoria[] = structuredClone(mockDeclaracoes)

const alterar = (id: number, status: StatusDeclaracao, justificativa?: string) => {
  const d = db.find((x) => x.idDeclaracao === id)
  if (!d) return fail('Declaração não encontrada')
  d.status = status
  d.justificativaRetencao = status === 'Retida' ? justificativa : undefined
  return delay(d)
}

export const auditoriaService = {
  listarDeclaracoes: () => delay(db),
  obterDeclaracao: (id: number) => {
    const d = db.find((x) => x.idDeclaracao === id)
    return d ? delay(d) : fail('Declaração não encontrada')
  },
  aprovarDeclaracao: (id: number) => alterar(id, 'Processada'),
  reterEmMalhaFina: (id: number, justificativa: string) => alterar(id, 'Retida', justificativa),
}
