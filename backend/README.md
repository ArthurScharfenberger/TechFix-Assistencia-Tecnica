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
