import java.util.ArrayList;
import java.util.List;

public class Cliente {
    private String nome;
    private String telefone;
    private String email;
    private final List<OrdemServico> ordensServico = new ArrayList<>();

    public Cliente(String nome, String telefone, String email) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome inválido");
        }
        if (telefone == null || telefone.isBlank()) {
            throw new IllegalArgumentException("Telefone inválido");
        }
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email inválido");
        }

        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
    }

    public void adicionarOrdemServico(OrdemServico ordemServico) {
        if (ordemServico == null) {
            throw new IllegalArgumentException("Ordem de serviço não pode ser nula");
        }

        ordensServico.add(ordemServico);
    }

    public void exibirDados() {
        System.out.println("  Nome:     " + nome);
        System.out.println("  Telefone: " + telefone);
        System.out.println("  E-mail:   " + email);
    }

    public String getNome() {
        return nome;
    }
}
