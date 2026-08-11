# Código Java — TechFix

Esta pasta contém a implementação da Atividade Semanal nº 3 de Programação Orientada a Objetos. O código utiliza Java 17, dois enums e validações básicas. Maven foi configurado para compilar o projeto e executar os três testes JUnit 5.

Não há API, Spring, banco de dados, packages ou integração com o frontend.

## Arquivos principais

| Arquivo | Responsabilidade |
| --- | --- |
| `Cliente.java` | Armazena e valida nome, telefone e e-mail. |
| `Tecnico.java` | Armazena e valida nome e especialidade. |
| `Equipamento.java` | Armazena tipo, marca e defeito. |
| `OrdemServico.java` | Relaciona os objetos e controla o status da ordem. |
| `StatusOrdemServico.java` | Define os estados aceitos pela ordem. |
| `TipoEquipamento.java` | Define os tipos aceitos de equipamento. |
| `Main.java` | Demonstra a criação da ordem e a mudança de estado. |

Os fontes ficam em `main/java` e o teste `OrdemServicoTest.java` fica em `test/java`.

## Testes

Dentro de `backend`, execute:

```bash
mvn test
```

É necessário ter JDK 17 ou superior e Maven instalados.

Os três testes verificam cliente sem nome, status inicial da ordem e mudança para `EM_ATENDIMENTO`.

## Execução do cenário

Sem plugin adicional do Maven, o cenário pode ser executado diretamente:

```bash
cd src/main/java
javac Cliente.java Tecnico.java Equipamento.java OrdemServico.java StatusOrdemServico.java TipoEquipamento.java Main.java
java Main
```

Os arquivos `.class` são ignorados pelo Git.

## Documentação da atividade

Consulte [Atividade Semanal nº 3](../../docs/atividade-semanal-03.md) e a [documentação do diagrama de classes](../../Diagrama-Classes/README.md).
