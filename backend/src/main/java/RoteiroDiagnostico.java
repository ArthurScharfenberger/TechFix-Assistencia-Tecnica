import java.util.List;

/**
 * Define as verificações iniciais que orientam o atendimento de um equipamento.
 * Cada implementação deve retornar uma lista imutável, não vazia, sem elementos
 * nulos ou em branco, na ordem de execução recomendada. A consulta não modifica
 * o equipamento e não representa um diagnóstico já executado pelo técnico.
 */
public interface RoteiroDiagnostico {
    /**
     * Obtém as etapas adequadas à configuração do equipamento.
     * @return etapas descritivas, ordenadas e imutáveis; nunca {@code null}
     */
    List<String> gerarRoteiroDiagnostico();
}
