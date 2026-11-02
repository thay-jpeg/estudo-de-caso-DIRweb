package unioeste.geral.endereco.bo;

import java.io.Serializable;

public class TipoLogradouro implements Serializable {
    private int idTipoLogradouro;
    private String tipoLogradouro;

    public TipoLogradouro() {}

    public TipoLogradouro(int idTipoLogradouro, String tipoLogradouro) {
        this.idTipoLogradouro = idTipoLogradouro;
        this.tipoLogradouro = tipoLogradouro;
    }

    public int getIdTipoLogradouro() { return idTipoLogradouro; }
    public void setIdTipoLogradouro(int idTipoLogradouro) { this.idTipoLogradouro = idTipoLogradouro; }

    public String getTipoLogradouro() { return tipoLogradouro; }
    public void setTipoLogradouro(String tipoLogradouro) { this.tipoLogradouro = tipoLogradouro; }
}
