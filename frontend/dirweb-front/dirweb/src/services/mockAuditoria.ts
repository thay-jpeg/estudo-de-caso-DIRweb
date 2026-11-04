import type { DeclaracaoAuditoria } from '@/types'

/** Auditor logado (mock). Senha de teste: Auditor@123 */
export const mockAuditor = { loginCpf: '999.999.999-99', nome: 'Roberto Junior', perfilAcesso: 'auditorFiscal' as const }

export const mockDeclaracoes: DeclaracaoAuditoria[] = [
  {
    idDeclaracao: 1, anoExercicio: 2026, status: 'Enviada', dataEnvio: '2026-03-18',
    contribuinte: {
      cpf: '529.982.247-25', nome: 'Maria Eduarda', sobrenome: 'Souza Lima', nomeSocial: 'Maria Eduarda',
      rg: '9.876.543-2', sexo: 'Feminino', email: 'maria.lima@email.com', telefone: '(45) 99811-2233',
      endereco: 'Rua das Palmeiras, 230 - Vila Yolanda, Foz do Iguaçu/PR - CEP 85853-100',
    },
    dependentes: [
      { idDependente: 1, Nome: 'Pedro Souza Lima', CPF: '444.555.666-77', Tipo_dependente_idTipo_dependente: 1, Tipo_dependente: 'Filho(a)' },
    ],
    rendimentos: [
      { idRendimentos: 1, CNPJ: '98.765.432/0001-10', nomeEmpresa: 'Cataratas Serviços S.A.', Valor_Total_Recebido: 84000, INSS: 9240, IRRF_pago: 5100, valor13Salario: 7000 },
      { idRendimentos: 2, CNPJ: '12.345.678/0001-95', nomeEmpresa: 'Itaipu Tecnologia Ltda', Valor_Total_Recebido: 36000, INSS: 3960, IRRF_pago: 1200, valor13Salario: 3000 },
    ],
    bens: [
      { idBens_direitos: 1, Tipo_Bem_idTipo_Bem: 1, Tipo_Bem: 'Imóvel', Nome_bem: 'Apartamento - Vila Yolanda', Valor_ano_anterior: 210000, Valor_31_12_2026: 225000 },
      { idBens_direitos: 2, Tipo_Bem_idTipo_Bem: 2, Tipo_Bem: 'Veículo', Nome_bem: 'Fiat Argo 2019', Valor_ano_anterior: 45000, Valor_31_12_2026: 41000 },
      { idBens_direitos: 3, Tipo_Bem_idTipo_Bem: 3, Tipo_Bem: 'Conta bancária', Nome_bem: 'Poupança - Caixa', Valor_ano_anterior: 12000, Valor_31_12_2026: 15500 },
    ],
  },
  {
    idDeclaracao: 2, anoExercicio: 2026, status: 'Processada', dataEnvio: '2026-03-05',
    contribuinte: {
      cpf: '111.444.777-35', nome: 'João Pedro', sobrenome: 'Almeida', nomeSocial: 'João Pedro',
      rg: '4.321.098-7', sexo: 'Masculino', email: 'joao.almeida@email.com', telefone: '(45) 99922-4455',
      endereco: 'Av. Paraná, 1100 - Centro, Foz do Iguaçu/PR - CEP 85851-000',
    },
    dependentes: [],
    rendimentos: [
      { idRendimentos: 3, CNPJ: '45.723.174/0001-10', nomeEmpresa: 'Mercado Foz Ltda', Valor_Total_Recebido: 96000, INSS: 10560, IRRF_pago: 7300, valor13Salario: 8000 },
    ],
    bens: [
      { idBens_direitos: 4, Tipo_Bem_idTipo_Bem: 2, Tipo_Bem: 'Veículo', Nome_bem: 'VW Gol 2018', Valor_ano_anterior: 62000, Valor_31_12_2026: 58000 },
      { idBens_direitos: 5, Tipo_Bem_idTipo_Bem: 4, Tipo_Bem: 'Aplicação financeira', Nome_bem: 'CDB Banco do Brasil', Valor_ano_anterior: 30000, Valor_31_12_2026: 38000 },
      { idBens_direitos: 6, Tipo_Bem_idTipo_Bem: 2, Tipo_Bem: 'Veículo', Nome_bem: 'Moto Honda CG 160', Valor_ano_anterior: 14000, Valor_31_12_2026: 12500 },
    ],
  },
  {
    idDeclaracao: 3, anoExercicio: 2026, status: 'Retida', dataEnvio: '2026-03-11',
    justificativaRetencao: 'Patrimônio incompatível com a renda declarada. Comprovar a origem dos recursos dos imóveis e da embarcação.',
    contribuinte: {
      cpf: '390.533.447-05', nome: 'Carlos Henrique', sobrenome: 'Lima', nomeSocial: 'Carlos Henrique',
      rg: '7.654.321-0', sexo: 'Masculino', email: 'carlos.lima@email.com', telefone: '(45) 99733-8899',
      endereco: 'Rua Jorge Schimmelpfeng, 88 - Centro, Foz do Iguaçu/PR - CEP 85851-020',
    },
    dependentes: [
      { idDependente: 2, Nome: 'Helena Lima', CPF: '555.666.777-88', Tipo_dependente_idTipo_dependente: 2, Tipo_dependente: 'Cônjuge / Companheiro(a)' },
      { idDependente: 3, Nome: 'Miguel Lima', CPF: '666.777.888-99', Tipo_dependente_idTipo_dependente: 1, Tipo_dependente: 'Filho(a)' },
    ],
    rendimentos: [
      { idRendimentos: 4, CNPJ: '12.345.678/0001-95', nomeEmpresa: 'Itaipu Tecnologia Ltda', Valor_Total_Recebido: 72000, INSS: 7920, IRRF_pago: 2900, valor13Salario: 6000 },
    ],
    bens: [
      { idBens_direitos: 7, Tipo_Bem_idTipo_Bem: 1, Tipo_Bem: 'Imóvel', Nome_bem: 'Casa de praia - Itapema/SC', Valor_ano_anterior: 650000, Valor_31_12_2026: 700000 },
      { idBens_direitos: 8, Tipo_Bem_idTipo_Bem: 5, Tipo_Bem: 'Outros bens', Nome_bem: 'Lancha 25 pés', Valor_ano_anterior: 180000, Valor_31_12_2026: 190000 },
      { idBens_direitos: 9, Tipo_Bem_idTipo_Bem: 2, Tipo_Bem: 'Veículo', Nome_bem: 'Toyota Hilux 2021', Valor_ano_anterior: 120000, Valor_31_12_2026: 115000 },
    ],
  },
  {
    idDeclaracao: 4, anoExercicio: 2026, status: 'Enviada', dataEnvio: '2026-03-20',
    contribuinte: {
      cpf: '168.995.350-09', nome: 'Ana Beatriz', sobrenome: 'Costa', nomeSocial: 'Ana Beatriz',
      rg: '1.234.567-8', sexo: 'Feminino', email: 'ana.costa@email.com', telefone: '(45) 99644-1020',
      endereco: 'Rua Almirante Barroso, 410 - Centro, Foz do Iguaçu/PR - CEP 85851-010',
    },
    dependentes: [],
    rendimentos: [
      { idRendimentos: 5, CNPJ: '98.765.432/0001-10', nomeEmpresa: 'Cataratas Serviços S.A.', Valor_Total_Recebido: 60000, INSS: 6600, IRRF_pago: 1500, valor13Salario: 5000 },
    ],
    bens: [
      { idBens_direitos: 10, Tipo_Bem_idTipo_Bem: 1, Tipo_Bem: 'Imóvel', Nome_bem: 'Apartamento - Centro', Valor_ano_anterior: 340000, Valor_31_12_2026: 360000 },
      { idBens_direitos: 11, Tipo_Bem_idTipo_Bem: 4, Tipo_Bem: 'Aplicação financeira', Nome_bem: 'Fundo de investimento', Valor_ano_anterior: 40000, Valor_31_12_2026: 50000 },
    ],
  },
]
