# Supabase Database Setup

This project already uses `Prisma + PostgreSQL`, so the cleanest Supabase setup is:

- Keep Prisma as the ORM and migration tool
- Use Supabase only as the hosted Postgres backend
- Keep Auth0, Stripe, PayPal, and Cloudinary as they are

## 1. Create the Supabase project

Create a new Supabase project and copy the database password you chose during setup.

## 2. Prepare connection strings

You need two connection strings:

- `POSTGRES_PRISMA_URL`
  Runtime connection for Prisma Client and Next.js
- `POSTGRES_URL_NON_POOLING`
  Migration and Prisma CLI connection

Recommended values:

```env
POSTGRES_PRISMA_URL="postgresql://postgres.PROJECT_REF:YOUR_DB_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://postgres.PROJECT_REF:YOUR_DB_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

Notes:

- `POSTGRES_PRISMA_URL` should use Supavisor transaction mode on port `6543`
- `POSTGRES_URL_NON_POOLING` should use the non-pooling `5432` connection
- If your Vercel project is already linked to Supabase, Vercel usually injects these names for you

## 3. Configure local environment

Copy the values into `.env.local`.

At minimum:

```env
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NON_POOLING="..."
```

## 4. Run Prisma against Supabase

Generate the client:

```bash
npm run db:generate
```

Run local development migrations:

```bash
npm run db:migrate
```

Deploy existing migrations to a shared or production database:

```bash
npm run db:migrate:deploy
```

Seed baseline data if needed:

```bash
npm run db:seed
```

## 5. Configure Vercel

If your Vercel project is already linked to Supabase, these variables should
already exist in Vercel:

- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

Recommended mapping:

- Preview: separate Supabase project or separate branch database if you use one
- Production: production Supabase project

Do not point Preview and Production to the same write database unless that is intentional.

## 6. Operational notes

- Prisma migrations should be run with `npm run db:migrate:deploy` outside the normal Next.js build
- The application runtime should use `POSTGRES_PRISMA_URL`
- Prisma migrate commands should use `POSTGRES_URL_NON_POOLING`

## 7. Optional: Auth0 Wrapper for SQL-side user inspection

If you want to query Auth0 users directly from Supabase SQL, this repo now includes a
template at [`supabase/sql/auth0-wrapper.sql`](supabase/sql/auth0-wrapper.sql).

What it gives you:

- A read-only foreign table: `auth0.auth0_users`
- Direct SQL inspection of Auth0 users in Supabase Studio
- A safe complement to the app-level sync endpoint `/api/admin/users`

Important notes:

- The wrapper is best for operations and inspection, not for app runtime queries
- Foreign tables do not use RLS the way normal app tables do, so keep the schema private
- The credential stored in Vault must be rotated if you use a short-lived Auth0 Management token

Basic flow:

1. Open Supabase SQL Editor
2. Paste the SQL from `supabase/sql/auth0-wrapper.sql`
3. Replace the placeholders:
   - `<AUTH0_MANAGEMENT_TOKEN>`
   - `<AUTH0_USERS_ENDPOINT>`
   - `<AUTH0_VAULT_KEY_ID>`
4. Run the script
5. Query:

```sql
select user_id, email, name, last_login
from auth0.auth0_users
order by last_login desc nulls last
limit 50;
```

## 8. What this does not replace

This change only moves the database backend to Supabase Postgres.

It does not replace:

- Auth0 authentication
- Cloudinary asset storage
- Stripe or PayPal billing
- OpenAI image generation
