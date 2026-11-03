package unioeste.geral.endereco.manager;

import org.junit.jupiter.api.Test;
import unioeste.geral.endereco.bo.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class UCEnderecoGeralServicosTest {

    private final UCEnderecoGeralServicos servicos = new UCEnderecoGeralServicos();

    @Test
    public void testObterCidadeValida() throws Exception {
        Cidade filtro = new Cidade();
        filtro.setIdCidade(1);
        Cidade resultado = servicos.obterCidade(filtro);
        assertNotNull(resultado);
        assertEquals("Foz do Iguaçu", resultado.getCidade());
        assertNotNull(resultado.getUf());
    }

    @Test
    public void testCadastrarEObterEnderecoPorIdECep() throws Exception {
        Endereco novo = new Endereco();
        novo.setCep("85851000");
        novo.setTipoEndereco(1);
        novo.setNumero("500");
        novo.setComplemento("Apto 10");
        novo.setBairro(new Bairro(1, null));
        novo.setLogradouro(new Logradouro(1, null, new TipoLogradouro(1, null)));
        novo.setCidade(new Cidade(1, null, new UF(1, null)));

        Endereco salvo = servicos.cadastrarEndereco(novo);
        assertNotNull(salvo);
        assertTrue(salvo.getIdEndereco() > 0);

        Endereco buscaId = new Endereco();
        buscaId.setIdEndereco(salvo.getIdEndereco());
        Endereco porId = servicos.obterEnderecoPorID(buscaId);
        assertEquals("85851000", porId.getCep());

        List<Endereco> listaCep = servicos.obterEnderecoPorCEP("85851000");
        assertFalse(listaCep.isEmpty());
    }

    @Test
    public void testObterEnderecoExternoViaCep() throws Exception {
        EnderecoEspecifico externo = servicos.obterEnderecoExterno("85851000");
        assertNotNull(externo);
        assertNotNull(externo.getEndereco());
        assertEquals("85851000", externo.getEndereco().getCep());
    }

    @Test
    public void testValidacaoCepInvalidoLancaEnderecoException() {
        assertThrows(EnderecoException.class, () -> servicos.obterEnderecoPorCEP("123"));
    }
}
