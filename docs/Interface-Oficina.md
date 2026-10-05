# Interface da oficina TechFix

A interface segue a referência aprovada: logo oficial em `src/img/logo.png`, cabeçalho preto, área branca, azul ciano, tabela central e divisórias discretas. O enquadramento da logo é feito por CSS, preservando o arquivo original. A paleta compartilhada está em `src/styles/workshop.css`.

## Dados e adaptações

- **Ordens ativas:** status `ABERTO`, `EM_ATENDIMENTO` ou `AGUARDANDO_USUARIO`.
- **Em bancada:** quantidade de reparos com status `EM_ANDAMENTO`.
- **Ordens concluídas:** ordens com status `CONCLUIDO`; não significa entrega ao cliente.
- **Custos do mês:** soma do campo `custo` dos reparos criados no mês atual, conforme o calendário local. Não representa receita ou faturamento recebido.
- **Abertura:** data real de criação da ordem. O modelo não possui prazo de entrega.
- **Etapas:** usam os status existentes, sem criar diagnóstico, aprovação de orçamento ou retirada como novos estados.
- **Atenção hoje:** ordens ativas urgentes, sem técnico ou aguardando cliente. As ações aplicam filtros na fila.
- **Na bancada:** técnicos ativos com suas ordens ativas atribuídas. “Ativo” é o status cadastral; não indica disponibilidade.
- **Ritmo da semana:** ordens criadas entre segunda e domingo da semana atual, incluindo as que posteriormente foram concluídas ou canceladas.
- **Últimas atualizações:** última atualização registrada em cada ordem; não é um histórico completo de eventos.

Os registros da imagem de referência não foram adicionados ao sistema. A aplicação continua usando a autenticação e os serviços de armazenamento local existentes. O backend Java de POO permanece independente.

## Navegação e ações

O cabeçalho oferece Oficina, Clientes, Equipamentos, Equipe e Relatórios. O menu Mais preserva Ordens, Reparos e Indicadores. Em telas menores, o menu lateral reúne os módulos. A engrenagem abre as configurações existentes, incluindo tema, exportação de logs e limpeza de dados com confirmação. A conta mantém a opção de sair.

Abrir ordem, atribuir técnico e consultar detalhes reutilizam os formulários e validações de Ordens. A fila possui busca por ordem, cliente ou equipamento, filtros por etapa, técnico e prioridade, ordenação por abertura e paginação de seis registros.

Na primeira abertura desta versão, o tema claro é aplicado para apresentar o layout aprovado. Escolhas de tema posteriores continuam salvas. Ambos os temas usam superfícies sólidas.

## Validação em 05/10/2026

- Build TypeScript/Vite e cinco testes de regressão do site aprovados.
- Conferência em Chromium com contexto temporário, sem alterar os dados do navegador do usuário.
- Verificados login, estado vazio, busca, filtros, paginação, detalhes, formulário de atribuição, criação de ordem, configurações e acesso aos módulos.
- Conferidas capturas em 1586, 1280, 768 e 390 pixels de largura; rolagem horizontal restrita à tabela e às abas em telas pequenas.
- Conferida a ausência de gradientes, sombras e blur nos estilos e nos elementos renderizados da oficina.

O projeto não possui comando de lint configurado. Capturas e script de verificação local ficam em `tmp/`, que não é versionado.
