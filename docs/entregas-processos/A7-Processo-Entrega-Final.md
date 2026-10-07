# A7 Processo de desenvolvimento do TechFix

## 1. Identificação

Atividade (código e nome): A7 — Definição do processo de desenvolvimento — Parte 2: entrega final

Disciplina: Processos de Engenharia de Software

Etapa (AP1 / AP2 / AS): AP2

Equipe: TechFix

Integrantes: Arthur Scharfenberger e Lucas Oliveira da Silva

Data de elaboração: 07/10/2026

Prazo da atividade: início do Encontro 8.

## 2. Conteúdo da atividade

### 2.1 Processo definido e justificativa

O processo definido para o TechFix é Scrum, com Sprints de uma semana e entregas incrementais orientadas ao atendimento da assistência técnica. Cada Sprint terá um objetivo, trabalho selecionado conforme a capacidade da dupla e verificação do resultado. O objetivo do produto é permitir registrar, localizar e acompanhar ordens de serviço com histórico confiável e acesso por perfil.

A A2, seção 2 de atividade02-12-08.pdf, escolhe desenvolvimento incremental combinado com práticas ágeis. Scrum concretiza essa escolha: cada ciclo acrescenta funcionalidade utilizável, enquanto inspeção e feedback permitem rever decisões. A A8 organiza o produto em I1, para receber/localizar atendimentos, e I2, para acompanhar/concluir serviços. Esses incrementos podem exigir mais de uma Sprint; não são compromissos automáticos de entrega em uma semana.

| Característica do TechFix | Consequência para o processo | Decisão operacional |
|---|---|---|
| Dois desenvolvedores e disponibilidade acadêmica limitada | Evitar excesso de tarefas paralelas e reuniões longas. | Planejar capacidade semanal; cada integrante mantém no máximo uma tarefa em desenvolvimento e prioriza revisões. |
| Regras já refinadas na A5 e dúvidas ainda possíveis | Mudanças precisam ser compreendidas antes de implementar. | Registrar origem e critérios de aceitação; esclarecer itens com o PO e manter rastreabilidade com A5/A8. |
| Feedback da assistência necessário para validar usabilidade | Resultado técnico pode não resolver a rotina de atendimento. | Demonstrar o fluxo ao PO na revisão da Sprint e registrar decisões; combinar previamente sua disponibilidade. |
| Sistema divisível em fluxos de valor | Entregar somente telas ou classes isoladas não comprova um fluxo utilizável. | Selecionar fatias de cadastro, OS e consulta com interface, regras, armazenamento e verificação necessárias. |
| A6 identifica conclusão prematura de requisitos | Uma ideia clara ainda pode esconder ambiguidades e falhas. | Exigir revisão do colega, critérios verificáveis e registro de evidências antes de concluir. |

A duração de uma semana e os limites de trabalho são decisões de planejamento desta A7. Não representam um histórico de Sprints já realizadas. A disponibilidade real é conferida a cada planejamento; se a capacidade diminuir, reduz-se o escopo selecionado sem dispensar a qualidade.

### 2.2 Papéis e responsabilidades

| Pessoa | Papel | Responsabilidades e limites |
|---|---|---|
| Arthur Scharfenberger | Scrum Master e desenvolvedor | Facilitar os eventos, tornar impedimentos visíveis e acompanhar sua resolução. Implementar tarefas, com foco inicial em interface e integração; revisar o código de Lucas. A função de Scrum Master não lhe dá aprovação unilateral do trabalho. |
| Lucas Oliveira da Silva | Desenvolvedor | Implementar tarefas, com foco inicial em regras do domínio, persistência e testes; revisar o código de Arthur. Participar das estimativas, decisões técnicas, integração e documentação. |
| Chico Mosca | Product Owner, representante da assistência | Ordenar o backlog por valor, esclarecer regras e observar se o resultado resolve o atendimento. Validar campos, mensagens, protocolo, estados e histórico apresentados ao usuário. Registrar aceite de negócio ou ajustes necessários. |

Arthur e Lucas são os integrantes da equipe acadêmica. Chico Mosca é o representante do negócio indicado no feedback da professora. A divisão técnica inicial facilita o trabalho simultâneo, mas ambos respondem pela qualidade do produto e podem atuar em qualquer componente. Toda tarefa terá um executor e o outro integrante como revisor.

O PO decide prioridade e necessidade de negócio; a dupla decide como implementar e quanto trabalho consegue selecionar. Se houver dúvida de requisito ou indisponibilidade do PO, a dúvida fica registrada e o item não recebe validação fictícia. O colega não aprova a própria alteração em nome do revisor ausente.

### 2.3 Cadência e registros do processo

| Momento | Participantes e duração planejada | Resultado registrado |
|---|---|---|
| Refinamento do backlog | Dupla e PO quando houver dúvida; conforme a necessidade. | Origem A5, item A8R, critérios de aceitação, dependências e estimativa discutida. |
| Planejamento da Sprint | Dupla e PO; até 30 minutos no início da semana de trabalho. | Objetivo da Sprint, capacidade disponível, itens selecionados, executor e revisor. |
| Daily Scrum | Arthur e Lucas; 15 minutos em cada dia de trabalho da Sprint. | Ajustes do plano para o objetivo, próximos passos e impedimentos no quadro. |
| Sprint Review | Dupla e PO; até 30 minutos no encerramento. | Demonstração, feedback, decisões de negócio e atualização das prioridades. |
| Retrospectiva | Arthur e Lucas; até 20 minutos após a Review. | Uma melhoria concreta do processo, responsável e momento de verificação na Sprint seguinte. |

O quadro de tarefas e os registros da Sprint ficam vinculados ao repositório. Cada cartão contém ID, requisito/história de origem, item A8R, critério de aceitação, responsável, revisor, dependências, estado e links para alteração e evidências. O DEVLOG registra decisões relevantes e uso de IA; não substitui os testes ou a revisão de código.

As estimativas P/M/G usam A8R04 como referência. Cada integrante estima separadamente, depois a dupla discute diferenças e registra o acordo. Nenhum tamanho é convertido automaticamente em horas. A seleção da Sprint considera também disponibilidade e trabalho de revisão, integração e correção.

### 2.4 Fluxo de trabalho da tarefa

Backlog → Selecionada para a Sprint → Em desenvolvimento → Em revisão → Em verificação → Pronta tecnicamente → Validação do PO registrada.

| Estado | Quem conduz | Condição para avançar |
|---|---|---|
| Backlog | PO ordena; dupla detalha. | Necessidade ligada a requisito/história, critério compreensível e dependências identificadas. |
| Selecionada para a Sprint | Arthur e Lucas, com o PO no planejamento. | Item contribui para o objetivo, cabe na capacidade e tem executor/revisor definidos. |
| Em desenvolvimento | Executor da tarefa. | Alteração implementada e verificada localmente, com documentação pertinente e pedido de revisão. |
| Em revisão | Integrante diferente do executor. | Colega verifica regra, clareza, impactos e testes; apontamentos resolvidos e revisão registrada. |
| Em verificação | Dupla. | Critérios de aceitação executados, integração conferida e evidências vinculadas. Falhas retornam ao desenvolvimento. |
| Pronta tecnicamente | Dupla, mediante checklist. | Todos os itens da Definition of Done atendidos. O resultado pode compor um incremento. |
| Validação do PO registrada | Chico Mosca, com demonstração da dupla. | Saída observada e decisão de negócio registrada: aceita ou requer ajuste. |

Um bloqueio é sinalizado no cartão com motivo, responsável por encaminhar a solução e próximo passo; não equivale a conclusão. Se a revisão falhar, o item retorna ao executor. Se não terminar até o fim da Sprint, volta ao backlog para replanejamento e não conta como incremento concluído.

A validação do PO é uma inspeção de negócio e não substitui a Definition of Done. Na Review, demonstram-se resultados tecnicamente prontos; o PO pode solicitar novos ajustes, que voltam ao backlog. Se o feedback revelar descumprimento de um critério já acordado, registra-se o defeito e o item volta para correção. Sem a presença do PO, a conclusão técnica pode ser registrada, mas a validação de negócio permanece aguardando sua decisão.

### 2.5 Definition of Done

Uma tarefa de implementação só chega a Pronta tecnicamente quando todos os critérios abaixo forem atendidos. Para uma tarefa exclusivamente documental, os itens de execução de código são marcados como não aplicáveis com justificativa; revisão, rastreabilidade e coerência continuam obrigatórias.

| Critério de conclusão | Evidência verificável |
|---|---|
| Requisito e escopo atendidos | Vínculo ao requisito da A5 e item A8R; critérios de aceitação cobertos, sem extensão de escopo não aprovada. |
| Revisão por outro integrante | Registro do revisor diferente do executor e apontamentos resolvidos. |
| Verificações executadas | Testes pertinentes à mudança e seus resultados, incluindo falhas e permissões quando o fluxo exigir. |
| Integração e integridade preservadas | Fluxo afetado demonstrável; nenhum defeito conhecido que impeça seu uso ou viole autorização, estados ou histórico. |
| Alteração e documentação registradas | Commit identificável, documentos afetados atualizados e uso de IA declarado quando houver. |
| Conteúdo compreendido | Executor e revisor conseguem explicar a regra, a solução e suas limitações. |

O protótipo atual usa armazenamento local e o Java executa separadamente. A existência desses artefatos não satisfaz, por si só, critérios que exigem autorização no servidor, banco ou integração. Tarefas que dependem dessas capacidades continuam abertas até haver implementação e evidência correspondentes.

### 2.6 Exemplo aplicado ao TechFix

No item A8R03, originado de RF2, RN1 e HU1, o objetivo é abrir uma OS válida com número único, data e estado ABERTA. O planejamento inclui a dependência do cadastro A8R02, da autorização A8R01 e do evento inicial de histórico A8R05. Para execução conjunta, Arthur pode cuidar do formulário e mensagens em C1, e Lucas da operação em C2/C4; o contrato de dados e erros é combinado antes.

Lucas revisa a alteração de Arthur e Arthur revisa a de Lucas. A dupla verifica cadastro/vínculo inválido, acesso sem permissão, sucesso e falha de gravação. OS e evento inicial devem ser gravados juntos; sucesso só aparece após confirmação. Depois da conclusão técnica, Chico Mosca observa em C1 se o cadastro é compreensível e se protocolo, estado e mensagens permitem conduzir o atendimento. O exemplo descreve a aplicação planejada do processo, não testes ou aceite já realizados.

### 2.7 Correções do esboço

A comparação abaixo usa A7-Processo-Esboco.md como versão preliminar desta elaboração. Documenta a evolução entre as duas versões, sem atribuir discussões ou execução a uma oficina anterior.

| Esboço | Ajuste na versão final | Motivo |
|---|---|---|
| Scrum em ciclos curtos, sem duração. | Sprint de uma semana; capacidade revista no planejamento; I1/I2 podem ocupar várias Sprints. | Tornar o planejamento executável para a dupla. |
| Papéis com responsabilidades gerais. | Definir prioridades do PO, facilitação de Arthur, execução/revisão dos dois e limites de aprovação. | Evitar dúvidas sobre quem decide e quem verifica. |
| Fluxo linear até demonstração e conclusão. | Definir estados, responsáveis, critérios de passagem, bloqueios e retornos. | Tratar correções e trabalho incompleto. |
| Conclusão técnica misturada ao aceite. | Separar Definition of Done e validação de negócio pelo PO. | Evitar declarar trabalho sem teste ou aceite não realizado. |
| Revisão do colega sem critérios. | Exigir rastreabilidade, evidências e registro do revisor. | Aplicar o aprendizado da A6 à rotina da equipe. |
| Feedback muda o backlog sem regra de entrada. | Registrar mudança, discutir impacto e priorizar com o PO sem comprometer o objetivo da Sprint. | Preservar a linha de base e controlar o escopo. |

### 2.8 Referências

A2: atividade02-12-08.pdf, seção 2, escolha incremental com práticas ágeis. A6: Atividade_06_Reflexao_Individual_Arthur_Scharfenberger.pdf, plano de melhoria para a AP2. A8: A8-Entrega-Final-Revisada.md, backlog, escala de estimativas e incrementos.

Referência conceitual: Ken Schwaber e Jeff Sutherland, The Scrum Guide, novembro de 2020, https://scrumguides.org/scrum-guide.html. As responsabilidades de PO, Scrum Master e Developers, os eventos e a distinção entre incremento pronto e inspeção na Review seguem o guia. Duração semanal, foco técnico inicial, limite de tarefas e evidências exigidas são decisões locais do TechFix.

## 3. Decisões e pendências

Decisões tomadas: Scrum sobre o ciclo iterativo e incremental da A2; Sprint semanal; Arthur como Scrum Master e desenvolvedor, Lucas como desenvolvedor e Chico Mosca como PO; revisão cruzada obrigatória e conclusão por evidências; validação de negócio registrada separadamente.

Pendências / próximos passos: combinar a disponibilidade do PO, iniciar o primeiro planejamento com a capacidade real da dupla e registrar a discussão das estimativas. Antes da submissão, os integrantes devem ler o documento, conferir os papéis e assinar a ficha. O prazo informado é o do enunciado; a elaboração em 07/10/2026 não comprova entrega anterior.

## 4. Declaração de uso de Inteligência Artificial

Conforme o Manual da Disciplina (seção 6 — Uso de Inteligência Artificial), toda utilização relevante de IA nesta atividade deve ser declarada abaixo e registrada no DEVLOG.md.

( ) A equipe não utilizou ferramentas de IA nesta atividade.

(X) A equipe utilizou ferramentas de IA nesta atividade — declaração abaixo.

| Data e ferramenta | Objetivo do uso | Prompt ou resumo da interação | Resultado aproveitado / rejeitado / modificado |
|---|---|---|---|
| 07/10/2026 — ChatGPT/Codex | Elaborar esboço e entrega final da A7. | Definir processo, papéis, fluxo e evolução do esboço, usando a A2 e o contexto do TechFix. | Estrutura, tabelas, regras de trabalho e ficha padrão. Não foram criados registros de reuniões, consenso ou aceite do PO. |

Forma de verificação: confronto com a escolha da A2, melhoria proposta na A6, itens/incrementos da A8 e definição de Scrum no guia oficial; comparação entre esboço e final e conferência visual dos PDFs.

Responsável pela decisão final sobre o uso: Arthur Scharfenberger e Lucas Oliveira da Silva.

## 5. Responsabilidade e autoria

A equipe declara que este documento foi lido, compreendido e validado por todos os integrantes, que respondem integralmente pela correção, coerência, legalidade e autoria do conteúdo entregue. Qualquer integrante poderá ser questionado, em apresentação, sobre partes produzidas com apoio de IA.

Assinatura (nomes por extenso):

Arthur Scharfenberger: ____________________________________________________

Lucas Oliveira da Silva: ____________________________________________________
