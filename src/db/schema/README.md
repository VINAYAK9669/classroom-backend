# Better Auth + Drizzle (Postgres) Schema Notes

This folder contains the Better Auth schema for the Drizzle Postgres adapter:

- `auth.ts`

It defines these required Better Auth tables with singular names:

- `user`
- `session`
- `account`
- `verification`

## Why these tables exist

- `user`: core identity record.
- `session`: active login sessions (token, expiry, client metadata).
- `account`: provider account linkage (credential/local or OAuth provider IDs/tokens).
- `verification`: short-lived verification records (email verification, OTP/reset flows depending on setup).

## Custom fields added to `user`

Only two app-specific fields were added:

- `role`: enum `student | teacher | admin`, default `student`, not null.
- `imageCldPubId`: nullable text.

Everything else stays aligned to Better Auth expectations for Drizzle + Postgres.

## Table relationships

- `session.userId -> user.id` (`onDelete: cascade`)
- `account.userId -> user.id` (`onDelete: cascade`)

Drizzle `relations(...)` are defined for:

- `userRelations`: `sessions`, `accounts`
- `sessionRelations`: `user`
- `accountRelations`: `user`

## Indexes and uniques

Configured for expected auth access patterns:

- `user_email_unique` on `user.email`
- `session_token_unique` on `session.token`
- `session_user_id_idx` on `session.user_id`
- `account_provider_id_account_id_unique` on (`account.provider_id`, `account.account_id`)
- `account_user_id_idx` on `account.user_id`
- `verification_identifier_idx` on `verification.identifier`
- `verification_value_unique` on `verification.value`

## Timestamp behavior

All tables include:

- `created_at` default now
- `updated_at` default now + Drizzle `$onUpdate(() => new Date())`

This matches your project timestamp style.

## Runtime auth flow (high level)

1. User signs up/signs in.
2. Better Auth creates/reads `user`.
3. Better Auth creates/updates `account` (provider link/credentials).
4. Better Auth creates `session` with token + expiry.
5. On authenticated requests, session token is validated from `session`, then linked to `user`.
6. Verification flows store and validate records via `verification`.

## Important project note

Your repo currently has two schema directories:

- `src/db/schema.ts/` (existing app schema files)
- `src/db/schema/` (new Better Auth schema)

If you want both app + auth tables in one Drizzle export surface, ensure your DB barrel exports include both locations (or move them into one consistent folder).
