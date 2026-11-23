package com.techfix.dominio;

public final class DadosInvalidosException extends RegraNegocioException {
    private static final long serialVersionUID = 1L;
    public DadosInvalidosException(String mensagem) { super(mensagem); }
}
