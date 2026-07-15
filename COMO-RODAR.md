# 🚀 Como rodar o EventHub (Modo Demo)

Este guia coloca o app no ar em ~10 minutos, **sem instalar banco de dados**.
O modo demo usa armazenamento em memória — perfeito para testar o login e navegar
pela interface. (Os dados reiniciam quando você para o servidor.)

## Pré-requisito

- **Node.js 18 ou superior** — baixe em https://nodejs.org (versão LTS)
  - Para conferir se já tem: abra o terminal e rode `node --version`

## Passo 1 — Baixar o projeto (só na primeira vez)

```bash
git clone https://github.com/robsonnascimento1313-maker/eventhub.git
cd eventhub
git checkout claude/eventhub-initial-files-qp5569
```

## Passo 2 — Rodar o BACKEND

Abra um terminal:

```bash
cd backend
npm install
npm run dev
```

Espere aparecer: `EventHub backend running on http://localhost:3000`
**Deixe esse terminal aberto.**

## Passo 3 — Rodar o FRONTEND

Abra um **segundo** terminal (sem fechar o primeiro):

```bash
cd frontend
npm install
npm run dev
```

Espere aparecer: `ready - started server on http://localhost:3001`

## Passo 4 — Acessar no navegador

Abra: **http://localhost:3001**

### Conta demo já pronta (login imediato)

- **Email:** `demo@eventhub.com`
- **Senha:** `demo123`

Ou clique em **"Criar conta"** para registrar um novo usuário.

## O que você pode navegar

| Tela | Descrição |
|------|-----------|
| Login / Registro | Autenticação com JWT |
| Dashboard | Visão geral com cards de métricas |
| Eventos | Gestão de eventos corporativos |
| Fornecedores | Catálogo por categoria |
| Pedidos | Acompanhamento de solicitações |
| Pagamentos | Painel financeiro (Stripe) |

---

## Passar para produção (banco real)

O modo demo não salva dados permanentemente. Quando quiser um banco real:

1. O schema Prisma já está pronto em `backend/prisma/schema.prisma`
2. O `PrismaService` está em `backend/src/database/prisma.service.ts`
3. Basta reinstalar `prisma`, `@prisma/client` e `bcrypt`, trocar o `MemoryStore`
   pelo `PrismaService` no `auth.service.ts`, configurar o `DATABASE_URL`
   (ex.: Supabase) e rodar `npx prisma migrate dev`.

Peça ajuda ao Claude para fazer essa migração quando estiver pronto.
