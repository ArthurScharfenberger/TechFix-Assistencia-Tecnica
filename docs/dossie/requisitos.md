# Requisitos do TechFix — linha de base

Fonte única versionada dos requisitos do dossiê. Consolida a A4 (redação e origem RE1–RE5) e a A5 (critérios de aceitação e priorização), com as correções da revisão da A12 (achados D01–D07 e D14; ver `docs/05-qualidade/A12-revisao-artefatos.md`). Os PDFs das entregas permanecem como histórico em `docs/entregas-processos/`.

Origem: A3 — entrevista semiestruturada simulada com Marcos Almeida, atendente (`Atividade_03_Levantamento_Requisitos_TechFix.pdf`).

## Rastreabilidade da entrevista (A4)

| Código | Ponto da entrevista | Origina |
|---|---|---|
| RE1 | O atendente usa papel ou planilhas e precisa registrar dados do cliente e do equipamento | RF1, HU1 |
| RE2 | Cada atendimento precisa de uma OS, com status definido e técnico responsável | RN1, RF2, HU2 |
| RE3 | Localizar ordens pelo cliente, equipamento ou número e consultar o histórico | RF3, HU1 |
| RE4 | Dados administrativos e valores não devem ficar disponíveis para todos | RNF2 |
| RE5 | O sistema deve ser simples e rápido, sem deixar o atendimento mais demorado | RNF1, RNF3 |

## Requisitos validados

Versões validadas (substituem a tabela 2.2.1 da A5 local, que trazia registros de IA no lugar dos requisitos — achado D01).

| ID | Versão validada | Origem | Prioridade |
|---|---|---|---|
| RF1 | O sistema deve cadastrar o cliente com nome e telefone (obrigatórios) e e-mail (opcional), e o equipamento com tipo (notebook ou desktop) e defeito relatado (obrigatórios), marca e observações de estado (opcionais), sempre vinculado a um cliente. | RE1; A3 RF01, RF02, RF14 | Must |
| RF2 | O sistema deve abrir uma OS para cliente e equipamento vinculados, gerando número único sequencial, data/hora de abertura e estado ABERTA; deve permitir atribuir técnico e mudar o estado conforme RN1, registrando cada alteração no histórico. | RE2; A3 RF03–RF05, RF13, RF15, RF16 | Must |
| RF3 | O sistema deve localizar OS pelo número exato, pelo nome parcial do cliente (sem diferenciar maiúsculas de minúsculas) e pelo equipamento, e exibir o histórico da OS em ordem cronológica com data, hora, usuário e alteração. | RE3; A3 RF06, RF07 | Must |
| RN1 | Uma OS está sempre em um dos estados ABERTA, EM ATENDIMENTO ou CONCLUÍDA. Transições permitidas: ABERTA → EM ATENDIMENTO, somente com técnico atribuído; EM ATENDIMENTO → CONCLUÍDA. Qualquer outra transição é rejeitada, inclusive ABERTA → CONCLUÍDA e qualquer saída de CONCLUÍDA, que é estado final. | RE2; A3 RF04 | Must |
| RNF1 | As operações de cadastro, abertura de OS, mudança de estado e busca devem responder em até 2 s em pelo menos 95% das execuções de cada operação, com base de até 10.000 OS e 10 usuários simultâneos, medindo do comando à resposta. | RE5; A3 RNF03 | Should |
| RNF2 | O sistema deve autenticar cada usuário e autorizar cada operação no servidor conforme a matriz de perfis abaixo, negando 100% das tentativas fora da matriz, inclusive por chamada direta à API ou sem sessão. Dados administrativos são usuários, perfis e permissões. Valores de serviço estão fora da linha de base até haver requisito aprovado (A3 RF09; risco R1). | RE4; A3 RF12, RF17, RNF04, RNF05 | Must |
| RNF3 | O atendente deve conseguir abrir uma OS para cliente já cadastrado em até 1 min e para cliente novo (com cadastro) em até 3 min, sem ajuda, com a sessão aberta. | RE5; A3 RNF01, RNF02; validação V2 da A12 | Should |
| HU1 | Como atendente, quero cadastrar cliente e equipamento, abrir a OS e localizá-la depois, para acompanhar o serviço sem depender de papel ou planilhas. | RE1, RE3 | Must |
| HU2 | Como técnico, quero ver somente as OS atribuídas a mim, iniciar e concluir o atendimento, para manter o andamento do serviço registrado. | RE2 | Must |

### Matriz de perfis (RNF2)

| Operação protegida | Atendente | Técnico | Administrador |
|---|---|---|---|
| O1 — Cadastrar cliente e equipamento | Permitida | Negada | Permitida |
| O2 — Abrir OS | Permitida | Negada | Permitida |
| O3 — Consultar OS e histórico | Todas | Somente as atribuídas a ele | Todas |
| O4 — Atribuir técnico | Permitida | Negada | Permitida |
| O5 — Iniciar e concluir atendimento | Negada | Somente as atribuídas a ele | Permitida |
| O6 — Gerenciar usuários e perfis (dados administrativos) | Negada | Negada | Permitida |

Tentativas que devem ser negadas: atendente em O5 e O6 (2); técnico em O1, O2, O4, O6 e em O3/O5 de OS de outro técnico (6); chamada sem sessão em O1–O6 (6). Total: 14.

## Critérios de aceitação

Critérios Dado/Quando/Então da A5 §2.2.2, numerados e complementados na A12. Os IDs CA são usados na matriz de rastreabilidade e nos casos de teste.

| ID | Requisito | Critério |
|---|---|---|
| CA01 | RF1, HU1 | Dado que o atendente informou nome, telefone, tipo e defeito, quando confirmar o cadastro, então o sistema salva o cliente e o equipamento vinculado e apresenta confirmação; o e-mail pode ficar vazio. |
| CA02 | RF1, HU1 | Dado que um ou mais campos obrigatórios não foram informados, quando o atendente tentar confirmar, então o sistema impede o cadastro e indica cada campo pendente na mesma tentativa. |
| CA03 | RF1, RF2 | Dado que o equipamento pertence a outro cliente, quando o atendente tentar abrir a OS, então o sistema recusa a abertura e não grava OS. |
| CA04 | RF2, RN1, HU1 | Dado que cliente e equipamento estão cadastrados e vinculados, quando um usuário autorizado abrir uma OS, então o sistema gera número único, registra data/hora, define ABERTA e grava o evento de abertura. |
| CA05 | RF2, RN1, HU2 | Dado que a OS está ABERTA e tem técnico atribuído, quando o técnico iniciar o atendimento, então o estado passa a EM ATENDIMENTO e o histórico registra responsável, data e hora. |
| CA06 | RN1 | Dado que a OS está ABERTA sem técnico, quando alguém tentar iniciar o atendimento, então o sistema rejeita e mantém ABERTA. |
| CA07 | RN1 | Dado que a OS está CONCLUÍDA, quando houver tentativa de mudar para qualquer outro estado, então o sistema rejeita e mantém CONCLUÍDA. |
| CA08 | RF3, HU1 | Dado que existe OS com o número informado, quando o usuário pesquisar pelo número exato, então o sistema exibe cliente, equipamento, técnico (ou "não atribuído") e estado; se não existir, informa que nenhuma OS foi encontrada. |
| CA09 | RF3, HU1 | Dado que existem clientes cujo nome contém o texto informado, quando o usuário pesquisar pelo nome parcial, então o sistema lista todas as OS correspondentes, sem diferenciar maiúsculas de minúsculas. |
| CA10 | RF3, HU1 | Dado que um equipamento foi selecionado, quando o usuário filtrar, então o sistema lista somente as OS desse equipamento. |
| CA11 | RF3, HU1, HU2 | Dado que uma OS sofreu alterações, quando o usuário abrir o histórico, então os eventos aparecem em ordem cronológica com data, hora, usuário e alteração. |
| CA12 | HU2, RNF2 | Dado que o técnico está autenticado, quando abrir sua lista de OS, então o sistema mostra somente as OS atribuídas a ele. |
| CA13 | RNF2 | Dado um perfil e uma operação fora da matriz de perfis, quando a requisição chegar ao servidor (pela interface, por chamada direta ou sem sessão), então o sistema nega e não retorna nem altera dados. |
| CA14 | RNF1 | Dado o cenário de 10.000 OS e 10 usuários simultâneos, quando cada operação for executada pelo menos 100 vezes, então pelo menos 95% das execuções de cada operação respondem em até 2 s. |
| CA15 | RNF3 | Dado o atendente com sessão aberta e sem ajuda, quando abrir uma OS para cliente já cadastrado, então conclui em até 1 min; para cliente novo, em até 3 min. |

## Glossário

- **OS**: ordem de serviço. **Número único**: inteiro sequencial gerado pelo sistema, nunca reutilizado.
- **Estados**: ABERTA, EM ATENDIMENTO, CONCLUÍDA. No código Java e no protótipo, a grafia é `ABERTA`, `EM_ATENDIMENTO`, `CONCLUIDA` / `ABERTO`, `CONCLUIDO` (achado D09, pendente).
- **Dados administrativos**: usuários, perfis e permissões.
