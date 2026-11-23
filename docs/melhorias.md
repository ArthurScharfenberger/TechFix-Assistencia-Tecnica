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

Antes: [testes-refatora-tarifas.txt](poo/atividade-14/testes-refatora-tarifas.txt), 47 verdes. Depois: [testes-refatora-formato.txt](poo/atividade-14/testes-refatora-formato.txt), os mesmos 47 verdes. Nenhuma regra foi alterada neste commit.

## Teste que protege de verdade

O experimento de mutação e o commit de restauração serão registrados após sua execução, com o trecho real da falha.

## Reprodução em clone limpo

O clone separado e a execução das instruções serão registrados após a verificação real.
