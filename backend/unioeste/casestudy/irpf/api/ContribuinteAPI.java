package unioeste.casestudy.irpf.api;

import unioeste.casestudy.irpf.bo.Contribuinte;
import unioeste.casestudy.irpf.manager.ContribuinteManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // classe responde a requisições Web/JSON
@RequestMapping("/api/contribuintes")
@CrossOrigin(origins = "http://localhost:5173") // libera o acesso
public class ContribuinteAPI {

    private final ContribuinteManager manager;

    public ContribuinteAPI(ContribuinteManager manager) {
        this.manager = manager;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody Contribuinte contribuinte) {
        try {
            // camada de negócio
            Contribuinte salvo = manager.salvarContribuinte(contribuinte);
            return ResponseEntity.ok(salvo);
        } catch (Exception e) {
            // se o CPF for inválido, devolve erro 400 (Bad Request) para o React exibir o Toast vermelho
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}