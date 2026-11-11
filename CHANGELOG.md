# Changelog

Mudanças do dossiê de Processos de Engenharia de Software do TechFix (requisitos, backlog, matriz, plano de qualidade e testes). O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e as versões seguem o [Versionamento Semântico](https://semver.org/lang/pt-BR/). As tags `v11` e `v12` são entregas de POO e não fazem parte desta numeração.

## [Não publicado]

### Alterado

- Documentos reorganizados por disciplina: o dossiê passa para `docs/processos/dossie/`, a qualidade para `docs/processos/05-qualidade/` e a evolução para `docs/processos/06-evolucao/`. O conteúdo não mudou; as fichas A11–A14 foram regeneradas com os novos caminhos.

## [1.1.0] - 2026-11-11

Solicitação de mudança SM-01 (retorno de equipamento em garantia), aprovada parcialmente.

### Adicionado

- RN2: retorno em garantia vinculado a uma OS concluída do mesmo equipamento, em até 90 dias corridos após a conclusão; a OS de origem continua CONCLUÍDA.
- Critérios CA16–CA19 e casos de teste CT19–CT22, com valor limite no 90º e no 91º dia.
- Item de backlog A8R10 (I2), incremento I3 com A8R11 e item adiado A8R12 (confirmação da garantia pelo técnico).
- Risco R5 (garantia marcada para defeito diferente) e registro da SM-01 em `docs/06-evolucao/`.

### Alterado

- RF2, RF3 e HU1 passam a tratar o retorno em garantia e a exibir o vínculo entre as OS.
- A8R08 fica só com a busca por nome parcial (P); o filtro por equipamento (CA10, CT12) passa para o I3.
- Matriz de rastreabilidade com as linhas afetadas marcadas com [SM-01]; meta de Adequação funcional da A11 inclui a RN2.

### Corrigido

- Nada nesta versão.

### Removido

- Nada nesta versão. Nenhum requisito foi retirado; o filtro por equipamento foi apenas reprogramado.

## [1.0.0] - 2026-11-11

Linha de base do dossiê, antes da solicitação de mudança SM-01.

### Adicionado

- Fonte única versionada em `docs/dossie/`: requisitos (RF1–RF3, RN1, RNF1–RNF3, HU1, HU2) com critérios CA01–CA15 e matriz de perfis, backlog A8R01–A8R09 com riscos R1–R4, e matriz de rastreabilidade da origem A3 até os casos de teste.
- Plano inicial de qualidade (A11) em `docs/05-qualidade/`, com cinco características da ISO/IEC 25010:2023 e os critérios Q1–Q6 da Definition of Done.
- Revisão por inspeção (A12) com 18 achados e validação com o stakeholder.
- Estratégia e 18 casos de teste (A13), com scripts de execução no protótipo e defeitos DT01–DT05.

### Corrigido

- Tabela de requisitos validados da A5, que trazia registros de IA no lugar dos requisitos (A12, D01).
- Transições da RN1, matriz de perfis do RNF2, e-mail opcional no RF1 e referências da matriz a arquivos removidos (A12, D02–D04 e D11).

[1.1.0]: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/releases/tag/v1.0.0
