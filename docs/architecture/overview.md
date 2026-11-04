# Arquitetura Geral do Tokeni

## Visão geral

O Tokeni é um monorepo com duas aplicações independentes que se comunicam via REST API:

```
Browser → Frontend (React) → /api/* → Backend (Express) → JSON data
                                              ↓
                                        AI Agent Layer → AI Provider
```

## Diagrama de camadas

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│  Views ← Controller Hooks ← Feature Services       │
│          (React components) (custom hooks) (fetch)  │
└─────────────────────────┬───────────────────────────┘
                          │ REST API (JSON)
┌─────────────────────────▼───────────────────────────┐
│                    BACKEND (MVC)                    │
│  Routes → Controllers → Services → Repositories    │
│                              ↓                      │
│                         AI Agent                    │
│                   (context + prompt + tools)        │
│                              ↓                      │
│                         AI Provider                 │
│                  (mock / openai / watsonx)           │
└─────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────┐
│                    DATA LAYER                       │
│            JSON files (janaina.json, jose.json)     │
└─────────────────────────────────────────────────────┘
```

## Princípios da arquitetura

1. **Separação de responsabilidades**: cada camada tem uma função única e bem definida.
2. **Isolamento do agente de IA**: o agente não acessa dados diretamente; consulta services.
3. **Provider substituível**: trocar o modelo de IA não exige alterar serviços ou controllers.
4. **Repository pattern**: trocar JSON por banco de dados no futuro exige apenas alterar os repositories.
5. **Contratos tipados**: os tipos TypeScript em `frontend/src/types/` e `backend/src/models/` devem permanecer sincronizados.

## Documentos relacionados

- [Fluxo MVC do backend](./backend-mvc.md)
- [Organização do frontend](./frontend-structure.md)
- [Fluxo do agente de IA](./ai-agent-flow.md)
- [Contratos da API](./api-contracts.md)
