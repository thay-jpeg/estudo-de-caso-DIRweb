import type { Bem, ContribuinteForm, Dependente, Rendimento, TipoBem, TipoDependente } from '@/types'

export const mockContribuinte: ContribuinteForm = {
  Nome: 'Thaynara',
  Sobrenome: 'Nascimento de Jesus',
  Nome_Social: 'Thaynara Nascimento',
  CPF: '123.456.789-09',
  RG: '12.345.678-9',
  Sexo: 'Feminino',
  CEP: '85851-000',
  Rua: 'Avenida Brasil',
  Numero: '1520',
  Complemento: 'Apto 302',
  Bairro: 'Centro',
  Cidade: 'Foz do Iguaçu',
  UF: 'PR',
  Email: 'thaynara.jesus@email.com',
  Telefone: '(45) 99912-3456',
}

export const mockTiposDependente: TipoDependente[] = [
  { idTipo_dependente: 1, Tipo_dependente: 'Filho(a)' },
  { idTipo_dependente: 2, Tipo_dependente: 'Cônjuge / Companheiro(a)' },
  { idTipo_dependente: 3, Tipo_dependente: 'Pai / Mãe' },
  { idTipo_dependente: 4, Tipo_dependente: 'Outros' },
]

export const mockTiposBem: TipoBem[] = [
  { idTipo_Bem: 1, descricao_tipo: 'Imóvel' },
  { idTipo_Bem: 2, descricao_tipo: 'Veículo' },
  { idTipo_Bem: 3, descricao_tipo: 'Conta bancária' },
  { idTipo_Bem: 4, descricao_tipo: 'Aplicação financeira' },
  { idTipo_Bem: 5, descricao_tipo: 'Outros bens' },
]

export const mockDependentes: Dependente[] = [
  { idDependente: 1, Nome: 'Lucas Nascimento de Jesus', CPF: '111.222.333-96', Tipo_dependente_idTipo_dependente: 1, Tipo_dependente: 'Filho(a)' },
  { idDependente: 2, Nome: 'Maria Clara Nascimento de Jesus', CPF: '222.333.444-05', Tipo_dependente_idTipo_dependente: 1, Tipo_dependente: 'Filho(a)' },
  { idDependente: 3, Nome: 'Carlos Eduardo de Jesus', CPF: '333.444.555-66', Tipo_dependente_idTipo_dependente: 2, Tipo_dependente: 'Cônjuge / Companheiro(a)' },
]

export const mockRendimentos: Rendimento[] = [
  { idRendimentos: 1, CNPJ: '12.345.678/0001-95', nomeEmpresa: 'Itaipu Tecnologia Ltda', Valor_Total_Recebido: 78500.0, INSS: 8640.5, IRRF_pago: 6210.3, valor13Salario: 6540.0 },
  { idRendimentos: 2, CNPJ: '98.765.432/0001-10', nomeEmpresa: 'Cataratas Serviços S.A.', Valor_Total_Recebido: 24000.0, INSS: 2640.0, IRRF_pago: 980.75, valor13Salario: 2000.0 },
]

export const mockBens: Bem[] = [
  { idBens_direitos: 1, Tipo_Bem_idTipo_Bem: 1, Tipo_Bem: 'Imóvel', Nome_bem: 'Apartamento - Centro', Valor_ano_anterior: 320000, Valor_31_12_2026: 335000 },
  { idBens_direitos: 2, Tipo_Bem_idTipo_Bem: 2, Tipo_Bem: 'Veículo', Nome_bem: 'Honda Civic 2020', Valor_ano_anterior: 98000, Valor_31_12_2026: 91000 },
  { idBens_direitos: 3, Tipo_Bem_idTipo_Bem: 3, Tipo_Bem: 'Conta bancária', Nome_bem: 'Conta corrente - Banco do Brasil', Valor_ano_anterior: 8500, Valor_31_12_2026: 12400 },
  { idBens_direitos: 4, Tipo_Bem_idTipo_Bem: 4, Tipo_Bem: 'Aplicação financeira', Nome_bem: 'CDB Liquidez Diária', Valor_ano_anterior: 25000, Valor_31_12_2026: 29800 },
  { idBens_direitos: 5, Tipo_Bem_idTipo_Bem: 5, Tipo_Bem: 'Outros bens', Nome_bem: 'Notebook e equipamentos', Valor_ano_anterior: 6000, Valor_31_12_2026: 4500 },
]
