import java.math.BigDecimal;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("João Silva", "5199999-9999", "joao@email.com");
        Tecnico tecnico = new Tecnico("Carlos Souza", "Manutenção de computadores");
        Equipamento notebook = new Notebook("Dell", "Não liga", 16);
        Equipamento celular = new Celular("Samsung", "Tela quebrada", true);
        OrdemServico os1 = new OrdemServico(1, cliente, tecnico, notebook);
        cliente.adicionarOrdemServico(os1);
        os1.adicionarItemServico("Diagnóstico técnico", new BigDecimal("80.00"));

        os1.exibirOrdemServico();

        System.out.println();
        System.out.println("Atualizando ordem: ABERTA -> EM_ATENDIMENTO");
        os1.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);
        System.out.println("Status atualizado com sucesso: " + os1.getStatus());

        System.out.println();
        System.out.println("DEMONSTRAÇÃO DA HIERARQUIA DE EQUIPAMENTOS");
        List<Equipamento> equipamentos = List.of(notebook, celular);
        equipamentos.forEach(Equipamento::exibirDados);
    }
}
