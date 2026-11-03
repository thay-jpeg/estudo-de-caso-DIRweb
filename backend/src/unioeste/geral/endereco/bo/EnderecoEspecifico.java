package unioeste.geral.endereco.bo;

import java.io.Serializable;

public class EnderecoEspecifico implements Serializable {
    private Endereco endereco;
    private String numero;
    private String complemento;

    public EnderecoEspecifico() {}

    public EnderecoEspecifico(Endereco endereco, String numero, String complemento) {
        this.endereco = endereco;
        this.numero = numero;
        this.complemento = complemento;
    }

    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }
}