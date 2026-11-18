# AS - Apresentação final do Dossiê de Engenharia de Software

## 2.1 Links da entrega

**Apresentação em PDF:** https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/blob/main/docs/processos/apresentacao-as/TechFix-AS-Modelo-Professora.pdf

**Apresentação editável:** https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/blob/main/docs/processos/apresentacao-as/TechFix-AS-Modelo-Professora.pptx

**Release final do dossiê:** https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/releases/tag/v2.0.0

**Protótipo local:** http://localhost:5173

**Protótipo em capturas (plano B):** https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/blob/main/docs/04-modelagem/as/README.md

O protótipo executa no computador da equipe. O link localhost não é uma hospedagem pública. As capturas no repositório permitem acompanhar a demonstração sem iniciar o sistema. A apresentação segue o estilo do exemplo da professora. O percurso cronometrado usa os slides 1, 3–17 e 20. Os slides 2, 18 e 19 são apoio fora dos 12 minutos.

## 2.2 Matriz de responsabilidades do semestre

Arthur = Arthur Scharfenberger. Lucas = Lucas Oliveira da Silva. A equipe confirmou em 18/11: Arthur liderou grande parte do trabalho; Lucas apoiou, revisou e aperfeiçoou. As linhas coletivas registram esse padrão geral declarado, sem atribuir a Lucas a autoria dos commits de Arthur. Os artefatos e o DEVLOG comprovam as entregas; o histórico de Git, isoladamente, não individualiza a colaboração. A6 é individual. A1 e AP1 conservam as limitações de evidência abaixo.

Caminhos abreviados na coluna Evidência são relativos a docs/processos, exceto os iniciados por docs/.

| Atividade | Responsável principal | Apoio | Revisou | Evidência |
|---|---|---|---|---|
| A1 | Não individualizado | Não individualizado | Não individualizado | Registro específico não localizado; A1 excluída da revisão de 07/10 no DEVLOG. |
| A2 | Arthur | Lucas | Lucas | entregas/atividade02-12-08.pdf |
| A3 | Arthur | Lucas | Lucas | entregas/Atividade_03_Levantamento_Requisitos_TechFix.pdf |
| A4 | Arthur | Lucas | Lucas | dossie/requisitos.md; origem RE1–RE5; DEVLOG, A5 (validação da A4). |
| A5 | Arthur | Lucas | Lucas | entregas/Atividade05.pdf; DEVLOG, preparação da AP1. |
| A6 | Arthur (individual) | Não se aplica | Arthur (autorrevisão) | entregas/Atividade_06_Reflexao_Individual_Arthur_Scharfenberger.pdf |
| A7 | Arthur | Lucas | Lucas | entregas/A7-Processo-Entrega-Final.pdf; DEVLOG 07/10. |
| A8 | Arthur | Lucas | Lucas | entregas/A8-Entrega-Final.pdf; dossie/backlog.md |
| A9 | Arthur | Lucas | Lucas | entregas/Modelagem-Entrega-Final.pdf |
| A10 | Arthur | Lucas | Lucas | entregas/A10-Arquitetura-Rastreabilidade-Final.pdf |
| A11 | Arthur | Lucas | Lucas | 05-qualidade/A11-Ficha-Entrega-Final.pdf; commit 6f0c865 |
| A12 | Arthur | Lucas | Lucas | 05-qualidade/A12-Ficha-Entrega-Final.pdf; commit 01a7c29 |
| A13 | Arthur | Lucas | Lucas | 05-qualidade/A13-Ficha-Entrega-Final.pdf; commit 3fd3850; matriz consolidada AS. |
| A14 | Arthur | Lucas | Lucas | 06-evolucao/A14-Ficha-Entrega-Final.pdf; PR #1 |
| A15 | Arthur | Lucas | Lucas | docs/06-evolucao/A15-Ficha-Entrega-Final.pdf; commit bccb28c |
| AP1 | Arthur | Lucas | Lucas | DEVLOG, A5: resumo do fluxo para AP1. Slides específicos não localizados. |
| AP2 | Arthur | Lucas | Lucas | apresentacao-ap2/TechFix-AP2.pptx; Roteiro-Arthur-Lucas.pdf |
| AS | Arthur | Lucas | Lucas | apresentacao-as/TechFix-AS-Modelo-Professora.pptx; Roteiro-Arthur-Lucas.pdf; DEVLOG 18/11. |

A liderança indicada para AP1 segue a declaração geral da equipe, com evidência indireta na A5. Na AS, ambos apresentam: Arthur nos slides 1, 3–8, 17 e 20, Lucas nos slides 9–16; cada um dispõe de seis minutos. Qualquer integrante responde sobre todo o projeto.

## 2.3 Demonstração e situação do produto

Fluxo principal: Ana Souza e notebook EQ-1, defeito “Não liga”, abertura de OS e consulta dos detalhes (HU1, RF2 Must, CA04, CT04). O código visual TFX-EQP-000001 corresponde ao ID EQ-1. O protótipo grava e permite consultar a OS, mas usa identificador CHD e não demonstra o evento histórico exigido. CT04 permanece parcial.

Caminho de erro: Ana Souza com EQ-2 de Bruno Lima (CA03, CT03). A interface filtra os equipamentos. A chamada direta ao serviço confirmou a recusa “O equipamento selecionado não pertence ao cliente informado.” e zero novas OS, sem alterar dados reais do usuário. Capturas de 18/11/2026 em contexto isolado.

A release v2.0.0 consolida o dossiê. A RN2 de garantia entrou na especificação v1.1.0 e permanece sem implementação. Resultados A13 preservados: 1 caso passou no cenário, 3 parciais, 5 falharam, 13 não executados. Uso de IA declarado abaixo.
