# Atividade Semanal nº 8 — Entrega final de POO

## Hierarquia implementada

`Equipamento` é a superclasse abstrata da hierarquia. `Notebook` e `Desktop` são subclasses e chamam o construtor da superclasse com `super(...)`, reutilizando a validação de tipo, marca e defeito. As duas também herdam os getters e o método `exibirDados()`.

Ambas sobrescrevem `descreverAtendimento()` com `@Override`. A implementação especializada chama `super.descreverAtendimento()` para preservar os dados comuns e acrescenta uma característica própria: memória RAM para notebook e configuração de vídeo para desktop.

## Demonstração em execução

O `Main` armazena objetos das duas subclasses em uma `List<Equipamento>` e chama o mesmo método herdado `exibirDados()` para cada item. A chamada interna a `descreverAtendimento()` é resolvida de forma polimórfica e produz comportamentos diferentes:

```text
DEMONSTRAÇÃO DA HIERARQUIA DE EQUIPAMENTOS
  Tipo: NOTEBOOK | Marca: Dell | Defeito: Não liga | Especialização: notebook com 16 GB de RAM
  Tipo: DESKTOP | Marca: Dell | Defeito: Sem imagem | Especialização: desktop com placa de vídeo dedicada
```

## Testes JUnit

A classe `EquipamentoTest` contém quatro testes:

- especialização da descrição de `Notebook`;
- especialização da descrição de `Desktop`;
- herança dos dados e getters comuns;
- herança da validação de marca pelas duas subclasses.

Somados aos quatro testes anteriores de `OrdemServicoTest`, são oito testes executados com sucesso por `mvn clean test`.

## Justificativa da herança

A herança é adequada porque notebook e desktop são tipos de equipamento recebidos pela assistência técnica. Ambos compartilham identidade, marca, defeito, validações e forma básica de exibição, evitando duplicação na superclasse. Cada subtipo acrescenta seus próprios dados e especializa a descrição do atendimento sem perder o contrato comum de `Equipamento`.

## Arquivos principais

- [`Equipamento.java`](../backend/src/main/java/Equipamento.java)
- [`Notebook.java`](../backend/src/main/java/Notebook.java)
- [`Desktop.java`](../backend/src/main/java/Desktop.java)
- [`Main.java`](../backend/src/main/java/Main.java)
- [`EquipamentoTest.java`](../backend/src/test/java/EquipamentoTest.java)

Repositório: [TechFix — Assistência Técnica](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica)

## Uso de inteligência artificial

A IA foi utilizada como apoio para revisar a implementação da hierarquia, organizar os testes, conferir o atendimento ao enunciado e atualizar a documentação e a ficha padrão. A implementação foi verificada com compilação, execução do cenário e testes automatizados; a equipe permanece responsável pela validação final.
