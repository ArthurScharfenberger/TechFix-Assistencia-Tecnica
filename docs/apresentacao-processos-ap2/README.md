# TechFix — AP2 de Processos de Engenharia de Software

**Versão atual: [apresentação refeita no visual do Gamma](gamma-revisada/README.md)** — 13 slides, com rastreabilidade, matriz e fechamento completos. Inclui PDF, PowerPoint editável, roteiro e ficha atualizada.

Apresentação de Arthur Scharfenberger e Lucas Oliveira da Silva, preparada em 07/10/2026. São 13 slides principais, com 11 minutos planejados de exposição, mais 4 minutos para perguntas. Os slides 14–16 são apoio.

- [Slides em PowerPoint, com notas de fala](TechFix-AP2-Processos.pptx)
- [Slides em PDF](TechFix-AP2-Processos.pdf)
- [Roteiro da dupla, cronograma e 15 perguntas de ensaio](Roteiro-Arthur-Lucas.pdf)
- [Ficha institucional em PDF](Ficha-Entrega-AP2.pdf)
- [Ficha editável em Word](Ficha-Entrega-AP2.docx)
- [Mapa das fontes e rastreabilidade](Fontes-e-rastreabilidade.md)

Os diagramas e tabelas são objetos editáveis do PowerPoint. O PDF é a cópia de reserva para apresentação. Ambos foram exportados pelo PowerPoint e inspecionados; o roteiro tem as falas completas, que também constam nas notas dos slides.

A A3 fornecida documenta entrevista **simulada** com Marcos Almeida. O slide 11 acompanha RF03–RF05 da A3 até RF2/RN1 da A4/A5, A8R03/06/07, modelos A9 e componentes C1–C4. A [A10 revisada](../entregas-processos/A10-Arquitetura-Rastreabilidade-Final.pdf) também recebeu essas origens por página, seção e ID.

Antes da entrega, a dupla deve revisar o conteúdo, registrar o consenso das estimativas, confirmar a agenda do PO, conferir as versões A5/A9 e assinar a ficha. A arquitetura integrada e os cenários de teste representam trabalho planejado; não foram apresentados como implementação ou resultados já comprovados.

## Reprodução

No Windows com PowerPoint, Python, ReportLab e python-docx:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File docs/apresentacao-processos-ap2/gerar_slides.ps1
python -X utf8 docs/apresentacao-processos-ap2/gerar_apoio.py --url "https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/blob/docs/ap2-processos-2026-10-07/docs/apresentacao-processos-ap2/TechFix-AP2-Processos.pdf"
```

O roteiro deriva de `conteudo.json`; o script PowerShell contém o conteúdo visual e exporta PPTX/PDF. O gerador de apoio reaproveita o modelo institucional para o DOCX; seu PDF é produzido separadamente com o mesmo conteúdo. A paginação do Word não foi validada visualmente, pois a renderização local do Word travou nos testes desta sessão. Os PDFs foram conferidos página a página.

Se o endereço mudar, regenere a ficha com a URL efetivamente publicada e teste o acesso sem autenticação. Arquivos com sufixo `Rascunho`, quando presentes localmente, precedem a inclusão do link e não são a ficha final.
