package backend.unioeste.casestudy.irpf.manager;

import unioeste.casestudy.irpf.bo.Contribuinte;
import unioeste.casestudy.irpf.dao.ContribuinteDAO;
import org.springframework.stereotype.Service;

@Service
public class ContribuinteManager {
    private final ContribuinteDAO contribuinteDAO;

    public ContribuinteManager(ContribuinteDAO contribuinteDAO) {
        this.contribuinteDAO = contribuinteDAO;
    }

    public Contribuinte salvarContribuinte(Contribuinte contribuinte) throws Exception {
        
        if(contribuinte.getCpf() == null || contribuinte.getCpf().isEmpty() || !isCpfValido(contribuinte.getCpf())) {
            throw new Exception("CPF inválido. A declaração não pode prosseguir.");
        }

        contribuinteDAO.salvarContribuinte(contribuinte);
        return contribuinte;
    }

    private boolean isCpfValido(String cpf) {
        
        return cpf.length() == 11;
    }
}
