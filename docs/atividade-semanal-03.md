# Atividade Semanal nº 3 — Entrega Final

## Projeto

TechFix - Assistência Técnica

## Objetivo

Evoluir as classes iniciais do sistema aplicando validações nos construtores, enums, mudança de estado e testes automatizados simples.

## Alterações realizadas

- validação básica dos construtores;
- criação de `StatusOrdemServico`;
- criação de `TipoEquipamento`;
- alteração do status da ordem de `String` para enum;
- alteração do tipo do equipamento de `String` para enum;
- implementação da mudança de estado;
- manutenção dos dados de demonstração no `Main`;
- criação de três testes com JUnit 5;
- configuração mínima do Maven.

## Construtores

Os construtores agora impedem a criação de objetos incompletos por meio de validações simples e `IllegalArgumentException`.

### Cliente

- nome obrigatório;
- telefone obrigatório;
- email obrigatório.

### Tecnico

- nome obrigatório;
- especialidade obrigatória.

### Equipamento

- tipo obrigatório;
- marca obrigatória;
- defeito obrigatório.

### OrdemServico

- número maior que zero;
- cliente obrigatório;
- técnico obrigatório;
- equipamento obrigatório.

## Enums

### StatusOrdemServico

- `ABERTA`
- `EM_ATENDIMENTO`
- `CONCLUIDA`

### TipoEquipamento

- `NOTEBOOK`
- `DESKTOP`
- `CELULAR`
- `OUTRO`

Os enums evitam textos livres e limitam esses atributos aos valores definidos pelo sistema.

## Mudança de estado

O método `alterarStatus(StatusOrdemServico novoStatus)` recebe um status não nulo e atualiza o estado da ordem. O cenário demonstra a mudança de `ABERTA` para `EM_ATENDIMENTO`.

## Cenário demonstrado

- Cliente João Silva;
- técnico Carlos Souza;
- notebook Dell;
- defeito "Não liga";
- criação da Ordem de Serviço nº 1;
- status inicial `ABERTA`;
- alteração para `EM_ATENDIMENTO`.

## Testes

Foram criados três testes em `OrdemServicoTest`:

1. cliente sem nome gera `IllegalArgumentException`;
2. `OrdemServico` inicia com status `ABERTA`;
3. `alterarStatus` modifica o status para `EM_ATENDIMENTO`.

## Verificações

- Os fontes principais foram compilados com `javac` 17.0.10.
- O `Main` foi executado com sucesso.
- Os testes Maven não puderam ser executados porque o comando `mvn` não está instalado no ambiente.

## Resultado

As classes agora possuem validações básicas, tipos controlados por enum, mudança de estado e três testes automatizados simples preparados para execução com Maven e JUnit 5.
