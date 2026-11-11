# Backlog do produto — TechFix

Fonte versionada do backlog revisado na A8 (`docs/backlog/Backlog-TechFix.pdf` e `docs/entregas-processos/A8-Entrega-Final.pdf`, seções 2.2 a 2.5). P/M/G = tamanho relativo; A8R04 é a referência.

## Itens

| Ordem | ID | Item | Origem | Prioridade | Tamanho | Incremento | Critério de aceitação |
|---|---|---|---|---|---|---|---|
| 1 | A8R01 | Acesso por perfil: atendente, técnico e administrador | RNF2 | Must | G | I1 | Autenticar usuários e negar acesso sem permissão, inclusive por acesso direto |
| 2 | A8R02 | Cadastrar cliente e equipamento vinculado | RF1, HU1 | Must | M | I1 | Salvar nome, telefone, tipo e defeito; indicar todos os obrigatórios ausentes |
| 3 | A8R03 | Abrir ordem de serviço | RF2, RN1, HU1 | Must | M | I1 | Gerar número único, data de abertura e estado ABERTA para cliente/equipamento válidos |
| 4 | A8R04 | Localizar OS pelo número e consultar detalhes | RF3, HU1 | Must | P | I1 | Busca exata mostra cliente, equipamento, técnico (ou não atribuído) e estado; tratar ausência |
| 5 | A8R05 | Registrar e consultar histórico da OS | RF3, HU1, HU2 | Must | M | I1 | Eventos cronológicos com data, hora, usuário e alteração; integrar novos eventos no I2 |
| 6 | A8R06 | Atribuir técnico, listar suas OS e iniciar atendimento | RF2, RN1, HU2 | Must | M | I2 | ABERTA passa a EM ATENDIMENTO com responsável e evento no histórico |
| 7 | A8R07 | Concluir atendimento e proteger o estado final | RF2, RN1, HU2 | Must | M | I2 | Concluir OS em atendimento; rejeitar retorno de CONCLUÍDA a estados anteriores |
| 8 | A8R08 | Pesquisar por cliente e equipamento | RF3, HU1 | Must | M | I2 | Nome parcial retorna todas as correspondências; equipamento selecionado filtra suas OS |
| 9 | A8R09 | Garantir resposta rápida nas operações principais | RNF1 | Should | G | I2 | Até 2 s em pelo menos 95% das operações, com base de até 10.000 OS e cenário de medição documentado |

## Incrementos

| Incremento | Itens | Valor ao usuário |
|---|---|---|
| I1 — Receber e localizar um atendimento | A8R01–A8R05 (1 P + 3 M + 1 G) | O atendente autorizado cadastra cliente/equipamento, abre OS e recupera protocolo e histórico inicial |
| I2 — Acompanhar e concluir o serviço | A8R06–A8R09 (3 M + 1 G) | O técnico acompanha, inicia e conclui suas OS; o atendente pesquisa por cliente/equipamento |

## Riscos (A8 §2.5)

| ID | Risco | P × I | Mitigação / responsável |
|---|---|---|---|
| R1 | Divergência de escopo causa retrabalho | 3 × 3 = 9 | Arthur: revisar mapa A5 → A8R; manter pagamento, avaliação e relatório fora da linha de base |
| R2 | Acesso indevido: login atual é local no navegador | 3 × 3 = 9 | Arthur: autorização em camada confiável; testar perfis sem permissão e acesso direto |
| R3 | Alteração de estado ou responsável sem histórico | 2 × 3 = 6 | Lucas: gravar alteração e evento juntos; testar falha de gravação e reabertura de OS concluída |
| R4 | Carga e ambiente indefinidos para a meta de 2 s | 2 × 2 = 4 | Lucas: validar cenário de carga no I1; medir por fluxo no A8R09 |
