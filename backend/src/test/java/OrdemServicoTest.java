import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class OrdemServicoTest {

    @Test
    void naoDeveCriarClienteSemNome() {
        assertThrows(
            IllegalArgumentException.class,
            () -> new Cliente("", "9999", "teste@email.com")
        );
    }

    @Test
    void naoDeveAdicionarOrdemNulaAoCliente() {
        Cliente cliente = new Cliente("João Silva", "5199999-9999", "joao@email.com");

        assertThrows(
            IllegalArgumentException.class,
            () -> cliente.adicionarOrdemServico(null)
        );
    }

    @Test
    void deveIniciarOrdemComStatusAberta() {
        OrdemServico ordem = criarOrdemValida();

        assertEquals(StatusOrdemServico.ABERTA, ordem.getStatus());
    }

    @Test
    void deveAlterarStatusParaEmAtendimento() {
        OrdemServico ordem = criarOrdemValida();

        ordem.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);

        assertEquals(StatusOrdemServico.EM_ATENDIMENTO, ordem.getStatus());
    }

    private OrdemServico criarOrdemValida() {
        Cliente cliente = new Cliente("João Silva", "5199999-9999", "joao@email.com");
        Tecnico tecnico = new Tecnico("Carlos Souza", "Manutenção de computadores");
        Equipamento equipamento = new Equipamento(TipoEquipamento.NOTEBOOK, "Dell", "Não liga");
        return new OrdemServico(1, cliente, tecnico, equipamento);
    }
}
