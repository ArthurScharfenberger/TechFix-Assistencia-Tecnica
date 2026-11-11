# Matriz de rastreabilidade — TechFix

Fonte versionada da matriz da A10 (`docs/entregas-processos/A10-Arquitetura-Rastreabilidade-Final.pdf`, seção 2.5). Componentes: C1 Interface web, C2 API e lógica de negócio, C3 Autenticação e autorização, C4 Persistência e banco.

Referências da A10: A3 (`Atividade_03_Levantamento_Requisitos_TechFix.pdf`), A4 (`Atividade04.md`), A8 (`A8-Entrega-Final-Revisada.md`), modelos (`Modelagem-Entrega-Final.md`, seções 2.2 e 2.3), processo (`A7-Processo-Entrega-Final.md`) e diagrama (`A10-Arquitetura.svg`).

| Requisito da A5 | Origem A3 e referência intermediária | Backlog e incremento | Modelo ou decisão arquitetural | Componentes |
|---|---|---|---|---|
| RF1 — Cadastro; HU1 | A3 §4.1, p. 2, RF01/RF02; §4.3, p. 3, RF14. A4 RE1 | A8R02; I1 | Modelo final 2.2/2.3: seleção, cadastro rápido e campos obrigatórios | C1 recebe; C2 valida vínculo e campos; C4 grava |
| RF2 — Criar e acompanhar OS; HU1/HU2 | A3 §3 e §4.1, p. 2, RF03–RF05. A4 RE2 | A8R03; I1. A8R06/A8R07; I2 | Modelo final 2.2/2.3: abertura. A10 2.3: responsável e evolução | C1 recebe ações; C2 controla ciclo; C4 grava OS/eventos |
| RF3 — Pesquisa e histórico; HU1/HU2 | A3 §4.1, p. 2, RF06/RF07. A4 RE3 | A8R04/A8R05; I1. A8R05/A8R08; I2 | Modelo final 2.2: evento inicial. A10 2.6: busca e eventos cronológicos | C1 apresenta; C2 consulta/ordena; C4 armazena |
| RN1 — Ciclo de estados; HU1/HU2 | A3 §4.1, p. 2, RF04. A4 RE2/RN1 | A8R03; I1. A8R06/A8R07; I2 | Modelo final 2.2: ABERTA. A10 2.3: transições e proibição de regressão | C2 aplica a regra; C4 persiste; C1 informa |
| RNF1 — Desempenho | A3 §4.2, p. 2–3, RNF01–RNF03. A4 RE5 | A8R09; I2 | A8 2.4 e A10 2.6: até 10.000 OS, 95% em até 2 s | C1 tempo percebido; C2/C4 processam e permitem medição |
| RNF2 — Acesso por perfil | A3 §4.1, p. 2, RF12; §4.3, p. 3, RNF04/RNF05. A4 RE4 | A8R01; I1 e transversal no I2 | Modelo final 2.2: decisão de autorização. A10 2.2: controle no servidor | C3 verifica; C2 aplica antes da operação; C4 mantém perfis |
| HU1 — Atendente cadastra e localiza OS | A3 §3 e §4.1, p. 2, RF01–RF03/RF06/RF07. A4 RE1/RE3 | A8R02–A8R05; I1. A8R08; I2 | Modelo final 2.2/2.3: recepção e abertura. A10 2.6: consulta | C1 apoia; C2/C4 realizam; C3 autoriza |
| HU2 — Técnico acompanha e atualiza suas OS | A3 §4.1, p. 2, RF04/RF05/RF12. A4 RE2 | A8R05; I1. A8R05–A8R07; I2 | A10 2.3/2.6: lista atribuída, início e conclusão; modelo de tela a detalhar | C1 apoia; C2 filtra/controla; C3 autoriza; C4 registra |
