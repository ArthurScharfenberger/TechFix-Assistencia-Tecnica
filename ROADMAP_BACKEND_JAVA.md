# Roadmap de POO, Backend Java e Integração — TechFix

## Período

Planejamento das aulas de segunda-feira entre **10/08/2026 e 14/12/2026**.

## Objetivo final

Evoluir as classes Java básicas do TechFix até formar um backend capaz de persistir e fornecer ao frontend os mesmos recursos que já existem hoje:

- autenticação;
- clientes;
- equipamentos;
- equipe e técnicos;
- ordens de serviço;
- reparos;
- dashboard e indicativos;
- relatórios.

Este roteiro não inclui funcionalidades novas. Ele transforma em Java e integra somente o domínio e os comportamentos que já estão presentes no frontend TypeScript.

## Premissas

- As primeiras aulas permanecem focadas em Programação Orientada a Objetos com Java padrão.
- Spring Boot, Maven, banco de dados e API serão introduzidos apenas depois que o modelo orientado a objetos estiver consolidado.
- O frontend continuará funcionando com `localStorage` durante a construção do backend.
- A integração será feita módulo por módulo, evitando substituir toda a persistência de uma vez.
- Preferências visuais, como tema, sidebar e filtros temporários, podem continuar no navegador.
- Dados operacionais, autenticação e regras de negócio deverão migrar para o backend.

## Correspondência entre frontend e backend

| Frontend atual | Nome adotado no Java | Observação |
| --- | --- | --- |
| `Usuario` | `Cliente` | No frontend, a página de usuários representa os clientes. |
| `Funcionario` | `Funcionario` | Técnicos serão funcionários com cargo `TECNICO`. |
| `Equipamento` | `Equipamento` | Deve continuar associado a um cliente. |
| `Chamado` | `OrdemServico` | Será padronizado com o nome usado no domínio da assistência. |
| `Manutencao` | `Reparo` | Representa o serviço realizado no equipamento. |
| `AuthAccount` | `ContaAcesso` | Responsável somente pelo acesso ao sistema. |
| `AuthSession` | `SessaoUsuario` ou sessão do Spring Security | Não é uma entidade principal do domínio. |

---

# Fase 1 — Fundamentos de POO e modelo de domínio

## 10/08/2026 — Estrutura Java inicial

### Objetivo da aula

Separar a atividade Java do frontend e criar o primeiro cenário orientado a objetos.

### Classes

- `Cliente`
- `Tecnico`
- `Equipamento`
- `OrdemServico`
- `Main`

### Implementação

#### Cliente

- atributos `nome`, `telefone` e `email`;
- construtor com os três atributos;
- método `exibirDados()`;
- método `getNome()`.

#### Tecnico

- atributos `nome` e `especialidade`;
- construtor;
- método `exibirDados()`;
- método `getNome()`.

#### Equipamento

- atributos `tipo`, `marca` e `defeito`;
- construtor;
- método `exibirDados()`.

#### OrdemServico

- atributos `numero`, `cliente`, `tecnico`, `equipamento` e `status`;
- status inicial `Aberta`;
- método `alterarStatus(String novoStatus)`;
- método `exibirOrdemServico()`.

#### Main

- criar os quatro objetos;
- associá-los;
- exibir a ordem;
- alterar o status para `Em atendimento`;
- exibir novamente.

### Entrega da aula

- cinco arquivos compilando com `javac`;
- execução de `Main` sem erro;
- diagrama de classes atualizado;
- arquivos `.class` ignorados pelo Git.

### Situação

Esta etapa já foi realizada no projeto.

---

## 17/08/2026 — Encapsulamento, identidade e representação dos objetos

### Objetivo da aula

Preparar as classes para representar os registros que já existem no frontend, ainda usando apenas Java padrão.

### Alterações nas classes

#### Cliente

Adicionar:

- `id: String`;
- `status: StatusCliente`;
- `criadoEm: LocalDateTime`;
- `atualizadoEm: LocalDateTime`.

Métodos:

- `getId()`;
- `getNome()`;
- `getEmail()`;
- `getTelefone()`;
- `getStatus()`;
- `atualizarDados(String nome, String telefone, String email)`;
- `ativar()`;
- `inativar()`;
- `toString()`.

#### Tecnico

Não ampliar definitivamente essa classe ainda. Comparar seu papel com o `Funcionario` existente no frontend e registrar que um técnico é um tipo de funcionário.

#### Equipamento e OrdemServico

Adicionar apenas `id` e métodos de consulta necessários para testar associações.

### Conceitos de POO

- atributos privados;
- métodos públicos;
- responsabilidade da classe;
- identidade de objeto;
- construtores;
- `toString()`;
- comparação entre expor setters e criar métodos com intenção de negócio.

### Testes no Main

- criar dois clientes;
- atualizar os dados de um cliente;
- inativar e reativar o cliente;
- comprovar que cada objeto possui identidade própria.

### Entrega da aula

- classes encapsuladas;
- nenhum setter genérico desnecessário;
- `Main` demonstrando as mudanças.

---

## 24/08/2026 — Enums e padronização dos estados

### Objetivo da aula

Substituir textos livres pelos mesmos estados controlados utilizados pelo frontend.

### Enums

Criar:

- `StatusCliente`: `ATIVO`, `INATIVO`;
- `TipoEquipamento`: `NOTEBOOK`, `DESKTOP`, `MONITOR`, `IMPRESSORA`, `CELULAR`, `OUTRO`;
- `StatusEquipamento`: `DISPONIVEL`, `EM_USO`, `EM_MANUTENCAO`, `DESCARTADO`;
- `PrioridadeOrdem`: `BAIXA`, `NORMAL`, `ALTA`, `URGENTE`;
- `StatusOrdem`: `ABERTO`, `EM_ATENDIMENTO`, `AGUARDANDO_USUARIO`, `CONCLUIDO`, `CANCELADO`.

### Alterações

- trocar `String status` pelos enums correspondentes;
- trocar `String tipo` de `Equipamento` por `TipoEquipamento`;
- trocar a prioridade textual da ordem por `PrioridadeOrdem`;
- manter textos de apresentação apenas em métodos de exibição.

### Métodos

#### OrdemServico

- `iniciarAtendimento()`;
- `aguardarUsuario()`;
- `concluir()`;
- `cancelar()`;
- `podeSerAlterada()`.

Evitar que `alterarStatus()` aceite qualquer texto. As mudanças devem representar os estados já existentes no frontend.

### Testes no Main

- criar ordem `ABERTO`;
- avançar para `EM_ATENDIMENTO`;
- concluir;
- tentar uma transição inválida e apresentar a mensagem de erro.

---

## 31/08/2026 — Herança, composição e funcionário técnico

### Objetivo da aula

Alinhar `Tecnico` ao módulo de equipe existente no frontend.

### Classes e enums

Criar:

- `Funcionario`;
- `CargoFuncionario` com `ATENDENTE`, `TECNICO`, `SUPERVISOR`, `ADMINISTRADOR`;
- `StatusFuncionario` com `ATIVO`, `INATIVO`;
- `EspecialidadeFuncionario` com as especialidades já usadas no frontend.

### Modelo recomendado

Usar `Funcionario` como classe principal. O cargo define se o funcionário é técnico. Não é necessário manter duas fontes de dados separadas para `Funcionario` e `Tecnico`.

### Atributos de Funcionario

- `id`;
- `nome`;
- `email`;
- `telefone`;
- `cargo`;
- `especialidades`;
- `status`;
- `observacoes`;
- `criadoEm`;
- `atualizadoEm`.

### Métodos

- `podeReceberServico()`;
- `adicionarEspecialidade(EspecialidadeFuncionario especialidade)`;
- `removerEspecialidade(EspecialidadeFuncionario especialidade)`;
- `atualizarDados(...)`;
- `ativar()`;
- `inativar()`;
- getters necessários;
- `toString()`.

### Regras

- somente funcionário ativo com cargo `TECNICO` pode receber ordem ou reparo;
- especialidades não podem ser duplicadas;
- técnico inativo permanece no histórico, mas não recebe novas atribuições.

### Entrega

- `OrdemServico` passa a referenciar `Funcionario tecnicoResponsavel`;
- cenário testa técnico válido, atendente e técnico inativo.

---

## 07/09/2026 — Feriado nacional: revisão e contingência

Não planejar conteúdo obrigatório. Se houver atividade assíncrona:

- revisar encapsulamento, enums, associações e coleções;
- atualizar o diagrama de classes;
- corrigir pendências das quatro primeiras aulas;
- garantir que `javac` e `java Main` continuam funcionando.

---

## 14/09/2026 — Equipamento completo e relacionamento com cliente

### Objetivo da aula

Levar `Equipamento` ao mesmo nível do modelo TypeScript atual.

### Atributos

- `id`;
- `codigo`;
- `tipo`;
- `fabricante`;
- `modelo`;
- `numeroSerie`;
- `status`;
- `cliente`;
- `dataAquisicao`;
- `observacoes`;
- `criadoEm`;
- `atualizadoEm`.

### Métodos

- `atualizarDados(...)`;
- `alterarStatus(StatusEquipamento novoStatus)`;
- `vincularCliente(Cliente cliente)`;
- `pertenceAoCliente(String clienteId)`;
- `marcarEmManutencao()`;
- `marcarDisponivel()`;
- getters necessários;
- `toString()`.

### Classe auxiliar

Criar `GeradorCodigoEquipamento` com:

- `gerarProximoCodigo()`;
- formato `TFX-EQP-000001` já utilizado pelo frontend.

### Regras

- fabricante e modelo obrigatórios;
- número de série, quando informado, deve ser único na coleção de equipamentos;
- cliente obrigatório;
- código gerado não pode ser editado;
- equipamento descartado não pode entrar em manutenção.

### Entrega

- criar vários equipamentos para clientes diferentes;
- listar equipamentos de determinado cliente;
- validar código e número de série.

---

## 21/09/2026 — Ordem de serviço completa

### Objetivo da aula

Substituir o modelo inicial pelo conjunto de dados já usado em `Chamado` no frontend.

### Atributos de OrdemServico

- `id`;
- `titulo`;
- `descricao`;
- `cliente`;
- `equipamento`;
- `prioridade`;
- `status`;
- `tecnicoResponsavel` opcional;
- `criadoEm`;
- `atualizadoEm`;
- `concluidoEm` opcional.

### Métodos

- `atribuirTecnico(Funcionario tecnico)`;
- `removerTecnico()`;
- `iniciarAtendimento()`;
- `aguardarUsuario()`;
- `concluir()`;
- `cancelar()`;
- `atualizarDescricao(String titulo, String descricao)`;
- `pertenceAoCliente(String clienteId)`;
- `refereSeAoEquipamento(String equipamentoId)`;
- getters necessários;
- `toString()`.

### Regras

- cliente, equipamento, título, descrição e prioridade obrigatórios;
- equipamento deve pertencer ao cliente informado;
- técnico precisa estar ativo e ser atribuível;
- ordem começa como `ABERTO`;
- `concluidoEm` é preenchido ao concluir;
- ao sair de `CONCLUIDO`, a regra deverá ser definida e testada conforme o comportamento atual do frontend;
- ordem cancelada ou concluída não recebe alterações operacionais sem uma regra explícita.

### Entrega

- cenário completo de abertura, atribuição e conclusão;
- testes de equipamento pertencente a outro cliente e funcionário não técnico.

---

## 28/09/2026 — Reparo e sincronização com equipamento

### Objetivo da aula

Criar no Java o módulo `Manutencao` do frontend com o nome de domínio `Reparo`.

### Enum

Criar `StatusReparo`:

- `AGENDADA`;
- `EM_ANDAMENTO`;
- `CONCLUIDA`;
- `CANCELADA`.

### Atributos de Reparo

- `id`;
- `equipamento`;
- `descricao`;
- `tecnicoResponsavel` opcional;
- `custo: BigDecimal`;
- `dataInicio`;
- `dataConclusao` opcional;
- `status`;
- `criadoEm`;
- `atualizadoEm`.

### Métodos

- `atribuirTecnico(Funcionario tecnico)`;
- `removerTecnico()`;
- `iniciar()`;
- `concluir()`;
- `cancelar()`;
- `atualizarDescricao(String descricao)`;
- `alterarCusto(BigDecimal custo)`;
- getters necessários;
- `toString()`.

### Regras

- equipamento e descrição obrigatórios;
- custo não pode ser negativo;
- somente técnico ativo pode ser atribuído;
- ao iniciar, equipamento fica `EM_MANUTENCAO`;
- ao concluir, equipamento volta a `DISPONIVEL`;
- conclusão preenche `dataConclusao`.

### Entrega

- demonstrar reparo agendado, iniciado e concluído;
- confirmar sincronização do status do equipamento.

---

# Fase 2 — Coleções, serviços e regras de negócio

## 05/10/2026 — Serviços em memória e operações CRUD

### Objetivo da aula

Retirar do `Main` a responsabilidade de localizar, validar e armazenar objetos.

### Interfaces

Criar uma interface simples `Repositorio<T>`:

- `salvar(T objeto)`;
- `buscarPorId(String id)`;
- `listarTodos()`;
- `removerPorId(String id)`;
- `existePorId(String id)`.

### Implementações em memória

- `ClienteRepositorioMemoria`;
- `FuncionarioRepositorioMemoria`;
- `EquipamentoRepositorioMemoria`;
- `OrdemServicoRepositorioMemoria`;
- `ReparoRepositorioMemoria`.

Usar `Map<String, T>` para impedir IDs duplicados e facilitar buscas.

### Serviços

Criar:

- `ClienteService`;
- `FuncionarioService`;
- `EquipamentoService`;
- `OrdemServicoService`;
- `ReparoService`.

Cada serviço começa com:

- `criar(...)`;
- `buscarPorId(String id)`;
- `listar()`;
- `atualizar(...)`;
- `excluir(String id)`.

### Regras de exclusão

- cliente com equipamento não pode ser excluído;
- funcionário com ordens ou reparos não pode ser excluído;
- equipamento com ordens ou reparos não deve ser excluído sem regra de histórico.

### Entrega

- `Main` usa serviços e não manipula diretamente as coleções internas.

---

## 12/10/2026 — Feriado nacional: testes e revisão

Não planejar conteúdo obrigatório. Atividade opcional:

- revisar todos os métodos de serviço;
- testar criação, busca, atualização e exclusão;
- documentar as exceções esperadas;
- corrigir duplicidade de validações;
- atualizar UML com serviços e repositórios apenas se solicitado na disciplina.

---

## 19/10/2026 — Exceções e validação do domínio

### Objetivo da aula

Substituir retornos ambíguos e mensagens espalhadas por erros claros do domínio.

### Exceções

Criar:

- `RecursoNaoEncontradoException`;
- `RegraNegocioException`;
- `DadosInvalidosException`;
- `EmailDuplicadoException`;
- `NumeroSerieDuplicadoException`.

### Validações reutilizáveis

Criar `ValidadorDados` com métodos estáticos:

- `obrigatorio(String valor, String campo)`;
- `emailValido(String email)`;
- `valorNaoNegativo(BigDecimal valor, String campo)`;
- `dataNaoFutura(LocalDate data, String campo)`, quando aplicável.

### Ajustes nos serviços

- validar unicidade de e-mail de cliente e funcionário;
- validar número de série;
- validar associações antes de salvar;
- lançar exceção quando o ID não for encontrado;
- manter mensagens adequadas para futura resposta HTTP.

### Testes

- dados vazios;
- e-mail inválido e duplicado;
- número de série duplicado;
- associação inexistente;
- transição inválida de status;
- exclusão bloqueada.

---

## 26/10/2026 — Indicadores e relatórios como consultas Java

### Objetivo da aula

Reproduzir em Java somente os cálculos já existentes em `IndicativosService` e `RelatorioService`.

### Classes de consulta

- `IndicadoresService`;
- `RelatorioService`;
- `FiltroPeriodo`;
- `ResumoIndicador`;
- classes de linha para os quatro relatórios existentes.

### Métodos de IndicadoresService

- `contarOrdensPorStatus(...)`;
- `contarOrdensPorPrioridade(...)`;
- `calcularTaxaConclusao(...)`;
- `calcularTempoMedioConclusao(...)`;
- `calcularValorTotalReparos(...)`;
- `calcularDesempenhoPorTecnico(...)`;
- `listarClientesComMaisOrdens(...)`;
- `listarEquipamentosRecorrentes(...)`.

### Métodos de RelatorioService

- `gerarRelatorioOrdens(FiltroRelatorio filtro)`;
- `gerarRelatorioReparos(FiltroRelatorio filtro)`;
- `gerarRelatorioEquipe(FiltroRelatorio filtro)`;
- `gerarRelatorioClientesEquipamentos(FiltroRelatorio filtro)`.

### Conteúdo de POO

- composição de objetos;
- coleções;
- filtros;
- ordenação;
- agregação;
- `Stream API`, se já fizer parte do conteúdo da disciplina.

### Limite

CSV, gráficos e impressão continuam no frontend. O Java entrega dados e totais, não elementos visuais.

---

## 02/11/2026 — Feriado nacional: consolidação do domínio

Não planejar conteúdo obrigatório. Usar como margem para:

- concluir tarefas atrasadas;
- revisar nomenclatura Java versus TypeScript;
- atualizar o diagrama final de domínio;
- executar todos os cenários pelo `Main`;
- preparar a transição de Java básico para backend web.

### Marco esperado

Ao final desta fase, todas as regras operacionais atuais do frontend devem possuir uma representação em Java, ainda que usando repositórios em memória.

---

# Fase 3 — Transformação em backend web

## 09/11/2026 — Fundação Spring Boot e API de clientes

### Objetivo da aula

Transformar o código Java em uma aplicação web sem tentar migrar todos os módulos no mesmo dia.

### Infraestrutura

- criar projeto Spring Boot com Maven;
- manter Java 17;
- adicionar Spring Web, Validation, Data JPA e driver do banco escolhido;
- organizar packages `controller`, `service`, `repository`, `entity`, `dto`, `exception` e `config`;
- criar configuração de desenvolvimento;
- configurar CORS para o endereço do Vite.

### Primeiro módulo vertical: Cliente

Criar:

- `ClienteEntity` ou adaptar `Cliente` para persistência;
- `ClienteRepository`;
- `ClienteService`;
- `ClienteController`;
- `CriarClienteRequest`;
- `AtualizarClienteRequest`;
- `ClienteResponse`.

### Endpoints

- `GET /api/clientes`;
- `GET /api/clientes/{id}`;
- `POST /api/clientes`;
- `PUT /api/clientes/{id}`;
- `DELETE /api/clientes/{id}`.

### Métodos do service

- `listar()`;
- `buscarPorId(String id)`;
- `criar(CriarClienteRequest request)`;
- `atualizar(String id, AtualizarClienteRequest request)`;
- `excluir(String id)`;
- `validarEmailUnico(String email, String idIgnorado)`.

### Entrega

- API inicial funcionando;
- respostas JSON;
- erros padronizados;
- teste manual dos cinco endpoints.

---

## 16/11/2026 — Banco de dados e módulos de equipe e equipamentos

### Objetivo da aula

Persistir os relacionamentos necessários para ordens e reparos.

### Banco

Criar tabelas/migrations para:

- `clientes`;
- `funcionarios`;
- `funcionario_especialidades`;
- `equipamentos`.

### Funcionario

Implementar repository, service, DTOs e controller com:

- listar;
- buscar por ID;
- criar;
- atualizar;
- ativar/inativar;
- listar técnicos atribuíveis;
- excluir respeitando vínculos.

### Equipamento

Implementar repository, service, DTOs e controller com:

- listar e filtrar por cliente;
- buscar por ID;
- criar com código automático;
- atualizar;
- alterar status;
- excluir respeitando vínculos;
- validar cliente e número de série.

### Endpoints principais

- `/api/funcionarios`;
- `/api/funcionarios/atribuiveis`;
- `/api/equipamentos`;
- `/api/equipamentos?clienteId={id}`;
- `/api/equipamentos/{id}/status`.

### Entrega

- reiniciar a aplicação sem perder os dados;
- confirmar chaves estrangeiras;
- confirmar que equipamento inválido não é persistido.

---

## 23/11/2026 — API de ordens e reparos

### Objetivo da aula

Implementar o fluxo operacional principal do TechFix.

### OrdemServico

Criar entity, repository, DTOs, service e controller.

Métodos do service:

- `listar(FiltroOrdem filtro)`;
- `buscarPorId(String id)`;
- `abrir(CriarOrdemRequest request)`;
- `atualizar(String id, AtualizarOrdemRequest request)`;
- `atribuirTecnico(String ordemId, String funcionarioId)`;
- `removerTecnico(String ordemId)`;
- `alterarStatus(String id, StatusOrdem status)`;
- `excluir(String id)`.

### Reparo

Criar entity, repository, DTOs, service e controller.

Métodos do service:

- `listar(FiltroReparo filtro)`;
- `buscarPorId(String id)`;
- `criar(CriarReparoRequest request)`;
- `atualizar(String id, AtualizarReparoRequest request)`;
- `atribuirTecnico(String reparoId, String funcionarioId)`;
- `iniciar(String id)`;
- `concluir(String id)`;
- `cancelar(String id)`;
- `excluir(String id)`;
- `calcularCustoTotal()`.

### Transações

Usar transação na atualização conjunta de reparo e equipamento, evitando que um seja alterado sem o outro.

### Entrega

- abrir ordem usando cliente e equipamento persistidos;
- atribuir técnico;
- criar e concluir reparo;
- confirmar status do equipamento e datas de conclusão.

---

## 30/11/2026 — Autenticação, autorização, indicadores e relatórios

### Objetivo da aula

Substituir a autenticação local e disponibilizar as consultas já usadas pelas telas analíticas.

### Autenticação

Criar:

- `ContaAcesso`;
- `ContaAcessoRepository`;
- `AuthService`;
- `AuthController`;
- `LoginRequest`;
- `UsuarioAutenticadoResponse`;
- configuração do Spring Security.

Métodos:

- `autenticar(String identificador, String senha)`;
- `buscarUsuarioAtual()`;
- `encerrarSessao()`;
- `podeAcessarSistema()`;
- `possuiCargo(CargoFuncionario cargo)`.

Endpoints:

- `POST /api/auth/login`;
- `POST /api/auth/logout`;
- `GET /api/auth/me`.

### Segurança

- senha com algoritmo próprio para armazenamento de senhas;
- nunca devolver hash ao frontend;
- proteger endpoints;
- aplicar permissões de acordo com os cargos já existentes;
- remover a conta administrativa fixa do navegador quando a integração for concluída.

### Consultas analíticas

Disponibilizar:

- `GET /api/indicadores`;
- `GET /api/relatorios/ordens`;
- `GET /api/relatorios/reparos`;
- `GET /api/relatorios/equipe`;
- `GET /api/relatorios/clientes-equipamentos`.

Aceitar somente os filtros que as telas atuais já oferecem.

---

# Fase 4 — Integração com o frontend

## 07/12/2026 — Integração gradual dos cadastros e operações

### Objetivo da aula

Substituir o `localStorage` operacional por chamadas HTTP sem alterar o comportamento visível das páginas.

### Infraestrutura no frontend

Criar:

- `src/api/apiClient.ts`;
- configuração `VITE_API_URL`;
- tratamento comum de JSON, erros HTTP e sessão expirada;
- estados de carregamento nas páginas.

### Métodos do apiClient

- `get<T>(caminho)`;
- `post<T>(caminho, corpo)`;
- `put<T>(caminho, corpo)`;
- `patch<T>(caminho, corpo)`;
- `delete(caminho)`.

### Migração dos services TypeScript

Transformar em clientes assíncronos:

- `UsuarioService` → `ClienteApi`;
- `FuncionarioService` → `FuncionarioApi`;
- `EquipamentoService` → `EquipamentoApi`;
- `ChamadoService` → `OrdemServicoApi`;
- `ManutencaoService` → `ReparoApi`.

### Ordem de integração

1. clientes;
2. funcionários;
3. equipamentos;
4. ordens de serviço;
5. reparos.

### Ajustes necessários nas páginas

- tornar carregamentos assíncronos;
- aguardar criação, edição e exclusão;
- mostrar carregamento;
- mostrar erros devolvidos pelo backend;
- atualizar listas depois de operações;
- preservar filtros, paginação e modais atuais;
- impedir duplo envio de formulário.

### LocalStorage que permanece

- tema;
- estado da sidebar;
- filtros temporários;
- preferências puramente visuais.

### LocalStorage que deve deixar de ser fonte oficial

- clientes;
- equipamentos;
- funcionários;
- ordens;
- reparos;
- contas e autenticação;
- logs operacionais que precisarem de auditoria no servidor.

---

## 14/12/2026 — Integração final, testes e entrega

### Objetivo da aula

Concluir autenticação, dashboard, indicadores, relatórios e validar o sistema ponta a ponta.

### Integração final

- substituir `AuthService` local pelos endpoints de autenticação;
- carregar usuário atual pelo backend;
- proteger navegação e operações conforme cargo;
- conectar indicadores e relatórios;
- manter gráficos, CSV e impressão no frontend;
- usar os dados e totais devolvidos pela API;
- remover dependências operacionais restantes do `localStorage`.

### Estratégia para dados existentes

Escolher uma única opção antes da entrega:

1. iniciar o banco com dados de demonstração equivalentes;
2. exportar os dados atuais do navegador e importá-los no backend;
3. começar com banco vazio.

Não misturar registros locais e registros do servidor após a integração final.

### Testes ponta a ponta

Validar:

1. login e logout;
2. sessão expirada;
3. criação, edição e inativação de cliente;
4. criação de equipamento vinculado ao cliente;
5. bloqueio de número de série duplicado;
6. cadastro e inativação de técnico;
7. abertura de ordem;
8. atribuição de técnico;
9. transições de status;
10. criação, início e conclusão de reparo;
11. sincronização do equipamento;
12. bloqueios de exclusão por relacionamento;
13. dashboard e indicadores;
14. quatro categorias de relatório;
15. filtros, paginação, CSV e impressão;
16. mensagens de erro quando o backend estiver indisponível.

### Verificações técnicas

- testes Java passando;
- build do backend passando;
- `npm run build` passando;
- sem erros no console do navegador;
- sem senhas ou segredos versionados;
- CORS limitado às origens necessárias;
- migrations reproduzem o banco desde o início;
- documentação de execução atualizada;
- diagrama de classes compatível com a implementação final.

### Entrega final

O sistema estará concluído quando:

- o frontend não usar `localStorage` como banco operacional;
- as regras de negócio forem garantidas pelo Java;
- os dados sobreviverem ao reinício do backend;
- autenticação e autorização ocorrerem no servidor;
- todas as telas existentes consumirem a API;
- o fluxo cliente → equipamento → ordem → técnico → reparo funcionar integralmente.

---

# Checklist das classes finais

## Domínio

- `Cliente`
- `Funcionario`
- `Equipamento`
- `OrdemServico`
- `Reparo`
- `ContaAcesso`

## Enums

- `StatusCliente`
- `CargoFuncionario`
- `StatusFuncionario`
- `EspecialidadeFuncionario`
- `TipoEquipamento`
- `StatusEquipamento`
- `PrioridadeOrdem`
- `StatusOrdem`
- `StatusReparo`

## Serviços

- `ClienteService`
- `FuncionarioService`
- `EquipamentoService`
- `OrdemServicoService`
- `ReparoService`
- `AuthService`
- `IndicadoresService`
- `RelatorioService`

## Repositórios

- `ClienteRepository`
- `FuncionarioRepository`
- `EquipamentoRepository`
- `OrdemServicoRepository`
- `ReparoRepository`
- `ContaAcessoRepository`

## Controllers

- `ClienteController`
- `FuncionarioController`
- `EquipamentoController`
- `OrdemServicoController`
- `ReparoController`
- `AuthController`
- `IndicadoresController`
- `RelatorioController`

## Infraestrutura

- configuração de segurança;
- configuração de CORS;
- tratamento global de exceções;
- DTOs de entrada e saída;
- migrations do banco;
- testes unitários e de integração;
- configuração por ambiente.

---

# Critério semanal de conclusão

Em toda segunda-feira, considerar a atividade concluída somente quando:

1. o código compilar;
2. o cenário da aula executar;
3. as regras negativas também forem testadas;
4. o diagrama ou a documentação forem atualizados quando o modelo mudar;
5. não houver `.class`, senha, arquivo de ambiente ou build indevido no Git;
6. o commit da semana descrever claramente a entrega realizada.

Este roteiro pode ser ajustado conforme o conteúdo apresentado pelo professor, mas a ordem das dependências deve ser preservada: **domínio → regras → persistência → API → integração**.
