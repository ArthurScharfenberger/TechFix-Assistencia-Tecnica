public class Cliente {
    private String nome;
    private String telefone;
    private String email;

    public Cliente(String nome, String telefone, String email) {
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
    }

    public void exibirDados() {
        System.out.println("Cliente: " + nome);
        System.out.println("Telefone: " + telefone);
        System.out.println("E-mail: " + email);
    }

    public String getNome() {
        return nome;
    }
}
