# A11 — Plano inicial de qualidade — Entrega final

Fontes do dossiê citadas por código: A3 (entrevista simulada, IDs RF01–RF17 e RNF01–RNF07 da A3), A4 (RE1–RE5), A5 (RF1–RF3, RN1, RNF1, RNF2, HU1, HU2 e critérios da seção 2.2.2), A7 (fluxo e Definition of Done), A8 (itens A8R01–A8R09 e riscos R1–R4), A9 (fluxograma e wireframe) e A10 (componentes C1–C4). Nomes das características e subcaracterísticas conforme a ISO/IEC 25010:2023.

## 2.1 Contexto

O TechFix substitui o registro em papel e planilhas de uma assistência técnica de pequeno porte que conserta notebooks e desktops (A3 §3; RE1). O sistema cadastra cliente e equipamento, abre a ordem de serviço (OS), acompanha os estados ABERTA → EM ATENDIMENTO → CONCLUÍDA com técnico responsável e mantém o histórico consultável por número, cliente ou equipamento (RF1–RF3, RN1). Os usuários são o atendente do balcão, o técnico e o administrador. Os stakeholders com mais peso nas decisões de qualidade são: o **Product Owner Chico Mosca**, representante da assistência, que ordena o backlog e aceita os incrementos (A7 §2.2); o **atendente**, representado na A3 por Marcos Almeida (entrevista simulada), que usa o sistema o dia todo e pediu simplicidade e agilidade (A3 RNF01–RNF03; RE5); e o **administrador/dono**, que precisa de dados administrativos protegidos (RE4; RNF2). O técnico é usuário direto do fluxo do I2 (HU2), e os clientes finais são afetados indiretamente, porque seus dados pessoais e o histórico do equipamento ficam no sistema.

## 2.2 Características priorizadas

Foram priorizadas cinco características, na ordem de importância para o projeto.

1. **Adequação funcional — correção funcional.** O valor do produto está em registrar corretamente o ciclo da OS. RN1 e os critérios do RF2 (A5 §2.2.2) proíbem estados inconsistentes e o retorno de uma OS CONCLUÍDA; o risco R3 (A8 §2.5) aponta que uma alteração de estado errada destrói a rastreabilidade. A regra é aplicada em C2 (A10 §2.2). Os sete requisitos Must da A5 (RF1, RF2, RF3, RN1, RNF2, HU1, HU2) dependem dela.
2. **Segurança — confidencialidade.** RNF2 exige bloquear 100% dos acessos sem permissão a dados administrativos; vem de RE4 e de A3 RF12, RNF04 e RNF05. O risco R2 é alto (P × I = 9), porque o login atual existe só no navegador. A8R01 é o primeiro item do backlog, e C3 deve autorizar no servidor, inclusive em chamadas diretas à API (A10 §2.2).
3. **Confiabilidade — tolerância a falhas.** A OS e seu evento de histórico precisam ser gravados juntos. Uma falha não pode gerar protocolo falso nem OS duplicada no reenvio (A10 §2.3; fluxograma da A9 §2.2). Isso cobre RF3 (histórico), A8R03, A8R05 e o risco R3, e envolve C2 e C4.
4. **Eficiência de desempenho — comportamento temporal.** RNF1 define que 95% das operações principais respondam em até 2 s, com base de até 10.000 OS (A5; A8 §2.4). Vem de RE5 e de A3 RNF03 ("não tornar o atendimento mais demorado"). Está em A8R09, e o risco R4 indica que a carga e o ambiente ainda não estão definidos.
5. **Capacidade de interação — operabilidade.** O atendente exigiu poucos campos e telas e um atendimento tão rápido quanto o atual (A3 RNF01–RNF03; RE5; HU1), o que a A12 formalizou como RNF3. O wireframe da A9 §2.3 reúne seleção, cadastro rápido e mensagens em uma tela. O critério do RF1 (A5 §2.2.2) exige indicar cada campo pendente, e C1 é o componente responsável.

## 2.3 Plano de qualidade

| Característica | Subcaracterística | Por que importa neste projeto | Métrica | Meta | Como verificar | Responsável | Quando |
|---|---|---|---|---|---|---|---|
| Adequação funcional | Correção funcional | RN1 e o RF2 proíbem estados inconsistentes e o retorno de CONCLUÍDA (A5 §2.2.2); o R3 aponta perda de rastreabilidade; regra em C2 | (a) % dos casos de teste de prioridade Alta de RF1–RF3/RN1 aprovados; (b) nº de transições inválidas aceitas | (a) 100% aprovados; (b) 0 aceitas entre as 7 transições inválidas da tabela de decisão de RN1 (9 combinações estado atual × estado pedido, menos as 2 permitidas) e 0 inícios sem técnico aceitos | Testes automatizados de C2 (JUnit no domínio Java; testes da API quando existir) e tabela de decisão de RN1 executada a cada incremento | Lucas (executa), Arthur (revisa) | Toda Sprint que alterar C2; fechamento do I1 e do I2 |
| Segurança | Confidencialidade | RNF2 com 100% de bloqueio (RE4; A3 RF12/RNF04/RNF05); R2 alto (9); A8R01 é o primeiro item do backlog; C3 autoriza no servidor | % das requisições não autorizadas negadas na matriz de perfis do RNF2 (`docs/dossie/requisitos.md`), incluindo chamadas diretas à API e sem sessão | 14 de 14 tentativas negadas (100%), sem nenhum dado retornado ou alterado | Roteiro de requisições HTTP diretas (script ou Postman) com cada perfil sem permissão e sem token, executado contra C2/C3 | Arthur (executa), Lucas (revisa) | I1, ao concluir A8R01; regressão no I2; bloqueia a implantação |
| Confiabilidade | Tolerância a falhas | OS e evento gravados juntos; sem protocolo falso nem duplicação (A10 §2.3; A9 §2.2); R3; C2/C4 | Nº de OS sem evento inicial, OS duplicadas ou protocolos exibidos sem gravação, após falhas injetadas | 0 ocorrências em 20 falhas injetadas (10 na abertura, 10 na mudança de estado) e 0 duplicações em 10 reenvios | Teste de integração com um dublê da interface `RepositorioOrdens` que lança falha na gravação sob demanda, mais reenvio da mesma operação | Lucas (executa), Arthur (revisa) | I1 (abertura, A8R03/A8R05) e I2 (estados, A8R06/A8R07) |
| Eficiência de desempenho | Comportamento temporal | RNF1 (A5; A8 §2.4); RE5 e A3 RNF03; A8R09; R4 | Tempo do comando à resposta, percentil 95, por fluxo | p95 ≤ 2,0 s em cada um dos 4 fluxos (cadastro, abertura, atualização, busca), com 10.000 OS, 10 usuários simultâneos e pelo menos 100 operações por fluxo | Script de carga (k6) contra o ambiente de ensaio com a massa gerada; relatório com ambiente, massa e medições | Lucas (executa), Arthur (revisa) | Cenário validado no I1 (mitigação do R4); medição final no I2 (A8R09) |
| Capacidade de interação | Operabilidade | O atendente pediu poucos campos e telas e um atendimento tão rápido quanto o atual (A3 RNF01–RNF03; RE5; HU1; RNF3); wireframe da A9 §2.3; C1 | Tempo para abrir uma OS, sem ajuda, com sessão aberta (RNF3) | Cliente já cadastrado: ≤ 1 min; cliente novo: ≤ 3 min; na primeira tentativa, para os 3 participantes (o PO e 2 colegas sem contato prévio com o sistema) | Teste de usabilidade com roteiro e cronômetro na Sprint Review, observado pelo PO | Arthur (conduz), Chico Mosca (PO, valida) | Review do I1 e do I2 |

## 2.4 Características deixadas para depois

| Característica (ISO/IEC 25010:2023) | Motivo para não priorizar agora | Quando revisitar |
|---|---|---|
| Compatibilidade (interoperabilidade) | A linha de base não tem nenhuma integração externa; e-mail, WhatsApp e pagamentos só entram com requisito aprovado (A10 §2.2) | Quando um requisito de integração for aprovado |
| Flexibilidade (instalabilidade e adaptabilidade) | Existe uma única loja e um único ambiente; framework, banco e implantação ainda não foram definidos (A10 §2.2 e §2.7) | No detalhamento técnico da implantação |
| Manutenibilidade | Ainda não há código integrado para medir; a revisão cruzada da DoD (A7 §2.5) já reduz o risco | Depois do I2, com frontend, API e banco integrados |
| Proteção (*safety*) | O sistema não controla equipamentos físicos nem oferece risco a pessoas ou ao ambiente | Não se prevê revisão |

## 2.5 Conflitos entre características

| Conflito | Onde aparece no projeto | Decisão da equipe |
|---|---|---|
| Segurança × Capacidade de interação | RNF2/R2 exigem autenticação e autorização; RE5 e A3 RNF01–RNF03 pedem rapidez no balcão, onde o atendente alterna entre clientes | Cada atendente tem login individual (sem conta compartilhada). A sessão expira após 30 min sem uso, e não a cada operação. A autorização é verificada no servidor em toda operação, sem passo extra para o usuário. A meta de operabilidade é medida com a sessão aberta |
| Confiabilidade × Eficiência de desempenho | A transação única de OS + evento e a verificação de reenvio (A10 §2.3) acrescentam custo à abertura, que precisa caber em 2 s (RNF1) | A integridade prevalece: a transação não é removida para cumprir o tempo. Se o p95 passar de 2 s, a equipe otimiza consultas e índices dentro do A8R09 (tamanho G, com reserva para ajustes) |

## 2.6 Qualidade dentro do processo — Definition of Done atualizada

Os critérios da A7 §2.5 continuam valendo. Foram acrescentados os critérios Q1–Q5, verificados nos estados do fluxo da A7 §2.4.

| ID | Critério de qualidade acrescentado | Momento do fluxo (A7 §2.4) | Evidência |
|---|---|---|---|
| Q1 | Os casos de teste do item, com pelo menos 1 caso negativo, foram executados e aprovados | Em verificação | Saída dos testes vinculada ao cartão |
| Q2 | Toda operação protegida foi testada com um perfil sem permissão e com chamada direta à API | Em verificação | Resultado do roteiro de autorização |
| Q3 | O revisor conferiu o item contra a meta da característica afetada neste plano | Em revisão | Registro do revisor com a meta conferida |
| Q4 | Itens que alteram abertura, estado ou histórico passaram pela falha de gravação simulada sem OS parcial | Em verificação | Teste de integração com falha injetada |
| Q5 | Itens ligados ao RNF1 têm a medição de p95 registrada no ambiente de ensaio | Em verificação, antes de Pronta tecnicamente | Relatório de carga |
| Q6 | Documento entregue conferido contra a fonte versionada; requisito alterado atualiza critérios CA e matriz no mesmo commit (acrescentado pela A12) | Em revisão | Registro do revisor com o diff conferido |

## 2.7 Correções do esboço e da AP2

| No esboço ([A11-plano-qualidade-esboco.md](A11-plano-qualidade-esboco.md)) | Na versão final | Motivo |
|---|---|---|
| Seis características, com nomes da norma de 2011 ("Usabilidade", "Funcionalidade") | Cinco características, com nomes da ISO/IEC 25010:2023 (Adequação funcional, Capacidade de interação etc.) e subcaracterística definida | Limite de 3 a 5 e nomenclatura exigida |
| Metas "rápido", "seguro", "fácil" | Toda meta tem número e condição (p95 ≤ 2,0 s, 100% negadas, 0 em 20 falhas, ≤ 2 min) | Metas verificáveis |
| Justificativas genéricas | Justificativas com RF/RN/RNF, RE, A8R, R1–R4 e C1–C4 | Rastreabilidade com o dossiê |
| Sem responsável, momento ou forma de verificar | Colunas completas, ligadas aos responsáveis pelos riscos da A8 (R2: Arthur; R3/R4: Lucas) | Plano executável |
| Manutenibilidade priorizada sem métrica | Adiada com motivo; coberta pela revisão cruzada | Foco nos riscos altos |
| Sem conflitos, sem características adiadas, sem DoD | Seções 2.4, 2.5 e 2.6 | Itens do enunciado |

**Correção prioritária da AP2.** O retorno oral da AP2 não ficou registrado no repositório. A equipe tratou como prioridade a pendência que a própria AP2 deixou para a AS: o slide 12 e a ficha da AP2 diziam que a autorização no servidor, os testes de regras, estados e falhas e a medição de desempenho eram apenas planejados, e que o protótipo atual guarda dados localmente. O encaminhamento foi transformar essas promessas em metas mensuráveis (linhas de Segurança, Adequação funcional, Confiabilidade e Desempenho), em critérios Q1–Q5 da DoD e, na A13, em casos de teste. A outra pendência da AP2, conciliar a cópia local da A5 com a versão avaliada, foi levada à revisão da A12.

<!-- fim-da-ficha -->

## Revisões após a entrega

| Data | Origem | Mudança |
|---|---|---|
| 11/11/2026 | A12, achado D15 | Meta (b) de Adequação funcional passa a contar as 7 transições inválidas definidas na RN1 corrigida |
| 11/11/2026 | A12, achado D16 | Meta de Segurança enumera as 14 tentativas negadas da matriz de perfis do RNF2 |
| 11/11/2026 | A12, achado D17 e validação V2 | Meta de Capacidade de interação passa de ≤ 2 min para ≤ 1 min (cliente cadastrado) e ≤ 3 min (cliente novo), com participantes definidos |
| 11/11/2026 | A12, achado D18 | Verificação de Confiabilidade indica o dublê de `RepositorioOrdens` |
| 11/11/2026 | A12, síntese | Critério Q6 acrescentado à Definition of Done |
