/** Interfaces mapeadas ao modelo E-R (MySQL Workbench) do Estudo de Caso 3. */

export interface UF { idUF: number; UF: string }
export interface Cidade { idCidade: number; Cidade: string; UF_idUF: number }
export interface Bairro { idBairro: number; Bairro: string }
export interface TipoLogradouro { idTipo_logradouro: number; Tipo_logradouro: string }
export interface Logradouro {
  idLogradouro: number
  Logradouro: string
  Tipo_logradouro_idTipo_logradouro: number
}

export interface Endereco {
  idEndereco?: number
  Tipo_endereco?: number
  CEP: string
  Numero: string
  Complemento?: string
  Bairro: string
  Logradouro: string
  Cidade: string
  UF: string
}

export interface DDI { idDDI: number; DDI: string }
export interface DDD { idDDD: number; DDD: string; DDI_idDDI: number }
export interface Telefone { idTelefone?: number; fone: string; DDD: string; DDI: string }
export interface Email { idEmail?: number; Email: string }

/** Pessoa (superclasse) */
export interface Pessoa {
  idPessoa?: number
  Nome: string
  Endereco: Endereco
  emails: Email[]
  telefones: Telefone[]
}

/** Pessoa_Fisica herda de Pessoa */
export interface PessoaFisica extends Pessoa {
  Sobrenome: string
  Nome_Social: string
  CPF: string
  RG: string
  Sexo: string
  Data_nascimento?: string
  Deficiencia?: boolean
  Alteracao?: boolean
  Companheiro?: boolean
  Residente?: boolean
}

/** Pessoa_Juridica herda de Pessoa */
export interface PessoaJuridica extends Pessoa { CNPJ: string }

export interface TipoDependente { idTipo_dependente: number; Tipo_dependente: string }
export interface Dependente {
  idDependente?: number
  Nome: string
  CPF: string
  Tipo_dependente_idTipo_dependente: number
  Tipo_dependente?: string
  Data_nascimento?: string
  Moradia_com_titular?: boolean
  Deducao?: string
}

export interface Rendimento {
  idRendimentos?: number
  CNPJ: string
  nomeEmpresa: string
  Valor_Total_Recebido: number
  INSS: number
  IRRF_pago: number
  valor13Salario: number
}

export interface TipoBem { idTipo_Bem: number; descricao_tipo: string }
export interface Bem {
  idBens_direitos?: number
  Tipo_Bem_idTipo_Bem: number
  Tipo_Bem?: string
  Nome_bem: string
  Valor_ano_anterior: number
  Valor_31_12_2026: number
}

export interface DeclaracaoRenda { idDeclaracao_Renda: number; Pessoa_Fisica_Pessoa_idPessoa: number }

export interface DeclaracaoResumo {
  totalRendimentos: number
  totalBens: number
  totalDependentes: number
}

/** Formulário "Dados do Contribuinte" (achatado para o RHF). */
export interface ContribuinteForm {
  Nome: string
  Sobrenome: string
  Nome_Social: string
  CPF: string
  RG: string
  Sexo: string
  Email: string
  Telefone: string
  Rua: string
  Numero: string
  Complemento?: string
  Bairro: string
  Cidade: string
  UF: string
  CEP: string
}
