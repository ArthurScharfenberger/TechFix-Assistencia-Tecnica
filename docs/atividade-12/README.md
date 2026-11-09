# Atividade 12 - Arquitetura e repositório

Entrega final preparada em 09/11/2026, continuando o mesmo repositório a partir da `v11`.
Versão: [`v12`](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/tree/v12).

- [Ficha preenchida em PDF](Ficha_Padrao_Entrega_Atividade_12_Final.pdf) e [texto](ficha-entrega-v12.md).
- [UML dos pacotes e repositórios](../uml.png), com [fonte SVG](../uml.svg).
- [Duas execuções em imagem](terminal-v12.png) e [saída real em texto](saida-terminal-v12.txt).
- [Resultado dos 31 testes](resultado-testes.txt).
- [Guia para a microdefesa](microdefesa.md).

## Decisões de arquitetura

`com.techfix.dominio` reúne entidades, regras, `ServicoOrdens`, `RegistroOrdem` e a interface `RepositorioOrdens`. O contrato fica no domínio porque descreve o que o serviço precisa; ele não conhece arquivos nem a lista interna da implementação em memória. `com.techfix.repositorio` contém as duas implementações. `com.techfix.app.Main` cria a implementação em arquivo e injeta a referência da interface no serviço. Assim, `app` depende dos outros dois pacotes e `repositorio` depende de `dominio`, sem dependência de volta.

`ServicoOrdens` é o ponto de entrada do caso de uso de conclusão. Ele exige uma ordem em atendimento, impede registrar novamente um número já concluído e só muda o status depois que o repositório confirma a gravação. A entidade `OrdemServico` mantém os comportamentos das atividades anteriores; persistência e coordenação do histórico ficam no serviço.

Cada `RegistroOrdem` preserva o total da ordem no momento da conclusão: diagnóstico de R$ 80,00 para notebook ou R$ 60,00 para desktop, somado aos itens adicionais. É uma fotografia imutável com número, nome do cliente, tipo do equipamento, status e total, sem guardar `OrdemServico`, `Cliente` ou políticas de cobrança. As validações do construtor do record apenas asseguram dados completos e valores válidos.

## Contrato e formato do arquivo

`salvar(RegistroOrdem)` acrescenta ao histórico; `listar()` retorna uma cópia imutável em ordem de inclusão. A verificação de número duplicado pertence ao serviço. Nenhuma implementação recebe entidades com comportamento.

O arquivo é texto TSV em UTF-8, sem cabeçalho: `numero<TAB>cliente<TAB>equipamento<TAB>status<TAB>total`. No nome do cliente, barra invertida, tabulação e quebras de linha são escapadas como `\\`, `\t`, `\n` e `\r`. O valor monetário usa ponto decimal e `BigDecimal`. `Files.readAllLines`, `Files.createDirectories` e `Files.writeString` fazem a leitura e gravação por `java.nio.file`.

Arquivo ainda inexistente significa histórico inicial vazio. Qualquer outra falha de I/O é relançada como `UncheckedIOException`, com operação, caminho e causa original; linhas inválidas informam caminho e número da linha, sem devolver um histórico parcial. O `Main` deixa a falha aparecer e encerra com erro.

O exemplo é local, para uma execução por vez: não implementa controle de concorrência, transações, recuperação de gravação parcial ou banco de dados. O histórico guarda conclusões, não permite reconstruir todos os itens de uma ordem. Alterar a entidade depois de concluir não reescreve o registro salvo.

## Reproduzir

Use JDK 25 e Maven; confira `java -version` e `mvn -v`. Na raiz:

```sh
mvn -B -f backend/pom.xml clean test
java -cp backend/target/classes com.techfix.app.Main dados/ordens.tsv
java -cp backend/target/classes com.techfix.app.Main dados/ordens.tsv
```

O caminho é relativo ao diretório de execução. Use o mesmo caminho nas duas chamadas. Se ele já contiver dados, a numeração e as contagens continuam a partir deles. Não apague um histórico para reproduzir a evidência; escolha outro caminho novo. `dados/` é ignorado pelo Git.

O gerador `gerar-evidencias.py` inicia duas JVMs em sequência, em uma pasta temporária nova, usando o mesmo arquivo nas duas. Ele compõe a imagem a partir da saída real e extrai as contagens dos relatórios Surefire; não simula a saída. Para regerar, compile e execute os testes, defina `JAVA_HOME` para o JDK 25 e rode `python docs/atividade-12/gerar-evidencias.py` (Pillow e fontes Arial/Consolas do Windows).

## Testes novos em relação à v11

| Classe | Quantidade | O que verifica |
| --- | ---: | --- |
| `ServicoOrdensTest` | 5 | Conclusão com memória, recusa de ordem aberta, número duplicado, registro independente da entidade e falha ao salvar sem concluir a ordem. |
| `RepositorioOrdensEmArquivoTest` | 6 | Nova instância recupera dados, segunda gravação preserva a primeira, arquivo ausente, caracteres especiais, falhas de leitura/escrita e linha corrompida. Todos usam `@TempDir`. |
| `RepositorioOrdensEmMemoriaTest` | 1 | A consulta do histórico é imutável e independente de inclusões posteriores. |

Os 19 testes da Atividade 11 foram preservados e apenas movidos para o pacote. Total validado: **31 testes, zero falhas, zero erros e zero ignorados**.

## Entrega

O histórico registra etapas reais: pacotes/contrato/memória, persistência/testes e documentação/evidências. Não foram alteradas datas ou fabricadas etapas de autoria. O apoio do OpenAI Codex está declarado na ficha. A equipe deve revisar e compreender os arquivos antes de confirmar a responsabilidade e enviar a ficha e o link da `v12` na plataforma Aula.
