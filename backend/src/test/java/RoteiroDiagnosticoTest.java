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
    void desktopComPlacaVideoRetornaEtapasConhecidasNaOrdem() {
        RoteiroDiagnostico roteiro = new Desktop("Dell", "Sem imagem", true);
        assertEquals(List.of("Verificar fonte de alimentação e cabos internos",
            "Testar placa-mãe, memória e armazenamento", "Testar placa de vídeo dedicada"),
            roteiro.gerarRoteiroDiagnostico());
    }

    @Test
    void desktopComVideoIntegradoOrientaDiagnostico() {
        RoteiroDiagnostico roteiro = new Desktop("HP", "Não liga", false);
        assertEquals("Testar vídeo integrado", roteiro.gerarRoteiroDiagnostico().get(2));
    }

    @Test
    void mesmaReferenciaAbstrataDespachaParaImplementacoesDiferentes() {
        List<RoteiroDiagnostico> roteiros = List.of(
            new Notebook("Dell", "Não liga", 8), new Desktop("Dell", "Sem imagem", true));
        assertEquals(List.of("Verificar fonte e conector de alimentação",
            "Verificar fonte de alimentação e cabos internos"), roteiros.stream()
            .map(roteiro -> roteiro.gerarRoteiroDiagnostico().get(0)).toList());
    }

    @Test
    void contratoMantemListaImutavelEConsultaSemEfeitosColaterais() {
        for (Equipamento equipamento : List.of(new Notebook("Dell", "Não liga", 16),
                new Desktop("Dell", "Sem imagem", false))) {
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
                new Desktop("Dell", "Sem imagem", true))) {
            OrdemServico ordem = new OrdemServico(1,
                new Cliente("Ana", "51999999999", "ana@example.com"),
                new Tecnico("Carlos", "Manutenção"), equipamento);
            assertEquals(equipamento.gerarRoteiroDiagnostico(), ordem.getRoteiroDiagnostico());
            assertEquals(StatusOrdemServico.ABERTA, ordem.getStatus());
        }
    }
}
