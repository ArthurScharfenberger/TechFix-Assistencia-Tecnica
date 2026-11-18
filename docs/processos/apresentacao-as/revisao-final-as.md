# Conferência da apresentação AS

Revisão de 18/11/2026 contra o enunciado “AS — Apresentação final do Dossiê de Engenharia de Software” e as capturas do exemplo da professora. Versão vigente: [PowerPoint revisado](TechFix-AS-Revisada.pptx) e [PDF revisado](TechFix-AS-Revisada.pdf). Este registro distingue conteúdo preparado, evidências disponíveis e ações que ainda dependem da equipe. Não é uma garantia de nota.

## Cobertura do enunciado

| Exigência | Onde conferir | Resultado da revisão |
|---|---|---|
| Problema e evolução desde a AP1 — 1 min | Slides 1 e 3; A3 e fonte de requisitos | Presente; público-alvo separado dos stakeholders e situação atual declarada |
| README, pastas e release final — 1 min | Slides 4–5; [README](../../../README.md); [CHANGELOG](../../../CHANGELOG.md) | Presente; release v2.0.0 publicada, sem declarar conclusão do produto |
| Fluxo principal e requisito Must — 3 min | Slides 6–7; [capturas do protótipo](../../04-modelagem/as/README.md) | Preencher → salvar → confirmar → consultar; HU1, RF2, CA04 e CT04 identificados |
| Tela de erro e critério protegido | Slide 8; [evidência CT03](../../04-modelagem/as/evidencia-ct03.json) | Ana/EQ-2 de Bruno: recusa no serviço, 1 OS antes e depois, zero novas OS |
| Dados iguais aos casos de teste | Slides 6–8; A13 CT03/CT04 | Cliente/equipamento e defeito coincidem. Limitação explícita: CT04 exige numeração sequencial 25 após 24; o protótipo real usa ID CHD e não comprova evento histórico. Não foi declarado teste integral aprovado |
| Cada tela identificada e plano B | Legendas dos slides 6–8; [sequência offline](../../04-modelagem/as/index.html) | Presente, com requisito/critério/caso e ordem das ações |
| A11, A12 e A13 — 3 min | Slides 9–12; [qualidade](../../05-qualidade/README.md) | Metas mensuráveis, correções com commits, estratégia, níveis, cobertura e resultados visíveis nos slides |
| SM-01, impacto, decisão e versão — 1 min | Slide 13; [SM-01](../06-evolucao/SM-01-retorno-em-garantia.md) | Aprovação parcial documental; v1.1.0; A8R11 adiado para I3, A8R12 adiado; ratificação do PO pendente |
| Dívidas, riscos, roadmap e manutenção — 2 min | Slides 14–17; [A15](../../06-evolucao/A15-dossie-e-plano-evolucao.md) | Oito dívidas, duas pagas com commits; riscos R1–R6; itens e motivos do roadmap; responsáveis, fluxo de pedidos, quatro tipos, cadência e comunicação |
| Lições aprendidas — 1 min | Slides 18 e 21 | Aprendizado relacionado a CT06/CT07/CT09, com encerramento dentro do minuto |
| Rastreabilidade ao vivo — 5 min de perguntas | Slide 19; [guia](guia-rastreabilidade.md); [matriz](../dossie/matriz-rastreabilidade.md) | Caminhos preparados para todos os requisitos; entrevista, HU, RF/RN/RNF, CA, modelo, componente, CT, mudança e versão |
| Participação de ambos e limite de tempo | [Roteiro](Roteiro-Arthur-Lucas.pdf) e notas do PowerPoint | Dois vídeos, 720 segundos no total: Arthur 450 (slides 1–11), Lucas 270 (slides 12–21). Gravação não confirmada |
| Ficha padrão em PDF e links | [Ficha](Ficha-Entrega-AS.pdf) | Links da apresentação, release e protótipo local/capturas; assinaturas digitadas autorizadas |
| Matriz A1–A15, AP1, AP2 e AS | Seção 2.2 da ficha | 18 linhas. Divisão geral confirmada pela equipe; A6 individual. A1 sem evidência específica localizada; AP1 com evidência indireta no DEVLOG/A5 |
| Declaração de IA | Seção 4 da ficha e [DEVLOG](../../../DEVLOG.md) | Presente, incluindo a ilustração e as simulações identificadas |
| Envio e formulário individual sigiloso | AVA, ação de cada integrante | Não confirmados; não marcados como realizados |

## Correções desta revisão

- O checklist passou a marcar o conteúdo efetivamente conferido; ensaio, ambiente aberto, envio e formulário individual são ações a confirmar, em bloco separado.
- O fluxo principal deixou de depender de uma única imagem dos detalhes: os slides mostram abertura, confirmação, consulta e erro em sequência, com legendas de rastreabilidade.
- Estratégia e níveis de testes passaram das notas para o corpo dos slides.
- O segundo gráfico passou a medir casos de teste com execução registrada: 9/22. A medida anterior de requisitos com algum cenário exercitado misturava a cobertura das histórias com as execuções parciais; ela não foi mantida como indicador de aceite.
- A manutenção ganhou slide próprio com quatro exemplos, responsáveis, fluxo de solicitação, cadência e comunicação.
- O roadmap recebeu IDs do backlog e das dívidas; os motivos de posição foram explicitados.
- Corrigidas referências às seções da A15 e o momento de reavaliar manutenibilidade (depois do I2).
- Roteiro e ficha foram alinhados à nova numeração: percurso principal 1, 3–18 e 21; apoio 2, 19 e 20. O total permanece 12 minutos.

## Limitações que não devem ser ocultadas

O protótipo local grava e consulta a OS, mas não atende integralmente ao CT04. Os resultados históricos da A13 continuam: um caso passou no cenário, três parciais, cinco falharam e treze sem execução registrada. A apresentação explica esses resultados; a revisão dos slides não corrige o produto nem transforma especificação em teste aprovado.

A1 não tem evidência específica localizada no repositório; a autoria não foi inventada. Os slides próprios da AP1 também não foram localizados, embora A5/DEVLOG comprovem sua preparação. A equipe precisa complementar essas evidências caso as possua. A matriz preserva a declaração geral de liderança de Arthur e apoio/revisão de Lucas.

A ratificação pelo PO, o ensaio real, a preparação do computador e o envio no AVA não foram comprovados por esta revisão. O formulário individual deve ser respondido separadamente por cada integrante.
