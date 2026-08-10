public class Main {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("João Silva", "5199999-9999", "joao@email.com");
        Tecnico tecnico = new Tecnico("Carlos Souza", "Manutenção de computadores");
        Equipamento equipamento = new Equipamento("Notebook", "Dell", "Não liga");
        OrdemServico ordemServico = new OrdemServico(1, cliente, tecnico, equipamento);

        ordemServico.exibirOrdemServico();
        ordemServico.alterarStatus("Em atendimento");
        ordemServico.exibirOrdemServico();
    }
}
