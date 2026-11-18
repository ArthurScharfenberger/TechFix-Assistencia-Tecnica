# Roteiro AS — 12 minutos

Arthur: 6 minutos. Lucas: 6 minutos. Slides 14–15 somente nas perguntas.

## 01. TechFix — Arthur, 1 min

Somos Arthur Scharfenberger e Lucas Oliveira da Silva. O TechFix organiza o atendimento de notebooks e desktops. O problema de origem é acompanhar clientes, equipamentos e ordens em papel e planilhas. Desde o recorte inicial apresentado na AP1, consolidamos critérios verificáveis, conectamos os artefatos aos testes e tratamos uma solicitação de garantia. A entrega de hoje é a versão final do dossiê. O produto continua sendo um protótipo local com limitações conhecidas.

## 02. Mapa do dossiê — Arthur, 1 min

Abra o README do repositório. Ele liga as seis pastas, o protótipo local e o CHANGELOG. Mostre docs/02-requisitos e a matriz, depois docs/05-qualidade e docs/06-evolucao. A release v2.0.0 congela o dossiê final da AS. Explique que as tags v11 e v12 pertencem a POO. Os componentes C1 a C4 descrevem a arquitetura planejada. O frontend usa localStorage e o Java é um protótipo independente, sem API integrada.

## 03. 1. Abrir a ordem de serviço — Arthur, 1 min

Fluxo demonstrado: abrir e consultar uma OS, ligado ao RF2 Must, HU1 e CA04. Ana Souza já tem o notebook EQ-1 cadastrado. A tela usa o código visível TFX-EQP-000001 para esse mesmo ID EQ-1. Preencha título Notebook não liga, descrição Não liga, cliente Ana Souza e o notebook. Mantenha Aberta e técnico não atribuído. Clique Salvar. O CT04 utiliza Ana/EQ-1, mas a expectativa integral de OS 25 e evento ainda não é atendida. Esta demonstração confirma somente a parte implementada da abertura.

## 04. 2. Consultar a ordem criada — Arthur, 1 min

Após salvar, a ordem aparece na lista. Abra o ícone de visualização para consultar os detalhes. Mostre o cliente, equipamento, abertura, técnico não atribuído e estado Aberta. A gravação local funciona. A tela exibe um ID CHD, não a sequência numérica prevista. Também não comprova o evento OS aberta. Por isso o CT04 é parcial, como consta na consolidação da A13. Não declare RF2 integralmente aceito. O frontend local e o Java continuam separados.

## 05. 3. Equipamento de outro cliente — Arthur, 1 min

Agora mostre o caminho alternativo do CT03. A entrada é cliente Ana Souza com EQ-2, que pertence a Bruno Lima. A interface filtra equipamentos por cliente, por isso o cenário inválido foi enviado diretamente ao ChamadoService.create, como no teste da A13. O serviço devolveu a mensagem mostrada e não acrescentou nenhuma OS: havia uma e continuou uma. A captura usa o Toast da aplicação para exibir o erro real. Essa evidência protege CA03 e não deve ser apresentada como uma seleção comum permitida pela tela.

## 06. Metas de qualidade — Lucas, 1 min

Priorizamos regras corretas e acesso seguro porque uma OS inválida ou um acesso indevido compromete o atendimento. As metas têm medida, massa e critério de aceite. Dê destaque às 14 tentativas negadas e ao p95 de dois segundos. A confiabilidade exige ausência de gravação parcial e duplicação sob falhas e reenvios. A interação é medida com três participantes, sem ajuda. São metas planejadas, ainda sem evidência integral de cumprimento. Não confundimos a existência de um teste com seu resultado.

## 07. Revisão com correções rastreáveis — Lucas, 1 min

A revisão teve 22 apontamentos potenciais. A equipe aceitou 18 achados e rejeitou quatro sugestões. Dos 18, quinze receberam correção documental e três permanecem abertos. Mostre a correção da fonte dos requisitos e o complemento da matriz com critérios e origens. Atenção ao e-mail: o requisito foi corrigido para opcional, mas a implementação Java ainda falha no CT01. A revisão simulada com IA ajudou a encontrar inconsistências e não substitui a ratificação do PO Chico Mosca.

## 08. Cobertura definida, execução parcial — Lucas, 1 min

A matriz pós SM-01 tem 22 casos, cobrindo os 19 critérios e os oito itens Must com casos especificados. Nove IDs foram exercitados na execução de 11/11. Um passou no cenário, três foram parciais e cinco falharam. Treze continuam não executados. As falhas incluem iniciar sem técnico, concluir direto e reabrir uma OS concluída. A estratégia combina partições, valores limite e tabela de decisão, nos níveis unidade, integração, sistema e aceitação. A aprovação das suítes técnicas isoladas não comprova o aceite dos requisitos.

## 09. SM-01: retorno em garantia — Lucas, 1 min

Marcos Almeida, solicitante simulado da A3, pediu retorno em garantia. A decisão documental foi aprovar parcialmente a alternativa B: abrir uma nova OS ligada à origem concluída, para o mesmo equipamento, dentro de 90 dias. Reabrir a origem violaria RN1. O impacto passou por RF2, RF3, RN2, HU1, critérios CA16 a CA19 e CT19 a CT22. A8R10 entrou em I2, o filtro A8R11 passou para I3 e a confirmação técnica A8R12 ficou adiada. O PR1 registra a revisão e o merge. Entrou na especificação v1.1.0, consolidada em v2.0.0. A garantia não está implementada e a ratificação do PO está pendente.

## 10. Dívidas pagas e próximas correções — Lucas, 45 s

Registramos oito dívidas, com tipo, quadrante, juros, custo e decisão. Duas de documentação foram pagas antes da AS: os requisitos em 714ac8a e a matriz em d62fbe6. Isso reduz ambiguidade e facilita conferir a origem de cada teste. As seis abertas incluem autorização local, estados inválidos, validação de cadastro, modelos, integração e padronização de estados. Segurança e integração têm custo grande e juros altos. Estados e validações devem ser corrigidos antes de ampliar funções.

## 11. Riscos e manutenção após a AS — Lucas, 45 s

Os riscos da A8 têm status atualizado. R1 foi parcialmente mitigado pela delimitação do escopo. R2, acesso indevido, segue com prioridade nove. R3, histórico inconsistente, segue aberto. R4 ainda depende de medição de ambiente. R5 envolve avaliar incorretamente o defeito em garantia. Acrescentamos R6: migração pode perder dados ou quebrar compatibilidade. Arthur cuida de triagem, documentação e C1/C3, Lucas de C2/C4 e testes. Revisão cruzada. As solicitações seguem o fluxo da A14, com impacto, decisão, implementação, teste e versão. Triagem semanal e releases quinzenais quando houver mudanças verificadas.

## 12. Roadmap de evolução — Lucas, 30 s

Agora encerramos e apresentamos o dossiê. Próximo prioriza os Must e os juros altos: autorização, integração, validações e ciclo de estados. A garantia vem no I2 após as dependências e os modelos. Depois entram o filtro por equipamento no I3 e as decisões de confirmação técnica e valores que exigem requisitos e validação. A posição de cada item deriva de valor, risco ou juros, em vez de uma data sem capacidade conhecida.

## 13. Lições aprendidas — Arthur, 1 min

Se começássemos hoje, manteríamos uma fonte única de requisitos desde o início e critérios verificáveis antes de desenhar as telas. Modelaríamos a tabela de estados antes de implementar, para impedir as transições que os testes negativos encontraram. Separaríamos caso especificado, execução parcial e aceite completo em todos os registros. Toda mudança percorreria modelos, código, testes e versões, e a validação humana seria planejada cedo. Arthur liderou a maior parte do trabalho e Lucas apoiou, revisou e aperfeiçoou. Ambos precisam defender qualquer parte do dossiê. O próximo passo de produto é pagar os riscos altos antes de ampliar escopo.

## 14. Rastreabilidade: abertura da OS — Ambos, fora dos 12 min

Abra a matriz no repositório e siga a linha RF2. Na A3, §3 e §4.1 p.2, consulte RF03 a RF05. Em requisitos.md, localize HU1, RF2, CA03 e CA04. Na A9, §2.2 e §2.3, mostre fluxograma e wireframe. A arquitetura A10 divide responsabilidades entre C1, C2 e C4. Na A13, CT03 testa vínculo e CT04 testa abertura. Mostre os resultados parciais e o defeito de integração. Se perguntarem sobre garantia, consulte SM-01, RN2 e a versão v1.1.0.

## 15. Rastreabilidade: garantia e limites — Ambos, fora dos 12 min

A origem da RN2 é a SM-01, não uma fala retroativa na entrevista inicial. O solicitante simulado Marcos Almeida pediu a garantia em 11/11. HU1 e RF2/RF3 recebem a mudança. Mostre o complemento fluxo-garantia.md e a dívida do wireframe. No CT19, OS5 concluída em 01/08/2026, retorno em 30/10 é o dia90. No CT20, 31/10 é o dia91 e deve recusar. CT21 rejeita origem não concluída ou de outro equipamento. CT22 verifica links nos dois sentidos. Todos ainda não executados. Não crie uma história de implementação para preencher a rastreabilidade.

