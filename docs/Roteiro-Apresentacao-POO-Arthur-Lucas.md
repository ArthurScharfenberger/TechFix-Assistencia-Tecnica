# Roteiro de apresentação do TechFix

Apresentadores: Arthur Scharfenberger e Lucas Oliveira da Silva.

Duração planejada: 6 minutos e 20 segundos, incluindo um minuto para testes e demonstração Java ao vivo. Reservem os 40 segundos restantes do limite de sete minutos para pequenas pausas ou demora de execução. Ensaiem no computador da apresentação; os tempos são referências.

Lucas apresenta os slides 2 a 5. Arthur faz a abertura e apresenta os slides 6 a 10.

## Arthur — abertura

### Slide 1 — Apresentação do projeto

Tempo reservado: 15 segundos.

“Boa tarde. Eu sou o Arthur e este é o Lucas. O TechFix representa uma assistência técnica para notebooks e PCs. Vamos mostrar a evolução do modelo Java, os conceitos de POO e uma execução ao vivo.”

## Lucas — slides 2 a 5

### Slide 2 — Estrutura inicial

Tempo reservado: 25 segundos.

“A base tem Cliente, Técnico, Equipamento e OrdemServico. O cliente solicita o atendimento, o técnico executa o serviço e o equipamento recebe o reparo. A ordem relaciona esses objetos e registra o status. Essa estrutura foi ampliada nas atividades seguintes.”

### Slide 3 — Evolução do projeto

Tempo reservado: 20 segundos.

“Na atividade 6, organizamos as ordens em coleções. Na 7, modelamos a composição dos itens. Na 8, especializamos os equipamentos com herança. Na 9, usamos interface e polimorfismo para variar o roteiro de diagnóstico. A AP2 reúne esses incrementos.”

### Slide 4 — Coleções

Tempo reservado: 30 segundos.

“Cliente mantém uma List de ordens, implementada com ArrayList. Isso permite representar vários atendimentos sem criar um atributo para cada ordem. A coleção começa vazia, por isso a multiplicidade é zero ou muitas ordens. O método de inclusão rejeita null, e um teste verifica essa regra.”

### Slide 5 — Composição

Tempo reservado: 35 segundos, incluindo a troca de apresentador.

“OrdemServico é o todo e ItemServico representa cada serviço, com descrição e valor. A ordem controla a criação dos itens. ItemServico é uma classe aninhada estática com construtor privado, e a consulta devolve uma lista imutável. Isso protege a coleção contra alterações externas. Agora o Arthur explica os equipamentos.”

## Arthur — slides 6 a 10

### Slide 6 — Herança

Tempo reservado: 35 segundos.

“Notebook e Desktop são tipos de Equipamento. A superclasse abstrata centraliza tipo, marca, defeito e validações. As subclasses reutilizam essa estrutura com extends e super. Notebook acrescenta RAM, e Desktop acrescenta a configuração de vídeo. Ambos sobrescrevem descreverAtendimento para incluir sua característica na descrição.”

### Slide 7 — Interface e roteiro de diagnóstico

Tempo reservado: 35 segundos.

“RoteiroDiagnostico define o contrato gerarRoteiroDiagnostico. Equipamento implementa a interface e as subclasses fornecem as etapas concretas. O notebook orienta verificações de fonte, RAM e armazenamento. O desktop inclui cabos internos, placa-mãe e vídeo. São orientações ao técnico; o programa não executa o diagnóstico físico.”

### Slide 8 — Polimorfismo em execução

Tempo reservado: 35 segundos.

“A lista usa referências RoteiroDiagnostico para notebook e desktop. Fazemos a mesma chamada, mas cada objeto executa sua implementação. OrdemServico também consulta esse contrato, sem escolher o tipo com instanceof. Isso permite variar o comportamento mantendo a mesma forma de uso.”

### Slide 9 — Testes

Tempo reservado: 35 segundos de fala e 60 segundos de execução ao vivo.

“São 14 testes Java: quatro de equipamentos, quatro de cliente e ordem e seis de roteiros. Eles verificam herança, validações, status, etapas, despacho polimórfico, lista imutável e consulta sem efeitos colaterais. Agora vamos recompilar e executar os testes, e depois demonstrar o cenário integrado.”

Arthur executa os comandos abaixo na raiz do projeto, um de cada vez. Lucas deixa o terminal preparado antes da apresentação.

```powershell
.\Testar-POO.cmd --sem-pausa
java -cp backend/target/classes Main
```

Após os testes passarem, Arthur diz: “Nesta execução, os 14 testes passaram. A Main cria os objetos, consulta o roteiro pela ordem, muda o status e percorre notebook e desktop pela mesma interface.” Apontem os resultados por grupo e os roteiros; não leiam todas as linhas. Se houver falha, leiam o erro e não anunciem aprovação.

### Slide 10 — Encerramento

Tempo reservado: 20 segundos.

“Coleções organizaram as ordens, composição estruturou os itens, herança compartilhou dados e polimorfismo variou os roteiros. O cenário demonstrado integra objetos Java. A interface web é uma implementação separada. Essa é a evolução do TechFix na AP2. Obrigado.”

## Controle do tempo

| Apresentador | Slides | Tempo reservado |
| --- | --- | --- |
| Arthur | 1 — abertura | 15 segundos |
| Lucas | 2 a 5 | 1 minuto e 50 segundos |
| Arthur | 6 a 10 — falas | 2 minutos e 40 segundos |
| Arthur e Lucas | Slide 9 — execução ao vivo | 1 minuto |
| Ambos | Trocas de tela e pequenas pausas | 35 segundos |
| Total | Slides e demonstração | 6 minutos e 20 segundos |

Ao terminar o slide 5, o cronômetro deve estar próximo de dois minutos. Não leiam o código linha por linha. Preparem o Maven com internet e testem o modo offline antes da aula, conforme `docs/Executar-Testes-Na-Apresentacao.md`. Mantenham slides, terminal e projeto abertos. Os testes e a Main usam Java; não é necessário abrir o site para demonstrar esses conceitos.
