public class Equipamento {
    private String tipo;
    private String marca;
    private String defeito;

    public Equipamento(String tipo, String marca, String defeito) {
        this.tipo = tipo;
        this.marca = marca;
        this.defeito = defeito;
    }

    public void exibirDados() {
        System.out.println("Equipamento: " + tipo);
        System.out.println("Marca: " + marca);
        System.out.println("Defeito: " + defeito);
    }
}
