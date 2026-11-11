# A13 — Estratégia de testes e casos — Esboço

> Versão preliminar, preparada em 11/11/2026 como ponto de partida da entrega final ([A13-estrategia-e-casos-de-teste.md](A13-estrategia-e-casos-de-teste.md), seção 2.6). Não representa trabalho realizado em oficina.

## Estratégia inicial

Testar as telas do protótipo antes da AS. Testes manuais pela interface.

## Casos de teste

| ID | Requisito | Entrada | Resultado esperado |
|---|---|---|---|
| CT01 | RF1 | Dados do cliente | Cliente cadastrado |
| CT02 | RF2 | Cliente e equipamento | OS aberta |
| CT03 | RF2 | Atribuir técnico | Técnico atribuído |
| CT04 | RN1 | Concluir OS | OS concluída |
| CT05 | RF3 | Número da OS | OS encontrada |
| CT06 | RNF1 | Abrir tela | Tela abre rápido |

## Observações do esboço

- Seis casos, só do caminho feliz; nenhum caso negativo.
- Sem técnica de derivação, pré-condição ou passos.
- Resultados vagos ("cadastrado", "rápido").
- RNF2 e HU2 sem nenhum caso; RNF1 sem número.
- Sem critérios de entrada e saída, sem matriz e sem cobertura.
