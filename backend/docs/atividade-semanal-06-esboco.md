# Atividade semanal nº 6 — Esboço

## Associação escolhida

Um `Cliente` tem várias `OrdemServico`, pois o mesmo cliente pode solicitar diferentes atendimentos ao longo do tempo; foi usada uma `List` porque as ordens formam uma sequência simples e esta etapa ainda não exige chaves nem controle de duplicidade.

## Trecho de código

```java
private List<OrdemServico> ordensServico;

public Cliente(String nome, String telefone, String email) {
    // validações e demais atribuições
    this.ordensServico = new ArrayList<>();
}

public void adicionarOrdemServico(OrdemServico ordemServico) {
    ordensServico.add(ordemServico);
}
```

## Links

- Repositório: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica
- Commit do código: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/commit/439281e

