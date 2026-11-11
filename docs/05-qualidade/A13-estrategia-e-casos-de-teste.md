# A13 — Criar testes e ampliar rastreabilidade — Entrega final

Base: requisitos e critérios CA01–CA15 em `docs/dossie/requisitos.md` (corrigidos na A12), metas da A11 (`docs/05-qualidade/A11-plano-qualidade.md`), prioridades da A5 e riscos R1–R4 da A8.

## 2.1 Estratégia de testes

**Escopo.** Entram os fluxos dos incrementos I1 e I2 (A8R01–A8R09): cadastro de cliente e equipamento, abertura da OS, ciclo de estados, buscas, histórico e autorização por perfil, além das metas não funcionais da A11 (desempenho, tolerância a falhas e operabilidade). Ficam de fora: valores, painel e relatórios (A3 RF08–RF11), porque estão fora da linha de base (A8 R1); integrações externas, que não existem (A10 §2.2); compatibilidade entre navegadores além do Chrome e do Edge atuais (Flexibilidade foi adiada na A11 §2.4); e os módulos herdados do protótipo (manutenções, indicativos, relatórios), sem requisito na linha de base.

**Níveis e tipos.** Unidade: regras de C2 (RN1, validações de RF1) em JUnit 5 no domínio Java. Integração: C2 + C4 (gravação da OS com evento, falha injetada) e C2 + C3 (autorização). Sistema: fluxo C1 → C4 pela interface. Aceitação: critérios CA demonstrados ao PO na Sprint Review. Tipos: funcional, regressão e quatro testes não funcionais ligados a metas da A11 — segurança (CT15), desempenho (CT16), confiabilidade (CT17) e operabilidade (CT18).

**Técnicas e onde foram usadas.** Partição de equivalência nos campos de cadastro e no vínculo cliente/equipamento (CT01–CT04) e nas buscas por nome e equipamento (CT11, CT12). Valor limite no número da OS (CT10), no tempo de 2 s com 10.000 OS (CT16) e nos limites de 1 min e 3 min (CT18). Tabela de decisão na RN1 (CT05–CT09). Teste exploratório: uma sessão de 30 min por incremento na tela Nova OS e na lista do técnico, com a missão "tentar gravar uma OS inconsistente"; os achados entram na tabela de defeitos.

**Onde testar mais e por quê.** A maior densidade de casos está na RN1 (5 casos, tabela de decisão): ela é Must, a A8 a liga ao risco R3 (P × I = 6) e a execução já mostrou falhas. A autorização (RNF2) vem em seguida, com 14 tentativas negadas em um único caso: é Must e tem o maior risco (R2 = 9). A abertura da OS recebe casos de partição e de falha injetada, porque todos os fluxos dependem dela (A8R03, R3). O RNF1 é Should e tem um caso só, mas é de carga, porque o R4 aponta incerteza de ambiente.

**Critérios de entrada.** O item está em "Em verificação" no fluxo da A7; os critérios CA estão definidos em `docs/dossie/requisitos.md`; o código compila e os testes anteriores passam; os perfis e a massa de dados estão carregados (para o CT16, 10.000 OS geradas por script).

**Critérios de saída.** Todos os casos de prioridade Alta do incremento foram executados; nenhum defeito Crítico ou Maior está aberto nos itens do incremento; as metas da A11 foram atingidas (14 de 14 tentativas negadas, p95 ≤ 2,0 s, 0 OS parcial em 20 falhas, ≤ 1 min e ≤ 3 min); os defeitos menores têm decisão registrada do PO.

**Ambiente, dados, responsáveis e quando.** Ambiente local com JDK 25 + JUnit 5 (domínio Java) e Node 24 (serviços do frontend); ambiente de ensaio com API e banco quando C2–C4 existirem. Massa base: um usuário por perfil; técnicos João Pereira e Maria Costa; clientes Ana Souza, Bruno Lima e Carlos Souto; OS de nº 1 a 25. Lucas é responsável por CT04–CT13, CT16 e CT17 (C2/C4); Arthur, por CT01–CT03, CT14, CT15 e CT18 (C1/C3); o PO Chico Mosca valida o CT18 e o aceite. I1: CT01–CT04, CT10, CT13, CT15, CT17 e CT18. I2: CT05–CT09, CT11, CT12, CT14, CT16 e a repetição do CT18.

## 2.2 Casos de teste

Tabela de decisão da RN1, usada em CT05–CT09:

| Regra | Estado atual | Técnico atribuído | Ação | Resultado esperado |
|---|---|---|---|---|
| T1 | ABERTA | Sim | Iniciar | EM ATENDIMENTO e evento no histórico |
| T2 | ABERTA | Não | Iniciar | Rejeita: "Atribua um técnico antes de iniciar o atendimento." |
| T3 | ABERTA | Sim ou não | Concluir | Rejeita: "Só é possível concluir uma OS em atendimento." |
| T4 | EM ATENDIMENTO | Sim | Concluir | CONCLUÍDA e evento no histórico |
| T5 | CONCLUÍDA | Sim | Mudar para qualquer estado | Rejeita: "OS concluída não pode mudar de estado." |

| ID | Requisito ou critério | Técnica | Pré-condição | Entrada | Passos | Resultado esperado | Prioridade | Status |
|---|---|---|---|---|---|---|---|---|
| CT01 | RF1 · CA01 | Partição de equivalência (classe válida, e-mail vazio) | Atendente autenticado; Ana Souza não cadastrada | Nome "Ana Souza"; telefone "(51) 99999-0000"; e-mail vazio; tipo NOTEBOOK; defeito "Não liga" | Abrir Nova OS; Cadastro rápido; preencher; Confirmar | Cliente e equipamento salvos e vinculados; mensagem "Cadastro realizado"; Ana Souza selecionada no formulário | Alta | Executado: falhou (DT03) |
| CT02 | RF1 · CA02 | Partição de equivalência (classe inválida: 2 obrigatórios vazios) — negativo | Atendente autenticado | Nome "Bruno Lima"; telefone vazio; tipo DESKTOP; defeito vazio | Cadastro rápido; preencher; Confirmar | Nada é salvo; "Campo obrigatório" junto a Telefone e a Defeito na mesma tentativa; dados digitados mantidos | Alta | Executado: falhou (DT02) |
| CT03 | RF1, RF2 · CA03 | Partição de equivalência (equipamento de outro cliente) — negativo | Ana com EQ-1; Bruno com EQ-2 | Cliente Ana Souza; equipamento EQ-2 | Abrir OS; Confirmar | Recusa com "O equipamento selecionado não pertence ao cliente informado."; 0 OS gravadas | Alta | Executado: passou |
| CT04 | RF2, RN1 · CA04 | Partição de equivalência (cliente e equipamento válidos) | Última OS nº 24; Ana com EQ-1 | Ana Souza; EQ-1 | Abrir OS; Confirmar | OS nº 25; data/hora da abertura; estado ABERTA; técnico "não atribuído"; evento "OS aberta" com o usuário | Alta | Executado: passou no estado ABERTA; número sequencial e evento ainda não existem no protótipo |
| CT05 | RN1 · CA05 | Tabela de decisão T1 | OS 1 ABERTA com técnico João Pereira | Ação Iniciar | Abrir OS 1; Iniciar atendimento | Estado EM ATENDIMENTO; histórico com "Atendimento iniciado", João Pereira, data e hora | Alta | Executado: passou (estado) |
| CT06 | RN1 · CA06 | Tabela de decisão T2 — negativo | OS 2 ABERTA sem técnico | Ação Iniciar | Abrir OS 2; Iniciar atendimento | Rejeição "Atribua um técnico antes de iniciar o atendimento."; estado continua ABERTA | Alta | Executado: falhou (DT04) |
| CT07 | RN1 (transição ABERTA → CONCLUÍDA proibida) | Tabela de decisão T3 — negativo | OS 3 ABERTA com técnico | Ação Concluir | Abrir OS 3; Concluir | Rejeição "Só é possível concluir uma OS em atendimento."; estado continua ABERTA | Alta | Executado: falhou (DT05) |
| CT08 | RN1 · CA05 | Tabela de decisão T4 | OS 4 EM ATENDIMENTO com João | Ação Concluir | Abrir OS 4; Concluir | Estado CONCLUÍDA; evento "Atendimento concluído" no histórico | Alta | Executado: passou (estado) |
| CT09 | RN1 · CA07 | Tabela de decisão T5 — negativo | OS 5 CONCLUÍDA | Ação: mudar para ABERTA | Abrir OS 5; Alterar estado para ABERTA | Rejeição "OS concluída não pode mudar de estado."; estado continua CONCLUÍDA | Alta | Executado: falhou (DT01) |
| CT10 | RF3 · CA08 | Valor limite | OS de nº 1 a 25 existentes | Números 0, 1, 25 e 26 | Buscar cada número | 0: "Informe um número de OS válido."; 1 e 25: exibe cliente, equipamento, técnico e estado; 26: "Nenhuma OS encontrada com o número 26." | Alta | Não executado: busca por número prevista no I1 (A8R04) |
| CT11 | RF3 · CA09 | Partição de equivalência (contém / não contém; maiúsculas) | Clientes Ana Souza, Carlos Souto e Bruno Lima com OS | Textos "sou" e "SOU" | Buscar por nome | Para os dois textos: OS de Ana Souza e Carlos Souto; nenhuma de Bruno Lima | Média | Não executado: I2 (A8R08) |
| CT12 | RF3 · CA10 | Partição de equivalência (equipamento com e sem OS) | EQ-1 com OS 1 e 4; EQ-3 sem OS | Equipamentos EQ-1 e EQ-3 | Selecionar equipamento; Filtrar | EQ-1: somente OS 1 e 4; EQ-3: "Nenhuma OS para este equipamento." | Média | Não executado: I3 (A8R11, reprogramado pela SM-01) |
| CT13 | RF3 · CA11 | Partição de equivalência (OS com vários eventos) | OS 4 aberta às 10:00, iniciada às 10:05 e concluída às 11:30 | OS 4 | Abrir o histórico | 3 eventos nessa ordem, cada um com data, hora, usuário e alteração | Alta | Não executado: histórico previsto no I1 (A8R05) |
| CT14 | HU2 · CA12 | Partição de equivalência (OS do técnico / de outro técnico) | OS 3 e 5 de João; OS 4 de Maria Costa | Login de João | Abrir "Minhas OS" | Lista com OS 3 e 5 apenas; acesso direto à OS 4 é negado | Alta | Não executado: I2 (A8R06) |
| CT15 | RNF2 · CA13 · meta de Segurança (A11) | Não funcional (segurança) — negativo | API com C3; um usuário por perfil | As 14 tentativas da matriz de perfis (requisitos.md) | Enviar cada requisição HTTP direta com o perfil indicado e sem token | 14 de 14 respostas negadas (403 ou 401), sem nenhum dado no corpo e sem alteração no banco | Alta | Não executado: depende de C3 no servidor (I1, A8R01) |
| CT16 | RNF1 · CA14 · meta de Desempenho (A11) | Não funcional (carga) com valor limite: 10.000 OS e 2,0 s | Ambiente de ensaio com 10.000 OS geradas | 10 usuários virtuais; 100 execuções de cada operação | Rodar o script k6 nos 4 fluxos | p95 ≤ 2,0 s em cadastro, abertura, mudança de estado e busca; relatório com ambiente e medições | Média | Não executado: I2 (A8R09) |
| CT17 | RF2, RF3 · CA04 · meta de Confiabilidade (A11) | Não funcional (tolerância a falhas) — negativo | Dublê de `RepositorioOrdens` configurado para falhar ao gravar o evento | Abertura válida para Ana/EQ-1 | Confirmar; repetir 20 vezes com falha; reenviar 10 vezes a mesma operação | 0 OS sem evento; mensagem "Não foi possível salvar a OS. Tente novamente."; dados mantidos; após o reenvio, exatamente 1 OS por operação | Alta | Não executado: I1 (A8R03/A8R05) |
| CT18 | RNF3 · CA15 · meta de Capacidade de interação (A11) | Não funcional (usabilidade) com valor limite: 60 s e 180 s | Sessão aberta; 3 participantes; Ana cadastrada | Roteiro: OS para Ana; OS para cliente novo | Cronometrar sem ajuda | Cliente cadastrado ≤ 60 s e cliente novo ≤ 180 s, na primeira tentativa, para os 3 participantes | Média | Não executado: Review do I1 |

Resumo: 18 casos; 8 por partição de equivalência, 3 com valor limite e 5 por tabela de decisão (as técnicas aparecem combinadas nos casos não funcionais); 7 negativos (CT02, CT03, CT06, CT07, CT09, CT15, CT17); 4 não funcionais ligados a metas da A11 (CT15–CT18).

## 2.3 Execução no protótipo

O protótipo tem duas partes separadas: o domínio Java (tag v12, sem API) e o frontend com armazenamento local. Os casos que dependem só de regras foram executados nas duas partes, com scripts versionados em `docs/05-qualidade/execucao/`: `ExecucaoCasosA13.java` (contra `backend/target/classes`, JDK 25) e `executar-casos-frontend.cjs` (contra `ChamadoService` compilado, Node 24). Data: 11/11/2026, sobre o commit 01a7c29.

| Caso | Onde | Resultado obtido | Status |
|---|---|---|---|
| CT01 | Java, `Cliente` | Rejeitado com "Email inválido" | Falhou |
| CT02 | Java, `Cliente` e `Notebook` | Bloqueado com uma única mensagem: "Telefone inválido"; o defeito vazio não foi indicado | Falhou |
| CT03 | Frontend, `ChamadoService.create` | "O equipamento selecionado não pertence ao cliente informado."; 0 OS gravadas | Passou |
| CT04 | Java e frontend | Estado inicial ABERTA (Java) / ABERTO (frontend), com identificador | Passou (número sequencial e evento fora do protótipo) |
| CT05 | Java, `OrdemServico.alterarStatus` | ABERTA → EM_ATENDIMENTO | Passou |
| CT06 | Java | Sem técnico, ABERTA → EM_ATENDIMENTO aceito | Falhou |
| CT07 | Java | ABERTA → CONCLUIDA aceito | Falhou |
| CT08 | Java | EM_ATENDIMENTO → CONCLUIDA | Passou |
| CT09 | Java e frontend | CONCLUIDA → ABERTA aceito (Java); CONCLUIDO → ABERTO aceito (frontend) | Falhou |

Defeitos encontrados (mesmo formato da A12):

| ID | Artefato | Onde | Descrição | Critério violado | Severidade | Verificação ou Validação | Ação | Responsável | Status |
|---|---|---|---|---|---|---|---|---|---|
| DT01 | Protótipo | `OrdemServico.alterarStatus` (Java); `ChamadoService.update` (frontend) | Uma OS concluída volta para ABERTA | CA07 / RN1 | Maior | Verificação | Validar a transição em C2 conforme a tabela de decisão T1–T5 | Lucas | Aberto: correção em A8R07 (I2); critério de saída impede fechar o I2 |
| DT02 | Protótipo | `Cliente` e `Equipamento` (Java) | Indica só o primeiro campo inválido, por exceção | CA02 | Menor | Verificação | Acumular as pendências e devolver todas de uma vez | Arthur | Aberto: A8R02 (I1) |
| DT03 | Protótipo | `Cliente` (Java) | E-mail obrigatório, contrariando o RF1 validado (V1 da A12) | CA01 / RF1 | Maior | Verificação | Tornar o e-mail opcional e manter nome e telefone obrigatórios | Arthur | Aberto: A8R02 (I1) |
| DT04 | Protótipo | `OrdemServico.alterarStatus` (Java) | Inicia o atendimento sem técnico atribuído | CA06 / RN1 | Maior | Verificação | Exigir técnico para EM_ATENDIMENTO | Lucas | Aberto: A8R06 (I2) |
| DT05 | Protótipo | `OrdemServico.alterarStatus` (Java) | Conclui direto de ABERTA, pulando o atendimento | RN1 (regra T3) | Maior | Verificação | Rejeitar ABERTA → CONCLUÍDA | Lucas | Aberto: A8R07 (I2) |

Os defeitos não foram corrigidos nesta atividade porque o código pertence aos itens A8R02, A8R06 e A8R07 dos incrementos. Eles servem de entrada para esses itens: os casos CT01, CT02, CT06, CT07 e CT09 viram critério de "Em verificação" (Q1 da DoD) e devem passar antes de o item ficar pronto. Os demais casos (CT10–CT18) serão executados nos incrementos indicados na coluna Status, quando houver API, autenticação no servidor e banco.

## 2.4 Matriz de rastreabilidade ampliada

Caminho: origem (A3) → história de usuário → requisito → critério de aceitação → caso(s) de teste → componente. A matriz completa, com backlog e modelos, está em `docs/dossie/matriz-rastreabilidade.md`.

| Origem (A3 → A4) | História | Requisito | Critérios de aceitação | Casos de teste | Componentes |
|---|---|---|---|---|---|
| A3 §4.1 RF01/RF02, §4.3 RF14 → RE1 | HU1 | RF1 | CA01, CA02, CA03 | CT01, CT02, CT03 | C1, C2, C4 |
| A3 §3, §4.1 RF03–RF05 → RE2 | HU1, HU2 | RF2 | CA03, CA04, CA05 | CT03, CT04, CT05, CT08, CT17 | C1, C2, C4 |
| A3 §4.1 RF06/RF07 → RE3 | HU1, HU2 | RF3 | CA08, CA09, CA10, CA11 | CT10, CT11, CT12, CT13, CT17 | C1, C2, C4 |
| A3 §4.1 RF04 → RE2 | HU1, HU2 | RN1 | CA04, CA05, CA06, CA07 | CT04, CT05, CT06, CT07, CT08, CT09 | C2, C4, C1 |
| A3 §4.2 RNF03 → RE5 | HU1, HU2 | RNF1 | CA14 | CT16 | C1, C2, C4 |
| A3 §4.1 RF12, §4.3 RF17/RNF04/RNF05 → RE4 | HU1, HU2 | RNF2 | CA12, CA13 | CT14, CT15 | C3, C2, C4 |
| A3 §4.2 RNF01/RNF02 → RE5 | HU1 | RNF3 | CA15 | CT18 | C1 |
| A3 §3, §4.1 → RE1, RE3 | HU1 | (história) | CA01–CA04, CA08–CA11, CA15 | CT01–CT04, CT10–CT13, CT18 | C1, C2, C3, C4 |
| A3 §4.1 RF04/RF05/RF12 → RE2 | HU2 | (história) | CA05, CA11, CA12 | CT05, CT08, CT13, CT14 | C1, C2, C3, C4 |

## 2.5 Cobertura

- **Requisitos priorizados Must com pelo menos um caso:** 7 de 7 (RF1, RF2, RF3, RN1, RNF2, HU1, HU2) = **100%**.
- **Todos os requisitos da linha de base (Must + Should):** 9 de 9 (incluindo RNF1 e RNF3) = **100%**.
- **Critérios de aceitação com pelo menos um caso:** 15 de 15 (CA01–CA15) = **100%**.
- **Requisitos Must com caso já executado no protótipo:** 4 de 7 (RF1, RF2, RN1, HU1) = **57%**. Sem execução ainda: RF3 (a busca e o histórico não existem nas regras testáveis; I1/I2), RNF2 (exige C3 no servidor, inexistente; I1) e HU2 (lista do técnico; I2). Não há requisito sem caso de teste.

## 2.6 Correções em relação ao esboço

| No esboço ([A13-estrategia-testes-esboco.md](A13-estrategia-testes-esboco.md)) | Na versão final | Motivo |
|---|---|---|
| Estratégia de uma linha ("testar as telas") | Escopo com o que fica de fora, níveis, tipos, técnicas, critérios de entrada e saída, ambiente, dados, responsáveis e incremento | Itens obrigatórios do enunciado |
| 6 casos só de caminho feliz | 18 casos, 7 negativos | Casos negativos revelaram 5 defeitos reais |
| Sem técnica | Partição, valor limite e tabela de decisão indicadas por caso; sessão exploratória na estratégia | Derivação sistemática |
| Resultados "cadastrado", "rápido" | Mensagens, estados, quantidades e tempos exatos | Resultado verificável |
| RNF2 e HU2 sem caso; RNF1 sem número | CT14–CT16 com 14 tentativas, p95 ≤ 2,0 s e 10.000 OS | Ligação com as metas da A11 |
| Nada executado | 9 casos executados no protótipo (4 passaram, 5 falharam) e 5 defeitos registrados | Execução exigida quando há protótipo |
| Sem matriz nem cobertura | Matriz origem → HU → requisito → CA → CT → componente; cobertura de 100% (requisitos e critérios) e 57% executada | Rastreabilidade até os testes |

<!-- fim-da-ficha -->

## Casos acrescentados pela SM-01 (v1.1.0)

Casos novos da RN2 (retorno em garantia), derivados dos critérios CA16–CA19. A OS de origem é a OS 5, de Ana Souza, equipamento EQ-1, concluída em 01/08/2026; o 90º dia é 30/10/2026.

| ID | Requisito ou critério | Técnica | Pré-condição | Entrada | Passos | Resultado esperado | Prioridade | Status |
|---|---|---|---|---|---|---|---|---|
| CT19 | RN2, RF2 · CA16 | Valor limite (90º dia, ainda dentro do prazo) | OS 5 CONCLUÍDA em 01/08/2026; data do sistema 30/10/2026 | OS de origem 5; equipamento EQ-1 | Nova OS; marcar "Retorno em garantia"; informar OS 5; Confirmar | Nova OS ABERTA marcada "Garantia", vinculada à OS 5; OS 5 continua CONCLUÍDA; evento "Retorno em garantia da OS 5" no histórico das duas | Alta | Não executado: I2 (A8R10) |
| CT20 | RN2 · CA17 | Valor limite (91º dia) — negativo | OS 5 CONCLUÍDA em 01/08/2026; data do sistema 31/10/2026 | OS de origem 5; EQ-1 | Mesmos passos do CT19 | Recusa "Prazo de garantia encerrado em 30/10/2026. Abra uma OS comum."; nenhuma OS criada | Alta | Não executado: I2 (A8R10) |
| CT21 | RN2 · CA18 | Partição de equivalência (origem inválida: não concluída; outro equipamento) — negativo | OS 4 EM ATENDIMENTO (EQ-1); OS 5 CONCLUÍDA (EQ-1); equipamento EQ-2 | (a) origem OS 4 com EQ-1; (b) origem OS 5 com EQ-2 | Mesmos passos do CT19 | (a) "A OS 4 ainda não foi concluída."; (b) "A OS 5 é de outro equipamento."; nenhuma OS criada nos dois casos | Alta | Não executado: I2 (A8R10) |
| CT22 | RF3, RN2 · CA19 | Partição de equivalência (OS com e sem vínculo) | Retorno OS 26 aberto a partir da OS 5 | Números 26 e 5 | Buscar OS 26; buscar OS 5 | OS 26 mostra "Garantia da OS 5 — defeito: Não liga"; OS 5 mostra "Retorno em garantia: OS 26" | Média | Não executado: I2 (A8R10) |

**Regressão a executar depois da SM-01:** CT04 e CT17 (abertura comum e gravação com falha, porque a abertura ganhou um ramo), CT05, CT08 e CT09 (a RN1 não pode ser afrouxada: a OS de origem continua CONCLUÍDA), CT13 (histórico com o novo evento), CT15 (o retorno usa a operação O2 e a mesma matriz de perfis) e CT16 (o fluxo de abertura medido inclui a consulta da OS de origem).

**Cobertura após a SM-01:** requisitos Must com pelo menos um caso, 8 de 8 (RF1, RF2, RF3, RN1, RN2, RNF2, HU1, HU2) = 100%; critérios de aceitação, 19 de 19 = 100%.
