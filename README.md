# Task Manager Application

A full-stack task management application built with Next.js, Hasura, tRPC, and NextAuth.

## Getting Started

**Prerequisites:** Node.js 18+, Docker, Hasura CLI (`npm install -g hasura-cli`)

```bash
npm install                                     # install dependencies
cp .env.example .env.local                            # create env config
docker-compose --env-file .env.local up                    # start PostgreSQL & Hasura
cd hasura
hasura migrate apply --database-name default    # apply migrations
hasura metadata apply                           # apply permissions
hasura seed apply --database-name default       # load demo data
cd ..
npm run dev                                     # start dev server
```

Open http://localhost:3000

**Demo credentials:** 
1. `demo@example.com` / `password123`
2. `test@example.com / test1234`

## Environment Variables

| Variable | Description |
|---|---|
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `POSTGRES_DB` | PostgreSQL database name |
| `HASURA_ADMIN_SECRET` | Hasura admin secret |
| `HASURA_JWT_SECRET` | JWT signing key (min 32 chars) |
| `HASURA_GRAPHQL_ENDPOINT` | Hasura GraphQL endpoint |
| `NEXTAUTH_SECRET` | NextAuth session secret (min 32 chars) |
| `NEXTAUTH_URL` | NextAuth base URL |

Both `docker-compose.yml` and Next.js read from the same `.env.local` file.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: tRPC 11, Hasura GraphQL
- **Database**: PostgreSQL 15 (via Hasura)
- **Authentication**: NextAuth.js with JWT
- **Styling**: Tailwind CSS 4, Radix UI
- **Architecture**: Feature-Sliced Design (FSD)

## Project Structure (FSD)

```
src/
├── app/                      # Next.js App Router
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth route
│   │   └── trpc/[trpc]/         # tRPC route
│   ├── faq/                     # FAQ page (SSG)
│   ├── login/                   # Login page
│   ├── tasks/                   # Tasks page (CSR)
│   ├── terms/                   # Terms of Service (SSR)
│   ├── layout.tsx
│   └── providers.tsx
├── shared/                   # Shared layer
│   ├── api/
│   │   ├── auth/               # NextAuth config
│   │   ├── graphql/task/       # GraphQL queries & types
│   │   ├── hasura/             # Hasura client
│   │   └── trpc/               # tRPC server & client
│   ├── lib/                    # Utilities
│   ├── types/                  # Type definitions
│   └── ui/                     # UI components (Radix UI)
├── entities/                 # Business entities
│   ├── task/
│   ├── user/
│   └── session/
├── features/                 # User features
│   ├── auth/login/
│   ├── auth/logout/
│   └── task/create|edit|delete|toggle-complete/
└── widgets/                  # Composite components
    ├── navigation/
    └── task-list/
```

## License

MIT
