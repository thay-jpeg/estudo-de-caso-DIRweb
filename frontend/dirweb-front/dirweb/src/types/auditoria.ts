import type { Bem, Dependente, Rendimento } from './models'

export type StatusDeclaracao = 'Enviada' | 'Processada' | 'Retida'

export const STATUS_LABEL: Record<StatusDeclaracao, string> = {
  Enviada: 'Enviada',
  Processada: 'Processada',
  Retida: 'Retida em Malha Fina',
}

export interface ContribuinteAuditoria {
  cpf: string
  nome: string
  sobrenome: string
  nomeSocial: string
  rg: string
  sexo: string
  email: string
  telefone: string
  endereco: string
}

export interface DeclaracaoAuditoria {
  idDeclaracao: number
  anoExercicio: number
  status: StatusDeclaracao
  dataEnvio: string
  contribuinte: ContribuinteAuditoria
  dependentes: Dependente[]
  rendimentos: Rendimento[]
  bens: Bem[]
  justificativaRetencao?: string
}
