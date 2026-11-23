package com.techfix.dominio;

/** Único ponto que escolhe a política de cobrança pelo tipo. */
public final class PoliticasCobranca {
    private PoliticasCobranca() { }

    public static PoliticaCobranca para(Equipamento equipamento) {
        if (equipamento == null) {
            throw new DadosInvalidosException("Equipamento inválido. Revise os dados informados e tente novamente.");
        }
        return switch (equipamento.getTipo()) {
            case NOTEBOOK -> new CobrancaNotebook();
            case DESKTOP -> new CobrancaDesktop();
        };
    }
}
