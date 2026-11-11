# SM-01 — Retorno de equipamento em garantia

## 1. Linha de base

Antes de qualquer alteração foi criada a release **v1.0.0** do dossiê (tag anotada `v1.0.0` sobre o commit 8f3178b): https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/releases/tag/v1.0.0. Ela contém requisitos, backlog e matriz em `docs/dossie/`, além do plano de qualidade, da revisão e dos casos de teste em `docs/05-qualidade/`.

## 2. Registro da solicitação

**Origem:** stakeholder simulado com IA, usando o prompt do enunciado. O personagem é Marcos Almeida, o atendente da entrevista da A3. O contexto enviado ao simulador trazia o problema (papel e planilhas), o público (atendente, técnico e administrador), RF1–RF3, RN1 (OS concluída não volta), RNF1–RNF3, HU1 e HU2.

| ID | Solicitante | Data | Descrição (nas palavras do solicitante) | Motivo | Urgência |
|---|---|---|---|---|---|
| SM-01 | Marcos Almeida, atendente (stakeholder simulado da A3) | 11/11/2026 | "Apareceu um problema. Cliente pegou o notebook semana passada, a OS está como concluída, e hoje ele voltou com o mesmo defeito. O conserto tem garantia de 90 dias, então eu não posso tratar como serviço novo, mas o sistema não deixa mexer numa OS concluída. Do jeito que está, vou abrir outra OS do zero e ninguém vai saber que é garantia nem o que foi feito antes." | Retornos em garantia (2 a 3 por semana) ficam sem ligação com o conserto anterior; o técnico refaz o diagnóstico às cegas e o cliente pode ser tratado como serviço novo | Alta: acontece toda semana |

**Conversa com o solicitante simulado (trecho principal)**

> **Marcos:** Apareceu um problema. Cliente pegou o notebook semana passada, a OS está como concluída, e hoje ele voltou com o mesmo defeito. O conserto tem garantia de 90 dias, então eu não posso tratar como serviço novo, mas o sistema não deixa mexer numa OS concluída. [...] Preciso resolver isso logo, toda semana volta uns dois ou três.
>
> **Equipe (P1):** Quando o equipamento volta na garantia, precisa ser a mesma OS reaberta, ou pode ser uma OS nova que aponte para a anterior?
>
> **Marcos:** Tanto faz ser nova, desde que dê para ver na hora qual foi o conserto anterior e que fique claro que é garantia. O que eu não quero é procurar na pilha qual foi a OS de antes.
>
> **Equipe (P2):** O prazo de 90 dias conta a partir de quando? Da conclusão da OS ou da retirada pelo cliente?
>
> **Marcos:** Da conclusão. É quando a gente liga avisando que ficou pronto. A retirada a gente nem anota. Noventa dias corridos; no nonagésimo dia ainda vale.
>
> **Equipe (P3):** A garantia vale para qualquer defeito que aparecer ou só para o mesmo?
>
> **Marcos:** Só o mesmo defeito, ou alguma coisa naquilo que a gente mexeu. Quem decide de verdade é o técnico, depois de olhar. Mas eu já abro marcando que o cliente diz que é garantia, senão ele fica bravo no balcão.
>
> **Equipe (P4):** E se passar de 90 dias?
>
> **Marcos:** Aí não é garantia. O sistema pode me avisar a data em que venceu, e eu abro uma OS normal.
>
> **Equipe:** Reabrir a OS concluída quebraria uma regra que combinamos (OS concluída não volta), porque o histórico do primeiro conserto ficaria misturado com o segundo. Abrir uma OS nova ligada à anterior resolve o seu problema?
>
> **Marcos:** Resolve, se aparecer o número e o defeito da anterior. A parte de o técnico confirmar se é garantia e de não cobrar pode ficar para depois, desde que eu consiga registrar já.

## 3. Análise de impacto

Feita seguindo a matriz (`docs/dossie/matriz-rastreabilidade.md`) da origem até os testes, o backlog e os riscos.

| Item afetado | Como está hoje (v1.0.0) | Mudança necessária | Esforço (P/M/G) | Risco |
|---|---|---|---|---|
| Origem | RE1–RE5 | Nova origem RE6 (SM-01) | P | Nenhum relevante |
| RN2 (nova) | Não existe; nada trata retorno de serviço concluído | Garantia só com OS de origem CONCLUÍDA, do mesmo equipamento, até 90 dias corridos após a conclusão (o 90º dia ainda vale); a origem continua CONCLUÍDA | M | Contagem de dias ambígua (resolvida na P2: dias corridos a partir da conclusão) |
| RF2 | Abre OS comum para cliente e equipamento | Permitir abrir OS de retorno em garantia vinculada à OS de origem | M | Atendente confundir OS comum com OS de garantia |
| RF3 | Histórico por OS, sem relação entre OS | Mostrar o vínculo nas duas OS (número e defeito da origem) | P | Histórico do equipamento fragmentado se o vínculo não for gravado |
| HU1 | Cadastrar, abrir e localizar OS | Incluir o retorno em garantia na história do atendente | P | Nenhum relevante |
| Critérios de aceitação | CA01–CA15 | Novos CA16–CA19; o CA10 (filtro por equipamento) é adiado com o A8R11 | P | Critério novo sem caso de teste (mitigado: CT19–CT22) |
| Casos de teste | CT01–CT18 | Novos CT19–CT22; CT12 reprogramado para o I3; regressão em CT04, CT05, CT08, CT09, CT13, CT15, CT16 e CT17 | P | Regressão da RN1, se a implementação reabrir a OS de origem |
| Modelos (A9) | Fluxograma e wireframe da abertura comum | Fluxograma ganha a decisão "retorno em garantia?"; wireframe Nova OS ganha o campo "OS de origem" com o defeito anterior | M | Modelo desatualizado orientar implementação errada; atualizar no refinamento do A8R10, antes de "Selecionada para a Sprint" |
| Arquitetura (A10) | C2 controla o ciclo; C4 grava OS e eventos | C2 valida a RN2 (consulta estado, equipamento e data de conclusão da origem); C4 guarda o vínculo e a marca "Garantia"; C1 exibe a origem | P | Abertura mais lenta pela consulta extra (coberto pela regressão do CT16) |
| Plano de qualidade (A11) | Adequação funcional cobre RF1–RF3/RN1 | Incluir a RN2 na meta (a) | P | Nenhum relevante |
| Backlog | A8R01–A8R09 | Novo A8R10 (M, Must, I2); A8R08 reduzido à busca por nome (P); filtro por equipamento vira A8R11 (P, I3); confirmação pelo técnico vira A8R12 (Could, sem incremento) | M | Escopo do I2 crescer (R1) |
| Incremento | I2 = A8R06–A8R09 | I2 = A8R06, A8R07, A8R10, A8R08 (reduzido), A8R09; novo I3 = A8R11 | M | Prazo do I2 apertar |
| Riscos (A8) | R1–R4 | Novo R5 (garantia marcada para defeito diferente, 2 × 2 = 4); R1 reavaliado e mantido em 9 | P | Uso indevido da garantia no balcão |

**Itens conferidos que não precisam mudar:** RN1 (a OS de origem continua CONCLUÍDA e a OS de garantia segue o mesmo ciclo); RF1 e CA01–CA03 (o cadastro não muda); RNF1 (o retorno entra no fluxo de abertura já medido, sem meta nova); RNF2 e a matriz de perfis (abrir retorno é a operação O2, com as mesmas permissões); RNF3 (a meta de ≤ 1 min para cliente cadastrado vale também para o retorno); HU2 e CA12 (o técnico atende a OS de garantia como qualquer outra); componente C3; metas de Segurança, Confiabilidade, Desempenho e Interação da A11; Definition of Done (Q1–Q6); itens A8R01–A8R07 e A8R09.

## 4. Alternativas

| Alternativa | Prós | Contras | Efeito no prazo |
|---|---|---|---|
| A — Aprovar inteira, reabrindo a OS concluída | É o que o solicitante pediu primeiro; nenhuma OS nova | Viola a RN1 e o CA07; mistura dois atendimentos no mesmo histórico (R3); invalida CT09 e a meta "0 transições inválidas" da A11; o DT01 viraria comportamento "correto" | +1 Sprint: reescrever RN1, critérios e casos, mais a regressão completa |
| B — Aprovar parcialmente: OS de garantia vinculada (RN2), sem confirmação do técnico nem isenção de valores | Atende à necessidade confirmada na conversa (ver a anterior e marcar garantia); preserva RN1 e o histórico; cabe no I2 | Não resolve a cobrança (valores estão fora da linha de base) nem a confirmação técnica; acrescenta um campo na abertura | A8R10 (M) entra no I2; para caber, o filtro por equipamento (P) sai para o I3 |
| C — Adiar tudo para o I3 | Nenhum impacto no I2 | De 2 a 3 retornos por semana seguem sem vínculo, e a equipe já conhece o problema | Nenhum agora; o I3 cresce |
| D — Rejeitar | Escopo estável | A necessidade é real e recorrente; o atendente volta ao caderno (RNF3) | Nenhum |

## 5. Decisão

**Decisão: aprovar parcialmente (alternativa B).** No papel de Product Owner, a decisão foi registrada pela equipe em 11/11/2026, com ratificação de Chico Mosca registrada como pendência na ficha (o solicitante é simulado e o PO não participou da conversa).

**Por quê:** a conversa (P1, P4) mostrou que o atendente precisa de vínculo e visibilidade, não da reabertura em si. A alternativa B entrega isso sem violar a RN1, que protege o histórico (R3, a meta de Adequação funcional da A11). A alternativa A desfaria a correção do DT01 e invalidaria testes já planejados.

**O que sai ou é adiado para a mudança caber:** o filtro de OS por equipamento sai do A8R08 e vira A8R11 no I3 (o CT12 vai junto). A confirmação ou recusa da garantia pelo técnico e a isenção de cobrança ficam registradas no backlog como A8R12 (Could, sem incremento), porque dependem de um requisito de valores que ainda não foi aprovado (A3 RF09).

## 6. Implementação com controle de versão

- Branch: `sm-01-garantia`, criada a partir da v1.0.0.
- Commits: 4aef4b9 (requisitos), 43149fb (backlog), 553a393 (matriz, casos de teste e plano) e o commit deste registro e do CHANGELOG. Todos citam "Refs: SM-01".
- Commit de correção após a revisão: d547efd (mensagens do CA18, achado R-01).
- Pull request: **#1**, "SM-01: retorno de equipamento em garantia (RN2)", que cita a SM-01 na descrição — https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/pull/1
- Revisão: revisor simulado com IA, que aplicou o checklist da equipe. Encontrou 1 achado menor (R-01), corrigido no commit d547efd, e aprovou o PR. Parecer publicado como comentário no PR e em `docs/06-evolucao/SM-01-revisao-pr.md`.
- Merge no `main`: commit f122e24.
- Release nova: **v1.1.0** — https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/releases/tag/v1.1.0
- Mensagens de commit no padrão "tipo(escopo): o que mudou", com o porquê no corpo e "Refs: SM-01".

**Antes e depois de dois artefatos alterados**

| Artefato | Antes (v1.0.0) | Depois (v1.1.0) |
|---|---|---|
| `docs/dossie/requisitos.md`, RF2 | "...gerando número único sequencial, data/hora de abertura e estado ABERTA; deve permitir atribuir técnico e mudar o estado conforme RN1..." | "...estado ABERTA; **deve permitir abrir uma OS de retorno em garantia vinculada a uma OS concluída, conforme RN2**; deve permitir atribuir técnico..." e nova RN2 |
| `docs/dossie/backlog.md`, item 8 e I2 | "A8R08 — Pesquisar por cliente e equipamento (M, I2)"; I2 = A8R06–A8R09 | "A8R10 — Abrir retorno em garantia (M, I2)"; "A8R08 — Pesquisar por nome parcial (P, I2)"; "A8R11 — Filtrar por equipamento (P, I3)"; "A8R12 (Could)"; risco R5 |
| `docs/dossie/matriz-rastreabilidade.md` | Sem RN2; RF2, RF3 e HU1 sem CA16–CA19 e sem CT19–CT22 | Linha da RN2 e linhas RF2, RF3 e HU1 marcadas com **[SM-01]**, com os novos critérios e casos |

## 7. Rastreabilidade e testes atualizados

- Matriz com a SM-01 indicada nas linhas RF2, RF3, RN2 e HU1.
- Casos novos: CT19 (90º dia, aceita), CT20 (91º dia, recusa), CT21 (origem não concluída ou de outro equipamento), CT22 (vínculo exibido nas duas OS). Caso alterado: CT12, reprogramado para o I3.
- Regressão: CT04, CT05, CT08, CT09, CT13, CT15, CT16 e CT17. Detalhes em `docs/05-qualidade/A13-estrategia-e-casos-de-teste.md`, seção "Casos acrescentados pela SM-01".
- CHANGELOG.md com a versão 1.1.0.

## 8. Links

- Release da linha de base v1.0.0: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/releases/tag/v1.0.0
- Pull request #1 (SM-01): https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/pull/1
- Release v1.1.0: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/releases/tag/v1.1.0
- Diferenças entre as versões: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/compare/v1.0.0...v1.1.0
- CHANGELOG: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/blob/main/CHANGELOG.md
