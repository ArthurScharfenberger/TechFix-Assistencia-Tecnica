# ULBRA — Universidade Luterana do Brasil

**Disciplina:** Processos de Engenharia de Software

# Entrega de Atividade Semanal - Atividade 04

Utilize este arquivo como modelo para todas as entregas das atividades semanais (A1 a A15). Preencha os campos de identificação, o conteúdo solicitado no enunciado da atividade e, quando aplicável, a declaração de uso de Inteligência Artificial.

## 1. Identificação

**Atividade (código e nome):** Atividade 04 - Estruturação e formalização de requisitos

**Etapa (AP1 / AP2 / AS):** AP1

**Equipe:** TechFix

**Integrantes:** Arthur Scharfenberger e Lucas Oliveira

**Data de entrega:** 19/08/2026

## 2. Conteúdo da atividade

Desenvolva aqui o conteúdo solicitado no enunciado da atividade correspondente (ex.: problema e stakeholders, requisitos, processo escolhido, modelagem, plano de qualidade, casos de teste etc.). Organize em subtítulos quando fizer sentido. Atribua links quando necessário.

A A4 foi feita com base na mesma entrevista da A3. Os códigos RE abaixo mostram de qual ponto da entrevista saiu cada requisito.

### Rastreabilidade da entrevista (A3)

**RE1** - O atendente ainda usa papel ou planilhas e precisa registrar dados do cliente e do equipamento. Origina RF1 e HU1.

**RE2** - Cada atendimento precisa de uma OS, com status definido e técnico responsável. Origina RN1, RF2 e HU2.

**RE3** - É necessário localizar ordens pelo cliente, equipamento ou número e consultar o histórico. Origina RF3 e HU1.

**RE4** - Dados administrativos e valores não devem ficar disponíveis para todos os usuários. Origina RNF2.

**RE5** - O sistema deve ser simples e rápido, sem deixar o atendimento mais demorado. Origina RNF1.

### Regra de negócio

**RN1** - Uma OS deve usar um dos estados: ABERTA, EM ATENDIMENTO ou CONCLUÍDA. Origem: RE2.

### Requisitos funcionais

**RF1** - O sistema deve cadastrar clientes e equipamentos com os dados necessários ao atendimento. Origem: RE1.

**RF2** - O sistema deve criar e acompanhar ordens de serviço, permitindo informar status e técnico responsável. Origem: RE2.

**RF3** - O sistema deve pesquisar ordens pelo cliente, equipamento ou número da OS e permitir consultar o histórico. Origem: RE3.

### Requisitos não funcionais

**RNF1** - As principais telas e consultas devem responder em até 2 segundos em pelo menos 95% das operações. Origem: RE5.

**RNF2** - O sistema deve bloquear em 100% das tentativas o acesso de usuários sem permissão a dados administrativos e valores. Origem: RE4.

### Histórias de usuário

**HU1** - Como atendente, quero cadastrar e localizar uma OS para acompanhar o serviço sem depender de papel ou planilhas. Origem: RE1 e RE3.

**HU2** - Como técnico, quero visualizar e atualizar as OS sob minha responsabilidade para manter o andamento do serviço registrado. Origem: RE2.

**Observação:** os valores numéricos dos RNFs foram definidos pela equipe para deixar as expectativas da entrevista verificáveis.

## 3. Decisões e pendências

Registre as principais decisões tomadas pela equipe nesta etapa e o que ainda está pendente para a próxima entrega.

- **Decisões tomadas:** Organizar os requisitos por tipo e manter a rastreabilidade com a entrevista da A3.
- **Pendências / próximos passos:** Validar os requisitos e fazer ajustes nas próximas etapas do TechFix.

## 4. Declaração de uso de Inteligência Artificial

Conforme o **Manual da Disciplina** (seção 6 — Uso de Inteligência Artificial), toda utilização relevante de IA no desenvolvimento desta atividade deve ser declarada abaixo e também registrada no arquivo DEVLOG.md do repositório do projeto. Se a equipe não utilizou IA nesta atividade, marque a opção correspondente e não é necessário preencher a tabela.

( ) A equipe não utilizou ferramentas de IA nesta atividade.

(X) A equipe utilizou ferramentas de IA nesta atividade - declaração abaixo.

| Data/ferramenta | Objetivo do uso | Prompt ou resumo da interação | Resultado aproveitado/rejeitado/modificado |
|---|---|---|---|
| 19/08/2026 - ChatGPT | Auxílio na organização dos requisitos. | Resumir a A4 usando a entrevista A3 e manter a rastreabilidade. | Conteúdo revisado pela equipe antes da entrega. |

**Forma de verificação adotada pela equipe:** Revisão da equipe comparando a A4 com a entrevista e os requisitos levantados na A3.

**Responsável pela decisão final sobre o uso:** Arthur Scharfenberger e Lucas Oliveira

## 5. Responsabilidade e autoria

A equipe declara que este documento foi lido, compreendido e validado por todos os integrantes, que respondem integralmente pela correção, coerência, legalidade e autoria do conteúdo entregue. Qualquer integrante poderá ser questionado, em apresentação, sobre partes produzidas com apoio de IA.

**Assinatura (nomes por extenso):**

Arthur Scharfenberger

Lucas Oliveira

____________________________________
