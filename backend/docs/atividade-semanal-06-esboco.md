# Atividade semanal nº 6 — Esboço

## Associação escolhida

Um `Cliente` tem várias `OrdemServico`, pois o mesmo cliente pode solicitar diferentes atendimentos ao longo do tempo; foi usada uma `List` porque as ordens formam uma sequência simples e esta etapa ainda não exige chaves nem controle de duplicidade.

## Trecho de código

```java
private final List<OrdemServico> ordensServico = new ArrayList<>();

public void adicionarOrdemServico(OrdemServico ordemServico) {
    if (ordemServico == null) {
        throw new IllegalArgumentException("Ordem de serviço não pode ser nula");
    }

    ordensServico.add(ordemServico);
}
```

## Links

- Repositório: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica
- Commit atualizado do código: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/commit/ff608fb

## Diagrama e validação

O diagrama de classes registra a cardinalidade `Cliente 1` para `0..* OrdemServico`, o atributo `List<OrdemServico>` e o método de inclusão. O método rejeita valores nulos com `IllegalArgumentException`, comportamento coberto por um teste JUnit.
