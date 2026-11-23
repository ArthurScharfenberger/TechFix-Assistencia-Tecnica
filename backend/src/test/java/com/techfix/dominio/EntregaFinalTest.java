package com.techfix.dominio;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.junit.jupiter.api.Assertions.*;

class EntregaFinalTest {
    private OrdemServico ordem(Tecnico tecnico) {
        return new OrdemServico(1, new Cliente("Ana", "9999", "ana@example.com"),
            tecnico, new Notebook("Dell", "Aquece", 8));
    }

    @Test
    void dt01OrdemConcluidaNaoPodeSerReaberta() {
        // Arrange
        var ordem = ordem(new Tecnico("Carlos", "Computadores"));
        ordem.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);
        ordem.alterarStatus(StatusOrdemServico.CONCLUIDA);
        // Act
        var erro = assertThrows(EstadoOrdemException.class,
            () -> ordem.alterarStatus(StatusOrdemServico.ABERTA));
        // Assert
        assertEquals("Ordem concluída não pode mudar de estado. Abra uma nova ordem para outro atendimento.", erro.getMessage());
        assertEquals(StatusOrdemServico.CONCLUIDA, ordem.getStatus());
    }

    @Test
    void dt04AtendimentoExigeTecnicoEPreservaOrdemAberta() {
        // Arrange
        var ordem = ordem(null);
        // Act
        var erro = assertThrows(EstadoOrdemException.class,
            () -> ordem.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO));
        // Assert
        assertEquals("Atendimento exige um técnico. Atribua um técnico antes de iniciar.", erro.getMessage());
        assertEquals(StatusOrdemServico.ABERTA, ordem.getStatus());
    }

    @Test
    void dt05OrdemAbertaNaoPodePularAtendimento() {
        // Arrange
        var ordem = ordem(new Tecnico("Carlos", "Computadores"));
        // Act
        var erro = assertThrows(EstadoOrdemException.class,
            () -> ordem.alterarStatus(StatusOrdemServico.CONCLUIDA));
        // Assert
        assertEquals("A ordem não está em atendimento. Inicie o atendimento antes de concluir.", erro.getMessage());
        assertEquals(StatusOrdemServico.ABERTA, ordem.getStatus());
    }

    @Test
    void atribuicaoPermiteIniciarOrdemCriadaSemTecnico() {
        var ordem = ordem(null);

        ordem.atribuirTecnico(new Tecnico("Carlos", "Computadores"));
        ordem.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);

        assertEquals(StatusOrdemServico.EM_ATENDIMENTO, ordem.getStatus());
    }

    @Test
    void itemDeValorZeroEPermitidoSemAlterarTotal() {
        var ordem = ordem(null);

        ordem.adicionarItemServico("Cortesia", BigDecimal.ZERO);

        assertEquals(new BigDecimal("80.00"), ordem.calcularTotal());
        assertEquals(1, ordem.getItensServico().size());
    }

    @ParameterizedTest(name="Diagnóstico {0} custa R$ {1}")
    @CsvSource({"NOTEBOOK,80.00", "DESKTOP,60.00"})
    void diagnosticoRespeitaTarifaDoTipo(TipoEquipamento tipo, String tarifa) {
        Equipamento equipamento = tipo == TipoEquipamento.NOTEBOOK
            ? new Notebook("Dell", "Aquece", 8) : new Desktop("HP", "Não liga", false);
        var ordem = new OrdemServico(1, new Cliente("Ana", "9999", "ana@example.com"), null, equipamento);

        var total = ordem.calcularTotal();

        assertEquals(new BigDecimal(tarifa), total);
    }
}
