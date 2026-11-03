package unioeste.geral.endereco.bo;

import java.io.Serializable;

public class Cidade implements Serializable {
    private int idCidade;
    private String cidade;
    private UF uf;

    public Cidade() {}

    public Cidade(int idCidade, String cidade, UF uf) {
        this.idCidade = idCidade;
        this.cidade = cidade;
        this.uf = uf;
    }

    public int getIdCidade() { return idCidade; }
    public void setIdCidade(int idCidade) { this.idCidade = idCidade; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public UF getUf() { return uf; }
    public void setUf(UF uf) { this.uf = uf; }
}