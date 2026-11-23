package com.techfix.repositorio;

import java.io.IOException;
import java.io.UncheckedIOException;

/** Erro técnico, separado da hierarquia de regras do domínio. */
public final class RepositorioException extends UncheckedIOException {
    private static final long serialVersionUID = 1L;
    public RepositorioException(String mensagem, IOException causa) { super(mensagem, causa); }
}
