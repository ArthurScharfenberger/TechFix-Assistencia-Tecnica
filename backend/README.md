# Backend Java — TechFix

Esta pasta isola a atividade de Programação Orientada a Objetos do frontend do TechFix.

Neste momento, o termo `backend` identifica apenas a área reservada ao código Java acadêmico. Ainda não existe um servidor: não há API REST, banco de dados, endpoints, Spring ou comunicação com o frontend TypeScript. O Maven é usado para compilar o projeto e executar os testes JUnit.

## Conteúdo

```text
backend/
├── pom.xml
├── README.md
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

Consulte a [documentação do código-fonte](src/README.md) para conhecer as classes e os comandos de compilação, teste e execução.

O modelo visual correspondente está na [documentação do diagrama de classes](../Diagrama-Classes/README.md).

## Organização da apresentação

Para a apresentação do projeto, a equipe escolheu quatro classes principais:

- `Cliente`;
- `Tecnico`;
- `Equipamento`;
- `OrdemServico`.

A classe `Main` será utilizada para demonstrar a criação dos objetos e o funcionamento do cenário completo. Os enums `TipoEquipamento` e `StatusOrdemServico` continuam fazendo parte do código, mas serão apresentados apenas como tipos auxiliares das classes principais.

A saída no terminal também foi organizada em seções para facilitar a leitura durante a demonstração. Os dados do cliente, do técnico e do equipamento são exibidos em blocos separados, seguidos pelo status da ordem de serviço. Depois, o programa apresenta de forma resumida a mudança de `ABERTA` para `EM_ATENDIMENTO`, evitando repetir todas as informações.

O uso de inteligência artificial durante a preparação está registrado em [IA.md](IA.md).
