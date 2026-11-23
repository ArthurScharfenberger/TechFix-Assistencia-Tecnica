# Atividade 13 — Robustez da aplicação

Preparada em 23/11/2026 a partir da A12, no mesmo repositório. A entrega técnica contém quatro pacotes, serviço com injeção pelo construtor, exceções de negócio e técnica separadas, validação na origem, preservação de estado e apresentação que continua após três erros.

Foram executados 40 testes: 31 casos herdados e 9 novos em `RobustezTest`, incluindo tipo e mensagem de exceções, histórico corrompido, estado preservado após falha e apresentação com saída injetada. A expectativa antiga de `IllegalStateException` foi atualizada para `EstadoOrdemException`; os demais cenários anteriores foram conservados.

- [Ficha de entrega](Ficha_Padrao_Entrega_Atividade_13_Final.pdf)
- [Log Maven](testes-v13.txt)
- [Saída de duas execuções](saida-terminal-v13.txt)
- [Terminal](terminal-v13.png)
- [UML](uml.png) e [pacotes](pacotes.png)
- [README da versão v13](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/blob/v13/README.md), com tabela de erros e decisões.

O enunciado previa entrega em 16/11; a preparação presente tem a data real de 23/11. Envio na plataforma Aula e microdefesa são ações da equipe e não estão atestados aqui.
