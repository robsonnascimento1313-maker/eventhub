# EventHub

Plataforma B2B de serviços sob demanda para eventos corporativos.

## Objetivo
Permitir que empresas solicitem serviços (buffet, som, decoração etc.) diretamente de fornecedores, com:
- Confirmação via QR Code
- Split automático de pagamentos
- Dashboard corporativo

## Stack técnica
- Frontend: Next.js + Tailwind CSS
- Backend: Node.js + NestJS + TypeScript
- Banco de dados: PostgreSQL (Prisma ORM)
- Autenticação: JWT + bcrypt
- Pagamentos: Stripe API (Stripe Connect)
- Hospedagem: Vercel (frontend) + Render (backend) + Supabase (Postgres)

## Estrutura inicial
```
/app
├── frontend/
├── backend/
└── README.md
```

## Como rodar
1. Instalar dependências: `npm install`
2. Rodar migrações: `npx prisma migrate dev`
3. Iniciar servidor: `npm run start`

## Variáveis de ambiente
