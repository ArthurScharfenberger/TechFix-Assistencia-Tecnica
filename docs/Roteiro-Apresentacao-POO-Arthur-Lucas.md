# Roteiro de apresentação do TechFix

Apresentadores: Arthur Scharfenberger e Lucas Oliveira da Silva.

Duração planejada: aproximadamente 6 minutos, incluindo pequenas pausas e a troca de apresentador. Limite: 7 minutos. As falas somam 571 palavras. Ensaiem com cronômetro; os tempos abaixo são referências, não garantias.

Lucas apresenta os slides 2, 3, 4 e 5. Arthur apresenta os slides 6, 7, 8, 9 e 10 e faz a abertura do slide 1.

## Arthur — abertura

### Slide 1 — Apresentação do projeto

Tempo reservado: 20 segundos.

“Boa tarde. Eu sou o Arthur e este é o Lucas. Nosso projeto é o TechFix, uma assistência técnica para notebooks e PCs. Vamos apresentar a evolução do modelo Java e os conceitos de orientação a objetos usados em cada etapa. O Lucas começa explicando a estrutura inicial.”

## Lucas — slides 2 a 5

### Slide 2 — Estrutura inicial

Tempo reservado: 25 segundos.

“Começamos com quatro classes principais: Cliente, Técnico, Equipamento e OrdemServico. O cliente solicita o atendimento, o técnico realiza o serviço e o equipamento representa o notebook ou PC recebido. A ordem de serviço relaciona esses objetos e registra o status do atendimento. Essa foi a base dos próximos incrementos.”

### Slide 3 — Evolução do projeto

Tempo reservado: 25 segundos.

“A evolução seguiu as necessidades do projeto. Na atividade 6, usamos coleções para organizar as ordens dos clientes. Na 7, trabalhamos a composição dos itens de serviço. Na 8, aplicamos herança aos equipamentos. Na 9, introduzimos interface e polimorfismo nos roteiros de diagnóstico. A AP2 reúne esses incrementos.”

### Slide 4 — Coleções

Tempo reservado: 35 segundos.

“Um cliente pode ter vários atendimentos. Por isso, Cliente possui uma List de ordens de serviço, implementada com ArrayList. A coleção é inicializada no atributo, e o método adicionarOrdemServico inclui novas ordens. Antes da inclusão, ele rejeita uma referência nula com IllegalArgumentException. Essa rejeição é verificada por um teste automatizado. Assim, representamos a multiplicidade de atendimentos do cliente.”

### Slide 5 — Composição

Tempo reservado: 40 segundos, incluindo a passagem para Arthur.

“Na composição, OrdemServico representa o todo, e ItemServico representa cada serviço com descrição e valor. A ordem controla a criação dos itens. No código atual, ItemServico é uma classe aninhada estática com construtor privado. O método adicionarItemServico cria os itens, e getItensServico retorna uma cópia imutável da lista. Agora o Arthur explica a herança e o polimorfismo.”

## Arthur — slides 6 a 10

### Slide 6 — Herança

Tempo reservado: 45 segundos.

“Notebook e Desktop compartilham tipo, marca e defeito. Esses dados e suas validações ficam na superclasse abstrata Equipamento. As subclasses usam extends e chamam super no construtor para reutilizar essa estrutura. Notebook acrescenta a quantidade de RAM; Desktop informa se possui vídeo dedicado. Ambos sobrescrevem descreverAtendimento com Override para acrescentar sua característica à descrição comum. Nos exemplos, temos um notebook de 16 GB e um desktop com vídeo dedicado.”

### Slide 7 — Interface e roteiro de diagnóstico

Tempo reservado: 45 segundos.

“O roteiro precisa variar conforme o equipamento. A interface RoteiroDiagnostico define gerarRoteiroDiagnostico, que retorna uma lista de etapas. Equipamento implementa o contrato, e Notebook e Desktop fornecem as implementações concretas. O notebook orienta verificações de fonte, RAM, armazenamento e refrigeração. O desktop inclui fonte, cabos internos, placa-mãe e configuração de vídeo. O método fornece orientações ao técnico; ele não executa o diagnóstico físico.”

### Slide 8 — Polimorfismo em execução

Tempo reservado: 45 segundos.

“Aqui usamos uma List de RoteiroDiagnostico com um notebook e um desktop. O laço faz a mesma chamada para os dois, mas cada objeto executa sua própria implementação. Isso demonstra polimorfismo. OrdemServico também consulta o contrato sem usar instanceof para escolher o roteiro. Neste exemplo, o desktop retorna a etapa de vídeo dedicado. Para vídeo integrado, a última etapa muda conforme a configuração do objeto.”

### Slide 9 — Testes

Tempo reservado: 45 segundos.

“A versão atual passou em 14 testes: quatro em EquipamentoTest, quatro em OrdemServicoTest e seis em RoteiroDiagnosticoTest. Eles verificam descrições, dados herdados, validações, status da ordem e etapas dos roteiros. Também verificam o despacho polimórfico, a lista imutável, a repetição da consulta e a integração com a ordem sem alterar seu status. Após recompilar o projeto, tivemos zero falhas e zero erros.”

### Slide 10 — Encerramento

Tempo reservado: 35 segundos.

“As coleções organizaram as ordens, a composição estruturou os itens, a herança compartilhou dados e validações, e o polimorfismo permitiu consultar diferentes roteiros pelo mesmo contrato. A integração apresentada acontece entre os objetos Java; a interface web é uma implementação separada. Essa é a evolução do TechFix que reunimos na AP2. Obrigado.”

## Controle do tempo

| Apresentador | Slides | Tempo reservado |
| --- | --- | --- |
| Arthur | 1 — abertura | 20 segundos |
| Lucas | 2, 3, 4 e 5 | 2 minutos e 5 segundos |
| Arthur | 6, 7, 8, 9 e 10 | 3 minutos e 35 segundos |
| Total | 10 slides | 6 minutos |

Não leiam o código linha por linha nem repitam todos os textos dos diagramas. Apontem o elemento citado e continuem a fala. Ao terminar o slide 5, o cronômetro deve estar próximo de 2 minutos e 25 segundos. Se estiverem atrasados, reduzam as pausas e omitam os exemplos de configuração de vídeo dos slides 6 e 8.
