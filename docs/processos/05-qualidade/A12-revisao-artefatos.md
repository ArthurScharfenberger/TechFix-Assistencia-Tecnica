# A12 — Revisar artefatos com critérios — Entrega final

## 2.1 Planejamento da revisão

**Data da revisão:** 11/11/2026, antes da apresentação da AS.

**Artefatos revisados**

| # | Artefato | Versão revisada |
|---|---|---|
| A | Conjunto de requisitos: RF, RNF, RN e histórias de usuário (A4/A5) | `docs/processos/dossie/requisitos.md` no commit [151f419](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/commit/151f419), transcrição fiel de `Atividade04.md` e `Atividade05.pdf` |
| B | Matriz de rastreabilidade (A10) | `docs/processos/dossie/matriz-rastreabilidade.md` no commit 151f419, transcrição da A10 §2.5 |
| C | Plano de qualidade (A11) | `docs/processos/05-qualidade/A11-plano-qualidade.md` no commit [6f0c865](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/commit/6f0c865) |

**Tipo de revisão: inspeção.** A equipe escolheu a inspeção, e não uma revisão técnica informal, porque esses três artefatos são a linha de base da A13 (casos de teste) e da A14 (análise de impacto). Um defeito neles se propaga para testes e mudanças. A inspeção usa checklists fechados (sim/não), papéis separados e registro formal de cada achado com severidade, o que permite conferir depois se todos os achados críticos e maiores foram corrigidos.

**Papéis.** Arthur e Lucas escreveram juntos a A4, a A5 e a A10, e a A11 foi elaborada com apoio de IA. Como nenhum dos dois pode revisar o que escreveu, o papel de revisor ficou com um revisor simulado por IA, conforme a orientação do enunciado. A equipe escreveu os checklists antes de usar a IA. O revisor apenas aplicou os critérios e apontou possíveis achados; a decisão sobre o que é defeito ficou com a equipe (seção 2.4).

| Artefato | Autor | Moderador | Revisor | Relator |
|---|---|---|---|---|
| A — Requisitos | Arthur e Lucas | Arthur (Scrum Master) | Revisor simulado (IA, Claude) com o checklist CK-R | Lucas |
| B — Matriz | Arthur e Lucas | Lucas | Revisor simulado (IA, Claude) com o checklist CK-M | Arthur |
| C — Plano de qualidade | Equipe com apoio de IA | Arthur | Revisor simulado (IA, Claude, em aplicação separada, só com o checklist) com o CK-Q | Lucas |

O prompt usado com o revisor simulado foi o sugerido no enunciado ("Aplique cada critério ao artefato e responda apenas sim ou não... Não reescreva o artefato e não sugira soluções..."), enviado uma vez por artefato junto com o respectivo checklist. A conversa está resumida no DEVLOG.md (11/11/2026).

## 2.2 Checklists de critérios

Fontes dos critérios: metas da A11, características da ISO/IEC 25010:2023 (correção funcional, confidencialidade, rastreabilidade) e pendências registradas na AP2 e nas fichas A8/A10.

**CK-R — Requisitos (A4/A5)**

| ID | Critério (sim/não) | Resultado | Achados |
|---|---|---|---|
| R01 | Todo requisito tem ID único e origem RE/A3 registrada? | Sim | — |
| R02 | Todo campo de dado citado tem obrigatoriedade definida? | Não | D04 |
| R03 | A tabela de requisitos validados da A5 contém a versão validada de todos os 8 itens? | Não | D01 |
| R04 | Todas as transições de estado permitidas e proibidas da RN1 estão definidas? | Não | D02 |
| R05 | Todo termo usado em requisito ("dados administrativos", "valores") está definido? | Não | D03 |
| R06 | Todo RNF tem valor numérico e condição de medição no próprio requisito? | Não | D06 |
| R07 | Toda história de usuário tem pelo menos um critério de aceitação próprio? | Não | D05 |
| R08 | Todo critério de busca define como o texto é comparado? | Não | D07 |
| R09 | Toda necessidade direta da A3 está coberta por um requisito ou foi excluída com motivo? | Não | D14 |
| R10 | Os nomes de estados são iguais no requisito e no protótipo? | Não | D09 |
| R11 | Cada requisito descreve uma única capacidade verificável? | Não | D08 |

**CK-M — Matriz de rastreabilidade (A10)**

| ID | Critério (sim/não) | Resultado | Achados |
|---|---|---|---|
| M01 | Todo requisito Must da A5 aparece na matriz? | Sim | — |
| M02 | Toda linha tem origem na A3 com seção, página e ID? | Sim | — |
| M03 | Toda linha tem item de backlog e incremento? | Sim | — |
| M04 | Toda linha tem pelo menos um critério de aceitação vinculado? | Não | D10 |
| M05 | Toda referência aponta para um arquivo que existe no repositório? | Não | D11 |
| M06 | A origem citada corresponde ao assunto do requisito? | Não | D12 |
| M07 | Toda história tem modelo ou decisão de interface que a sustente? | Não | D13 |

**CK-Q — Plano de qualidade (A11)**

| ID | Critério (sim/não) | Resultado | Achados |
|---|---|---|---|
| Q01 | Há de 3 a 5 características com nomes da ISO/IEC 25010:2023? | Sim | — |
| Q02 | Toda justificativa cita pelo menos um código do dossiê? | Sim | — |
| Q03 | Toda meta tem universo de medição definido (quantos casos, quais combinações)? | Não | D15, D16 |
| Q04 | Toda meta de interação foi confirmada com o stakeholder? | Não | D17 |
| Q05 | Todo "como verificar" indica um recurso que a equipe já tem ou consegue criar? | Não | D18 |
| Q06 | Toda linha tem responsável e momento? | Sim | — |
| Q07 | Todo conflito tem decisão registrada? | Sim | — |

## 2.3 Registro de achados

Severidades: Crítico (invalida o artefato ou impede o uso); Maior (causa erro relevante se não for corrigido); Menor (problema pontual); Sugestão (melhoria opcional).

| ID | Artefato | Onde | Descrição | Critério violado | Severidade | Verificação ou Validação | Ação | Responsável | Status |
|---|---|---|---|---|---|---|---|---|---|
| D01 | Requisitos | A5 §2.2.1 | A tabela "Requisitos validados" contém registros de uso de IA no lugar das versões validadas; a linha de base não tem o texto validado de nenhum dos 8 itens | R03 | Crítico | Verificação | Reconstruir as 8 versões validadas a partir da A4, dos critérios da A5 §2.2.2 e da A8 em fonte única versionada | Arthur | Corrigido |
| D02 | Requisitos | RN1 | Lista os estados, mas não as transições; ABERTA → CONCLUÍDA e o início sem técnico ficam indefinidos | R04 | Maior | Verificação | Reescrever a RN1 com as 2 transições permitidas e as demais rejeitadas; técnico obrigatório para iniciar | Lucas | Corrigido |
| D03 | Requisitos | RNF2 | "Dados administrativos e valores" sem definição; nenhum requisito da linha de base registra valores (A3 RF09 está fora) | R05 | Maior | Verificação | Definir dados administrativos, incluir a matriz de perfis com 6 operações e declarar valores fora da linha de base | Arthur | Corrigido |
| D04 | Requisitos | RF1 | E-mail citado na A3 RF01, ausente dos critérios da A5 e obrigatório no protótipo Java (`Cliente`) | R02 | Maior | Validação | Perguntar ao stakeholder (V1); e-mail opcional | Arthur | Corrigido |
| D05 | Requisitos | HU2 | Sem critério de aceitação próprio; não diz que o técnico vê somente suas OS | R07 | Maior | Verificação | Criar CA05 e CA12 ligados à HU2 | Lucas | Corrigido |
| D06 | Requisitos | RNF1 | Volume (10.000 OS), concorrência e operações medidas aparecem só na A8, não no requisito | R06 | Menor | Verificação | Levar as condições de medição para o texto do RNF1 | Lucas | Corrigido |
| D07 | Requisitos | RF3 / critério de nome parcial | Não define se a busca diferencia maiúsculas de minúsculas | R08 | Menor | Verificação | Definir comparação sem diferenciar maiúsculas | Lucas | Corrigido |
| D08 | Requisitos | RF2 | "Criar e acompanhar" junta abertura e atualização em um só requisito | R11 | Sugestão | Verificação | Dividir em RF2a/RF2b | Arthur | Pendente: os IDs RF2/A8R03/A8R06/A8R07 são usados em todo o dossiê; a divisão é feita pelos critérios CA04/CA05 |
| D09 | Requisitos | Glossário / protótipo | Estados escritos como EM_ATENDIMENTO/CONCLUIDA (Java) e ABERTO/CONCLUIDO (frontend) | R10 | Menor | Verificação | Unificar a grafia no código | Lucas | Pendente: registrado no glossário; correção no código junto com A8R06/A8R07 no I2 |
| D10 | Matriz | Todas as linhas | Não há coluna de critério de aceitação; a A13 precisa ligar requisito → critério → teste | M04 | Maior | Verificação | Acrescentar colunas de história e critérios CA01–CA15 | Arthur | Corrigido |
| D11 | Matriz | Referências da A10 | Cita `A8-Entrega-Final-Revisada.md`, `Modelagem-Entrega-Final.md`, `A7-Processo-Entrega-Final.md`, `Atividade04.md` e `A10-Arquitetura.svg`, removidos do repositório na organização de 07/10 | M05 | Maior | Verificação | Apontar para os PDFs versionados e para `docs/processos/dossie/` | Arthur | Corrigido |
| D12 | Matriz | Linha RNF1 | A origem inclui A3 RNF01/RNF02 (facilidade e poucos campos), que tratam de usabilidade e não de tempo de resposta | M06 | Menor | Verificação | Restringir a origem do RNF1 à A3 RNF03 | Arthur | Corrigido |
| D13 | Matriz | Linha HU2 | Não existe modelo de tela para o técnico ("a detalhar") | M07 | Menor | Verificação | Modelar a lista e a atualização do técnico | Lucas | Pendente: a tela do técnico pertence ao I2; a modelagem entra no refinamento de A8R06 |
| D14 | Requisitos / Matriz | A3 RNF01/RNF02 | O pedido direto de simplicidade e poucos campos não tem requisito, embora a A11 priorize Capacidade de interação | R09 | Maior | Validação | Confirmar a meta com o stakeholder (V2) e criar o RNF3 (Should) | Arthur | Corrigido |
| D15 | Plano | Adequação funcional, meta (b) | "9 combinações" dependia de transições que a RN1 não definia (D02); não diz quantas são inválidas | Q03 | Maior | Verificação | Contar as 7 transições inválidas da RN1 corrigida, mais o início sem técnico | Lucas | Corrigido |
| D16 | Plano | Segurança, métrica | "Matriz perfil × operação" sem enumerar as combinações testadas | Q03 | Menor | Verificação | Referenciar a matriz do RNF2 e fixar 14 tentativas | Arthur | Corrigido |
| D17 | Plano | Capacidade de interação, meta | Meta de ≤ 2 min definida pela equipe sem confirmação do stakeholder; participantes indefinidos | Q04 | Maior | Validação | Validar com o stakeholder (V2); definir os 3 participantes | Arthur | Corrigido |
| D18 | Plano | Confiabilidade, como verificar | "Repositório de teste que falha sob demanda" não indica o mecanismo | Q05 | Sugestão | Verificação | Indicar o dublê da interface `RepositorioOrdens`, que já existe no Java | Lucas | Corrigido |

## 2.4 Sugestões do revisor simulado: aceitas e rejeitadas

O revisor simulado apontou 22 possíveis achados. A equipe aceitou 18 (D01–D18) e rejeitou 4.

| Sugestão do revisor simulado | Decisão | Justificativa |
|---|---|---|
| RNF2: "bloquear 100%" não é verificável | Rejeitada | O universo é finito: 14 tentativas da matriz de perfis (D16) |
| RF2: o formato do número da OS não está definido | Rejeitada | O requisito exige número único sequencial; o formato de exibição é decisão de interface, sem efeito em regra ou teste |
| Matriz: faltam A3 RF08–RF11 (serviço, valores, painel, relatórios) | Rejeitada | Estão fora da linha de base da A5 por decisão registrada (A8 R1; A10 §2.2), não por esquecimento |
| Plano: Manutenibilidade deveria estar entre as priorizadas | Rejeitada | O limite é de 5 características; a A11 §2.4 justifica o adiamento e a DoD cobre a revisão de código |

Os achados D04, D14 e D17 dependiam da opinião do usuário. O revisor os marcou como "precisa de validação com o stakeholder", e eles foram tratados na seção 2.6.

## 2.5 Correções aplicadas, com evidência

Todos os achados críticos e maiores foram corrigidos. Os diffs estão nos commits [714ac8a](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/commit/714ac8a) (requisitos), [d62fbe6](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/commit/d62fbe6) (matriz) e [f092cb0](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/commit/f092cb0) (plano de qualidade), comparados à versão revisada [151f419](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/commit/151f419).

- Versão revisada: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/commit/151f419
- Requisitos (D01–D07, D14): https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/commit/714ac8a
- Matriz (D10–D12, D14): https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/commit/d62fbe6
- Plano de qualidade (D15–D18): https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/commit/f092cb0

| Achado | Antes | Depois |
|---|---|---|
| D01 (Crítico) | A5 §2.2.1: "ID \| 26/08/2026 — ChatGPT/Codex \| Apoio na revisão de clareza..." (registro de IA no lugar dos requisitos) | Tabela "Requisitos validados" com as 9 versões (RF1–RF3, RN1, RNF1–RNF3, HU1, HU2), origem e prioridade |
| D02 (Maior) | RN1: "Uma OS deve usar um dos estados: ABERTA, EM ATENDIMENTO ou CONCLUÍDA." | RN1: "Transições permitidas: ABERTA → EM ATENDIMENTO, somente com técnico atribuído; EM ATENDIMENTO → CONCLUÍDA. Qualquer outra transição é rejeitada, inclusive ABERTA → CONCLUÍDA e qualquer saída de CONCLUÍDA." |
| D03 (Maior) | RNF2: "...acesso de usuários sem permissão a dados administrativos e valores." | RNF2 com autorização no servidor, matriz de 6 operações × 3 perfis, 14 tentativas negadas, "dados administrativos são usuários, perfis e permissões" e valores fora da linha de base |
| D04 (Maior) | RF1: "...com os dados necessários ao atendimento." | RF1: "nome e telefone (obrigatórios) e e-mail (opcional)... tipo e defeito (obrigatórios), marca e observações (opcionais)" |
| D05 (Maior) | HU2 sem critério | CA05 (iniciar com técnico) e CA12 ("mostra somente as OS atribuídas a ele") |
| D10 (Maior) | Matriz com 5 colunas, sem critério | Colunas "História" e "Critérios de aceitação" (CA01–CA15) em todas as linhas |
| D11 (Maior) | Referências a `A8-Entrega-Final-Revisada.md`, `Modelagem-Entrega-Final.md` etc. | Referências a `docs/processos/entregas/*.pdf` e `docs/processos/dossie/*.md` |
| D14 (Maior) | A3 RNF01/RNF02 sem requisito | RNF3 (Should): "até 1 min para cliente já cadastrado e até 3 min para cliente novo" |
| D15 (Maior) | "0 transições inválidas aceitas nas 9 combinações" | "0 aceitas entre as 7 transições inválidas da tabela de decisão de RN1... e 0 inícios sem técnico aceitos" |
| D17 (Maior) | "≤ 2 min na primeira tentativa, para cada participante do teste (mínimo 3)" | "Cliente já cadastrado: ≤ 1 min; cliente novo: ≤ 3 min; ... para os 3 participantes (o PO e 2 colegas sem contato prévio com o sistema)" |

Pendentes justificados: D08 (Sugestão), D09 (Menor) e D13 (Menor), conforme a coluna Status da seção 2.3.

## 2.6 Validação com o stakeholder

Stakeholder: Marcos Almeida, atendente — o mesmo stakeholder simulado da A3, interpretado por IA a partir do contexto da A3 (rotina de balcão, papel e planilhas, pedido de simplicidade). Nenhum checklist responde a esses pontos, porque dependem da rotina do usuário.

| ID | Pergunta feita | Resposta do stakeholder | O que mudou no artefato |
|---|---|---|---|
| V1 | "Quando você registra um cliente no balcão, o e-mail precisa ser obrigatório?" | "Não. Muita gente mais velha não tem ou não lembra na hora. Telefone sempre, porque é por ele que eu aviso que ficou pronto. E-mail, se o cliente tiver, eu anoto." | RF1: e-mail opcional; nome e telefone obrigatórios (D04). CA01 aceita e-mail vazio. Revela uma divergência no protótipo Java, que exige e-mail (registrada para a A13) |
| V2 | "Hoje, no papel, quanto tempo leva para registrar um equipamento? Quanto tempo no sistema seria aceitável?" | "Cliente que já veio antes: uns 40 segundos, um minuto no máximo, só procuro a ficha. Cliente novo leva mais, uns três minutos com tudo. Se o sistema demorar mais que isso com quem já é cliente, eu volto para o caderno." | RNF3 criado (D14): ≤ 1 min para cliente cadastrado e ≤ 3 min para cliente novo. Meta da A11 trocada de ≤ 2 min para esses valores (D17) |

## 2.7 Síntese da revisão

A inspeção dos três artefatos registrou 18 achados: 1 crítico, 9 maiores, 6 menores e 2 sugestões. O crítico e todos os maiores foram corrigidos, com evidência nos commits 714ac8a, d62fbe6 e f092cb0; ficaram pendentes, com justificativa, 2 menores e 1 sugestão. O defeito mais importante foi o D01: a tabela de requisitos validados da A5 continha registros de IA no lugar dos requisitos. Ou seja, a linha de base usada por A8, A10 e A11 não tinha texto validado versionado, e a divergência já anotada em 07/10 não havia sido resolvida. A causa foi editar e exportar manualmente o documento Word sem conferir o resultado contra a fonte. **Mudança no processo:** os requisitos passam a ter fonte única em `docs/processos/dossie/requisitos.md`, e a Definition of Done ganha o critério **Q6 — "documento entregue conferido contra a fonte versionada: toda tabela da fonte aparece na exportação, e todo requisito alterado atualiza no mesmo commit os critérios CA e a matriz"**, verificado no estado *Em revisão* pelo integrante que não fez a alteração. A segunda lição é que 3 dos 9 achados maiores eram de validação: metas definidas só pela equipe (tempo e campos obrigatórios) precisam ser confirmadas com o stakeholder antes de virar critério.

<!-- fim-da-ficha -->
