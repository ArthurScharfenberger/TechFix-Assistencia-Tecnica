package com.techfix.dominio;

import java.math.BigDecimal;

public class CobrancaNotebook implements PoliticaCobranca {
    private static final BigDecimal TARIFA_DIAGNOSTICO = new BigDecimal("81.00");

    @Override
    public BigDecimal calcularDiagnostico() {
        return TARIFA_DIAGNOSTICO;
    }
}
