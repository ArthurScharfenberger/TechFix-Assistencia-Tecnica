# Atividade Semanal nº 02 - Modelagem Inicial do Projeto

## Projeto

**TechFix - Sistema de Assistência Técnica**

## Integrante(s)

- Arthur Scharfenberger

---

# Objetivo da Atividade

Nesta etapa do projeto foi realizada a primeira atividade de modelagem do sistema.

O objetivo foi identificar as principais entidades do domínio da aplicação e criar um primeiro rascunho do **Diagrama de Classes UML versão 1**, definindo as classes principais e seus relacionamentos.

---

# Classes de Domínio Identificadas

Durante a análise do problema foram identificadas quatro classes principais para representar o funcionamento da assistência técnica.

## Cliente

Representa a pessoa que solicita o serviço de assistência técnica.

Responsabilidade inicial:
- Possuir equipamentos cadastrados;
- Representar o cliente atendido pela assistência.

---

## Equipamento

Representa o aparelho que será encaminhado para reparo.

Responsabilidade inicial:
- Identificar o equipamento;
- Estar associado a um cliente.

---

## OrdemDeServico

Representa o registro do atendimento realizado pela assistência técnica.

Responsabilidade inicial:
- Registrar o problema informado pelo cliente;
- Controlar o andamento do reparo;
- Armazenar informações do serviço realizado.

---

## Tecnico

Representa o profissional responsável pela realização do reparo.

Responsabilidade inicial:
- Executar os serviços;
- Atualizar o andamento das ordens de serviço.

---

# Relacionamentos Definidos

## Cliente e Equipamento

Um cliente pode possuir vários equipamentos cadastrados no sistema.

Relacionamento:

```
Cliente (1) -------- (0..*) Equipamento
```

Associação:

**possui**

---

## Equipamento e OrdemDeServico

Um equipamento pode possuir várias ordens de serviço durante sua utilização.

Relacionamento:

```
Equipamento (1) -------- (0..*) OrdemDeServico
```

Associação:

**gera**

---

## Tecnico e OrdemDeServico

Um técnico pode ser responsável por várias ordens de serviço.

Relacionamento:

```
Tecnico (1) -------- (0..*) OrdemDeServico
```

Associação:

**é responsável por**

---

# Diagrama de Classes UML - Versão 1

O diagrama abaixo representa o primeiro esboço da estrutura do sistema.

Foram utilizadas apenas as classes principais do domínio, sem implementação de atributos e métodos, pois o objetivo desta etapa foi validar a organização inicial das entidades.

![Diagrama de Classes UML](diagrama.png)

---

# Decisões de Modelagem

As classes foram escolhidas com base nos principais elementos encontrados na descrição do problema.

Foram priorizados conceitos que representam objetos reais dentro de uma assistência técnica:

- Cliente;
- Equipamento;
- Ordem de Serviço;
- Técnico.

Nesta primeira versão foram definidos apenas os relacionamentos entre as classes.

A inclusão de atributos e métodos será realizada nas próximas etapas do desenvolvimento.

---

# Alterações Realizadas no Projeto

Nesta atividade foram adicionados:

- Primeiro rascunho do diagrama de classes UML;
- Definição das quatro classes iniciais do domínio;
- Relacionamentos entre as entidades;
- Documentação da evolução do projeto.

---

# Próximas Etapas

As próximas etapas previstas são:

- Adicionar atributos às classes;
- Definir métodos e responsabilidades;
- Evoluir o diagrama UML;
- Implementar as classes do sistema;
- Desenvolver as funcionalidades do backlog.

---

# Controle de Versão

## Commit realizado

```
Adiciona diagrama de classes UML inicial e documentação da atividade semanal 02
```

---

# Evolução posterior

Esta página permanece como registro da modelagem inicial do projeto. A etapa seguinte foi concluída com a definição de atributos, construtores, métodos e multiplicidades, além da implementação das classes em Java padrão.

- [Diagrama de classes da implementação](../Diagrama-Classes/README.md)
- [Código Java e instruções de execução](../backend/src/README.md)
