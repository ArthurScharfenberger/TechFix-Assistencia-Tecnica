# Roteiro da AS de POO — TechFix

Total: 8 minutos. Arthur fala nos slides 1–3 e 7; Lucas nos slides 4–6 e 8; os dois no 9.

## Antes de começar

Na máquina de apresentação, com o repositório já clonado:

```sh
cd TechFix-Assistencia-Tecnica/backend
mvn clean test
```

Deixe o terminal aberto em `backend/`, com fonte grande. Use um arquivo novo para a demonstração começar da OS 1:

```sh
java -Dfile.encoding=UTF-8 -cp target/classes com.techfix.app.Main dados/demo-as.tsv
```

Plano B: se a máquina falhar, os slides 5 e 6 mostram a saída real.

## Falas

| Tempo | Slide | Quem | Fala |
|---|---|---|---|
| 0:00 | 1–2 | Arthur | O TechFix registra ordens de serviço de notebooks e desktops. Regras: diagnóstico de R$ 80 (notebook) ou R$ 60 (desktop); total = diagnóstico + itens, com `BigDecimal`, sem item negativo; iniciar atendimento exige técnico; ABERTA não pula para CONCLUIDA; concluída não reabre; o serviço salva antes de concluir e recusa número repetido. |
| 1:00 | 3 | Arthur | Herança: `Equipamento` abstrata, `Notebook` e `Desktop` com `@Override`. Interface: `PoliticaCobranca`, implementada por `CobrancaNotebook` e `CobrancaDesktop`; a ordem guarda a variável do tipo da interface. A escolha está só em `PoliticasCobranca.para`. Composição: `ItemServico` tem construtor privado, só a ordem cria itens, e a lista sai como `List.copyOf`. |
| 2:00 | 4 | Lucas | Quatro pacotes. O domínio não importa ninguém. `ServicoOrdens` recebe `RepositorioOrdens` pelo construtor. O `Main` só monta: arquivo → repositório → serviço → console; não tem regra. |
| 3:00 | 5 | Lucas | **Ao vivo:** rodar o `Main`. Mostrar os três erros (cliente sem nome, item negativo, conclusão antes do atendimento), a OS concluída por R$ 120 e "Programa continuou". Rodar de novo: aparece a OS 2, lida do histórico. |
| 4:30 | 6 | Lucas | `mvn clean test`: 47 testes, 0 falhas, conferido em clone limpo com JDK 17. |
| 5:00 | 7 | Arthur | Teste `rejeitaConclusaoDeOrdemAbertaSemSalvar`. Arrange: serviço com repositório em memória e ordem ABERTA. Act: `servico.concluir(ordem)`. Assert: `EstadoOrdemException`, nada salvo, status ABERTA. Importa porque impede cobrar uma ordem nunca atendida. |
| 6:00 | 8 | Lucas | Contexto: o histórico vai para arquivo, mas os testes não podem depender do disco. Decisão: interface no domínio e injeção pelo construtor. Consequência: memória nos testes, TSV no `Main`; trocar o armazenamento não muda o serviço. Custo: uma interface a mais e montagem no `Main`. |
| 7:00 | 9 | Os dois | Arthur: regra fica onde o dado nasce; alteramos a tarifa para R$ 81 e o teste falhou. Lucas: melhoraríamos com entrada interativa, banco de dados em vez de TSV e ligação do protótipo web ao Java. |

## Respostas rápidas para a defesa

Respostas conferidas no código da `main` (mesmo código da `v14`).

| Pergunta | Resposta e onde mostrar |
|---|---|
| O que é um atributo? Mostre um. | Dado que o objeto guarda. `OrdemServico.status` (privado), `Notebook.memoriaRamGb`. |
| Qual o construtor desta classe? | `OrdemServico(int numero, Cliente cliente, Tecnico tecnico, Equipamento equipamento)`: valida número, cliente e equipamento, escolhe a política e começa ABERTA. |
| Superclasses e subclasses? | `Equipamento` (abstrata) → `Notebook`, `Desktop`. Exceções: `RegraNegocioException` → `DadosInvalidosException`, `EstadoOrdemException`, `OrdemDuplicadaException`. |
| Qual a interface e quem implementa? | `PoliticaCobranca` → `CobrancaNotebook`, `CobrancaDesktop`. `RepositorioOrdens` → `RepositorioOrdensEmMemoria`, `RepositorioOrdensEmArquivo`. `RoteiroDiagnostico` → `Equipamento` (e suas subclasses). |
| Para que serve `@Override`? | Indica que o método sobrescreve um da superclasse/interface; o compilador acusa erro se a assinatura não bater. Ex.: `Notebook.descreverAtendimento`. |
| Onde está a decisão de qual implementação usar? | Cobrança: `PoliticasCobranca.para(equipamento)`, um `switch` pelo tipo. Repositório: no `Main`, que cria `RepositorioOrdensEmArquivo`. |
| Erro técnico × regra de negócio? | Regra: o domínio recusa a operação (`RegraNegocioException`, ex.: item negativo). Técnico: falha de infraestrutura ao ler/gravar arquivo (`RepositorioException`, que estende `UncheckedIOException`). |
| Quem lança e quem trata? | Domínio lança `DadosInvalidosException` e transições inválidas; serviço lança conclusão fora de atendimento e duplicidade; repositório lança `RepositorioException`. `ApresentacaoConsole.tentar` trata as duas famílias. |
| O que esse teste verifica? | Ver slide 7: a exceção, que nada foi salvo e que o status não mudou. |
| Execute o cenário ponta a ponta. | Comando do início deste roteiro. |
| Por que o `Main` não tem regras? | Regra no `Main` não é testável nem reaproveitável; ele só monta as dependências. As regras estão no domínio e no serviço, cobertas por testes. |
| Agregação × composição aqui? | Composição: `OrdemServico` cria e controla seus `ItemServico` (construtor privado, não existem fora da ordem). Associação/agregação: `Cliente` e `Tecnico` existem por conta própria e só são referenciados pela ordem. |
| Por que `BigDecimal`? | Dinheiro exato; `double` gera erros de arredondamento. |
| Por que salvar antes de concluir? | Se a gravação falhar, a ordem continua EM_ATENDIMENTO, sem ficar concluída sem registro (teste `falhaAoSalvarNaoConcluiOrdemEPropagaAMesmaExcecao`). |
