import type { CadastroContribuintePayload, LoginResponse, PerfilAcesso, SessaoUsuario, UsuarioAcesso } from '@/types'
import { mockAuditor, mockDeclaracoes } from './mockAuditoria'

const DELAY_MS = 500
const delay = <T,>(v: T): Promise<T> => new Promise((res) => setTimeout(() => res(structuredClone(v)), DELAY_MS))
const fail = (msg: string): Promise<never> => new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), DELAY_MS))

export const CODIGO_MOCK = '123456'
const digits = (v: string) => v.replace(/\D/g, '')

/** Hash de mão única SIMULADO (no back-end real: BCrypt / Spring Security). */
export const hashSenha = (s: string) => 'mock$' + btoa(unescape(encodeURIComponent(s)))

interface UsuarioMock { acesso: UsuarioAcesso; nome: string; sobrenome: string; email: string }

const usuarios = new Map<string, UsuarioMock>([
  ['12345678909', {
    acesso: { loginCpf: '123.456.789-09', senhaHash: hashSenha('Senha@123'), perfilAcesso: 'contribuinte' },
    nome: 'Thaynara', sobrenome: 'Nascimento de Jesus', email: 'thaynara.jesus@email.com',
  }],
])

// Contribuintes das declarações do painel do auditor (senha Senha@123) e o auditor logado do mock
for (const d of mockDeclaracoes) {
  usuarios.set(digits(d.contribuinte.cpf), {
    acesso: { loginCpf: d.contribuinte.cpf, senhaHash: hashSenha('Senha@123'), perfilAcesso: 'contribuinte' },
    nome: d.contribuinte.nome, sobrenome: d.contribuinte.sobrenome, email: d.contribuinte.email,
  })
}
{
  const [nome, ...resto] = mockAuditor.nome.split(' ')
  usuarios.set(digits(mockAuditor.loginCpf), {
    acesso: { loginCpf: mockAuditor.loginCpf, senhaHash: hashSenha('Auditor@123'), perfilAcesso: mockAuditor.perfilAcesso },
    nome, sobrenome: resto.join(' '), email: 'roberto.junior@receita.gov.br',
  })
}

const mascararEmail = (e: string) => e.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + '*'.repeat(Math.max(b.length, 3)) + c)
const sessao = (u: UsuarioMock): SessaoUsuario => ({
  loginCpf: u.acesso.loginCpf, nome: u.nome, sobrenome: u.sobrenome, perfilAcesso: u.acesso.perfilAcesso,
})
const token = (s: SessaoUsuario) => 'mock.' + btoa(JSON.stringify({ sub: s.loginCpf, perfil: s.perfilAcesso, iat: Date.now() })) + '.sig'

export const authService = {
  /** Gestão de Acessos: busca um usuário pelo CPF. */
  buscarUsuarioPorCpf: (cpf: string) => {
    const u = usuarios.get(digits(cpf))
    return u ? delay(sessao(u)) : fail('Nenhum contribuinte encontrado com este CPF')
  },
  /** Gestão de Acessos: concede/remove a permissão de auditor (somente via tela do auditor). */
  alterarPerfil: (cpf: string, perfil: PerfilAcesso) => {
    const u = usuarios.get(digits(cpf))
    if (!u) return fail('Usuário não encontrado')
    u.acesso.perfilAcesso = perfil
    return delay(sessao(u))
  },

  verificarCpf: (cpf: string) => delay({ existe: usuarios.has(digits(cpf)) }),

  autenticar: (cpf: string, senha: string): Promise<LoginResponse> => {
    const u = usuarios.get(digits(cpf))
    if (!u || u.acesso.senhaHash !== hashSenha(senha)) return fail('Usuário ou senha inválidos')
    const s = sessao(u)
    return delay({ token: token(s), usuario: s })
  },

  solicitarCodigo: (cpf: string) => {
    const u = usuarios.get(digits(cpf))
    if (!u) return fail('CPF não encontrado')
    return delay({ emailMascarado: mascararEmail(u.email) })
  },

  confirmarCodigo: (_cpf: string, codigo: string) =>
    codigo === CODIGO_MOCK ? delay(true) : fail('Código inválido ou expirado'),

  redefinirSenha: (cpf: string, nova: string) => {
    const u = usuarios.get(digits(cpf))
    if (!u) return fail('CPF não encontrado')
    u.acesso.senhaHash = hashSenha(nova)
    return delay(true)
  },

  /** perfilAcesso é fixado em "contribuinte" — auditorFiscal só é atribuído por outro auditor, dentro do sistema. */
  cadastrarContribuinte: (dados: { nome: string; cpf: string; senha: string }): Promise<LoginResponse> => {
    const partes = dados.nome.trim().split(/\s+/)
    const payload: CadastroContribuintePayload = {
      usuarioAcesso: { loginCpf: dados.cpf, senhaHash: hashSenha(dados.senha), perfilAcesso: 'contribuinte' },
      pessoaFisica: { nome: partes[0], sobrenome: partes.slice(1).join(' '), cpf: dados.cpf },
    }
    if (usuarios.has(digits(dados.cpf))) return fail('CPF já cadastrado')
    usuarios.set(digits(dados.cpf), {
      acesso: payload.usuarioAcesso, nome: payload.pessoaFisica.nome, sobrenome: payload.pessoaFisica.sobrenome, email: '',
    })
    console.info('[mock] POST /contribuintes', payload)
    const s = sessao(usuarios.get(digits(dados.cpf))!)
    return delay({ token: token(s), usuario: s })
  },
}
