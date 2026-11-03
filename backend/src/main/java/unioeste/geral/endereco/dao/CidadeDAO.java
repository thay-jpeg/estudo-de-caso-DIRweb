package unioeste.geral.endereco.dao;

import unioeste.geral.endereco.bo.Cidade;
import unioeste.geral.endereco.bo.UF;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class CidadeDAO {
    private final Connection conexao;

    public CidadeDAO(Connection conexao) {
        this.conexao = conexao;
    }

    public Cidade selecionarPorId(int idCidade) throws SQLException {
        String sql = "SELECT c.idCidade, c.Cidade, u.idUF, u.UF " +
                "FROM Cidade c " +
                "INNER JOIN UF u ON c.UF_idUF = u.idUF " +
                "WHERE c.idCidade = ?";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setInt(1, idCidade);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    UF uf = new UF(rs.getInt("idUF"), rs.getString("UF"));
                    return new Cidade(rs.getInt("idCidade"), rs.getString("Cidade"), uf);
                }
            }
        }
        return null;
    }
}