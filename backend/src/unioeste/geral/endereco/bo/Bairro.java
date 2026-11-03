package unioeste.geral.endereco.bo;

import java.io.Serializable;

public class Bairro implements Serializable {
    private int idBairro;
    private String bairro;

    public Bairro() {}

    public Bairro(int idBairro, String bairro) {
        this.idBairro = idBairro;
        this.bairro = bairro;
    }

    public int getIdBairro() { return idBairro; }
    public void setIdBairro(int idBairro) { this.idBairro = idBairro; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }
}