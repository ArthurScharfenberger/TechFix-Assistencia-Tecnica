package com.techfix.app;

import com.techfix.repositorio.RepositorioOrdensEmArquivo;
import com.techfix.servico.ServicoOrdens;
import java.nio.file.Path;

public final class Main {
    public static void main(String[] args) {
        Path arquivo = Path.of(args.length > 0 ? args[0] : "dados/ordens.tsv");
        var repositorio = new RepositorioOrdensEmArquivo(arquivo);
        var servico = new ServicoOrdens(repositorio);
        new ApresentacaoConsole(servico, System.out).executar();
    }
}
