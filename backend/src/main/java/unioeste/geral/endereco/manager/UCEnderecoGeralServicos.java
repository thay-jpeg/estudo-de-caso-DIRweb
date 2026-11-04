package unioeste.geral.endereco.manager;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import unioeste.apoio.bd.ConexaoBD;
import unioeste.geral.endereco.bo.Endereco;
import unioeste.geral.endereco.bo.EnderecoEspecifico;
import unioeste.geral.endereco.bo.UF;
import unioeste.geral.endereco.bo.Cidade;
import unioeste.geral.endereco.bo.Logradouro;
import unioeste.geral.endereco.bo.Bairro;
import unioeste.geral.endereco.bo.TipoLogradouro;
import unioeste.geral.endereco.col.CidadeCol;
import unioeste.geral.endereco.col.EnderecoCol;
import unioeste.geral.endereco.dao.CidadeDAO;
import unioeste.geral.endereco.dao.EnderecoDAO;


import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.Connection;
import java.util.List;

public class UCEnderecoGeralServicos {

    private final EnderecoCol enderecoCol = new EnderecoCol();
    private final CidadeCol cidadeCol = new CidadeCol();

    // 1. cadastrarEndereco
    public Endereco cadastrarEndereco(Endereco endereco) throws EnderecoException, Exception {
        if (!enderecoCol.validarEnderecoParaCadastro(endereco)) {
            throw new EnderecoException("Dados de endereço inválidos ou incompletos para cadastro.");
        }

        try (Connection conn = ConexaoBD.getConexao()) {
            conn.setAutoCommit(false);
            try {
                CidadeDAO cidadeDAO = new CidadeDAO(conn);
                if (cidadeDAO.selecionarPorId(endereco.getCidade().getIdCidade()) == null) {
                    throw new EnderecoException("Cidade informada não está cadastrada no banco.");
                }

                EnderecoDAO enderecoDAO = new EnderecoDAO(conn);
                Endereco cadastrado = enderecoDAO.inserir(endereco);
                conn.commit();
                return cadastrado;
            } catch (EnderecoException e) {
                conn.rollback();
                throw e;
            } catch (Exception e) {
                conn.rollback();
                throw new Exception("Erro de infraestrutura ao cadastrar endereço: " + e.getMessage(), e);
            }
        }
    }

    // 2. obterEnderecoPorCEP
    public List<Endereco> obterEnderecoPorCEP(String cep) throws EnderecoException, Exception {
        if (!enderecoCol.validarCEP(cep)) {
            throw new EnderecoException("Formato de CEP inválido. Informe 8 dígitos numéricos.");
        }

        try (Connection conn = ConexaoBD.getConexao()) {
            EnderecoDAO enderecoDAO = new EnderecoDAO(conn);
            return enderecoDAO.selecionarPorCEP(cep);
        } catch (Exception e) {
            throw new Exception("Erro de infraestrutura ao consultar endereço por CEP: " + e.getMessage(), e);
        }
    }

    // 3. obterEnderecoPorID
    public Endereco obterEnderecoPorID(Endereco endereco) throws EnderecoException, Exception {
        if (endereco == null || !enderecoCol.validarId(endereco.getIdEndereco())) {
            throw new EnderecoException("ID de endereço inválido para consulta.");
        }

        try (Connection conn = ConexaoBD.getConexao()) {
            EnderecoDAO enderecoDAO = new EnderecoDAO(conn);
            Endereco encontrado = enderecoDAO.selecionarPorId(endereco.getIdEndereco());
            if (encontrado == null) {
                throw new EnderecoException("Endereço não encontrado para o ID informado.");
            }
            return encontrado;
        } catch (EnderecoException e) {
            throw e;
        } catch (Exception e) {
            throw new Exception("Erro de infraestrutura ao consultar endereço por ID: " + e.getMessage(), e);
        }
    }

    // 4. obterEnderecoExterno (ViaCEP)
    public EnderecoEspecifico obterEnderecoExterno(String cepOuUrl) throws EnderecoException, Exception {
        if (cepOuUrl == null || cepOuUrl.isBlank()) {
            throw new EnderecoException("Parâmetro de pesquisa externa não pode ser vazio.");
        }

        String url;
        String apenasDigitos = cepOuUrl.replaceAll("[^0-9]", "");
        if (cepOuUrl.startsWith("http://") || cepOuUrl.startsWith("https://")) {
            url = cepOuUrl;
        } else if (apenasDigitos.length() == 8) {
            url = "https://viacep.com.br/ws/" + apenasDigitos + "/json/";
        } else {
            throw new EnderecoException("Informe um CEP válido de 8 dígitos ou uma URL válida.");
        }

        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new EnderecoException("Serviço externo retornou status HTTP " + response.statusCode());
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body());
            if (root.has("erro") && root.get("erro").asBoolean()) {
                throw new EnderecoException("CEP não encontrado no serviço externo (ViaCEP).");
            }

            UF uf = new UF(0, root.path("uf").asText(""));
            Cidade cidade = new Cidade(0, root.path("localidade").asText(""), uf);
            Bairro bairro = new Bairro(0, root.path("bairro").asText(""));

            String logradouroCompleto = root.path("logradouro").asText("");
            String[] partes = logradouroCompleto.split(" ", 2);
            TipoLogradouro tipoLog = new TipoLogradouro(0, partes.length > 1 ? partes[0] : "");
            Logradouro logradouro = new Logradouro(0, partes.length > 1 ? partes[1] : logradouroCompleto, tipoLog);

            Endereco end = new Endereco();
            end.setCep(root.path("cep").asText("").replaceAll("[^0-9]", ""));
            end.setBairro(bairro);
            end.setLogradouro(logradouro);
            end.setCidade(cidade);
            end.setComplemento(root.path("complemento").asText(""));

            return new EnderecoEspecifico(end, "", root.path("complemento").asText(""));
        } catch (EnderecoException e) {
            throw e;
        } catch (Exception e) {
            throw new Exception("Erro de infraestrutura ao consultar webservice externo: " + e.getMessage(), e);
        }
    }

    // 5. obterCidade
    public Cidade obterCidade(Cidade cidade) throws EnderecoException, Exception {
        if (!cidadeCol.validarCidadeParaConsulta(cidade)) {
            throw new EnderecoException("Objeto Cidade inválido ou sem idCidade definido.");
        }

        try (Connection conn = ConexaoBD.getConexao()) {
            CidadeDAO cidadeDAO = new CidadeDAO(conn);
            Cidade encontrada = cidadeDAO.selecionarPorId(cidade.getIdCidade());
            if (encontrada == null) {
                throw new EnderecoException("Cidade não encontrada para o ID informado.");
            }
            return encontrada;
        } catch (EnderecoException e) {
            throw e;
        } catch (Exception e) {
            throw new Exception("Erro de infraestrutura ao consultar cidade: " + e.getMessage(), e);
        }
    }
}