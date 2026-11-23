package com.techfix.dominio;

import java.math.BigDecimal;
import java.util.Objects;

/** Dados imutáveis da conclusão, sem guardar entidades ou políticas de cobrança. */
public record RegistroOrdem(int numero, String cliente, TipoEquipamento equipamento,
                            StatusOrdemServico status, BigDecimal total) {
    public RegistroOrdem {
        if (numero <= 0) {
            throw new DadosInvalidosException("Número do registro deve ser positivo. Revise os dados informados e tente novamente.");
        }
        if (cliente == null || cliente.isBlank()) {
            throw new DadosInvalidosException("Cliente do registro deve ser informado. Revise os dados informados e tente novamente.");
        }
        Objects.requireNonNull(equipamento, "Equipamento deve ser informado");
        Objects.requireNonNull(status, "Status deve ser informado");
        if (total == null || total.signum() < 0) {
            throw new DadosInvalidosException("Total do registro deve ser não negativo. Revise os dados informados e tente novamente.");
        }
    }
}
