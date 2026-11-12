# Tokeni 💚

> Plataforma de organização financeira pessoal com inteligência artificial.
>
> Projeto desenvolvido para o desafio IBM com IBM Bob.

---

## O que é o Tokeni?

O Tokeni é uma aplicação web Mobile First que utiliza IA para ajudar pessoas a compreender seus hábitos financeiros, administrar gastos e alcançar objetivos pessoais.

A plataforma funciona com dados completamente fictícios e suporta duas personas:

| Persona | Perfil |
|---|---|
| **Janaína Brito** | Dona de casa. Foco em controle de despesas, dívidas e economia familiar. |
| **José Fá** | Jovem no primeiro emprego. Foco em equilíbrio entre consumo, lazer e planejamento. |

---

## Tecnologias

| Camada | Stack |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, React Router DOM, Recharts, Lucide React |
| Backend | Node.js, Express, TypeScript, Zod |
| Dados | Arquivos JSON simulados com camada Repository |
| IA | Provider substituível (Mock padrão, compatível com OpenAI e IBM watsonx) |

---

## Arquitetura

```
tokeni/
├── frontend/       ← React (Feature-Based Architecture + MVC inspirado)
├── backend/        ← Node.js + Express (MVC)
├── docs/           ← Documentação técnica
├── .env.example
└── README.md
```

Ver documentação completa em [`docs/architecture/overview.md`](docs/architecture/overview.md).

---

## Pré-requisitos

- Node.js 18+
- npm 9+

---

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-org/ibmbob-tokeni.git
cd ibmbob-tokeni

# Instale as dependências do frontend
cd frontend && npm install && cd ..

# Instale as dependências do backend
cd backend && npm install && cd ..
```

---

## Configuração das variáveis de ambiente

```bash
cp .env.example backend/.env
```

Edite `backend/.env` conforme necessário. Por padrão, o `AI_PROVIDER=mock` funciona sem nenhuma chave de API.

Para usar um modelo real:

```env
AI_PROVIDER=openai
AI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
```

Para IBM watsonx (API compatível com OpenAI):

```env
AI_PROVIDER=watsonx
AI_API_KEY=<sua-chave>
AI_BASE_URL=https://us-south.ml.cloud.ibm.com/ml/v1
AI_MODEL=ibm/granite-3-3-8b-instruct
```

---

## Execução local

### Backend (porta 3001)

```bash
cd backend
npm run dev
```

### Frontend (porta 5173)

```bash
cd frontend
npm run dev
```

Acesse: **http://localhost:5173**

O frontend proxy automaticamente `/api/*` para `http://localhost:3001`.

---

## Como alternar entre personas

Na tela inicial, selecione a persona desejada (Janaína ou José). A seleção é salva no `localStorage`. Para trocar de persona, use o botão **Sair** na barra de navegação.

---

## Como funciona o agente de IA

1. O usuário envia uma mensagem na tela **Assistente**.
2. O frontend chama `POST /api/assistant/chat` com `{ personaId, message, history }`.
3. O backend constrói o contexto financeiro da persona (renda, saldo, alertas, objetivos).
4. O contexto é injetado no system prompt do agente.
5. O provider envia a conversa ao modelo de IA.
6. A resposta é retornada ao frontend.

O agente **nunca** inventa dados financeiros — todos os valores vêm dos serviços do backend.

---

## Testes

```bash
cd backend
npm test
```

---

## Fluxo de contribuição

```
main ← develop ← feat/frontend
                ← feat/finance
                ← feat/backend-agent
                ← feat/goals
```

1. Crie sua branch a partir de `develop`.
2. Faça commits convencionais (`feat:`, `fix:`, `docs:`, etc.).
3. Abra um Pull Request para `develop`.
4. Após revisão, merge via PR.
5. `develop` → `main` apenas para releases estáveis.

---

## Estrutura de pastas

```
frontend/src/
├── components/         ← Componentes reutilizáveis
├── features/           ← Domínios funcionais (dashboard, transactions, budget, goals, assistant)
│   └── [feature]/
│       ├── [Feature]View.tsx       ← Apresentação (View)
│       ├── use[Feature]Controller.ts ← Estado e lógica (Controller hook)
│       └── [feature]Service.ts     ← Comunicação com API (Service)
├── hooks/              ← Hooks globais (usePersona, useApi)
├── layouts/            ← AppLayout com navegação
├── routes/             ← AppRouter
├── types/              ← Contratos compartilhados
└── styles/             ← CSS global + tokens

backend/src/
├── agents/             ← Agente de IA isolado
│   ├── financial-agent/ ← agent, prompt, context, tools
│   └── providers/       ← interface AIProvider + implementações
├── controllers/        ← Recebem HTTP, delegam para services
├── middlewares/        ← errorHandler, validatePersona
├── models/             ← Interfaces TypeScript das entidades
├── repositories/       ← Abstração de acesso aos dados JSON
├── routes/             ← Definição de endpoints
├── services/           ← Regras de negócio
└── data/               ← janaina.json, jose.json (dados fictícios)
```

---

## Equipe

| Membro | Branch | Responsabilidade |
|---|---|---|
| A | `feat/frontend` | Design system, Dashboard, Extrato, Layout |
| B | `feat/finance` | Models, Repositories, Dados, Cálculos, Orçamento |
| C | `feat/backend-agent` | Express, MVC, Rotas, IA, API |
| D | `feat/goals` | Sonhos, Gamificação, Testes, Documentação |
