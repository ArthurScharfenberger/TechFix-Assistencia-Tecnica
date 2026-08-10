public class Tecnico {
    private String nome;
    private String especialidade;

    public Tecnico(String nome, String especialidade) {
        this.nome = nome;
        this.especialidade = especialidade;
    }

    public void exibirDados() {
        System.out.println("Técnico: " + nome);
        System.out.println("Especialidade: " + especialidade);
    }

    public String getNome() {
        return nome;
    }
}
