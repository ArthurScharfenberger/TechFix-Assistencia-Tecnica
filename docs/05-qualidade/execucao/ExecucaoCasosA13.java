import com.techfix.dominio.*;

/**
 * Executa casos de teste da A13 contra o domínio Java do protótipo (v12).
 * Uso (na raiz): javac -encoding UTF-8 -cp backend/target/classes -d <saida> ExecucaoCasosA13.java
 *                java -cp "backend/target/classes;<saida>" ExecucaoCasosA13
 */
public class ExecucaoCasosA13 {
    static void registrar(String id, String esperado, String obtido, boolean passou) {
        System.out.println(id + " | esperado: " + esperado + " | obtido: " + obtido + " | " + (passou ? "PASSOU" : "FALHOU"));
    }

    static OrdemServico novaOrdem(int numero, Tecnico tecnico) {
        Cliente ana = new Cliente("Ana Souza", "(51) 99999-0000", "ana@exemplo.com");
        return new OrdemServico(numero, ana, tecnico, new Notebook("Dell", "Não liga", 8));
    }

    static void tentar(String id, String esperado, OrdemServico os, StatusOrdemServico destino, StatusOrdemServico deveFicar) {
        StatusOrdemServico antes = os.getStatus();
        try {
            os.alterarStatus(destino);
            registrar(id, esperado, "aceito: " + antes + " -> " + os.getStatus(), os.getStatus() == deveFicar);
        } catch (RuntimeException e) {
            registrar(id, esperado, "rejeitado: " + e.getMessage() + "; estado " + os.getStatus(), os.getStatus() == deveFicar);
        }
    }

    public static void main(String[] args) {
        Tecnico joao = new Tecnico("João Pereira", "Hardware");

        try {
            new Cliente("Ana Souza", "(51) 99999-0000", "");
            registrar("CT01", "cliente com e-mail vazio é aceito (RF1/CA01)", "aceito", true);
        } catch (IllegalArgumentException e) {
            registrar("CT01", "cliente com e-mail vazio é aceito (RF1/CA01)", "rejeitado: " + e.getMessage(), false);
        }

        try {
            new Cliente("Bruno Lima", "", "bruno@exemplo.com");
            new Notebook("HP", "", 4);
            registrar("CT02", "bloquear e indicar Telefone e Defeito na mesma tentativa", "aceito", false);
        } catch (IllegalArgumentException e) {
            registrar("CT02", "bloquear e indicar Telefone e Defeito na mesma tentativa", "bloqueado com uma única mensagem: " + e.getMessage(), false);
        }

        OrdemServico aberta = novaOrdem(25, null);
        registrar("CT04", "OS criada em ABERTA", "estado " + aberta.getStatus(), aberta.getStatus() == StatusOrdemServico.ABERTA);

        tentar("CT05", "T1: ABERTA com técnico -> EM ATENDIMENTO", novaOrdem(1, joao), StatusOrdemServico.EM_ATENDIMENTO, StatusOrdemServico.EM_ATENDIMENTO);
        tentar("CT06", "T2: ABERTA sem técnico, iniciar -> rejeitar e manter ABERTA", novaOrdem(2, null), StatusOrdemServico.EM_ATENDIMENTO, StatusOrdemServico.ABERTA);
        tentar("CT07", "T3: ABERTA, concluir -> rejeitar e manter ABERTA", novaOrdem(3, joao), StatusOrdemServico.CONCLUIDA, StatusOrdemServico.ABERTA);

        OrdemServico emAtendimento = novaOrdem(4, joao);
        emAtendimento.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);
        tentar("CT08", "T4: EM ATENDIMENTO, concluir -> CONCLUÍDA", emAtendimento, StatusOrdemServico.CONCLUIDA, StatusOrdemServico.CONCLUIDA);

        OrdemServico concluida = novaOrdem(5, joao);
        concluida.alterarStatus(StatusOrdemServico.EM_ATENDIMENTO);
        concluida.alterarStatus(StatusOrdemServico.CONCLUIDA);
        tentar("CT09", "T5: CONCLUÍDA -> ABERTA rejeitada; manter CONCLUÍDA", concluida, StatusOrdemServico.ABERTA, StatusOrdemServico.CONCLUIDA);
    }
}
