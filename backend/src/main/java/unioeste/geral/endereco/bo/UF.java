package unioeste.geral.endereco.bo;

import java.io.Serializable;

public class UF implements Serializable {
    private int idUF;
    private String uf;

    public UF() {}

    public UF(int idUF, String uf) {
        this.idUF = idUF;
        this.uf = uf;
    }

    public int getIdUF() { return idUF; }
    public void setIdUF(int idUF) { this.idUF = idUF; }

    public String getUf() { return uf; }
    public void setUf(String uf) { this.uf = uf; }
}
