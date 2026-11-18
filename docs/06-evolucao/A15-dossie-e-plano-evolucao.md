# A15 Integrar o dossiê e planejar evolução

## 2.1 Síntese da entrega final

O TechFix organiza clientes, notebooks e desktops, ordens de serviço e o acompanhamento do atendimento de uma assistência técnica que hoje depende de papel e planilhas. Esta entrega consolida o dossiê de Processos e define como a equipe manterá e evoluirá o projeto depois da AS. A versão v2.0.0 encerra a documentação da disciplina; não declara o produto pronto para uso em produção.

Equipe: Arthur Scharfenberger e Lucas Oliveira da Silva. Arthur responde pela interface, requisitos, acesso e organização das entregas; Lucas, pelas regras, persistência e testes de estados. Um revisa as alterações do outro. Chico Mosca é o PO indicado na A7 para priorização e aceite. A entrevista com Marcos Almeida e a revisão da SM-01 foram simuladas com IA; a ratificação pelo PO real permanece pendente.

Data da ficha: 18/11/2026. Etapa: AS. Modalidade: em equipe. Prazo do enunciado: início da aula de 18/11. Este registro não comprova envio na plataforma nem entrega anterior ao início da aula.

Release final do dossiê: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/releases/tag/v2.0.0

Repositório: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica

Histórico de alterações: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/blob/v2.0.0/CHANGELOG.md

Protótipo local: http://localhost:5173 . O endereço funciona no computador que executa o projeto. Na raiz, executar `npm ci` e `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort`; entrar com `admin` / `admin`. Não existe hospedagem pública informada pela equipe.

Fluxo da apresentação: entrar, cadastrar um cliente fictício, vincular um notebook ou desktop, abrir uma OS, localizar o registro e consultar seus detalhes. As telas usam armazenamento local do navegador. O programa Java de POO é independente e não recebe os dados dessas telas. A RN2 de garantia será explicada pelo modelo e pelos critérios CA16–CA19; ainda não há execução desse fluxo no produto. Os detalhes de reprodução ficam em `docs/04-modelagem/prototipo-local.md`.

## 2.2 Mapa e revisão de coerência

O README principal passa a abrir com o problema, os papéis, a versão, o protótipo, o CHANGELOG e as seis entradas do dossiê. Os caminhos abaixo existem no repositório; os índices apontam para as fontes mantidas em `docs/processos`, preservando o histórico das entregas e evitando cópias divergentes.

| Pasta | Conteúdo e fonte principal |
|---|---|
| docs/01-contexto | Problema, público e processo; PDFs A2, A3 e A7 |
| docs/02-requisitos | Requisitos RF1–RF3, RN1–RN2, RNF1–RNF3, HU1–HU2 e CA01–CA19; fonte única no dossiê |
| docs/03-planejamento | Backlog A8R01–A8R12, incrementos e riscos; A8 e registro atualizado da A15 |
| docs/04-modelagem | Modelagem A9, arquitetura A10, complemento da garantia e roteiro do protótipo |
| docs/05-qualidade | Plano A11, revisão A12, casos CT01–CT22 e evidências A13 |
| docs/06-evolucao | SM-01 da A14, dívidas, manutenção, riscos, roadmap, lições e ficha A15 |

Revisão realizada nesta entrega: conferência dos IDs entre requisitos, backlog, critérios, testes e mudança; atualização da matriz com situação da execução e vínculo da SM-01; separação dos modelos de Processos dos diagramas Java de POO; identificação explícita da arquitetura C1–C4 como planejada. RF01 da entrevista A3 e RF1 da linha de base pertencem a catálogos distintos, ligados pela coluna de origem; não são renumerados silenciosamente.

Os prefixos são estáveis: D identifica achados da A12; DT identifica defeitos da A13; DIV identifica dívidas da A15; R identifica riscos; SM identifica solicitações de mudança. A descrição de cada ID foi mantida. O glossário conserva a equivalência entre os estados escritos nos requisitos e no código, sem tratar a padronização pendente D09 como concluída.

Na A13 há 22 casos especificados após a SM-01. As saídas de 11/11 cobrem nove IDs distintos, CT01–CT09: cinco falham, CT03 passa no cenário exercitado e CT04, CT05 e CT08 verificam somente partes do resultado esperado. CT10–CT22 não têm execução registrada. Portanto, cobertura de especificação de 19/19 critérios não significa aprovação do produto. Os 31 testes JUnit de POO e os cinco testes do site têm outro escopo e não eliminam DT01–DT05.

O complemento “Fluxo planejado de retorno em garantia do TechFix” em `docs/04-modelagem/fluxo-garantia.md` representa a RN2 mantendo a origem concluída. O wireframe de abertura da A9 e a tela exclusiva do técnico ainda precisam ser refinados antes da implementação de A8R10 e A8R06; essa pendência está registrada na DIV06. Os PDFs históricos não foram reescritos como se contivessem essa mudança desde a entrega original.

## 2.3 Registro de dívida técnica

Classificação proposta pela equipe para este planejamento: quadrantes prudente ou imprudente, deliberada ou inadvertida. “Inadvertida” indica problema percebido na revisão; “deliberada” indica limitação conhecida e adiada conscientemente. Juros representam retrabalho ou risco acumulado, sem valores financeiros inventados. Custo relativo: P, ajuste localizado; M, vários artefatos ou regras; G, integração e validação entre camadas. Na tabela, “Doc.” significa documentação.

| ID | Descrição | Onde | Tipo | Quadrante | Juros | Custo para<br>pagar<br>(P/M/G) | Decisão | Quando |
|---|---|---|---|---|---|---|---|---|
| DIV01 | Requisitos sem fonte coerente | D01–D07 e D14 | Doc. | Imprudente inadvertida | Alto: regras ambíguas | M | Paga E1 | 11/11, antes da AS |
| DIV02 | Matriz sem critérios e com links removidos | D10–D12 e D14 | Doc. | Imprudente inadvertida | Alto: revisão sem origem | P | Paga E2 | 11/11, antes da AS |
| DIV03 | Login local sem autorização confiável | RNF2 / A8R01 | Produto arquitetura | Prudente deliberada | Alto: acesso indevido | G | Pagar antes de uso real | Próximo, I1 |
| DIV04 | Estados inválidos aceitos | DT01, DT04, DT05 | Produto regras e testes | Imprudente inadvertida | Alto: histórico inconsistente | M | Corrigir e repetir CT06–CT09 | Próximo, I2 |
| DIV05 | E-mail obrigatório e erros não acumulados | DT02, DT03 / A8R02 | Produto validação | Imprudente inadvertida | Médio: bloqueio no cadastro | M | Corrigir e repetir CT01–CT02 | Próximo, I1 |
| DIV06 | Wireframes sem garantia e tela do técnico | A9 / D13 / SM-01 | Doc. modelagem | Prudente deliberada | Médio: implementar fluxo errado | M | Refinar antes do código | Próximo, I2 |
| DIV07 | Sem API e persistência compartilhada com o site | C2–C4 / A8R03–A8R05 | Produto arquitetura | Prudente deliberada | Alto: dados isolados e perda | G | Integrar com migração validada | Próximo, I1 |
| DIV08 | Grafia de estados diferente entre camadas | D09 / RN1 | Produto integração | Prudente deliberada | Médio: conversões e regressão | P | Padronizar com migração | Próximo, I2 |

Localização das referências da coluna Onde: D01–D07/D14 correspondem a `docs/processos/dossie/requisitos.md`; D10–D12/D14, à matriz dessa mesma pasta. DIV03 está no acesso local do frontend, comparado ao RNF2. DT01/DT04/DT05 estão em `OrdemServico.alterarStatus` no Java; DT01 também em `src/services/chamadoService.ts`. DT02/DT03 estão nas validações de Cliente e Equipamento no domínio Java. DIV06 corresponde aos modelos A9 em `docs/processos/entregas/Modelagem-Entrega-Final.pdf`; DIV07, ao armazenamento de `src/services/storage.ts` e à integração C2–C4 ausente; DIV08, aos estados no domínio Java e em `src/types/chamado.ts`.

Evidências das dívidas pagas antes da AS:

- E1: commit 714ac8a, de 11/11, reconstruiu a fonte dos requisitos e explicitou RN1, RNF2, RF1 e RNF3. Evidência: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/commit/714ac8a . A quitação é documental; DT03 no código permanece aberto.
- E2: commit d62fbe6, de 11/11, acrescentou critérios e corrigiu origens e referências da matriz. Evidência: https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/commit/d62fbe6 . A13 ampliou essa matriz com testes e a SM-01 com a mudança. Essa quitação não significa que os testes passaram.

DIV03–DIV08 permanecem abertas na v2.0.0. Novos achados recebem novos IDs, com vínculo ao defeito ou requisito; não se reutilizam DT01–DT05 como números de dívida. O pagamento exige alteração revisada e evidência verificável, além da execução pertinente quando a dívida envolver produto.

## 2.4 Plano de manutenção

Depois da entrega, o plano atribui a Arthur a triagem, a documentação e C1/C3, e a Lucas C2/C4 e os testes das regras. Cada mudança terá um executor e revisão do outro integrante; o PO decide prioridade e aceite de escopo. A continuidade é um planejamento acadêmico da dupla, sem contrato de suporte ou disponibilidade permanente assumida.

Pedidos chegam por uma issue no repositório. Se chegarem durante a demonstração ou por conversa, Arthur registra a issue antes de iniciar a mudança. O pedido contém solicitante, data, problema, motivo, urgência, passos de reprodução e evidência, sem dados reais de clientes. O fluxo segue a A14:

1. Registrar o próximo ID SM disponível, preservando SM-01, e vincular a issue à versão em uso.
2. Arthur e Lucas percorrem requisito, CA, CT, componente, backlog, modelo, dívida e risco afetados; estimam P/M/G e registram alternativas.
3. O PO decide aprovar, aprovar parcialmente, adiar ou rejeitar. Sem ratificação, o registro permanece proposta; simulações são identificadas.
4. Em branch da mudança, o executor altera código e documentação. O outro integrante revisa o PR, confere impactos e evidências de teste.
5. Integrar somente após os critérios aplicáveis; atualizar matriz, riscos e CHANGELOG, criar versão e vincular a release à solicitação.

| Tipo | Exemplo provável no TechFix | Responsável e evidência de saída |
|---|---|---|
| Corretiva | Rejeitar CONCLUÍDA → ABERTA e início sem técnico, corrigindo DT01/DT04; aceitar e-mail vazio em DT03 | Lucas nas regras e Arthur no cadastro; repetir os CT afetados e a regressão, vinculando o resultado ao PR |
| Adaptativa | Adaptar o armazenamento local para API e banco ou atualizar JDK/Node quando o ambiente da equipe mudar | Lucas em C2/C4, Arthur em C1; validar migração, leitura dos registros antigos e execução no novo ambiente |
| Perfectiva | Implementar A8R10 para retorno em garantia e depois o filtro A8R11 | Lucas na RN2 e Arthur na interface; CT19–CT22 e CT12, respectivamente, mais aceite do PO |
| Preventiva | Padronizar os estados D09, validar links do dossiê e automatizar regressões antes de novas funções | Revisão cruzada; DIV08 encerrada apenas com compatibilidade e testes; nenhuma referência quebrada na release |

Cadência planejada: revisão semanal das issues e dívidas; uma release a cada duas semanas quando houver mudanças verificadas. Correção urgente de segurança ou perda de dados será priorizada fora da cadência, depois da reprodução e da revisão, sem prometer prazo de resolução sem diagnóstico. Versão patch corrige sem mudar o contrato; minor acrescenta comportamento compatível; major registra ruptura de contrato ou nova linha de base do dossiê, explicitando o escopo. v2.0.0 identifica o fechamento AS do dossiê, enquanto v11/v12 continuam sendo tags de POO.

Cada versão será comunicada por notas da release e CHANGELOG: alterações, SMs atendidas, limitações, migração e retorno à versão anterior quando aplicável. O link será referenciado na issue e apresentado ao PO na revisão. Não se declara que essas comunicações futuras já ocorreram. Antes de migrar dados, preservar cópia, ensaiar restauração e validar compatibilidade; não apagar dados locais como estratégia de atualização.

## 2.5 Riscos atualizados

Atualização em 18/11/2026 do registro A8: R1–R4 mantêm seus IDs e significados; R5 foi acrescentado pela SM-01; R6 é o risco novo da evolução. Escala original de probabilidade e impacto, de 1 a 3. O status distingue mitigação documental de solução implementada.

| ID e risco | P × I | Status na AS | Resposta e responsável |
|---|---|---|---|
| R1 Divergência de escopo causa retrabalho | 3 × 3 = 9 | Aberto, mitigado parcialmente pelo mapa e pela SM-01 | Arthur mantém valores e relatórios fora da linha de base; nova mudança passa por impacto e decisão; revisar a cada pedido |
| R2 Acesso indevido pelo login local | 3 × 3 = 9 | Aberto, controle no servidor não implementado | Arthur prioriza A8R01/DIV03; usar dados fictícios na demonstração; uso real depende de CT15 e autorização confiável |
| R3 Estado ou responsável alterado sem histórico | 2 × 3 = 6 | Aberto, evidências da A13 mostram falhas | Lucas trata DIV04/DIV07; gravar estado e evento juntos, repetir CT06–CT09 e CT17; bloquear encerramento dos itens afetados |
| R4 Carga e ambiente indefinidos para a meta de 2 s | 2 × 2 = 4 | Parcialmente mitigado: carga definida; ambiente e medição pendentes | Lucas usa 10.000 OS, 10 usuários e 100 operações por fluxo; preparar ambiente e medir CT16 antes do aceite de A8R09 |
| R5 Garantia marcada para defeito diferente | 2 × 2 = 4 | Aberto; CA19 especificado, A8R12 adiado | Arthur exige exibição da origem em A8R10; PO decide quando aprovar confirmação técnica e valores; não apresentar marca Garantia como aceite técnico |
| R6 Perda ou incompatibilidade de dados ao evoluir o armazenamento | 2 × 3 = 6 | Novo, aberto na A15 | Lucas planeja esquema versionado, cópia e ensaio de migração/restauração; Arthur verifica o fluxo no navegador; bloquear atualização incompatível sem recuperação demonstrada |

Nenhum risco é encerrado apenas porque apareceu no plano. A revisão semanal considera incidentes, testes e mudanças de escopo; a redução da pontuação exige evidência registrada.

## 2.6 Roadmap de evolução

“Agora” corresponde ao fechamento documental e à demonstração local da AS. “Próximo” reúne a construção dos incrementos I1/I2 conforme capacidade e aceite; “Depois” contém I3 e decisões que dependem de novos requisitos. Não são promessas de datas para funcionalidades ainda não implementadas.

| Agora | Próximo | Depois |
|---|---|---|
| Integrar o dossiê e publicar v2.0.0; manter E1/E2 das DIV01/DIV02. Motivo: reduzir juros de documentação e tornar a AS verificável. | I1: A8R01 e DIV03, autorização confiável. Motivo: R2 = 9; segurança bloqueia uso real. | I3: A8R11 e CT12, filtro por equipamento adiado pela SM-01. Motivo: a garantia recebeu prioridade no I2; consulta pode evoluir depois. |
| Demonstrar cadastro, vínculo e abertura pelos módulos existentes, relacionados a A8R02–A8R04, expondo as limitações. Motivo: valor imediato para explicar o problema, sem declarar I1 aceito. | I1: A8R02–A8R05, DIV05/DIV07; corrigir cadastro e integrar OS, numeração e histórico. Motivo: valor básico e risco R3/R6; são base para os próximos fluxos. | A8R12, confirmação/recusa da garantia pelo técnico, adiada na SM-01. Motivo: depende de decisão do PO e requisito de valores aprovado; reduzir R5 sem ampliar escopo sem análise. |
| Conferir CA01–CA19, CT01–CT22 e SM-01 na matriz; manter falhas visíveis. Motivo: evitar que cobertura de casos seja confundida com aceite do produto. | I2: refinar DIV06, depois A8R06/A8R07 com DIV04/DIV08. Motivo: corrigir as transições e impedir que os juros de inconsistência cresçam. | D08, eventual divisão de RF2. Motivo: CA04/CA05 já distinguem os fluxos; renumerar agora elevaria o retrabalho em todo o dossiê. |
| Registrar R1–R6 e donos da manutenção. Motivo: continuidade e responsabilidades verificáveis. | I2: A8R10 da SM-01 com CT19–CT22; A8R08 por nome e A8R09 com CT16. Motivo: valor do retorno vinculado, pesquisa útil e validação de desempenho antes de aceite. | Reavaliar dívidas remanescentes e novas integrações somente com impacto registrado. Motivo: pagar juros e controlar R1/R6 antes de aumentar o escopo. |

Dependência explícita: a RN2 não será liberada antes de preservar a RN1 e gravar o vínculo entre OS. Um item só sai do roadmap após implementação, revisão, teste aplicável e decisão de aceite; as dívidas pagas documentalmente não encerram itens de produto.

## 2.7 Lições aprendidas

Se começássemos o TechFix hoje, manteríamos desde o início uma fonte versionada de requisitos com IDs estáveis e uma matriz até os testes, em vez de distribuir decisões apenas em PDFs. Definiríamos primeiro as transições permitidas da OS, os campos obrigatórios e os limites entre protótipo local e arquitetura pretendida, porque a A12 e a A13 revelaram ambiguidades e comportamentos incompatíveis com o dossiê. Também revisaríamos cada mudança de escopo com seu impacto em modelos, backlog e testes, como na SM-01, e reservaríamos tempo para pagar dívidas antes da apresentação. O apoio de IA continuaria declarado, com conferência das evidências e validação humana das decisões; uma simulação não substituiria a participação do PO.
