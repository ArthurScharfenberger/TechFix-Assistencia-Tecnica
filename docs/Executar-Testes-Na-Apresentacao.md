# Executar os testes na apresentação

## Testes de POO que aparecem nos slides

No terminal do VS Code, aberto na pasta principal do projeto, execute:

```powershell
.\Testar-POO.cmd
```

Também é possível dar dois cliques em `Testar-POO.cmd` no Explorador de Arquivos. A janela permanece aberta para mostrar o resultado. Ao finalizar, pressione uma tecla para sair.

O comando roda os testes reais do Maven/JUnit em modo offline. Não altera os dados do site nem a apresentação. Se houver falha, retorna erro e não mostra a mensagem de aprovação.

Resultado esperado para a versão atual:

| Classe | Testes |
| --- | ---: |
| EquipamentoTest | 4 |
| OrdemServicoTest | 4 |
| RoteiroDiagnosticoTest | 6 |
| Total | 14 |

A tela apresenta cada teste com uma explicação curta, organizado por conceito:

- **Herança e especialização:** dados e validações herdados, RAM do notebook e vídeo dedicado do desktop.
- **Cliente, coleções e ordem de serviço:** nome obrigatório, rejeição de ordem nula, status inicial e mudança de status.
- **Interface e polimorfismo:** etapas dos roteiros, vídeo integrado e dedicado, chamada pela interface, lista imutável e consulta pela ordem sem alterar seu status.

Verde indica aprovação; vermelho indica falha ou erro; amarelo indica teste ignorado. Os resultados vêm dos relatórios JUnit após recompilar e executar os testes. O resumo esperado é `Executados: 14 | Passaram: 14 | Falhas: 0 | Erros: 0`, com `Ignorados: 0`. Se o Maven falhar, a tela mostra o erro sem anunciar aprovação.

O log completo fica em `tmp/testes-poo/ultima-execucao.log`; os relatórios ficam em `backend/target/surefire-reports/`. Os testes verificam comportamentos do programa, sem realizar diagnóstico físico dos equipamentos.

Fala sugerida: “Vamos executar os 14 testes Java que mostramos na apresentação. Eles verificam os equipamentos, as regras de cliente e ordem e os roteiros de diagnóstico. O resultado aparece ao final da execução.”

## Preparar antes da aula

No computador que será usado na apresentação, é necessário ter um JDK 17 ou superior e Maven no PATH. Com internet, execute uma vez:

```powershell
java -version
javac -version
mvn -version
mvn -B -f backend/pom.xml clean test
```

Depois, confirme o modo offline:

```powershell
.\Testar-POO.cmd --sem-pausa
```

O modo offline depende do cache do Maven desse computador. Copiar somente a pasta do projeto para outro computador não copia as dependências. Faça essa preparação novamente se trocar de máquina. Se mudar o código ou o `pom.xml`, repita a conferência.

## Executar a demonstração Java

Após os testes passarem, execute na raiz do projeto:

```powershell
java -cp backend/target/classes Main
```

Isso mostra a ordem de serviço, a descrição dos equipamentos e os roteiros de Notebook e Desktop. A demonstração é separada da execução dos testes.

## Testes do site, se forem solicitados

Os cinco testes do site são separados dos 14 testes Java apresentados nos slides. Para executá-los, use Node.js 20 ou superior e prepare as dependências com internet:

```powershell
npm ci
npm test
```

Com as dependências instaladas, também existem os atalhos:

```powershell
npm run test:poo
npm run test:all
```

`test:poo` executa somente os testes Java em modo offline. `test:all` executa os testes Java e, se passarem, os testes do site. Para a apresentação de POO, use preferencialmente `Testar-POO.cmd`.
