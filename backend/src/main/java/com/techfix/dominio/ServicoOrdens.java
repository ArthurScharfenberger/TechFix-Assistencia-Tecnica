package com.techfix.dominio;

import java.util.List;
import java.util.Objects;

/** Coordena a conclusão e o histórico sem conhecer o meio de armazenamento. */
public class ServicoOrdens {
    private final RepositorioOrdens repositorio;

    public ServicoOrdens(RepositorioOrdens repositorio) {
        this.repositorio = Objects.requireNonNull(repositorio, "Repositório deve ser informado");
    }

    public RegistroOrdem concluir(OrdemServico ordem) {
        Objects.requireNonNull(ordem, "Ordem deve ser informada");
        if (ordem.getStatus() != StatusOrdemServico.EM_ATENDIMENTO) {
            throw new IllegalStateException("Somente uma ordem em atendimento pode ser concluída");
        }
        if (listar().stream().anyMatch(registro -> registro.numero() == ordem.getNumero())) {
            throw new IllegalArgumentException("Ordem já registrada: " + ordem.getNumero());
        }
        RegistroOrdem registro = new RegistroOrdem(ordem.getNumero(), ordem.getNomeCliente(),
            ordem.getTipoEquipamento(), StatusOrdemServico.CONCLUIDA, ordem.calcularTotal());
        repositorio.salvar(registro);
        // Se a gravação falhar, a ordem continua em atendimento.
        ordem.alterarStatus(StatusOrdemServico.CONCLUIDA);
        return registro;
    }

    public List<RegistroOrdem> listar() {
        return repositorio.listar();
    }

    public int proximoNumero() {
        return Math.addExact(listar().stream().mapToInt(RegistroOrdem::numero).max().orElse(0), 1);
    }
}
