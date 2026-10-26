import java.math.BigDecimal;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("João Silva", "5199999-9999", "joao@email.com");
        Tecnico tecnico = new Tecnico("Carlos Souza", "Manutenção de computadores");
        Equipamento notebook = new Notebook("Dell", "Não liga", 16);
        Equipamento desktop = new Desktop("Dell", "Sem imagem", true);
        OrdemServico os1 = new OrdemServico(1, cliente, tecnico, notebook);
        cliente.adicionarOrdemServico(os1);
        os1.adicionarItemServico("Limpeza interna", new BigDecimal("40.00"));

        os1.exibirOrdemServico();

        System.out.println();
        System.out.println("Atualizando ordem: ABERTA -> EM_ATENDIMENTO");
        os1.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);
        System.out.println("Status atualizado com sucesso: " + os1.getStatus());
        os1.alterarStatus(StatusOrdemServico.CONCLUIDA);
        System.out.println("Ordem finalizada: " + os1.getStatus());
        System.out.println("Notebook: diagnóstico + limpeza = R$ " + os1.calcularTotal());
        OrdemServico os2 = new OrdemServico(2, cliente, null, desktop);
        cliente.adicionarOrdemServico(os2);
        System.out.println("Desktop sem técnico, apenas diagnóstico = R$ " + os2.calcularTotal());

        System.out.println();
        System.out.println("DEMONSTRAÇÃO DA HIERARQUIA DE EQUIPAMENTOS");
        List<Equipamento> equipamentos = List.of(notebook, desktop);
        equipamentos.forEach(Equipamento::exibirDados);
        System.out.println("ROTEIROS POR CONTRATO POLIMÓRFICO");
        List<RoteiroDiagnostico> roteiros = List.of(notebook, desktop);
        for (RoteiroDiagnostico roteiro : roteiros) {
            roteiro.gerarRoteiroDiagnostico().forEach(System.out::println);
        }
    }
}
