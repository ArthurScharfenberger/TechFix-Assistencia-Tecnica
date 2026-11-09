package com.techfix.dominio;

import java.util.List;

/** Contrato do histórico: as implementações guardam somente dados. */
public interface RepositorioOrdens {
    /** Acrescenta um registro ao final do histórico, preservando os anteriores. */
    void salvar(RegistroOrdem registro);

    /** Retorna uma cópia imutável dos registros, em ordem de inclusão. */
    List<RegistroOrdem> listar();
}
