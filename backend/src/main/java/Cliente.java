public class Cliente {
    private String nome;
    private String telefone;
    private String email;

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

    public void exibirDados() {
        System.out.println("  Nome:     " + nome);
        System.out.println("  Telefone: " + telefone);
        System.out.println("  E-mail:   " + email);
    }

    public String getNome() {
        return nome;
    }
}
