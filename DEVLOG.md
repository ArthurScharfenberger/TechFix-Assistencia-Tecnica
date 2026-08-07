# DEVLOG — TechFix

Este documento registra a evolução do projeto TechFix durante o semestre.

Os registros são organizados por data e apresentam as principais alterações,
decisões, verificações e pendências de cada etapa do desenvolvimento.

---

## 05/08/2026

### Responsáveis

- Arthur Scharfenberger

### Objetivo do dia

Organizar a preparação do projeto para envio ao GitHub, consolidando a documentação inicial e ajustando os arquivos de configuração para evitar o envio de artefatos locais e temporários.

### Alterações realizadas

- Ajustes na estrutura da interface com uma sidebar recolhível e persistência do estado no navegador.
- Inclusão de uma página de Indicativos com filtros, cards e gráficos para análise dos dados.
- Implementação do módulo de Equipe com cadastro, listagem, filtros e gerenciamento de funcionários.
- Melhorias nas páginas de ordens de serviço e reparos para utilizar o fluxo de cliente, técnico e equipamento de forma mais consistente.
- Atualização do fluxo de equipamentos para gerar códigos automáticos no padrão TFX-EQP-000001 e remover o uso legado de patrimônio.
- Aprimoramento do feedback visual com toasts e confirmação antes de limpar dados.

### Decisões tomadas

- O domínio do sistema passou a tratar clientes, equipamentos, ordens e reparos como registros principais do fluxo de assistência.
- Equipamentos recebem códigos internos automáticos, em vez de depender de patrimônio empresarial.
- O estado da sidebar e das preferências visuais permanece salvo no navegador.
- A equipe passou a ser tratada como módulo próprio para vincular funcionários às ordens e aos reparos.

### Verificações realizadas

- Leitura do README e do package.json para identificar objetivo, integrantes e estrutura do projeto.
- Verificação da presença de arquivos de build, logs, temporários e possíveis arquivos sensíveis na pasta do projeto.
- Execução do comando de build do projeto para validar a compilação atual.

### Problemas encontrados

- O repositório não apresentou histórico de commits com registros de hoje, o que dificultou a confirmação de alterações por data.
- A pasta do projeto contém artefatos gerados como dist, logs e node_modules, que precisam ser excluídos do envio.
- O projeto não possui scripts de lint ou testes configurados no package.json.

### Pendências / próximos passos

- Confirmar se o repositório remoto será criado com o conteúdo atual do projeto.
- Revisar os dados locais e decidir se os arquivos de logs devem permanecer na pasta do repositório ou ser mantidos apenas localmente.
- Incluir documentação adicional do fluxo de uso, se a equipe desejar ampliar o material acadêmico.

### Arquivos principais modificados

- src/components/sidebar.ts
- src/pages/indicativos.ts
- src/pages/equipe.ts
- src/services/equipamentoService.ts
- src/pages/chamados.ts
- src/pages/manutencoes.ts

### Commits relacionados

- Alterações ainda não commitadas.

## 06/08/2026 — Módulo de Relatórios

- Adicionado menu expansível de Relatórios com visão geral e quatro categorias.
- Implementados filtros por período e entidades, resumos, tabelas, paginação, ordenação e gráficos compactos com dados reais.
- Incluídas exportação CSV em UTF-8, impressão A4/PDF, documento individual de ordem e logs de visualização/exportação.
- Integradas novas rotas protegidas, estados vazios, tema claro/escuro e layouts responsivos para desktop, sidebar recolhida e drawer mobile.
- Verificação executada com `npm run build` (TypeScript e Vite).
