const d = (v: string) => v.replace(/\D/g, '')

export const maskCPF = (v: string) =>
  d(v).slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')

export const maskCNPJ = (v: string) =>
  d(v).slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')

export const maskCEP = (v: string) => d(v).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')

export const maskTelefone = (v: string) => {
  const n = d(v).slice(0, 11)
  if (n.length <= 10) return n.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
  return n.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
}

export const formatBRL = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

export const maskCodigo = (v: string) => v.replace(/\D/g, '').slice(0, 6)
