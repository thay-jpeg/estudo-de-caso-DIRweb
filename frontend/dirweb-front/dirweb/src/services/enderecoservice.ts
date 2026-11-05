import type { Endereco } from '../types/models';

const API_BASE_URL = 'http://localhost:8080/api/endereco';

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
 * 1. POST cadastrarEndereco
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
    throw new Error(body.mensagem || 'Endereço inválido para cadastro.');
  }

  return mapearBackendParaFrontend(body as EnderecoBackendDTO);
}

/**
 * 2. GET obterEnderecoPorCEP (NÃO auto-preenche; lança erro se CEP inválido ou não encontrado no banco)
 */
export async function obterEnderecoPorCEP(cep: string): Promise<Endereco[]> {
  const cepLimpo = (cep || '').replace(/\D/g, '');
  const response = await fetch(`${API_BASE_URL}/obterEnderecoPorCEP/${encodeURIComponent(cepLimpo || 'invalido')}`);

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.mensagem || 'CEP inválido.');
  }

  const lista = (body as EnderecoBackendDTO[]).map(mapearBackendParaFrontend);
  if (lista.length === 0) {
    throw new Error('Nenhum endereço encontrado no banco para este CEP.');
  }
  return lista;
}

/**
 * 3. GET obterEnderecoPorID (NÃO auto-preenche; lança erro se ID inválido ou não encontrado no banco)
 */
export async function obterEnderecoPorID(idEndereco: number): Promise<Endereco> {
  const response = await fetch(`${API_BASE_URL}/obterEnderecoPorID/${idEndereco}`);

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.mensagem || 'ID de endereço inválido ou não encontrado.');
  }

  return mapearBackendParaFrontend(body as EnderecoBackendDTO);
}

/**
 * 4. GET obterEnderecoExterno (ViaCEP via Back-End: auto-preenche se válido; lança erro para brilhar em vermelho se inválido)
 */
export async function obterEnderecoExterno(cep: string): Promise<Endereco> {
  const cepLimpo = (cep || '').replace(/\D/g, '');
  const response = await fetch(`${API_BASE_URL}/obterEnderecoExterno/${encodeURIComponent(cepLimpo || 'invalido')}`);

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.mensagem || 'CEP inválido ou não encontrado no serviço externo.');
  }

  const data = body as EnderecoEspecificoBackendDTO;
  if (!data?.endereco) {
    throw new Error('Endereço não retornado pelo serviço externo.');
  }

  return mapearBackendParaFrontend(data.endereco);
}

/**
 * 5. GET obterCidade (NÃO auto-preenche; lança erro se ID de cidade inválido ou não encontrado)
 */
export async function obterCidade(idCidade: number): Promise<CidadeBackendDTO> {
  const response = await fetch(`${API_BASE_URL}/obterCidade/${idCidade}`);

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.mensagem || 'Cidade inválida ou não encontrada.');
  }

  return body as CidadeBackendDTO;
}