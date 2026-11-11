# Requisitos do TechFix — linha de base

Fonte única versionada dos requisitos do dossiê. Consolida a A4 (redação e origem RE1–RE5) e a A5 (critérios de aceitação e priorização). Os PDFs das entregas permanecem como histórico em `docs/entregas-processos/`.

Origem: A3 — entrevista semiestruturada simulada com Marcos Almeida, atendente (`Atividade_03_Levantamento_Requisitos_TechFix.pdf`).

## Rastreabilidade da entrevista (A4)

| Código | Ponto da entrevista | Origina |
|---|---|---|
| RE1 | O atendente usa papel ou planilhas e precisa registrar dados do cliente e do equipamento | RF1, HU1 |
| RE2 | Cada atendimento precisa de uma OS, com status definido e técnico responsável | RN1, RF2, HU2 |
| RE3 | Localizar ordens pelo cliente, equipamento ou número e consultar o histórico | RF3, HU1 |
| RE4 | Dados administrativos e valores não devem ficar disponíveis para todos | RNF2 |
| RE5 | O sistema deve ser simples e rápido, sem deixar o atendimento mais demorado | RNF1 |

## Requisitos

| ID | Requisito | Origem | Prioridade (A5) |
|---|---|---|---|
| RF1 | O sistema deve cadastrar clientes e equipamentos com os dados necessários ao atendimento. | RE1 | Must |
| RF2 | O sistema deve criar e acompanhar ordens de serviço, permitindo informar status e técnico responsável. | RE2 | Must |
| RF3 | O sistema deve pesquisar ordens pelo cliente, equipamento ou número da OS e permitir consultar o histórico. | RE3 | Must |
| RN1 | Uma OS deve usar um dos estados: ABERTA, EM ATENDIMENTO ou CONCLUÍDA. | RE2 | Must |
| RNF1 | As principais telas e consultas devem responder em até 2 segundos em pelo menos 95% das operações. | RE5 | Should |
| RNF2 | O sistema deve bloquear em 100% das tentativas o acesso de usuários sem permissão a dados administrativos e valores. | RE4 | Must |
| HU1 | Como atendente, quero cadastrar e localizar uma OS para acompanhar o serviço sem depender de papel ou planilhas. | RE1, RE3 | Must |
| HU2 | Como técnico, quero visualizar e atualizar as OS sob minha responsabilidade para manter o andamento do serviço registrado. | RE2 | Must |

## Requisitos validados (A5 §2.2.1)

A tabela 2.2.1 da A5 local apresenta registros de uso de IA no lugar das versões validadas (divergência já anotada no DEVLOG em 07/10/2026).

## Critérios de aceitação (A5 §2.2.2)

**RF1 — Cadastro de cliente e equipamento**

- Dado que o atendente informou nome, telefone, tipo do equipamento e defeito, quando confirmar o cadastro, então o sistema deve salvar o cliente, salvar o equipamento vinculado e apresentar confirmação.
- Dado que um campo obrigatório não foi informado, quando o atendente tentar confirmar, então o sistema deve impedir o cadastro e indicar cada campo pendente.

**RF2 — Criação e acompanhamento de OS**

- Dado que cliente e equipamento estão cadastrados, quando um usuário autorizado abrir uma OS, então o sistema deve gerar um número único, registrar a data de abertura e definir o estado ABERTA.
- Dado que a OS está ABERTA, quando um técnico for atribuído e o atendimento começar, então o sistema deve permitir a mudança para EM ATENDIMENTO e registrar responsável, data e hora no histórico.
- Dado que a OS está CONCLUÍDA, quando houver tentativa de retornar a ABERTA ou EM ATENDIMENTO, então o sistema deve rejeitar a alteração e manter o estado atual.

**RF3 — Pesquisa e histórico de OS**

- Dado que existe uma OS com o número informado, quando o usuário pesquisar pelo número exato, então o sistema deve exibir a OS correspondente com cliente, equipamento, técnico e estado.
- Dado que existem OS vinculadas a clientes cujo nome contém o texto informado, quando o usuário pesquisar pelo nome parcial, então o sistema deve listar todas as correspondências.
- Dado que uma OS sofreu alterações, quando o usuário abrir seu histórico, então o sistema deve apresentar os eventos em ordem cronológica com data, hora, usuário e alteração realizada.

## Volume de dados (A8 §2.4)

RNF1: até 2 segundos em pelo menos 95% das operações, com base de até 10.000 OS.
