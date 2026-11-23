# Atividade 11 — Reciclagem TechFix

- [Mini-especificação: RN1 a RN5](especificacao.md)
- [Diagrama de classes PNG](uml.png) e [SVG](uml.svg)
- [Ficha de Entrega](ficha-entrega-v11.md)
- [Ficha Padrão de Entrega em PDF](Ficha_Padrao_Entrega_Atividade_11_Final.pdf)
- [Saída da execução em imagem](terminal-v11.png) e [texto](saida-terminal-v11.txt)
- [Gerador das evidências](gerar-evidencias-v11.py)

O código Java e os testes permanecem em `backend/src`, na estrutura do Maven.
Para regerar as imagens, execute `python docs/poo/atividade-11/gerar-evidencias-v11.py` na raiz após compilar o Java; o gerador utiliza Pillow e as fontes do Windows.

A pasta está na branch `main`; a tag `v11` preserva a organização original da entrega.

## Conferência em 23/11/2026

A tag `v11` foi extraída em pasta separada e seus 19 testes passaram usando JDK 17 com `-Dmaven.compiler.release=17`, sobrescrevendo somente a configuração de compilação. Os arquivos `docs/especificacao.md`, `docs/uml.png`, a ficha em Markdown e a imagem do terminal no README estão presentes na própria tag. O histórico contém os commits `7d704d2`, `1aeb8d4` e `cb2ee6c`, respectivamente de implementação, testes e documentação. A ficha PDF atual é um complemento na branch principal. Isso confirma preparação técnica, não envio na plataforma Aula.
