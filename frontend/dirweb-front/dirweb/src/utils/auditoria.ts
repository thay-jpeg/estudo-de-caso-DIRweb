import type { DeclaracaoAuditoria } from '@/types'

export const somar = <T,>(l: T[], f: (i: T) => number) => l.reduce((a, i) => a + f(i), 0)

export function totais(d: DeclaracaoAuditoria) {
  return {
    totalRendimentos: somar(d.rendimentos, (r) => r.Valor_Total_Recebido),
    totalBens: somar(d.bens, (b) => b.Valor_31_12_2026),
    totalBensAnterior: somar(d.bens, (b) => b.Valor_ano_anterior),
    totalImposto: somar(d.rendimentos, (r) => r.IRRF_pago),
  }
}

/** Alerta inteligente: bens do ano atual maiores que o dobro dos rendimentos anuais. */
export const patrimonioIncompativel = (totalBens: number, totalRendimentos: number) => totalBens > 2 * totalRendimentos
