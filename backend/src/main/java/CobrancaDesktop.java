import java.math.BigDecimal;

public class CobrancaDesktop implements PoliticaCobranca {
    @Override
    public BigDecimal calcularDiagnostico() {
        return new BigDecimal("60.00");
    }
}
