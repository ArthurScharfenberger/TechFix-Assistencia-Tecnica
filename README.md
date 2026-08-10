# TechFix — Sistema de Assistência Técnica

O TechFix é um projeto acadêmico para organizar clientes, equipamentos, ordens de serviço, reparos e o trabalho da equipe de uma assistência técnica.

Atualmente, o repositório reúne duas partes independentes:

- um frontend em TypeScript, executado com Vite e com persistência local no navegador;
- uma atividade de Programação Orientada a Objetos em Java padrão, sem integração com o frontend.

## Funcionalidades do frontend

- autenticação local para demonstração;
- dashboard e indicadores;
- cadastros de clientes, equipamentos e equipe;
- gerenciamento de ordens de serviço e reparos;
- relatórios com filtros, paginação, exportação CSV e impressão.

### Acesso de demonstração

- Usuário: `Admin` ou `admin@admin.com`
- Senha: `admin`

Essa autenticação existe apenas para demonstração acadêmica. Como é executada no navegador, não oferece a segurança necessária para uso em produção.

## Atividade Java

A implementação Java representa as classes `Cliente`, `Tecnico`, `Equipamento` e `OrdemServico`. A classe `Main` demonstra a criação e associação desses objetos e a alteração do status de uma ordem de `Aberta` para `Em atendimento`.

Esta etapa usa somente Java padrão: não há Spring, Maven, Gradle, banco de dados, API REST ou declarações de package. Java e TypeScript ainda não se comunicam.

Uma visão geral da área Java está em [`backend/README.md`](backend/README.md). As instruções de compilação e a descrição das classes estão em [`backend/src/README.md`](backend/src/README.md).

## Diagramas

- [`Diagrama-Classes`](Diagrama-Classes/README.md): diagrama correspondente às classes Java implementadas, com atributos, métodos e multiplicidades.
- [`Diagrama-UML`](Diagrama-UML/README.md): registro da modelagem inicial do domínio.

## Estrutura principal

```text
TechFix/
├── backend/
│   ├── README.md
│   └── src/
│       ├── Cliente.java
│       ├── Equipamento.java
│       ├── Main.java
│       ├── OrdemServico.java
│       ├── Tecnico.java
│       └── README.md
├── Diagrama-Classes/
│   ├── DiagramaClasses.png
│   └── README.md
├── Diagrama-UML/
├── docs/
├── public/
├── src/                 # frontend TypeScript
├── DEVLOG.md
├── PLANEJAMENTO.md
├── package.json
└── README.md
```

## Executando o frontend

```bash
npm install
npm run dev
```

Os scripts disponíveis e as dependências estão definidos em `package.json`.

## Documentação

- [`DEVLOG.md`](DEVLOG.md): histórico das alterações e verificações do projeto.
- [`PLANEJAMENTO.md`](PLANEJAMENTO.md): escopo, histórias de usuário e backlog inicial.
- [`backend/README.md`](backend/README.md): limites e organização da área Java.
- [`backend/src/README.md`](backend/src/README.md): documentação e execução do código Java.
- [`Diagrama-Classes/README.md`](Diagrama-Classes/README.md): explicação do diagrama implementado.

## Integrante

- Arthur Scharfenberger
- Lucas Oliveira da Silva
