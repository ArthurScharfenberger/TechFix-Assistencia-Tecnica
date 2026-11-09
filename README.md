# TechFix — Sistema de Assistência Técnica

## Atividade 12 - Entrega final (`v12`)

**Link de entrega:** [versão v12 no GitHub](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/tree/v12).
**Ficha:** [PDF preenchido](docs/atividade-12/Ficha_Padrao_Entrega_Atividade_12_Final.pdf) e [texto](docs/atividade-12/ficha-entrega-v12.md).

O Java está organizado em três pacotes: `com.techfix.dominio` (entidades, regras, serviço, registro e contrato), `com.techfix.repositorio` (memória e arquivo) e `com.techfix.app` (montagem do cenário). A interface `RepositorioOrdens` fica no domínio e define `salvar` e `listar`; suas implementações dependem dela. Nenhuma classe de domínio importa implementações concretas. `ServicoOrdens` recebe a interface pelo construtor; `Main` escolhe o arquivo.

**Regra guardada em cada registro:** o total da ordem na conclusão é o diagnóstico de R$ 80,00 para notebook ou R$ 60,00 para desktop, somado aos itens adicionais.

`RegistroOrdem` guarda apenas número, cliente, tipo de equipamento, status e total. O arquivo TSV em UTF-8 usa `java.nio.file`. Erros de leitura e escrita são relançados como `UncheckedIOException` com mensagem e causa. O serviço só conclui ordens em atendimento, recusa números já registrados e preserva o estado quando salvar falha. O exemplo atende uma execução por vez.

Com **JDK 25 e Maven**, execute na raiz (confira o JDK usado com `java -version` e `mvn -v`):

```sh
mvn -B -f backend/pom.xml clean test
java -cp backend/target/classes com.techfix.app.Main dados/ordens.tsv
java -cp backend/target/classes com.techfix.app.Main dados/ordens.tsv
```

Se `java -version` mostrar 17, ajuste `JAVA_HOME` para a instalação do JDK 25 e coloque seu diretório `bin` no início do `PATH`. Não basta ter o JDK instalado: Maven e `java` precisam usar essa versão.

**Validação:** 31 testes JUnit aprovados, sendo 19 preservados da v11 e 12 novos. Incluem serviço com memória, recuperação por uma nova instância com `@TempDir`, preservação de dados, caracteres especiais e falhas reais de leitura/escrita. [Resultado dos testes](docs/atividade-12/resultado-testes.txt).

**Duas execuções seguidas:** a primeira parte de zero e salva a OS 1; a segunda recupera a OS 1, acrescenta a OS 2 e lista ambas. O print abaixo é uma representação gráfica da [saída real de duas JVMs](docs/atividade-12/saida-terminal-v12.txt), gerada em uma pasta temporária com o mesmo arquivo nas duas chamadas. Com um arquivo que já contenha registros, os números continuam a partir do histórico existente.

![Terminal - duas execuções reais com persistência](docs/atividade-12/terminal-v12.png)

**UML atualizado:** [PNG](docs/uml.png) e [SVG editável](docs/uml.svg).

![Pacotes, contrato e implementações do repositório](docs/uml.png)

[Decisões, formato e testes](docs/atividade-12/README.md) · [Guia para a microdefesa](docs/atividade-12/microdefesa.md).

Trabalho desenvolvido com apoio do OpenAI Codex na implementação, nos testes e na documentação, conforme declaração da ficha. A revisão, a compreensão e o envio na plataforma Aula cabem à equipe; o material não atesta submissão já realizada.

A [entrega anterior da Atividade 11](docs/atividade-11/README.md) e a [tag v11](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/tree/v11) permanecem como histórico.

O TechFix é um projeto acadêmico para organizar clientes, equipamentos, ordens de serviço, reparos e o trabalho da equipe de uma assistência técnica.

Atualmente, o repositório reúne duas partes independentes:

- um frontend em TypeScript, executado com Vite e com persistência local no navegador;
- uma atividade de Programação Orientada a Objetos em Java padrão, sem integração com o frontend.

## Funcionalidades do frontend

- autenticação local para demonstração;
- dashboard e indicadores;
- cadastros de clientes, equipamentos e equipe;
- gerenciamento de ordens de serviço e reparos;
- relatórios com filtros, paginação, exportação CSV e impressão.

### Acesso de demonstração

- Usuário: `admin` ou `admin@techfix.local`
- Senha: `admin`

Essa autenticação existe apenas para demonstração acadêmica. Como é executada no navegador, não oferece a segurança necessária para uso em produção.

## Atividade Java

A implementação Java representa clientes, técnicos, equipamentos e ordens de serviço. A AP2 reúne coleções de ordens por cliente (A6), composição de itens (A7), herança entre Equipamento, Notebook e Desktop (A8) e interface/polimorfismo de roteiros de diagnóstico (A9). `Main` demonstra o cenário integrado entre os objetos Java.

Esta etapa usa Java 25 e Maven para 31 testes JUnit, três pacotes e persistência em arquivo. Não há Spring, banco de dados ou API REST. Java e TypeScript ainda não se comunicam.

Uma visão geral da área Java está em [`backend/README.md`](backend/README.md). As instruções de compilação e a descrição das classes estão em [`backend/src/README.md`](backend/src/README.md), e o esboço da Atividade 6 está em [`backend/docs/atividade-semanal-06-esboco.md`](backend/docs/atividade-semanal-06-esboco.md).

## Diagramas

- [`Diagrama-Classes`](Diagrama-Classes/README.md): diagrama correspondente às classes Java implementadas, com atributos, métodos e multiplicidades.
- [`Diagrama-UML`](Diagrama-UML/README.md): registro da modelagem inicial do domínio.

## Estrutura principal

```text
TechFix/
├── backend/
│   ├── pom.xml
│   ├── README.md
│   └── src/
│       ├── README.md
│       ├── main/java/com/techfix/
│       │   ├── app/           # Main
│       │   ├── dominio/       # entidades, serviço, registro e interface
│       │   └── repositorio/   # implementações em memória e arquivo
│       └── test/java/com/techfix/
│           ├── dominio/       # 24 testes
│           └── repositorio/   # 7 testes
├── Diagrama-Classes/
│   ├── DiagramaClasses.png
│   └── README.md
├── Diagrama-UML/
├── docs/
├── public/
├── src/                 # frontend TypeScript
├── DEVLOG.md
├── PLANEJAMENTO.md
├── package.json
└── README.md
```

## Executando o frontend

```bash
npm install
npm run dev
```

Os scripts disponíveis e as dependências estão definidos em `package.json`.

## Documentação

- [`docs/entregas-processos/README.md`](docs/entregas-processos/README.md): entregas de Processos em DOCX e PDF, modelos visuais e fontes editáveis.
- [`docs/entregas-processos/Arquitetura-Rastreabilidade-Esboco.pdf`](docs/entregas-processos/Arquitetura-Rastreabilidade-Esboco.pdf): esboço da arquitetura conceitual e matriz inicial com três requisitos rastreados; versões Word e Markdown na mesma pasta.
- [`docs/entregas-processos/A8-Entrega-Final-Revisada.md`](docs/entregas-processos/A8-Entrega-Final-Revisada.md): revisão da A8 vinculada à A5, com nove itens, dois incrementos e quatro riscos; estimativas propostas para validação da equipe.

- [`DEVLOG.md`](DEVLOG.md): histórico das alterações e verificações do projeto.
- [`PLANEJAMENTO.md`](PLANEJAMENTO.md): referência para o planejamento revisado e registro histórico da A8 original.
- [`docs/atividade-semanal-08.md`](docs/atividade-semanal-08.md): versão consultável da Atividade 08.
- [`docs/Atividade_A8.pdf`](docs/Atividade_A8.pdf): documento original entregue na Atividade 08.
- [`docs/atividade-semanal-08-poo-entrega-final.md`](docs/atividade-semanal-08-poo-entrega-final.md): implementação, demonstração, testes e justificativa da herança.
- [`docs/Apresentacao-POO-TechFix.pptx`](docs/Apresentacao-POO-TechFix.pptx): apresentação revisada de POO, com exemplos de Notebook e Desktop e mídias preservadas.
- [`docs/Roteiro-Apresentacao-POO-Arthur-Lucas.md`](docs/Roteiro-Apresentacao-POO-Arthur-Lucas.md): roteiro por apresentador e slide, planejado para aproximadamente seis minutos.
- [`backend/README.md`](backend/README.md): limites e organização da área Java.
- [`backend/src/README.md`](backend/src/README.md): documentação e execução do código Java.
- [`docs/atividade-semanal-03.md`](docs/atividade-semanal-03.md): registro da Atividade Semanal nº 3.
- [`Diagrama-Classes/README.md`](Diagrama-Classes/README.md): explicação do diagrama implementado.

## Integrante

- Arthur Scharfenberger
- Lucas Oliveira da Silva

## Entrega final de polimorfismo da Atividade 9

A interface `RoteiroDiagnostico` define etapas ordenadas e imutáveis, com implementações distintas em `Notebook` e `Desktop`, integradas à ordem de serviço. [Ficha final PDF](docs/Ficha_Padrao_Entrega_Atividade_09_Final.pdf) e [documentação](docs/atividade-semanal-09-poo-entrega-final.md). Para reproduzir o PDF: `python docs/gerar_entrega_polimorfismo.py` (requer `reportlab`).

## Escopo de atendimento

A TechFix realiza manutenção exclusivamente de notebooks e PCs (desktops). Os tipos de equipamento aceitos são `NOTEBOOK` e `DESKTOP`.

## Verificações da interface web

Para executar os testes Java durante a apresentação, use `Testar-POO.cmd` na raiz do projeto. O resultado fica visível no terminal, e o Maven roda em modo offline. Veja a [preparação para a aula](docs/Executar-Testes-Na-Apresentacao.md), incluindo os requisitos de JDK/Maven e a distinção entre os 14 testes de POO e os cinco testes do site.

Execute `npm test` para conferir datas civis, validações de equipamentos e a sincronização do status quando há reparos simultâneos, troca de equipamento, cancelamento ou exclusão. Execute `npm run build` para verificar os tipos e gerar a versão de produção.

## Entrega AP2

- [Conferência dos requisitos e demonstração](docs/Entrega-AP2.md).
- [Slides atualizados](docs/Apresentacao-POO-TechFix.pptx).
- [Diagrama atual com multiplicidades](Diagrama-Classes/README.md) e [versão visual](Diagrama-Classes/Diagrama-AP2.svg).
- [Roteiro de Arthur e Lucas](docs/Roteiro-Apresentacao-POO-Arthur-Lucas.md), também em [PDF](docs/Roteiro-Apresentacao-POO-Arthur-Lucas.pdf).
- [Registro de uso de IA na AP2](AI.md) e [histórico Java](backend/IA.md).
- [Backlog e planejamento](PLANEJAMENTO.md), com funcionalidades futuras distinguidas da implementação atual.

A versão de entrega é identificada pela tag Git `ap2`. A interface segue o [layout da oficina](docs/Interface-Oficina.md); usa armazenamento local e não se comunica com o Java.
