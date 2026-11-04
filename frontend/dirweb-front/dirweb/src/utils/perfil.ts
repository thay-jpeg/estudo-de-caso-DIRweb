import type { PerfilAcesso } from '@/types'
export const homePorPerfil = (p: PerfilAcesso) => (p === 'auditorFiscal' ? '/auditor' : '/home')
