# Atividade 14 — Testes e preparação da entrega final

Preparada em 23/11/2026. Prazo do enunciado: hoje às 19h30. A base é a tag `v13`, no mesmo repositório; a entrega é `v14`.

## Evidências

- [Ficha de entrega PDF](Ficha_Padrao_Entrega_Atividade_14_Final.pdf)
- [Melhorias com problemas, refatorações e commits](../../melhorias.md)
- [Log final: 47 testes aprovados](testes-v14.txt)
- [Falha provocada no teste de tarifa](falha-proposital.txt)
- [Antes das refatorações](testes-correcoes.txt), [depois das tarifas](testes-refatora-tarifas.txt) e [depois do formato TSV](testes-refatora-formato.txt)
- [Duas execuções reais do Main](saida-terminal-v14.txt)
- [UML](uml.png) e [dependências entre pacotes](pacotes.png)
- [README final](../../../README.md), com regras, instruções, tabela de erros, decisões e tags
- [Declaração de IA](../../../AI.md)

## Para a microdefesa

1. O teste parametrizado protege as tarifas de R$ 80 e R$ 60; uma mutação real mostrou que ele falha se o preço muda indevidamente.
2. Regra de negócio é uma entrada ou operação recusada pelo domínio; erro técnico é falha ao ler/gravar/interpretar o arquivo. A apresentação trata os dois e orienta o usuário.
3. O serviço recebe o contrato do repositório e salva antes de concluir; uma falha não altera o status. A gravação publica o arquivo inteiro por movimento atômico.
4. As refatorações só reorganizam código: nomeiam tarifas e extraem formato TSV. Os mesmos 47 testes passaram antes e depois.
5. DT01, DT04 e DT05 são defeitos anteriores registrados no próprio projeto. O relato específico da professora na AP2 ainda não foi fornecido; não o substituímos por esses achados.

Os arquivos estão preparados para revisão e envio. A submissão na plataforma Aula e a microdefesa não foram realizadas por esta preparação.
