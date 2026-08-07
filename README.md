# TechFix - Sistema de Assistência Técnica

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Problema](#problema)
- [Objetivos](#objetivos)
- [Funcionalidades](#funcionalidades)
- [Modelo Inicial](#modelo-inicial)
- [Documentação](#documentação)
- [Diagrama UML](#diagrama-uml)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Integrante](#integrante)

---

# Sobre o Projeto

O **TechFix** é um sistema desenvolvido para auxiliar no gerenciamento de uma assistência técnica.

A aplicação tem como objetivo organizar informações de clientes, equipamentos e ordens de serviço, permitindo um melhor controle dos atendimentos e dos reparos realizados.

---

# Problema

Muitas assistências técnicas ainda utilizam controles manuais, como papéis ou planilhas, para registrar seus atendimentos.

Esse processo pode gerar dificuldades como:

- Perda de informações;
- Dificuldade para localizar serviços;
- Falta de acompanhamento dos reparos;
- Pouco controle do histórico de atendimentos.

O TechFix busca centralizar essas informações em uma única plataforma.

---

# Objetivos

O sistema tem como objetivos:

- Organizar os dados dos clientes;
- Controlar equipamentos recebidos para manutenção;
- Gerenciar ordens de serviço;
- Facilitar o acompanhamento dos reparos;
- Registrar o histórico dos atendimentos.

---

# Funcionalidades

Principais funcionalidades planejadas:

- Cadastro de clientes;
- Cadastro de equipamentos;
- Abertura de ordens de serviço;
- Registro de defeitos;
- Atualização do status do reparo;
- Registro dos serviços realizados;
- Consulta de ordens de serviço;
- Histórico de atendimentos.
- Autenticação local para acesso da equipe interna.

## Relatórios

O módulo **Relatórios** reúne consultas de Ordens de Serviço, Reparos e Custos, Equipe e Clientes e Equipamentos. As páginas utilizam os dados locais já cadastrados, oferecem filtros por período e entidade, pesquisa, ordenação, paginação, exportação CSV e impressão pelo navegador para salvar em PDF.

## Acesso de demonstração

Como o projeto é exclusivamente frontend, ele inclui uma conta administrativa local apenas para demonstração acadêmica:

- Usuário: `Admin` ou `admin@admin.com`
- Senha de demonstração: `admin`

A senha não é armazenada em texto puro no navegador; somente seu hash SHA-256 é persistido. Ainda assim, autenticação executada inteiramente no navegador pode ser contornada e **não é adequada para produção**. Uma implantação real deve usar backend, conexão segura, hash com salt e fator de custo, controle de sessão no servidor e política de troca da senha inicial.

---

# Modelo Inicial

As primeiras classes identificadas no domínio do sistema foram:

| Classe         | Descrição                                         |
| -------------- | ------------------------------------------------- |
| Cliente        | Representa o cliente que solicita o serviço       |
| Equipamento    | Representa o aparelho enviado para reparo         |
| OrdemDeServico | Representa o atendimento realizado                |
| Tecnico        | Representa o profissional responsável pelo reparo |

---

# Documentação

Os documentos do projeto estão organizados na pasta **docs**.

## Arquivos disponíveis:

📄 **planejamento.md**  
Contém o planejamento inicial do projeto, incluindo domínio, problema, público-alvo e funcionalidades.

📄 **atividade-semanal-02.md**  
Documenta a primeira etapa de modelagem do sistema, incluindo a definição das classes de domínio e decisões tomadas.

---

# Diagrama UML

O primeiro diagrama de classes do projeto está localizado na pasta:

```
Diagrama UML/
```

Esse diagrama representa a primeira versão da modelagem do sistema, contendo as principais classes e seus relacionamentos.

---

# Estrutura do Projeto

```
TechFix
│
├── README.md
│
├── Diagrama UML
│   └── diagrama.png
│
└── docs
    ├── planejamento.md
    └── atividade-semanal-02.md
```

---

## Histórico de desenvolvimento

A evolução diária do projeto está registrada no arquivo [DEVLOG.md](DEVLOG.md).

---

# Integrante

- Arthur Scharfenberger
