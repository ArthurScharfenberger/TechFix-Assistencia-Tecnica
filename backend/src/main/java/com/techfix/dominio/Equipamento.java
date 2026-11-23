package com.techfix.dominio;

public abstract class Equipamento implements RoteiroDiagnostico {
    private final TipoEquipamento tipo;
    private final String marca;
    private final String defeito;

    protected Equipamento(TipoEquipamento tipo, String marca, String defeito) {
        if (tipo == null) {
            throw new DadosInvalidosException("Tipo inválido. Revise os dados informados e tente novamente.");
        }
        if (marca == null || marca.isBlank()) {
            throw new DadosInvalidosException("Marca inválida. Revise os dados informados e tente novamente.");
        }
        if (defeito == null || defeito.isBlank()) {
            throw new DadosInvalidosException("Defeito inválido. Revise os dados informados e tente novamente.");
        }

        this.tipo = tipo;
        this.marca = marca;
        this.defeito = defeito;
    }

    public void exibirDados() {
        System.out.println("  " + descreverAtendimento());
    }

    public String descreverAtendimento() {
        return "Tipo: " + tipo + " | Marca: " + marca + " | Defeito: " + defeito;
    }

    public TipoEquipamento getTipo() {
        return tipo;
    }

    public String getMarca() {
        return marca;
    }

    public String getDefeito() {
        return defeito;
    }
}
