# Melhorias de POO — Atividade 14

Trabalho realizado em 23/11/2026 a partir da tag `v13`, preservando o histórico e as versões anteriores. Logs em `docs/poo/atividade-14`.

## Problemas anteriores corrigidos

A origem verificável é a tabela de defeitos de [A13 de Processos](processos/05-qualidade/A13-estrategia-e-casos-de-teste.md), seção 2.3, e sua [execução Java](processos/05-qualidade/execucao/saida-java.txt). São problemas previamente apontados no projeto, não um relato da apresentação AP2. O relato real da defesa ainda precisa ser fornecido pela dupla para completar a A10.

| Problema | Onde estava | Correção e teste |
|---|---|---|
| DT01: concluída voltava a ABERTA | `OrdemServico.alterarStatus` | Rejeita mudança após conclusão; `dt01OrdemConcluidaNaoPodeSerReaberta` verifica mensagem e estado preservado. |
| DT04: atendimento começava sem técnico | mesmo método | Exige técnico antes de iniciar; `dt04AtendimentoExigeTecnicoEPreservaOrdemAberta`; atribuição posterior tem teste de sucesso. |
| DT05: ABERTA ia direto a CONCLUIDA | mesmo método | Rejeita conclusão sem atendimento; `dt05OrdemAbertaNaoPodePularAtendimento` verifica mensagem e estado preservado. |

As três correções pertencem ao commit `6f6c0d3`. A preparação dos testes antigos de serviço passou a fornecer um técnico, mantendo os mesmos cenários e asserções. O frontend independente e os defeitos DT02/DT03 não foram alterados nesta atividade.

## Suíte final

`ReciclagemTest`, `ServicoOrdensTest` e `EntregaFinalTest` verificam regras distintas (tarifas, soma, itens, estados, duplicidade). `RobustezTest` e `EntregaFinalTest` verificam tipo e mensagem via `assertThrows`. `itemDeValorZeroEPermitidoSemAlterarTotal` cobre o limite zero; `diagnosticoRespeitaTarifaDoTipo` é parametrizado para notebook e desktop. Não há dependência de relógio, ordem de execução ou arquivos de teste fora de `@TempDir`.

## Refatorações seguras

### Refatoração 1 — Tarifas nomeadas

Antes, `CobrancaNotebook` e `CobrancaDesktop` criavam `BigDecimal` de literais a cada chamada; os preços ficavam como números sem nome. Depois, cada política declara `TARIFA_DIAGNOSTICO`, constante imutável. O preço e a escala decimal são idênticos. O nome explicita a regra e dispensa recriação do valor. Commit com mensagem `refatora: nomeia tarifas imutaveis de diagnostico`.

Antes: [testes-correcoes.txt](poo/atividade-14/testes-correcoes.txt), 47 testes verdes. Depois: [testes-refatora-tarifas.txt](poo/atividade-14/testes-refatora-tarifas.txt), os mesmos 47 verdes. Não houve alteração de comportamento.

Commit da refatoração 1: `0c996b1`.

### Refatoração 2 — Separar o formato do armazenamento

Antes, `RepositorioOrdensEmArquivo` acumulava acesso a arquivos, campos TSV, parsing e escapes. Depois, `FormatoRegistroTsv` concentra as conversões puras; o repositório mantém leitura, gravação atômica e tradução de falhas. O formato e as mensagens são idênticos; os testes preservam acentos, tabulação, quebras de linha, barras e falhas de leitura/escrita. Commit com mensagem `refatora: separa formato TSV do acesso ao arquivo`.

Antes: [testes-refatora-tarifas.txt](poo/atividade-14/testes-refatora-tarifas.txt), 47 verdes. Depois: [testes-refatora-formato.txt](poo/atividade-14/testes-refatora-formato.txt), os mesmos 47 verdes. Nenhuma regra foi alterada neste commit. Commit da refatoração 2: `6ab8b8d`.

## Teste que protege de verdade

Teste escolhido: `EntregaFinalTest.diagnosticoRespeitaTarifaDoTipo`, que compara o total com a tarifa esperada por tipo. No commit `0522622`, a constante de notebook foi alterada de `80.00` para `81.00`, mantendo o teste intacto.

Comando: `mvn -B -f backend/pom.xml clean test "-Dtest=EntregaFinalTest#diagnosticoRespeitaTarifaDoTipo"`.

Trecho real de [falha-proposital.txt](poo/atividade-14/falha-proposital.txt):

```text
[ERROR] EntregaFinalTest.diagnosticoRespeitaTarifaDoTipo:82 expected: <80.00> but was: <81.00>
[INFO] Tests run: 2, Failures: 1, Errors: 0, Skipped: 0
[INFO] BUILD FAILURE
```

O commit **`9eba815`** desfez a alteração, voltando a `80.00`; a suíte completa voltou a 47 testes aprovados em [testes-v14.txt](poo/atividade-14/testes-v14.txt). A falha é uma asserção de regra de negócio, não uma falha de compilação. O caso desktop continuou passando.

Uma primeira tentativa sem `clean` encontrou classes de Java 25 no diretório de saída da IDE. Ela não foi contada como evidência da mutação: a prova acima veio da recompilação limpa com falha de asserção. Por isso o passo a passo usa `mvn clean test`.

## Reprodução em clone limpo

Em 23/11/2026 foi criado um clone separado com `git clone --no-local . tmp/poo-auditoria/clone-limpo`, no commit `764c0b6` (mesmo código Java da entrega final, antes da consolidação documental). O Maven usou um diretório de dependências temporário inicialmente vazio, baixando plugins e JUnit pela internet. Foram executados `mvn clean test` e duas chamadas de `java -Dfile.encoding=UTF-8 -cp target/classes com.techfix.app.Main`, dentro de `backend`, conforme o README.

Resultado: **47 testes, zero falhas, zero erros e zero ignorados**; a primeira execução gravou a OS 1 e a segunda preservou a OS 1 e gravou a OS 2. Logs: [compilação e testes](poo/atividade-14/clone-limpo-testes.txt) e [execução](poo/atividade-14/clone-limpo-execucao.txt). Ambiente: Windows, Oracle JDK 17.0.10 e Maven 3.9.16. Não se trata de instalação de um sistema operacional novo; foi um clone sem build ou histórico de dados e com cache Maven vazio.

O compilador foi executado com `-Xlint:all`, sem warnings no código do projeto. A organização foi conferida: nenhum import de `repositorio`, `servico` ou `app` dentro de `dominio`; o `Main` só monta as dependências. Após publicar a tag, o usuário pode seguir o comando de clone GitHub e checkout `v14` do README.
