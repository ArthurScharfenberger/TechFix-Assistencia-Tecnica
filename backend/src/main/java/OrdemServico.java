import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class OrdemServico {
    private int numero;
    private Cliente cliente;
    private Tecnico tecnico;
    private Equipamento equipamento;
    private StatusOrdemServico status;
    private final List<ItemServico> itensServico = new ArrayList<>();

    public OrdemServico(int numero, Cliente cliente, Tecnico tecnico, Equipamento equipamento) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número inválido");
        }
        if (cliente == null) {
            throw new IllegalArgumentException("Cliente inválido");
        }
        if (tecnico == null) {
            throw new IllegalArgumentException("Técnico inválido");
        }
        if (equipamento == null) {
            throw new IllegalArgumentException("Equipamento inválido");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.tecnico = tecnico;
        this.equipamento = equipamento;
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
            throw new IllegalArgumentException("Status inválido");
        }

        this.status = novoStatus;
    }

    public StatusOrdemServico getStatus() {
        return status;
    }

    public void exibirOrdemServico() {
        System.out.println("========================================");
        System.out.println("       ORDEM DE SERVIÇO Nº " + numero);
        System.out.println("========================================");
        System.out.println("CLIENTE");
        cliente.exibirDados();
        System.out.println();
        System.out.println("TÉCNICO RESPONSÁVEL");
        tecnico.exibirDados();
        System.out.println();
        System.out.println("EQUIPAMENTO");
        equipamento.exibirDados();
        System.out.println();
        System.out.println("STATUS: " + status);
        System.out.println("========================================");
    }

    public static final class ItemServico {
        private final String descricao;
        private final BigDecimal valor;

        private ItemServico(String descricao, BigDecimal valor) {
            if (descricao == null || descricao.isBlank()) {
                throw new IllegalArgumentException("Descrição inválida");
            }
            if (valor == null || valor.signum() < 0) {
                throw new IllegalArgumentException("Valor inválido");
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
