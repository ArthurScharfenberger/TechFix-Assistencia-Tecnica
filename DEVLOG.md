# DEVLOG — TechFix

Este documento registra a evolução do projeto TechFix durante o semestre.

## 11/11/2026 — Organização dos documentos por disciplina

- A pedido do usuário, tudo o que é de POO foi para `docs/poo/` (atividades 06, 09, 11 e 12, AP2, UML, diagramas de classes e roadmap Java) e tudo o que é de Processos foi para `docs/processos/` (entregas A2–A10, AP2, backlog, dossiê, 05-qualidade e 06-evolucao). O índice por atividade está em `docs/README.md`.
- Código, `CHANGELOG.md` e `Testar-POO.cmd` continuam onde estavam. Movimentos feitos com `git mv`, preservando o histórico.
- Links atualizados em README, AI.md, PLANEJAMENTO, READMEs do backend e dos diagramas, scripts geradores e fichas. Conferência automática: todos os links locais dos Markdown resolvem. Também foram corrigidos links da AP2 que apontavam para a pasta `gamma-revisada/`, que não existe desde 07/10.
- As fichas A11–A14 foram regeneradas com os novos caminhos. A11 e A13 usam a versão entregue da fonte (commits 6f0c865 e 3fd3850). Na ficha de POO da A11, só as URIs dos links foram trocadas; o texto foi conferido como idêntico.

## 11/11/2026 — Processos: A11 a A14 (etapa AS)

- A11: plano de qualidade com cinco características da ISO/IEC 25010:2023, métricas e metas numéricas, características adiadas, dois conflitos e critérios Q1–Q5 na Definition of Done; esboço preservado. Ficha padrão gerada do `Documento_Padrao_Entrega_Atividades.docx` por `scripts/gerar_fichas_processos.py` e exportada pelo Word.
- Requisitos, backlog e matriz passaram a ter fonte versionada em `docs/dossie/`, transcrita sem correções (commit 151f419) para servir de "antes" na revisão.
- A12: inspeção de requisitos, matriz e plano com checklists sim/não. Revisor simulado com IA (Claude), com o prompt do enunciado aplicado por artefato: 22 possíveis achados, 18 aceitos (1 crítico, 9 maiores, 6 menores, 2 sugestões) e 4 rejeitados com justificativa. O crítico D01 confirmou a divergência da A5 anotada em 07/10: a tabela 2.2.1 tem registros de IA no lugar dos requisitos. Correções nos commits 714ac8a, d62fbe6 e f092cb0. Validação V1 (e-mail opcional) e V2 (tempo de abertura) com o stakeholder simulado Marcos Almeida, interpretado por IA; ratificação pelo PO pendente. Critério Q6 acrescentado à DoD.
- A13: estratégia e 18 casos (partição, valor limite e tabela de decisão; 7 negativos; 4 não funcionais). Execução real de 9 casos com `docs/05-qualidade/execucao/`: domínio Java (JDK 25) e `ChamadoService` do frontend (Node 24). 4 passaram e 5 falharam, gerando os defeitos DT01–DT05 (OS concluída volta a ABERTA no Java e no frontend; início sem técnico; ABERTA → CONCLUIDA; e-mail obrigatório; só o primeiro campo pendente é indicado). O código não foi alterado para preservar as entregas de POO v11/v12; os defeitos foram vinculados a A8R02, A8R06 e A8R07.
- A14: release v1.0.0 como linha de base; SM-01 (retorno em garantia) pedida pelo stakeholder simulado com IA; análise de impacto até testes, backlog e riscos; aprovação parcial (OS de garantia vinculada, RN1 preservada; filtro por equipamento para o I3). Branch `sm-01-garantia`, PR #1 com revisão do revisor simulado (achado R-01 corrigido antes do merge), merge f122e24, release v1.1.0 e CHANGELOG.md.
- Uso de IA: Claude (Claude Code) elaborou documentos, checklists e casos, simulou revisor e stakeholder, escreveu os scripts de execução e o gerador de fichas e executou os comandos git. Commits feitos pela conta do usuário, a pedido dele. Revisão humana, decisão do PO e assinaturas continuam com a dupla.

## 07/10/2026 — Correções dos feedbacks de Processos A8 e A10

- Complemento solicitado pelo usuário: elaborar A7 (esboço e final), ignorar A1 nesta revisão e concluir A10 conforme enunciado, na ficha padrão com disciplina Processos de Engenharia de Software. O usuário esclareceu que A7 ainda não havia sido feita; os arquivos criados agora não são apresentados como entrega anterior, apesar da referência em sentido diferente no feedback inicial.
- Novas fontes fornecidas e preservadas: atividade02-12-08.pdf e Atividade_06_Reflexao_Individual_Arthur_Scharfenberger.pdf. A2 escolhe incremental com práticas ágeis; o usuário confirmou ciclo iterativo e incremental. A6 fundamenta a revisão cruzada e a conclusão por evidências da A7.
- A7: Scrum, Sprint semanal, papéis de Arthur/Lucas/Chico Mosca, fluxo com responsáveis e condições de passagem, DoD, validação de negócio separada da conclusão técnica e tabela de evolução entre esboço e final. Referência conceitual consultada: Scrum Guide 2020, https://scrumguides.org/scrum-guide.html. Não foram inventadas reuniões, Sprints realizadas, estimativas consensuais ou assinaturas.
- A10: acrescentadas revisão de coerência A2–A9, correções do esboço, vínculos para as seções da nova A7, histórias de usuário na matriz e prazo de início do Encontro 11. A A1 permanece fora do escopo por orientação expressa.
- Verificação final: conteúdo integral de cada fonte Markdown localizado no respectivo DOCX, disciplina conferida no cabeçalho, cinco seções institucionais presentes e diagrama incorporado à A10. PDFs revisados visualmente: A7 esboço com 2 páginas, A7 final com 5, A8 com 5 e A10 com 6. Não foram executados testes Java/TypeScript porque esta alteração é exclusivamente documental. Arquivo temporário de bloqueio do Word permaneceu após a limpeza ser recusada pela política da ferramenta; não integra as entregas.

- Solicitação: corrigir os dois feedbacks da professora. Apoio de ChatGPT/Codex na leitura das fontes, revisão dos textos, organização das tabelas, desenho vetorial e atualização das fichas institucionais.
- A8: MoSCoW com oito linhas e justificativas; rastreabilidade requisito/prioridade/backlog/incremento; escala P/M/G tabulada; RNF1 corrigido de 1.000 para até 10.000 OS. Mantidos nove itens A8R, dois incrementos e quatro riscos.
- A10: nova ficha com cinco seções, arquitetura C1–C4 em SVG editável, matriz dos oito requisitos e ligações com a A7: revisão por outro integrante, divisão de componentes e saída de C1 validada pelo PO Chico Mosca. Esboço anterior preservado como histórico.
- Fontes: feedbacks fornecidos em 07/10, A4, A5 local, A8 revisada e modelos. A professora confirma a entrega de A7 e A9. A3 original e arquivos entregues de A7/A9 dependem de indicação da equipe; não foram recriados como se fossem os originais.
- Divergência comprovada: tanto Atividade05.docx quanto Atividade05.pdf locais apresentam registros de IA na tabela 2.2.1, diferentemente da versão avaliada descrita pela professora. A revisão reconhece a A5 entregue como linha de base e registra a necessidade de sincronizar o portfólio, preservando os arquivos locais.
- Criado Registro-Revisao-Equipe.md para estimativas individuais, divergências, argumento do consenso, fontes e fechamento. Não foram inventados consenso, citações da entrevista, data de submissão, validação humana ou assinaturas.
- Fontes Markdown passam a alimentar o gerador PowerShell das fichas A8/A10; o gerador antigo foi limitado à modelagem para não restaurar o conteúdo corrigido da A8. DOCX preenchidos pelo Word. O runtime de documentos/LibreOffice empacotado não está disponível neste ambiente Windows, e a exportação PDF nativa do Word travou inclusive em documento de teste. PDFs produzidos por ReportLab/svglib e conferidos visualmente; paginação dos DOCX não validada visualmente.
- Código Java/TypeScript inalterado. Esta revisão é documental e não comprova implementação de API, autenticação no servidor ou banco. Responsáveis finais pelo conteúdo: Arthur Scharfenberger e Lucas Oliveira da Silva.

## 30/09/2026 — Preparação das entregas de Processos

### Consolidação da documentação e das alterações locais

- Exportadas pelo Microsoft Word as três entregas para PDF, na mesma pasta: A8 final (5 páginas), modelagem esboço (3) e modelagem final (6). DOCX preservados para edição; documento padrão mantido junto das entregas.
- Índices atualizados em README.md, PLANEJAMENTO.md e na página histórica da A8, distinguindo a revisão A8R01–A8R09 do planejamento original B01–B10. Links corrigidos para o nome atual `A8-Entrega-Final.docx` e PDFs adicionados ao índice das entregas.
- Gerador ajustado para usar o documento padrão da pasta de entregas e produzir o nome atual do DOCX da A8. Não foi reexecutado nesta consolidação para evitar sobrescrever eventuais edições posteriores no Word. Fontes Markdown são referências da preparação, não sincronização automática de edições manuais.
- Incluídas as alterações de interface já presentes no workspace: cabeçalho com navegação e controles de tema/sessão, barra lateral agrupada por área, dashboard com quatro indicadores principais e atalhos, revisão dos temas claro/escuro, cores dos gráficos, favicon e estilos de formulários, tabelas, login e responsividade.
- Validação: `npm run build` aprovado (TypeScript e Vite). O Vite emitiu aviso de bundle acima de 500 kB; não houve erro de compilação. Não foi realizada validação visual interativa do frontend nesta consolidação, nem novos testes Java, pois o backend não foi alterado.
- Solicitação do usuário: documentar tudo, atualizar os registros, criar commit e enviar ao remoto. Apoio de ChatGPT/Codex na revisão dos diffs, atualização dos índices e execução das verificações.

- Ajuste solicitado posteriormente: os três DOCX foram refeitos preenchendo diretamente `docs/entregas-processos/Documento_Padrao_Entrega_Atividades.docx`, preservando seções, campos, margens, cabeçalhos, declaração institucional e tabela de IA com quatro colunas. Conteúdo e imagens inseridos na seção 2; decisões, pendências e responsáveis preenchidos nos respectivos campos. Estrutura verificada por reabertura dos arquivos e comparação com o modelo fornecido.

- Apoio de IA (ChatGPT/Codex) para confrontar a A5 com a A8 original e preparar três documentos no modelo institucional: A8 final revisada, esboço de modelagem e modelagem final.
- Arquivos em `docs/entregas-processos/`, com fontes Markdown, fluxogramas e wireframe. Gerador: `docs/gerar_entregas_processos.py`.
- Revisão proposta do backlog com rastreabilidade para todos os itens priorizados da A5, estimativas P/M/G, dois incrementos por valor, matriz de riscos e comparação com a versão anterior.
- Modelagem ligada a A8R02 e A8R03. O esboço foi preparado nesta sessão, sem afirmar realização anterior em oficina. Estimativas e decisões ainda dependem de validação dos integrantes; não foi registrado consenso ou assinatura fictícia.
- Verificação documental: leitura dos arquivos A5/A8, conferência de cobertura dos requisitos, geração e reabertura dos DOCX e conferência das imagens incorporadas. Documentos originais e código preservados.
- Prompt resumido: preparar a entrega final de planejamento e as duas etapas de modelagem conforme os critérios apresentados pelo usuário. Resultado aproveitado: documentos e modelos para revisão; responsáveis finais: Arthur Scharfenberger e Lucas Oliveira da Silva.

Os registros são organizados por data e apresentam as principais alterações,
decisões, verificações e pendências de cada etapa do desenvolvimento.

---

## 05/08/2026

### Responsáveis

- Arthur Scharfenberger

### Objetivo do dia

Organizar a preparação do projeto para envio ao GitHub, consolidando a documentação inicial e ajustando os arquivos de configuração para evitar o envio de artefatos locais e temporários.

### Alterações realizadas

- Ajustes na estrutura da interface com uma sidebar recolhível e persistência do estado no navegador.
- Inclusão de uma página de Indicativos com filtros, cards e gráficos para análise dos dados.
- Implementação do módulo de Equipe com cadastro, listagem, filtros e gerenciamento de funcionários.
- Melhorias nas páginas de ordens de serviço e reparos para utilizar o fluxo de cliente, técnico e equipamento de forma mais consistente.
- Atualização do fluxo de equipamentos para gerar códigos automáticos no padrão TFX-EQP-000001 e remover o uso legado de patrimônio.
- Aprimoramento do feedback visual com toasts e confirmação antes de limpar dados.

### Decisões tomadas

- O domínio do sistema passou a tratar clientes, equipamentos, ordens e reparos como registros principais do fluxo de assistência.
- Equipamentos recebem códigos internos automáticos, em vez de depender de patrimônio empresarial.
- O estado da sidebar e das preferências visuais permanece salvo no navegador.
- A equipe passou a ser tratada como módulo próprio para vincular funcionários às ordens e aos reparos.

### Verificações realizadas

- Leitura do README e do package.json para identificar objetivo, integrantes e estrutura do projeto.
- Verificação da presença de arquivos de build, logs, temporários e possíveis arquivos sensíveis na pasta do projeto.
- Execução do comando de build do projeto para validar a compilação atual.

### Problemas encontrados

- O repositório não apresentou histórico de commits com registros de hoje, o que dificultou a confirmação de alterações por data.
- A pasta do projeto contém artefatos gerados como dist, logs e node_modules, que precisam ser excluídos do envio.
- O projeto não possui scripts de lint ou testes configurados no package.json.

### Pendências / próximos passos

- Confirmar se o repositório remoto será criado com o conteúdo atual do projeto.
- Revisar os dados locais e decidir se os arquivos de logs devem permanecer na pasta do repositório ou ser mantidos apenas localmente.
- Incluir documentação adicional do fluxo de uso, se a equipe desejar ampliar o material acadêmico.

### Arquivos principais modificados

- src/components/sidebar.ts
- src/pages/indicativos.ts
- src/pages/equipe.ts
- src/services/equipamentoService.ts
- src/pages/chamados.ts
- src/pages/manutencoes.ts

### Commits relacionados

- Alterações ainda não commitadas.

## 06/08/2026 — Módulo de Relatórios

- Adicionado menu expansível de Relatórios com visão geral e quatro categorias.
- Implementados filtros por período e entidades, resumos, tabelas, paginação, ordenação e gráficos compactos com dados reais.
- Incluídas exportação CSV em UTF-8, impressão A4/PDF, documento individual de ordem e logs de visualização/exportação.
- Integradas novas rotas protegidas, estados vazios, tema claro/escuro e layouts responsivos para desktop, sidebar recolhida e drawer mobile.
- Verificação executada com `npm run build` (TypeScript e Vite).

## 10/08/2026 — Estrutura Java e diagrama de classes

### Objetivo

Organizar separadamente a atividade de Programação Orientada a Objetos, mantendo o frontend existente sem integração com Java nesta etapa.

### Alterações realizadas

- Criada a estrutura `backend/src` para o código Java básico.
- Implementadas as classes `Cliente`, `Tecnico`, `Equipamento` e `OrdemServico` e o ponto de entrada `Main`.
- Mantido o modelo sem packages, frameworks, banco de dados, API ou gerenciador de dependências.
- Adicionada a regra `*.class` ao `.gitignore`.
- Documentados o código Java e o diagrama de classes em READMEs próprios.
- Incorporada a imagem `DiagramaClasses.png` à documentação do diagrama.

### Verificações realizadas

- JDK identificado: Java e `javac` 17.0.10.
- Compilação concluída com sucesso usando `javac`.
- `Main` executado com sucesso, demonstrando o status inicial `Aberta` e a alteração para `Em atendimento`.
- Artefatos `.class` gerados no teste removidos após a validação.

### Decisões tomadas

- Java e frontend permanecem independentes nesta fase.
- O diagrama implementado registra atributos, métodos e associações das quatro classes do domínio.
- A classe `Main` não integra o diagrama de domínio, pois existe apenas para demonstrar o uso das demais classes.

## 10/08/2026 — Início da Atividade Semanal nº 3

### Objetivo

Evoluir as classes Java do TechFix para atender aos requisitos da Atividade Semanal nº 3.

### Alterações

- Adicionadas validações básicas aos construtores.
- Implementados os enums `StatusOrdemServico` e `TipoEquipamento`.
- Aplicados os enums em `OrdemServico` e `Equipamento`.
- Adaptada a mudança de estado da ordem.
- Preservados os dados de demonstração no `Main`.
- Criados três testes com JUnit 5.
- Adicionada configuração mínima do Maven para os testes.

### Verificações

- Compilação dos fontes principais concluída com `javac` 17.0.10.
- `Main` executado com sucesso, demonstrando a mudança de `ABERTA` para `EM_ATENDIMENTO`.
- `mvn test` não foi executado porque o Maven não está instalado no ambiente.

## 10/08/2026 — Revisão da documentação da Atividade nº 3

### Atualizações

- Revisadas as estruturas de pastas nos documentos para o padrão Maven (`src/main/java` e `src/test/java`).
- Atualizado o planejamento com os enums, os testes JUnit e o arquivo `pom.xml`.
- Adicionado ao documento do diagrama um modelo Mermaid compatível com o código atual.
- Mantida a imagem anterior como registro histórico, com sua versão identificada claramente.
- Documentado o requisito de JDK 17 e Maven para os testes.
- Adicionado `backend/target/` ao `.gitignore` para evitar o versionamento de artefatos Maven.

### Verificações

- Compilação dos fontes Java e execução de `Main` concluídas com sucesso.
- Build do frontend concluído com `npm run build`.
- Documentos verificados com `git diff --check`, sem erros de formatação.
- Testes JUnit não executados porque o Maven permanece indisponível no ambiente.

## 26/08/2026 — Atividade Semanal nº 5

### Objetivo

Validar os requisitos definidos na Atividade A4, elaborar critérios de aceitação testáveis e realizar a priorização final para apresentação da AP1.

### Alterações realizadas

- Revisados e reescritos os requisitos RF1, RF2, RF3, RN1, RNF1, RNF2, HU1 e HU2 para melhorar clareza, completude, consistência e verificabilidade.
- Elaborados critérios de aceitação no formato Dado/Quando/Então para os três requisitos funcionais.
- Priorizado todo o conjunto de requisitos com o método MoSCoW e justificativa por item.
- Organizado um resumo do fluxo e das decisões para apresentação da AP1.
- Preenchido o documento padrão de entrega da disciplina.

### Uso de Inteligência Artificial

- A IA foi utilizada como auxílio na identificação de ambiguidades e informações incompletas nos requisitos da A4.
- A IA auxiliou na redação de versões verificáveis dos requisitos, na elaboração inicial dos critérios de aceitação e na organização da priorização MoSCoW.
- Todo o conteúdo aproveitado foi revisado e adaptado pela equipe, que permaneceu responsável pelas decisões finais.

### Verificações realizadas

- Comparação das versões validadas com os requisitos originais da A4 e com a rastreabilidade da entrevista da A3.
- Revisão manual da clareza e da testabilidade dos critérios de aceitação.
- Conferência da estrutura do novo documento com as cinco seções e a tabela de declaração de IA do arquivo padrão.

### Pendências / próximos passos

- Revisar e aprovar o conteúdo com todos os integrantes.
- Inserir as assinaturas finais.
- Exportar o documento aprovado para PDF e enviá-lo no AVA até o início do Encontro 6.

## 16/09/2026 — Atividade 08: planejamento incremental, estimativas e riscos

### Objetivo

Consolidar no repositório o planejamento incremental definido pela equipe para o Sistema de Gestão de Manutenção de Equipamentos.

### Atualizações

- Organizado o backlog B01–B10 por prioridade, tamanho relativo e incremento.
- Documentados o valor e a demonstração previstos para I1 e I2.
- Registrada a distribuição de B08, B09 e B10 em I3 sem acrescentar um detalhamento ausente no documento original.
- Documentados os riscos R1 e R2, suas mitigações e posições na matriz de riscos.
- Atualizado o índice de documentação e criada uma versão Markdown consultável da Atividade 08.
- Adicionado ao repositório o PDF original fornecido pela equipe.

### Decisões e pendências

- O fluxo principal de manutenção permanece priorizado em I1 e I2; as funcionalidades financeiras foram postergadas para I3.
- Os nomes “Em Análise”, “Em Conserto” e “Concluído” ainda dependem da aprovação do dono do produto.

### Verificação

- O conteúdo publicado foi comparado com `docs/Atividade_A8.pdf`.
- Escopo, prioridades, estimativas e riscos foram preservados conforme as decisões registradas pela equipe.

## 28/09/2026 — Atividade Semanal nº 8 de POO: entrega final

### Objetivo

Concluir a hierarquia de equipamentos com duas subclasses, sobrescrita, demonstração polimórfica, testes e justificativa de modelagem.

### Implementação

- Transformada `Equipamento` em superclasse abstrata com validações e comportamentos comuns.
- Criadas as subclasses `Notebook` e `Desktop`.
- Sobrescrito `descreverAtendimento()` nas duas subclasses com uso da implementação da superclasse.
- Atualizado `Main` para tratar objetos diferentes por uma `List<Equipamento>` e demonstrar o comportamento especializado.
- Criados quatro testes em `EquipamentoTest`, cobrindo as duas especializações, os dados herdados e a validação herdada.
- Atualizados os READMEs, o diagrama Mermaid, a declaração de IA e a documentação específica da entrega.
- Preenchida a Ficha Padrão de Entrega da Atividade Semanal nº 8 — entrega final.

### Justificativa

Notebook e desktop são tipos de equipamento e compartilham dados, validações e operações. A superclasse concentra essas responsabilidades, enquanto as subclasses acrescentam características e comportamentos específicos, evitando duplicação e permitindo uso polimórfico.

### Verificações

- `mvn clean test`: 8 testes executados, sem falhas ou erros.
- `java -cp target/classes Main`: cenário executado com descrições diferentes para notebook e desktop.
- Documentação comparada com os requisitos do enunciado da entrega final.

### Uso de inteligência artificial

A IA apoiou a revisão da hierarquia, a organização dos testes, a conferência dos requisitos, a atualização da documentação e o preenchimento da ficha padrão. O resultado foi validado por compilação, testes automatizados e execução do cenário; a equipe permanece responsável pela decisão final.


## 30/09/2026 ? Esbo?o da arquitetura e rastreabilidade

- Criados rascunhos em Markdown, DOCX e PDF em `docs/entregas-processos/Arquitetura-Rastreabilidade-Esboco.*`; PDF exportado pelo Microsoft Word e assinatura do formato conferida.
- Atualizados o README principal e o índice das entregas com links para a nova atividade e indicação de seu formato simples.
- Descritos interface, API/l?gica, autoriza??o, persist?ncia e comunica??o; integra??es externas sem requisito ficaram fora do escopo.
- Relacionados RF1, RF2 e RNF2 ?s origens RE1, RE2 e RE4 documentadas na A4, ao backlog A8 e aos modelos existentes.
- Distinguida a arquitetura proposta da implementa??o atual. Registradas as lacunas de A3 original, A7 e identifica??o da A9.
- Uso de IA: ChatGPT/Codex organizou o rascunho a pedido do usu?rio. Conferidos os v?nculos documentais, a exist?ncia dos modelos e a estrutura do DOCX (duas tabelas e tr?s requisitos rastreados). Revis?o final da equipe pendente.

## 04/10/2026 - Atividade 9 - Comportamento polimórfico

OpenAI Codex participou diretamente da implementação de `RoteiroDiagnostico`, dos roteiros distintos de Notebook e Desktop, da integração em OrdemServico e Main, dos seis novos testes e da ficha final. O contrato possui Javadoc, lista imutável e consulta sem efeitos colaterais. O cliente usa a interface sem verificação de tipo.

Verificações: `mvn test` com 14 testes, zero falhas, erros ou ignorados; execução de `java -cp target/classes Main`; revisão visual das quatro páginas do PDF. Foram preparados somente a entrega final em PDF, sua fonte Markdown e o gerador reproduzível. A aprovação pessoal dos integrantes e a submissão no AVA não são presumidas.

## 05/10/2026 - Escopo de atendimento e apresentação de POO

- Consolidado o atendimento exclusivamente de notebooks e PCs (desktops), com `NOTEBOOK` e `DESKTOP` como tipos aceitos.
- Atualizadas a hierarquia Java, as demonstrações e os testes para `Notebook` e `Desktop`. A especialização do desktop usa a configuração de vídeo dedicado ou integrado.
- Ajustados cadastros, filtros, gráficos e especialidades da interface web. Os serviços bloqueiam novos cadastros e reparos de tipos fora do escopo, preservando os dados anteriores.
- Atualizados o diagrama de classes, o roadmap e as fichas das atividades 08 e 09. Os ícones da aplicação passaram a ser importados explicitamente conforme o uso.
- Incorporada a apresentação revisada em `docs/Apresentacao-POO-TechFix.pptx`. Os dez slides foram conferidos com o código e os testes; os diagramas distinguem herança e realização de interface, e o texto explicita que a integração demonstrada ocorre entre objetos Java, separadamente da interface web.
- Preservados os GIFs e as demais imagens da apresentação: arquivos de mídia e posições das imagens mantidas foram comparados com o original.
- Criado `docs/Roteiro-Apresentacao-POO-Arthur-Lucas.md`, com Lucas nos slides 2 a 5 e Arthur na abertura e nos slides 6 a 10. O roteiro contém 571 palavras de fala e reserva aproximadamente seis minutos.
- Verificações: build TypeScript/Vite aprovado; `mvn clean test` com 14 testes, zero falhas, erros ou ignorados; saídas do slide de polimorfismo comparadas com a execução de `Main`; apresentação aberta no PowerPoint, dez slides renderizados e conferidos visualmente; estrutura do PPTX validada sem ocorrências.
- Uso de IA: Codex realizou a correção de escopo, a revisão documental e da apresentação e a preparação do roteiro a pedido do usuário. A equipe permanece responsável pela apresentação e pela submissão acadêmica.

## 05/10/2026 - Revisão dos fluxos da interface web

- Explicitado o atendimento de notebooks e PCs na entrada e no cadastro, com a identificação de desktop como PC.
- Filtrados os seletores de ordens e reparos para equipamentos do escopo que não estejam descartados. A validação de ordens também aplica essas regras.
- Corrigida a exibição de datas civis para evitar o recuo de um dia por conversão UTC. Datas de início e conclusão de reparos usam o calendário local.
- O status do equipamento considera todos os reparos em andamento; concluir um deles não libera o equipamento enquanto houver outro ativo. Troca de equipamento, cancelamento e exclusão também recalculam os estados afetados.
- Rejeitados custos infinitos, datas de início inexistentes e status de reparo desconhecidos.
- Adicionados cinco testes de regressão da interface web, executáveis por `npm test`. Testes e `npm run build` aprovados. A inspeção visual em navegador não foi realizada porque não há navegador conectado nesta sessão.

## 05/10/2026 - Execução dos testes na apresentação

- Criado `Testar-POO.cmd` para executar o Maven/JUnit em modo offline a partir da pasta do próprio script, com verificação de Java, javac e Maven e pausa para leitura do resultado.
- Adicionados `npm run test:poo` e `npm run test:all`, mantendo os 14 testes Java separados dos cinco testes da interface web.
- Documentados preparação com internet, requisitos, resultado esperado e execução de `Main` em `docs/Executar-Testes-Na-Apresentacao.md`.
- Verificada a execução offline neste computador: 14 testes, zero falhas, erros ou ignorados e `BUILD SUCCESS`. Verificado também que a ausência de JDK retorna erro sem anunciar aprovação.

## 05/10/2026 - Saída explicativa dos testes de POO

- O lançador utiliza `scripts/apresentar-testes-poo.ps1`, com cores, agrupamento por conceito e explicação individual dos testes. As contagens são calculadas a partir dos relatórios reais do JUnit.
- A execução offline recompila com `clean test`, grava o log completo e retorna erro quando o Maven falha, sem apresentar relatórios anteriores como aprovação.
- Validada a execução real: 14 testes aprovados. Validado também o retorno de erro do lançador com Maven simulado em falha.

## 05/10/2026 - Interface da oficina conforme referência aprovada

- Reorganizada a oficina com cabeçalho preto, logo oficial, área branca, destaques ciano e tabela como elemento central. Removidos sombras, blur e estilos decorativos; identidade compartilhada com os demais módulos.
- Reutilizados os serviços, a autenticação, os formulários de ordens e a persistência existentes. Busca, filtros, paginação, detalhes, atribuição e criação permanecem funcionais.
- Indicadores e listas utilizam dados reais. Campos ausentes na modelagem foram adaptados explicitamente: custos em vez de faturamento, abertura em vez de prazo e conclusões em vez de retirada. Mapeamentos documentados em `docs/Interface-Oficina.md`.
- Validado o build e os cinco testes do site. Verificados fluxos em Chromium temporário e capturas nas larguras de 1586, 1280, 768 e 390 pixels, sem incluir dados de teste na aplicação.
- Uso de IA: Codex implementou a interface e executou as verificações a pedido do usuário.

## 05/10/2026 — Consolidação da entrega AP2

- Atualizado o diagrama Mermaid com `RoteiroDiagnostico`, métodos da A9, realização da interface e multiplicidades de associações e composição. Criada uma versão visual em SVG e seu gerador.
- Consolidada a conferência dos nove requisitos em `docs/Entrega-AP2.md`, corrigido o acesso de demonstração no README e atualizado o planejamento. Criado `AI.md` na raiz, preservando `backend/IA.md`.
- Ajustado o roteiro para 6 minutos e 20 segundos, incluindo um minuto de execução ao vivo. Atualizado e conferido visualmente o PDF de três páginas; gerador incluído em `scripts/`.
- Reexecutados build TypeScript/Vite, cinco testes do site, 14 testes JUnit offline e `Main`, com sucesso. Slides preservados: já cobrem A6–A9, com mídias intactas.
- A entrega inclui o visual aprovado da oficina e será identificada por commit publicado e tag anotada `ap2`. A apresentação e a submissão no AVA permanecem sob responsabilidade da equipe.

## 07/10/2026 — Apresentação AP2 de Processos de Engenharia de Software

- A pedido do usuário, Codex preparou 13 slides principais e 3 de apoio em PowerPoint/PDF, com notas, roteiro de 11 minutos e reserva de 4 minutos para perguntas, dividido entre Arthur e Lucas.
- Conteúdo: A7 processo/papéis/fluxo; A8 backlog/estimativas/riscos; A9 fluxo e wireframe; A10 componentes e rastreabilidade; AS com testes e evolução. Tabelas e diagramas editáveis.
- A A3 adicionada pelo usuário foi lida: entrevista simulada com Marcos Almeida. As referências por página, seção e IDs RF03–RF05 passaram aos slides e à matriz A10, sem inventar respostas literais. A1 excluída conforme orientação.
- Ficha institucional preparada em DOCX/PDF com link da apresentação e declaração de IA. Estimativas continuam propostas até consenso; revisão, validação de negócio e assinaturas não foram presumidas.
- Verificação: exportação nativa no PowerPoint, inspeção visual de todos os slides e páginas PDF, verificadores de estrutura/geometria, 16 notas de fala, IDs/valores e exposição de 660 segundos. DOCX segue o modelo; paginação do Word não foi verificada visualmente devido à falha local de renderização. Código de aplicação não foi alterado por esta tarefa.
- A apresentação está em `docs/apresentacao-processos-ap2/`; fontes consultadas e instruções de reprodução acompanham os arquivos. A publicação usa a branch `docs/ap2-processos-2026-10-07`.

## 07/10/2026 — Revisão visual da AP2 a partir do Gamma

- Reconstruídos 13 slides editáveis com as fontes, cores e disposição da apresentação fornecida. O PDF original foi preservado.
- Corrigidas conexões do fluxo e acrescentados caminho A3 até arquitetura, matriz de oito requisitos/histórias e fechamento AS. Roteiro de 11 minutos dividido entre Arthur e Lucas, com quatro minutos para perguntas.
- Gerados PowerPoint com fontes incorporadas, PDF, roteiro e ficha institucional com link da versão revisada. Inspeção visual e validação de geometria: 13 slides, nenhum problema ou aviso.
- Uso de IA: Gamma gerou a referência e Codex reconstruiu e completou o material; revisão humana e assinaturas permanecem com a equipe.

## 07/10/2026 — Organização dos documentos

- A pedido do usuário, a pasta `docs` passou de 90 para 26 arquivos: 23 PDFs e três apresentações PowerPoint, preservados sem alteração de conteúdo.
- Separadas entregas e apresentações de POO e Processos, planejamento inicial e versões anteriores. A apresentação Gamma revisada manteve seu caminho atual.
- Arquivados 64 auxiliares de `docs` (Word, Markdown, scripts, fontes e imagens) e o gerador de roteiro sem fonte ativa. Backup integral conferido em `tmp/organizacao-documentos/documentos-antes-da-organizacao-20261007-172746.zip`; arquivos recuperáveis também em `tmp/organizacao-documentos/auxiliares-arquivados/`. O backup local não é versionado.
- Atualizados os links de navegação no README, planejamento e documentação Java. Verificados os hashes dos 26 PDFs/PowerPoints e os destinos dos links locais. Código da aplicação não foi alterado.
- Uso de IA: Codex organizou os arquivos. A remoção em lote foi bloqueada pela política da ferramenta; os auxiliares foram movidos para arquivo local reversível. Nenhuma exclusão definitiva ou publicação remota foi realizada nesta organização.

## 09/11/2026 - Atividade 12: arquitetura e reposit?rio

- C?digo Java organizado em `com.techfix.dominio`, `com.techfix.repositorio` e `com.techfix.app`, mantendo a evolu??o da tag `v11`.
- `ServicoOrdens` recebe `RepositorioOrdens` por construtor; `RegistroOrdem` guarda os dados da conclus?o, incluindo o total calculado.
- Implementa??es em mem?ria e texto TSV via `java.nio.file`; erros propagados como `UncheckedIOException`.
- 31 testes aprovados com JDK 25 (19 anteriores e 12 novos), incluindo recupera??o por nova inst?ncia com `@TempDir`. Duas JVMs comprovaram hist?rico 0 ? 1 e 1 ? 2.
- UML em `docs/uml.png`, print no README, ficha de entrega e guia de microdefesa em `docs/atividade-12`. Apoio de implementa??o e documenta??o por OpenAI Codex declarado na ficha.
- Altera??es locais anteriores de documentos e frontend foram preservadas fora dos commits da A12.
