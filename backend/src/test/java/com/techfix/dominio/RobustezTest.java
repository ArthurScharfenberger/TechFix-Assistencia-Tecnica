package com.techfix.dominio;

import com.techfix.app.ApresentacaoConsole;
import com.techfix.repositorio.*;
import com.techfix.servico.ServicoOrdens;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import static org.junit.jupiter.api.Assertions.*;

class RobustezTest {
    @TempDir Path pasta;

    private OrdemServico ordem() {
        return new OrdemServico(1, new Cliente("Ana", "9999", "ana@example.com"),
            new Tecnico("Carlos", "Computadores"), new Notebook("Dell", "Aquece", 8));
    }

    @Test
    void nomeVazioNaoCriaClienteEOrientaCorrecao() {
        // Arrange / Act
        var erro = assertThrows(DadosInvalidosException.class,
            () -> new Cliente("", "9999", "ana@example.com"));
        // Assert
        assertEquals("Nome inválido. Revise os dados informados e tente novamente.", erro.getMessage());
    }

    @Test
    void itemNegativoNaoAlteraListaNemTotal() {
        // Arrange
        var ordem = ordem();
        var total = ordem.calcularTotal();
        // Act
        var erro = assertThrows(DadosInvalidosException.class,
            () -> ordem.adicionarItemServico("Limpeza", new BigDecimal("-1.00")));
        // Assert
        assertEquals("Valor inválido. Revise os dados informados e tente novamente.", erro.getMessage());
        assertTrue(ordem.getItensServico().isEmpty());
        assertEquals(total, ordem.calcularTotal());
    }

    @Test
    void concluirOrdemAbertaOrientaIniciarAtendimentoSemSalvar() {
        // Arrange
        var repositorio = new RepositorioOrdensEmMemoria();
        var servico = new ServicoOrdens(repositorio);
        var ordem = ordem();
        // Act
        var erro = assertThrows(EstadoOrdemException.class, () -> servico.concluir(ordem));
        // Assert
        assertEquals("A ordem não está em atendimento. Inicie o atendimento antes de concluir.", erro.getMessage());
        assertTrue(repositorio.listar().isEmpty());
        assertEquals(StatusOrdemServico.ABERTA, ordem.getStatus());
    }

    @Test
    void duplicidadePreservaHistoricoEEstadoDaSegundaOrdem() {
        // Arrange
        var servico = new ServicoOrdens(new RepositorioOrdensEmMemoria());
        var primeira = ordem();
        primeira.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);
        var registro = servico.concluir(primeira);
        var repetida = ordem();
        repetida.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);
        // Act
        var erro = assertThrows(OrdemDuplicadaException.class, () -> servico.concluir(repetida));
        // Assert
        assertEquals("Ordem 1 já registrada. Abra uma ordem com outro número.", erro.getMessage());
        assertEquals(java.util.List.of(registro), servico.listar());
        assertEquals(StatusOrdemServico.EM_ATENDIMENTO, repetida.getStatus());
    }

    @Test
    void arquivoCorrompidoViraErroTecnicoComLinhaOrientacaoECausa() throws IOException {
        // Arrange
        var arquivo = pasta.resolve("corrompido.tsv");
        Files.writeString(arquivo, "invalido\n");
        // Act
        var erro = assertThrows(RepositorioException.class,
            () -> new RepositorioOrdensEmArquivo(arquivo).listar());
        // Assert
        assertTrue(erro.getMessage().contains("linha 1"));
        assertTrue(erro.getMessage().contains("Corrija o arquivo ou restaure um backup"));
        assertInstanceOf(IllegalArgumentException.class, erro.getCause().getCause());
    }

    @Test
    void salvarNaoSobrescreveHistoricoCorrompido() throws IOException {
        var arquivo = pasta.resolve("corrompido.tsv");
        Files.writeString(arquivo, "historico invalido\n");
        var repositorio = new RepositorioOrdensEmArquivo(arquivo);
        var registro = new RegistroOrdem(1, "Ana", TipoEquipamento.NOTEBOOK,
            StatusOrdemServico.CONCLUIDA, new BigDecimal("80.00"));

        assertThrows(RepositorioException.class, () -> repositorio.salvar(registro));

        assertEquals("historico invalido\n", Files.readString(arquivo));
    }

    @Test
    void falhaTecnicaDeGravacaoPreservaOrdemEmAtendimento() {
        // Arrange
        var falha = new RepositorioException("Disco indisponível. Tente outro caminho.", new IOException("disco"));
        var repositorio = new RepositorioOrdens() {
            public java.util.List<RegistroOrdem> listar() { return java.util.List.of(); }
            public void salvar(RegistroOrdem registro) { throw falha; }
        };
        var ordem = ordem();
        ordem.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);
        // Act
        var erro = assertThrows(RepositorioException.class, () -> new ServicoOrdens(repositorio).concluir(ordem));
        // Assert
        assertSame(falha, erro);
        assertEquals(StatusOrdemServico.EM_ATENDIMENTO, ordem.getStatus());
    }

    @Test
    void apresentacaoTrataTresErrosEConcluiUmaOrdemNaMesmaExecucao() {
        // Arrange
        var bytes = new ByteArrayOutputStream();
        var servico = new ServicoOrdens(new RepositorioOrdensEmMemoria());
        try (var saida = new PrintStream(bytes, true, StandardCharsets.UTF_8)) {
            // Act
            new ApresentacaoConsole(servico, saida).executar();
        }
        // Assert
        var texto = bytes.toString(StandardCharsets.UTF_8);
        assertEquals(3, texto.lines().filter(linha -> linha.startsWith("Regra de negócio:")).count());
        assertTrue(texto.contains("Nome inválido"));
        assertTrue(texto.contains("Valor inválido"));
        assertTrue(texto.contains("Inicie o atendimento"));
        assertTrue(texto.contains("CONCLUIDA | R$ 120.00"));
        assertEquals(1, servico.listar().size());
    }

    @Test
    void apresentacaoTrataFalhaTecnicaEContinuaAteOFim() {
        // Arrange
        var bytes = new ByteArrayOutputStream();
        var servico = new ServicoOrdens(new RepositorioOrdensEmArquivo(pasta));
        try (var saida = new PrintStream(bytes, true, StandardCharsets.UTF_8)) {
            // Act
            new ApresentacaoConsole(servico, saida).executar();
        }
        // Assert
        var texto = bytes.toString(StandardCharsets.UTF_8);
        assertTrue(texto.contains("Falha técnica:"));
        assertTrue(texto.contains("permissões"));
        assertTrue(texto.endsWith("Programa continuou após os erros previsíveis." + System.lineSeparator()));
    }
}
