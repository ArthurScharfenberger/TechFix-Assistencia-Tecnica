# AP2 — versão refeita a partir do visual do Gamma

- [Apresentação em PDF](TechFix-AP2-Gamma-Revisada.pdf)
- [PowerPoint editável com notas de fala](TechFix-AP2-Gamma-Revisada.pptx)
- [Roteiro de Arthur e Lucas](Roteiro-Arthur-Lucas-Gamma.pdf)
- [Ficha de entrega em PDF](Ficha-Entrega-AP2-Gamma.pdf)
- [Ficha editável em Word](Ficha-Entrega-AP2-Gamma.docx)

São **13 slides**, com **11 minutos de exposição e 4 minutos para perguntas**. Os primeiros dez seguem o conteúdo e a referência visual de `docs/entregas-processos/ap2.pdf`, criado pela equipe no Gamma. O PDF original foi preservado.

A apresentação foi reconstruída com textos, tabelas e diagramas editáveis. Mantém formato 960 × 540 pontos, fundo claro, azul-escuro, verde-petróleo, títulos Ancizar Serif, texto Mozilla Text e rótulos IBM Plex Mono. As fontes foram incorporadas ao PPTX. O fluxo da A9 recebeu conexões explícitas; os slides 11–13 acrescentam o exemplo de origem A3 até C1–C4, a matriz de oito requisitos/histórias e o fechamento com evolução e testes na AS.

O [mapa de fontes](../Fontes-e-rastreabilidade.md) e a [A10 completa](../../entregas-processos/A10-Arquitetura-Rastreabilidade-Final.pdf) fundamentam o conteúdo. Na versão revisada, o slide 11 demonstra a cadeia, o 12 apresenta a matriz e o 13 encerra a exposição. As notas de cada slide também identificam as fontes.

As estimativas permanecem propostas até registro de consenso. Não foram inventados aceite do PO, entrevistas reais, reuniões, assinaturas ou resultados de testes. Antes do envio, a dupla deve conferir as versões A5/A9, revisar o conteúdo e assinar a ficha.

## Reprodução

Requer Windows com PowerPoint, Python com ReportLab e python-docx. O gerador registra as fontes na sessão do Windows e as incorpora na apresentação.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File docs/apresentacao-processos-ap2/gamma-revisada/gerar_slides.ps1
python -X utf8 docs/apresentacao-processos-ap2/gamma-revisada/gerar_apoio.py --url "https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/blob/docs/ap2-processos-2026-10-07/docs/apresentacao-processos-ap2/gamma-revisada/TechFix-AP2-Gamma-Revisada.pdf"
```

`conteudo.json` mantém as falas e tempos. O PowerPoint produz o PDF dos slides. Roteiro e ficha PDF são gerados com ReportLab. O DOCX da ficha preserva o modelo institucional, mas sua paginação no Word não foi conferida visualmente; o PDF da ficha foi inspecionado.

## Fontes tipográficas

Fontes obtidas do repositório oficial [Google Fonts](https://github.com/google/fonts), diretórios `ofl/ancizarserif`, `ofl/mozillatext` e `ofl/ibmplexmono`, sob SIL Open Font License. Os arquivos em `fontes/` acompanham suas licenças. Ancizar Serif 600 e Mozilla Text 400/600 são instâncias estáticas dos arquivos variáveis; IBM Plex Mono Regular preserva o arquivo original.
