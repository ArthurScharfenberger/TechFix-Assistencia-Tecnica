public class OrdemServico {
    private int numero;
    private Cliente cliente;
    private Tecnico tecnico;
    private Equipamento equipamento;
    private StatusOrdemServico status;

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
}
