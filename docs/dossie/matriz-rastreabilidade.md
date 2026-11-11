# Matriz de rastreabilidade — TechFix

Fonte versionada da matriz da A10 (`docs/entregas-processos/A10-Arquitetura-Rastreabilidade-Final.pdf`, seção 2.5), corrigida na A12 (achados D10–D12 e D14) e ampliada até os casos de teste na A13. Componentes: C1 Interface web, C2 API e lógica de negócio, C3 Autenticação e autorização, C4 Persistência e banco.

Referências versionadas: A3 `docs/entregas-processos/Atividade_03_Levantamento_Requisitos_TechFix.pdf`; requisitos e critérios `docs/dossie/requisitos.md`; casos de teste `docs/05-qualidade/A13-estrategia-e-casos-de-teste.md`; backlog `docs/dossie/backlog.md` (A8 em `docs/entregas-processos/A8-Entrega-Final.pdf`); modelos `docs/entregas-processos/Modelagem-Entrega-Final.pdf` (§2.2 fluxograma, §2.3 wireframe); arquitetura `docs/entregas-processos/A10-Arquitetura-Rastreabilidade-Final.pdf` (§2.2 componentes, §2.3 fluxo, §2.6 verificação).

Caminho: origem → história → requisito → critério de aceitação → caso(s) de teste → componente, seguido de backlog e modelo.

| Origem (A3 → A4) | História | Requisito | Critérios de aceitação | Casos de teste | Componentes | Backlog e incremento | Modelo ou decisão arquitetural |
|---|---|---|---|---|---|---|---|
| A3 §4.1 p. 2 RF01/RF02; §4.3 p. 3 RF14 → RE1 | HU1 | RF1 — Cadastro | CA01, CA02, CA03 | CT01, CT02, CT03 | C1 recebe; C2 valida campos e vínculo; C4 grava | A8R02; I1 | A9 §2.2/§2.3: seleção, cadastro rápido, obrigatórios |
| A3 §3 e §4.1 p. 2 RF03–RF05 → RE2 | HU1, HU2 | RF2 — Abrir e atualizar OS | CA03, CA04, CA05 | CT03, CT04, CT05, CT08, CT17 | C1 recebe ações; C2 controla ciclo; C4 grava OS e eventos | A8R03 (I1); A8R06, A8R07 (I2) | A9 §2.2/§2.3: abertura; A10 §2.3: responsável e evolução |
| A3 §4.1 p. 2 RF06/RF07 → RE3 | HU1, HU2 | RF3 — Pesquisa e histórico | CA08, CA09, CA10, CA11 | CT10, CT11, CT12, CT13, CT17 | C1 apresenta; C2 consulta e ordena; C4 armazena | A8R04, A8R05 (I1); A8R08 (I2) | A9 §2.2: evento inicial; A10 §2.6: busca e eventos cronológicos |
| A3 §4.1 p. 2 RF04 → RE2 | HU1, HU2 | RN1 — Ciclo de estados | CA04, CA05, CA06, CA07 | CT04, CT05, CT06, CT07, CT08, CT09 | C2 aplica a regra; C4 persiste estado e evento; C1 informa | A8R03 (I1); A8R06, A8R07 (I2) | A10 §2.3: transições, técnico obrigatório para iniciar, sem regressão |
| A3 §4.2 p. 3 RNF03 → RE5 | HU1, HU2 | RNF1 — Desempenho | CA14 | CT16 | C1 tempo percebido; C2/C4 processam e permitem medição | A8R09; I2 | A8 §2.4 e A10 §2.6: 10.000 OS, 10 usuários, p95 ≤ 2 s |
| A3 §4.1 p. 2 RF12; §4.3 p. 3 RF17, RNF04/RNF05 → RE4 | HU1, HU2 | RNF2 — Acesso por perfil | CA12, CA13 | CT14, CT15 | C3 verifica; C2 aplica antes da operação; C4 mantém perfis | A8R01; I1 e transversal no I2 | A9 §2.2: autorização antes da operação; A10 §2.2: controle no servidor |
| A3 §4.2 p. 2 RNF01/RNF02 → RE5 | HU1 | RNF3 — Operabilidade da abertura | CA15 | CT18 | C1 | A8R02, A8R03; I1 (medição na Review) | A9 §2.3: tela única com cadastro rápido |
| A3 §3 e §4.1 p. 2 RF01–RF03, RF06, RF07 → RE1, RE3 | HU1 — Atendente cadastra e localiza OS | RF1, RF2, RF3, RN1, RNF3 | CA01–CA04, CA08–CA11, CA15 | CT01–CT04, CT10–CT13, CT18 | C1 apoia; C2/C4 realizam; C3 autoriza | A8R02–A8R05 (I1); A8R08 (I2) | A9 §2.2/§2.3: recepção e abertura; A10 §2.6: consulta |
| A3 §4.1 p. 2 RF04, RF05, RF12 → RE2 | HU2 — Técnico acompanha suas OS | RF2, RN1, RNF2 | CA05, CA11, CA12 | CT05, CT08, CT13, CT14 | C1 apoia; C2 filtra e controla; C3 autoriza; C4 registra | A8R05 (I1); A8R06, A8R07 (I2) | A10 §2.3/§2.6: lista atribuída, início e conclusão; tela do técnico a modelar no I2 (D13) |
