package com.techfix.repositorio;

import com.techfix.dominio.*;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import static org.junit.jupiter.api.Assertions.*;

class RepositorioOrdensEmArquivoTest {
    @TempDir
    Path pasta;

    private RegistroOrdem registro(int numero, String cliente) {
        return new RegistroOrdem(numero, cliente, TipoEquipamento.NOTEBOOK,
            StatusOrdemServico.CONCLUIDA, new BigDecimal("120.00"));
    }

    @Test
    void dadosSobrevivemANovaInstanciaESegundaGravacaoPreservaPrimeira() {
        Path arquivo = pasta.resolve("dados/ordens.tsv");
        var primeiro = registro(1, "João Silva");
        var segundo = registro(2, "Ana");
        new RepositorioOrdensEmArquivo(arquivo).salvar(primeiro);

        var novaInstancia = new RepositorioOrdensEmArquivo(arquivo);
        assertEquals(List.of(primeiro), novaInstancia.listar());
        novaInstancia.salvar(segundo);

        assertEquals(List.of(primeiro, segundo), new RepositorioOrdensEmArquivo(arquivo).listar());
    }

    @Test
    void arquivoAusenteRepresentaHistoricoInicialVazio() {
        var repositorio = new RepositorioOrdensEmArquivo(pasta.resolve("novo.tsv"));
        assertTrue(repositorio.listar().isEmpty());
    }

    @Test
    void preservaAcentosTabulacaoQuebrasDeLinhaEBarraNoNome() {
        Path arquivo = pasta.resolve("ordens.tsv");
        var original = registro(1, "João\tSilva\nFilho\r\\teste;\"nome\"");
        new RepositorioOrdensEmArquivo(arquivo).salvar(original);

        assertEquals(List.of(original), new RepositorioOrdensEmArquivo(arquivo).listar());
    }

    @Test
    void falhaDeLeituraRelancaUncheckedIOExceptionComCaminhoECausa() {
        var repositorio = new RepositorioOrdensEmArquivo(pasta);

        var erro = assertThrows(UncheckedIOException.class, repositorio::listar);

        assertTrue(erro.getMessage().contains("ler as ordens"));
        assertTrue(erro.getMessage().contains(pasta.toString()));
        assertInstanceOf(IOException.class, erro.getCause());
    }

    @Test
    void falhaDeEscritaRelancaUncheckedIOExceptionComCaminhoECausa() throws IOException {
        Path bloqueio = pasta.resolve("arquivo-no-lugar-da-pasta");
        Files.writeString(bloqueio, "Não é um diretório");
        var repositorio = new RepositorioOrdensEmArquivo(bloqueio.resolve("ordens.tsv"));

        var erro = assertThrows(UncheckedIOException.class, () -> repositorio.salvar(registro(1, "Ana")));

        assertTrue(erro.getMessage().contains("gravar as ordens"));
        assertTrue(erro.getMessage().contains("ordens.tsv"));
        assertInstanceOf(IOException.class, erro.getCause());
        assertEquals("Não é um diretório", Files.readString(bloqueio));
    }

    @Test
    void registroCorrompidoInformaLinhaSemRetornarHistoricoParcial() throws IOException {
        Path arquivo = pasta.resolve("ordens.tsv");
        new RepositorioOrdensEmArquivo(arquivo).salvar(registro(1, "Ana"));
        Files.writeString(arquivo, "linha corrompida\n", java.nio.file.StandardOpenOption.APPEND);

        var erro = assertThrows(UncheckedIOException.class,
            () -> new RepositorioOrdensEmArquivo(arquivo).listar());

        assertTrue(erro.getMessage().contains("linha 2"));
        assertTrue(erro.getMessage().contains(arquivo.toString()));
        assertInstanceOf(IOException.class, erro.getCause());
    }
}
