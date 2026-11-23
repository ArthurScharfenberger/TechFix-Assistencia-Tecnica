package com.techfix.dominio;

public class Tecnico {
    private String nome;
    private String especialidade;

    public Tecnico(String nome, String especialidade) {
        if (nome == null || nome.isBlank()) {
            throw new DadosInvalidosException("Nome inválido. Revise os dados informados e tente novamente.");
        }
        if (especialidade == null || especialidade.isBlank()) {
            throw new DadosInvalidosException("Especialidade inválida. Revise os dados informados e tente novamente.");
        }

        this.nome = nome;
        this.especialidade = especialidade;
    }

    public void exibirDados() {
        System.out.println("  Nome:          " + nome);
        System.out.println("  Especialidade: " + especialidade);
    }

    public String getNome() {
        return nome;
    }
}
