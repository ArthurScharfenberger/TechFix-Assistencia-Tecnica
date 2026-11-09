package com.techfix.repositorio;

import com.techfix.dominio.RegistroOrdem;
import com.techfix.dominio.RepositorioOrdens;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class RepositorioOrdensEmMemoria implements RepositorioOrdens {
    private final List<RegistroOrdem> registros = new ArrayList<>();

    @Override
    public void salvar(RegistroOrdem registro) {
        registros.add(Objects.requireNonNull(registro, "Registro deve ser informado"));
    }

    @Override
    public List<RegistroOrdem> listar() {
        return List.copyOf(registros);
    }
}
