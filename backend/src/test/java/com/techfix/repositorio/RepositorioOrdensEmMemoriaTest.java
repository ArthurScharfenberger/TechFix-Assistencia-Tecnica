package com.techfix.repositorio;

import com.techfix.dominio.*;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class RepositorioOrdensEmMemoriaTest {
    @Test
    void consultaNaoPermiteModificarHistoricoERetornaCopiaIndependente() {
        var repositorio = new RepositorioOrdensEmMemoria();
        var antes = repositorio.listar();
        var registro = new RegistroOrdem(1, "Ana", TipoEquipamento.DESKTOP,
            StatusOrdemServico.CONCLUIDA, new BigDecimal("60.00"));
        repositorio.salvar(registro);
        var depois = repositorio.listar();

        assertTrue(antes.isEmpty());
        assertThrows(UnsupportedOperationException.class, depois::clear);
        assertEquals(java.util.List.of(registro), repositorio.listar());
    }
}
