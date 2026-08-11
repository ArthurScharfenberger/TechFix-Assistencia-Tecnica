```md
# Planejamento do Projeto

## Nome do Projeto
**TechFix - Sistema de Assistência Técnica**

## Integrante(s)
- Arthur Scharfenberger

---

# Domínio

Assistência Técnica.

## Descrição do Problema

Muitas assistências técnicas ainda realizam o controle de clientes, equipamentos e ordens de serviço em papel ou planilhas, dificultando a organização das informações, o acompanhamento dos reparos e a comunicação com os clientes.

O objetivo deste sistema é centralizar essas informações em uma única plataforma, permitindo um gerenciamento mais eficiente dos atendimentos e dos serviços prestados.

---

# Público-alvo

- Atendentes da assistência técnica;
- Técnicos responsáveis pelos reparos;
- Clientes que desejam acompanhar o andamento do conserto.

---

# Funcionalidades

- Cadastro de clientes;
- Cadastro de equipamentos;
- Abertura de ordens de serviço;
- Registro do defeito informado pelo cliente;
- Atualização do status do reparo;
- Registro dos serviços realizados;
- Registro do valor do conserto;
- Consulta de ordens de serviço;
- Consulta do histórico de atendimentos;
- Finalização da ordem de serviço.

---

# Histórias de Usuário

1. Eu, como **atendente**, quero cadastrar clientes, para registrar seus dados e facilitar futuros atendimentos.

2. Eu, como **atendente**, quero cadastrar equipamentos, para identificar corretamente o aparelho que será consertado.

3. Eu, como **atendente**, quero abrir uma ordem de serviço, para registrar o problema informado pelo cliente.

4. Eu, como **técnico**, quero atualizar o status do reparo, para informar o andamento do serviço.

5. Eu, como **técnico**, quero registrar os serviços realizados, para manter o histórico do conserto.

6. Eu, como **atendente**, quero consultar ordens de serviço, para localizar rapidamente um atendimento.

7. Eu, como **cliente**, quero acompanhar o status do meu equipamento, para saber quando ele estará pronto.

8. Eu, como **atendente**, quero registrar o valor do conserto, para informar o orçamento ao cliente.

9. Eu, como **atendente**, quero finalizar uma ordem de serviço, para registrar a entrega do equipamento ao cliente.

10. Eu, como **gerente da assistência técnica**, quero consultar o histórico de atendimentos, para acompanhar os serviços realizados e tomar decisões.

---

# Backlog Inicial

| Prioridade | Funcionalidade |
|------------|----------------|
| Alta | Cadastro de clientes |
| Alta | Cadastro de equipamentos |
| Alta | Abertura de ordem de serviço |
| Alta | Atualização do status da ordem de serviço |
| Média | Consulta de ordens de serviço |
| Média | Registro dos serviços realizados |
| Média | Registro do valor do conserto |
| Baixa | Histórico de atendimentos |
| Baixa | Acompanhamento do cliente |
| Baixa | Finalização da ordem de serviço |

# Repositório GitHub

```

---

# Estado atual da implementação

A implementação orientada a objetos está organizada no padrão Maven, separada do frontend. Ela contém as classes `Cliente`, `Tecnico`, `Equipamento` e `OrdemServico`, os enums `StatusOrdemServico` e `TipoEquipamento`, além de `Main` para demonstrar o cenário básico e testes JUnit 5.

Nesta etapa não há API, banco de dados ou integração entre Java e TypeScript. A documentação técnica está disponível em `backend/src/README.md`, e o modelo visual atualizado está documentado em `Diagrama-Classes/README.md`.

```text
backend/
├── pom.xml
└── src/
    ├── README.md
    ├── main/java/
    │   ├── Cliente.java
    │   ├── Tecnico.java
    │   ├── Equipamento.java
    │   ├── OrdemServico.java
    │   ├── StatusOrdemServico.java
    │   ├── TipoEquipamento.java
    │   └── Main.java
    └── test/java/
        └── OrdemServicoTest.java
```

