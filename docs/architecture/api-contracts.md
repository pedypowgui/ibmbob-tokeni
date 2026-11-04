# Contratos da API — Tokeni

Base URL: `http://localhost:3001/api`

## Padrão de resposta

```json
{ "data": <payload>, "error": null }
{ "data": null, "error": { "code": "ERROR_CODE", "message": "Mensagem de erro" } }
```

---

## Personas

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/personas` | Lista todas as personas |
| GET | `/personas/:personaId` | Dados de uma persona |

---

## Dashboard

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/dashboard/:personaId` | Resumo financeiro (renda, gastos, saldo, alertas, últimas transações) |

---

## Transações

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/transactions/:personaId` | Lista transações. Query: `?category=food&from=2025-07-01&to=2025-07-31` |
| GET | `/transactions/:personaId/:id` | Detalhe de uma transação |

---

## Orçamento

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/budget/:personaId` | Orçamento mensal: limites, utilizado, restante por categoria |

---

## Sonhos (Objetivos)

| Método | Endpoint | Body | Descrição |
|---|---|---|---|
| GET | `/goals/:personaId` | — | Lista objetivos |
| GET | `/goals/:personaId/:id` | — | Detalhe de um objetivo |
| POST | `/goals/:personaId` | `{ title, emoji, targetAmount, currentAmount, deadline }` | Criar objetivo |
| PUT | `/goals/:personaId/:id` | campos parciais | Atualizar objetivo |

---

## Gamificação

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/gamification/:personaId` | Pontos, nível, missões e conquistas |
| POST | `/gamification/:personaId/missions/:missionId/complete` | Concluir missão |

---

## Assistente de IA

| Método | Endpoint | Body | Descrição |
|---|---|---|---|
| POST | `/assistant/chat` | `{ personaId, message, history[] }` | Enviar mensagem ao agente |

### Exemplo de requisição

```json
POST /api/assistant/chat
{
  "personaId": "jose",
  "message": "Como está meu orçamento?",
  "history": [
    { "role": "user", "content": "Olá", "timestamp": "2025-07-10T10:00:00Z" },
    { "role": "assistant", "content": "Olá! Como posso ajudar?", "timestamp": "2025-07-10T10:00:01Z" }
  ]
}
```

### Exemplo de resposta

```json
{
  "data": {
    "reply": "Seu orçamento está com 78% utilizado. A categoria Lazer está acima do limite...",
    "toolsUsed": []
  },
  "error": null
}
```
