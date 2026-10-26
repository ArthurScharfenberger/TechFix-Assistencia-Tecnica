import static org.junit.jupiter.api.Assertions.*;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class ReciclagemTest {
    private OrdemServico ordem(Equipamento equipamento) {
        return new OrdemServico(11, new Cliente("Ana", "51999999999", "ana@example.com"),
            null, equipamento);
    }

    @Test
    void notebookSomaDiagnosticoEServicoAdicional() {
        // Arrange
        OrdemServico ordem = ordem(new Notebook("Dell", "Aquece", 8));
        ordem.adicionarItemServico("Limpeza", new BigDecimal("40.00"));
        // Act
        BigDecimal total = ordem.calcularTotal();
        // Assert
        assertEquals(new BigDecimal("120.00"), total);
    }

    @Test
    void desktopUsaPoliticaDoSeuTipo() {
        // Arrange
        OrdemServico ordem = ordem(new Desktop("HP", "Não liga", false));
        // Act
        BigDecimal total = ordem.calcularTotal();
        // Assert
        assertEquals(new BigDecimal("60.00"), total);
    }

    @Test
    void listaNaoPermiteRemoverPartesDaOrdem() {
        // Arrange
        OrdemServico ordem = ordem(new Notebook("Dell", "Aquece", 8));
        ordem.adicionarItemServico("Limpeza", new BigDecimal("40.00"));
        var itens = ordem.getItensServico();
        // Act + Assert
        assertThrows(UnsupportedOperationException.class, itens::clear);
        assertEquals(1, ordem.getItensServico().size());
    }

    @Test
    void itemNegativoERecusadoSemMudarTotal() {
        // Arrange
        OrdemServico ordem = ordem(new Desktop("HP", "Não liga", false));
        // Act + Assert
        assertThrows(IllegalArgumentException.class,
            () -> ordem.adicionarItemServico("Reparo", new BigDecimal("-1.00")));
        assertEquals(new BigDecimal("60.00"), ordem.calcularTotal());
    }

    @Test
    void consultaDaListaRetornaCopiaIndependente() {
        // Arrange
        OrdemServico ordem = ordem(new Desktop("HP", "Não liga", false));
        var antes = ordem.getItensServico();
        // Act
        ordem.adicionarItemServico("Limpeza", new BigDecimal("40.00"));
        // Assert
        assertTrue(antes.isEmpty());
        assertEquals(1, ordem.getItensServico().size());
    }
}
