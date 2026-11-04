package unioeste.casestudy.irpf.api;

import io.javalin.Javalin;
import unioeste.casestudy.irpf.bo.Contribuinte;
import unioeste.casestudy.irpf.manager.ContribuinteManager;

public class ContribuinteController {

    private final ContribuinteManager manager;

    public ContribuinteController(ContribuinteManager manager) {
        this.manager = manager;
    }

    public void registrarRotas(Javalin app) {
        app.post("/api/contribuintes", ctx -> {
            try {
                Contribuinte contribuinte = ctx.bodyAsClass(Contribuinte.class);
                Contribuinte salvo = manager.salvarContribuinte(contribuinte);
                ctx.status(200).json(salvo);
            } catch (Exception e) {
                ctx.status(400).result(e.getMessage());
            }
        });
    }
}