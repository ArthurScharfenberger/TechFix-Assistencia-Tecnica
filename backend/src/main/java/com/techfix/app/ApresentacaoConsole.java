package com.techfix.app;

import com.techfix.dominio.*;
import com.techfix.repositorio.RepositorioException;
import com.techfix.servico.ServicoOrdens;
import java.io.PrintStream;
import java.math.BigDecimal;

/** Cenário demonstrável com saída injetada e recuperação por operação. */
public final class ApresentacaoConsole {
    private final ServicoOrdens servico;
    private final PrintStream saida;

    public ApresentacaoConsole(ServicoOrdens servico, PrintStream saida) {
        this.servico = servico;
        this.saida = saida;
    }

    public void executar() {
        saida.println("TECHFIX | Atendimento com tratamento de erros");
        tentar("Cliente sem nome", () -> new Cliente("", "51999999999", "ana@example.com"));
        tentar("Item com valor negativo", () -> {
            var ordem = novaOrdem(1);
            ordem.adicionarItemServico("Limpeza", new BigDecimal("-1.00"));
        });
        tentar("Conclusão antes do atendimento", () -> servico.concluir(novaOrdem(1)));
        tentar("Atendimento completo", () -> {
            var ordem = novaOrdem(servico.proximoNumero());
            ordem.adicionarItemServico("Limpeza interna", new BigDecimal("40.00"));
            ordem.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);
            var registro = servico.concluir(ordem);
            saida.printf("OS %d | %s | %s | R$ %s%n", registro.numero(), registro.cliente(),
                registro.status(), registro.total().toPlainString());
        });
        tentar("Histórico", () -> saida.println("Ordens salvas: " + servico.listar().size()));
        saida.println("Programa continuou após os erros previsíveis.");
    }

    private OrdemServico novaOrdem(int numero) {
        var cliente = new Cliente("Ana", "51999999999", "ana@example.com");
        var ordem = new OrdemServico(numero, cliente,
            new Tecnico("Carlos", "Computadores"), new Notebook("Dell", "Aquece", 8));
        cliente.adicionarOrdemServico(ordem);
        return ordem;
    }

    private void tentar(String operacao, Runnable acao) {
        saida.println("\n" + operacao);
        try {
            acao.run();
        } catch (RegraNegocioException erro) {
            saida.println("Regra de negócio: " + erro.getMessage());
        } catch (RepositorioException erro) {
            saida.println("Falha técnica: " + erro.getMessage());
        }
    }
}
