package unioeste.geral.endereco.dao;

import unioeste.geral.endereco.bo.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EnderecoDAO {
    private final Connection conexao;

    public EnderecoDAO(Connection conexao) {
        this.conexao = conexao;
    }

    private static final String SQL_BASE_SELECT =
            "SELECT e.idEndereco, e.Tipo_endereco, e.CEP, e.Numero, e.Complemento, " +
                    "       b.idBairro, b.Bairro, " +
                    "       l.idLogradouro, l.Logradouro, " +
                    "       tl.idTipo_logradouro, tl.Tipo_logradouro, " +
                    "       c.idCidade, c.Cidade, " +
                    "       u.idUF, u.UF " +
                    "FROM Endereco e " +
                    "INNER JOIN Bairro b ON e.Bairro_idBairro = b.idBairro " +
                    "INNER JOIN Logradouro l ON e.Logradouro_idLogradouro = l.idLogradouro " +
                    "INNER JOIN Tipo_logradouro tl ON e.Logradouro_Tipo_logradouro_idTipo_logradouro = tl.idTipo_logradouro " +
                    "INNER JOIN Cidade c ON e.Cidade_idCidade = c.idCidade " +
                    "INNER JOIN UF u ON e.Cidade_UF_idUF = u.idUF ";

    public Endereco inserir(Endereco end) throws SQLException {
        String sql = "INSERT INTO Endereco (Tipo_endereco, CEP, Numero, Complemento, " +
                "Bairro_idBairro, Logradouro_idLogradouro, Logradouro_Tipo_logradouro_idTipo_logradouro, " +
                "Cidade_idCidade, Cidade_UF_idUF) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement stmt = conexao.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            if (end.getTipoEndereco() != null) {
                stmt.setInt(1, end.getTipoEndereco());
            } else {
                stmt.setNull(1, Types.TINYINT);
            }
            stmt.setString(2, end.getCep().replaceAll("[^0-9]", ""));
            stmt.setString(3, end.getNumero());
            stmt.setString(4, end.getComplemento());
            stmt.setInt(5, end.getBairro().getIdBairro());
            stmt.setInt(6, end.getLogradouro().getIdLogradouro());
            stmt.setInt(7, end.getLogradouro().getTipoLogradouro().getIdTipoLogradouro());
            stmt.setInt(8, end.getCidade().getIdCidade());
            stmt.setInt(9, end.getCidade().getUf().getIdUF());

            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    end.setIdEndereco(keys.getInt(1));
                }
            }
        }
        return selecionarPorId(end.getIdEndereco());
    }

    public Endereco selecionarPorId(int idEndereco) throws SQLException {
        String sql = SQL_BASE_SELECT + "WHERE e.idEndereco = ?";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setInt(1, idEndereco);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapearEndereco(rs);
                }
            }
        }
        return null;
    }

    public List<Endereco> selecionarPorCEP(String cep) throws SQLException {
        String sql = SQL_BASE_SELECT + "WHERE e.CEP = ?";
        List<Endereco> lista = new ArrayList<>();
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, cep.replaceAll("[^0-9]", ""));
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    lista.add(mapearEndereco(rs));
                }
            }
        }
        return lista;
    }

    private Endereco mapearEndereco(ResultSet rs) throws SQLException {
        UF uf = new UF(rs.getInt("idUF"), rs.getString("UF"));
        Cidade cidade = new Cidade(rs.getInt("idCidade"), rs.getString("Cidade"), uf);
        Bairro bairro = new Bairro(rs.getInt("idBairro"), rs.getString("Bairro"));
        TipoLogradouro tipoLog = new TipoLogradouro(rs.getInt("idTipo_logradouro"), rs.getString("Tipo_logradouro"));
        Logradouro logradouro = new Logradouro(rs.getInt("idLogradouro"), rs.getString("Logradouro"), tipoLog);

        Endereco end = new Endereco();
        end.setIdEndereco(rs.getInt("idEndereco"));
        end.setTipoEndereco(rs.getObject("Tipo_endereco") != null ? rs.getInt("Tipo_endereco") : null);
        end.setCep(rs.getString("CEP"));
        end.setNumero(rs.getString("Numero"));
        end.setComplemento(rs.getString("Complemento"));
        end.setBairro(bairro);
        end.setLogradouro(logradouro);
        end.setCidade(cidade);
        return end;
    }
}