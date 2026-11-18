# Matriz de rastreabilidade — TechFix

Fonte versionada da matriz da A10 (`docs/processos/entregas/A10-Arquitetura-Rastreabilidade-Final.pdf`, seção 2.5), corrigida na A12 (achados D10–D12 e D14), ampliada até os casos de teste na A13 e atualizada pela SM-01 (v1.1.0). Linhas afetadas pela mudança estão marcadas com **[SM-01]**. Componentes: C1 Interface web, C2 API e lógica de negócio, C3 Autenticação e autorização, C4 Persistência e banco.

Referências versionadas: A3 `docs/processos/entregas/Atividade_03_Levantamento_Requisitos_TechFix.pdf`; requisitos e critérios `docs/processos/dossie/requisitos.md`; casos de teste `docs/processos/05-qualidade/A13-estrategia-e-casos-de-teste.md`; backlog `docs/processos/dossie/backlog.md` (A8 em `docs/processos/entregas/A8-Entrega-Final.pdf`); modelos `docs/processos/entregas/Modelagem-Entrega-Final.pdf` (§2.2 fluxograma, §2.3 wireframe); arquitetura `docs/processos/entregas/A10-Arquitetura-Rastreabilidade-Final.pdf` (§2.2 componentes, §2.3 fluxo, §2.6 verificação).

Caminho: origem → história → requisito → critério de aceitação → caso(s) de teste → componente, seguido de backlog e modelo.

Atualização AS (A15, 18/11/2026): os IDs da tabela permanecem estáveis. C1–C4 descrevem a arquitetura planejada; o Java de POO não é a API do site. [Complemento do fluxo da RN2](../../04-modelagem/fluxo-garantia.md), [revisão de coerência](../../06-evolucao/A15-revisao-coerencia.md) e [dívidas e riscos](../../06-evolucao/A15-dossie-e-plano-evolucao.md).

| Origem (A3 → A4) | História | Requisito | Critérios de aceitação | Casos de teste | Componentes | Backlog e incremento | Modelo ou decisão arquitetural |
|---|---|---|---|---|---|---|---|
| A3 §4.1 p. 2 RF01/RF02; §4.3 p. 3 RF14 → RE1 | HU1 | RF1 — Cadastro | CA01, CA02, CA03 | CT01, CT02, CT03 | C1 recebe; C2 valida campos e vínculo; C4 grava | A8R02; I1 | A9 §2.2/§2.3: seleção, cadastro rápido, obrigatórios |
| A3 §3 e §4.1 p. 2 RF03–RF05 → RE2; SM-01 → RE6 | HU1, HU2 | RF2 — Abrir e atualizar OS **[SM-01]** | CA03, CA04, CA05, CA16 | CT03, CT04, CT05, CT08, CT17, CT19 | C1 recebe ações; C2 controla ciclo e vínculo de garantia; C4 grava OS, vínculo e eventos | A8R03 (I1); A8R06, A8R07, A8R10 (I2) | A9 §2.2/§2.3: abertura; A10 §2.3: responsável e evolução |
| A3 §4.1 p. 2 RF06/RF07 → RE3; SM-01 → RE6 | HU1, HU2 | RF3 — Pesquisa e histórico **[SM-01]** | CA08, CA09, CA10, CA11, CA19 | CT10, CT11, CT12, CT13, CT17, CT22 | C1 apresenta; C2 consulta e ordena; C4 armazena | A8R04, A8R05 (I1); A8R08, A8R10 (I2); A8R11 (I3) | A9 §2.2: evento inicial; A10 §2.6: busca e eventos cronológicos |
| A3 §4.1 p. 2 RF04 → RE2 | HU1, HU2 | RN1 — Ciclo de estados | CA04, CA05, CA06, CA07 | CT04, CT05, CT06, CT07, CT08, CT09 | C2 aplica a regra; C4 persiste estado e evento; C1 informa | A8R03 (I1); A8R06, A8R07 (I2) | A10 §2.3: transições, técnico obrigatório para iniciar, sem regressão |
| SM-01 (solicitação de Marcos Almeida, 11/11/2026) → RE6 | HU1 | RN2 — Retorno em garantia em até 90 dias **[SM-01]** | CA16, CA17, CA18, CA19 | CT19, CT20, CT21, CT22 | C2 valida prazo, estado e equipamento da origem; C4 grava o vínculo; C1 mostra a origem | A8R10 (I2); A8R12 adiado | A9 §2.2/§2.3 a atualizar no refinamento do A8R10 (decisão "retorno em garantia?" e campo "OS de origem") |
| A3 §4.2 p. 3 RNF03 → RE5 | HU1, HU2 | RNF1 — Desempenho | CA14 | CT16 | C1 tempo percebido; C2/C4 processam e permitem medição | A8R09; I2 | A8 §2.4 e A10 §2.6: 10.000 OS, 10 usuários, p95 ≤ 2 s |
| A3 §4.1 p. 2 RF12; §4.3 p. 3 RF17, RNF04/RNF05 → RE4 | HU1, HU2 | RNF2 — Acesso por perfil | CA12, CA13 | CT14, CT15 | C3 verifica; C2 aplica antes da operação; C4 mantém perfis | A8R01; I1 e transversal no I2 | A9 §2.2: autorização antes da operação; A10 §2.2: controle no servidor |
| A3 §4.2 p. 2 RNF01/RNF02 → RE5 | HU1 | RNF3 — Operabilidade da abertura | CA15 | CT18 | C1 | A8R02, A8R03; I1 (medição na Review) | A9 §2.3: tela única com cadastro rápido |
| A3 §3 e §4.1 p. 2 RF01–RF03, RF06, RF07 → RE1, RE3; SM-01 → RE6 | HU1 — Atendente cadastra e localiza OS **[SM-01]** | RF1, RF2, RF3, RN1, RN2, RNF3 | CA01–CA04, CA08–CA11, CA15–CA19 | CT01–CT04, CT10–CT13, CT18–CT22 | C1 apoia; C2/C4 realizam; C3 autoriza | A8R02–A8R05 (I1); A8R08, A8R10 (I2); A8R11 (I3) | A9 §2.2/§2.3: recepção e abertura; A10 §2.6: consulta |
| A3 §4.1 p. 2 RF04, RF05, RF12 → RE2 | HU2 — Técnico acompanha suas OS | RF2, RN1, RNF2 | CA05, CA11, CA12 | CT05, CT08, CT13, CT14 | C1 apoia; C2 filtra e controla; C3 autoriza; C4 registra | A8R05 (I1); A8R06, A8R07 (I2) | A10 §2.3/§2.6: lista atribuída, início e conclusão; tela do técnico a modelar no I2 (D13) |

## Situação consolidada para a AS

Evidência: saídas Java/frontend da A13 de 11/11/2026. Não foi declarada nova execução na A15.

| Testes | Situação da evidência | Defeito ou dívida | Mudança e planejamento |
|---|---|---|---|
| CT01–CT02 | Falharam no domínio Java | DT03/DT02, DIV05 | A8R02 no I1; correção ainda aberta |
| CT03 | Passou no cenário de vínculo inválido do frontend | Sem defeito nesse cenário | A8R02/A8R03; não comprova aceite integral |
| CT04 | Parcial: estado e identificador; sem comprovar número sequencial e evento | DIV07 | A8R03/A8R05; repetir após integração e na regressão SM-01 |
| CT05 e CT08 | Parciais: transição de estado, sem verificar evento | DIV04/DIV07 | A8R06/A8R07; regressão SM-01 |
| CT06, CT07 e CT09 | Falharam; transições indevidas aceitas | DT04, DT05, DT01; DIV04 | A8R06/A8R07; CT09 integra regressão SM-01 |
| CT10–CT11 e CT13 | Não executados | DIV07 | A8R04/A8R08/A8R05; CT13 integra regressão SM-01 |
| CT12 | Não executado | Sem nova dívida específica | A8R11 adiado para I3 pela SM-01 |
| CT14–CT15 | Não executados | DIV03/DIV06 | A8R01/A8R06; CT15 integra regressão SM-01 |
| CT16 | Não executado; sem medição de carga | R4 | A8R09; regressão SM-01 |
| CT17 | Não executado; sem ensaio integrado de falha | DIV07, R3/R6 | A8R03/A8R05; regressão SM-01 |
| CT18 | Não executado com participantes | Validação do PO pendente | A8R02/A8R03; não presumir usabilidade comprovada |
| CT19–CT22 | Especificados, não executados | DIV06/DIV07 | RN2, CA16–CA19, A8R10 no I2; originados pela SM-01 |

SM-01 altera RF2, RF3, RN2 e HU1; mantém RN1, inclui A8R10, reprograma A8R11/CT12 e adia A8R12. [PR #1](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/pull/1) é evidência da mudança documental, não implementação da garantia. A A15 não renumera requisitos nem introduz nova regra de produto.
