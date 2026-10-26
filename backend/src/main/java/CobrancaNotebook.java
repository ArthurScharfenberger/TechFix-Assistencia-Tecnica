import java.math.BigDecimal;

public class CobrancaNotebook implements PoliticaCobranca {
    @Override
    public BigDecimal calcularDiagnostico() {
        return new BigDecimal("80.00");
    }
}
