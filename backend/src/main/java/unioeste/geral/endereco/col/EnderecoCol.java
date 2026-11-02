package unioeste.geral.endereco.col;

import unioeste.geral.endereco.bo.Endereco;

public class EnderecoCol {

    public boolean validarCEP(String cep) {
        if (cep == null || cep.isBlank()) {
            return false;
        }
        String cepLimpo = cep.replaceAll("[^0-9]", "");
        return cepLimpo.length() == 8;
    }

    public boolean validarId(int id) {
        return id > 0;
    }

    public boolean validarEnderecoParaCadastro(Endereco endereco) {
        if (endereco == null) return false;
        if (!validarCEP(endereco.getCep())) return false;
        if (endereco.getBairro() == null || endereco.getBairro().getIdBairro() <= 0) return false;
        if (endereco.getLogradouro() == null || endereco.getLogradouro().getIdLogradouro() <= 0) return false;
        if (endereco.getLogradouro().getTipoLogradouro() == null
                || endereco.getLogradouro().getTipoLogradouro().getIdTipoLogradouro() <= 0) return false;
        if (endereco.getCidade() == null || endereco.getCidade().getIdCidade() <= 0) return false;
        if (endereco.getCidade().getUf() == null || endereco.getCidade().getUf().getIdUF() <= 0) return false;
        return true;
    }
}