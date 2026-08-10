# Código Java — TechFix

Esta pasta contém a implementação básica, em Java padrão, das classes de domínio desenvolvidas na atividade de Programação Orientada a Objetos do TechFix.

O código é independente do frontend TypeScript. Não há integração por HTTP, API REST, banco de dados, framework ou gerenciador de dependências.

## Arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `Cliente.java` | Armazena nome, telefone e e-mail do cliente. |
| `Tecnico.java` | Armazena nome e especialidade do técnico. |
| `Equipamento.java` | Armazena tipo, marca e defeito do equipamento. |
| `OrdemServico.java` | Relaciona cliente, técnico e equipamento e controla o status da ordem. |
| `Main.java` | Executa um cenário simples para demonstrar o funcionamento das classes. |

## Conceitos de orientação a objetos

- **Encapsulamento:** os atributos das classes são privados.
- **Construtores:** cada objeto recebe seus dados iniciais no momento da criação.
- **Associação:** uma `OrdemServico` mantém referências para um `Cliente`, um `Tecnico` e um `Equipamento`.
- **Comportamento:** as classes expõem métodos para apresentar dados e, no caso da ordem, alterar seu status.

Uma nova ordem começa com o status `Aberta`. No cenário de demonstração, esse status é alterado para `Em atendimento`.

## Compilação e execução

Com um JDK instalado, execute dentro desta pasta:

```bash
javac Cliente.java Tecnico.java Equipamento.java OrdemServico.java Main.java
java Main
```

Os arquivos `.class` gerados são artefatos de compilação e estão ignorados pelo Git por meio da regra `*.class` no `.gitignore` da raiz.

## Diagrama de classes

A representação visual desta implementação e a explicação dos relacionamentos estão em [Diagrama-Classes/README.md](../../Diagrama-Classes/README.md).
