import { z } from 'zod'

const money = (label: string) =>
  z.coerce.number({ invalid_type_error: `${label} inválido` }).min(0, `${label} não pode ser negativo`)

export const contribuinteSchema = z.object({
  Nome: z.string().min(1, 'Informe o nome'),
  Sobrenome: z.string().min(1, 'Informe o sobrenome'),
  Nome_Social: z.string().min(1, 'Informe o nome social'),
  CPF: z.string().regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF inválido'),
  RG: z.string().min(1, 'Informe o RG'),
  Sexo: z.string().min(1, 'Informe o sexo'),
  Email: z.string().email('E-mail inválido'),
  Telefone: z.string().min(8, 'Informe o telefone'),
  Rua: z.string().min(1, 'Informe a rua'),
  Numero: z.string().min(1, 'Informe o número'),
  Complemento: z.string().optional(),
  Bairro: z.string().min(1, 'Informe o bairro'),
  Cidade: z.string().min(1, 'Informe a cidade'),
  UF: z.string().length(2, 'UF inválida'),
  CEP: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
})

export const dependenteSchema = z.object({
  Nome: z.string().min(1, 'Informe o nome'),
  CPF: z.string().regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF inválido'),
  Tipo_dependente_idTipo_dependente: z.coerce.number().min(1, 'Selecione o tipo'),
})

export const rendimentoSchema = z.object({
  CNPJ: z.string().regex(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, 'CNPJ obrigatório / inválido'),
  nomeEmpresa: z.string().min(1, 'Informe o nome da empresa'),
  Valor_Total_Recebido: money('Valor total').gt(100, 'O valor total deve ser maior que R$ 100,00'),
  INSS: money('INSS'),
  IRRF_pago: money('IRRF'),
  valor13Salario: money('13º salário'),
})

export const bemSchema = z.object({
  Tipo_Bem_idTipo_Bem: z.coerce.number().min(1, 'Selecione o tipo de bem'),
  Nome_bem: z.string().min(1, 'Informe o nome do bem'),
  Valor_ano_anterior: money('Valor do ano anterior'),
  Valor_31_12_2026: money('Valor em 31/12/2026'),
})

export type ContribuinteSchema = z.infer<typeof contribuinteSchema>
export type DependenteSchema = z.infer<typeof dependenteSchema>
export type RendimentoSchema = z.infer<typeof rendimentoSchema>
export type BemSchema = z.infer<typeof bemSchema>

export const SEXOS = ['Feminino', 'Masculino', 'Outro'] as const
export const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'] as const
