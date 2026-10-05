# Entrega AP2 — TechFix

Equipe: Arthur Scharfenberger e Lucas Oliveira da Silva. Conferência: 05/10/2026. Versão: tag `ap2`.

## Requisitos e evidências

| Requisito | Evidência |
| --- | --- |
| Código AP1/AP2 no GitHub | Fontes Java em `backend/src/main/java/`, testes em `backend/src/test/java/` e frontend em `src/`; histórico preservado e entrega marcada por `ap2`. |
| Slides das atividades 6 a 9 | `Apresentacao-POO-TechFix.pptx`, com dez slides sobre domínio, evolução, coleções, composição, herança, interface, polimorfismo e testes. |
| Diagrama atualizado com multiplicidades | `../Diagrama-Classes/README.md` e `Diagrama-AP2.svg`, incluindo a interface da A9, associações e composição. |
| Documentação | README, `../PLANEJAMENTO.md`, `../AI.md`, roteiro e instruções de execução. O backlog distingue planejamento futuro de funcionalidade implementada. |
| Tag/release ap2 | Tag Git anotada `ap2` no commit de entrega. A tag identifica a versão; não exige uma página adicional de GitHub Release. |
| Aplicação compilada e testada | 14 testes Java, cinco testes do frontend, build TypeScript/Vite e execução de `Main`. |
| Resultados demonstráveis | Comandos abaixo reproduzem a execução; relatórios reais em `backend/target/surefire-reports/`. |
| Decisões explicadas | Slides 4 a 8, diagrama e roteiro justificam os conceitos e a consulta ao contrato comum. |
| Execução ao vivo | Roteiro reserva um minuto para testes e `Main`; o cumprimento final ocorre na apresentação. |

## Execução durante a apresentação

Abra o terminal na raiz do projeto:

```powershell
.\Testar-POO.cmd --sem-pausa
java -cp backend/target/classes Main
```

O primeiro comando recompila o Java e executa os testes reais offline. Se houver falha, não anuncie aprovação nem prossiga como se os testes tivessem passado. O segundo demonstra cliente, técnico, equipamento, ordem, mudança de status e os dois roteiros polimórficos.

Antes da aula, prepare o cache do Maven no computador da apresentação, com internet:

```powershell
mvn -B -f backend/pom.xml clean test
```

São necessários JDK 17+ e Maven no PATH. Confira a execução offline antes de sair. Veja [as instruções completas](Executar-Testes-Na-Apresentacao.md).

## Decisões para defender

- Coleção: cliente pode ter várias ordens; `List` declara o contrato e `ArrayList` armazena os elementos.
- Composição: a OS cria seus itens internamente; o construtor privado impede criação externa e a consulta retorna lista imutável.
- Herança: notebook e desktop são equipamentos e compartilham dados/validações; cada subtipo acrescenta sua característica.
- Interface e polimorfismo: a mesma chamada de diagnóstico executa a implementação do objeto, sem `instanceof` no cliente.
- Multiplicidade: uma OS exige um cliente, um técnico e um equipamento. Cada um pode participar de `0..*` ordens; uma OS pode começar sem itens. `1..*` exigiria mudar essas regras.
- Integração: o cenário ponta a ponta é entre objetos Java; a interface web é uma implementação independente com persistência local, sem API Java.

## Limites da verificação

Compilação, testes e execução comprovam os comportamentos verificados, não a compreensão pessoal dos integrantes. Ensaiem o roteiro com cronômetro no computador que será usado. A apresentação e a submissão acadêmica continuam sob responsabilidade da equipe.
