# A8 — Planejamento incremental, estimativas e riscos — Entrega final revisada

## 1. Identificação

Atividade (código e nome): A8 — Planejamento incremental, estimativas e riscos — Entrega final revisada

Etapa (AP1 / AP2 / AS): AP2

Equipe: TechFix

Integrantes: Arthur Scharfenberger e Lucas Oliveira da Silva

Data de entrega: ____________________ (revisão: 07/10/2026)

## 2. Conteúdo da atividade

## 2.1 Base, escopo e prioridade

Base: A5 validada, seções 2.2.1 (requisitos), 2.2.2 (critérios de aceitação) e 2.2.3 (priorização), complementada pela A4. A professora confirma, no feedback, que a A5 entregue contém os oito requisitos corrigidos. Essa versão avaliada é a linha de base. Atividade_A8.pdf é a versão anterior usada para comparar as correções.

| Requisito | Prioridade | Justificativa |
|---|---|---|
| RF1 | Must have | Cliente e equipamento são necessários para iniciar o atendimento. |
| RF2 | Must have | A OS concentra o registro do serviço e depende do cadastro. |
| RF3 | Must have | Localização e histórico permitem acompanhar os atendimentos. |
| RN1 | Must have | Controla o ciclo da OS e impede estados inconsistentes. |
| RNF2 | Must have | Protege dados administrativos e valores contra acesso indevido. |
| HU1 | Must have | Representa o fluxo essencial do atendente. |
| HU2 | Must have | Representa o acompanhamento e a atualização pelo técnico. |
| RNF1 | Should have | A demonstração funcional pode ocorrer antes da medição; a meta é obrigatória antes da implantação. |

A ordem do backlog respeita dependências e valor. Os IDs A8R identificam esta revisão e evitam confusão com os antigos B01–B10. HU1/HU2 são perspectivas dos mesmos requisitos, não trabalho duplicado. Não há itens Could have ou Won’t have na linha de base.

## 2.2 Backlog completo e estimado

| Ordem / ID | Item de backlog | Origem / prioridade | Tamanho / entrega | Critério de aceitação |
|---|---|---|---|---|
| 1 · A8R01 | Acesso por perfil: atendente, técnico e administrador | RNF2 · Must | G · I1 | Autenticar usuários e negar acesso sem permissão, inclusive por acesso direto. |
| 2 · A8R02 | Cadastrar cliente e equipamento vinculado | RF1, HU1 · Must | M · I1 | Salvar nome, telefone, tipo e defeito; indicar todos os obrigatórios ausentes. |
| 3 · A8R03 | Abrir ordem de serviço | RF2, RN1, HU1 · Must | M · I1 | Gerar número único, data de abertura e estado ABERTA para cliente/equipamento válidos. |
| 4 · A8R04 | Localizar OS pelo número e consultar detalhes | RF3, HU1 · Must | P · I1 | Busca exata mostra cliente, equipamento, técnico (ou não atribuído) e estado; tratar ausência. |
| 5 · A8R05 | Registrar e consultar histórico da OS | RF3, HU1, HU2 · Must | M · I1 | Eventos cronológicos com data, hora, usuário e alteração; integrar novos eventos no I2. |
| 6 · A8R06 | Atribuir técnico, listar suas OS e iniciar atendimento | RF2, RN1, HU2 · Must | M · I2 | ABERTA passa a EM ATENDIMENTO com responsável e evento no histórico. |
| 7 · A8R07 | Concluir atendimento e proteger o estado final | RF2, RN1, HU2 · Must | M · I2 | Concluir OS em atendimento; rejeitar retorno de CONCLUÍDA a estados anteriores. |
| 8 · A8R08 | Pesquisar por cliente e equipamento | RF3, HU1 · Must | M · I2 | Nome parcial retorna todas as correspondências; equipamento selecionado filtra suas OS. |
| 9 · A8R09 | Garantir resposta rápida nas operações principais | RNF1 · Should | G · I2 | Até 2 s em pelo menos 95% das operações, com base de até 10.000 OS e cenário de medição documentado. |

### Rastreabilidade da A5 aos incrementos

| Requisito da A5 | Prioridade | Itens de backlog que o atendem | Incremento |
|---|---|---|---|
| RF1 | Must have | A8R02 | I1 |
| RF2 | Must have | A8R03; A8R06; A8R07 | I1 e I2 |
| RF3 | Must have | A8R04; A8R05; A8R08 | I1 e I2 |
| RN1 | Must have | A8R03; A8R06; A8R07 | I1 e I2 |
| RNF2 | Must have | A8R01; autorização em todos os fluxos protegidos | I1 e I2 |
| RNF1 | Should have | A8R09 | I2 |
| HU1 | Must have | A8R02; A8R03; A8R04; A8R05; A8R08 | I1 e I2 |
| HU2 | Must have | A8R05; A8R06; A8R07 | I1 (base do histórico) e I2 (fluxo do técnico) |

## 2.3 Referência para estimativas

| Tamanho | Definição | Item de referência |
|---|---|---|
| P | Uma regra simples e consulta delimitada. | A8R04: busca exata por número. |
| M | Múltiplas validações, relacionamentos ou alteração com histórico. | A8R02: cadastro e vínculo cliente/equipamento. |
| G | Segurança ou desempenho com incerteza e validação transversal. | A8R01: autenticação e autorização no servidor. |

A8R04 é a referência de comparação entre todos os itens. Os tamanhos incluem interface, lógica, persistência e verificação, sem equivalência fixa em horas.

A8R01 é G porque o login local atual não comprova proteção real. A8R09 é G porque depende de carga, ambiente e possíveis ajustes. Os M envolvem vínculos, estados ou eventos; A8R05 inclui a integração do histórico nos fluxos do I2, sem dupla contagem. Estimativas propostas: não há registro de consenso. Para fechar, cada integrante estima separadamente, compara diferenças usando A8R04 como referência e registra o tamanho acordado antes de planejar datas.

## 2.4 Incrementos por valor ao usuário

| Incremento / itens | Valor e demonstração | Condição de conclusão |
|---|---|---|
| I1 — Receber e localizar um atendimento; A8R01–A8R05; 1 P + 3 M + 1 G | O atendente autorizado cadastra cliente/equipamento, abre OS e recupera protocolo e histórico inicial, substituindo o registro em papel. | Demonstrar cadastro válido e inválido, criação ABERTA, pesquisa por número e evento de abertura; bloquear perfil sem permissão. |
| I2 — Acompanhar e concluir o serviço; A8R06–A8R09; 3 M + 1 G | Sobre o I1, o técnico acompanha suas OS, inicia e conclui o serviço. O atendente pesquisa por cliente/equipamento e consulta a evolução. | Demonstrar ciclo ABERTA → EM ATENDIMENTO → CONCLUÍDA, histórico completo, rejeição de regressão, buscas e medição de desempenho. |

Cada incremento entrega o fluxo inteiro necessário ao usuário. Acesso, armazenamento e verificações acompanham os fluxos. I1 é útil para recepção e consulta; I2 completa a operação de manutenção. Não há promessa de prazo sem capacidade e consenso da equipe.

A autorização deve seguir a matriz de perfis do RNF2 validado na A5. Como detalhamento operacional, o atendente cadastra/abre/consulta dados operacionais; o técnico consulta e atualiza OS atribuídas; o administrador acessa dados administrativos/valores. A atribuição de cada operação deve ser conferida com a matriz original antes da implementação.

RNF1: até 2 segundos em pelo menos 95% das operações, com base de até 10.000 OS, conforme a A5 validada e a correção expressa no feedback. O ensaio deve incluir o limite de 10.000 OS. Para executar a medição, propõem-se 10 usuários simultâneos e ao menos 100 operações por fluxo (cadastro, abertura, atualização e busca), medindo do comando à resposta. Concorrência e amostra são parâmetros de ensaio a confirmar; não substituem a linha de base. Registrar ambiente, massa de dados, duração de cada operação e percentil 95; exigir ao menos 95 de cada 100 operações em até 2 s em cada fluxo.

## 2.5 Riscos, classificação e mitigação

Escala qualitativa de probabilidade: baixa = sem indício atual; média = dependência ainda não validada; alta = condição já observada. Impacto: baixo = ajuste local; médio = retrabalho em um item; alto = compromete incremento, integridade ou confidencialidade. Pontuação: baixa/baixo=1, média/médio=2, alta/alto=3; P × I: 1–2 baixo, 3–4 moderado, 6–9 alto. Avaliação proposta, anterior às mitigações.

| Risco / justificativa | P × I / nível | Mitigação concreta / responsável proposto |
|---|---|---|
| R1 — Divergência de escopo causa retrabalho; A8 antiga inclui funções fora da A5. | Alta (3) × Alto (3) = 9 / alto | Arthur: revisar mapa A5 → A8R antes do I1; manter pagamento/avaliação/relatório fora desta linha de base até requisito aprovado. Evidência: backlog revisado. |
| R2 — Acesso indevido: login atual é local no navegador. | Alta (3) × Alto (3) = 9 / alto | Arthur: implementar verificação de identidade e autorização em camada confiável; verificar cada operação protegida com perfis sem permissão e acesso direto. Bloquear implantação enquanto falhar. |
| R3 — Alteração de estado ou responsável sem histórico causa perda de rastreabilidade. | Média (2) × Alto (3) = 6 / alto | Lucas: gravar alteração e evento juntos; testar falha de gravação, técnico ausente e tentativa de reabrir OS concluída antes de encerrar I2. |
| R4 — Carga e ambiente indefinidos tornam a meta de 2 s não demonstrável. | Média (2) × Médio (2) = 4 / moderado | Lucas: validar cenário de carga ainda no I1; preparar massa de dados, medir por fluxo e reservar ajustes no A8R09. Evidência: relatório de medições do I2. |

| Probabilidade / Impacto | Baixo (1) | Médio (2) | Alto (3) |
|---|---|---|---|
| Alta (3) | — | — | R1, R2 |
| Média (2) | — | R4 | R3 |
| Baixa (1) | — | — | — |

## 2.6 Correções verificáveis em relação à A8 anterior

| Antes — Atividade_A8.pdf | Agora — revisão | Motivo |
|---|---|---|
| B01/B02/B03: cliente opera solicitação e consulta. | A8R02/A8R03/A8R04: atendente opera cadastro e OS. | Aderência a HU1 e critérios da A5. |
| B04: login técnico apenas no I2. | A8R01: acesso por perfil desde I1. | RNF2 é Must have; segurança acompanha o primeiro fluxo. |
| Em Análise e Em Conserto. | ABERTA, EM ATENDIMENTO e CONCLUÍDA. | Uniformizar com RN1 e A5. |
| B06/B07: diagnóstico, peças e cálculo; B08–B10: pagamento, avaliação e relatório. | Retirados da linha de base A5; B05/B07 preservam apenas atribuição e conclusão em A8R06/A8R07. | Não há requisito correspondente para as extensões; não confundir com funcionalidades existentes no protótipo. |
| Histórico, busca por equipamento e RNF1 sem cobertura explícita. | A8R05, A8R08 e A8R09. | Cobrir todos os requisitos priorizados. |
| I3 citado sem descrição; estimativas sem referência. | Dois incrementos detalhados; escala e justificativas registradas. | Plano demonstrável e estimativas comparáveis. |
| Riscos centrados em peças e pagamentos. | Riscos de escopo, acesso, histórico e desempenho. | Mitigação vinculada ao escopo efetivo. |

## 3. Decisões e pendências

Decisões documentadas: preservar os nove itens A8R, dois incrementos e a priorização da A5; apresentar MoSCoW, rastreabilidade e escala em tabelas; corrigir o volume do RNF1 para até 10.000 OS. Os incrementos descrevem o plano de entrega.

Pendências / próximos passos: registrar as estimativas individuais, divergências e consenso no Registro-Revisao-Equipe.md; conferir a matriz original de perfis e os parâmetros de ensaio; revisar o conteúdo em dupla, preencher a data efetiva e assinar. Etapa: AP2.

## 4. Declaração de uso de Inteligência Artificial

Conforme o Manual da Disciplina (seção 6 — Uso de Inteligência Artificial), toda utilização relevante de IA no desenvolvimento desta atividade deve ser declarada abaixo e também registrada no arquivo DEVLOG.md do repositório do projeto. Se a equipe não utilizou IA nesta atividade, marque a opção correspondente e não é necessário preencher a tabela.

( ) A equipe não utilizou ferramentas de IA nesta atividade.

(X) A equipe utilizou ferramentas de IA nesta atividade — declaração abaixo.



| Data e ferramenta | Objetivo do uso | Prompt ou resumo da interação | Resultado aproveitado / rejeitado / modificado |
|---|---|---|---|
| 30/09/2026 — ChatGPT/Codex | Preparar a revisão inicial. | Confrontar A5 e A8; organizar backlog, estimativas, incrementos e riscos. | Base de texto, backlog e riscos. |
| 07/10/2026 — ChatGPT/Codex | Corrigir a A8 conforme feedback da professora. | Organizar tabelas, reconciliar referências à A5 e corrigir o volume do RNF1. | Tabelas e correções documentais; consenso e assinaturas reservados aos integrantes. |

Forma de verificação: confronto com o feedback da professora, critérios e prioridades da A5 local e requisitos da A4; conferência dos oito requisitos e nove itens A8R e da consistência do RNF1. O registro da discussão e da revisão pelos integrantes fica em Registro-Revisao-Equipe.md.

Responsável pela decisão final sobre o uso: Arthur Scharfenberger e Lucas Oliveira da Silva.

## 5. Responsabilidade e autoria

A equipe declara que este documento foi lido, compreendido e validado por todos os integrantes, que respondem integralmente pela correção, coerência, legalidade e autoria do conteúdo entregue. Qualquer integrante poderá ser questionado, em apresentação, sobre partes produzidas com apoio de IA.

Assinatura (nomes por extenso):

Arthur Scharfenberger: ____________________________________________________

Lucas Oliveira da Silva: ____________________________________________________
