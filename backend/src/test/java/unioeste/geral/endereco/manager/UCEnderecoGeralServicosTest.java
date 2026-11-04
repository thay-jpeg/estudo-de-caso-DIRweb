package unioeste.geral.endereco.manager;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import unioeste.geral.endereco.bo.Bairro;
import unioeste.geral.endereco.bo.Cidade;
import unioeste.geral.endereco.bo.Endereco;
import unioeste.geral.endereco.bo.EnderecoEspecifico;
import unioeste.geral.endereco.bo.Logradouro;
import unioeste.geral.endereco.bo.TipoLogradouro;
import unioeste.geral.endereco.bo.UF;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UCEnderecoGeralServicosTest {

    private final UCEnderecoGeralServicos servicos = new UCEnderecoGeralServicos();
    private static int idEnderecoCadastrado = 1;

    @Test
    @Order(1)
    @DisplayName("1. servico: cadastrarEndereco (Inserção no MySQL + Validação)")
    public void testCadastrarEndereco() throws Exception {
        Endereco novo = new Endereco();
        novo.setCep("85851000");
        novo.setTipoEndereco(1);
        novo.setNumero("500");
        novo.setComplemento("Bloco A");
        novo.setBairro(new Bairro(1, null));
        novo.setLogradouro(new Logradouro(1, null, new TipoLogradouro(1, null)));
        novo.setCidade(new Cidade(1, null, new UF(1, null)));

        Endereco salvo = servicos.cadastrarEndereco(novo);

        assertNotNull(salvo);
        assertTrue(salvo.getIdEndereco() > 0);
        idEnderecoCadastrado = salvo.getIdEndereco();

        System.out.println("=== [1. cadastrarEndereco] SUCESSO ===");
        System.out.println("ID Gerado no MySQL: " + salvo.getIdEndereco());
        System.out.println("Endereço Composto: "
                + salvo.getLogradouro().getTipoLogradouro().getTipoLogradouro() + " "
                + salvo.getLogradouro().getLogradouro() + ", Nº " + salvo.getNumero()
                + " (" + salvo.getComplemento() + ") - Bairro: " + salvo.getBairro().getBairro()
                + " - " + salvo.getCidade().getCidade() + "/" + salvo.getCidade().getUf().getUf()
                + " - CEP: " + salvo.getCep());
    }

    @Test
    @Order(2)
    @DisplayName("2. servico: obterEnderecoPorCEP (Consulta lista por CEP no MySQL)")
    public void testObterEnderecoPorCEP() throws Exception {
        List<Endereco> lista = servicos.obterEnderecoPorCEP("85851000");

        assertNotNull(lista);
        assertFalse(lista.isEmpty());
        assertEquals("85851000", lista.get(0).getCep());

        System.out.println("=== [2. obterEnderecoPorCEP] SUCESSO ===");
        System.out.println("CEP pesquisado: 85851000 | Total encontrado no banco: " + lista.size());
        for (Endereco e : lista) {
            System.out.println(" -> ID " + e.getIdEndereco() + ": "
                    + e.getLogradouro().getTipoLogradouro().getTipoLogradouro() + " "
                    + e.getLogradouro().getLogradouro() + ", " + e.getNumero()
                    + " - " + e.getCidade().getCidade() + "/" + e.getCidade().getUf().getUf());
        }
    }

    @Test
    @Order(3)
    @DisplayName("3. servico: obterEnderecoPorID (Busca endereço específico pelo ID)")
    public void testObterEnderecoPorID() throws Exception {
        Endereco filtro = new Endereco();
        filtro.setIdEndereco(idEnderecoCadastrado);

        Endereco encontrado = servicos.obterEnderecoPorID(filtro);

        assertNotNull(encontrado);
        assertEquals(idEnderecoCadastrado, encontrado.getIdEndereco());
        assertEquals("85851000", encontrado.getCep());

        System.out.println("=== [3. obterEnderecoPorID] SUCESSO ===");
        System.out.println("ID Pesquisado: " + idEnderecoCadastrado);
        System.out.println("Logradouro: " + encontrado.getLogradouro().getTipoLogradouro().getTipoLogradouro()
                + " " + encontrado.getLogradouro().getLogradouro());
        System.out.println("Bairro: " + encontrado.getBairro().getBairro());
        System.out.println("Cidade/UF: " + encontrado.getCidade().getCidade() + " - " + encontrado.getCidade().getUf().getUf());
    }

    @Test
    @Order(4)
    @DisplayName("4. servico: obterEnderecoExterno (Consulta nuvem ViaCEP -> EnderecoEspecifico)")
    public void testObterEnderecoExterno() throws Exception {
        EnderecoEspecifico externo = servicos.obterEnderecoExterno("85851000");

        assertNotNull(externo);
        assertNotNull(externo.getEndereco());
        assertEquals("85851000", externo.getEndereco().getCep());

        Endereco end = externo.getEndereco();
        System.out.println("=== [4. obterEnderecoExterno - ViaCEP] SUCESSO ===");
        System.out.println("CEP Retornado da Nuvem: " + end.getCep());
        System.out.println("Tipo + Logradouro: " + end.getLogradouro().getTipoLogradouro().getTipoLogradouro()
                + " " + end.getLogradouro().getLogradouro());
        System.out.println("Bairro: " + end.getBairro().getBairro());
        System.out.println("Cidade/UF: " + end.getCidade().getCidade() + " / " + end.getCidade().getUf().getUf());
    }

    @Test
    @Order(5)
    @DisplayName("5. servico: obterCidade (Busca Cidade com UF relacionado no MySQL)")
    public void testObterCidade() throws Exception {
        Cidade filtro = new Cidade();
        filtro.setIdCidade(1);

        Cidade resultado = servicos.obterCidade(filtro);

        assertNotNull(resultado);
        assertEquals(1, resultado.getIdCidade());
        assertEquals("Foz do Iguaçu", resultado.getCidade());
        assertNotNull(resultado.getUf());
        assertEquals("PR", resultado.getUf().getUf());

        System.out.println("=== [5. obterCidade] SUCESSO ===");
        System.out.println("ID Cidade: " + resultado.getIdCidade()
                + " | Nome: " + resultado.getCidade()
                + " | UF Relacionada: " + resultado.getUf().getUf() + " (ID UF: " + resultado.getUf().getIdUF() + ")");
    }

    @Test
    @Order(6)
    @DisplayName("6. Validacao (Col): Deve lancar EnderecoException quando CEP ou dados forem invalidos")
    public void testValidacaoLancaEnderecoException() {
        EnderecoException erro = assertThrows(EnderecoException.class, () -> {
            servicos.obterEnderecoPorCEP("123");
        });

        System.out.println("=== [6. Teste de Validação EnderecoException] SUCESSO ===");
        System.out.println("Exceção capturada corretamente pela camada Col: " + erro.getMessage());
    }
}