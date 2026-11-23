package com.techfix.dominio;

public final class EstadoOrdemException extends RegraNegocioException {
    private static final long serialVersionUID = 1L;
    public EstadoOrdemException(String mensagem) { super(mensagem); }
}
