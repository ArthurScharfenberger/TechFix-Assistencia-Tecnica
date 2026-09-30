# TechFix — Esboço da arquitetura e início da matriz de rastreabilidade

**Disciplina:** Processos de Engenharia de Software

**Equipe:** Arthur Scharfenberger e Lucas Oliveira da Silva

**Preparação:** 30/09/2026

**Entrega:** rascunho da oficina; código e etapa conforme o AVA.

## 1. Objetivo e fontes

Organizar os componentes principais do TechFix e relacionar requisitos às necessidades da entrevista e aos artefatos de modelagem e arquitetura.

Base consultada: `docs/Atividade04.md` (requisitos e pontos RE1–RE5 da entrevista A3), `A8-Entrega-Final-Revisada.md` (backlog) e `Modelagem-Entrega-Final.md` (fluxograma e wireframe). Os arquivos de modelagem são usados como referência para a A9 mencionada no enunciado; seu código ainda precisa ser confirmado. Não foi localizado um artefato identificado como A7 nem a transcrição original da entrevista A3 de Processos. As origens abaixo são paráfrases registradas na A4, não citações diretas da entrevista. O arquivo `docs/atividade-semanal-03.md` pertence à atividade de POO e não é a entrevista.

## 2. Esboço da arquitetura conceitual

Proposta: aplicação organizada em interface, lógica de negócio e armazenamento. Atendentes, técnicos e administradores utilizam a interface; as operações seguem para o servidor, que verifica permissões, aplica regras e acessa os dados.

| Componente | Responsabilidade | Comunicação |
|---|---|---|
| C1 — Interface web | Exibir cadastro de cliente/equipamento, abertura, consulta e atualização de OS; apresentar erros e confirmações. | Envia solicitações à API de C2 e apresenta as respostas. |
| C2 — API e lógica de negócio | Receber operações; validar dados e vínculo cliente/equipamento; gerar número e data da OS; controlar estados, responsável e histórico. | Consulta C3 para autorização e usa C4 para ler/gravar dados. |
| C3 — Autenticação e autorização | Identificar o usuário e verificar permissões de atendente, técnico e administrador. | Atua no servidor antes de cada operação protegida; consulta usuários e perfis por C4. |
| C4 — Persistência e banco de dados | Armazenar clientes, equipamentos, OS, técnicos, usuários/perfis e eventos do histórico. | Recebe consultas e gravações de C2/C3; retorna dados ou falha. |
| Integrações externas | Nenhuma necessária para os requisitos deste esboço. | E-mail, WhatsApp e pagamentos ficam fora desta proposta até existir requisito aprovado. |

**Caminho principal:** usuário → C1 → C2 → C4; o resultado retorna de C4 para C2 e C1. C2 verifica a autorização em C3 antes de executar a operação. A interface não acessa diretamente o banco.

**Comunicação proposta:** C1 e C2 trocam solicitações e respostas por uma API HTTP com JSON; em implantação, usar HTTPS. C2/C3 acessam C4 por uma camada de persistência. A escolha do framework e do banco fica para o detalhamento. Os componentes podem pertencer a uma única aplicação no servidor, sem necessidade de serviços separados.

### Exemplo: abrir uma ordem de serviço

1. O atendente seleciona ou cadastra cliente e equipamento na interface (C1).
2. A API recebe a solicitação (C2) e verifica identidade e permissão (C3).
3. C2 valida campos obrigatórios e se o equipamento pertence ao cliente.
4. C2 gera número único, data/hora e estado ABERTA; C4 grava a OS e seu evento inicial de histórico na mesma transação.
5. Após a gravação, C1 apresenta o protocolo. Se ocorrer falha, informa o problema e mantém os dados do formulário para nova tentativa.

O técnico pode ser atribuído depois da abertura, conforme a modelagem existente. Na evolução do atendimento, C2 exige responsável para iniciar o serviço e controla o ciclo ABERTA → EM ATENDIMENTO → CONCLUÍDA, impedindo regressão após a conclusão.

### Relação com o projeto atual

O frontend TypeScript/Vite utiliza armazenamento local no navegador. As classes Java representam parte do domínio e executam separadamente. API, autenticação no servidor, banco e integração entre frontend e Java são componentes propostos, ainda não implementados. O esboço não declara essas funcionalidades como prontas.

## 3. Início da matriz de rastreabilidade

| Requisito | Origem na entrevista A3, conforme A4 | Item da A8 revisada | Artefato gerado a partir do requisito | Componente responsável |
|---|---|---|---|---|
| RF1 — Cadastrar clientes e equipamentos com os dados necessários ao atendimento. | RE1: atendente utiliza papel/planilhas e precisa registrar dados de cliente e equipamento. | A8R02 — Cadastrar cliente e equipamento vinculado. | Modelagem: fluxograma, etapa de seleção/cadastro; wireframe Nova OS, campos e cadastro rápido de cliente/equipamento. | C1 apresenta o cadastro; C2 valida dados e vínculo; C4 persiste os registros. |
| RF2 — Criar e acompanhar OS, com status e técnico responsável. | RE2: cada atendimento precisa de OS com status definido e técnico responsável. | A8R03 — Abrir OS; A8R06 — Atribuir técnico e iniciar atendimento; A8R07 — Concluir atendimento. | Modelagem: fluxograma de abertura e wireframe Nova OS cobrem A8R03. Este esboço atribui a C2 o controle de responsável e estados de A8R06/A8R07, ainda sem modelo de tela específico. | C1 recebe ações; C2 cria a OS e controla seu ciclo; C4 grava OS e eventos. |
| RNF2 — Bloquear acesso sem permissão a dados administrativos e valores. | RE4: dados administrativos e valores não devem ficar disponíveis a todos os usuários. | A8R01 — Acesso por perfil. | Modelagem: decisão de autorização no fluxograma. Arquitetura: C3 verifica permissões no servidor, inclusive em solicitações diretas à API. | C3 verifica acesso; C2 aplica a decisão antes de consultar ou alterar dados. |

**Localização dos modelos:** `Modelagem-Entrega-Final.md`, seções 2.2 e 2.3; imagens `final-fluxograma.png` e `final-wireframe.png`, nesta mesma pasta. Os IDs RF1, RF2, RNF2 e RE1/RE2/RE4 foram preservados da A4; os IDs A8R pertencem à revisão da A8.

## 4. Decisões e pendências

- Manter cadastro e abertura de OS como foco inicial, coerente com A8R02/A8R03 e os modelos existentes.
- Centralizar validações e permissões no servidor; gravar OS e evento inicial juntos.
- Completar a matriz com RF3, RN1, RNF1 e histórias de usuário na próxima etapa.
- Conferir a entrevista A3 original e o artefato A7 quando disponíveis, confirmar a identificação da A9 e detalhar tecnologia de persistência e permissões por operação.

## 5. Uso de inteligência artificial

ChatGPT/Codex auxiliou na elaboração deste rascunho em 30/09/2026, a partir do enunciado e dos documentos locais. Foram conferidos os IDs, os vínculos registrados na A4 e a coerência com o backlog e a modelagem. A revisão final pelos integrantes permanece pendente. Uso registrado também em `DEVLOG.md`.
