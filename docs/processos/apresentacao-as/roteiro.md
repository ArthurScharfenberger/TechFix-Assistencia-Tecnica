# Roteiro AS — dois vídeos, 12 minutos

Cada integrante grava um vídeo com a sua parte. Arthur: slides 1 a 11, cerca de 7 min 30 s. Lucas: slides 12 a 21, cerca de 4 min 30 s. Juntos, os dois vídeos somam os 12 minutos do enunciado. Os slides 2, 19 e 20 são apoio e ficam fora do cronômetro.

## Vídeo 1 — Arthur (slides 1–11)

| Tempo | Slides | Bloco |
|---|---|---|
| 0:00–1:00 | 1 e 3 | Problema e o que mudou desde a AP1 |
| 1:00–2:00 | 4–5 | Mapa do dossiê e versões |
| 2:00–5:00 | 6–8 | Demonstração e plano B |
| 5:00–7:30 | 9–11 | Metas, revisão e resultados dos testes |

## Vídeo 2 — Lucas (slides 12–21)

| Tempo | Slides | Bloco |
|---|---|---|
| 0:00–0:30 | 12 | Cobertura e execução dos testes |
| 0:30–1:30 | 13 | Mudança SM-01 |
| 1:30–3:30 | 14–17 | Dívidas, riscos, roadmap e manutenção |
| 3:30–4:30 | 18 e 21 | Lições e encerramento |

## Dicas de gravação

- As falas abaixo são o texto para ler em voz alta. Os tempos de cada slide já deixam folga para pausas e para passar de slide.
- Grave a tela com os slides em modo apresentação e a sua voz; a câmera é opcional. Fale com calma e mantenha o tempo de cada slide.
- Arthur: na demonstração (slides 6 a 8), mostre o protótipo rodando em localhost:5173 (login admin/admin) ou use as capturas dos próprios slides como plano B.
- Lucas: comece se apresentando e dizendo que continua a partir da cobertura dos testes, para os dois vídeos parecerem uma apresentação só.
- Os dois precisam conhecer o dossiê inteiro: nas perguntas, qualquer um pode ser chamado para o desafio de rastreabilidade (slide 19 e guia-rastreabilidade.md).
- Entrega: Ficha-Entrega-AS.pdf no AVA. Cada um responde sozinho ao formulário sigiloso de participação.

## Falas por slide

### 01. AS: TechFix Assistência Técnica — Arthur, 10 s

Olá! Eu sou o Arthur Scharfenberger e, junto com o Lucas Oliveira da Silva, vou apresentar o dossiê final do TechFix, um sistema para assistências técnicas.

### 02. Roteiro dos 12 minutos — Arthur, opcional, fora do cronômetro

(Opcional, sem contar no tempo.) A apresentação segue sete partes: problema, mapa do dossiê, protótipo, qualidade, mudança, evolução e lições aprendidas.

### 03. Contexto e Stakeholders — Arthur, 50 s

O problema que o TechFix resolve é este: hoje a assistência controla clientes, equipamentos e ordens de serviço em papel e planilhas, e os dados ficam espalhados. O público-alvo são os atendentes da assistência e os técnicos responsáveis pelas ordens de serviço. Os stakeholders são outros papéis: o Marcos Almeida, atendente da nossa entrevista simulada na A3, o Chico Mosca, que é o PO indicado na A7, e também os clientes e a administração da assistência. Desde a AP1, o projeto ganhou critérios mensuráveis, testes rastreados até os requisitos e o retorno em garantia, que entrou pela solicitação de mudança SM-01. Vale deixar claro que a entrevista e a mudança foram simulações declaradas, e a ratificação do PO ainda está pendente.

### 04. O README como Mapa de Navegação — Arthur, 40 s

Quem abre o nosso repositório começa pelo README, que funciona como um mapa. Ele leva às seis pastas do dossiê: contexto, requisitos, planejamento, modelagem, qualidade e evolução. No README também estão o link do protótipo local, a release final v2.0.0, o CHANGELOG e as fichas de entrega. E a matriz de rastreabilidade conecta a origem de cada requisito aos critérios, modelos, componentes, testes e mudanças. Um detalhe: as tags v11 e v12 são da disciplina de POO, não deste dossiê.

### 05. Histórico de Versões do Projeto — Arthur, 20 s

O histórico de versões conta essa evolução. A v1.0.0, de 11 de novembro, é a linha de base, com a revisão e 18 casos de teste. A v1.1.0 trouxe a SM-01, com a regra RN2 e os casos CT19 a CT22. E a v2.0.0, de hoje, fecha o dossiê integrado e o plano de evolução.

### 06. Demonstração: 1. Abrir a OS — Arthur, 60 s

Agora a demonstração. Vou mostrar o fluxo de abertura e consulta de uma ordem de serviço, que atende a história HU1 e o requisito RF2, que é Must, com o critério CA04 e o caso de teste CT04. Na tela Nova ordem, o atendente preenche o título “Notebook não liga”, a descrição “Não liga”, escolhe a cliente Ana Souza e o notebook dela, o EQ-1, que aparece no sistema como TFX-EQP-000001, e clica em Salvar. Repare que esses são os mesmos dados do caso de teste CT04, e não dados genéricos. Só um ponto não é atendido: o CT04 espera que a nova OS receba o número 25, logo depois da 24, e o protótipo gera um identificador próprio. Por isso, registramos esse teste como parcial.

### 07. Demonstração: 2. Confirmar e Consultar — Arthur, 75 s

Depois de clicar em Salvar, o sistema mostra a mensagem “Ordem salva com sucesso”, e a ordem aparece na lista, com a cliente Ana Souza, o equipamento, a prioridade normal e o status Aberto. Em seguida, o atendente clica em Visualizar, no ícone do olho, e abre os detalhes da ordem: cliente Ana Souza, o mesmo notebook, a data de abertura, o estado aberto e o técnico ainda não atribuído. Com isso, o fluxo principal está completo: preencher, salvar e consultar, com o registro gravado e consultável. Cada tela tem uma legenda com o que ela atende: HU1, RF2, CA04 e CT04. Mas somos transparentes sobre os limites: o identificador da ordem não segue a numeração sequencial, e o evento “OS aberta” no histórico não foi verificado. Por isso, não declaramos o requisito inteiro como aprovado. Também é importante dizer que o frontend guarda os dados no navegador e que o Java ainda não está integrado por uma API.

### 08. Demonstração: Vínculo Inválido e Plano B — Arthur, 45 s

Agora, o caminho de erro, do caso de teste CT03. A Ana Souza tenta abrir uma ordem com o equipamento EQ-2, que pertence a outro cliente, o Bruno Lima. A regra protegida é o critério CA03: o equipamento precisa ser do cliente informado. Como a tela já filtra os equipamentos, a tentativa foi enviada direto ao serviço, como no teste. O sistema recusou e mostrou a mensagem “O equipamento selecionado não pertence ao cliente informado”. Contamos as ordens antes e depois: havia uma e continuou uma, então nenhuma OS nova foi criada. E, se o ambiente falhar, o plano B são estas mesmas capturas e a sequência offline que está na pasta de modelagem.

### 09. Plano de Qualidade: Metas com Número — Arthur, 45 s

Passando para a qualidade. Na A11, priorizamos cinco características, e cada uma tem uma meta com número. Adequação funcional: 100% dos casos de teste de alta prioridade. Segurança: 14 de 14 acessos indevidos bloqueados. Confiabilidade: nenhuma gravação parcial em 20 falhas e nenhuma duplicação em 10 reenvios. Desempenho: 95% das respostas em até 2 segundos, com 10 mil ordens e 10 usuários. E capacidade de interação: abrir uma OS em até 1 minuto com cliente cadastrado e em até 3 minutos com cliente novo, medido com 3 participantes. Compatibilidade e manutenibilidade ficaram para depois, com justificativa. São metas planejadas, ainda não comprovadas por completo.

### 10. Revisão: Achados Documentados — Arthur, 45 s

Na revisão da A12, a equipe aceitou 18 achados: 15 foram corrigidos e 3 continuam abertos. O mais grave foi o D01, crítico: a tabela de requisitos trazia registros gerados por IA, e a fonte foi corrigida no commit 714ac8a. Os achados D10 a D12 e D14 completaram a matriz com critérios, origens e referências, no commit d62fbe6. Continuam abertos o D08, o D09 e o D13: a amplitude do RF2, a grafia dos estados e a tela do técnico. E aprendemos uma coisa: corrigir no documento que o e-mail é opcional não corrigiu o código Java, então o defeito DT03 continua aberto na A13.

### 11. Resultados dos Testes — Arthur, 60 s

Na A13, a estratégia de testes usa partições de equivalência, valores limite e tabela de decisão para a regra RN1, nos níveis de unidade, integração, sistema e aceitação, com prioridade para estados e acesso. A tabela mostra os resultados reais. O CT03, do equipamento de outro cliente, passou no cenário. O CT04, de abertura, e o CT05 e o CT08, de iniciar e concluir, ficaram parciais. O CT01 e o CT02, de cadastro, falharam, assim como o CT06, o CT07 e o CT09, que testam transições inválidas, como iniciar sem técnico ou reabrir uma OS concluída. Do CT10 ao CT22, ainda não houve execução. No total, são 22 casos: 1 passou, 3 parciais, 5 falharam e 13 sem execução. A partir daqui, o Lucas continua a apresentação.

### 12. Cobertura e Execução dos Testes — Lucas, 30 s

Olá, eu sou o Lucas Oliveira da Silva e continuo a apresentação do TechFix pela cobertura dos testes. Todos os 8 requisitos Must têm caso de teste definido, e os 19 critérios de aceitação têm um CT associado. Já a execução é menor: 9 dos 22 casos foram executados, e 13 continuam pendentes. Integração, perfis e garantia ainda precisam ser testados.

### 13. SM-01: Retorno em Garantia — Lucas, 60 s

Agora, a mudança. A SM-01 foi uma solicitação do Marcos Almeida, solicitante simulado: permitir o retorno do mesmo equipamento em garantia, em até 90 dias. A decisão foi uma aprovação parcial: em vez de reabrir a OS antiga, o sistema cria uma nova OS vinculada à original, que continua concluída. Assim, a regra RN1, que impede reabrir uma OS concluída, é preservada. O impacto foi documentado: nova regra RN2, ajustes no RF2, no RF3 e na HU1, critérios CA16 a CA19 e casos CT19 a CT22. E toda mudança tem um custo: o item A8R10 entrou no incremento 2, o filtro por equipamento, A8R11, passou para o incremento 3, e a confirmação técnica, A8R12, foi adiada. Essa mudança entrou na versão v1.1.0. A garantia ainda não está implementada, e a ratificação do PO está pendente.

### 14. Dívidas Técnicas Registradas — Lucas, 30 s

Registramos oito dívidas técnicas, classificadas nos quadrantes: deliberada ou inadvertida, prudente ou imprudente. Duas, de documentação, foram pagas antes da AS: a DIV01, dos requisitos, e a DIV02, da matriz. As seis abertas envolvem acesso local, modelos, integração, estados, regras e validações. Segurança e integração têm custo grande e juros altos.

### 15. Riscos Atualizados ao Final do Projeto — Lucas, 30 s

Os riscos também foram atualizados. O R1 está parcialmente mitigado: o escopo foi delimitado, mas a validação ainda depende do PO. O R2 e o R3, de acesso local e histórico inconsistente, continuam abertos. O R4 depende de medir o ambiente, e o R5 é evitar garantia para um defeito diferente. E surgiu um risco novo, o R6: perder dados na migração.

### 16. Roadmap: O Que Vem a Seguir — Lucas, 35 s

No roadmap, o “agora” é o dossiê v2.0.0, com as dívidas de documentação pagas. Em seguida, o incremento 1 trata acesso, cadastro e integração, que têm os maiores riscos e juros, e o incremento 2 traz estados, modelos e a garantia. Depois vêm o filtro por equipamento, que cedeu lugar à garantia, e a decisão sobre a confirmação técnica. Cada item só avança com implementação, revisão, testes e aceite.

### 17. Plano de Manutenção Após a Entrega — Lucas, 25 s

Para a manutenção, o Arthur cuida da triagem e dos componentes C1 e C3, e eu, dos componentes C2 e C4 e dos testes, sempre com revisão cruzada. Cada pedido segue o fluxo: issue, análise de impacto, decisão do PO, pull request com revisão e testes, e release. Temos exemplos dos quatro tipos de manutenção, triagem semanal e releases quinzenais.

### 18. Se Começássemos de Novo — Lucas, 50 s

E as lições aprendidas. Se começássemos de novo, escreveríamos os casos negativos das regras de estado junto com os critérios de aceitação. Os testes CT06, CT07 e CT09 mostraram que o sistema permitia transições indevidas, como iniciar uma OS sem técnico ou reabrir uma OS concluída. Se essas regras tivessem sido modeladas antes do código, teríamos evitado retrabalho. Também separaríamos, desde o início, caso especificado, execução parcial e aceite completo. O aprendizado concreto é ligar cada mudança ao requisito, ao teste e à evidência de execução.

### 19. Desafio de Rastreabilidade ao Vivo — Lucas, apoio, fora do cronômetro

(Para as perguntas, se a professora pedir o desafio.) Vou mostrar o caminho completo da abertura da OS. A origem está na entrevista da A3, seções 3 e 4.1, que gerou a história HU1. O requisito é o RF2, Must, com os critérios CA03, do vínculo, e CA04, da abertura. O modelo está na A9, no fluxograma e no wireframe, e os componentes estão na A10: C1, C2 e C4. Os casos de teste são o CT03, que passou, e o CT04, parcial. E a mudança é a SM-01, com a RN2, que entrou na versão v1.1.0.

### 20. Checklist da Entrega: Conteúdo Conferido — Lucas, apoio, fora do cronômetro

(Não entra no vídeo.)

### 21. Encerramento — Lucas, 10 s

O dossiê completo está no repositório, na release v2.0.0. Obrigado pela atenção!

