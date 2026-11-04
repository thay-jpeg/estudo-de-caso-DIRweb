/** Mapeado ao MER / Diagrama de Classes (UsuarioAcesso → Contribuinte → PessoaFisica). */
export type PerfilAcesso = 'contribuinte' | 'auditorFiscal'

export interface UsuarioAcesso {
  loginCpf: string
  senhaHash: string
  perfilAcesso: PerfilAcesso
}

/** Usuário logado (nome vem de PessoaFisica.nome + PessoaFisica.sobrenome). */
export interface SessaoUsuario {
  loginCpf: string
  nome: string
  sobrenome: string
  perfilAcesso: PerfilAcesso
}

export interface CadastroContribuintePayload {
  usuarioAcesso: UsuarioAcesso
  pessoaFisica: { nome: string; sobrenome: string; cpf: string }
}

export interface LoginResponse { token: string; usuario: SessaoUsuario }
