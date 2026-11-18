# Guia para o desafio de rastreabilidade

Abram estes arquivos antes de começar. A professora pode escolher qualquer requisito. Ambos devem saber seguir o caminho. Os IDs RF01–RF17 da entrevista A3 são históricos; RF1–RF3 são os IDs consolidados. A matriz faz a tradução entre eles.

## Atalhos

1. [Matriz viva](../dossie/matriz-rastreabilidade.md).
2. [A3: entrevista simulada com Marcos Almeida](../entregas/Atividade_03_Levantamento_Requisitos_TechFix.pdf).
3. [Requisitos, histórias e critérios](../dossie/requisitos.md).
4. [A9: fluxograma e wireframe](../entregas/Modelagem-Entrega-Final.pdf).
5. [A10: componentes e decisões](../entregas/A10-Arquitetura-Rastreabilidade-Final.pdf).
6. [A13: casos e resultados](../05-qualidade/A13-estrategia-e-casos-de-teste.md).
7. [SM-01](../06-evolucao/SM-01-retorno-em-garantia.md), [PR #1](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/pull/1) e [v1.1.0](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/releases/tag/v1.1.0).
8. [A15: dívidas, riscos e roadmap](../../06-evolucao/A15-dossie-e-plano-evolucao.md) e [release final v2.0.0](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/releases/tag/v2.0.0).

## Caminhos por requisito

As descrições da origem abaixo resumem a entrevista; não são falas literais inventadas.

| Requisito | Origem, história e critério | Modelo e componente | Testes / mudança |
|---|---|---|---|
| RF1 | A3 §3/§4.1 RF01–RF02 e §4.3 RF14: dados de cliente/equipamento; RE1; HU1; CA01–CA03 | A9 §2.2/§2.3; C1/C2/C4 | CT01–CT03; DT02/DT03 abertos |
| RF2 | A3 §3/§4.1 RF03–RF05: abrir e acompanhar OS; RE2; HU1/HU2; CA03–CA05/CA16 | A9 §2.2/§2.3 e A10 §2.3; C1/C2/C4 | CT03–CT05, CT08, CT17, CT19; SM-01 na v1.1.0 |
| RF3 | A3 §4.1 RF06–RF07: buscar por nome/equipamento/número e histórico; RE3; HU1/HU2; CA08–CA11/CA19 | A9 evento inicial e A10 §2.6; C1/C2/C4 | CT10–CT13, CT17, CT22; SM-01 na v1.1.0 |
| RN1 | A3 §3/§4.1 RF04: estados principais; RE2; HU1/HU2; CA04–CA07 | A10 §2.3, tabela de decisão A13; C2/C4/C1 | CT04–CT09; DT01/DT04/DT05; SM-01 preserva regra |
| RN2 | SM-01 de 11/11, RE6; HU1; CA16–CA19. Origem posterior à A3 | [Fluxo de garantia](../../04-modelagem/fluxo-garantia.md); C1/C2/C4; wireframe pendente DIV06 | CT19–CT22 não executados; v1.1.0 documental; A8R10/I2 |
| RNF1 | A3 §4.2 RNF03: agilidade; RE5; HU1/HU2; CA14 | A8 §2.4/A10 §2.6, metas A11; C1/C2/C4 | CT16: carga e p95, não executado |
| RNF2 | A3 §4.1 RF12 e §4.3 RF17/RNF04/RNF05: perfis; RE4; HU1/HU2; CA12–CA13 | A9 autorização e A10 §2.2; C3/C2/C4 | CT14–CT15 não executados; DIV03 |
| RNF3 | A3 §4.2 RNF01–RNF02: poucas telas e campos; RE5; HU1; CA15 | A9 §2.3; C1 | CT18 com três participantes, não executado |

Se a escolha for HU1, sigam RF1/RF2/RF3/RN1/RN2/RNF3 na matriz. Para HU2, sigam RF2/RN1/RNF2. C1–C4 são componentes planejados, não uma integração já pronta.

## Exemplo completo para RF2

Na A3, §3, página 2, consta: “Segundo o stakeholder, cada atendimento precisa ser acompanhado por uma ordem de serviço.” É o resumo de uma entrevista simulada, não uma entrevista real gravada. Abrir essa página e localizar RF03–RF05 logo abaixo.

Em requisitos.md, localizar HU1 e RF2. Em CA03, conferir o vínculo cliente/equipamento. Em CA04, conferir número sequencial, data/hora, estado ABERTA e evento. Mostrar o fluxograma e o wireframe em A9 §2.2/§2.3. Na A10, C1 recebe os dados, C2 valida, C4 grava. A13 CT03 verificou vínculo inválido e passou no cenário. CT04 só demonstra parte da abertura. O complemento de garantia aparece em SM-01/RN2, PR #1 e v1.1.0.

## Perguntas prováveis

- **Por que 100% de cobertura não significa pronto?** Porque 19/19 critérios e 8/8 Must têm casos definidos. Só nove IDs foram exercitados no registro histórico, com um aprovado no cenário, três parciais e cinco falhas.
- **O que a equipe corrigiu?** Inconsistências documentais da A12, com commits. Os defeitos de produto preservados na A13 continuam no plano de evolução.
- **Por que criar outra OS na garantia?** A origem deve continuar concluída para preservar RN1 e o histórico. A nova OS referencia a anterior.
- **Por que 90 dias?** É a regra acadêmica acordada na SM-01 simulada, sem declaração de conformidade legal. CT19 verifica dia 90 e CT20 dia 91.
- **O sistema está em produção?** Não. O site local e o Java são independentes. Segurança no servidor, integração e medições de qualidade ainda estão pendentes.
- **Quem fez o quê?** Arthur liderou a maior parte e Lucas apoiou, revisou e aperfeiçoou, conforme declaração da equipe. A ficha explicita a evidência disponível e a exceção individual A6.
- **Como usaram IA?** Apoio declarado na elaboração e revisão. A3 e SM-01 usam stakeholder simulado. A equipe responde pela compreensão e o PO ainda precisa ratificar as validações indicadas como pendentes.
