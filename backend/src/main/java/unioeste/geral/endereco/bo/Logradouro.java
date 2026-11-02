package unioeste.geral.endereco.bo;

import java.io.Serializable;

public class Logradouro implements Serializable {
    private int idLogradouro;
    private String logradouro;
    private TipoLogradouro tipoLogradouro;

    public Logradouro() {}

    public Logradouro(int idLogradouro, String logradouro, TipoLogradouro tipoLogradouro) {
        this.idLogradouro = idLogradouro;
        this.logradouro = logradouro;
        this.tipoLogradouro = tipoLogradouro;
    }

    public int getIdLogradouro() { return idLogradouro; }
    public void setIdLogradouro(int idLogradouro) { this.idLogradouro = idLogradouro; }

    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }

    public TipoLogradouro getTipoLogradouro() { return tipoLogradouro; }
    public void setTipoLogradouro(TipoLogradouro tipoLogradouro) { this.tipoLogradouro = tipoLogradouro; }
}
