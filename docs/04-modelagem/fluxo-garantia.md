# Fluxo planejado de retorno em garantia do TechFix

Complemento da A9 na versão final AS. IDs: SM-01, RN2, RF2, RF3, CA16–CA19, CT19–CT22, A8R10. Este modelo descreve comportamento a implementar, não uma tela disponível.

```mermaid
flowchart TD
    A[Atendente solicita retorno em garantia] --> B{Usuário autorizado para O2?}
    B -->|Não| N[Negar sem criar OS]
    B -->|Sim| C[Selecionar cliente equipamento e OS de origem]
    C --> D{Origem concluída e do mesmo equipamento?}
    D -->|Não| E[Recusar com o motivo previsto no CA18]
    D -->|Sim| F{Até 90 dias corridos da conclusão?}
    F -->|Não| G[Recusar garantia e informar vencimento CA17]
    F -->|Sim| H[Exibir número defeito e serviço da origem]
    H --> I[Confirmar criação da nova OS Garantia em ABERTA]
    I --> J{Gravação de OS vínculo e evento concluída?}
    J -->|Não| K[Informar falha sem protocolo de sucesso]
    J -->|Sim| L[Exibir vínculo nas duas OS CA19]
    L --> M[Manter origem CONCLUÍDA e nova OS seguindo RN1]
```

O 90º dia é aceito (CT19); o 91º é recusado (CT20). Estado e equipamento inválidos são cobertos por CT21; consulta bidirecional, por CT22. C2 valida e C4 grava; C1 apresenta; C3 autoriza. A confirmação técnica da garantia continua adiada em A8R12. Refinar o wireframe com o campo OS de origem antes de implementar A8R10 (DIV06).
