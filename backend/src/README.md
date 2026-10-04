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

Os oito testes anteriores verificam as regras anteriores de cliente e ordem, as especializações de notebook e celular, a herança dos dados comuns e a herança da validação de marca.

## Execução do cenário

Sem plugin adicional do Maven, o cenário pode ser executado diretamente:

```bash
mvn compile
java -cp target/classes Main
```

Ao final, a execução percorre uma `List<Equipamento>` com um `Notebook` e um `Celular`. O mesmo método herdado produz descrições diferentes por meio das sobrescritas de `descreverAtendimento()`.

Os arquivos `.class` são ignorados pelo Git.

## Justificativa da herança

A herança é adequada porque notebook e celular são tipos de equipamento recebidos pela assistência técnica. Ambos compartilham tipo, marca, defeito, validações e exibição básica, que ficam centralizados em `Equipamento`. Cada subtipo acrescenta dados próprios e especializa a descrição do atendimento, mantendo o contrato comum e evitando duplicação.

## Documentação da atividade

Consulte a [entrega final da Atividade Semanal nº 8](../../docs/atividade-semanal-08-poo-entrega-final.md) e a [documentação do diagrama de classes](../../Diagrama-Classes/README.md).

## Incremento da Atividade 9

`RoteiroDiagnostico.java` define o contrato de diagnóstico implementado por Notebook e Celular. A OS consulta a interface sem verificar tipos, e Main demonstra uma coleção polimórfica. `RoteiroDiagnosticoTest.java` acrescenta seis testes: cada implementação com valores conhecidos, celular de um slot, despacho pela interface, imutabilidade e integração. Total: 14 testes sem falhas. [Entrega final](../../docs/atividade-semanal-09-poo-entrega-final.md).
