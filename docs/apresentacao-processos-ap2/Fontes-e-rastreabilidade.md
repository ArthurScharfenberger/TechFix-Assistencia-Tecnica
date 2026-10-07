# Fontes da apresentação AP2

Os números de página abaixo são os do PDF. Os modelos foram redesenhados nos slides 8 e 9 para leitura em projeção, preservando os comportamentos descritos nas fontes. As fontes específicas também estão nas notas de cada slide.

| Slides | Fonte e localização | Evidência utilizada |
|---|---|---|
| 2 e 11 | [A3](../entregas-processos/Atividade_03_Levantamento_Requisitos_TechFix.pdf), p. 1–3, §3 e §4 | Resumo de entrevista simulada com Marcos Almeida; requisitos diretos e deduzidos. |
| 2 e 11 | [A4](../Atividade04.md), RE1–RE5, RF1–RF3, RN1, RNF1/RNF2, HU1/HU2 | Consolidação de necessidades e histórias. |
| 2, 5, 11 e 15 | [A5 local](../Atividade05.pdf), §2.2.2–2.2.3; feedback da professora | Critérios/prioridades. A tabela local §2.2.1 diverge da versão descrita no feedback; deve ser conciliada. Volume RNF1: até 10.000 OS. |
| 3 | [A2](../entregas-processos/atividade02-12-08.pdf), §2 | Incremental com práticas ágeis; usuário confirmou iterativo e incremental. |
| 4 | [A6 de Arthur](../entregas-processos/Atividade_06_Reflexao_Individual_Arthur_Scharfenberger.pdf), plano de melhoria | Revisar antes de concluir, aplicado à DoD. |
| 3–4 | [A7 final](../entregas-processos/A7-Processo-Entrega-Final.md), §2.1–2.5 | Scrum, papéis, Sprint semanal planejada, fluxo e DoD. |
| 5–7 | [A8 revisada](../entregas-processos/A8-Entrega-Final-Revisada.md), §2.1–2.6 | Nove itens, incrementos, P/M/G, riscos e mitigação. |
| 8–9 | [Modelagem final](../entregas-processos/Modelagem-Entrega-Final.md), §2.1–2.5; [fluxograma](../entregas-processos/final-fluxograma.png); [wireframe](../entregas-processos/final-wireframe.png) | A8R02/A8R03, autorização, campos e vínculo, gravação conjunta, estados alternativos de feedback. |
| 10–12 e 14–15 | [A10 final](../entregas-processos/A10-Arquitetura-Rastreabilidade-Final.md), §2.2–2.8; [diagrama](../entregas-processos/A10-Arquitetura.svg) | Componentes C1–C4, rastreabilidade, critérios e limites da implementação atual. |

## Caminho demonstrado no slide 11

1. **A3, p. 2, §3 e §4.1:** RF03 prevê OS; RF04 prevê estados; RF05 prevê técnico responsável. O arquivo é um resumo de simulação, não uma transcrição de entrevista real.
2. **A4:** RE2 consolida essa necessidade em RF2 e RN1, com HU1 (atendente) e HU2 (técnico). **A5 §2.2.2** refina critérios verificáveis.
3. **A8 §2.2:** A8R03 abre a OS no I1; A8R06/R07 tratam de atribuição/início/conclusão no I2. A8R01 e R05 são dependências de autorização e histórico.
4. **A9 §2.2/2.3:** fluxo e tela Nova OS detalham a abertura. A tela específica do técnico não está nesses modelos; a evolução de estados aparece em A10 §2.3.
5. **A10 §2.2/2.5:** C1 recebe a ação; C2 valida/cria/controla estado; C3 autoriza; C4 grava a OS e o evento de histórico.

**Atenção aos identificadores:** RF03 na A3 significa ordem de serviço; RF3 na A4/A5 significa pesquisa e histórico. Não há correspondência automática apenas pelo número.

## Correspondência das oito linhas da matriz

| Requisito A4/A5 | Origem documental A3 | Backlog A8 | Destino arquitetural |
|---|---|---|---|
| RF1 / HU1 | p. 2, RF01/RF02; p. 3, RF14 | R02 | C1/C2/C4; C3 transversal |
| RF2 | p. 2, RF03–RF05 | R03/R06/R07 | C1/C2/C3/C4 |
| RF3 | p. 2, RF06/RF07 | R04/R05/R08 | C1/C2/C4; C3 transversal |
| RN1 | p. 2, RF04; refinamento de regra na A5 | R03/R06/R07 | C2/C4 |
| RNF1 | p. 2–3, RNF01–RNF03; limites numéricos na A5 | R09 | C1/C2/C4 |
| RNF2 | p. 2, RF12; p. 3, RNF04/RNF05 | R01 | C2/C3/C4 |
| HU1 | p. 2, RF01–RF03/RF06/RF07 | R02–R05/R08 | C1–C4 |
| HU2 | p. 2, RF04/RF05/RF12 | R05–R07 | C1–C4 |

O papel de Chico Mosca como PO vem do planejamento A7 baseado no feedback. Marcos Almeida é o personagem da simulação A3. Os registros não comprovam validação real do produto por nenhum deles.

O [registro de revisão](../entregas-processos/Registro-Revisao-Equipe.md) mantém em aberto o consenso da dupla e a conferência das versões A5/A9. A1 permanece fora da revisão, conforme orientação do usuário.
