# Código Java — TechFix

Esta pasta contém a implementação Java das atividades semanais de Programação Orientada a Objetos. Na entrega final da Atividade Semanal nº 8, `Equipamento` passou a ser uma superclasse abstrata de `Notebook` e `Celular`. O código utiliza Java 17, dois enums, herança, polimorfismo e validações básicas. Maven foi configurado para compilar o projeto e executar os testes JUnit 5.

Não há API, Spring, banco de dados, packages ou integração com o frontend.

## Arquivos principais

| Arquivo | Responsabilidade |
| --- | --- |
| `Cliente.java` | Armazena e valida os dados do cliente e mantém sua lista de ordens de serviço. |
| `Tecnico.java` | Armazena e valida nome e especialidade. |
| `Equipamento.java` | Superclasse abstrata que valida e representa os dados comuns dos equipamentos. |
| `Notebook.java` | Especializa equipamento com memória RAM. |
| `Celular.java` | Especializa equipamento com configuração de chips. |
| `OrdemServico.java` | Relaciona os objetos e controla o status da ordem. |
| `StatusOrdemServico.java` | Define os estados aceitos pela ordem. |
| `TipoEquipamento.java` | Define os tipos aceitos de equipamento. |
| `Main.java` | Demonstra a ordem, a mudança de estado e o comportamento polimórfico das subclasses. |

Os fontes ficam em `main/java`; `OrdemServicoTest.java` e `EquipamentoTest.java` ficam em `test/java`.

## Testes

Dentro de `backend`, execute:

```bash
mvn test
```

É necessário ter JDK 17 ou superior e Maven instalados.

Os oito testes verificam as regras anteriores de cliente e ordem, as especializações de notebook e celular, a herança dos dados comuns e a herança da validação de marca.

## Execução do cenário

Sem plugin adicional do Maven, o cenário pode ser executado diretamente:

```bash
cd src/main/java
javac Cliente.java Tecnico.java Equipamento.java OrdemServico.java StatusOrdemServico.java TipoEquipamento.java Main.java
java Main
```

Ao final, a execução percorre uma `List<Equipamento>` com um `Notebook` e um `Celular`. O mesmo método herdado produz descrições diferentes por meio das sobrescritas de `descreverAtendimento()`.

Os arquivos `.class` são ignorados pelo Git.

## Justificativa da herança

A herança é adequada porque notebook e celular são tipos de equipamento recebidos pela assistência técnica. Ambos compartilham tipo, marca, defeito, validações e exibição básica, que ficam centralizados em `Equipamento`. Cada subtipo acrescenta dados próprios e especializa a descrição do atendimento, mantendo o contrato comum e evitando duplicação.

## Documentação da atividade

Consulte a [entrega final da Atividade Semanal nº 8](../../docs/atividade-semanal-08-poo-entrega-final.md) e a [documentação do diagrama de classes](../../Diagrama-Classes/README.md).
