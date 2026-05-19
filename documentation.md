# College Intelligence Platform

A platform where verified seniors share insider college knowledge — scholarship deadlines, faculty preferences, hidden recruiting pipelines, and unspoken department norms — with first-generation students who've never had access to the invisible curriculum.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/college-intel run dev` — run the frontend (port 25885)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (already provisioned)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, framer-motion (heavy animations), recharts, wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/` — DB schema (users.ts, tips.ts, notifications.ts)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/lib/serialize.ts` — Date serializer (Date → ISO string for Zod)
- `artifacts/college-intel/src/` — React frontend

## Architecture decisions

- Date serialization: Drizzle returns `Date` objects but generated Zod schemas expect `string` — use `serializeDates()` helper before all `.parse()` calls in route handlers.
- Tips/trending/urgent routes declared before `/tips/:id` to avoid Express param shadowing.
- Verification is lightweight (increment counter) — no separate verifications table for simplicity.
- Seed data represents real IPU/DTU college intel scenarios for demo realism.

## Product

- **Intel Feed** — live, filterable feed of tips by college/branch/category/urgency with staggered animations
- **Tip Detail** — full tip with peer verification action and credibility scoring
- **Submit Intel** — senior tip submission form (category, urgency, deadline, tags)
- **Dashboard** — stats overview with animated counters and category breakdown chart
- **Alerts** — notification center with read/unread state management
- **Profile** — user credibility score and submitted intel history

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after editing `openapi.yaml`
- Use `serializeDates()` from `artifacts/api-server/src/lib/serialize.ts` before all Zod `.parse()` calls — Drizzle returns `Date` objects, Zod expects strings
- Do NOT add `/tips/trending` or `/tips/urgent` after `/tips/:id` — Express matches params first

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
