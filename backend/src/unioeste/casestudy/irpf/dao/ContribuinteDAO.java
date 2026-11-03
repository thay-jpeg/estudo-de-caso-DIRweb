package unioeste.casestudy.irpf.dao;

import unioeste.casestudy.irpf.bo.Contribuinte;
import java.sql.Connection;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ContribuinteDAO {
    private final JdbcTemplate jdbcTemplate;

    public ContribuinteDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void salvarContribuinte(Contribuinte contribuinte) {
        String sql = "INSERT INTO contribuinte (nome, cpf, renda) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, contribuinte.getNome(), contribuinte.getCpf(), contribuinte.getRenda());
    }
}
