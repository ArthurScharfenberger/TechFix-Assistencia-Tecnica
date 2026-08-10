public class OrdemServico {
    private int numero;
    private Cliente cliente;
    private Tecnico tecnico;
    private Equipamento equipamento;
    private String status;

    public OrdemServico(int numero, Cliente cliente, Tecnico tecnico, Equipamento equipamento) {
        this.numero = numero;
        this.cliente = cliente;
        this.tecnico = tecnico;
        this.equipamento = equipamento;
        this.status = "Aberta";
    }

    public void alterarStatus(String novoStatus) {
        status = novoStatus;
        System.out.println("Status atualizado para: " + status);
    }

    public void exibirOrdemServico() {
        System.out.println("Ordem de Serviço nº " + numero);
        cliente.exibirDados();
        tecnico.exibirDados();
        equipamento.exibirDados();
        System.out.println("Status: " + status);
    }
}
