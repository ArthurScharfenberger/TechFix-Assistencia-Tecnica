# Uso de inteligência artificial — AP2

Equipe: Arthur Scharfenberger e Lucas Oliveira da Silva. Atualização: 07/10/2026.

OpenAI Codex participou diretamente da implementação e revisão do projeto, incluindo código Java e TypeScript, testes, correção do escopo para notebooks e PCs, documentação, diagramas, slides, roteiro e interface web. Portanto, sua participação incluiu geração e alteração de código, além de orientação.

Na AP2, a ferramenta apoiou a consolidação dos incrementos: coleção `List<OrdemServico>` (A6), composição de `ItemServico` (A7), herança de `Equipamento` (A8) e contrato `RoteiroDiagnostico` com despacho polimórfico (A9). Também preparou a saída explicativa dos testes e verificou a correspondência entre documentação, código e demonstração.

A validação inclui recompilação e 14 testes JUnit, execução de `Main`, cinco testes do frontend e build TypeScript/Vite. A revisão da interface foi realizada em navegador temporário, sem inserir os registros de teste no ambiente do usuário.

O histórico anterior de uso de IA está em [backend/IA.md](backend/IA.md) e [DEVLOG.md](DEVLOG.md). Este arquivo atende à nomenclatura `AI.md` solicitada para a avaliação, preservando o histórico existente.

Em 07/10/2026, Codex também apoiou a revisão documental das atividades 8 e 10 de Processos conforme feedbacks da professora e a elaboração de esboço e final da A7 solicitada pelo usuário. A A2 fornecida e a confirmação do usuário fundamentam o ciclo iterativo e incremental; a A6 orienta revisão antes da conclusão. Foram produzidos processo Scrum, tabelas de planejamento, RNF1 com até 10.000 OS, matriz de rastreabilidade, diagrama vetorial e revisão de coerência de A2 a A9. A1 foi excluída por orientação do usuário. PDFs conferidos visualmente; paginação do Word sem verificação visual por falha na exportação nativa. A origem na A3 foi posteriormente incorporada como simulação por página/seção/ID; consenso, revisão humana e assinaturas dependem de registros reais. Detalhes em [entregas de Processos](docs/processos/entregas/).

A equipe é responsável por revisar o material, compreender as decisões e defender o código ao vivo. A execução das verificações não comprova ensaio, apresentação ou submissão no ambiente acadêmico.

Em 07/10/2026, Codex preparou também a apresentação AP2 de Processos: slides editáveis, notas de fala, roteiro da dupla, perguntas de ensaio e ficha institucional. Conferiu a A3 fornecida (entrevista simulada), completou a origem da matriz A10 por página/seção/ID e verificou os slides e PDFs. Revisão humana, consenso das estimativas, validação do PO e assinaturas não foram inventados. Materiais e fontes em [apresentação de Processos](docs/processos/apresentacao-ap2/).

Em 07/10/2026, a pedido da equipe, Codex reconstruiu a versão visual do Gamma em 13 slides editáveis, corrigiu conexões do fluxo e acrescentou rastreabilidade explícita, matriz e fechamento AS. Atualizou roteiro e ficha, preservando o PDF original. Gamma foi usado pela equipe para criar a referência inicial. Materiais em [versão Gamma revisada](docs/processos/apresentacao-ap2/).

Em 07/10/2026, Codex organizou `docs` a pedido do usuário, mantendo apenas os 23 PDFs e três PowerPoints. Separou as disciplinas e as versões anteriores, arquivou fontes e auxiliares em backup local fora de `docs` e atualizou os links de navegação. Os arquivos finais foram preservados byte a byte.

## Atividade 12 - 09/11/2026

OpenAI Codex implementou a separa??o em pacotes, a interface de reposit?rio, o registro imut?vel, o servi?o com inje??o por construtor e as implementa??es em mem?ria e arquivo. Tamb?m criou 12 testes novos, executou os 31 testes JUnit, verificou duas execu??es consecutivas do Main e preparou UML, README, ficha em PDF e guia de microdefesa. A participa??o incluiu gera??o de c?digo e documentos. A equipe ainda deve revisar e compreender o material, confirmar sua responsabilidade e realizar o envio na plataforma Aula. Evid?ncias em [Atividade 12](docs/poo/atividade-12/README.md).

## Processos — etapa AS (11/11/2026)

Nas atividades A11 a A14 de Processos de Engenharia de Software, Claude (Claude Code) elaborou o plano de qualidade, a revisão por inspeção, a estratégia e os casos de teste e a análise da solicitação de mudança SM-01. Também atuou como revisor simulado (A12 e PR #1) e como stakeholder simulado (Marcos Almeida, da A3), escreveu os scripts que executaram 9 casos de teste no protótipo e gerou as fichas a partir do modelo padrão. Os resultados de teste vêm de execução real; nenhuma reunião, aceite do PO ou assinatura foi presumido. Detalhes em [DEVLOG.md](DEVLOG.md), [docs/processos/05-qualidade](docs/processos/05-qualidade/) e [docs/processos/06-evolucao](docs/processos/06-evolucao/).

## 18/11/2026 - A15 - Integração final AS

OpenAI Codex apoiou a integração do mapa docs/01 a docs/06, revisão dos IDs, atualização da situação dos testes, registro DIV01–DIV08, plano de manutenção, riscos R1–R6, roadmap e lições. A ficha padrão A15 contém o conteúdo no corpo e os links da release e do protótipo local. O usuário confirmou apresentação local e autorizou nomes digitados de Arthur Scharfenberger e Lucas Oliveira da Silva no campo de assinaturas.

Verificações: confronto das fontes com a A8 e com os resultados preservados da A13; commits 714ac8a/d62fbe6 para dívidas documentais pagas; links locais e IDs conferidos; ficha renderizada para inspeção visual. A15 não corrige DT01–DT05 nem atesta aceite do PO, execução de CT10–CT22 ou envio na plataforma. v2.0.0 é a versão final do dossiê de Processos; v12 continua sendo a entrega de POO.

## POO A10, A13 e A14 — 23/11/2026

OpenAI Codex participou diretamente da auditoria das entregas e da implementação de código, testes, refatorações, diagramas e fichas. Na A10, verificou testes e configuração do compilador; na A13, separou serviço e apresentação, implementou exceções e persistência com troca atômica. A A14 acrescenta regressões, teste parametrizado, mutação controlada e verificação em clone limpo. O histórico e os logs registram as verificações realmente executadas.

Não foram inventados feedbacks da professora, assinaturas, microdefesas, autoria exclusivamente humana nem submissões. O feedback específico da defesa AP2 permanece dependente do relato da dupla. A equipe precisa revisar, compreender e assumir a responsabilidade pelo conteúdo antes de enviar as fichas.

## AS de POO — apresentação final — 23/11/2026

OpenAI Codex iniciou a preparação: leu o enunciado e renderizou a apresentação AS de Processos como referência visual. Claude Code (Anthropic) montou os 9 slides (PDF e PowerPoint, fonte mínima de 24 pt), o roteiro de 8 minutos e as respostas de preparação para a defesa, a partir do código, do UML e dos logs reais da v14. Antes da montagem, `mvn clean test` foi reexecutado: 47 testes, 0 falhas, 0 erros. O código Java não foi alterado nesta etapa.

Ensaio, apresentação, respostas na defesa e envio da ficha são responsabilidade da dupla e não estão atestados aqui. Materiais em [docs/poo/apresentacao-as](docs/poo/apresentacao-as/README.md).
