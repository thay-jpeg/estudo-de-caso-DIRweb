package unioeste.casestudy.irpf.dao;

import unioeste.casestudy.irpf.bo.Contribuinte;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class ContribuinteDAO {
    private final Connection conexao;

    public ContribuinteDAO(Connection conexao) {
        this.conexao = conexao;
    }

    public void salvarContribuinte(Contribuinte contribuinte) throws SQLException {
        String sql = "INSERT INTO Pessoa_Fisica (CPF) VALUES (?)";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, contribuinte.getCpf());
            stmt.executeUpdate();
        }
    }
}