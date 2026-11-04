import type { Endereco } from '../types/models';

const API_BASE_URL = 'http://localhost:8080/api/endereco';

// Interfaces que representam o Objeto Composto retornado/esperado pelo Back-End Java (Pacote BO)
export interface UFBackendDTO {
  idUF?: number;
  uf: string;
}

export interface CidadeBackendDTO {
  idCidade?: number;
  cidade: string;
  uf: UFBackendDTO;
}

export interface BairroBackendDTO {
  idBairro?: number;
  bairro: string;
}

export interface TipoLogradouroBackendDTO {
  idTipoLogradouro?: number;
  tipoLogradouro: string;
}

export interface LogradouroBackendDTO {
  idLogradouro?: number;
  logradouro: string;
  tipoLogradouro?: TipoLogradouroBackendDTO;
}

export interface EnderecoBackendDTO {
  idEndereco?: number;
  cep: string;
  tipoEndereco?: number;
  numero?: string;
  complemento?: string;
  bairro: BairroBackendDTO;
  logradouro: LogradouroBackendDTO;
  cidade: CidadeBackendDTO;
}

export interface EnderecoEspecificoBackendDTO {
  endereco: EnderecoBackendDTO;
  numero?: string;
  complemento?: string;
}

// Converte o Objeto Composto do Back-End Java para a interface Endereco do Front-End (src/types/models.ts)
function mapearBackendParaFrontend(dto: EnderecoBackendDTO): Endereco {
  const tipo = dto.logradouro?.tipoLogradouro?.tipoLogradouro?.trim() || '';
  const nomeRua = dto.logradouro?.logradouro?.trim() || '';
  const logradouroCompleto = `${tipo} ${nomeRua}`.trim();

  return {
    idEndereco: dto.idEndereco,
    Tipo_endereco: dto.tipoEndereco ?? 1,
    CEP: dto.cep || '',
    Numero: dto.numero || '',
    Complemento: dto.complemento || '',
    Bairro: dto.bairro?.bairro || '',
    Logradouro: logradouroCompleto,
    Cidade: dto.cidade?.cidade || '',
    UF: dto.cidade?.uf?.uf || '',
  };
}

// Converte a interface Endereco do Front-End (src/types/models.ts) para o Objeto Composto do Back-End Java
function mapearFrontendParaBackend(end: Endereco): EnderecoBackendDTO {
  const ruaLimpa = (end.Logradouro || '').trim();
  const partes = ruaLimpa.split(' ');
  const tipoLogradouro = partes.length > 1 ? partes[0] : 'Rua';
  const nomeLogradouro = partes.length > 1 ? partes.slice(1).join(' ') : ruaLimpa;

  return {
    idEndereco: end.idEndereco,
    cep: (end.CEP || '').replace(/\D/g, ''),
    tipoEndereco: end.Tipo_endereco ?? 1,
    numero: end.Numero || '',
    complemento: end.Complemento || '',
    bairro: {
      bairro: (end.Bairro || '').trim(),
    },
    logradouro: {
      logradouro: nomeLogradouro,
      tipoLogradouro: {
        tipoLogradouro: tipoLogradouro,
      },
    },
    cidade: {
      cidade: (end.Cidade || '').trim(),
      uf: {
        uf: (end.UF || '').trim().toUpperCase(),
      },
    },
  };
}

/**
 * 1. Serviço: cadastrarEndereco
 * Envia o endereço preenchido na tela para o Back-End Java validar (incluindo UF pela sigla) e gravar no MySQL.
 */
export async function cadastrarEndereco(enderecoFront: Endereco): Promise<Endereco> {
  const payload = mapearFrontendParaBackend(enderecoFront);

  const response = await fetch(`${API_BASE_URL}/cadastrarEndereco`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.mensagem || 'Erro ao cadastrar endereço no servidor.');
  }

  return mapearBackendParaFrontend(body as EnderecoBackendDTO);
}

/**
 * 2. Serviço: obterEnderecoPorCEP
 * Busca no banco MySQL a lista de endereços correspondentes a um CEP.
 */
export async function obterEnderecoPorCEP(cep: string): Promise<Endereco[]> {
  const cepLimpo = cep.replace(/\D/g, '');
  const response = await fetch(`${API_BASE_URL}/obterEnderecoPorCEP/${encodeURIComponent(cepLimpo)}`);

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.mensagem || 'Erro ao consultar endereço por CEP.');
  }

  return (body as EnderecoBackendDTO[]).map(mapearBackendParaFrontend);
}

/**
 * 3. Serviço: obterEnderecoPorID
 * Busca no banco MySQL um endereço específico pelo seu ID.
 */
export async function obterEnderecoPorID(idEndereco: number): Promise<Endereco> {
  const response = await fetch(`${API_BASE_URL}/obterEnderecoPorID/${idEndereco}`);

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.mensagem || 'Erro ao consultar endereço por ID.');
  }

  return mapearBackendParaFrontend(body as EnderecoBackendDTO);
}

/**
 * 4. Serviço: obterEnderecoExterno (ViaCEP via Back-End Java)
 * Dado um CEP digitado no Front-End, retorna os dados do endereço obtidos da nuvem.
 */
export async function obterEnderecoExterno(cep: string): Promise<Partial<Endereco> | null> {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/obterEnderecoExterno/${encodeURIComponent(cepLimpo)}`);
  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as EnderecoEspecificoBackendDTO;
  if (!data?.endereco) {
    return null;
  }

  return mapearBackendParaFrontend(data.endereco);
}

/**
 * 5. Serviço: obterCidade
 * Busca no banco MySQL uma Cidade pelo idCidade já trazendo a UF relacionada.
 */
export async function obterCidade(idCidade: number): Promise<CidadeBackendDTO> {
  const response = await fetch(`${API_BASE_URL}/obterCidade/${idCidade}`);

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.mensagem || 'Erro ao consultar cidade.');
  }

  return body as CidadeBackendDTO;
}