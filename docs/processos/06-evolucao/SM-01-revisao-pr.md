# Revisão do pull request da SM-01

**Revisor:** revisor simulado com IA (Claude), como permitido no enunciado da A14 e já usado na A12. Os dois integrantes participaram da elaboração da mudança, então nenhum deles revisa o próprio trabalho. A equipe escreveu o checklist abaixo; o revisor aplicou cada critério com sim/não e apontou os problemas sem reescrever os artefatos.

**Objeto:** branch `sm-01-garantia` contra `main` (v1.0.0), commits 4aef4b9, 43149fb, 553a393 e 482f895; correção do R-01 no commit seguinte.

| Critério | Resultado | Observação do revisor |
|---|---|---|
| O PR e todos os commits citam a SM-01? | Sim | "Refs: SM-01" em todos os commits |
| A RN1 continua sem alteração (a OS de origem não é reaberta)? | Sim | RN1 idêntica à v1.0.0; a RN2 declara que a origem continua CONCLUÍDA |
| Todo critério novo (CA16–CA19) tem pelo menos um caso de teste? | Sim | CT19–CT22 |
| Todo critério novo tem resultado verificável (mensagem ou estado exato)? | Não | CA18 dizia "informa o motivo", mas o CT21 espera mensagens específicas que o critério não define |
| A matriz marca com [SM-01] todas as linhas afetadas? | Sim | RF2, RF3, RN2 e HU1 |
| O backlog mostra o que sai para a mudança caber? | Sim | A8R11 vai para o I3; A8R12 fica sem incremento |
| A lista de regressão cobre RN1, abertura, histórico, autorização e desempenho? | Sim | CT04, CT05, CT08, CT09, CT13, CT15, CT16, CT17 |
| O CHANGELOG tem a 1.1.0 com Adicionado, Alterado, Corrigido e Removido? | Sim | — |
| Os itens conferidos que não mudam estão listados? | Sim | Seção 3 do registro da SM-01 |

**Achado:** R-01 (Menor) — o CA18 não define as mensagens que o CT21 verifica. Corrigido no commit seguinte da branch: o CA18 passou a citar "A OS n ainda não foi concluída." e "A OS n é de outro equipamento."

**Parecer:** aprovado após a correção do R-01. Merge autorizado no `main`, seguido da release v1.1.0.
