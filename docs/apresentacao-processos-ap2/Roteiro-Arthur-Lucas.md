# Roteiro AP2 — Processos de Engenharia de Software

Meta: 11 minutos de exposição + 4 minutos para perguntas. Slides 14–16 apenas como apoio.

## 01 • TechFix — Arthur (20 s)

Somos Arthur e Lucas. Nesta AP2 de Processos de Engenharia de Software, vamos mostrar como organizamos o trabalho e como processo, planejamento, modelos e arquitetura se conectam. Vamos usar a abertura de uma ordem de serviço como exemplo ao longo da apresentação.

Fonte: A7-Processo-Entrega-Final.md; A8-Entrega-Final-Revisada.md; Modelagem-Entrega-Final.md; A10-Arquitetura-Rastreabilidade-Final.md

## 02 • O problema e os requisitos da AP1 — Arthur (40 s)

A descoberta foi documentada na A3 como entrevista semiestruturada simulada com Marcos Almeida, atendente. O problema é o atendimento registrado em papel ou planilhas, que dificulta localizar informações e acompanhar o serviço. RF03, RF04 e RF05 da A3 tratam de OS, estado e técnico responsável. A4 consolida as necessidades e A5 refina critérios e prioridades. A numeração mudou: RF03 na A3 trata de OS; RF3 na A4/A5 trata de consulta e histórico. A AP2 organiza como construir essa solução.

Fonte: Atividade_03_Levantamento_Requisitos_TechFix.pdf, p. 1–2, §3 e §4.1; docs/Atividade04.md, RE1–RE3; A5 §2.2.2

## 03 • A7  Processo e papéis — Arthur (60 s)

A A2 escolheu desenvolvimento incremental com práticas ágeis, e confirmamos o ciclo iterativo e incremental. Na A7 definimos Scrum, com Sprints planejadas de uma semana. Essa cadência permite selecionar trabalho conforme nossa disponibilidade e revisar o resultado. Eu acumulo Scrum Master e desenvolvimento. Lucas também desenvolve, participa das estimativas e revisa minhas alterações; eu reviso as dele. Chico Mosca representa a assistência como Product Owner, ordenando necessidades e validando o resultado de negócio. A divisão inicial dá foco à interface para mim e às regras e persistência para Lucas, mas ambos precisam compreender o sistema. Não estamos afirmando um histórico de Sprints executadas.

Fonte: docs/entregas-processos/atividade02-12-08.pdf, seção 2; A7-Processo-Entrega-Final.md, 2.1–2.3

## 04 • A7  Fluxo e critério de conclusão — Lucas (50 s)

A tarefa nasce de um requisito e entra no backlog. No planejamento selecionamos o que cabe na Sprint e definimos executor e revisor. Depois vêm desenvolvimento, revisão pelo colega e verificação. A tarefa só fica pronta tecnicamente quando atende aos critérios de aceitação, tem revisão registrada, testes pertinentes e documentação atualizada. Na validação, Chico observa o resultado apresentado pela interface. Conclusão técnica e validação de negócio são registros diferentes. Se houver falha, corrigimos; se surgir uma nova necessidade, ela volta ao backlog. Isso aplica a melhoria que Arthur propôs na A6: revisar antes de dar algo por concluído.

Fonte: A7-Processo-Entrega-Final.md, 2.4–2.5; Atividade_06_Reflexao_Individual_Arthur_Scharfenberger.pdf, plano de melhoria

## 05 • A8  Backlog e incrementos de valor — Lucas (60 s)

O backlog revisado tem nove itens e cobre os oito requisitos e histórias priorizados na A5. O primeiro incremento permite receber e localizar um atendimento: acesso por perfil, cadastro, abertura, consulta por número e histórico inicial. O segundo permite acompanhar e concluir o serviço: atribuição ao técnico, início e conclusão, buscas complementares e comprovação de desempenho. São recortes de valor ao usuário e podem ocupar várias Sprints. O histórico começa no I1 e acompanha as atualizações do I2. Pagamento online, avaliação e relatório gerencial ficaram fora desta linha de base porque não têm requisito correspondente na A5.

Fonte: A8-Entrega-Final-Revisada.md, 2.1–2.2, 2.4 e 2.6

## 06 • A8  Estimativas relativas — Lucas (55 s)

Usamos tamanhos P, M e G. A busca exata por número, A8R04, é a referência P. Um cadastro com validações e relacionamento, como A8R02, é M. Autorização e desempenho são G porque têm incerteza e exigem verificação transversal. O tamanho inclui interface, regras, armazenamento e verificação, sem equivalência fixa em horas. O I1 reúne um P, três M e um G; o I2 reúne três M e um G. Os valores nos documentos ainda são propostas. Para registrar consenso, cada um estima separadamente, comparamos as diferenças e registramos o argumento do acordo. Não devemos afirmar que isso já ocorreu sem esse registro.

Fonte: A8-Entrega-Final-Revisada.md, 2.2–2.4; Registro-Revisao-Equipe.md

## 07 • A8  Riscos e mitigação — Lucas (60 s)

Classificamos probabilidade e impacto de um a três. O produto define o nível: um a dois é baixo, três a quatro moderado e seis a nove alto. O risco de acesso indevido tem nove porque o login atual é local no navegador e não comprova segurança no servidor. A mitigação é autorização no servidor e teste de acesso direto, bloqueando implantação enquanto falhar. Perder histórico tem seis: mudança da OS e evento devem ser gravados juntos. O risco de desempenho tem quatro; exige massa de até dez mil OS e medição por operação. O risco de escopo tem nove e é tratado mantendo o vínculo A5 e backlog. Responsáveis propostos: Arthur em escopo e acesso, Lucas em histórico e desempenho.

Fonte: A8-Entrega-Final-Revisada.md, 2.5

## 08 • A9  Fluxograma da abertura de OS — Arthur (55 s)

Modelamos A8R02 e A8R03 porque cadastro e abertura iniciam o atendimento. Este slide reorganiza para leitura o fluxo da A9. Primeiro o atendente precisa de identidade e permissão válidas. Depois seleciona ou cadastra cliente e equipamento, com validação de obrigatórios e vínculo. A confirmação grava OS e evento inicial de histórico juntos. Só o sucesso apresenta número, data e estado ABERTA. A utilidade do fluxograma é explicitar decisões e exceções: negar acesso, corrigir campos e preservar dados se a gravação falhar. O esboço trazia principalmente o caminho de sucesso; a versão final inclui esses retornos.

Fonte: Modelagem-Entrega-Final.md, 2.1–2.2 e 2.5; final-fluxograma.png

## 09 • A9  Wireframe da tela Nova OS — Arthur (55 s)

O wireframe mostra onde o atendente realiza o fluxo. Ele seleciona o cliente e vê somente equipamentos vinculados a esse cliente. Se necessário, usa o cadastro rápido com nome, telefone, tipo e defeito. Número, data e estado são gerados pelo sistema. No sucesso, a tela apresenta o protocolo; na falha, mantém o formulário. Este desenho ajuda a discutir campos e mensagens com o PO antes da implementação integrada. Fluxograma e wireframe são complementares: um mostra sequência e exceções, o outro mostra a interação. Os textos de sucesso e falha neste modelo são estados alternativos.

Fonte: Modelagem-Entrega-Final.md, 2.3–2.4; final-wireframe.png

## 10 • A10  Arquitetura conceitual — Lucas (65 s)

A arquitetura tem quatro responsabilidades. C1 é a interface. C2 recebe operações e aplica as regras. C3 identifica o usuário e verifica permissões no servidor. C4 persiste os dados e o histórico. A interface chama a API, a API consulta a autorização e só então executa a operação. A interface não acessa diretamente o banco. Na abertura, OS e evento inicial precisam ser gravados na mesma transação. A divisão permite trabalhar em componentes diferentes e fazer revisão cruzada, como pede a A7. Não exige microsserviços; os componentes podem estar na mesma aplicação. Hoje o frontend usa armazenamento local e o Java executa separadamente. API, autenticação de servidor, banco e integração são propostos.

Fonte: A10-Arquitetura-Rastreabilidade-Final.md, 2.2–2.4 e 2.7; A10-Arquitetura.svg

## 11 • A10  Caminho de um requisito — Arthur (70 s)

Vamos percorrer RF2 desde a origem. Na A3, página 2, seção 3, o resumo da entrevista simulada com Marcos Almeida registra OS, estados e técnico responsável. A seção 4.1 os identifica como RF03, RF04 e RF05. A A4 consolida a necessidade em RE2, RF2 e RN1; HU1 e HU2 representam atendente e técnico. A A5 refina critérios e prioridades. No backlog, A8R03 abre a OS no I1; A8R06 e A8R07 tratam de início e conclusão no I2. A9 detalha abertura com fluxograma e wireframe. A10 atribui à interface a interação, à lógica a criação e o ciclo, à autorização o controle de acesso e à persistência a OS e os eventos. Esse caminho permite verificar de onde vem o trabalho e por que os componentes existem. A simulação da A3 é a origem documental, não uma entrevista real comprovada.

Fonte: Atividade_03_Levantamento_Requisitos_TechFix.pdf, p. 2, §3 e §4.1 RF03–RF05 → docs/Atividade04.md RE2/RF2/RN1/HU1/HU2 → A5 §2.2.2 → A8 §2.2 R03/R06/R07 → Modelagem §2.2–2.3 → A10 §2.5

## 12 • Situação atual e próximos passos na AS — Lucas (50 s)

O protótipo já permite demonstrar a interface com armazenamento local, e as classes Java representam parte do domínio. A integração completa ainda precisa ser construída. Na AS, vamos transformar os critérios em testes: cadastro inválido, vínculo de equipamento, estados da OS, falha de gravação e autorização por perfil. Para RNF1, a meta é pelo menos noventa e cinco por cento das operações em até dois segundos, com base de até dez mil OS. Devemos registrar ambiente e cenário; os dez usuários simultâneos e cem operações por fluxo são parâmetros propostos, ainda a confirmar. A evolução precisa manter a rastreabilidade e corrigir falhas antes da implantação.

Fonte: A8 2.4–2.5; A10 2.6–2.7; A7 2.5

## 13 • As quatro peças se conectam — Arthur e Lucas (20 s)

Arthur: O processo define como trabalhamos e verificamos a qualidade. O planejamento seleciona o que entrega valor. Lucas: Os modelos explicam o comportamento esperado, e a arquitetura distribui as responsabilidades. Na AS, os critérios viram evidências de qualidade e testes. Estamos disponíveis para as perguntas.

Fonte: Síntese das atividades A7, A8, A9 e A10

## Perguntas para o ensaio

### Por que Scrum combina com a A2?

A2 define o ciclo iterativo e incremental. A7 concretiza ciclos curtos, objetivo de Sprint, trabalho selecionado, revisão e retrospectiva. I1/I2 recortam valor e podem ocupar mais de uma Sprint. A cadência semanal foi planejada; não afirmar que Sprints já ocorreram.

### Com só dois integrantes, quem revisa?

Arthur revisa Lucas e Lucas revisa Arthur. Focos técnicos não criam áreas exclusivas. Arthur acumula Scrum Master e desenvolvimento; o PO trata das prioridades e validação de negócio. Agenda e disponibilidade do PO precisam ser combinadas.

### Pronto significa aprovado pelo PO?

A DoD registra a conclusão técnica: critérios, revisão, testes e documentação. A validação de negócio observa o fluxo demonstrado e gera aceite ou ajustes separados. Falta de feedback não equivale a aprovação.

### Por que os incrementos têm valor?

I1 permite receber e encontrar um atendimento completo; I2 permite acompanhar e concluir. Cada fatia inclui interface, regra, armazenamento e verificação. Entregar uma classe isolada não demonstra valor ao atendente.

### Como chegaram a P, M e G?

A8R04 é a referência P. Cadastros e relações são M; autorização e desempenho são G pela incerteza e verificação transversal. Não há equivalência fixa em horas. A tabela ainda é proposta até a dupla registrar suas estimativas e o argumento do consenso.

### De onde vêm os riscos 9, 6 e 4?

Probabilidade e impacto variam de 1 a 3; multiplicamos. Escopo e acesso: 3×3=9; histórico: 2×3=6; desempenho: 2×2=4. Alto significa 6–9. O login local é evidência atual para o risco de acesso.

### Por que usar fluxograma e wireframe?

O fluxograma mostra sequência, condições e erros. O wireframe mostra seleção, campos e mensagens. Juntos, permitem validar comportamento antes da integração. Cobrem cadastro e abertura; a tela específica do técnico ainda precisa ser detalhada.

### Mostrem a origem de RF2.

Abrir a A3, p. 2, §3 e §4.1: RF03, RF04 e RF05. Seguir A4 RE2 → RF2/RN1 e HU1/HU2 → A8R03/06/07 → A9 §2.2/2.3 → C1/C2/C3/C4. A3 documenta simulação com Marcos Almeida. Não confundir RF03 da A3 com RF3 da A4/A5.

### A arquitetura exige microsserviços?

Não. São responsabilidades conceituais. API/regras, autorização e persistência podem estar na mesma aplicação. A interface chama a API; a API verifica permissão e acessa persistência. As respostas retornam a quem solicitou.

### O que acontece se gravar a OS e falhar o histórico?

A proposta é gravar os dois na mesma transação: confirmar ambos ou desfazer ambos. A interface preserva dados sem exibir sucesso falso. Reenvio deve reutilizar a identificação da operação para evitar duplicação.

### Por que o login do protótipo não resolve RNF2?

Dados e login locais no navegador não comprovam controle no servidor. A proposta verifica perfil em cada operação protegida e testa chamada direta à API, inclusive leitura ou alteração indevida de dados administrativos e valores.

### Como comprovar RNF1?

Medir operações principais com base de até 10.000 OS e registrar ambiente/cenário. Pelo menos 95% devem levar até 2 segundos. Dez usuários concorrentes e cem operações por fluxo são parâmetros propostos, ainda a confirmar; não são resultados já obtidos.

### O que mudou com o feedback?

A8 retirou itens sem requisito aprovado, explicitou tamanhos/riscos e preservou 10.000 OS. A10 ganhou diagrama e matriz com oito requisitos, vínculos com A7 e testes derivados. A3 fornecida permitiu completar a origem por página, seção e ID.

### O que está implementado e o que fica para AS?

Há interface com armazenamento local e classes Java executadas separadamente. API, autorização no servidor, banco e integração descritos na arquitetura são propostos. AS deve integrar, testar regras/falhas/desempenho e registrar evidências.

### Marcos e Chico são a mesma pessoa?

Não. Marcos Almeida é o atendente da entrevista simulada documentada na A3. Chico Mosca foi indicado como PO no planejamento A7 a partir do feedback. Não atribuir a Chico respostas da simulação nem afirmar validação real não registrada.
