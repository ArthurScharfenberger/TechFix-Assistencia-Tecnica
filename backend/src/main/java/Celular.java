public class Celular extends Equipamento {
    private final boolean dualChip;

    public Celular(String marca, String defeito, boolean dualChip) {
        super(TipoEquipamento.CELULAR, marca, defeito);
        this.dualChip = dualChip;
    }

    @Override
    public String descreverAtendimento() {
        String configuracaoChip = dualChip ? "dual chip" : "um chip";
        return super.descreverAtendimento()
            + " | Especialização: celular com " + configuracaoChip;
    }

    public boolean isDualChip() {
        return dualChip;
    }

    /** {@inheritDoc} */
    @Override
    public java.util.List<String> gerarRoteiroDiagnostico() {
        return java.util.List.of(
            "Verificar bateria e conector de carga",
            "Testar tela e resposta ao toque",
            dualChip ? "Testar os dois slots de chip" : "Testar o slot de chip"
        );
    }
}
