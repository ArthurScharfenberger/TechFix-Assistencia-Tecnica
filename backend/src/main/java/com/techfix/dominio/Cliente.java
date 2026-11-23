package com.techfix.dominio;

import java.util.ArrayList;
import java.util.List;

public class Cliente {
    private String nome;
    private String telefone;
    private String email;
    private final List<OrdemServico> ordensServico = new ArrayList<>();

    public Cliente(String nome, String telefone, String email) {
        if (nome == null || nome.isBlank()) {
            throw new DadosInvalidosException("Nome inválido. Revise os dados informados e tente novamente.");
        }
        if (telefone == null || telefone.isBlank()) {
            throw new DadosInvalidosException("Telefone inválido. Revise os dados informados e tente novamente.");
        }
        if (email == null || email.isBlank()) {
            throw new DadosInvalidosException("Email inválido. Revise os dados informados e tente novamente.");
        }

        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
    }

    public void adicionarOrdemServico(OrdemServico ordemServico) {
        if (ordemServico == null) {
            throw new DadosInvalidosException("Ordem de serviço não pode ser nula. Revise os dados informados e tente novamente.");
        }

        ordensServico.add(ordemServico);
    }

    public void exibirDados() {
        System.out.println("  Nome:     " + nome);
        System.out.println("  Telefone: " + telefone);
        System.out.println("  E-mail:   " + email);
    }

    public String getNome() {
        return nome;
    }
}
