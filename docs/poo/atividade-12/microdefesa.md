# Microdefesa - Atividade 12

Este guia ajuda a estudar; não substitui a leitura nem comprova que os integrantes já compreenderam o código.

**O que é um repositório?** É um contrato para guardar e consultar registros. O serviço pede `salvar` e `listar` sem saber se os dados ficam numa lista ou num arquivo.

**Quem implementa a interface?** `RepositorioOrdensEmMemoria` e `RepositorioOrdensEmArquivo`. As duas recebem e devolvem `RegistroOrdem`.

**Por que a interface está no domínio?** Ela expressa uma necessidade do serviço de domínio. As implementações dependem desse contrato, e o domínio não precisa importar a infraestrutura de persistência.

**Onde é feita a escolha?** No `Main`, na linha que instancia `RepositorioOrdensEmArquivo`. A variável é do tipo `RepositorioOrdens`, passada ao construtor de `ServicoOrdens`. Os testes instanciam outras implementações para verificar o mesmo serviço.

**Por que existe `ServicoOrdens` além de `OrdemServico`?** A ordem calcula valores e guarda seu estado. O serviço coordena a conclusão e o histórico: valida o estado, verifica duplicidade, cria um registro e manda salvar. Assim, a entidade não precisa lidar com disco.

**O que o registro guarda?** Número da OS, nome do cliente, tipo do equipamento, status e total no instante da conclusão. Não guarda referências às entidades nem métodos de cálculo. `record` oferece campos finais, acesso aos dados e igualdade por conteúdo.

**Qual regra fica preservada?** O total corresponde ao diagnóstico (R$ 80,00 notebook ou R$ 60,00 desktop) mais serviços adicionais. O cálculo continua em `OrdemServico`; o arquivo só guarda seu resultado.

**O que `@TempDir` faz?** O JUnit cria uma pasta isolada para cada teste e cuida de sua limpeza. O teste grava com uma instância, lê com outra e confere os mesmos dados; depois acrescenta um registro e verifica que o primeiro permanece.

**O que acontece quando o disco falha?** O repositório lança `UncheckedIOException` com mensagem e causa. O serviço propaga essa exceção e não muda a ordem para concluída. Há teste de falha de escrita real e teste do serviço com um repositório que simula falha ao salvar.

**Por que arquivo ausente não é erro?** Antes do primeiro salvamento não existe histórico. Só essa situação resulta em lista vazia; diretório no lugar do arquivo, leitura negada, escrita impossível ou registro corrompido não são escondidos.

**Por que a numeração continua na segunda execução?** O serviço consulta o maior número persistido e soma um. Isso funciona para uma execução por vez; duas execuções simultâneas exigiriam controle de concorrência.

**O que o print comprova?** A primeira JVM encontra zero registros e salva a OS 1. A segunda já encontra a OS 1, salva a OS 2 e lista ambas. A memória da primeira JVM deixou de existir, mas o arquivo permaneceu.

**Como demonstrar a troca de implementação?** Localmente, no `Main`, troque a construção por `new RepositorioOrdensEmMemoria()` e ajuste o import. O serviço permanece igual. Em memória, cada novo processo começa vazio. Restaure a implementação em arquivo para a entrega.
