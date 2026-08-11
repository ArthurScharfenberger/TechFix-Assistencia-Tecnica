public class Equipamento {
    private TipoEquipamento tipo;
    private String marca;
    private String defeito;

    public Equipamento(TipoEquipamento tipo, String marca, String defeito) {
        if (tipo == null) {
            throw new IllegalArgumentException("Tipo inválido");
        }
        if (marca == null || marca.isBlank()) {
            throw new IllegalArgumentException("Marca inválida");
        }
        if (defeito == null || defeito.isBlank()) {
            throw new IllegalArgumentException("Defeito inválido");
        }

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
