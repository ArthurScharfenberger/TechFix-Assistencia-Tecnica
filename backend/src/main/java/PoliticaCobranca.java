import java.math.BigDecimal;

/** Valor fixo do diagnóstico; reparos adicionais são itens separados. */
public interface PoliticaCobranca {
    BigDecimal calcularDiagnostico();
}
