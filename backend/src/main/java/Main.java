public class Main {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("João Silva", "5199999-9999", "joao@email.com");
        Tecnico tecnico = new Tecnico("Carlos Souza", "Manutenção de computadores");
        Equipamento equipamento = new Equipamento(TipoEquipamento.NOTEBOOK, "Dell", "Não liga");
        OrdemServico os1 = new OrdemServico(1, cliente, tecnico, equipamento);
        cliente.adicionarOrdemServico(os1);

        os1.exibirOrdemServico();

        System.out.println();
        System.out.println("Atualizando ordem: ABERTA -> EM_ATENDIMENTO");
        os1.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);
        System.out.println("Status atualizado com sucesso: " + os1.getStatus());
    }
}
