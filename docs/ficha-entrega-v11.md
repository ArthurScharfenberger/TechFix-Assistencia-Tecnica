# Ficha de Entrega — Atividade 11

- Disciplina: Fundamentos de Programação Orientada a Objetos — ADS / ULBRA.
- Professora: Caroline.
- Atividade: 11 — Reciclagem no próprio domínio — entrega final.
- Projeto / domínio: TechFix — assistência técnica de notebooks e desktops.
- Integrantes: Arthur Scharfenberger e Lucas Oliveira da Silva.
- Data de preparação: 26/10/2026.
- Repositório: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica
- Versão: `v11`.
- Link para entrega: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/tree/v11

## Artefatos e critérios

| Critério | Evidência |
| --- | --- |
| Cinco regras RN1–RN5 | [especificacao.md](especificacao.md) |
| UML com multiplicidades | [uml.png](uml.png), fonte vetorial [uml.svg](uml.svg) |
| Superclasse e subclasses | `Equipamento`, `Notebook`, `Desktop` |
| Interface e duas implementações | `PoliticaCobranca`, `CobrancaNotebook`, `CobrancaDesktop` |
| Uso por outra classe | Campo `OrdemServico.politicaCobranca`, chamado por `calcularTotal()` |
| Composição encapsulada | Ordem cria `ItemServico`, construtor privado; `List.copyOf` na consulta |
| Decisão por tipo | Único `switch` em `PoliticasCobranca.para()` |
| Testes | 19 testes JUnit, sendo cinco novos em `ReciclagemTest` com Arrange–Act–Assert |
| Cenário completo | `Main`: abertura, item adicional, diagnóstico, total e conclusão |
| Saída | [Registro gráfico](terminal-v11.png) e [texto real](saida-terminal-v11.txt), no README |

## Explicação para a microdefesa

Equipamento concentra marca, defeito e tipo; Notebook e Desktop especializam os dados e o roteiro de diagnóstico. A interface de cobrança permite que a ordem calcule o valor sem conhecer as classes concretas das políticas. A fábrica decide a política na abertura, e a ordem guarda essa referência para calcular o total. Os itens pertencem à ordem porque ela os cria e controla sua lista; quem consulta não pode remover ou inserir elementos nela. O técnico é opcional, representando uma ordem ainda sem responsável.

As tarifas são regras propostas para este exercício acadêmico, sem representar uma tabela comercial real. O código anterior foi reaproveitado e ampliado, sem simular uma reconstrução histórica do zero.

## Uso de IA e responsabilidade

Validação realizada em 26/10/2026 com Temurin OpenJDK 25.0.5: `mvn -f backend/pom.xml clean test`, 19 testes executados, zero falhas, zero erros e nenhum teste ignorado; `Main` também executado com Java 25. As imagens foram geradas localmente e conferidas visualmente.

OpenAI Codex apoiou implementação, testes, UML e documentação desta entrega. A equipe deve revisar os arquivos e explicar cada decisão na microdefesa; testes automáticos não comprovam compreensão individual.

O envio na plataforma Aula deve ser realizado pela equipe com o link acima e esta ficha; este documento não comprova submissão na plataforma.
