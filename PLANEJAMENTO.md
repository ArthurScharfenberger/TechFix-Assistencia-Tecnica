# Planejamento do Projeto

## Identificação

- **Projeto:** TechFix — Sistema de Gestão de Manutenção de Equipamentos
- **Domínio:** assistência técnica
- **Equipe:** Arthur Scharfenberger e Lucas Oliveira da Silva
- **Semestre:** 2026/2

## Problema e público-alvo

Muitas assistências técnicas ainda controlam clientes, equipamentos e ordens de serviço em papel ou planilhas. Isso dificulta a organização das informações, o acompanhamento dos reparos e a comunicação com os clientes. O TechFix centraliza essas informações e atende clientes, técnicos e responsáveis pela gestão da assistência.

## Backlog priorizado

O planejamento incremental abaixo foi definido na Atividade 08. Os tamanhos usam a escala relativa P (pequeno), M (médio) e G (grande).

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

## Incrementos definidos

### I1 — Solicitar Conserto

- **Itens:** B01, B02 e B03.
- **Valor entregue:** o cliente consegue abrir uma conta, registrar seu aparelho com defeito e verificar que a solicitação está no sistema.
- **Demonstração:** cadastrar um cliente de teste, preencher os dados de um equipamento quebrado, confirmar a solicitação e visualizar o status inicial “Em Análise”.

### I2 — Orçamento e Conclusão

- **Itens:** B04, B05, B06 e B07.
- **Valor entregue:** o técnico consegue assumir a solicitação criada no I1, registrar o diagnóstico e as peças usadas e encerrar o pedido, gerando o valor do conserto.
- **Demonstração:** entrar como técnico, selecionar o chamado aberto no I1, adicionar uma peça, como “Placa Base”, com seu valor e finalizar o atendimento, mostrando a mudança de status e o valor final.

### I3 — Itens postergados

O backlog atribui B08, B09 e B10 ao I3. A Atividade 08 não detalha o valor entregue nem a demonstração desse incremento. A decisão atual é postergar a funcionalidade financeira para priorizar o fluxo principal de manutenção nos incrementos I1 e I2.

## Riscos

| ID | Evento e consequência | Probabilidade | Impacto | Mitigação |
|---|---|:---:|:---:|---|
| R1 | Falta de definição prévia da lista de peças, causando atraso ou retrabalho no desenvolvimento do B06. | Alta | Médio | Solicitar ao especialista de hardware ou cliente uma lista simplificada de peças padrão antes de iniciar o I2. |
| R2 | Indisponibilidade da API de pagamento durante a validação, bloqueando a demonstração do I3 e reduzindo a confiança na entrega. | Média | Alto | Preparar uma simulação interna (mock) de aprovação e validar separadamente no ambiente sandbox. |

### Matriz de riscos

| Probabilidade / Impacto | Baixo | Médio | Alto |
|---|:---:|:---:|:---:|
| Alta | — | R1 | — |
| Média | — | — | R2 |
| Baixa | — | — | — |

## Decisões e pendências

- **Decisão:** concentrar as funcionalidades primárias de manutenção em I1 e I2. A funcionalidade financeira fica para I3, reduzindo incertezas técnicas no fluxo principal.
- **Pendência:** obter a aprovação do dono do produto para os nomes dos status “Em Análise”, “Em Conserto” e “Concluído”.

## Estado atual da implementação

O repositório contém um frontend TypeScript executado com Vite e uma implementação acadêmica orientada a objetos em Java/Maven. Essas partes ainda não se comunicam por API. O planejamento representa a evolução pretendida do produto e não significa que todos os itens do backlog estejam implementados.

O documento original da atividade está em [`docs/Atividade_A8.pdf`](docs/Atividade_A8.pdf), e sua versão consultável em Markdown está em [`docs/atividade-semanal-08.md`](docs/atividade-semanal-08.md).

## Repositório

[github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica)
