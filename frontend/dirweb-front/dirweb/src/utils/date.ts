export const PRAZO_ENTREGA = new Date(2026, 11, 30) // 30/12/2026

export function diasRestantes(hoje = new Date()): number {
  const a = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime()
  const diff = Math.ceil((PRAZO_ENTREGA.getTime() - a) / 86_400_000)
  return Math.max(diff, 0)
}
