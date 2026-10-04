import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import org.junit.jupiter.api.Test;

class RoteiroDiagnosticoTest {
    @Test
    void notebookRetornaEtapasConhecidasNaOrdem() {
        RoteiroDiagnostico roteiro = new Notebook("Dell", "Não liga", 16);
        assertEquals(List.of("Verificar fonte e conector de alimentação",
            "Testar os 16 GB de memória RAM", "Verificar armazenamento e refrigeração"),
            roteiro.gerarRoteiroDiagnostico());
    }

    @Test
    void celularDualChipRetornaEtapasConhecidasNaOrdem() {
        RoteiroDiagnostico roteiro = new Celular("Samsung", "Tela quebrada", true);
        assertEquals(List.of("Verificar bateria e conector de carga",
            "Testar tela e resposta ao toque", "Testar os dois slots de chip"),
            roteiro.gerarRoteiroDiagnostico());
    }

    @Test
    void celularSimplesOrientaApenasUmSlot() {
        RoteiroDiagnostico roteiro = new Celular("Motorola", "Não carrega", false);
        assertEquals("Testar o slot de chip", roteiro.gerarRoteiroDiagnostico().get(2));
    }

    @Test
    void mesmaReferenciaAbstrataDespachaParaImplementacoesDiferentes() {
        List<RoteiroDiagnostico> roteiros = List.of(
            new Notebook("Dell", "Não liga", 8), new Celular("Samsung", "Tela quebrada", true));
        assertEquals(List.of("Verificar fonte e conector de alimentação",
            "Verificar bateria e conector de carga"), roteiros.stream()
            .map(roteiro -> roteiro.gerarRoteiroDiagnostico().get(0)).toList());
    }

    @Test
    void contratoMantemListaImutavelEConsultaSemEfeitosColaterais() {
        for (Equipamento equipamento : List.of(new Notebook("Dell", "Não liga", 16),
                new Celular("Samsung", "Tela quebrada", false))) {
            String descricao = equipamento.descreverAtendimento();
            RoteiroDiagnostico roteiro = equipamento;
            List<String> etapas = roteiro.gerarRoteiroDiagnostico();
            assertFalse(etapas.isEmpty());
            assertTrue(etapas.stream().allMatch(etapa -> etapa != null && !etapa.isBlank()));
            assertThrows(UnsupportedOperationException.class, () -> etapas.add("Outra etapa"));
            assertEquals(etapas, roteiro.gerarRoteiroDiagnostico());
            assertEquals(descricao, equipamento.descreverAtendimento());
        }
    }

    @Test
    void ordemServicoIntegraAmbosOsRoteirosSemAlterarStatus() {
        for (Equipamento equipamento : List.of(new Notebook("Dell", "Não liga", 16),
                new Celular("Samsung", "Tela quebrada", true))) {
            OrdemServico ordem = new OrdemServico(1,
                new Cliente("Ana", "51999999999", "ana@example.com"),
                new Tecnico("Carlos", "Manutenção"), equipamento);
            assertEquals(equipamento.gerarRoteiroDiagnostico(), ordem.getRoteiroDiagnostico());
            assertEquals(StatusOrdemServico.ABERTA, ordem.getStatus());
        }
    }
}
