package com.techfix.dominio;

import java.math.BigDecimal;
import java.util.Objects;

/** Dados imutáveis da conclusão, sem guardar entidades ou políticas de cobrança. */
public record RegistroOrdem(int numero, String cliente, TipoEquipamento equipamento,
                            StatusOrdemServico status, BigDecimal total) {
    public RegistroOrdem {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do registro deve ser positivo");
        }
        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente do registro deve ser informado");
        }
        Objects.requireNonNull(equipamento, "Equipamento deve ser informado");
        Objects.requireNonNull(status, "Status deve ser informado");
        if (total == null || total.signum() < 0) {
            throw new IllegalArgumentException("Total do registro deve ser não negativo");
        }
    }
}
