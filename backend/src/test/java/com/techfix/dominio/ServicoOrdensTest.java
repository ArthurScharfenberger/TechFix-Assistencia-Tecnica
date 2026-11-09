package com.techfix.dominio;

import com.techfix.repositorio.RepositorioOrdensEmMemoria;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ServicoOrdensTest {
    private OrdemServico ordem(int numero) {
        var ordem = new OrdemServico(numero, new Cliente("Ana", "51999999999", "ana@example.com"),
            null, new Notebook("Dell", "Aquece", 8));
        ordem.adicionarItemServico("Limpeza", new BigDecimal("40.00"));
        return ordem;
    }

    @Test
    void concluiOrdemESalvaRegistroUsandoRepositorioEmMemoria() {
        var repositorio = new RepositorioOrdensEmMemoria();
        var servico = new ServicoOrdens(repositorio);
        var ordem = ordem(1);
        ordem.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);

        var registro = servico.concluir(ordem);

        assertEquals(new RegistroOrdem(1, "Ana", TipoEquipamento.NOTEBOOK,
            StatusOrdemServico.CONCLUIDA, new BigDecimal("120.00")), registro);
        assertEquals(java.util.List.of(registro), repositorio.listar());
        assertEquals(StatusOrdemServico.CONCLUIDA, ordem.getStatus());
    }

    @Test
    void rejeitaConclusaoDeOrdemAbertaSemSalvar() {
        var servico = new ServicoOrdens(new RepositorioOrdensEmMemoria());
        var ordem = ordem(1);

        assertThrows(IllegalStateException.class, () -> servico.concluir(ordem));

        assertTrue(servico.listar().isEmpty());
        assertEquals(StatusOrdemServico.ABERTA, ordem.getStatus());
    }

    @Test
    void rejeitaNumeroJaRegistradoEPreservaHistorico() {
        var servico = new ServicoOrdens(new RepositorioOrdensEmMemoria());
        var primeira = ordem(7);
        primeira.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);
        var registro = servico.concluir(primeira);
        var repetida = ordem(7);
        repetida.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);

        assertThrows(IllegalArgumentException.class, () -> servico.concluir(repetida));

        assertEquals(java.util.List.of(registro), servico.listar());
        assertEquals(StatusOrdemServico.EM_ATENDIMENTO, repetida.getStatus());
        assertEquals(8, servico.proximoNumero());
    }

    @Test
    void registroNaoMudaQuandoOrdemRecebeOutroItem() {
        var servico = new ServicoOrdens(new RepositorioOrdensEmMemoria());
        var ordem = ordem(1);
        ordem.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);
        servico.concluir(ordem);

        ordem.adicionarItemServico("Outro serviço", new BigDecimal("20.00"));

        assertEquals(new BigDecimal("120.00"), servico.listar().get(0).total());
        assertEquals(new BigDecimal("140.00"), ordem.calcularTotal());
    }
}
