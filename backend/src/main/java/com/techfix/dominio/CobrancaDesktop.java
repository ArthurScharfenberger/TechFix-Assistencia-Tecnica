package com.techfix.dominio;

import java.math.BigDecimal;

public class CobrancaDesktop implements PoliticaCobranca {
    private static final BigDecimal TARIFA_DIAGNOSTICO = new BigDecimal("60.00");

    @Override
    public BigDecimal calcularDiagnostico() {
        return TARIFA_DIAGNOSTICO;
    }
}
