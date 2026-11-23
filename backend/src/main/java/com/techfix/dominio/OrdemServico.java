package com.techfix.dominio;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class OrdemServico {
    private int numero;
    private Cliente cliente;
    private Tecnico tecnico;
    private Equipamento equipamento;
    private StatusOrdemServico status;
    private final PoliticaCobranca politicaCobranca;
    private final List<ItemServico> itensServico = new ArrayList<>();

    public OrdemServico(int numero, Cliente cliente, Tecnico tecnico, Equipamento equipamento) {
        if (numero <= 0) {
            throw new DadosInvalidosException("Número inválido. Revise os dados informados e tente novamente.");
        }
        if (cliente == null) {
            throw new DadosInvalidosException("Cliente inválido. Revise os dados informados e tente novamente.");
        }
        if (equipamento == null) {
            throw new DadosInvalidosException("Equipamento inválido. Revise os dados informados e tente novamente.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.tecnico = tecnico;
        this.equipamento = equipamento;
        this.politicaCobranca = PoliticasCobranca.para(equipamento);
        this.status = StatusOrdemServico.ABERTA;
    }

    public void adicionarItemServico(String descricao, BigDecimal valor) {
        itensServico.add(new ItemServico(descricao, valor));
    }

    public List<ItemServico> getItensServico() {
        return List.copyOf(itensServico);
    }

    public void alterarStatus(StatusOrdemServico novoStatus) {
        if (novoStatus == null) {
            throw new DadosInvalidosException("Status inválido. Revise os dados informados e tente novamente.");
        }

        this.status = novoStatus;
    }

    public StatusOrdemServico getStatus() {
        return status;
    }

    public int getNumero() {
        return numero;
    }

    public String getNomeCliente() {
        return cliente.getNome();
    }

    public TipoEquipamento getTipoEquipamento() {
        return equipamento.getTipo();
    }

    public BigDecimal calcularTotal() {
        BigDecimal total = politicaCobranca.calcularDiagnostico();
        for (ItemServico item : itensServico) {
            total = total.add(item.getValor());
        }
        return total;
    }

    /** Consulta o contrato de diagnóstico sem selecionar o tipo concreto. */
    public List<String> getRoteiroDiagnostico() {
        RoteiroDiagnostico roteiro = equipamento;
        return roteiro.gerarRoteiroDiagnostico();
    }

    public void exibirOrdemServico() {
        System.out.println("========================================");
        System.out.println("       ORDEM DE SERVIÇO Nº " + numero);
        System.out.println("========================================");
        System.out.println("CLIENTE");
        cliente.exibirDados();
        System.out.println();
        System.out.println("TÉCNICO RESPONSÁVEL");
        if (tecnico == null) {
            System.out.println("  Ainda não atribuído");
        } else {
            tecnico.exibirDados();
        }
        System.out.println();
        System.out.println("EQUIPAMENTO");
        equipamento.exibirDados();
        System.out.println("ROTEIRO DE DIAGNÓSTICO");
        getRoteiroDiagnostico().forEach(etapa -> System.out.println("  - " + etapa));
        System.out.println();
        System.out.println("STATUS: " + status);
        System.out.println("TOTAL: R$ " + calcularTotal().toPlainString());
        System.out.println("========================================");
    }

    public static final class ItemServico {
        private final String descricao;
        private final BigDecimal valor;

        private ItemServico(String descricao, BigDecimal valor) {
            if (descricao == null || descricao.isBlank()) {
                throw new DadosInvalidosException("Descrição inválida. Revise os dados informados e tente novamente.");
            }
            if (valor == null || valor.signum() < 0) {
                throw new DadosInvalidosException("Valor inválido. Revise os dados informados e tente novamente.");
            }

            this.descricao = descricao;
            this.valor = valor;
        }

        public String getDescricao() {
            return descricao;
        }

        public BigDecimal getValor() {
            return valor;
        }
    }
}
