package unioeste.geral.endereco.bo;

import java.io.Serializable;

public class Endereco implements Serializable {
    private int idEndereco;
    private String cep;
    private Integer tipoEndereco;
    private String numero;
    private String complemento;
    private Bairro bairro;
    private Logradouro logradouro;
    private Cidade cidade;

    public Endereco() {}

    public int getIdEndereco() { return idEndereco; }
    public void setIdEndereco(int idEndereco) { this.idEndereco = idEndereco; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public Integer getTipoEndereco() { return tipoEndereco; }
    public void setTipoEndereco(Integer tipoEndereco) { this.tipoEndereco = tipoEndereco; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }

    public Bairro getBairro() { return bairro; }
    public void setBairro(Bairro bairro) { this.bairro = bairro; }

    public Logradouro getLogradouro() { return logradouro; }
    public void setLogradouro(Logradouro logradouro) { this.logradouro = logradouro; }

    public Cidade getCidade() { return cidade; }
    public void setCidade(Cidade cidade) { this.cidade = cidade; }
}