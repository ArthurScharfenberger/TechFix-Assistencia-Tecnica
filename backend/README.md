# Backend Java — TechFix

Esta pasta isola a atividade de Programação Orientada a Objetos do frontend do TechFix.

Neste momento, o termo `backend` identifica apenas a área reservada ao código Java acadêmico. Ainda não existe um servidor: não há API REST, banco de dados, endpoints, Spring ou comunicação com o frontend TypeScript. O Maven é usado para compilar o projeto e executar os testes JUnit.

## Conteúdo

```text
backend/
├── docs/
│   ├── atividade-semanal-06-esboco.md
│   ├── Ficha_Padrao_Entrega_Atividade_06_Esboco.docx
│   └── Ficha_Padrao_Entrega_Atividade_06_Esboco.pdf
├── pom.xml
├── README.md
└── src/
    ├── README.md
    ├── main/java/
    │   ├── Cliente.java
    │   ├── Desktop.java
    │   ├── Equipamento.java
    │   ├── Main.java
    │   ├── Notebook.java
    │   ├── OrdemServico.java
    │   ├── RoteiroDiagnostico.java
    │   ├── StatusOrdemServico.java
    │   ├── Tecnico.java
    │   └── TipoEquipamento.java
    └── test/java/
        ├── EquipamentoTest.java
        ├── OrdemServicoTest.java
        └── RoteiroDiagnosticoTest.java
```

Consulte a [documentação do código-fonte](src/README.md) para conhecer as classes e os comandos de compilação, teste e execução.

O modelo visual correspondente está na [documentação do diagrama de classes](../Diagrama-Classes/README.md).

O esboço e a Ficha Padrão da Atividade Semanal nº 6 estão em [`docs`](docs/atividade-semanal-06-esboco.md).

## Associação da Atividade 6

Um `Cliente` mantém uma `List<OrdemServico>`, representando que um cliente pode solicitar zero ou várias ordens de serviço. A coleção é declarada pelo tipo de interface, inicializada no próprio atributo e modificada pelo método de domínio `adicionarOrdemServico`, que rejeita valores nulos.

## Organização da apresentação

Para a apresentação do projeto, a equipe escolheu quatro classes principais:

- `Cliente`;
- `Tecnico`;
- `Equipamento`;
- `OrdemServico`.

A classe `Main` será utilizada para demonstrar a criação dos objetos e o funcionamento do cenário completo. Os enums `TipoEquipamento` e `StatusOrdemServico` continuam fazendo parte do código, mas serão apresentados apenas como tipos auxiliares das classes principais.

A saída no terminal também foi organizada em seções para facilitar a leitura durante a demonstração. Os dados do cliente, do técnico e do equipamento são exibidos em blocos separados, seguidos pelo status da ordem de serviço. Depois, o programa apresenta de forma resumida a mudança de `ABERTA` para `EM_ATENDIMENTO`, evitando repetir todas as informações.

O uso de inteligência artificial durante a preparação está registrado em [IA.md](IA.md).

## Herança da Atividade 8

`Equipamento` é a superclasse abstrata de `Notebook` e `Desktop`. As subclasses reutilizam as validações, os dados comuns, os getters e `exibirDados()`, e ambas sobrescrevem `descreverAtendimento()` para apresentar suas características específicas. A entrega completa está documentada em [`docs/atividade-semanal-08-poo-entrega-final.md`](../docs/atividade-semanal-08-poo-entrega-final.md).

## Polimorfismo da Atividade 9

`RoteiroDiagnostico` documenta em Javadoc um contrato de etapas ordenadas e imutáveis. `Equipamento` implementa a interface; `Notebook` e `Desktop` fornecem procedimentos diferentes. `OrdemServico.getRoteiroDiagnostico()` consulta uma referência da interface e a exibição da OS apresenta as etapas. `Main` demonstra também uma `List<RoteiroDiagnostico>`.

A mesma chamada pela interface seleciona a implementação do objeto em tempo de execução, sem `instanceof` ou seleção por tipo no cliente. Essa substituição e ligação dinâmica caracterizam polimorfismo, além da reutilização de dados por herança.

Execute `mvn test` e `java -cp target/classes Main` nesta pasta. São 14 testes aprovados, incluindo seis novos testes em `RoteiroDiagnosticoTest`. [Ficha final](../docs/Ficha_Padrao_Entrega_Atividade_09_Final.pdf) e [documentação completa](../docs/atividade-semanal-09-poo-entrega-final.md).
