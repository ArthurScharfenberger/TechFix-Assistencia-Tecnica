# Entregas de Processos de Engenharia de Software

Elaboração da A7 e revisão dos feedbacks da A8 e A10 em 07/10/2026. As fichas usam a disciplina Processos de Engenharia de Software e ainda dependem da revisão e assinatura dos integrantes antes do envio ao AVA. A A1 foi excluída desta revisão por orientação do usuário.

| Entrega | Word | PDF | Fonte editável |
|---|---|---|---|
| A7 — esboço | [DOCX](A7-Processo-Esboco.docx) | [PDF](A7-Processo-Esboco.pdf) | [Markdown](A7-Processo-Esboco.md) |
| A7 — entrega final | [DOCX](A7-Processo-Entrega-Final.docx) | [PDF](A7-Processo-Entrega-Final.pdf) | [Markdown](A7-Processo-Entrega-Final.md) |
| A8 — entrega final revisada | [DOCX](A8-Entrega-Final.docx) | [PDF](A8-Entrega-Final.pdf) | [Markdown](A8-Entrega-Final-Revisada.md) |
| A10 — arquitetura e rastreabilidade | [DOCX](A10-Arquitetura-Rastreabilidade-Final.docx) | [PDF](A10-Arquitetura-Rastreabilidade-Final.pdf) | [Markdown](A10-Arquitetura-Rastreabilidade-Final.md) |
| Modelagem — esboço histórico | [DOCX](Modelagem-Esboco.docx) | [PDF](Modelagem-Esboco.pdf) | [Markdown](Modelagem-Esboco.md) |
| Modelagem — entrega existente | [DOCX](Modelagem-Entrega-Final.docx) | [PDF](Modelagem-Entrega-Final.pdf) | [Markdown](Modelagem-Entrega-Final.md) |
| Arquitetura — esboço histórico | [DOCX](Arquitetura-Rastreabilidade-Esboco.docx) | [PDF](Arquitetura-Rastreabilidade-Esboco.pdf) | [Markdown](Arquitetura-Rastreabilidade-Esboco.md) |

A7, A8 e A10 seguem as cinco seções e o cabeçalho do [modelo institucional](Documento_Padrao_Entrega_Atividades.docx); os DOCX preservam sua geometria. A7 define Scrum com Sprint semanal, papéis, fluxo, DoD e correções do esboço. A escolha se apoia na [A2](atividade02-12-08.pdf), incremental com práticas ágeis, e na melhoria proposta na [A6 de Arthur](Atividade_06_Reflexao_Individual_Arthur_Scharfenberger.pdf). A8 apresenta tabelas de MoSCoW, rastreabilidade e escala P/M/G, preserva nove itens A8R e corrige RNF1 para até 10.000 OS. A10 inclui oito requisitos, diagrama, vínculos com A7, revisão de coerência de A2 a A9 e correções do esboço.

O [diagrama vetorial](A10-Arquitetura.svg) é editável e está incorporado à ficha A10. Os modelos existentes continuam em [fluxograma](final-fluxograma.png) e [wireframe](final-wireframe.png). Arquitetura, API, autenticação no servidor e banco descrevem a proposta; não comprovam implementação.

## Fechamento pela equipe

O [registro de revisão](Registro-Revisao-Equipe.md) reúne estimativas individuais, discussão e consenso, documentos de origem e conferência final. A A3 fornecida registra entrevista simulada com Marcos Almeida; suas páginas, seções e IDs agora fundamentam a matriz A10 e a apresentação. O arquivo não contém transcrição de perguntas/respostas. Faltam a confirmação da correspondência dos modelos locais com a A9 entregue, a conciliação da A5 local com a versão entregue, consenso e assinaturas. O usuário esclareceu que a A7 ainda não havia sido feita; os dois documentos foram elaborados agora e não representam uma entrega anterior. A2 e A6 fornecidas foram lidas e preservadas.

A cópia local da A5 em Word e PDF difere da versão descrita pela professora: a tabela 2.2.1 local apresenta registros de IA. Isso é uma divergência de versões do portfólio, não uma afirmação de que a A5 entregue não contém requisitos. Os originais locais foram preservados para permitir a comparação.

## Regeneração

Edite as fontes Markdown antes de gerar novamente. Para atualizar as quatro fichas Word e seus PDFs, use Microsoft Word e Python com ReportLab/svglib no Windows:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File docs/gerar_revisoes_processos.ps1
```

O gerador preserva o modelo original e preenche os DOCX pelo Word. Os PDFs são produzidos separadamente por `gerar_revisoes_processos_pdf.py` (Python, ReportLab e svglib), com o mesmo conteúdo e paginação própria. A exportação nativa do Word travou inclusive em documento de teste; os PDFs independentes foram conferidos visualmente, e os DOCX tiveram estrutura e conteúdo conferidos, sem validação visual da paginação do Word. Alterações manuais nos DOCX devem ser incorporadas às fontes Markdown antes de reexecutá-lo. O gerador antigo `docs/gerar_entregas_processos.py` atende somente aos dois documentos históricos de modelagem; não sobrescreve mais a A8.

Verificação: conferir todas as páginas exportadas, a presença do diagrama, os oito requisitos, nove itens A8R e cinco seções das fichas. A verificação automática e visual não substitui discussão, leitura e assinatura dos integrantes.
