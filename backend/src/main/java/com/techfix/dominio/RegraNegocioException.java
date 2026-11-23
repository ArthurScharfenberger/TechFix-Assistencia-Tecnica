package com.techfix.dominio;

/** Falha previsível de uma regra; a apresentação orienta a correção. */
public class RegraNegocioException extends IllegalArgumentException {
    private static final long serialVersionUID = 1L;
    public RegraNegocioException(String mensagem) { super(mensagem); }
}
