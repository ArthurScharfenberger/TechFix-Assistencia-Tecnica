# Entregas de Processos de Engenharia de Software

Arquivos para revisão e envio no AVA:

| Entrega | Word | PDF | Fonte consultável |
|---|---|---|---|
| A8 — entrega final | [DOCX](A8-Entrega-Final.docx) | [PDF](A8-Entrega-Final.pdf) | [Markdown](A8-Entrega-Final-Revisada.md) |
| Modelagem — esboço | [DOCX](Modelagem-Esboco.docx) | [PDF](Modelagem-Esboco.pdf) | [Markdown](Modelagem-Esboco.md) |
| Modelagem — entrega final | [DOCX](Modelagem-Entrega-Final.docx) | [PDF](Modelagem-Entrega-Final.pdf) | [Markdown](Modelagem-Entrega-Final.md) |

Todos seguem a estrutura e preservam o cabeçalho do documento padrão local. As versões Markdown e imagens permitem consultar o conteúdo sem Word. A A8 original permanece preservada; os IDs A8R pertencem à revisão. Os modelos referenciam essa revisão, não o backlog antigo B01–B10.

A preparação não comprova consenso, assinatura, oficina passada ou implementação. Antes do envio, os integrantes devem revisar as estimativas e decisões propostas e preencher etapa, data efetiva e código da atividade de modelagem conforme o AVA.

O [documento padrão fornecido](Documento_Padrao_Entrega_Atividades.docx) foi preenchido diretamente, preservando campos, cinco seções, cabeçalho, margens, tabela de IA e declaração institucional. Diagramas: [rascunho](esboco-fluxograma.png), [fluxograma final](final-fluxograma.png) e [wireframe](final-wireframe.png).

Para reproduzir os DOCX: `python docs/gerar_entregas_processos.py` (python-docx e Pillow; fonte Arial do Windows). O gerador sobrescreve os documentos e as fontes; incorpore nele eventuais revisões feitas no Word antes de executá-lo novamente. O arquivo A8 foi renomeado para `A8-Entrega-Final.docx`; o nome da fonte Markdown foi mantido.

Os PDFs foram exportados pelo Microsoft Word, preservando a formatação dos DOCX: A8 com 5 páginas, esboço com 3 e modelagem final com 6. Para atualizar um PDF após editar o Word, use **Arquivo → Exportar → Criar PDF/XPS** e salve com o mesmo nome nesta pasta. O gerador Python não exporta PDFs.

Verificação realizada: reabertura dos DOCX, estrutura comparada ao padrão, presença dos diagramas e leitura dos PDFs com conferência do número de páginas. Essa verificação não substitui a revisão e assinatura dos integrantes.
