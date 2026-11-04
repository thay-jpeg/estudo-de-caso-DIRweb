package unioeste.casestudy.irpf.manager;

import unioeste.casestudy.irpf.bo.Contribuinte;

public class ContribuinteManager {

    public Contribuinte salvarContribuinte(Contribuinte contribuinte) throws Exception {
        if (contribuinte == null) {
            throw new Exception("Contribuinte inválido.");
        }
        return contribuinte;
    }
}