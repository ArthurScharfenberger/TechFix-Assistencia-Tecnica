# Ficha de Entrega - Atividade 12

[Ficha no padrão institucional em PDF](Ficha_Padrao_Entrega_Atividade_12_Final.pdf).

## 1. Identificação

- Atividade: 12 - Arquitetura e repositório - entrega final, única.
- Disciplina: Fundamentos de Programação Orientada a Objetos - ADS / ULBRA.
- Professora: Caroline.
- Projeto: TechFix - assistência técnica de notebooks e desktops.
- Integrantes: Arthur Scharfenberger e Lucas Oliveira da Silva.
- Data de preparação: 09/11/2026.
- Prazo informado: primeiros 30 minutos do Encontro 13, em 09/11.
- Ponto de partida: tag `v11`, no mesmo repositório.
- Versão de entrega: `v12`.
- Link: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/tree/v12

## 2. Conteúdo da atividade

| Critério | Evidência |
| --- | --- |
| Três pacotes | `com.techfix.dominio`, `com.techfix.repositorio`, `com.techfix.app` |
| Interface com salvar e listar | `dominio/RepositorioOrdens.java` |
| Registro sem entidades com comportamento | `dominio/RegistroOrdem.java` |
| Repositório em memória | `repositorio/RepositorioOrdensEmMemoria.java` |
| Repositório em arquivo com `java.nio.file` | `repositorio/RepositorioOrdensEmArquivo.java`, texto TSV em UTF-8 |
| Erros explícitos | `UncheckedIOException`, mensagem com operação/caminho e causa; linha inválida identificada |
| Injeção por construtor | `ServicoOrdens(RepositorioOrdens)`; escolha concreta somente no `Main` da aplicação |
| Testes | 12 novos, incluindo serviço com memória e nova instância com `@TempDir`; 31 no total |
| UML atualizado | [docs/poo/uml.png](../uml.png) e [SVG](../uml.svg) |
| Execução ponta a ponta | [Duas execuções](terminal-v12.png), [saída real](saida-terminal-v12.txt) e README da raiz |

Regra preservada: cada registro guarda o total na conclusão, calculado como diagnóstico de R$ 80,00 para notebook ou R$ 60,00 para desktop mais os itens adicionais.

## 3. Decisões, validação e pendências

A interface fica no domínio e é implementada no pacote de repositórios. O serviço coordena a conclusão, exige uma ordem em atendimento, rejeita número já registrado e só muda o status depois de salvar. O registro imutável não é uma entidade executável nem uma cópia de todo o grafo de objetos.

Validação em 09/11/2026 com Temurin OpenJDK 25.0.5 e Maven 3.9.16: `mvn -B -f backend/pom.xml clean test`, **31 testes, zero falhas, zero erros e zero ignorados**. Duas JVMs seguidas: histórico 0 → 1 e 1 → 2, com a OS 1 presente na segunda execução. A imagem é composta a partir da saída real dos processos.

O exemplo funciona para um processo por vez. Não há transações nem reconstrução completa de ordens a partir do histórico. Arquivo ausente inicia vazio; demais falhas não são ignoradas. Os commits representam incrementos executados nesta preparação, sem simular datas passadas.

Pendências humanas: revisar e compreender os arquivos, confirmar a responsabilidade/autoria e enviar esta ficha e o link da tag na plataforma Aula. Esta ficha não atesta submissão já realizada nem microdefesa já concluída.

## 4. Declaração de uso de Inteligência Artificial

(X) A equipe utilizou ferramenta de IA nesta atividade.

Ferramenta: OpenAI Codex. Uso nesta preparação: implementação dos pacotes, serviço, registro e repositórios; criação e execução dos testes; preparação e revisão da documentação, UML e evidências. A compreensão e a revisão humana continuam sendo responsabilidade da equipe.

## 5. Responsabilidade e autoria

Declaração para confirmação no ato da entrega: ao submeter esta ficha, os integrantes confirmam que leram e compreenderam o conteúdo e assumem responsabilidade pela correção e coerência, inclusive pelas partes desenvolvidas com apoio de IA.

Arthur Scharfenberger - assinatura: __________________________________

Lucas Oliveira da Silva - assinatura: __________________________________

Data da confirmação: ______ / ______ / __________
