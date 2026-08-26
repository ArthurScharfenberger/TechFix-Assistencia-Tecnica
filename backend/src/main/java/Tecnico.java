public class Tecnico {
    private String nome;
    private String especialidade;

    public Tecnico(String nome, String especialidade) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome inválido");
        }
        if (especialidade == null || especialidade.isBlank()) {
            throw new IllegalArgumentException("Especialidade inválida");
        }

        this.nome = nome;
        this.especialidade = especialidade;
    }

    public void exibirDados() {
        System.out.println("  Nome:          " + nome);
        System.out.println("  Especialidade: " + especialidade);
    }

    public String getNome() {
        return nome;
    }
}
