package unioeste.geral.endereco.api;

import io.javalin.Javalin;
import unioeste.geral.endereco.bo.Cidade;
import unioeste.geral.endereco.bo.Endereco;
import unioeste.geral.endereco.manager.EnderecoException;
import unioeste.geral.endereco.manager.UCEnderecoGeralServicos;

import java.util.Map;

public class EnderecoController {

    public static void main(String[] args) {
        UCEnderecoGeralServicos servicos = new UCEnderecoGeralServicos();

        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> cors.addRule(it -> it.anyHost()));
        }).start(8080);

        // 1. cadastrarEndereco
        app.post("/api/endereco/cadastrarEndereco", ctx -> {
            Endereco entrada = ctx.bodyAsClass(Endereco.class);
            Endereco salvo = servicos.cadastrarEndereco(entrada);
            ctx.status(201).json(salvo);
        });

        // 2. obterEnderecoPorCEP
        app.get("/api/endereco/obterEnderecoPorCEP/{cep}", ctx -> {
            String cep = ctx.pathParam("cep");
            ctx.json(servicos.obterEnderecoPorCEP(cep));
        });

        // 3. obterEnderecoPorID
        app.get("/api/endereco/obterEnderecoPorID/{id}", ctx -> {
            Endereco filtro = new Endereco();
            filtro.setIdEndereco(Integer.parseInt(ctx.pathParam("id")));
            ctx.json(servicos.obterEnderecoPorID(filtro));
        });

        // 4. obterEnderecoExterno
        app.get("/api/endereco/obterEnderecoExterno/{cep}", ctx -> {
            String cep = ctx.pathParam("cep");
            ctx.json(servicos.obterEnderecoExterno(cep));
        });

        // 5. obterCidade
        app.get("/api/endereco/obterCidade/{idCidade}", ctx -> {
            Cidade filtro = new Cidade();
            filtro.setIdCidade(Integer.parseInt(ctx.pathParam("idCidade")));
            ctx.json(servicos.obterCidade(filtro));
        });

        app.exception(EnderecoException.class, (e, ctx) ->
                ctx.status(400).json(Map.of("erro", "Validação", "mensagem", e.getMessage()))
        );
        app.exception(Exception.class, (e, ctx) ->
                ctx.status(500).json(Map.of("erro", "Infraestrutura", "mensagem", e.getMessage()))
        );
    }
}
