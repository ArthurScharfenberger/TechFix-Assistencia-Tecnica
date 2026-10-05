# Declaração de uso de inteligência artificial

Durante o desenvolvimento deste projeto, utilizamos ferramentas de inteligência artificial como recurso de apoio para:

- auxiliar na compreensão das estruturas e dos componentes do sistema;
- contribuir para a organização geral do projeto;
- apoiar a identificação e a correção de bugs;
- auxiliar na elaboração, execução e revisão de testes.

A inteligência artificial foi utilizada apenas como ferramenta de suporte. Todas as sugestões geradas foram analisadas e validadas pela equipe, que permaneceu responsável pelas decisões, pela implementação e pelo resultado final do projeto.

Na Atividade Semanal nº 6, a IA também apoiou a revisão do material da aula, a adequação da sintaxe da coleção já definida no modelo, a validação de valor nulo, a criação do teste correspondente e a atualização da documentação. A associação `Cliente` para várias `OrdemServico` e a escolha de `List` permanecem decisões de modelagem que devem ser compreendidas e defendidas pela equipe.

Na entrega final da Atividade Semanal nº 8, a IA apoiou a revisão da hierarquia `Equipamento`, `Notebook` e `Desktop`, a organização dos testes de sobrescrita e validação herdada, a execução das verificações e a atualização das documentações e da ficha padrão. A equipe deve revisar o resultado e permanece responsável pelas decisões e pela apresentação do código.

## 04/10/2026 - Atividade 9 - Comportamento polimórfico

OpenAI Codex participou diretamente da implementação de `RoteiroDiagnostico`, dos roteiros distintos de Notebook e Desktop, da integração em OrdemServico e Main, dos seis novos testes e da ficha final. O contrato possui Javadoc, lista imutável e consulta sem efeitos colaterais. O cliente usa a interface sem verificação de tipo.

Verificações: `mvn test` com 14 testes, zero falhas, erros ou ignorados; execução de `java -cp target/classes Main`; revisão visual das quatro páginas do PDF. Foram preparados somente a entrega final em PDF, sua fonte Markdown e o gerador reproduzível. A aprovação pessoal dos integrantes e a submissão no AVA não são presumidas.

## 05/10/2026 - Correção de escopo e apresentação

A pedido do usuário, Codex ajustou a hierarquia e os testes para manutenção exclusiva de notebooks e PCs, com `Desktop` especializado pela configuração de vídeo. Também revisou os documentos, os dez slides da apresentação e o roteiro de Arthur e Lucas para seis a sete minutos. A integração descrita na apresentação ocorre entre os objetos Java; a interface web permanece uma implementação separada.

Foram conferidos a compilação, os 14 testes JUnit, as saídas reais de `Main`, os diagramas e a preservação das mídias da apresentação. A equipe permanece responsável por compreender e apresentar o conteúdo e por sua submissão acadêmica.

## 05/10/2026 — Consolidação AP2

Codex atualizou o diagrama com a interface da A9 e multiplicidades coerentes com as listas inicialmente vazias, consolidou os requisitos em `docs/Entrega-AP2.md`, ajustou o roteiro e seu PDF para reservar a execução ao vivo e preparou a publicação da versão `ap2`. O registro solicitado com a nomenclatura `AI.md` está na raiz do repositório. As verificações incluem testes, build e execução de `Main`; ensaio e defesa pessoal continuam a cargo da dupla.
