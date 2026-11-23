# Atividade 10 — Revisão técnica de POO

Revisão realizada em 23/11/2026, posteriormente ao prazo original. Não representa entrega retroativa. A atividade 10 de Processos é outra entrega.

## Retorno da apresentação

Não foi localizado um registro do feedback da defesa AP2 de POO. A equipe precisa informar o que a professora pediu, o que teve dificuldade de explicar e o que decidiu adiar. Não atribuímos à professora os problemas encontrados pela revisão técnica. Esse requisito permanece pendente de confirmação da dupla.

## Revisão técnica realizada

- Os 31 testes herdados da A12 passaram no JDK 17, usando inicialmente `mvn -B -f backend/pom.xml "-Dmaven.compiler.release=17" clean test`.
- O POM exigia Java 25, mas o código utiliza recursos disponíveis no Java 17 e a máquina tinha JDK 17. A versão mínima foi ajustada para 17 e o compilador Maven fixado em 3.13.0, com `-Xlint:all` para inspecionar avisos.
- A seleção da política por tipo já está concentrada em `PoliticasCobranca`; as implementações têm `@Override`. Não foi encontrado `instanceof` usado para decidir preços.
- O README continha instruções de versões antigas. A documentação final será consolidada na A14, preservando a A11 e a A12 nas respectivas tags.
- `ServicoOrdens` ainda estava no pacote `dominio`; o `Main` concentrava o cenário, e as falhas eram exceções genéricas. As correções de camadas e tratamento serão entregues na A13.
- Os defeitos anteriores DT01 (reabertura indevida), DT04 (início sem técnico) e DT05 (conclusão sem atendimento) constam na revisão de Processos e também atingem o Java; serão corrigidos com testes na A14, sem atribuir esses achados à defesa de POO.

## Evidências e limites

O log `testes-revisao.txt` registra a recompilação e a suíte desta revisão. A A11 já possui três commits de implementação/testes/documentação, tag `v11`, especificação, UML e cenário documentado. As tags históricas não foram reescritas.

Esta revisão não comprova envio na plataforma Aula nem resolve o requisito de commit antes do prazo original. O histórico registra a data real.
