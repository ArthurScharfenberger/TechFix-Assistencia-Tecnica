package com.techfix.dominio;

public final class OrdemDuplicadaException extends RegraNegocioException {
    private static final long serialVersionUID = 1L;
    public OrdemDuplicadaException(int numero) {
        super("Ordem " + numero + " já registrada. Abra uma ordem com outro número.");
    }
}
