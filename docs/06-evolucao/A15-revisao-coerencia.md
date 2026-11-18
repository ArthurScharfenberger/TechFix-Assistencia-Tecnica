# Revisão de coerência da versão final AS

Data: 18/11/2026. Revisão documental apoiada pelo Codex a partir das fontes do repositório. Não é aceite do PO nem execução nova dos CT de Processos.

| Verificação | Resultado e evidência |
|---|---|
| IDs dos requisitos | RF1–RF3, RN1–RN2, RNF1–RNF3 e HU1–HU2 preservados em requisitos e matriz. IDs da A3 têm correspondência pela origem, sem confusão com RF1 atual. |
| Critérios e testes | CA01–CA19 e CT01–CT22 especificados; CT19–CT22 associados à RN2/SM-01. Cobertura de especificação não representa aprovação. |
| Execução | Saídas da A13 de 11/11: CT01, CT02, CT06, CT07 e CT09 falham; CT03 passa no cenário; CT04/CT05/CT08 parciais. CT10–CT22 sem execução registrada. Matriz e texto vivo da A13 esclarecidos. |
| Backlog e mudanças | A8R10 no I2; A8R11/CT12 no I3; A8R12 adiado. SM-01 mantém a origem CONCLUÍDA e introduz nova OS. |
| Modelos e nomes | A9 identificada como fluxograma/wireframe; A10 como arquitetura planejada C1–C4; UML de POO separado. Complemento da garantia nomeado e ligado aos IDs; refinamento de wireframes aberto em DIV06. |
| Dívidas e defeitos | DIV01/DIV02 pagas documentalmente com commits verificáveis. DIV03–DIV08 abertas; nenhum DT da A13 encerrado por inferência. |
| Riscos | R1–R4 da A8 e R5 da SM-01 preservados, com status atualizado; R6 acrescentado por migração/compatibilidade. |
| Evidências antigas | PDFs históricos permanecem como entregas originais; fonte atual, correções e decisões posteriores são identificadas nos índices. |
| Protótipo | Equipe confirmou execução local; URL localhost acompanhada de comando, credenciais demonstrativas, fluxo e limitações. |
| Ficha | Atividade A15, etapa AS, equipe, decisões, pendências, declaração de IA e assinaturas digitadas autorizadas pelo usuário. Conteúdo completo no corpo. |

Os links locais do mapa e da documentação viva são conferidos pelo script `scripts/verificar_dossie_a15.py`. O script verifica referências e presença dos IDs; a equivalência de significado foi revisada pela leitura das fontes e das tabelas. A inspeção visual do PDF complementa essa verificação.

Pendências de produto e de validação permanecem no plano da A15. O envio na plataforma da disciplina cabe à equipe.

## Verificação final de 18 de novembro de 2026

- `python scripts/verificar_dossie_a15.py`: 15 arquivos e 142 links locais conferidos; conjuntos CA01–CA19, CT01–CT22, A8R01–A8R12 e DIV01–DIV08 consistentes.
- Ficha com sete páginas renderizadas e inspecionadas; tabelas sem linhas divididas entre páginas; links clicáveis da release, do protótipo e dos commits conferidos no PDF.
- Componentes institucionais do DOCX preservados byte a byte; alterações limitadas ao corpo e aos seus hyperlinks.
- `npm test`: cinco testes do site aprovados. `npm run build`: compilação de produção concluída. Essas verificações não equivalem aos CT de Processos, cujos resultados anteriores continuam identificados.
- `git diff --check`: sem erros de espaço em branco.
