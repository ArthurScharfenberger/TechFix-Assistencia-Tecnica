# Atividade Semanal 08 — Planejamento Incremental, Estimativas e Riscos

Esta página registra em formato consultável o planejamento entregue no documento [`Atividade_A8.pdf`](Atividade_A8.pdf). O conteúdo de planejamento foi definido pela equipe TechFix; esta versão organiza as mesmas informações para navegação no repositório.

## Identificação

- **Equipe:** TechFix
- **Integrantes:** Lucas Oliveira da Silva e Arthur Scharfenberger
- **Projeto:** Sistema de Gestão de Manutenção de Equipamentos
- **Semestre:** 2026/2

## Quadro de planejamento

| ID | Item de backlog | Prioridade | Tamanho | Incremento |
|---|---|---:|:---:|:---:|
| B01 | Cadastro e login de cliente | 1 | M | I1 |
| B02 | Registrar solicitação de conserto e detalhes do equipamento | 2 | M | I1 |
| B03 | Consultar status da solicitação pelo cliente | 3 | P | I1 |
| B04 | Login do painel do técnico | 4 | P | I2 |
| B05 | Listar chamados em aberto para o técnico assumir | 5 | M | I2 |
| B06 | Registrar diagnóstico, peças utilizadas e valor | 6 | G | I2 |
| B07 | Finalizar chamado gerando valor total | 7 | M | I2 |
| B08 | Pagar conserto online (Cartão/Pix) | 8 | G | I3 |
| B09 | Avaliar o atendimento ao final | 9 | P | I3 |
| B10 | Relatório gerencial de chamados concluídos | 10 | M | I3 |

## Incrementos

| Incremento | IDs | Valor entregue | Demonstração |
|---|---|---|---|
| I1 — Solicitar Conserto | B01, B02, B03 | O cliente abre uma conta, registra seu aparelho com defeito e verifica que a solicitação está no sistema. | Cadastrar um cliente, informar o equipamento quebrado, confirmar a solicitação e visualizar o status inicial “Em Análise”. |
| I2 — Orçamento e Conclusão | B04, B05, B06, B07 | O técnico assume a solicitação, registra diagnóstico e peças e encerra o pedido com o valor do conserto. | Entrar como técnico, selecionar o chamado, adicionar uma peça com valor e finalizar o atendimento, mostrando o novo status e o valor final. |

Os itens B08, B09 e B10 estão distribuídos no I3, mas o documento da Atividade 08 não apresenta uma linha de detalhamento desse incremento.

## Quadro e matriz de riscos

| ID | Evento e consequência | Probabilidade / Impacto | Mitigação |
|---|---|---|---|
| R1 | Ausência de uma lista prévia de peças pode atrasar ou gerar retrabalho em B06. | Alta / Médio | Solicitar uma lista simplificada de peças padrão ao especialista de hardware ou cliente antes da implementação de I2. |
| R2 | Indisponibilidade da API de pagamento pode bloquear a demonstração de I3. | Média / Alto | Preparar um mock de aprovação e validar o ambiente sandbox separadamente. |

| Probabilidade / Impacto | Baixo | Médio | Alto |
|---|:---:|:---:|:---:|
| Alta | — | R1 | — |
| Média | — | — | R2 |
| Baixa | — | — | — |

## Decisões e pendências

- A equipe priorizou as funcionalidades principais de manutenção em I1 e I2 e postergou a funcionalidade financeira para I3.
- Permanece pendente a aprovação do dono do produto para os status “Em Análise”, “Em Conserto” e “Concluído”.

## Uso de inteligência artificial

O documento entregue registra uso de IA para formatação e revisão ortográfica, sem alteração das definições de escopo, estimativas, riscos e prioridades. A conversão deste conteúdo para Markdown e a atualização dos índices do repositório também tiveram apoio de IA e devem ser verificadas pela equipe contra o PDF original.
