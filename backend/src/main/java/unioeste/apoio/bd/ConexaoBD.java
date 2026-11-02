package unioeste.apoio.bd;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

public class ConexaoBD {
    private static final HikariDataSource dataSource;

    static {
        try (InputStream input = ConexaoBD.class.getClassLoader().getResourceAsStream("database.properties")) {
            Properties props = new Properties();
            if (input == null) {
                throw new RuntimeException("Arquivo database.properties não encontrado em resources!");
            }
            props.load(input);

            HikariConfig config = new HikariConfig();
            String url = props.getProperty("db.url", props.getProperty("url"));
            String user = props.getProperty("db.user", props.getProperty("user", props.getProperty("username")));
            String pass = props.getProperty("db.password", props.getProperty("password"));

            config.setJdbcUrl(url);
            config.setUsername(user);
            config.setPassword(pass);
            config.setMaximumPoolSize(Integer.parseInt(props.getProperty("db.pool.size", "10")));

            dataSource = new HikariDataSource(config);
        } catch (Exception e) {
            throw new ExceptionInInitializerError("Erro ao inicializar pool de conexões: " + e.getMessage());
        }
    }

    public static Connection getConexao() throws SQLException {
        return dataSource.getConnection();
    }
}