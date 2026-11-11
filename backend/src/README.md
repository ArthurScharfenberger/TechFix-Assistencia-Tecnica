# Código Java — TechFix

## Estado atual - Atividade 12

O código está em três pacotes sob `com.techfix`: `dominio` (entidades, `ServicoOrdens`, `RegistroOrdem` e interface `RepositorioOrdens`), `repositorio` (memória e arquivo TSV) e `app` (`Main`). A escolha do repositório fica no `Main`; o serviço recebe a interface pelo construtor. São **31 testes JUnit**, incluindo 12 novos de serviço e persistência. Requer **JDK 25 e Maven**.

Na raiz do repositório:

```sh
mvn -B -f backend/pom.xml clean test
java -cp backend/target/classes com.techfix.app.Main dados/ordens.tsv
java -cp backend/target/classes com.techfix.app.Main dados/ordens.tsv
```

[Documentação e evidências da A12](../../docs/poo/atividade-12/README.md) · [UML atual](../../docs/poo/uml.png).

## Histórico das etapas anteriores

As descrições e contagens abaixo registram as atividades anteriores. Os arquivos Java foram movidos para os pacotes da A12; a estrutura e os comandos vigentes estão acima.

Esta pasta contém a implementação Java das atividades semanais de Programação Orientada a Objetos. Na entrega final da Atividade Semanal nº 8, `Equipamento` passou a ser uma superclasse abstrata de `Notebook` e `Desktop`. O código utiliza Java 17, dois enums, herança, polimorfismo e validações básicas. Maven foi configurado para compilar o projeto e executar os testes JUnit 5.

Não há API, Spring, banco de dados ou integração com o frontend.

## Arquivos principais

| Arquivo | Responsabilidade |
| --- | --- |
| `Cliente.java` | Armazena e valida os dados do cliente e mantém sua lista de ordens de serviço. |
| `Tecnico.java` | Armazena e valida nome e especialidade. |
| `Equipamento.java` | Superclasse abstrata que valida e representa os dados comuns dos equipamentos. |
| `Notebook.java` | Especializa equipamento com memória RAM. |
| `Desktop.java` | Especializa equipamento com configuração de vídeo. |
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

Os oito testes anteriores verificam as regras anteriores de cliente e ordem, as especializações de notebook e desktop, a herança dos dados comuns e a herança da validação de marca.

## Execução do cenário

Sem plugin adicional do Maven, o cenário pode ser executado diretamente:

```bash
mvn compile
java -cp target/classes com.techfix.app.Main
```

Ao final, a execução percorre uma `List<Equipamento>` com um `Notebook` e um `Desktop`. O mesmo método herdado produz descrições diferentes por meio das sobrescritas de `descreverAtendimento()`.

Os arquivos `.class` são ignorados pelo Git.

## Justificativa da herança

A herança é adequada porque notebook e desktop são tipos de equipamento recebidos pela assistência técnica. Ambos compartilham tipo, marca, defeito, validações e exibição básica, que ficam centralizados em `Equipamento`. Cada subtipo acrescenta dados próprios e especializa a descrição do atendimento, mantendo o contrato comum e evitando duplicação.

## Documentação da atividade

Consulte a [demonstração da herança](main/java/com/techfix/app/Main.java) e a [documentação do diagrama de classes](../../docs/poo/diagrama-classes/README.md).

## Incremento da Atividade 9

`RoteiroDiagnostico.java` define o contrato de diagnóstico implementado por Notebook e Desktop. A OS consulta a interface sem verificar tipos, e Main demonstra uma coleção polimórfica. `RoteiroDiagnosticoTest.java` acrescenta seis testes: cada implementação com valores conhecidos, desktop com vídeo integrado, despacho pela interface, imutabilidade e integração. Total: 14 testes sem falhas. [Entrega final](../../docs/poo/atividade-09/Ficha_Padrao_Entrega_Atividade_09_Final.pdf).
