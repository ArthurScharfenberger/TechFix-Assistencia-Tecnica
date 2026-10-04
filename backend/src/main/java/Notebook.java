public class Notebook extends Equipamento {
    private final int memoriaRamGb;

    public Notebook(String marca, String defeito, int memoriaRamGb) {
        super(TipoEquipamento.NOTEBOOK, marca, defeito);

        if (memoriaRamGb <= 0) {
            throw new IllegalArgumentException("Memória RAM inválida");
        }

        this.memoriaRamGb = memoriaRamGb;
    }

    @Override
    public String descreverAtendimento() {
        return super.descreverAtendimento()
            + " | Especialização: notebook com " + memoriaRamGb + " GB de RAM";
    }

    public int getMemoriaRamGb() {
        return memoriaRamGb;
    }

    /** {@inheritDoc} */
    @Override
    public java.util.List<String> gerarRoteiroDiagnostico() {
        return java.util.List.of(
            "Verificar fonte e conector de alimentação",
            "Testar os " + memoriaRamGb + " GB de memória RAM",
            "Verificar armazenamento e refrigeração"
        );
    }
}
