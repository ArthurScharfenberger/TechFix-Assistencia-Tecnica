# Diagrama de Classes — Implementação Java

Este documento descreve o diagrama de classes correspondente à implementação básica em Java do TechFix. As classes estão em [`backend/src`](../backend/src/README.md) e utilizam somente recursos da linguagem Java, sem frameworks, banco de dados ou integração com o frontend.

## Diagrama atual

O diagrama abaixo corresponde ao código da Atividade Semanal nº 3:

```mermaid
classDiagram
    class Cliente {
        -String nome
        -String telefone
        -String email
        +Cliente(nome, telefone, email)
        +exibirDados() void
        +getNome() String
    }
    class Tecnico {
        -String nome
        -String especialidade
        +Tecnico(nome, especialidade)
        +exibirDados() void
        +getNome() String
    }
    class Equipamento {
        -TipoEquipamento tipo
        -String marca
        -String defeito
        +Equipamento(tipo, marca, defeito)
        +exibirDados() void
    }
    class OrdemServico {
        -int numero
        -Cliente cliente
        -Tecnico tecnico
        -Equipamento equipamento
        -StatusOrdemServico status
        +OrdemServico(numero, cliente, tecnico, equipamento)
        +alterarStatus(novoStatus) void
        +getStatus() StatusOrdemServico
        +exibirOrdemServico() void
    }
    class TipoEquipamento {
        <<enumeration>>
        NOTEBOOK
        DESKTOP
        CELULAR
        OUTRO
    }
    class StatusOrdemServico {
        <<enumeration>>
        ABERTA
        EM_ATENDIMENTO
        CONCLUIDA
    }

    Cliente "1" <-- "0..*" OrdemServico : solicita
    Tecnico "1" <-- "0..*" OrdemServico : atende
    Equipamento "1" <-- "0..*" OrdemServico : refere-se a
    Equipamento --> TipoEquipamento : tipo
    OrdemServico --> StatusOrdemServico : status
```

## Imagem da etapa anterior

![Diagrama de Classes do TechFix](./DiagramaClasses.png)

A imagem foi preservada como registro da etapa anterior, quando `Equipamento.tipo` e `OrdemServico.status` ainda eram textos. No diagrama atual, o sinal `-` representa atributos privados e o sinal `+` representa construtores e métodos públicos. As multiplicidades mostram quantas instâncias podem participar de cada associação.

## Classes documentadas

### Cliente

Representa a pessoa que solicita o atendimento. Armazena `nome`, `telefone` e `email`. O método `exibirDados()` apresenta essas informações, enquanto `getNome()` retorna o nome do cliente.

### Tecnico

Representa o profissional responsável pelo atendimento. Armazena `nome` e `especialidade`. O método `exibirDados()` apresenta os dados profissionais e `getNome()` retorna o nome do técnico.

### Equipamento

Representa o item encaminhado à assistência técnica. Armazena `tipo`, `marca` e `defeito`. O método `exibirDados()` apresenta os dados do equipamento.

### OrdemServico

Centraliza o atendimento. Armazena o `numero`, as referências para `cliente`, `tecnico` e `equipamento`, além do `status`. Seu construtor define o status inicial como `ABERTA`. O método `alterarStatus()` atualiza essa situação, `getStatus()` retorna o estado atual e `exibirOrdemServico()` apresenta todos os dados relacionados.

## Relacionamentos e multiplicidades

Cada `OrdemServico` está associada exatamente a:

- um `Cliente`;
- um `Tecnico`;
- um `Equipamento`.

Ao longo do tempo, cada cliente, técnico ou equipamento pode estar associado a zero ou várias ordens de serviço (`0..*`). Isso expressa uma associação entre os objetos, implementada pelas referências armazenadas dentro de `OrdemServico`.

O diagrama usa os verbos **solicita**, **atende** e **refere-se a** para esclarecer o papel de cada classe na relação com a ordem.

## Classe Main

`Main` não aparece no diagrama porque não representa uma entidade do domínio. Ela serve como ponto de entrada para demonstrar a criação de um cliente, um técnico, um equipamento e uma ordem, além da consulta e alteração de status.

## Organização realizada

A atividade Java foi isolada do frontend na estrutura abaixo:

```text
backend/
├── pom.xml
└── src/
    ├── README.md
    ├── main/java/
    │   ├── Cliente.java
    │   ├── Equipamento.java
    │   ├── Main.java
    │   ├── OrdemServico.java
    │   ├── StatusOrdemServico.java
    │   ├── Tecnico.java
    │   └── TipoEquipamento.java
    └── test/java/
        └── OrdemServicoTest.java
```

A implementação permanece sem declarações de `package`, Spring, banco de dados ou API. O Maven foi adicionado para compilar o projeto e executar os testes JUnit 5. Os fontes principais foram validados com JDK 17.0.10 por meio da compilação com `javac` e da execução de `Main`.
