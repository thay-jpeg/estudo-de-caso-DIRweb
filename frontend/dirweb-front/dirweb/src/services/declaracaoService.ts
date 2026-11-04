import type { Bem, ContribuinteForm, Dependente, Endereco, Rendimento, TipoBem, TipoDependente } from '@/types'
import {
  mockBens, mockContribuinte, mockDependentes, mockRendimentos, mockTiposBem, mockTiposDependente,
} from './mockData'
import {
  cadastrarEndereco,
  obterCidade,
  obterEnderecoExterno,
  obterEnderecoPorCEP,
  obterEnderecoPorID,
} from './enderecoservice'

const DELAY_MS = 500
const delay = <T,>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), DELAY_MS))

const CPF_SEED = '12345678909'
const db = {
  owner: CPF_SEED,
  contribuinte: structuredClone(mockContribuinte) as ContribuinteForm | null,
  dependentes: structuredClone(mockDependentes),
  rendimentos: structuredClone(mockRendimentos),
  bens: structuredClone(mockBens),
  nextId: 100,
}

export interface DeclaracaoCompleta {
  contribuinte: ContribuinteForm | null
  dependentes: Dependente[]
  rendimentos: Rendimento[]
  bens: Bem[]
  tiposDependente: TipoDependente[]
  tiposBem: TipoBem[]
}

/**
 * Extrai o objeto Endereco a partir do ContribuinteForm (suporta tanto data.endereco
 * quanto campos diretos em maiúsculo ou minúsculo no formulário).
 */
function extrairEnderecoDoContribuinte(data: ContribuinteForm): Endereco {
  const raw = data as Record<string, any>
  const endObj = (raw.endereco ?? raw.Endereco ?? raw) as Record<string, any>

  return {
    idEndereco: endObj.idEndereco,
    Tipo_endereco: endObj.Tipo_endereco ?? 1,
    CEP: String(endObj.CEP ?? endObj.cep ?? ''),
    Logradouro: String(endObj.Logradouro ?? endObj.logradouro ?? endObj.rua ?? endObj.Rua ?? ''),
    Numero: String(endObj.Numero ?? endObj.numero ?? ''),
    Complemento: String(endObj.Complemento ?? endObj.complemento ?? ''),
    Bairro: String(endObj.Bairro ?? endObj.bairro ?? ''),
    Cidade: String(endObj.Cidade ?? endObj.cidade ?? ''),
    UF: String(endObj.UF ?? endObj.uf ?? ''),
  }
}

export const declaracaoService = {
  /** Usuário do seed vê os dados fictícios; qualquer outro CPF (novo cadastro) começa com a declaração vazia. */
  carregarDeclaracao: (cpf?: string) => {
    const dono = (cpf ?? CPF_SEED).replace(/\D/g, '')
    if (db.owner !== dono) {
      db.owner = dono
      const seed = dono === CPF_SEED
      db.contribuinte = seed ? structuredClone(mockContribuinte) : null
      db.dependentes = seed ? structuredClone(mockDependentes) : []
      db.rendimentos = seed ? structuredClone(mockRendimentos) : []
      db.bens = seed ? structuredClone(mockBens) : []
    }
    return delay<DeclaracaoCompleta>({
      contribuinte: db.contribuinte,
      dependentes: db.dependentes,
      rendimentos: db.rendimentos,
      bens: db.bens,
      tiposDependente: mockTiposDependente,
      tiposBem: mockTiposBem,
    })
  },

  /**
   * Ao clicar em "Salvar dados" na tela Dados do Contribuinte, envia o Endereço
   * para o Back-End Java (POST /api/endereco/cadastrarEndereco), que valida a UF
   * pela sigla e faz o commit no banco MySQL!
   */
  cadastrarContribuinte: async (data: ContribuinteForm) => {
    const enderecoParaSalvar = extrairEnderecoDoContribuinte(data)

    // Chama o serviço cadastrarEndereco no Back-End Java (persiste no MySQL)
    const enderecoSalvoNoBanco = await cadastrarEndereco(enderecoParaSalvar)
    console.log('Endereço salvo no MySQL via Back-End T3B:', enderecoSalvoNoBanco)

    db.contribuinte = { ...data }
    return delay(db.contribuinte)
  },

  // Expõe os serviços de Endereço do T3B para a tela usar diretamente se precisar
  buscarEnderecoExternoPorCEP: (cep: string) => obterEnderecoExterno(cep),
  buscarEnderecoNoBancoPorCEP: (cep: string) => obterEnderecoPorCEP(cep),
  buscarEnderecoNoBancoPorID: (id: number) => obterEnderecoPorID(id),
  buscarCidadeNoBancoPorID: (idCidade: number) => obterCidade(idCidade),

  cadastrarDependente: (data: Dependente) => {
    const novo = { ...data, idDependente: db.nextId++ }
    db.dependentes.push(novo)
    return delay(novo)
  },
  removerDependente: (id: number) => {
    db.dependentes = db.dependentes.filter((d) => d.idDependente !== id)
    return delay(true)
  },

  registrarRendimento: (data: Rendimento) => {
    const novo = { ...data, idRendimentos: db.nextId++ }
    db.rendimentos.push(novo)
    return delay(novo)
  },
  removerRendimento: (id: number) => {
    db.rendimentos = db.rendimentos.filter((r) => r.idRendimentos !== id)
    return delay(true)
  },

  registrarBem: (data: Bem) => {
    const novo = { ...data, idBens_direitos: db.nextId++ }
    db.bens.push(novo)
    return delay(novo)
  },
  removerBem: (id: number) => {
    db.bens = db.bens.filter((b) => b.idBens_direitos !== id)
    return delay(true)
  },

  enviarDeclaracao: () => delay({ protocolo: `IRPF2026-${Date.now().toString().slice(-8)}` }),
}