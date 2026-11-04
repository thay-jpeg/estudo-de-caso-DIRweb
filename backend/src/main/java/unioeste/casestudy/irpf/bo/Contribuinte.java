package unioeste.casestudy.irpf.bo;

import unioeste.apoio.bd.bo.PessoaFisica;

public class Contribuinte {
    
    private Integer idContribuinte;
    private PessoaFisica pessoaFisica; // associação 1..1

    public Contribuinte() {}

    // Getters e Setters
    public Integer getIdContribuinte() {
        return idContribuinte;
    }

    public void setIdContribuinte(Integer idContribuinte) {
        this.idContribuinte = idContribuinte;
    }

    public PessoaFisica getPessoaFisica() {
        return pessoaFisica;
    }

    public void setPessoaFisica(PessoaFisica pessoaFisica) {
        this.pessoaFisica = pessoaFisica;
    }

    public String getCpf() {
        if (this.pessoaFisica != null) {
            return this.pessoaFisica.getCpf();
        }
        return null; 
    }
    
    public String getNomeCompleto() {
        if (this.pessoaFisica != null) {
            return this.pessoaFisica.getNome() + " " + this.pessoaFisica.getSobrenome();
        }
        return null;
    }
}