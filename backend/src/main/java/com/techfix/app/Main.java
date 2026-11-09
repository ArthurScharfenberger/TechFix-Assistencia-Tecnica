package com.techfix.app;

import com.techfix.dominio.Cliente;
import com.techfix.dominio.Notebook;
import com.techfix.dominio.OrdemServico;
import com.techfix.dominio.RepositorioOrdens;
import com.techfix.dominio.ServicoOrdens;
import com.techfix.dominio.StatusOrdemServico;
import com.techfix.dominio.Tecnico;
import com.techfix.repositorio.RepositorioOrdensEmArquivo;
import java.math.BigDecimal;
import java.nio.file.Path;

public class Main {
    public static void main(String[] args) {
        Path arquivo = Path.of(args.length > 0 ? args[0] : "dados/ordens.tsv");
        // Único ponto de escolha da implementação na aplicação.
        RepositorioOrdens repositorio = new RepositorioOrdensEmArquivo(arquivo);
        ServicoOrdens servico = new ServicoOrdens(repositorio);

        System.out.println("TECHFIX | Historico de ordens concluidas");
        System.out.println("Arquivo: " + arquivo);
        System.out.println("Registros antes: " + servico.listar().size());

        var cliente = new Cliente("João Silva", "5199999-9999", "joao@example.com");
        var tecnico = new Tecnico("Carlos Souza", "Manutenção de computadores");
        var notebook = new Notebook("Dell", "Não liga", 16);
        var ordem = new OrdemServico(servico.proximoNumero(), cliente, tecnico, notebook);
        cliente.adicionarOrdemServico(ordem);
        ordem.adicionarItemServico("Limpeza interna", new BigDecimal("40.00"));
        ordem.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);
        System.out.println("OS " + ordem.getNumero() + ": ABERTA -> " + ordem.getStatus());
        ordem.getRoteiroDiagnostico().forEach(etapa -> System.out.println("  - " + etapa));
        servico.concluir(ordem);
        System.out.println("OS " + ordem.getNumero() + " salva: " + ordem.getStatus());

        var registros = servico.listar();
        System.out.println("Registros depois: " + registros.size());
        registros.forEach(registro -> System.out.printf("OS %d | %s | %s | %s | R$ %s%n",
            registro.numero(), registro.cliente(), registro.equipamento(),
            registro.status(), registro.total().toPlainString()));
    }
}
