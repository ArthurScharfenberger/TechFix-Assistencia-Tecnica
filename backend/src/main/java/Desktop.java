public class Desktop extends Equipamento {
    private final boolean placaVideoDedicada;

    public Desktop(String marca, String defeito, boolean placaVideoDedicada) {
        super(TipoEquipamento.DESKTOP, marca, defeito);
        this.placaVideoDedicada = placaVideoDedicada;
    }

    @Override
    public String descreverAtendimento() {
        String configuracaoVideo = placaVideoDedicada ? "placa de vídeo dedicada" : "vídeo integrado";
        return super.descreverAtendimento()
            + " | Especialização: desktop com " + configuracaoVideo;
    }

    public boolean isPlacaVideoDedicada() {
        return placaVideoDedicada;
    }

    /** {@inheritDoc} */
    @Override
    public java.util.List<String> gerarRoteiroDiagnostico() {
        return java.util.List.of(
            "Verificar fonte de alimentação e cabos internos",
            "Testar placa-mãe, memória e armazenamento",
            placaVideoDedicada ? "Testar placa de vídeo dedicada" : "Testar vídeo integrado"
        );
    }
}
